/* ==========================================================================
   ETAPA 2 · CHAT — conversa roteirizada com o Naio
   Personalizada com as respostas do quiz. Áudios com waveform, velocidade
   1x/1,5x/2x e transcrição; vídeo; cards; objeções em menu.
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
  var beginner = A.exp === 'nunca' || A.market === 'nenhum';
  var chat = {};
  var lastWho = null;
  var P = C.price || {};
  var PRICE = (P.label || 'R$ 97') + (P.period || '');
  var G = C.guaranteeDays || 7;

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
  function fmt(s) { if (!isFinite(s)) return '0:00'; s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + pad(s % 60); }
  function scrollDown() { thread.scrollTo({ top: thread.scrollHeight, behavior: O.reduceMotion ? 'auto' : 'smooth' }); }
  function save() { O.state.set({ chat: chat }); O.sb.lead({ chat: chat }); }
  function setStatus(t, active) { statusEl.textContent = t; statusEl.classList.toggle('act', !!active); }

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
  }

  function say(text) {
    if (!text) return Promise.resolve();
    var ms = Math.min(2400, Math.max(650, 380 + text.length * 17));
    return indicator('text', ms).then(function () {
      add('<div class="bubble">' + md(text) + '<span class="tm">' + now() + '</span></div>', 'bot');
      return wait(300);
    });
  }

  function me(text) {
    add('<div class="bubble">' + O.esc(text) + '<span class="tm">' + now() + '</span></div>', 'me');
  }

  function card(html, cls, ms) {
    return indicator('text', ms || 1100).then(function () {
      var m = add(html, 'bot', cls);
      return wait(700).then(function () { return m; });
    });
  }

  /* ------------------------------------------------------------ respostas */
  function choices(opts) {
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

  var AUD_READY = Object.keys(AUD).some(function (k) { return !!AUD[k].src; });

  // Enquanto o áudio não foi gravado (src vazio), a fala vira mensagens de texto.
  function sayLong(text) {
    var parts = text.match(/[^.!?]+[.!?]+["”*]*(\s+|$)|[^.!?]+$/g) || [text];
    var chunks = [], cur = '';
    parts.forEach(function (p) {
      p = p.trim();
      if (!p) return;
      if (cur && (cur + ' ' + p).length > 240) { chunks.push(cur); cur = p; }
      else cur = cur ? cur + ' ' + p : p;
    });
    if (cur) chunks.push(cur);
    return chunks.reduce(function (pr, c) { return pr.then(function () { return say(c); }); }, Promise.resolve());
  }

  function audio(id) {
    var a = AUD[id];
    if (!a) return Promise.resolve();
    if (!a.src) return sayLong(a.textChat || a.text);
    return indicator('audio', 1500 + Math.min(1600, a.text.length * 2)).then(function () {
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

        function finish(ms) { if (done) return; done = true; setTimeout(resolve, ms == null ? 500 * SPEED : ms); }
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
            finish(Math.min(9000, 1800 + a.text.length * 12) * SPEED);
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
    return indicator('text', 900).then(function () {
      add('<figure class="media"><img src="' + src + '" alt="" loading="lazy">' +
        (caption ? '<figcaption>' + md(caption) + '<span class="tm">' + now() + '</span></figcaption>' : '') +
        '</figure>', 'bot');
      return wait(1100);
    });
  }

  function mediaWait(player, idleMs, capMs) {
    return new Promise(function (resolve) {
      var done = false;
      function fin() { if (done) return; done = true; clearTimeout(t1); clearTimeout(t2); setTimeout(resolve, 600); }
      var t1 = setTimeout(fin, idleMs * SPEED), t2;
      player.on('play', function () { clearTimeout(t1); clearTimeout(t2); t2 = setTimeout(fin, capMs); });
      player.on('end', fin);
    });
  }

  function cascadeVideo() {
    return indicator('text', 1000).then(function () {
      var m = add('<div class="media video"><div class="cd-host"></div></div>', 'bot');
      var player = window.CascadeDemo.mount(m.querySelector('.cd-host'), { compact: true, source: 'chat' });
      return mediaWait(player, 9000, 42000);
    });
  }

  function salaVideo() {
    if (!C.videos || !C.videos.salaOff || !window.OFFMedia) return Promise.resolve();
    return indicator('text', 1000).then(function () {
      var m = add('<div class="media video"><div class="mv-host"></div><div class="cap"><b>Trecho de uma Sala Off</b><span>ao vivo</span></div></div>', 'bot');
      var player = window.OFFMedia.mount(m.querySelector('.mv-host'), { url: C.videos.salaOff, poster: C.videos.salaOffPoster, title: 'Sala Off', source: 'chat' });
      return mediaWait(player, 8000, 90000);
    });
  }

  /* ------------------------------------------------------------ cards */
  var STAGES = [
    { t: 'Combustível', d: 'Mapear onde estão os stops e a alavancagem da maioria.' },
    { t: 'Gatilho', d: 'Identificar o que pode disparar a cascata: notícia, abertura de sessão, dólar.' },
    { t: 'Cascata', d: 'Operar a reação, nunca a antecipação. Varredura ou continuação.' },
    { t: 'Blindagem', d: 'Stop fora da zona óbvia e alavancagem pela distância. Nunca ser combustível.' }
  ];

  function stagesCard() {
    return card('<div class="stg">' + STAGES.map(function (s, i) {
      return '<div class="stg-c"><span class="n">0' + (i + 1) + '</span>' + I.dots +
        '<div><b>' + s.t + '</b><p>' + s.d + '</p></div></div>';
    }).join('') + '</div>', 'wide', 1200);
  }

  function li(t, d) { return '<li>' + I.check + '<div><b>' + t + '</b><span>' + d + '</span></div></li>'; }

  function offerCard() {
    return card('<div class="card-w"><span class="meta">Off Society · o que você recebe</span>' +
      '<h4>Tudo o que eu não tive quando perdi os R$ 20 mil.</h4><ul>' +
      li('Curso do zero ao avançado', 'Do cadastro na corretora às estratégias do protocolo') +
      li('Sala Off ao vivo', 'De segunda a sexta, operando na minha conta') +
      li('Contato direto comigo', 'Perguntas no fim de cada live e canal de dúvidas') +
      li('Grupo fechado', 'Mapa da semana, diários e dúvidas do protocolo') +
      li('Ferramentas', 'Calculadora de Blindagem, Checklist Cascata e Diário') +
      '</ul></div>', '', 1300);
  }

  function priceCard() {
    var perDay = P.showPerDay && P.period ? '≈ ' + O.perDay() + ' por dia. ' : '';
    return card('<div class="card-w price-c"><span class="meta">Entrada na Off Society</span>' +
      '<div class="big tnum">' + O.esc(P.label || 'R$ 97') + '<small>' + O.esc(P.period || P.accessNote || '') + '</small></div>' +
      '<p>' + perDay + 'Menos do que costuma custar uma única posição alavancada liquidada.</p></div>', '', 900);
  }

  function salaCard() {
    return card('<div class="card-w sala-c"><span class="meta">Formato da Sala Off</span><h4>Todo dia, as 4 etapas ao vivo.</h4><ol>' +
      '<li><div><b>Abertura</b><span>Mapa do dia: zonas de stop e liquidação, calendário, leitura do dólar</span></div></li>' +
      '<li><div><b>Sessão</b><span>Opero a minha conta explicando o raciocínio e o que invalidaria a ideia</span></div></li>' +
      '<li><div><b>Blindagem</b><span>Como calculei lote, alavancagem e stop</span></div></li>' +
      '<li><div><b>Revisão</b><span>O que funcionou e o que não funcionou, perdas incluídas</span></div></li>' +
      '<li><div><b>Perguntas</b><span>Contato direto comigo</span></div></li>' +
      '</ol></div>', '', 1300);
  }

  function ctaCard() {
    var perks = G + ' dias de garantia';
    return card('<div class="card-w cta-c"><span class="meta">Etapa 3 de 3</span><h4>Off Society</h4>' +
      '<p>Tudo o que está incluso, as regras da sociedade e a sua entrada por ' + O.esc(PRICE) + ' com ' + perks + '.</p>' +
      '<a class="btn btn-light" href="' + O.withUtm('oferta.html') + '" data-go>Ver a Off Society ' + I.next + '</a></div>', '', 900)
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
  function stopLine() {
    return {
      fundo: 'Você disse que coloca o stop **logo abaixo do fundo**. É exatamente onde a maioria coloca. E é exatamente ali que o preço vai buscar liquidez.',
      redondo: 'Você disse que coloca o stop **perto de número redondo**. Um estudo do Fed de Nova York encontrou quase 10% das ordens de stop e realização de lucro em preços terminados em 00. Você está no meio da multidão.',
      sem: 'Você disse que **não usa stop**. Então quem decide a sua saída é a corretora: no preço de liquidação ou na chamada de margem. E esses preços ficam nas mesmas zonas que o stop de todo mundo.',
      naosei: 'Você disse que ainda não sabe o que é stop. Relaxa, isso é bom: você ainda não aprendeu a colocá-lo no lugar errado.'
    }[A.stop] || '';
  }
  function levLine() {
    return {
      nao: 'Você disse que não usa alavancagem. Ótimo: você já está fora da parte mais violenta da cascata. Agora falta o resto do mapa.',
      ate5: 'Você disse que usa até 5x. Com 5x, o preço precisa andar cerca de 20% contra você pra liquidar. Parece longe, até o dia em que não é.',
      '10a20': 'Você disse que usa de 10x a 20x. Nessa faixa, o preço precisa andar só **5% a 10%** contra você pra liquidar a posição. É a distância de uma cascata.',
      '20mais': 'Você disse que usa mais de 20x. Aí o preço precisa andar **menos de 5%** contra você. Um dia comum de mercado resolve isso.',
      corretora: 'Você disse que usa a alavancagem que a corretora oferece. Com 1:500, **50 pips contra zeram uma conta de US$ 500**. É o jeito mais rápido de virar combustível.'
    }[A.lev] || '';
  }
  function capitalLine() {
    if (A.capital === 'reserva') return 'E uma coisa séria' + (name ? ', ' + name : '') + ': você disse que pensa em usar **parte da reserva de emergência**. Não faça isso. Reserva é pra emergência. Na Off Society todo mundo começa pela conta demo.';
    if (A.capital === 'emprestimo') return 'E uma coisa séria: você disse que pensa em operar com **empréstimo ou cartão**. Não faça isso. Nunca. Na Off Society todo mundo começa pela conta demo, e dinheiro real só entra quando é um valor que você pode perder.';
    return '';
  }
  function blockLine() {
    return {
      comeco: 'Você disse que não sabe por onde começar. O curso começa literalmente do cadastro na corretora.',
      metodo: 'Você disse que opera no feeling. O protocolo é o contrário disso: quatro perguntas, sempre na mesma ordem, antes de qualquer entrada.',
      emocional: 'Você disse que perde o controle emocional. Quase sempre isso é tamanho de posição. A Blindagem resolve antes de virar emoção.',
      sozinho: 'Você disse que não tem ninguém pra tirar dúvida. Lá dentro você tem: toda live termina com um bloco de perguntas comigo.'
    }[A.block] || '';
  }
  function windowLine() {
    var w = C.entryWindow || {};
    if (w.closesAt && !O.windowClosed()) {
      var d = new Date(w.closesAt);
      var when = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }) + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      return 'Só um detalhe: a janela de entrada fecha em **' + when + '**. Depois disso, só lista de espera.';
    }
    return 'Só um detalhe: a porta da Off Society abre poucas vezes. Fora da janela, só lista de espera.';
  }

  /* ------------------------------------------------------------ objeções */
  var OBJ = [
    { id: 'iniciante', q: 'Nunca operei. Consigo acompanhar?', run: function () {
      return say('Consegue. O curso começa literalmente do cadastro: como verificar se a corretora é regulada, abrir a conta, configurar a plataforma e ler o gráfico.')
        .then(function () { return say('E ninguém opera dinheiro real antes de passar pela conta demo. É regra da sociedade.'); });
    } },
    { id: 'capital', q: 'Quanto preciso pra começar?', run: function () {
      return say('Pra começar: zero. Você começa na conta demo.')
        .then(function () { return say('Quando for pro real, a regra é posição mínima, e só escala quando o diário sustenta. Demo → posição mínima → escala. É o Protocolo de Exposição.'); })
        .then(function () { return say('De R$ 200 pra R$ 1.000 em um dia, a estratégia é a mesma. O que cresce é o tamanho da posição, e o prejuízo possível cresce junto. **Por isso a Blindagem vem antes da escala.**'); });
    } },
    { id: 'sala', q: 'Como funciona a Sala Off?', run: function () {
      var sal = C.salaOff || {};
      return say('É ao vivo, ' + (sal.schedule || 'de segunda a sexta') + (sal.time ? ', ' + sal.time : '') + '. Sempre no mesmo formato:')
        .then(salaCard)
        .then(salaVideo)
        .then(function () { return say('Eu falo do meu plano, na minha conta. Nunca “entrem”, “comprem agora” ou “coloquem X lotes”. O objetivo é você aprender a ler, não copiar.'); });
    } },
    { id: 'sinal', q: 'Vocês mandam sinal de entrada?', run: function () {
      return say('Não. E lá dentro é proibido pedir ou dar “entrada agora”.')
        .then(function () { return say('Sinal te deixa dependente de alguém. Eu quero que você saiba mapear a zona, esperar o gatilho e se proteger sozinho.'); });
    } },
    { id: 'corretora', q: 'Qual corretora eu vou usar?', run: function () {
      return say('Eu não empurro corretora nenhuma. No curso você aprende a verificar a regulação da corretora antes de abrir conta. Isso já te livra de muita furada.');
    } },
    { id: 'garantia', q: 'E se eu não gostar?', run: function () {
      return say('Você tem **' + G + ' dias de garantia**. Entrou, assistiu às aulas, participou das lives e não curtiu? Pede o reembolso e recebe 100% de volta.');
    } }
  ];

  function menu() {
    var items = OBJ.slice();
    var first = true;
    function loop() {
      return say(first ? 'Ficou alguma dúvida? Toca numa delas aqui embaixo. Se já decidiu, é só tocar em **Quero entrar**.' : 'Mais alguma dúvida?')
        .then(function () {
          first = false;
          var opts = items.map(function (o) { return { l: o.q, v: o.id }; });
          opts.push({ l: 'Quero entrar na Off Society', v: '__go', primary: true });
          return choices(opts);
        })
        .then(function (pick) {
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
      if (sl) sl.textContent = 'Mensagens curtas, um vídeo de 30 segundos e as respostas pras dúvidas mais comuns. Leva uns 5 minutos.';
      var pn = document.getElementById('phNote');
      if (pn) pn.lastChild.nodeValue = 'Mensagens do Naio para quem fez o Diagnóstico Cascata.';
    }
    chapter(1);
    await wait(700);

    // 01 · diagnóstico
    if (!name) {
      await say('Fala! Aqui é o Naio. Antes de começar: como posso te chamar?');
      var nm = await ask({ placeholder: 'Seu primeiro nome', min: 2 });
      name = O.firstName(nm);
      O.state.set({ name: nm });
      O.sb.lead({ name: nm });
      await say('Prazer, ' + name + '!');
    } else {
      await say('Fala, ' + name + '! Aqui é o Naio.');
    }

    if (S.score != null) {
      await say('Acabei de ver o seu Diagnóstico Cascata. Seu Índice de Combustível deu **' + S.score + '/100**. Perfil: **' + ((S.profile && S.profile.name) || '—') + '**.');
    } else {
      await say('Em poucos minutos eu te mostro por que a maioria perde dinheiro do mesmo jeito, e como operar do outro lado.');
    }
    await audio('a1');
    await say(stopLine());

    var reaction = await choices(beginner ? [
      { l: 'Faz sentido, quero entender mais', v: 'entender', reply: 'Então deixa eu te contar como eu descobri isso.' },
      { l: 'Nunca tinha pensado nisso', v: 'novo', reply: 'Quase ninguém pensa. Por isso quase todo mundo perde do mesmo jeito.' }
    ] : [
      { l: 'Já perdi dinheiro exatamente assim', v: 'perdi', reply: 'Eu também. E foi caro.' },
      { l: 'Nunca tinha pensado nisso', v: 'novo', reply: 'Quase ninguém pensa. Por isso quase todo mundo perde do mesmo jeito.' },
      { l: 'Faz sentido, continua', v: 'continua', reply: 'Então deixa eu te contar como eu descobri isso.' }
    ]);
    chat.reacao = reaction.v;
    save();
    await say(reaction.reply);

    // 02 · história
    chapter(2);
    await say('Pouca gente sabe dessa história.');
    await audio('a2');
    await image('assets/img/naio-off-blue.webp', 'Anos operando no off. Só pra mim.');
    await audio('a3');
    if (AUD.a3 && AUD.a3.src) await say('Faço questão de repetir: esse resultado é meu, com o meu capital e a minha experiência. **Não é uma expectativa pra quem entra na Off Society.**');
    await say(beginner ? 'Agora me conta você: o que te fez querer começar agora?' : 'Agora me conta você: qual foi a sua pior operação até hoje?');
    var story = await ask({ placeholder: 'Escreva em uma frase…', skip: 'Prefiro não contar', min: 2 });
    chat.historia = story;
    save();
    await say(story
      ? 'Valeu por abrir isso comigo. ' + (beginner ? 'Começar sabendo onde a maioria erra já te coloca na frente.' : 'Guarda essa operação na cabeça, porque daqui a pouco você vai entender onde ela quebrou.')
      : 'Tranquilo. Vamos pro que interessa.');
    await choices([{ l: 'E como funciona esse método?', v: 'metodo' }]);

    // 03 · protocolo
    chapter(3);
    await say('Eu chamo de **Protocolo Cascata**. Antes de explicar, olha isso aqui:');
    await cascadeVideo();
    await stagesCard();
    await audio('a4');
    await say(levLine());
    await say(capitalLine());
    var where = await choices([
      { l: 'Onde eu aprendo isso?', v: 'onde' },
      { l: 'Quero aprender isso', v: 'quero' }
    ]);
    chat.interesse = where.v;
    save();

    // 04 · off society
    chapter(4);
    await say('Foi pra isso que eu abri a **Off Society**.');
    await audio('a5');
    await offerCard();
    showOffer();
    await say(blockLine());
    if (C.hasOtherRevenue) {
      await say('A entrada custa **' + PRICE + '**, pra que ninguém fique de fora por causa do preço.');
    } else {
      await say('Agora, sobre o valor.');
      await audio('a6');
    }
    await priceCard();
    await say('E tem **' + G + ' dias de garantia**. Entrou e não fez sentido pra você? Pede o reembolso e recebe tudo de volta. A garantia é sobre a comunidade, nunca sobre resultado financeiro.');
    await say(windowLine());
    await menu();

    await say('Boa' + (name ? ', ' + name : '') + '! Tô te esperando lá dentro.');
    await audio('a7');
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
