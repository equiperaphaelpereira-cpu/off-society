/* ==========================================================================
   ETAPA 1 · QUIZ — Diagnóstico Cascata
   9 perguntas → 3 insights educativos → análise → captura → resultado
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
    { id: 'market', title: 'Qual mercado você opera <em>ou quer operar?</em>',
      sub: 'Cripto e forex seguem a mesma lógica de liquidez. O dólar conecta os dois.',
      options: [
        { v: 'cripto', l: 'Cripto', d: 'Bitcoin, altcoins, futuros perpétuos' },
        { v: 'forex', l: 'Forex', d: 'Pares de moedas: EUR/USD, GBP/USD…' },
        { v: 'ambos', l: 'Os dois', d: 'Cripto e forex' },
        { v: 'nenhum', l: 'Ainda não opero', d: 'Quero começar do jeito certo' }
      ] },
    { id: 'exp', title: 'Há quanto tempo você <em>opera?</em>',
      options: [
        { v: 'nunca', l: 'Nunca operei com dinheiro real' },
        { v: '0-6', l: 'Menos de 6 meses' },
        { v: '6-24', l: 'De 6 meses a 2 anos' },
        { v: '24+', l: 'Mais de 2 anos' }
      ] },
    { id: 'loss', title: 'Você já <em>perdeu dinheiro</em> operando?',
      sub: 'Resposta sincera. Quase todo mundo que chega aqui já perdeu ou tem medo de perder.',
      options: [
        { v: 'muito', l: 'Sim, mais do que eu gostaria de admitir' },
        { v: 'pouco', l: 'Sim, um pouco' },
        { v: 'medo', l: 'Ainda não, mas tenho medo de perder' },
        { v: 'nunca', l: 'Nunca operei com dinheiro real' }
      ] },
    { id: 'stop', title: 'Onde você costuma colocar <em>o seu stop?</em>', insight: 'stop',
      options: [
        { v: 'fundo', l: 'Logo abaixo do fundo (ou acima do topo)', d: 'O lugar “técnico” que quase todo curso ensina' },
        { v: 'redondo', l: 'Perto de um número redondo', d: 'Ex.: 1.1000 no EUR/USD, 60.000 no bitcoin' },
        { v: 'sem', l: 'Não uso stop', d: 'Eu mesmo fecho quando acho que deu' },
        { v: 'naosei', l: 'Ainda não sei o que é stop' }
      ] },
    { id: 'lev', title: 'Que alavancagem você usa <em>(ou usaria)?</em>', insight: 'lev',
      options: [
        { v: 'nao', l: 'Não uso alavancagem' },
        { v: 'ate5', l: 'Até 5x' },
        { v: '10a20', l: 'De 10x a 20x' },
        { v: '20mais', l: 'Acima de 20x' },
        { v: 'corretora', l: 'A que a corretora oferece', d: '1:100, 1:500, 125x…' }
      ] },
    { id: 'entry', title: 'Qual dessas entradas é mais <em>a sua cara?</em>',
      options: [
        { v: 'rompimento', l: 'Quando o preço rompe o topo ou o fundo' },
        { v: 'noticia', l: 'Quando sai uma notícia forte' },
        { v: 'sinal', l: 'Pelo sinal de alguém ou de um grupo' },
        { v: 'semcriterio', l: 'Ainda não tenho critério' }
      ] },
    { id: 'sweep', title: 'Já aconteceu de o preço bater no seu stop e depois ir <em>exatamente pra onde você previu?</em>', insight: 'sweep',
      options: [
        { v: 'varias', l: 'Sim, várias vezes' },
        { v: 'poucas', l: 'Uma ou duas vezes' },
        { v: 'nuncareparei', l: 'Nunca reparei' },
        { v: 'nuncaoperei', l: 'Ainda não operei' }
      ] },
    { id: 'block', title: 'O que mais <em>te trava</em> hoje?',
      options: [
        { v: 'comeco', l: 'Não sei por onde começar' },
        { v: 'metodo', l: 'Não tenho método, opero no feeling' },
        { v: 'emocional', l: 'Perco o controle emocional' },
        { v: 'sozinho', l: 'Não tenho ninguém pra tirar dúvida' }
      ] },
    { id: 'capital', title: 'Com que dinheiro você pretende <em>operar?</em>',
      sub: 'Essa resposta muda o que o Naio vai te dizer.',
      options: [
        { v: 'sobra', l: 'Um valor que posso perder sem afetar minhas contas' },
        { v: 'reserva', l: 'Parte da minha reserva de emergência' },
        { v: 'emprestimo', l: 'Empréstimo ou cartão de crédito' },
        { v: 'naosei', l: 'Ainda não sei' }
      ] }
  ];

  /* ---------------------------------------------------------------- insights */
  var INSIGHTS = {
    stop: function (a) {
      var you = {
        fundo: 'Você coloca o stop logo abaixo do fundo — exatamente onde a maioria coloca.',
        redondo: 'Você coloca o stop perto de número redondo — exatamente onde a pesquisa encontrou a maior concentração de ordens.',
        sem: 'Sem stop, quem decide a sua saída é a corretora: no preço de liquidação ou na chamada de margem. E esses preços se acumulam nas mesmas zonas.',
        naosei: 'Stop é a ordem que encerra a operação sozinha num preço definido. Você ainda não aprendeu a colocá-lo no lugar errado — isso é vantagem.'
      }[a.stop];
      return {
        kicker: 'O que a pesquisa encontrou',
        num: '~10', small: '%',
        title: 'das ordens de stop e realização de lucro estavam em preços terminados em 00.',
        you: you,
        body: [
          'Carol Osler, economista do Federal Reserve de Nova York, analisou ordens reais de clientes de um grande banco no câmbio. Os stops se concentravam logo depois dos números redondos.',
          'Quando o preço chega nessas zonas, as ordens disparam em sequência: cada stop executado empurra o preço até os próximos. Ela chamou isso de <em>price cascade</em>.'
        ],
        src: 'Osler (2003), Journal of Finance · Fed de Nova York, Staff Report 150'
      };
    },
    lev: function (a) {
      var base = 'No Protocolo Cascata, a alavancagem é calculada pela distância: o preço de liquidação precisa ficar além da próxima zona. Se não couber, a posição diminui ou não entra.';
      var map = {
        nao: { num: '1,6', small: 'mi', title: 'de traders liquidados em 24 horas, em outubro de 2025.',
          you: 'Sem alavancagem, você fica fora da parte mais violenta. Ótimo começo.',
          body: ['Foram cerca de US$ 19 bilhões em posições encerradas à força — o maior evento de liquidação da história do setor. Quase todas eram posições compradas.',
            'Mesmo sem alavancagem, o seu stop continua no mapa. E é aí que o Protocolo Cascata começa.'],
          src: 'Coinglass via Livecoins · Exame (out/2025)' },
        ate5: { num: '~20', small: '%', title: 'é o quanto o preço precisa andar contra uma posição de 5x para liquidá-la.',
          you: 'Você usa até 5x. Parece pouco — até o dia em que o mercado anda 20%.',
          body: ['Em outubro de 2025, mais de 1,6 milhão de traders foram liquidados em 24 horas. Muitos achavam que estavam com pouca alavancagem.', base] },
        '10a20': { num: '5–10', small: '%', title: 'é o quanto o preço precisa andar contra você para liquidar uma posição de 10x a 20x.',
          you: 'Com 10x a 20x, o seu preço de liquidação costuma ficar dentro da zona onde a cascata acontece.',
          body: ['Quando a cascata começa, a sua posição vira uma das que alimentam o movimento. Não é azar: é matemática de margem.', base] },
        '20mais': { num: '<5', small: '%', title: 'de movimento contra você já liquida uma posição acima de 20x.',
          you: 'Acima de 20x, um dia comum de mercado basta para zerar a posição.',
          body: ['Em dia de notícia forte, cripto anda isso com facilidade — e a sua posição vira combustível para o movimento.', base] },
        corretora: { num: '0,2', small: '%', title: 'de movimento contra uma posição de 500x já consome toda a margem.',
          you: 'Usar a alavancagem que a corretora oferece é o jeito mais rápido de colocar o seu preço de liquidação no meio da zona de cascata.',
          body: ['Com 1:500, uma conta de US$ 500 abre 1 lote padrão de EUR/USD. Cinquenta pips contra — um movimento comum em um único dia — zeram a conta.',
            'A corretora oferece a alavancagem em poucos cliques. Ninguém mostra essa conta.'] }
      };
      var m = map[a.lev] || map.nao;
      return {
        kicker: a.lev === 'nao' ? 'O maior evento de liquidação da história' : 'A conta que ninguém mostra',
        num: m.num, small: m.small, title: m.title, you: m.you, body: m.body,
        src: m.src || 'Valores aproximados, sem considerar taxas e margem de manutenção.'
      };
    },
    sweep: function (a) {
      var saw = a.sweep === 'varias' || a.sweep === 'poucas';
      return {
        kicker: saw ? 'Por que isso acontece' : 'Um teste para a próxima vez',
        word: saw ? 'Não é azar.' : 'Repare.',
        title: saw ? 'É liquidez.' : 'Na próxima vez que o preço romper um topo óbvio, observe o que acontece logo depois.',
        you: saw ? 'Você já viu o preço buscar o seu stop antes de ir pra onde você previu.' : '',
        body: [
          'Muitas vezes o rompimento é só o preço buscando os stops acima da máxima (ou abaixo da mínima) antes de voltar.',
          'No estudo do Fed de Nova York, o câmbio tendeu a reverter perto de números redondos e a acelerar depois de atravessá-los. Sem conspiração: são ordens acumuladas disparando em sequência. Quando o combustível acaba, o movimento perde força.'
        ],
        src: 'Osler, Fed de Nova York (2002) · Journal of Finance (2003)'
      };
    }
  };

  /* ---------------------------------------------------------------- pontuação */
  var PTS = {
    stop: { fundo: 24, redondo: 24, sem: 28, naosei: 16 },
    lev: { nao: 2, ate5: 9, '10a20': 20, '20mais': 26, corretora: 28 },
    entry: { rompimento: 20, noticia: 18, sinal: 22, semcriterio: 16 },
    sweep: { varias: 12, poucas: 8, nuncareparei: 6, nuncaoperei: 3 },
    loss: { muito: 10, pouco: 6, medo: 4, nunca: 2 }
  };

  function compute(a) {
    var raw = 0;
    Object.keys(PTS).forEach(function (k) { raw += (PTS[k][a[k]] || 0); });
    var score = Math.max(12, Math.min(97, Math.round(raw)));
    var beginner = a.exp === 'nunca' || a.market === 'nenhum';
    var key = beginner ? 'zero' : score >= 70 ? 'combustivel' : score >= 45 ? 'zona' : 'fronteira';
    var P = {
      zero: { name: 'Ponto Zero',
        h: 'Você ainda não virou <span class="soft">combustível.</span>',
        p: 'O índice mostra o risco de você começar <b>do mesmo jeito que a maioria começa</b>: vendo um print, abrindo a conta, colocando o stop onde todo mundo coloca e usando a alavancagem que a corretora oferece. A boa notícia: você ainda pode começar pelo lado certo.' },
      combustivel: { name: 'Combustível de Cascata',
        h: 'Você opera como a maioria <span class="soft">que é liquidada primeiro.</span>',
        p: 'Seu stop, sua entrada e sua alavancagem estão nas zonas onde a cascata acontece. <b>Quando o mercado se move de verdade, posições como a sua são as que alimentam o movimento.</b> Não é falta de sorte. É o lugar onde você está operando.' },
      zona: { name: 'Dentro da Zona',
        h: 'Parte da sua operação <span class="soft">está na zona de cascata.</span>',
        p: 'Você já evita alguns erros da maioria, mas <b>pelo menos um ponto da sua operação te coloca no caminho da cascata</b>. É esse ponto que costuma devolver em um dia o ganho de semanas.' },
      fronteira: { name: 'Na Fronteira',
        h: 'Você já evita a armadilha. <span class="soft">Falta o mapa.</span>',
        p: 'Você não opera como a maioria. O próximo passo é saber <b>onde a maioria vai ser obrigada a sair</b> — e usar isso a seu favor, com a conta blindada.' }
    }[key];

    function st(s) { return beginner && s === 'detected' ? 'risk' : s; }
    var traps = [
      { t: 'Stop onde todo mundo coloca', s: st({ fundo: 'detected', redondo: 'detected', sem: 'detected', naosei: 'risk' }[a.stop] || 'risk'),
        x: a.stop === 'sem'
          ? 'Sem stop, a sua saída vira o preço de liquidação — e ele se acumula nas mesmas zonas que o stop da maioria.'
          : 'Logo abaixo do fundo e logo depois do número redondo. Ali o stop vira a liquidez que o preço precisa para se mover.' },
      { t: 'Entrada no rompimento óbvio', s: st({ rompimento: 'detected', sinal: 'detected', semcriterio: 'risk', noticia: 'ok' }[a.entry] || 'risk'),
        x: a.entry === 'sinal'
          ? 'Quem entra pelo sinal de um grupo entra junto com todo mundo: no mesmo preço, com o stop no mesmo lugar.'
          : 'Muitas vezes o rompimento é só o preço buscando os stops acima da máxima antes de voltar.' },
      { t: 'Liquidação dentro da zona de cascata', s: st({ nao: 'ok', ate5: 'risk', '10a20': 'detected', '20mais': 'detected', corretora: 'detected' }[a.lev] || 'risk'),
        x: 'Quando a cascata começa, uma posição alavancada demais é uma das que alimentam o movimento. A alavancagem precisa ser calculada pela distância até a próxima zona.' },
      { t: 'Notícia tratada como direção', s: st(a.entry === 'noticia' ? 'detected' : beginner ? 'risk' : 'ok'),
        x: 'A notícia funciona como gatilho. O tamanho do movimento depende de quanta alavancagem e quantos stops estavam acumulados antes dela.' }
    ];
    return { score: score, key: key, beginner: beginner, name: P.name, h: P.h, p: P.p, traps: traps };
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
    var pct = Math.round(((i + 1) / Q.length) * 100);
    fill.style.width = pct + '%';
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
          (i > 0 ? '<button class="q-back" type="button" data-back>' + I.back + 'Voltar</button>' : '<span class="meta">Diagnóstico Cascata</span>') +
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
    phase('insight', 'Por que isso importa');
    var big = d.word
      ? '<div class="dx ins-num" style="font-size:clamp(52px,8.4vw,118px)">' + esc(d.word) + '</div>'
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
    O.state.set({ answers: answers, score: r.score, profile: { key: r.key, name: r.name }, quizDoneAt: Date.now() });
    O.sb.lead({ stage: 'quiz_completed', answers: answers, score: r.score, profile: r.name });
    O.sb.event('quiz_complete', null, { score: r.score, profile: r.key });
    O.track('QuizComplete', { score: r.score, profile: r.key });
    renderAnalysis(r);
  }

  function renderAnalysis(r) {
    phase('analysis', 'Analisando');
    var steps = ['Localizando onde fica o seu stop', 'Calculando a sua distância de liquidação', 'Comparando com o comportamento da maioria', 'Montando o seu Índice de Combustível'];
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
        '<span class="cap-badge">' + I.lock + 'Diagnóstico pronto</span>' +
        '<h2 class="hx cap-h" tabindex="-1" data-focus>Seu Índice de Combustível <span class="acc">está calculado.</span></h2>' +
        '<p class="cap-p">Deixe seu contato para ver o resultado. É por ele que avisamos quando a janela de entrada da Off Society abrir ou fechar.</p>' +
        '<form class="cap-form" novalidate>' +
          '<label class="field" data-f="name"><span>Primeiro nome</span><input name="name" autocomplete="given-name" placeholder="Como você quer ser chamado" value="' + esc(s.name || '') + '" required><em class="err-msg">Digite seu nome.</em></label>' +
          '<label class="field" data-f="whatsapp"><span>WhatsApp com DDD' + (lc.requireWhatsapp === false ? ' (opcional)' : '') + '</span><input name="whatsapp" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="(11) 91234-5678" value="' + esc(s.whatsapp || '') + '"><em class="err-msg">Confira o número com DDD.</em></label>' +
          '<label class="field" data-f="email"><span>E-mail' + (lc.emailRequired ? '' : ' (opcional)') + '</span><input name="email" type="email" inputmode="email" autocomplete="email" placeholder="voce@email.com" value="' + esc(s.email || '') + '"><em class="err-msg">Confira o e-mail.</em></label>' +
          '<button class="btn btn-dark btn-xl btn-block" type="submit">Ver meu diagnóstico ' + I.next + '</button>' +
          '<p class="cap-legal">Seus dados ficam só com a Off Society. Nada de spam, e você pode pedir a exclusão quando quiser.</p>' +
        '</form>' +
        '<div class="cap-blur" aria-hidden="true"><b class="tnum">' + r.score + '/100</b><span>Perfil: <b style="filter:blur(5px)">' + esc(r.name) + '</b></span></div>' +
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
      O.sb.lead({ stage: 'lead_captured', name: name, whatsapp: wa ? '+55' + wa : '', email: email, answers: answers, score: r.score, profile: r.name });
      O.sb.event('lead_captured');
      O.track('Lead', { content_name: 'Diagnóstico Cascata', profile: r.key });
      renderResult(r);
    });
  }

  /* ---------------------------------------------------------------- resultado */
  function renderResult(r) {
    phase('result', 'Seu resultado');
    var name = O.firstName(O.state.get().name);
    var detected = r.traps.filter(function (t) { return t.s === 'detected'; }).length;
    var lbl = { detected: 'Detectado', risk: 'Atenção', ok: 'Sob controle' };
    var L = Math.PI * 170;
    var AUD = window.OFF_AUDIOS || {};
    var aud = Object.keys(AUD).some(function (k) { return !!AUD[k].src; });
    var rows = r.traps.map(function (t, k) {
      return '<li class="row"><button class="row-h trap" type="button" aria-expanded="false">' +
        '<span class="idx">' + pad(k + 1) + '</span>' +
        '<span class="row-t"><small>Armadilha do Stop Óbvio · ' + pad(k + 1) + '</small><b>' + esc(t.t) + '</b></span>' +
        '<span class="trap-status ' + t.s + '">' + lbl[t.s] + '</span>' +
        '<span class="row-a">' + I.arrow + '</span></button>' +
        '<div class="row-b"><div><div class="row-in"><p>' + esc(t.x) + '</p></div></div></div></li>';
    }).join('');
    var summary = r.beginner
      ? 'Pontos de atenção para quem está começando'
      : detected + ' de 4 armadilhas detectadas';
    var el = swap(
      '<div class="res">' +
        '<div class="res-top">' +
          '<div class="gauge" data-reveal>' +
            '<svg viewBox="0 0 400 220"><defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stop-color="#3542E6"/><stop offset=".6" stop-color="#B9BCF4"/><stop offset="1" stop-color="#fff"/></linearGradient><filter id="gl"><feGaussianBlur stdDeviation="6"/></filter></defs>' +
              '<path d="M30 200 A170 170 0 0 1 370 200" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="16" stroke-linecap="round"/>' +
              '<path id="gArcGlow" d="M30 200 A170 170 0 0 1 370 200" fill="none" stroke="url(#gg)" stroke-width="16" stroke-linecap="round" stroke-dasharray="' + L + '" stroke-dashoffset="' + L + '" filter="url(#gl)" opacity=".6"/>' +
              '<path id="gArc" d="M30 200 A170 170 0 0 1 370 200" fill="none" stroke="url(#gg)" stroke-width="16" stroke-linecap="round" stroke-dasharray="' + L + '" stroke-dashoffset="' + L + '"/>' +
              '<circle id="gDot" cx="30" cy="200" r="7" fill="#fff"/>' +
            '</svg>' +
            '<div class="gauge-num"><b class="tnum" id="gNum">0</b><span>Índice de Combustível</span></div>' +
          '</div>' +
          '<div data-reveal style="--d:.1s">' +
            '<span class="pill-live"><i class="dot-live"></i>' + (name ? esc(name) + ', seu perfil: ' : 'Seu perfil: ') + '<b>' + esc(r.name) + '</b></span>' +
            '<h1 class="hx res-h" tabindex="-1" data-focus>' + r.h + '</h1>' +
            '<p class="res-p">' + r.p + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="res-sheet sheet" data-reveal style="--d:.2s">' +
          '<div class="res-sheet-h"><h2 class="hx h3">O que o diagnóstico <span class="acc">encontrou</span></h2><span class="meta">' + esc(summary) + '</span></div>' +
          '<ul class="rows">' + rows + '</ul>' +
        '</div>' +
        '<div class="res-next" data-reveal style="--d:.3s">' +
          '<div class="res-av"><img src="assets/img/naio-avatar.webp" alt=""><i>' + (aud ? I.mic : I.msg) + '</i></div>' +
          '<div><b>' + (aud ? 'O Naio gravou áudios sobre o seu resultado.' : 'O Naio deixou uma mensagem sobre o seu resultado.') + '</b>' +
            '<span>Conversa de 5 minutos · ' + (aud ? 'áudios curtos' : 'mensagens curtas') + ' e um vídeo de 30 segundos.</span></div>' +
          '<a class="btn btn-light btn-xl" href="' + O.withUtm('chat.html') + '" id="toChat">' + (aud ? 'Ouvir o Naio ' : 'Falar com o Naio ') + I.next + '</a>' +
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
    var first = el.querySelector('.row .row-h');
    // abre automaticamente a primeira armadilha detectada
    var auto = Array.prototype.find.call(el.querySelectorAll('.row'), function (li) { return li.querySelector('.trap-status.detected'); });
    if (auto) setTimeout(function () { auto.querySelector('.row-h').click(); }, 1300);
    else if (first) setTimeout(function () { first.click(); }, 1300);

    el.querySelector('#toChat').addEventListener('click', function () { O.sb.event('to_chat'); });

    // animação do medidor
    var arc = el.querySelector('#gArc'), glow = el.querySelector('#gArcGlow'), dot = el.querySelector('#gDot'), num = el.querySelector('#gNum');
    var t0 = null, dur = O.reduceMotion ? 1 : 1800;
    setTimeout(function () {
      requestAnimationFrame(function loop(t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / dur);
        var e = 1 - Math.pow(1 - p, 3);
        var v = r.score * e;
        var off = L * (1 - v / 100);
        arc.setAttribute('stroke-dashoffset', off);
        glow.setAttribute('stroke-dashoffset', off);
        var ang = Math.PI * (1 - v / 100);
        dot.setAttribute('cx', 200 + 170 * Math.cos(ang));
        dot.setAttribute('cy', 200 - 170 * Math.sin(ang));
        num.textContent = Math.round(v);
        if (p < 1) requestAnimationFrame(loop);
      });
    }, 350);
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

  // atalhos de teclado: 1–5 escolhem, Enter continua
  document.addEventListener('keydown', function (ev) {
    if (ev.target && /input|textarea/i.test(ev.target.tagName)) return;
    var n = parseInt(ev.key, 10);
    if (n >= 1 && n <= 5) {
      var b = current.querySelectorAll('.opt')[n - 1];
      if (b) b.click();
    } else if (ev.key === 'Enter') {
      var nx = current.querySelector('[data-next]');
      if (nx) nx.click();
    }
  });

  // ?etapa=resultado para revisar o layout (usa respostas de exemplo)
  var preview = new URLSearchParams(location.search).get('etapa');
  if (preview) {
    answers = { market: 'cripto', exp: '6-24', loss: 'muito', stop: 'fundo', lev: '10a20', entry: 'rompimento', sweep: 'varias', block: 'metodo', capital: 'sobra' };
    var r0 = compute(answers);
    if (preview === 'resultado') renderResult(r0);
    else if (preview === 'captura') renderCapture(r0);
    else if (preview === 'insight') { qi = 3; renderInsight('stop'); }
    else if (preview === 'pergunta') renderQuestion(3);
  }
})();
