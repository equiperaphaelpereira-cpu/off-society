# Off Society · Funil

Funil de 3 etapas para a Off Society (Naio Rezende · Protocolo Cascata):

| Etapa | Página | O que faz |
|---|---|---|
| 1 | `index.html` | **Diagnóstico Cascata** — quiz de 9 perguntas, 3 telas educativas com dados reais (Fed de NY, liquidações de out/2025), captura de nome/WhatsApp/e-mail e resultado com o Índice de Combustível (0–100) e as armadilhas detectadas. |
| 2 | `chat.html` | **Conversa com o Naio** — chat estilo WhatsApp, personalizado com as respostas do quiz: falas do Naio (áudio ou texto), vídeo "Protocolo Cascata em 30s", cards das 4 etapas, oferta, preço, garantia e menu de objeções. |
| 3 | `oferta.html` | **Página final antes do checkout** — hero, vídeo, manifesto, dados, Armadilha do Stop Óbvio, protocolo, história do Naio, entregáveis, Sala Off, calculadora de blindagem, níveis, código, preço, garantia, FAQ. |

Site 100% estático (HTML/CSS/JS puro, sem build). Funciona em Vercel, Netlify, GitHub Pages ou qualquer hospedagem.

## Rodar localmente

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

Atalhos de revisão:
- `index.html?etapa=pergunta` · `?etapa=insight` · `?etapa=captura` · `?etapa=resultado`
- `chat.html?rapido=1` — roda a conversa em ~6x a velocidade

## O que configurar antes de subir tráfego

Tudo em **`assets/js/config.js`**:

- `checkout.url` — link do checkout. Nome, e-mail, WhatsApp, UTMs e o id da sessão (`sck`) são repassados automaticamente. Ajuste `checkout.params` aos nomes da sua plataforma.
- `price.period` — **R$ 97 é mensal ou pagamento único?** Hoje está `/mês`. Se for único: `period: ''`, `periodLong: 'pagamento único'`, `accessNote: '12 meses de acesso'`, `showPerDay: false`.
- `hasOtherRevenue` — deixe `false` só se **não** houver afiliação com corretora/exchange, patrocínio ou upsell. Com `true`, o funil troca o argumento de preço (seção 4.8 do documento mestre).
- `entryWindow.closesAt` — data real de fechamento da janela. Liga a contagem regressiva no chat e na oferta e, depois da data, troca os botões por "lista de espera" (`waitlistUrl`).
- `salaOff.time` — horário da Sala Off.
- `pixel.meta` — ID do Pixel. Eventos: `PageView`, `QuizStart`, `QuizComplete`, `Lead`, `ChatStart`, `ChatComplete`, `ViewContent`, `InitiateCheckout` (também vão para `dataLayer` com prefixo `off_`).
- `videos.vsl` / `videos.salaOff` — opcionais (YouTube, Vimeo ou .mp4). Sem VSL, a página final mostra a animação do Protocolo Cascata.
- `links.instagram`, `links.privacy`, `links.terms`.

## Áudios do chat

Os roteiros estão em **`docs/ROTEIRO-AUDIOS.md`** (7 áudios, ~5 min no total). Enquanto os arquivos não chegam, cada fala aparece como mensagem de texto.

Quando o Naio gravar: salvar em `assets/audio/` e preencher o `src` de cada fala em `assets/js/audios.js`. A fala vira áudio com player, velocidade 1x/1,5x/2x e transcrição. Se mudar o texto, rode `node tools/gerar-roteiro-audios.mjs` para atualizar o roteiro.

## Leads (Supabase)

Projeto `off society`. Schema em `supabase/schema.sql` (já aplicado):

- `leads` — uma linha por sessão: nome, WhatsApp, e-mail, respostas, score, perfil, respostas do chat, UTMs, etapa (`quiz_started` → `quiz_completed` → `lead_captured` → `chat_started` → `chat_completed` → `offer_viewed` → `checkout_clicked`).
- `funnel_events` — cada clique relevante (respostas, áudios ouvidos, objeções, vídeo, scroll, checkout).
- `funnel_overview` — visão resumida por etapa (SQL Editor).

O site usa a chave **publicável**, que só consegue chamar `upsert_lead` e `log_event`. As tabelas têm RLS e ninguém consegue ler os leads pelo site.

Consultas úteis:

```sql
select * from funnel_overview;
select name, whatsapp, score, profile, stage, chat->>'historia' as pior_operacao, created_at
from leads order by created_at desc;
```

## Pendências do documento mestre que afetam o funil

- [ ] Confirmar com o Naio que ele opera por zonas de stop/liquidez (o mecanismo depende disso — seção 1.5)
- [ ] Mensal x pagamento único; afiliação/upsell; horário da Sala Off; data da janela
- [ ] Valor exato e período do resultado atual + comprovação (hoje o funil usa "múltiplos seis dígitos por mês" sempre acompanhado da frase de contexto)
- [ ] Critérios numéricos dos níveis Off Micro / Off Escala (hoje descritos sem número)
- [ ] Validação da Sala Off, do Código e dos textos com advogado de mercado de capitais
- [ ] Política de privacidade (LGPD) — o quiz coleta nome, WhatsApp e e-mail

## Estrutura

```
index.html · chat.html · oferta.html · 404.html
assets/css   base.css (design system) · quiz.css · chat.css · oferta.css
assets/js    config.js · core.js · quiz.js · chat.js · oferta.js · audios.js · cascade.js · media.js
assets/img   fotos tratadas (duotone azul), avatar, og-image, favicon
docs/        ROTEIRO-AUDIOS.md
supabase/    schema.sql
tools/       gerar-roteiro-audios.mjs
```
