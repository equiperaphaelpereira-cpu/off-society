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

  /* ---------------------------------------------------------------- resultado: 5 hábitos */
  function compute(a) {
    var habits = [
      { t: 'Seguir dicas da internet',
        s: (a.entry === 'dica' || a.entry === 'influencer') ? 'detected' : 'ok',
        x: 'Na internet, quando alguém te dá uma dica, milhares de pessoas estão fazendo a mesma coisa. Quando todo mundo faz igual, todo mundo perde junto.' },
      { t: 'Acreditar em print de lucro rápido',
        s: a.print === 'muito' ? 'detected' : a.print === 'algumas' ? 'risk' : 'ok',
        x: 'Print só mostra o dia bom. Quem toma decisão baseada no que os outros mostram acaba caindo em armadilhas e se frustrando.' },
      { t: 'Tentar aprender na tentativa e erro',
        s: (a.entry === 'sozinho' || a.know === 'tentei') ? 'detected' : 'ok',
        x: 'Aprender sozinho custa caro. Foi assim que o Naio perdeu mais de R$ 20 mil no começo, por não ter a quem perguntar.' },
      { t: 'Arriscar dinheiro que faz falta',
        s: (a.capital === 'reserva' || a.capital === 'emprestimo') ? 'detected' : a.capital === 'naosei' ? 'risk' : 'ok',
        x: 'Dinheiro para contas não se arrisca. O jeito certo é começar num ambiente de treino, sem colocar um centavo de verdade.' },
      { t: 'Querer resultado pra ontem',
        s: a.why === 'renda' ? ((a.time === '30' || a.time === '60') ? 'detected' : 'risk') : 'ok',
        x: 'Quem tem pressa pula etapas importantes e acaba perdendo o que tem. O primeiro objetivo é sempre aprender, não ganhar.' }
    ];
    var n = habits.filter(function (h) { return h.s === 'detected'; }).length;
    var key = a.know === 'tentei' ? 'recomeco' : n >= 3 ? 'manada' : n >= 1 ? 'atencao' : 'comeco';
    var level = n >= 3 ? 'Risco alto' : n >= 1 ? 'Risco moderado' : 'Risco baixo';
    var h = n === 0
      ? 'Você não tem nenhum dos 5 hábitos <span class="soft">de quem perde dinheiro.</span>'
      : 'Você tem ' + n + ' dos 5 hábitos <span class="soft">de quem perde dinheiro no mercado.</span>';
    var P = {
      recomeco: { name: 'Recomeço',
        p: 'Você já tentou antes e não deu certo. <b>Isso significa que você está repetindo os mesmos erros que fazem a maioria perder.</b> Se ninguém te mostrar o que está errado, vai continuar perdendo. O Naio já esteve exatamente onde você está agora.' },
      manada: { name: 'Efeito Manada',
        p: 'Segundo reguladores europeus, <b>de 74% a 89% das pessoas comuns perdem dinheiro</b> operando do jeito que você começaria. Pelas suas respostas, você cairia nas mesmas armadilhas que todo mundo. <b>Se não mudar agora, vai ser mais um número nessa estatística.</b>' },
      atencao: { name: 'Zona de Atenção',
        p: 'Você já evita parte dos erros, mas <b>' + (n === 1 ? 'um hábito ainda te coloca' : 'alguns hábitos ainda te colocam') + ' no mesmo caminho de quem perde tudo.</b> O problema é que você nem percebe. Se não corrigir isso antes de colocar dinheiro de verdade, o prejuízo vem.' },
      comeco: { name: 'Começo Certo',
        p: 'Você tem o instinto certo, mas <b>instinto sozinho não basta.</b> Sem método e sem alguém do lado, até quem pensa certo acaba cometendo os mesmos erros. O Naio perdeu R$ 20 mil exatamente assim.' }
    }[key];
    return { score: n, n: n, key: key, level: level, name: P.name, h: h, p: P.p, traps: habits };
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
    O.state.set({ answers: answers, score: r.n, profile: { key: r.key, name: r.name, level: r.level }, quizDoneAt: Date.now() });
    O.sb.lead({ stage: 'quiz_completed', answers: answers, score: r.n, profile: r.name });
    O.sb.event('quiz_complete', null, { habits: r.n, profile: r.key });
    O.track('QuizComplete', { habits: r.n, profile: r.key });
    renderAnalysis(r);
  }

  function renderAnalysis(r) {
    phase('analysis', 'Analisando');
    var steps = ['Entendendo o seu momento', 'Vendo como você começaria', 'Comparando com os hábitos de quem perde dinheiro', 'Montando o seu resultado'];
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
        '<h2 class="hx cap-h" tabindex="-1" data-focus>Seu resultado <span class="acc">está pronto.</span></h2>' +
        '<p class="cap-p">Deixe seu contato para ver quantos dos 5 hábitos de quem perde dinheiro você tem. É por ele que avisamos quando a porta da Off Society abrir ou fechar.</p>' +
        '<form class="cap-form" novalidate>' +
          '<label class="field" data-f="name"><span>Primeiro nome</span><input name="name" autocomplete="given-name" placeholder="Como você quer ser chamado" value="' + esc(s.name || '') + '" required><em class="err-msg">Digite seu nome.</em></label>' +
          '<label class="field" data-f="whatsapp"><span>WhatsApp com DDD' + (lc.requireWhatsapp === false ? ' (opcional)' : '') + '</span><input name="whatsapp" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="(11) 91234-5678" value="' + esc(s.whatsapp || '') + '"><em class="err-msg">Confira o número com DDD.</em></label>' +
          '<label class="field" data-f="email"><span>E-mail' + (lc.emailRequired ? '' : ' (opcional)') + '</span><input name="email" type="email" inputmode="email" autocomplete="email" placeholder="voce@email.com" value="' + esc(s.email || '') + '"><em class="err-msg">Confira o e-mail.</em></label>' +
          '<button class="btn btn-dark btn-xl btn-block" type="submit">Ver meu resultado ' + I.next + '</button>' +
          '<p class="cap-legal">Seus dados ficam só com a Off Society. Nada de spam, e você pode pedir a exclusão quando quiser.</p>' +
        '</form>' +
        '<div class="cap-blur" aria-hidden="true"><b class="tnum">' + r.n + '/5</b><span>hábitos de quem perde · <b style="filter:blur(5px)">' + esc(r.level) + '</b></span></div>' +
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
      O.state.set({ name: name, whatsapp: wa ? maskPhone(wa) : '', email: email });
      O.sb.lead({ stage: 'lead_captured', name: name, whatsapp: wa ? '+55' + wa : '', email: email, answers: answers, score: r.n, profile: r.name });
      O.sb.event('lead_captured');
      O.track('Lead', { content_name: 'Diagnóstico', profile: r.key });
      renderResult(r);
    });
  }

  /* ---------------------------------------------------------------- resultado */
  function renderResult(r) {
    phase('result', 'Seu resultado');
    var name = O.firstName(O.state.get().name);
    var lbl = { detected: '⚠ Detectado', risk: 'Atenção', ok: 'Seguro' };
    var AUD = window.OFF_AUDIOS || {};
    var aud = Object.keys(AUD).some(function (k) { return !!AUD[k].src; });
    // arco dividido em 5 segmentos (um por hábito)
    var R = 170, segs = '', gap = 0.035;
    for (var s = 0; s < 5; s++) {
      var a0 = Math.PI - (s / 5) * Math.PI - (s ? gap : 0) * 0.5, a1 = Math.PI - ((s + 1) / 5) * Math.PI + (s < 4 ? gap : 0) * 0.5;
      var x0 = 200 + R * Math.cos(a0), y0 = 200 - R * Math.sin(a0), x1 = 200 + R * Math.cos(a1), y1 = 200 - R * Math.sin(a1);
      segs += '<path class="g-seg" data-i="' + s + '" d="M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A' + R + ' ' + R + ' 0 0 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + '"/>';
    }
    var rows = r.traps.map(function (t, k) {
      return '<li class="row"><button class="row-h trap" type="button" aria-expanded="false">' +
        '<span class="idx">' + pad(k + 1) + '</span>' +
        '<span class="row-t"><small>Hábito ' + pad(k + 1) + '</small><b>' + esc(t.t) + '</b></span>' +
        '<span class="trap-status ' + t.s + '">' + lbl[t.s] + '</span>' +
        '<span class="row-a">' + I.arrow + '</span></button>' +
        '<div class="row-b"><div><div class="row-in"><p>' + esc(t.x) + '</p></div></div></div></li>';
    }).join('');

    var warnIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>';
    var warnText = r.n >= 3
      ? 'Você está no caminho exato de quem perde tudo. Se não mudar isso agora, a estatística não vai perdoar.'
      : r.n >= 1
        ? 'Você está a poucos passos de cometer erros que custam caro. Quanto antes corrigir, melhor.'
        : '';

    var el = swap(
      '<div class="res">' +
        '<div class="res-top">' +
          '<div class="gauge g-habits" data-reveal>' +
            '<svg viewBox="0 0 400 220"><defs><filter id="gl"><feGaussianBlur stdDeviation="6"/></filter></defs>' +
              '<g class="g-bg">' + segs + '</g><g class="g-fill" filter="url(#gl)" opacity=".6">' + segs + '</g><g class="g-fill">' + segs + '</g>' +
            '</svg>' +
            '<div class="gauge-num"><b class="tnum"><span id="gNum">0</span><small class="gauge-pct">/5</small></b><span>hábitos de quem perde dinheiro</span></div>' +
          '</div>' +
          '<div data-reveal style="--d:.1s">' +
            '<span class="pill-live lvl-' + r.key + '"><i class="dot-live"></i>' + (name ? esc(name) + ' · ' : '') + '<b>' + esc(r.level) + '</b></span>' +
            '<h1 class="hx res-h" tabindex="-1" data-focus>' + r.h + '</h1>' +
            '<p class="res-p">' + r.p + '</p>' +
            (warnText ? '<div class="res-warn">' + warnIcon + '<span>' + warnText + '</span></div>' : '') +
          '</div>' +
        '</div>' +
        '<div class="res-sheet sheet" data-reveal style="--d:.2s">' +
          '<div class="res-sheet-h"><h2 class="hx h3">Os 5 hábitos de <span class="acc">quem perde dinheiro</span></h2><span class="meta">Toque em cada um</span></div>' +
          '<ul class="rows">' + rows + '</ul>' +
        '</div>' +
        '<div class="res-next" data-reveal style="--d:.3s">' +
          '<div class="res-av"><img src="assets/img/naio-avatar.webp" alt=""><i>' + (aud ? I.mic : I.msg) + '</i></div>' +
          '<div><b>O Naio quer falar com você sobre esse resultado.</b>' +
            '<span>Ele já passou por tudo isso e pode te mostrar o que está errado.</span></div>' +
          '<a class="btn btn-light btn-xl" href="' + O.withUtm('chat.html') + '" id="toChat">Falar com o Naio agora ' + I.next + '</a>' +
        '</div>' +
      '</div>');

    el.querySelectorAll('.row-h').forEach(function (b) {
      b.addEventListener('click', function () {
        var li = b.parentNode;
        var open = !li.classList.contains('is-open');
        li.classList.toggle('is-open', open);
        b.setAttribute('aria-expanded', open);
      });
    });
    var auto = Array.prototype.find.call(el.querySelectorAll('.row'), function (li) { return li.querySelector('.trap-status.detected'); }) || el.querySelector('.row');
    if (auto) setTimeout(function () { auto.querySelector('.row-h').click(); }, 1500);
    el.querySelector('#toChat').addEventListener('click', function () { O.sb.event('to_chat'); });

    // acende um segmento por hábito com delay dramático
    var num = el.querySelector('#gNum');
    var fills = el.querySelectorAll('.g-fill .g-seg');
    var k = 0;
    function step() {
      if (k >= r.n) return;
      fills.forEach(function (p) { if (+p.getAttribute('data-i') === k) p.classList.add('on'); });
      k++;
      num.textContent = k;
      // vibração sutil no número ao incrementar
      num.style.transform = 'scale(1.15)';
      setTimeout(function () { num.style.transform = ''; }, 200);
      setTimeout(step, O.reduceMotion ? 0 : 550);
    }
    setTimeout(step, 700);
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
