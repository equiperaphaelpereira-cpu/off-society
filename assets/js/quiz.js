/* ==========================================================================
   ETAPA 1 · QUIZ — Diagnóstico gratuito (público leigo)
   8 perguntas simples → 3 telas educativas → análise → captura → resultado
   Resultado: quantos dos 5 hábitos de quem perde dinheiro a pessoa tem.
   ========================================================================== */
(function () {
  'use strict';
  var O = window.OFF, C = O.C, esc = O.esc;

  var I = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 7l10 10M17 8.5V17H8.5"/></svg>',
    next: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 118 0v3"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 15a3 3 0 003-3V6a3 3 0 10-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 006 6.92V21h2v-2.08A7 7 0 0019 12h-2z"/></svg>',
    msg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 4h14a2 2 0 012 2v9a2 2 0 01-2 2H10l-5 4v-4a2 2 0 01-2-2V6a2 2 0 012-2z"/></svg>',
    dots: '<svg class="dots3" viewBox="0 0 16 12" fill="currentColor"><circle cx="3" cy="9" r="1.6"/><circle cx="8" cy="3" r="1.6"/><circle cx="13" cy="9" r="1.6"/></svg>'
  };

  /* ---------------------------------------------------------------- perguntas */
  var Q = [
    { id: 'know', title: 'O quanto você conhece sobre <em>fazer dinheiro online</em> hoje?',
      sub: 'Sem vergonha: a maioria das pessoas que faz esse diagnóstico está começando do zero.',
      options: [
        { v: 'nada', l: 'Nada, sou totalmente iniciante' },
        { v: 'ouvi', l: 'Já ouvi falar de mercado e bitcoin, mas não entendo' },
        { v: 'tentei', l: 'Já tentei alguma coisa, mas não deu certo' },
        { v: 'opero', l: 'Já arrisquei algum dinheiro antes' }
      ] },
    { id: 'why', title: 'O que mais <em>te atrai</em> nesse mundo?',
      options: [
        { v: 'renda', l: 'Ter uma renda a mais no fim do mês' },
        { v: 'render', l: 'Fazer meu dinheiro render mais do que na poupança' },
        { v: 'dolar', l: 'Proteger meu dinheiro em dólar' },
        { v: 'aprender', l: 'Aprender uma habilidade nova' }
      ] },
    { id: 'print', title: 'Você já viu alguém postando <em>print de lucro</em> nas redes?', insight: 'print',
      options: [
        { v: 'muito', l: 'Sim, toda hora' },
        { v: 'algumas', l: 'Algumas vezes' },
        { v: 'nunca', l: 'Nunca reparei' }
      ] },
    { id: 'entry', title: 'Se você fosse começar amanhã, <em>como faria?</em>', insight: 'crowd',
      options: [
        { v: 'dica', l: 'Seguiria a dica de algum amigo' },
        { v: 'influencer', l: 'Faria o que algum influenciador da internet mostrou' },
        { v: 'sozinho', l: 'Tentaria aprender sozinho pelo YouTube' },
        { v: 'alguem', l: 'Procuraria alguém de confiança pra me ensinar do zero' }
      ] },
    { id: 'fear', title: 'Qual é o seu <em>maior medo</em> de começar?', insight: 'fear',
      options: [
        { v: 'perder', l: 'Perder o dinheiro que eu colocar' },
        { v: 'golpe', l: 'Cair em golpe' },
        { v: 'entender', l: 'Não entender nada' },
        { v: 'tempo', l: 'Não ter tempo' }
      ] },
    { id: 'time', title: 'Quanto tempo por dia você teria <em>pra aprender?</em>',
      options: [
        { v: '30', l: 'Menos de 30 minutos' },
        { v: '60', l: 'De 30 minutos a 1 hora' },
        { v: '120', l: 'De 1 a 2 horas' },
        { v: '120+', l: 'Mais de 2 horas' }
      ] },
    { id: 'learn', title: 'Como você <em>aprende melhor?</em>',
      options: [
        { v: 'aovivo', l: 'Vendo alguém fazer, ao vivo' },
        { v: 'ritmo', l: 'Assistindo aulas no meu ritmo' },
        { v: 'duvida', l: 'Tirando dúvida direto com quem sabe' },
        { v: 'tudo', l: 'Um pouco de tudo' }
      ] },
    { id: 'capital', title: 'Se fosse começar, <em>com que dinheiro</em> seria?',
      sub: 'Resposta sincera. Ela muda o que o Naio vai te dizer.',
      options: [
        { v: 'pequeno', l: 'Um valor pequeno, que não me faria falta' },
        { v: 'naosei', l: 'Ainda não sei, quero aprender primeiro' },
        { v: 'reserva', l: 'Minha reserva de emergência' },
        { v: 'emprestimo', l: 'Empréstimo ou cartão de crédito' }
      ] }
  ];

  /* ---------------------------------------------------------------- insights */
  var INSIGHTS = {
    print: function (a) {
      return {
        kicker: 'O que ninguém te conta',
        word: 'Print não é resultado.',
        title: 'Quem posta print mostra o dia bom. O dia ruim ninguém posta.',
        you: a.print === 'muito'
          ? 'Você vê print de lucro toda hora. É assim que a maioria decide entrar.'
          : 'Repare nas próximas vezes: quase nunca aparece o dia em que a pessoa perdeu.',
        body: [
          'É assim que a maioria entra no mercado: vê um print, se empolga e entra do mesmo jeito que todo mundo, na mesma hora.',
          'Na Off Society, print de lucro não conta. O que conta é o diário, com os dias bons e os ruins.'
        ],
        src: 'Código da Off Society'
      };
    },
    crowd: function (a) {
      return {
        kicker: 'O efeito manada',
        num: '1,6', small: 'mi',
        title: 'de pessoas perderam dinheiro no mesmo dia, em 10 de outubro de 2025.',
        you: {
          dica: 'Seguir a dica de alguém é o jeito mais comum de começar. E o jeito mais comum de perder junto.',
          influencer: 'Um influenciador mostra o ganho e milhares de pessoas copiam na mesma hora. É assim que a manada se forma.',
          sozinho: 'Aprender sozinho foi o que o Naio fez. Custou mais de R$ 20 mil.',
          alguem: 'Procurar alguém de confiança é o melhor instinto que você pode ter.'
        }[a.entry],
        body: [
          'Elas não perderam por azar. Estavam fazendo a mesma coisa, na mesma hora. Quando o preço começou a cair, todo mundo quis sair ao mesmo tempo, e um empurrou o outro, como peças de dominó.',
          'O Naio chama esse dominó de <em>cascata</em>. E ensina a nunca estar no meio da fileira.'
        ],
        src: 'Coinglass via Livecoins e Exame (out/2025)'
      };
    },
    fear: function (a) {
      var m = {
        golpe: { word: 'Seu dinheiro fica com você.', title: 'Ninguém da Off Society pede para você depositar dinheiro.',
          body: ['Você paga a comunidade e aprende. Se um dia quiser operar, opera na sua própria conta, numa corretora que você mesmo aprende a verificar.',
            'Ninguém promete rendimento. E não é pirâmide: você não precisa trazer ninguém.'] },
        perder: { word: 'Modo treino primeiro.', title: 'Todo mundo começa com dinheiro de mentira.',
          body: ['É igual videogame: você começa no modo treino. A conta funciona igual à de verdade, mas sem arriscar um real.',
            'Só passa para o dinheiro real quando o seu diário mostrar que você está pronto, e com valor pequeno.'] },
        entender: { word: 'Do zero. Sem palavra difícil.', title: 'O curso começa pelo começo de verdade.',
          body: ['O que é dólar, o que é bitcoin, como funciona uma corretora e como abrir a conta com segurança.',
            'E se travar em alguma coisa, todo meet fechado termina com um bloco de perguntas com o Naio.'] },
        tempo: { word: 'No seu ritmo.', title: 'As aulas ficam disponíveis para você assistir quando puder.',
          body: ['E o meet fechado acontece ao vivo, de segunda a sexta, com o Naio operando e explicando cada decisão.',
            'Dá pra começar com pouco tempo por dia. O que importa é a constância.'] }
      }[a.fear] || {};
      return { kicker: 'Sobre o seu medo', word: m.word, title: m.title, body: m.body || [], src: 'Regras da Off Society' };
    }
  };

  /* ---------------------------------------------------------------- resultado: nível de preparo */
  // As 5 peças que separam quem entra preparado de quem perde. Quem nunca operou
  // não tem método nem proteção, então o preparo fica baixo mesmo com respostas "certas".
  function compute(a) {
    var pieces = [
      { tag: 'Peça 01', t: 'Entender como o mercado funciona',
        pts: { nada: 0, ouvi: 4, tentei: 8, opero: 12 }[a.know] || 0,
        why: 'Sem entender o básico, qualquer notícia ou print vira motivo para entrar no susto.',
        fix: 'Curso do zero absoluto: o que é dólar, o que é bitcoin e como funciona uma corretora.' },
      { tag: 'Peça 02', t: 'Um método com regras claras',
        pts: a.know === 'opero' ? 4 : 0,
        why: 'Sem regra, cada decisão é um chute. E chute no mercado costuma sair caro.',
        fix: 'O Protocolo Cascata: 4 passos, sempre na mesma ordem, antes de qualquer operação.' },
      { tag: 'Peça 03', t: 'Alguém experiente do seu lado',
        pts: a.entry === 'alguem' ? 6 : 0,
        why: (a.entry === 'dica' || a.entry === 'influencer')
          ? 'Dica de amigo ou de influenciador não é acompanhamento. Quando o preço vira, você está sozinho.'
          : 'Foi a peça que faltou para o Naio quando ele perdeu mais de R$ 20 mil.',
        fix: 'Meet fechado ao vivo com o Naio, de segunda a sexta, com perguntas no final.' },
      { tag: 'Peça 04', t: 'Treinar sem arriscar dinheiro',
        pts: { pequeno: 8, naosei: 6 }[a.capital] || 0,
        why: (a.capital === 'reserva' || a.capital === 'emprestimo')
          ? 'Você pensa em começar com dinheiro que faz falta. É o jeito mais rápido de transformar um erro de iniciante em um problema de verdade.'
          : 'Quem começa direto com dinheiro de verdade paga o aprendizado com o próprio bolso.',
        fix: 'Modo treino: você opera com dinheiro de mentira até o seu diário mostrar que está pronto.' },
      { tag: 'Peça 05', t: 'Saber quanto aceita perder',
        pts: ({ aprender: 4, dolar: 4, render: 2 }[a.why] || 0) + (a.capital === 'pequeno' ? 2 : 0),
        why: a.why === 'renda'
          ? 'Quem entra pensando em renda rápida costuma arriscar mais do que pode.'
          : 'Sem um limite definido antes de entrar, um único dia ruim apaga semanas de esforço.',
        fix: 'Blindagem: o limite de perda é decidido antes de cada operação. Capacete antes da bicicleta.' }
    ];
    var raw = pieces.reduce(function (s, x) { return s + x.pts; }, 0);
    var prep = Math.max(7, Math.min(38, Math.round(raw * 1.25 + 6)));
    var missing = pieces.filter(function (x) { return x.pts === 0; }).length;
    var level = prep < 15 ? 'Risco crítico' : prep < 25 ? 'Risco alto' : 'Risco moderado';
    return {
      score: prep, n: prep, vuln: prep, prep: prep, missing: missing,
      key: prep < 15 ? 'critico' : prep < 25 ? 'alto' : 'moderado',
      level: level, name: level,
      h: 'Hoje você está só <span class="soft">' + prep + '% preparado</span> para entrar no mercado.',
      p: 'Segundo reguladores europeus, <b>de 74% a 89% das pessoas comuns perdem dinheiro</b> operando sem preparo. Com ' + prep + '% de preparo, você começaria do mesmo jeito que elas. Os ' + (100 - prep) + '% que faltam estão nas 5 peças abaixo.',
      pieces: pieces
    };
  }

  /* ---------------------------------------------------------------- palco */
  var stage = document.getElementById('stage');
  var current = document.getElementById('intro');
  var progress = document.getElementById('progress');
  var fill = document.getElementById('progressFill');
  var plabel = document.getElementById('progressLabel');
  var barMeta = document.getElementById('barMeta');

  var answers = {};
  var qi = 0;
  var locked = false;

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function phase(p, meta) {
    document.body.setAttribute('data-phase', p);
    if (meta) barMeta.textContent = meta;
    progress.hidden = p !== 'question' && p !== 'insight';
  }

  function swap(html, opts) {
    opts = opts || {};
    var el = document.createElement('section');
    el.className = 'screen is-entering' + (opts.back ? ' back' : '');
    el.innerHTML = html;
    var old = current;
    if (old) {
      old.classList.toggle('back', !!opts.back);
      old.classList.remove('is-active');
      old.classList.add('is-leaving');
      setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 450);
    }
    stage.appendChild(el);
    void el.offsetWidth;
    requestAnimationFrame(function () {
      el.classList.remove('is-entering');
      el.classList.add('is-active');
      setTimeout(function () { el.classList.remove('back'); }, 700);
    });
    current = el;
    window.scrollTo(0, 0);
    O.reveal(el);
    var h = el.querySelector('[data-focus]');
    if (h) { try { h.focus({ preventScroll: true }); } catch (e) {} }
    return el;
  }

  function setProgress(i) {
    fill.style.width = Math.round(((i + 1) / Q.length) * 100) + '%';
    plabel.textContent = pad(i + 1) + ' / ' + pad(Q.length);
  }

  /* ---------------------------------------------------------------- pergunta */
  function renderQuestion(i, back) {
    qi = i;
    locked = false;
    var q = Q[i];
    phase('question', 'Pergunta ' + pad(i + 1));
    setProgress(i);
    var opts = q.options.map(function (o, k) {
      var sel = answers[q.id] === o.v ? ' is-sel' : '';
      return '<li><button class="opt' + sel + '" type="button" data-v="' + esc(o.v) + '">' +
        '<span class="idx">' + pad(k + 1) + '</span>' +
        '<span class="opt-t"><b>' + esc(o.l) + '</b>' + (o.d ? '<small>' + esc(o.d) + '</small>' : '') + '</span>' +
        '<span class="opt-a">' + I.arrow + '</span></button></li>';
    }).join('');
    var el = swap(
      '<div class="q-wrap"><div class="q-card sheet">' +
        '<div class="q-top">' +
          (i > 0 ? '<button class="q-back" type="button" data-back>' + I.back + 'Voltar</button>' : '<span class="meta">Diagnóstico gratuito</span>') +
          '<span class="meta tnum">' + pad(i + 1) + ' de ' + pad(Q.length) + '</span>' +
        '</div>' +
        '<h2 class="hx q-title" tabindex="-1" data-focus>' + q.title + '</h2>' +
        (q.sub ? '<p class="q-sub">' + esc(q.sub) + '</p>' : '<div style="height:12px"></div>') +
        '<ul class="opts" role="list">' + opts + '</ul>' +
      '</div></div>', { back: back });

    el.querySelectorAll('.opt').forEach(function (b) {
      b.addEventListener('click', function () { choose(q, b); });
    });
    var bk = el.querySelector('[data-back]');
    if (bk) bk.addEventListener('click', function () { renderQuestion(i - 1, true); });
  }

  function choose(q, btn) {
    if (locked) return;
    locked = true;
    current.querySelectorAll('.opt').forEach(function (b) { b.classList.toggle('is-sel', b === btn); });
    answers[q.id] = btn.getAttribute('data-v');
    O.sb.event('quiz_answer', q.id, { v: answers[q.id] });
    setTimeout(function () {
      if (q.insight) renderInsight(q.insight);
      else advance();
    }, 420);
  }

  function advance() {
    if (qi < Q.length - 1) renderQuestion(qi + 1);
    else finishQuiz();
  }

  /* ---------------------------------------------------------------- insight */
  function renderInsight(key) {
    var d = INSIGHTS[key](answers);
    phase('insight', 'Vale saber');
    var big = d.word
      ? '<div class="dx ins-num ins-word">' + esc(d.word) + '</div>'
      : '<div class="dx ins-num tnum">' + esc(d.num) + '<small>' + esc(d.small) + '</small></div>';
    var el = swap(
      '<div class="ins"><div class="ins-card glass">' +
        '<div class="ins-kicker">' + I.dots + '<span class="meta">' + esc(d.kicker) + '</span></div>' +
        '<div class="ins-grid">' +
          '<div>' + big + '</div>' +
          '<div>' +
            '<h2 class="hx ins-title" tabindex="-1" data-focus>' + esc(d.title) + '</h2>' +
            (d.you ? '<p class="ins-you">' + esc(d.you) + '</p>' : '') +
            '<div class="ins-body">' + d.body.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="ins-foot">' +
          '<span class="meta ins-src">' + esc(d.src) + '</span>' +
          '<button class="btn btn-light" type="button" data-next>Continuar ' + I.next + '</button>' +
        '</div>' +
      '</div></div>');
    el.querySelector('[data-next]').addEventListener('click', advance);
  }

  /* ---------------------------------------------------------------- análise */
  function finishQuiz() {
    var r = compute(answers);
    O.state.set({ answers: answers, score: r.vuln, profile: { key: r.key, name: r.name, level: r.level }, quizDoneAt: Date.now() });
    O.sb.lead({ stage: 'quiz_completed', answers: answers, score: r.vuln, profile: r.name });
    O.sb.event('quiz_complete', null, { vuln: r.vuln, profile: r.key });
    O.track('QuizComplete', { vuln: r.vuln, profile: r.key });
    renderAnalysis(r);
  }

  function renderAnalysis(r) {
    phase('analysis', 'Analisando');
    var steps = [
      'Entendendo o seu momento',
      'Vendo como você começaria',
      'Conferindo as 5 peças de quem entra preparado',
      'Calculando o seu nível de preparo'
    ];
    var el = swap(
      '<div class="an">' +
        '<div class="an-orbit"><svg viewBox="0 0 150 150" fill="none"><circle cx="75" cy="75" r="68" stroke="rgba(255,255,255,.12)" stroke-width="1"/><path d="M75 7a68 68 0 0 1 68 68" stroke="url(#ag)" stroke-width="2" stroke-linecap="round"/><circle cx="143" cy="75" r="5" fill="#fff"/><circle cx="27" cy="27" r="3.5" stroke="#B9BCF4" stroke-width="1.4"/><defs><linearGradient id="ag" x1="75" y1="7" x2="143" y2="75"><stop stop-color="#B9BCF4" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient></defs></svg><b class="tnum" id="anPct">0%</b></div>' +
        '<h2 class="hx an-h" tabindex="-1" data-focus>Analisando suas respostas…</h2>' +
        '<ul class="an-list">' + steps.map(function (s) { return '<li><i>' + I.check + '</i>' + s + '</li>'; }).join('') + '</ul>' +
      '</div>');
    var lis = el.querySelectorAll('.an-list li');
    var pct = el.querySelector('#anPct');
    var total = O.reduceMotion ? 600 : 3400;
    var t0 = performance.now();
    (function loop(t) {
      var p = Math.min(1, (t - t0) / total);
      pct.textContent = Math.round(p * 100) + '%';
      lis.forEach(function (li, k) {
        var a = k / lis.length, b = (k + 1) / lis.length;
        li.classList.toggle('is-on', p >= a && p < b);
        li.classList.toggle('is-done', p >= b);
      });
      if (p < 1) requestAnimationFrame(loop);
      else setTimeout(function () { renderCapture(r); }, 350);
    })(t0);
  }

  /* ---------------------------------------------------------------- captura */
  function maskPhone(v) {
    v = v.replace(/\D/g, '').slice(0, 11);
    if (v.length <= 2) return v.length ? '(' + v : '';
    if (v.length <= 6) return '(' + v.slice(0, 2) + ') ' + v.slice(2);
    if (v.length <= 10) return '(' + v.slice(0, 2) + ') ' + v.slice(2, 6) + '-' + v.slice(6);
    return '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
  }

  function renderCapture(r) {
    phase('capture', 'Quase lá');
    var s = O.state.get();
    var lc = C.lead || {};
    var el = swap(
      '<div class="cap"><div class="cap-card sheet">' +
        '<span class="cap-badge">' + I.lock + 'Resultado pronto</span>' +
        '<h2 class="hx cap-h" tabindex="-1" data-focus>Seu nível de preparo <span class="acc">está calculado.</span></h2>' +
        '<p class="cap-p">Deixe seu contato para ver o quanto você está preparado para entrar no mercado e receber a mensagem do Naio sobre o seu resultado.</p>' +
        '<form class="cap-form" novalidate>' +
          '<label class="field" data-f="name"><span>Primeiro nome</span><input name="name" autocomplete="given-name" placeholder="Como você quer ser chamado" value="' + esc(s.name || '') + '" required><em class="err-msg">Digite seu nome.</em></label>' +
          '<label class="field" data-f="whatsapp"><span>WhatsApp com DDD' + (lc.requireWhatsapp === false ? ' (opcional)' : '') + '</span><input name="whatsapp" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="(11) 91234-5678" value="' + esc(s.whatsapp || '') + '"><em class="err-msg">Confira o número com DDD.</em></label>' +
          '<label class="field" data-f="email"><span>E-mail' + (lc.emailRequired ? '' : ' (opcional)') + '</span><input name="email" type="email" inputmode="email" autocomplete="email" placeholder="voce@email.com" value="' + esc(s.email || '') + '"><em class="err-msg">Confira o e-mail.</em></label>' +
          '<button class="btn btn-dark btn-xl btn-block" type="submit">Ver meu resultado ' + I.next + '</button>' +
          '<p class="cap-legal">Seus dados ficam protegidos com a Off Society. Nada de spam, e você pode solicitar a exclusão a qualquer momento.</p>' +
        '</form>' +
        '<div class="cap-blur" aria-hidden="true">' +
          '<b class="tnum">' + r.vuln + '%</b>' +
          '<span>Nível de preparo · <b style="filter:blur(5px); color:#FF4D5E">' + esc(r.level) + '</b></span>' +
        '</div>' +
      '</div></div>');

    var form = el.querySelector('form');
    var phone = form.whatsapp;
    phone.addEventListener('input', function () { phone.value = maskPhone(phone.value); });
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = form.name.value.trim();
      var wa = phone.value.replace(/\D/g, '');
      var email = form.email.value.trim();
      var ok = true;
      function flag(f, bad) { form.querySelector('[data-f="' + f + '"]').classList.toggle('err', bad); if (bad) ok = false; }
      flag('name', name.length < 2);
      flag('whatsapp', (lc.requireWhatsapp !== false || wa.length) ? !(wa.length === 10 || wa.length === 11) : false);
      flag('email', (lc.emailRequired || email.length) ? !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) : false);
      if (!ok) { var f = form.querySelector('.err input'); if (f) f.focus(); return; }
      O.state.set({ name: name, whatsapp: wa ? maskPhone(wa) : '', email: email, score: r.vuln });
      O.sb.lead({ stage: 'lead_captured', name: name, whatsapp: wa ? '+55' + wa : '', email: email, answers: answers, score: r.vuln, profile: r.name });
      O.sb.event('lead_captured');
      O.track('Lead', { content_name: 'Diagnóstico', profile: r.key });
      renderResult(r);
    });
  }

  /* ---------------------------------------------------------------- resultado: nível de preparo */
  function renderResult(r) {
    phase('result', 'Seu resultado');
    var name = O.firstName(O.state.get().name);
    var ARW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>';

    var cardsHtml = r.pieces.map(function (x, i) {
      var miss = x.pts === 0;
      return '<div class="orbit-audit-card">' +
        '<div class="orbit-audit-card-top"><span class="orbit-card-num">' + pad(i + 1) + '</span><span class="orbit-arrow-badge">' + ARW + '</span></div>' +
        '<div class="orbit-audit-tag-row"><span class="orbit-card-tag">' + esc(x.tag) + '</span>' +
          '<span class="orbit-card-status ' + (miss ? 'critical' : 'warning') + '">' + (miss ? 'Falta' : 'Incompleta') + '</span></div>' +
        '<h3 class="orbit-card-title">' + esc(x.t) + '</h3>' +
        '<p class="orbit-card-desc">' + esc(x.why) + '</p>' +
        '<p class="orbit-card-fix"><b>Na Off Society:</b> ' + esc(x.fix) + '</p>' +
      '</div>';
    }).join('');

    var w = C.entryWindow || {};
    var doorTxt = 'A Off Society abre em janelas. Fora delas, só lista de espera.';
    if (w.closesAt && !O.windowClosed()) {
      var d = new Date(w.closesAt);
      doorTxt = 'A janela atual fecha em ' + d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }) + '. Depois, só lista de espera.';
    }
    var complete = 5 - r.missing;

    var el = swap(
      '<div class="res orbit-res">' +
        '<div class="orbit-hero" data-reveal>' +
          '<div class="orbit-badge-pill"><span class="orbit-pulse-dot"></span>' +
            '<span>SEU RESULTADO' + (name ? ' · ' + esc(name).toUpperCase() : '') + ' · ' + esc(r.level).toUpperCase() + '</span></div>' +
          '<h1 class="hx res-h" tabindex="-1" data-focus>' + r.h + '</h1>' +
          '<p class="res-p">' + r.p + '</p>' +
        '</div>' +

        '<div class="orbit-laptop-grid" data-reveal style="--d:.15s">' +
          '<div class="orbit-metric-box alert-box">' +
            '<div class="orbit-metric-head"><span class="orbit-status-label">Seu nível de preparo</span><span class="orbit-dot-alert"></span></div>' +
            '<div class="orbit-num-wrap"><b class="orbit-huge-num tnum"><span id="vulnCounter">0</span><small class="pct">%</small></b></div>' +
            '<div class="orbit-metric-title">Preparado para entrar no mercado</div>' +
            '<p class="orbit-metric-desc">Calculado pelas 5 peças que separam quem se protege de quem perde. Pronto para começar é 100%.</p>' +
          '</div>' +
          '<div class="orbit-metric-box neutral-box">' +
            '<div class="orbit-metric-head"><span class="orbit-status-label">Quem entra sem preparo</span><span class="orbit-tag-micro">Reguladores</span></div>' +
            '<div class="orbit-num-wrap"><b class="orbit-huge-num tnum">74–89<small class="pct">%</small></b></div>' +
            '<div class="orbit-metric-title">Perdem dinheiro</div>' +
            '<p class="orbit-metric-desc">das contas de pessoas comuns em operações de risco, segundo reguladores europeus (ESMA).</p>' +
          '</div>' +
          '<div class="orbit-metric-box solution-box">' +
            '<div class="orbit-metric-head"><span class="orbit-status-label">Custo de aprender sozinho</span><span class="orbit-tag-micro accent">Naio</span></div>' +
            '<div class="orbit-num-wrap"><b class="orbit-huge-num tnum">R$ 20<small class="plus">k+</small></b></div>' +
            '<div class="orbit-metric-title">Perdidos pelo Naio</div>' +
            '<p class="orbit-metric-desc">O que ele pagou por começar sem método e sem ninguém do lado.</p>' +
          '</div>' +
        '</div>' +

        '<div class="urg" data-reveal style="--d:.2s">' +
          '<div class="urg-head"><span class="urg-kicker"><i></i>Por que resolver isso agora</span></div>' +
          '<div class="urg-grid">' +
            '<div class="urg-item"><b class="tnum">1,6 mi</b><h3>A próxima queda não avisa.</h3><p>Em 10 de outubro de 2025, 1,6 milhão de pessoas perderam dinheiro em 24 horas. Quem estava despreparado caiu junto.</p></div>' +
            '<div class="urg-item"><b class="tnum">R$ 505 bi</b><h3>A manada está crescendo.</h3><p>Foi o que brasileiros movimentaram em cripto em 2025, quase o dobro de 2023. Cada vez mais gente entra pela dica dos outros.</p></div>' +
            '<div class="urg-item"><b>Janela</b><h3>A porta abre poucas vezes.</h3><p>' + esc(doorTxt) + '</p></div>' +
          '</div>' +
        '</div>' +

        '<div class="sheet orbit-sheet" data-reveal style="--d:.25s">' +
          '<div class="orbit-sheet-header">' +
            '<div class="orbit-sheet-kicker">O QUE FALTA PARA VOCÊ CHEGAR A 100%</div>' +
            '<h2 class="hx h2 orbit-sheet-title">As 5 peças de quem <span class="acc">entra preparado</span></h2>' +
            '<p class="lead orbit-sheet-lead">' + (complete === 0
              ? 'Hoje faltam as 5. É normal para quem está começando, e é exatamente o que se resolve antes de colocar um real.'
              : 'Você tem ' + complete + ' de 5 peças encaminhadas, mas nenhuma completa. Veja o que falta e como a Off Society resolve cada uma.') + '</p>' +
          '</div>' +
          '<div class="orbit-audit-grid">' + cardsHtml + '</div>' +
        '</div>' +

        '<div class="orbit-expert-box" data-reveal style="--d:.35s">' +
          '<div class="orbit-expert-top">' +
            '<div class="orbit-expert-avatar-wrap">' +
              '<img src="assets/img/naio-avatar.webp" alt="Naio Rezende" class="orbit-avatar-img">' +
              '<span class="orbit-live-badge"><i class="orbit-pulse-mini"></i> 1 nova</span>' +
            '</div>' +
            '<div class="orbit-expert-meta">' +
              '<span class="orbit-expert-kicker">MENSAGEM DO NAIO</span>' +
              '<h3 class="orbit-expert-title">O Naio deixou um recado sobre o seu resultado.</h3>' +
              '<p class="orbit-expert-quote">Como sair de ' + r.prep + '% para pronto, começando no modo treino, com dinheiro de mentira. Do zero e sem palavra difícil.</p>' +
            '</div>' +
          '</div>' +
          '<div class="orbit-expert-action">' +
            '<a class="btn btn-light btn-xl orbit-action-btn" href="' + O.withUtm('chat.html') + '" id="toChat">' +
              '<span>Ver a mensagem do Naio</span>' +
              '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
            '</a>' +
            '<span class="orbit-action-micro">Mensagens protegidas · leva uns 5 minutos</span>' +
          '</div>' +
        '</div>' +
      '</div>');

    el.querySelector('#toChat').addEventListener('click', function () { O.sb.event('to_chat'); });

    // contagem do nível de preparo
    var counterEl = el.querySelector('#vulnCounter');
    var target = r.prep;
    var duration = O.reduceMotion ? 200 : 1600;
    var startT = performance.now();
    function animateCount(now) {
      var k = Math.min(1, (now - startT) / duration);
      if (counterEl) counterEl.textContent = Math.round((1 - Math.pow(1 - k, 3)) * target);
      if (k < 1) requestAnimationFrame(animateCount);
      else if (counterEl) { counterEl.textContent = target; counterEl.classList.add('is-final'); }
    }
    requestAnimationFrame(animateCount);
  }

  /* ---------------------------------------------------------------- início */
  function start() {
    answers = {};
    O.sb.lead({ stage: 'quiz_started' });
    O.sb.event('quiz_start');
    O.track('QuizStart');
    renderQuestion(0);
  }

  document.getElementById('startBtn').addEventListener('click', start);

  document.addEventListener('keydown', function (ev) {
    if (ev.target && /input|textarea/i.test(ev.target.tagName)) return;
    var n = parseInt(ev.key, 10);
    if (n >= 1 && n <= 4) {
      var b = current.querySelectorAll('.opt')[n - 1];
      if (b) b.click();
    } else if (ev.key === 'Enter') {
      var nx = current.querySelector('[data-next]');
      if (nx) nx.click();
    }
  });

  // ?etapa=pergunta|insight|captura|resultado para revisar o layout
  var preview = new URLSearchParams(location.search).get('etapa');
  if (preview) {
    answers = { know: 'ouvi', why: 'renda', print: 'muito', entry: 'dica', fear: 'golpe', time: '30', learn: 'aovivo', capital: 'naosei' };
    var r0 = compute(answers);
    if (preview === 'resultado') renderResult(r0);
    else if (preview === 'captura') renderCapture(r0);
    else if (preview === 'insight') { qi = 3; renderInsight('crowd'); }
    else if (preview === 'pergunta') renderQuestion(3);
  } else {
    // Inicia o quiz direto, sem tela intro
    start();
  }
})();
