/* ==========================================================================
   ETAPA 2 · CHAT — conversa roteirizada com o Naio (público leigo)
   Ritmo humano: pausa de leitura, digitação proporcional ao tamanho da
   mensagem com variação natural, "visto" nas mensagens do lead.
   A maior parte da explicação vem em áudio; sem arquivo, vira texto.
   ========================================================================== */
(function () {
  'use strict';
  var O = window.OFF, C = O.C, AUD = window.OFF_AUDIOS || {};
  function $(s) { return document.querySelector(s); }

  var thread = $('#thread'), chipsEl = $('#chips'), form = $('#inputForm'), input = $('#textInput'),
    fake = $('#fakeInput'), statusEl = $('#status'), offerPill = $('#offerPill');
  var SPEED = (C.chat && C.chat.speed) || 1;
  if (/[?&]rapido=1/.test(location.search)) SPEED = 0.15; // teste interno do fluxo
  var AVATAR = (C.chat && C.chat.avatar) || 'assets/img/naio-avatar.webp';
  var S = O.state.get();
  var A = S.answers || {};
  var name = O.firstName(S.name);
  var tried = A.know === 'tentei' || A.know === 'opero';
  var chat = {};
  var lastWho = null;
  var afterUser = false;
  var P = C.price || {};
  var PRICE = O.priceText();
  var G = C.guaranteeDays || 7;
  var AUD_READY = Object.keys(AUD).some(function (k) { return !!AUD[k].src; });

  var I = {
    play: '<svg class="i-play" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 001.5.86l12.2-7.5a1 1 0 000-1.72L8.5 3.64A1 1 0 007 4.5z"/></svg>',
    pause: '<svg class="i-pause" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4.2" height="16" rx="1.2"/><rect x="13.8" y="4" width="4.2" height="16" rx="1.2"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 15a3 3 0 003-3V6a3 3 0 10-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 006 6.92V21h2v-2.08A7 7 0 0019 12h-2z"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.7 2.7L16 9.6"/></svg>',
    next: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    dots: '<svg class="dots3" viewBox="0 0 16 12" fill="currentColor"><circle cx="3" cy="9" r="1.6"/><circle cx="8" cy="3" r="1.6"/><circle cx="13" cy="9" r="1.6"/></svg>'
  };

  /* ------------------------------------------------------------ utilidades */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function now() { var d = new Date(); return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function md(s) { return O.esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }
  function wait(ms) { return O.delay(ms * SPEED); }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function fmt(s) { if (!isFinite(s)) return '0:00'; s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + pad(s % 60); }
  function scrollDown() { thread.scrollTo({ top: thread.scrollHeight, behavior: O.reduceMotion ? 'auto' : 'smooth' }); }
  function save() { O.state.set({ chat: chat }); O.sb.lead({ chat: chat }); }
  function setStatus(t, active) { statusEl.textContent = t; statusEl.classList.toggle('act', !!active); }

  /* ------------------------------------------------------------ ritmo humano */
  // Antes de responder: se o lead acabou de escrever, o Naio "lê" (pausa maior).
  function thinkPause() {
    var ms = afterUser ? rand(1500, 2500) : rand(800, 1500);
    afterUser = false;
    return wait(ms);
  }
  // Tempo digitando: proporcional ao tamanho, com variação natural.
  function typingMs(text) {
    var base = Math.min(7000, Math.max(1500, 1000 + text.length * 45));
    return base * rand(0.9, 1.2);
  }
  function markRead() {
    var mine = thread.querySelectorAll('.msg.me:not(.read)');
    for (var i = 0; i < mine.length; i++) mine[i].classList.add('read');
  }

  function add(html, who, cls) {
    var m = document.createElement('div');
    m.className = 'msg ' + who + (lastWho !== who ? ' first' : '') + (cls ? ' ' + cls : '');
    m.innerHTML = html;
    thread.appendChild(m);
    lastWho = who;
    requestAnimationFrame(function () { requestAnimationFrame(function () { m.classList.add('in'); }); });
    setTimeout(scrollDown, 30);
    return m;
  }

  function indicator(kind, ms) {
    return thinkPause().then(function () {
      markRead();
      var prev = lastWho;
      var m = add(kind === 'audio'
        ? '<div class="bubble"><span class="rec"><i></i>gravando áudio…</span></div>'
        : '<div class="bubble"><span class="typing"><i></i><i></i><i></i></span></div>', 'bot', 'ind');
      setStatus(kind === 'audio' ? 'gravando áudio…' : 'digitando…', true);
      return wait(ms).then(function () {
        m.remove();
        lastWho = prev;
        setStatus('online');
      });
    });
  }

  function say(text) {
    if (!text) return Promise.resolve();
    return indicator('text', typingMs(text)).then(function () {
      add('<div class="bubble">' + md(text) + '<span class="tm">' + now() + '</span></div>', 'bot');
      return wait(250);
    });
  }

  function me(text) {
    add('<div class="bubble">' + O.esc(text) + '<span class="tm">' + now() + '</span></div>', 'me');
    afterUser = true;
  }

  function card(html, cls) {
    return indicator('text', rand(1400, 2200)).then(function () {
      var m = add(html, 'bot', cls);
      return wait(900).then(function () { return m; });
    });
  }

  /* ------------------------------------------------------------ respostas */
  function choices(opts) {
    return wait(350).then(function () {
      return new Promise(function (resolve) {
        chipsEl.innerHTML = '';
        opts.forEach(function (o, i) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'chip' + (o.primary ? ' primary' : '') + (o.ghost ? ' ghost' : '');
          b.style.setProperty('--i', i);
          b.textContent = o.l;
          b.addEventListener('click', function () {
            chipsEl.innerHTML = '';
            if (!o.silent) me(o.l);
            resolve(o);
          });
          chipsEl.appendChild(b);
        });
        setTimeout(scrollDown, 60);
      });
    });
  }

  function ask(opts) {
    return new Promise(function (resolve) {
      chipsEl.innerHTML = '';
      fake.hidden = true;
      form.hidden = false;
      input.value = '';
      input.placeholder = opts.placeholder || '';
      function cleanup() { form.hidden = true; fake.hidden = false; chipsEl.innerHTML = ''; form.onsubmit = null; input.blur(); }
      if (opts.skip) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'chip ghost';
        b.textContent = opts.skip;
        b.addEventListener('click', function () { cleanup(); me(opts.skip); resolve(''); });
        chipsEl.appendChild(b);
      }
      form.onsubmit = function (e) {
        e.preventDefault();
        var v = input.value.trim();
        if (v.length < (opts.min || 1)) { input.focus(); return; }
        cleanup();
        me(v);
        resolve(v);
      };
      if (!('ontouchstart' in window)) setTimeout(function () { try { input.focus({ preventScroll: true }); } catch (e) {} }, 80);
      setTimeout(scrollDown, 60);
    });
  }

  /* ------------------------------------------------------------ áudio */
  var currentAudio = null;

  function waveform(seed, n) {
    var h = 2166136261;
    for (var i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    function rnd() { h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0; return (h % 1000) / 1000; }
    var out = [], prev = 0.5;
    for (var j = 0; j < n; j++) {
      var v = 0.2 + rnd() * 0.8;
      v = prev * 0.3 + v * 0.7; prev = v;
      var env = j < 2 || j > n - 3 ? 0.5 : 1;
      out.push(Math.round(16 + v * 84 * env));
    }
    return out;
  }

  // Enquanto o áudio não foi gravado (src vazio), a fala vira mensagens de texto curtas.
  function sayLong(text) {
    var parts = text.match(/[^.!?]+[.!?]+["”*]*(\s+|$)|[^.!?]+$/g) || [text];
    var chunks = [], cur = '';
    parts.forEach(function (p) {
      p = p.trim();
      if (!p) return;
      if (cur && (cur + ' ' + p).length > 200) { chunks.push(cur); cur = p; }
      else cur = cur ? cur + ' ' + p : p;
    });
    if (cur) chunks.push(cur);
    return chunks.reduce(function (pr, c) { return pr.then(function () { return say(c); }); }, Promise.resolve());
  }

  function audio(id) {
    var a = AUD[id];
    if (!a) return Promise.resolve();
    if (!a.src) return sayLong(a.textChat || a.text);
    return indicator('audio', rand(2800, 4400)).then(function () {
      return new Promise(function (resolve) {
        var bars = waveform(id, 36).map(function (h) { return '<i style="height:' + h + '%"></i>'; }).join('');
        var m = add(
          '<div class="au" data-state="idle">' +
            '<button class="au-play" type="button" aria-label="Ouvir áudio: ' + O.esc(a.title) + '">' + I.play + I.pause + '</button>' +
            '<div class="au-main">' +
              '<div class="au-wave">' + bars + '<span class="au-dot"></span></div>' +
              '<div class="au-meta"><span class="au-time tnum">0:00</span>' +
                '<button class="au-speed" type="button" aria-label="Velocidade do áudio">1x</button>' +
                '<span class="tm">' + now() + '</span></div>' +
            '</div>' +
            '<div class="au-av"><img src="' + AVATAR + '" alt=""><span class="au-mic">' + I.mic + '</span></div>' +
          '</div>' +
          '<button class="au-tr-btn" type="button" aria-expanded="false">Ler transcrição ' + I.chev + '</button>' +
          '<div class="au-tr" hidden>' + O.esc(a.text) + '</div>', 'bot', 'col audio');

        var root = m.querySelector('.au'), btn = m.querySelector('.au-play'), wave = m.querySelector('.au-wave'),
          barEls = wave.querySelectorAll('i'), dot = m.querySelector('.au-dot'), timeEl = m.querySelector('.au-time'),
          spd = m.querySelector('.au-speed'), trBtn = m.querySelector('.au-tr-btn'), tr = m.querySelector('.au-tr');
        var el = new Audio();
        el.preload = 'metadata';
        el.src = a.src;
        var done = false, speeds = [1, 1.5, 2], si = 0;

        function finish(ms) { if (done) return; done = true; setTimeout(resolve, ms == null ? 700 * SPEED : ms); }
        function paint(p) {
          var k = Math.round(p * barEls.length);
          for (var i = 0; i < barEls.length; i++) barEls[i].classList.toggle('on', i < k);
          dot.style.left = (p * 100) + '%';
        }
        function openTr() {
          tr.hidden = false;
          trBtn.setAttribute('aria-expanded', 'true');
          trBtn.firstChild.nodeValue = 'Ocultar transcrição ';
          setTimeout(scrollDown, 30);
        }

        el.addEventListener('loadedmetadata', function () { if (root.dataset.state === 'idle') timeEl.textContent = fmt(el.duration); });
        el.addEventListener('timeupdate', function () {
          if (!el.duration) return;
          var p = el.currentTime / el.duration;
          paint(p);
          timeEl.textContent = fmt(el.currentTime);
          if (p > 0.93) finish();
        });
        el.addEventListener('play', function () {
          root.dataset.state = 'playing';
          btn.classList.remove('nudge');
          if (currentAudio && currentAudio !== el) currentAudio.pause();
          currentAudio = el;
          O.sb.event('audio_play', id);
        });
        el.addEventListener('pause', function () { if (root.dataset.state === 'playing') root.dataset.state = 'paused'; });
        el.addEventListener('ended', function () {
          root.dataset.state = 'ended';
          root.classList.add('heard');
          paint(1);
          timeEl.textContent = fmt(el.duration);
          chat['ouviu_' + id] = true;
          O.sb.event('audio_end', id);
          finish();
        });
        el.addEventListener('error', function () { btn.classList.remove('nudge'); openTr(); finish(1500); });

        btn.addEventListener('click', function () {
          if (el.paused) {
            if (el.ended || (el.duration && el.currentTime >= el.duration - 0.05)) el.currentTime = 0;
            el.playbackRate = speeds[si];
            var pr = el.play();
            if (pr && pr.catch) pr.catch(function () { openTr(); finish(1500); });
          } else el.pause();
        });
        spd.addEventListener('click', function () {
          si = (si + 1) % speeds.length;
          el.playbackRate = speeds[si];
          spd.textContent = String(speeds[si]).replace('.', ',') + 'x';
        });
        wave.addEventListener('click', function (ev) {
          var r = wave.getBoundingClientRect();
          var p = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width));
          if (el.duration) { el.currentTime = p * el.duration; paint(p); }
        });
        trBtn.addEventListener('click', function () {
          if (tr.hidden) {
            openTr();
            O.sb.event('audio_transcript', id);
            finish(Math.min(10000, 2000 + a.text.length * 14) * SPEED);
          } else {
            tr.hidden = true;
            trBtn.setAttribute('aria-expanded', 'false');
            trBtn.firstChild.nodeValue = 'Ler transcrição ';
          }
        });
        setTimeout(function () { if (root.dataset.state === 'idle' && !done) btn.classList.add('nudge'); }, 2600);
      });
    });
  }

  /* ------------------------------------------------------------ mídia */
  function image(src, caption) {
    return indicator('text', rand(1200, 1800)).then(function () {
      add('<figure class="media"><img src="' + src + '" alt="" loading="lazy">' +
        (caption ? '<figcaption>' + md(caption) + '<span class="tm">' + now() + '</span></figcaption>' : '') +
        '</figure>', 'bot');
      return wait(1400);
    });
  }

  function mediaWait(player, idleMs, capMs) {
    return new Promise(function (resolve) {
      var done = false;
      function fin() { if (done) return; done = true; clearTimeout(t1); clearTimeout(t2); setTimeout(resolve, 700); }
      var t1 = setTimeout(fin, idleMs * SPEED), t2;
      player.on('play', function () { clearTimeout(t1); clearTimeout(t2); t2 = setTimeout(fin, capMs); });
      player.on('end', fin);
    });
  }

  function cascadeVideo() {
    return indicator('text', rand(1400, 2000)).then(function () {
      var m = add('<div class="media video"><div class="cd-host"></div></div>', 'bot');
      var player = window.CascadeDemo.mount(m.querySelector('.cd-host'), { compact: true, source: 'chat' });
      return mediaWait(player, 10000, 42000);
    });
  }

  function salaVideo() {
    if (!C.videos || !C.videos.salaOff || !window.OFFMedia) return Promise.resolve();
    return indicator('text', 1400).then(function () {
      var m = add('<div class="media video"><div class="mv-host"></div><div class="cap"><b>Trecho de uma Sala Off</b><span>ao vivo</span></div></div>', 'bot');
      var player = window.OFFMedia.mount(m.querySelector('.mv-host'), { url: C.videos.salaOff, poster: C.videos.salaOffPoster, title: 'Sala Off', source: 'chat' });
      return mediaWait(player, 9000, 90000);
    });
  }

  /* ------------------------------------------------------------ cards */
  var STAGES = [
    { t: 'Combustível', d: 'Olhar onde a fileira de dominó está montada.' },
    { t: 'Gatilho', d: 'Ver o que pode dar o empurrão, tipo uma notícia.' },
    { t: 'Cascata', d: 'Esperar as peças caírem e só depois agir.' },
    { t: 'Blindagem', d: 'Colocar o capacete: decidir antes quanto aceita perder.' }
  ];

  function stagesCard() {
    return card('<div class="stg">' + STAGES.map(function (s, i) {
      return '<div class="stg-c"><span class="n">0' + (i + 1) + '</span>' + I.dots +
        '<div><b>' + s.t + '</b><p>' + s.d + '</p></div></div>';
    }).join('') + '</div>', 'wide');
  }

  function li(t, d) { return '<li>' + I.check + '<div><b>' + t + '</b><span>' + d + '</span></div></li>'; }

  function offerCard() {
    return card('<div class="card-w"><span class="meta">Off Society · o que você recebe</span>' +
      '<h4>Tudo o que eu não tive quando perdi os R$ 20 mil.</h4><ul>' +
      li('Curso do zero ao avançado', 'Do que é dólar e bitcoin até as minhas estratégias') +
      li('Meet fechado ao vivo', 'De segunda a sexta, eu operando na minha conta') +
      li('Modo treino primeiro', 'Você começa com dinheiro de mentira') +
      li('Contato direto comigo', 'Perguntas no fim de cada meet') +
      li('Grupo fechado', 'Gente começando junto com você') +
      '</ul></div>');
  }

  function priceCard() {
    var stack = C.valueStack || [], total = O.stackTotal();
    var list = stack.length
      ? '<span class="meta">Se fosse pagar cada coisa separada</span><ul class="stack">' +
        stack.map(function (i) { return '<li><span>' + O.esc(i.item) + '</span><b class="tnum">' + O.brl0(i.value) + '</b></li>'; }).join('') +
        '</ul><div class="stack-total"><span>Total</span><s class="tnum">' + O.brl0(total) + '</s></div>'
      : '';
    var note = P.period
      ? (P.showPerDay ? '≈ ' + O.perDay() + ' por dia.' : '')
      : 'Pagamento único, acesso vitalício, sem mensalidade.';
    return card('<div class="card-w price-c">' + list +
      '<span class="meta">Na Off Society</span>' +
      '<div class="big tnum">' + O.esc(P.label || 'R$ 97') + '<small>' + O.esc(P.period || 'uma vez só') + '</small></div>' +
      '<p>' + note + '</p></div>');
  }

  function salaCard() {
    return card('<div class="card-w sala-c"><span class="meta">Como é o meet fechado</span><h4>Todo dia, ao vivo, do mesmo jeito.</h4><ol>' +
      '<li><div><b>Abertura</b><span>O que pode mexer com o mercado hoje</span></div></li>' +
      '<li><div><b>Ao vivo</b><span>Eu opero a minha conta explicando cada decisão</span></div></li>' +
      '<li><div><b>Proteção</b><span>Quanto eu arrisquei e por quê</span></div></li>' +
      '<li><div><b>Revisão</b><span>O que deu certo e o que deu errado</span></div></li>' +
      '<li><div><b>Perguntas</b><span>Você pergunta, eu respondo</span></div></li>' +
      '</ol></div>');
  }

  function ctaCard() {
    return card('<div class="card-w cta-c"><span class="meta">Último passo</span><h4>Off Society</h4>' +
      '<p>Tudo o que está incluso, as regras da sociedade e a sua entrada por ' + O.esc(PRICE) + ', com ' + G + ' dias de garantia.</p>' +
      '<a class="btn btn-light" href="' + O.withUtm('oferta.html') + '" data-go>Ver a Off Society ' + I.next + '</a></div>')
      .then(function (m) {
        m.querySelector('[data-go]').addEventListener('click', function () { O.sb.event('to_offer', 'chat_card'); });
        return m;
      });
  }

  /* ------------------------------------------------------------ capítulos */
  var chapterEls = document.querySelectorAll('#chapters li');
  function chapter(n) {
    chapterEls.forEach(function (li) {
      var k = +li.getAttribute('data-ch');
      li.classList.toggle('is-on', k === n);
      li.classList.toggle('is-done', k < n);
    });
    O.sb.event('chat_chapter', 'c' + n);
  }
  function showOffer() {
    offerPill.hidden = false;
    offerPill.querySelector('a').addEventListener('click', function () { O.sb.event('to_offer', 'chat_pill'); });
  }

  /* ------------------------------------------------------------ falas personalizadas */
  function entryLine() {
    return {
      dica: 'Você disse que, se começasse amanhã, seguiria a dica de um amigo. É o jeito mais comum de começar. E é exatamente assim que a maioria perde junto.',
      influencer: 'Você disse que faria o que algum influenciador mostrou. Faz sentido, eles fazem parecer fácil. Só que ninguém posta o dia ruim.',
      sozinho: 'Você disse que tentaria aprender sozinho pelo YouTube. Foi exatamente o que eu fiz. E me custou caro.',
      alguem: 'Você disse que procuraria alguém de confiança pra te ensinar. Esse é o melhor instinto que você pode ter.'
    }[A.entry] || '';
  }
  function fearLine() {
    return {
      golpe: 'Você disse que tem medo de cair em golpe. Com razão, tem muito por aí. Aqui ninguém pede pra você depositar dinheiro com a gente. Você aprende e, se quiser, opera na sua própria conta.',
      perder: 'Você disse que seu maior medo é perder dinheiro. É por isso que todo mundo começa no modo treino. Primeiro você erra com dinheiro de mentira.',
      entender: 'Você disse que tem medo de não entender nada. Por isso eu explico tudo assim, do jeito que você tá vendo aqui: sem palavra difícil.',
      tempo: 'Você disse que tem medo de não ter tempo. As aulas você assiste no seu ritmo, e o meet fechado é ao vivo, de segunda a sexta.'
    }[A.fear] || '';
  }
  function capitalLine() {
    if (A.capital === 'reserva') return 'E uma coisa séria' + (name ? ', ' + name : '') + ': você disse que começaria com a reserva de emergência. Não faça isso. Reserva é pra emergência. Você começa no modo treino e, quando for pro real, só com um valor que não te faça falta.';
    if (A.capital === 'emprestimo') return 'E uma coisa séria: você disse que começaria com empréstimo ou cartão. Não faça isso. Nunca. Você começa no modo treino e, quando for pro real, só com um valor que não te faça falta.';
    return '';
  }
  function learnLine() {
    return {
      aovivo: 'Você disse que aprende melhor vendo alguém fazer. O meet fechado é exatamente isso: você me vê operando, ao vivo.',
      ritmo: 'Você disse que prefere aprender no seu ritmo. O curso fica lá pra você assistir quando puder.',
      duvida: 'Você disse que aprende melhor tirando dúvida. Todo meet termina com um bloco de perguntas comigo.',
      tudo: 'Você disse que gosta de um pouco de tudo. Lá tem os três: curso no seu ritmo, meet ao vivo todo dia e perguntas comigo.'
    }[A.learn] || '';
  }
  function windowLine() {
    var w = C.entryWindow || {};
    if (w.closesAt && !O.windowClosed()) {
      var d = new Date(w.closesAt);
      var when = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }) + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      return 'Só um detalhe: a porta fecha em ' + when + '. Depois disso, só lista de espera.';
    }
    return 'Só um detalhe: a porta da Off Society abre poucas vezes. Fora da janela, só lista de espera.';
  }

  /* ------------------------------------------------------------ dúvidas */
  var sal = C.salaOff || {};
  var sched = (sal.schedule || 'de segunda a sexta') + (sal.time ? ', ' + sal.time : '');
  var OBJ = [
    { id: 'golpe', q: 'Isso é golpe ou pirâmide?', run: function () { return audio('a9'); } },
    { id: 'mensalidade', q: 'É mensalidade?', run: function () {
      return say(P.period
        ? 'A entrada é ' + PRICE + '.'
        : 'Não. É ' + (P.label || 'R$ 97') + ' uma vez só, e o acesso é vitalício. Sem mensalidade e sem cobrança escondida.');
    } },
    { id: 'iniciante', q: 'Nunca ouvi falar disso. É pra mim?', run: function () {
      return say('É exatamente pra você. O curso começa do zero absoluto: o que é dólar, o que é bitcoin, como funciona uma corretora e como abrir a conta com segurança.')
        .then(function () { return say('E ninguém usa dinheiro de verdade antes de passar pelo modo treino.'); });
    } },
    { id: 'dinheiro', q: 'Preciso de muito dinheiro?', run: function () {
      return say('Pra começar, nenhum. Você começa no modo treino, com dinheiro de mentira.')
        .then(function () { return say('Quando for pro real, a regra é começar com um valor pequeno, que não te faça falta, e só aumentar quando o seu diário mostrar que você tá pronto.'); });
    } },
    { id: 'tempo', q: 'E se eu tiver pouco tempo?', run: function () {
      return say('Dá pra começar com pouco tempo por dia. As aulas você assiste no seu ritmo, e o meet fechado é ao vivo, ' + sched + '. O que importa é a constância.');
    } },
    { id: 'sala', q: 'Como funciona o meet fechado?', run: function () {
      return say('É ao vivo, ' + sched + '. Sempre no mesmo formato:')
        .then(salaCard)
        .then(salaVideo)
        .then(function () { return say('Eu mostro o que eu faço na minha conta. Nunca falo “entra agora”. O objetivo é você aprender a pensar, não copiar.'); });
    } },
    { id: 'garantia', q: 'E se eu não gostar?', run: function () {
      return say('Você tem ' + G + ' dias de garantia. Entrou, assistiu, participou dos meets e não curtiu? Pede o reembolso e recebe 100% de volta.');
    } }
  ];

  function menu() {
    var items = OBJ.slice();
    var first = true;
    function loop() {
      var opts = items.map(function (o) { return { l: o.q, v: o.id }; });
      opts.push({ l: 'Quero entrar na Off Society', v: '__go', primary: true });
      return choices(opts)
        .then(function (pick) {
          first = false;
          if (pick.v === '__go') { chat.decidiu = true; save(); return null; }
          var item = items.filter(function (o) { return o.id === pick.v; })[0];
          items = items.filter(function (o) { return o.id !== pick.v; });
          chat.duvidas = (chat.duvidas || []).concat(pick.v);
          save();
          O.sb.event('chat_objection', pick.v);
          return item.run().then(loop);
        });
    }
    return loop();
  }

  /* ------------------------------------------------------------ roteiro */
  async function run() {
    O.sb.lead({ stage: 'chat_started' });
    O.sb.event('chat_start');
    O.track('ChatStart');
    if (!AUD_READY) {
      var sl = document.getElementById('sideLead');
      if (sl) sl.textContent = 'Mensagens do Naio sobre o seu diagnóstico.';
      var pn = document.getElementById('phNote');
      if (pn) pn.lastChild.nodeValue = 'Mensagens do Naio para quem fez o diagnóstico.';
    }
    chapter(1);
    await wait(1300);

    // 01 · seu resultado
    if (!name) {
      await say('Oi! Aqui é o Naio. Antes de começar: como posso te chamar?');
      var nm = await ask({ placeholder: 'Seu primeiro nome', min: 2 });
      name = O.firstName(nm);
      O.state.set({ name: nm });
      O.sb.lead({ name: nm });
      await say('Prazer, ' + name + '!');
    } else {
      await say('Fala, ' + name + ', Naio aqui!!');
    }

    await say('Acabei de ver seu diagnóstico...');
    if (S.score != null && S.score <= 5) {
      await say(S.score > 0
        ? 'Você tem ' + S.score + ' dos 5 hábitos de quem perde dinheiro no mercado.'
        : 'Você não tem nenhum dos 5 hábitos de quem perde dinheiro. Ótimo começo.');
      if (S.score >= 2) await say('Calma, isso tem conserto. E é mais simples do que parece.');
    }
    await audio('a1');
    await say(entryLine());

    var reaction = await choices([
      { l: 'Me conta mais', v: 'mais', reply: 'Então deixa eu te contar a minha história.' },
      { l: 'Por que a maioria perde?', v: 'porque', reply: 'Boa pergunta. A resposta começa na minha história.' }
    ]);
    chat.reacao = reaction.v;
    save();
    await say(reaction.reply);

    // 02 · história
    chapter(2);
    await audio('a2');
    await image('assets/img/naio-off-blue.webp', 'Longe da multidão. É daí que vem o Off.');
    await audio('a3');
    if (AUD.a3 && AUD.a3.src) await say('Faço questão de repetir: esse resultado é meu, com o meu dinheiro e a minha experiência. Não é uma expectativa pra quem entra na Off Society.');
    await say(tried ? 'Agora me conta você: o que te fez querer tentar de novo?' : 'Agora me conta você: o que te fez querer aprender sobre isso?');
    var storyChoice = await choices([
      { l: 'Quero ter uma renda extra', v: 'renda' },
      { l: 'Cansei de ver os outros ganhando', v: 'cansei' },
      { l: 'Quero sair do emprego', v: 'emprego' },
      { l: 'Quero proteger meu dinheiro', v: 'proteger' },
      { l: 'Curiosidade mesmo', v: 'curiosidade' }
    ]);
    chat.historia = storyChoice.v;
    save();
    var storyReply = {
      renda: 'Renda extra é o motivo mais comum. E é possível, desde que você aprenda do jeito certo.',
      cansei: 'Eu te entendo. A diferença entre eles e você vai ser o método.',
      emprego: 'Muita gente começa com esse objetivo. O importante é não ter pressa.',
      proteger: 'Ótimo instinto. Proteger o que você tem é tão importante quanto ganhar mais.',
      curiosidade: 'Curiosidade é o primeiro passo. Foi assim que eu comecei também.'
    }[storyChoice.v] || 'Valeu por me contar.';
    await say(storyReply);
    await choices([{ l: 'Me explica como funciona', v: 'como' }]);

    // 03 · como funciona
    chapter(3);
    await say('Agora vou te explicar o mercado do jeito mais simples que existe.');
    await audio('a4');
    await say('Olha a fileira de dominó acontecendo. É uma simulação de 30 segundos:');
    await cascadeVideo();
    await say('E o que eu faço pra não cair junto?');
    await audio('a5');
    await say('Resumindo numa imagem:');
    await stagesCard();
    await audio('a6');
    await say(fearLine());
    await say(capitalLine());
    var where = await choices([
      { l: 'Onde eu aprendo isso?', v: 'onde' },
      { l: 'Quero aprender com você', v: 'quero' }
    ]);
    chat.interesse = where.v;
    save();

    // 04 · off society
    chapter(4);
    await say('Foi pra isso que eu abri a Off Society.');
    await audio('a7');
    await offerCard();
    showOffer();
    await say(learnLine());
    if (C.hasOtherRevenue) {
      await say('A entrada custa ' + PRICE + ', pra que ninguém fique de fora por causa do preço.');
    } else {
      await say('Agora, sobre o valor.');
      await audio('a8');
    }
    await say('Olha tudo o que você leva:');
    await priceCard();
    await say('E tem ' + G + ' dias de garantia. Entrou e não fez sentido pra você? Pede o reembolso e recebe tudo de volta.');
    await say(windowLine());
    await menu();

    await say('Boa' + (name ? ', ' + name : '') + '! Te espero lá dentro.');
    await audio('a10');
    await ctaCard();
    chat.completo = true;
    O.state.set({ chat: chat });
    O.sb.lead({ stage: 'chat_completed', chat: chat });
    O.sb.event('chat_complete');
    O.track('ChatComplete');
    var last = await choices([{ l: 'Ver a Off Society →', v: 'go', primary: true, silent: true }]);
    if (last) location.href = O.withUtm('oferta.html');
  }

  run();
})();
