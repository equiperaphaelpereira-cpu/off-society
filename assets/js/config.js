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
    period: '',                // pagamento único (se virar recorrente: '/mês')
    periodLong: 'pagamento único',
    accessNote: 'acesso vitalício',
    showPerDay: false          // "≈ R$ x por dia" só faz sentido em recorrência
  },

  /* ---------- Ancoragem (valor de referência de cada entregável) ----------
     VALIDAR: use como referência preços reais de cursos, mentorias ao vivo e
     comunidades equivalentes no mercado (seção 4.9 do documento mestre).
     A página mostra cada item, a soma e o preço de entrada. */
  valueStack: [
    { item: 'Curso completo, do zero ao avançado', value: 997 },
    { item: 'Meet fechado ao vivo, de segunda a sexta', value: 1497 },
    { item: 'Contato direto com o Naio', value: 497 },
    { item: 'Grupo fechado da sociedade', value: 297 },
    { item: 'Modo treino guiado (do dinheiro de mentira ao real)', value: 197 },
    { item: 'Ferramentas: calculadora, checklist, diário e mapa da semana', value: 197 },
    { item: 'Aula especial: o dia 10 de outubro de 2025', value: 97 }
  ],
  guaranteeDays: 7,            // 7 (CDC) ou 14 para cobrir duas semanas de Meet Fechado

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

  /* ---------- Meet fechado (lives) ---------- */
  salaOff: {
    schedule: 'de segunda a sexta',
    time: '3x por dia: às 9h, 15h e 20h',
    times: ['09:00', '15:00', '20:00'],
    structure: 'abertura, troca de ideia, 3 operações, dúvidas e encerramento',
    studentEarnings: 'de R$ 500 a R$ 1.000 por dia'
  },

  /* ---------- Vídeos (opcionais) ----------
     Aceita link do YouTube, Vimeo ou arquivo .mp4.
     vsl vazio  -> a página final mostra a animação "Protocolo Cascata em 30s".
     salaOff    -> trecho real de um meet fechado (aparece na página final e no chat). */
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
