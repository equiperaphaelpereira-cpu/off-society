/* ==========================================================================
   OFF SOCIETY · CONFIGURAÇÃO DO FUNIL
   Tudo que muda sem mexer no código fica aqui.
   Itens marcados com DEFINIR dependem de decisão do Naio / time.
   ========================================================================== */
window.OFF_CONFIG = {
  brand: 'Off Society',
  expert: 'Naio Rezende',

  /* ---------- Oferta ---------- */
  price: {
    value: 97,                 // usado no pixel (InitiateCheckout)
    label: 'R$ 97',
    period: '/mês',            // DEFINIR: '/mês' se for recorrente · '' se for pagamento único
    periodLong: 'por mês',     // DEFINIR: 'por mês' · 'pagamento único'
    accessNote: '',            // ex.: '12 meses de acesso' (se for pagamento único)
    showPerDay: true           // mostra "≈ R$ 3,23 por dia" (só faz sentido se for mensal)
  },
  guaranteeDays: 7,            // 7 (CDC) ou 14 para cobrir duas semanas de Sala Off

  /* Se existir afiliação com corretora/exchange, patrocínio ou produto mais caro
     planejado, troque para true: o funil passa a usar o argumento de preço da
     seção 4.8 do documento mestre e deixa de dizer "o preço é simbólico". */
  hasOtherRevenue: false,

  /* ---------- Checkout ---------- */
  checkout: {
    url: '',                   // DEFINIR: link do checkout (Hotmart, Kiwify, Eduzz, Stripe...)
    // Nomes dos parâmetros de pré-preenchimento aceitos pela sua plataforma.
    // Hotmart: name / email / phonenumber · Kiwify: name / email / phone
    params: { name: 'name', email: 'email', phone: 'phone' },
    passUtm: true,             // repassa utm_*, fbclid, src, sck para o checkout
    sessionParam: 'sck'        // manda o id da sessão (cruza lead x venda). '' para desligar
  },

  /* ---------- Janela de entrada ----------
     Com data definida, o funil mostra contagem regressiva real até o fechamento.
     Sem data (null), mostra só "Janela de entrada aberta". Nunca use data falsa. */
  entryWindow: {
    closesAt: null,            // ex.: '2026-09-20T23:59:00-03:00'
    openLabel: 'Janela de entrada aberta',
    closedMessage: 'A janela fechou. Entre na lista de espera para a próxima abertura.',
    waitlistUrl: ''            // link do grupo/lista de espera quando a janela fechar
  },

  /* ---------- Sala Off ---------- */
  salaOff: {
    schedule: 'de segunda a sexta',
    time: ''                   // DEFINIR: ex.: 'às 9h30 (horário de Brasília)'
  },

  /* ---------- Vídeos (opcionais) ----------
     Aceita link do YouTube, Vimeo ou arquivo .mp4.
     vsl vazio  -> a página final mostra a animação "Protocolo Cascata em 30s".
     salaOff    -> trecho real de uma live (aparece na seção Sala Off e no chat). */
  videos: {
    vsl: '',
    vslPoster: 'assets/img/naio-stage-blue.webp',
    salaOff: '',
    salaOffPoster: 'assets/img/naio-portrait-blue.webp'
  },

  /* Áudios do chat: roteiros e arquivos ficam em assets/js/audios.js.
     Sem arquivo, cada fala aparece como mensagem de texto. */

  /* ---------- Chat ---------- */
  chat: {
    speed: 1,                  // 1 = ritmo humano · 0.5 = mais rápido · 1.5 = mais lento
    avatar: 'assets/img/naio-avatar.webp'
  },

  /* ---------- Captura ---------- */
  lead: {
    requireWhatsapp: true,
    emailRequired: false
  },

  /* ---------- Supabase (leads e eventos) ----------
     Chave publicável: pode ficar no front. Ela só consegue chamar as funções
     upsert_lead e log_event; não lê nenhum lead. */
  supabase: {
    url: 'https://gxawzjmycjjpnpbhothl.supabase.co',
    key: 'sb_publishable_J7MFkB52_WrVTvs0I9tngw_B1RWNjeW'
  },

  /* ---------- Rastreamento ---------- */
  pixel: {
    meta: ''                   // DEFINIR: ID do Pixel da Meta
  },

  /* ---------- Links ---------- */
  links: {
    instagram: '',             // ex.: 'https://instagram.com/naiorezende'
    privacy: '',
    terms: ''
  }
};
