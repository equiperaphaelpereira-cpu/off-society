-- OFF SOCIETY · captura de leads do funil (quiz -> chat -> oferta -> checkout)
-- Tabelas fechadas por RLS. O front só escreve via funções RPC (security definer),
-- então a chave pública do site não consegue ler nenhum lead.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id                   uuid primary key default gen_random_uuid(),
  session_id           text not null unique,
  name                 text,
  whatsapp             text,
  email                text,
  score                int,
  profile              text,
  answers              jsonb not null default '{}'::jsonb,
  chat                 jsonb not null default '{}'::jsonb,
  stage                text not null default 'quiz_started',
  utm                  jsonb not null default '{}'::jsonb,
  referrer             text,
  landing_url          text,
  user_agent           text,
  checkout_clicked_at  timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create table if not exists public.funnel_events (
  id          bigint generated always as identity primary key,
  session_id  text not null,
  event       text not null,
  step        text,
  payload     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists funnel_events_session_idx on public.funnel_events (session_id);
create index if not exists funnel_events_event_idx   on public.funnel_events (event, created_at desc);
create index if not exists leads_stage_idx           on public.leads (stage, created_at desc);

alter table public.leads         enable row level security;
alter table public.funnel_events enable row level security;
revoke all on public.leads, public.funnel_events from anon, authenticated;

-- Ordem das etapas: o lead nunca "volta" de etapa.
create or replace function public.funnel_stage_rank(p_stage text)
returns int language sql immutable as $$
  select coalesce(array_position(array[
    'quiz_started','quiz_completed','lead_captured','chat_started',
    'chat_completed','offer_viewed','checkout_clicked'
  ], p_stage), 0)
$$;

create or replace function public.upsert_lead(p_session_id text, p_data jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_score int;
begin
  if p_session_id is null or length(p_session_id) not between 16 and 64 then
    raise exception 'invalid session';
  end if;
  if p_data is null or pg_column_size(p_data) > 24000 then
    raise exception 'invalid payload';
  end if;

  if (p_data->>'score') ~ '^\d{1,3}$' then
    v_score := (p_data->>'score')::int;
  end if;

  insert into leads as l (
    session_id, name, whatsapp, email, score, profile, answers, chat, stage,
    utm, referrer, landing_url, user_agent, checkout_clicked_at
  ) values (
    p_session_id,
    nullif(left(p_data->>'name', 120), ''),
    nullif(left(p_data->>'whatsapp', 40), ''),
    nullif(left(lower(p_data->>'email'), 160), ''),
    v_score,
    nullif(left(p_data->>'profile', 60), ''),
    case when jsonb_typeof(p_data->'answers') = 'object' then p_data->'answers' else '{}'::jsonb end,
    case when jsonb_typeof(p_data->'chat')    = 'object' then p_data->'chat'    else '{}'::jsonb end,
    case when funnel_stage_rank(p_data->>'stage') > 0 then p_data->>'stage' else 'quiz_started' end,
    case when jsonb_typeof(p_data->'utm')     = 'object' then p_data->'utm'     else '{}'::jsonb end,
    left(p_data->>'referrer', 500),
    left(p_data->>'landing_url', 500),
    left(p_data->>'user_agent', 300),
    case when p_data->>'stage' = 'checkout_clicked' then now() end
  )
  on conflict (session_id) do update set
    name        = coalesce(excluded.name, l.name),
    whatsapp    = coalesce(excluded.whatsapp, l.whatsapp),
    email       = coalesce(excluded.email, l.email),
    score       = coalesce(excluded.score, l.score),
    profile     = coalesce(excluded.profile, l.profile),
    answers     = l.answers || excluded.answers,
    chat        = l.chat || excluded.chat,
    stage       = case when funnel_stage_rank(excluded.stage) > funnel_stage_rank(l.stage)
                       then excluded.stage else l.stage end,
    utm         = case when l.utm = '{}'::jsonb then excluded.utm else l.utm end,
    referrer    = coalesce(l.referrer, excluded.referrer),
    landing_url = coalesce(l.landing_url, excluded.landing_url),
    user_agent  = coalesce(l.user_agent, excluded.user_agent),
    checkout_clicked_at = coalesce(l.checkout_clicked_at, excluded.checkout_clicked_at),
    updated_at  = now();
end;
$$;

create or replace function public.log_event(p_session_id text, p_event text, p_step text default null, p_payload jsonb default '{}'::jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_session_id is null or length(p_session_id) not between 16 and 64 then
    raise exception 'invalid session';
  end if;
  if p_event is null or length(p_event) > 60 then
    raise exception 'invalid event';
  end if;
  insert into funnel_events (session_id, event, step, payload)
  values (
    p_session_id, p_event, left(p_step, 60),
    case when p_payload is not null and jsonb_typeof(p_payload) = 'object' and pg_column_size(p_payload) < 8000
         then p_payload else '{}'::jsonb end
  );
end;
$$;

revoke all on function public.upsert_lead(text, jsonb) from public;
revoke all on function public.log_event(text, text, text, jsonb) from public;
grant execute on function public.upsert_lead(text, jsonb) to anon, authenticated;
grant execute on function public.log_event(text, text, text, jsonb) to anon, authenticated;

-- Painel rápido (ver no SQL Editor do Supabase). Não fica exposto para a chave pública.
create or replace view public.funnel_overview with (security_invoker = true) as
select
  stage,
  count(*)                                   as leads,
  count(*) filter (where whatsapp is not null) as com_whatsapp,
  round(avg(score))                          as score_medio,
  max(updated_at)                            as ultimo
from public.leads
group by stage
order by public.funnel_stage_rank(stage);

revoke all on public.funnel_overview from anon, authenticated;
