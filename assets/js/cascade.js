/* ==========================================================================
   OFF SOCIETY · "Protocolo Cascata em 30 segundos"
   Vídeo técnico gerado em canvas (leve, nítido em qualquer tela, sem arquivo).
   Mostra: zona de stops/liquidações → gatilho → cascata/varredura → blindagem.
   Simulação educacional. draw(t) é função pura do tempo, então dá pra pausar
   e navegar pelos capítulos.
   ========================================================================== */
(function () {
  'use strict';

  var T = 34; // duração total (s)

  /* ---------- série de preço (BTC ilustrativo, em milhares) ---------- */
  var CLOSES = [
    61.60, 61.85, 62.10, 61.90, 61.55, 61.20, 60.90, 60.62, 60.50, 60.85,
    61.30, 61.75, 62.05, 62.35, 62.20, 61.95, 61.70, 61.40, 61.10, 60.85,
    60.70, 60.55, 60.52, 60.80, 61.15, 61.40, 61.30, 61.55, 61.45, 61.20,
    61.05, 60.95, 61.05, 60.85, 60.75, 60.80, 60.68, 60.60, 60.62,
    60.30, 59.95, 59.55, 59.25, 59.45, 59.80, 60.35, 60.60,
    60.55, 60.85, 61.10, 60.95, 61.35, 61.60, 61.50, 61.85, 62.10, 61.95,
    62.30, 62.55, 62.40, 62.70, 62.95, 62.80, 63.05
  ];
  var N = CLOSES.length; // 64
  var LOW_OVR = { 8: 60.42, 22: 60.44, 39: 60.22, 40: 59.88, 41: 59.46, 42: 59.10, 43: 59.05, 44: 59.62 };
  var HIGH_OVR = { 13: 62.46, 38: 60.78, 46: 60.66 };

  function rng(seed) {
    var h = seed >>> 0 || 1;
    return function () { h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0; return (h % 10000) / 10000; };
  }
  var R = rng(7331);
  var CANDLES = CLOSES.map(function (c, i) {
    var o = i === 0 ? 61.42 : CLOSES[i - 1];
    var hi = Math.max(o, c) + 0.04 + R() * 0.14;
    var lo = Math.min(o, c) - 0.04 - R() * 0.14;
    if (LOW_OVR[i] != null) lo = LOW_OVR[i];
    if (HIGH_OVR[i] != null) hi = HIGH_OVR[i];
    return { o: o, h: hi, l: lo, c: c };
  });

  /* janelas de revelação das velas */
  var SEG = [
    { a: 0, b: 30, t0: 0.4, t1: 6.0 },
    { a: 31, b: 38, t0: 12.0, t1: 15.2 },
    { a: 39, b: 46, t0: 16.0, t1: 22.2 },
    { a: 47, b: 63, t0: 24.0, t1: 29.6 }
  ];
  function candleStart(i) {
    for (var k = 0; k < SEG.length; k++) {
      var s = SEG[k];
      if (i >= s.a && i <= s.b) { var per = (s.t1 - s.t0) / (s.b - s.a + 1); return { start: s.t0 + (i - s.a) * per, per: per }; }
    }
    return { start: 0, per: 1 };
  }
  function frac(i, t) { var s = candleStart(i); return Math.max(0, Math.min(1, (t - s.start) / s.per)); }

  /* zonas e níveis */
  var ZONE = { top: 60.41, bot: 59.86 };
  var NEXT = { top: 58.80, bot: 58.45 };
  var ROUND = 60.00, SWING = 60.44, STOP = 58.95, LIQ = 58.22, ENTRY_I = 46;
  var PMIN = 57.85, PMAX = 63.45;

  /* ordens (stops acumulados) dentro da zona */
  var R2 = rng(99);
  var DOTS = [];
  for (var d = 0; d < 42; d++) {
    var u = R2();
    var p = u < 0.45 ? 60.30 + R2() * 0.12 : u < 0.8 ? 59.94 + R2() * 0.14 : ZONE.bot + R2() * (ZONE.top - ZONE.bot);
    var x = 5 + R2() * 33;
    DOTS.push({ p: p, x: x, r: 1.6 + R2() * 1.6, s: R2() });
  }
  // quando cada ordem dispara (primeira vela da cascata cuja mínima atravessa o nível)
  DOTS.forEach(function (dt) {
    dt.trig = Infinity;
    for (var i = 39; i <= 43; i++) {
      var c = CANDLES[i];
      if (c.l <= dt.p) {
        var f = Math.max(0, Math.min(1, (c.o - dt.p) / Math.max(0.0001, c.o - c.l)));
        var cs = candleStart(i);
        dt.trig = cs.start + cs.per * Math.min(1, f * 0.75);
        dt.ci = i;
        break;
      }
    }
  });

  var CAPS = [
    { t0: 0, n: '', h: 'Protocolo Cascata', d: 'Simulação educacional de como uma cascata de stops se forma, e de como operar do outro lado dela.' },
    { t0: 6, n: '01', h: 'Combustível', d: 'A maioria coloca o stop logo abaixo do fundo e perto do número redondo. Somado à alavancagem, isso vira uma zona de liquidez.' },
    { t0: 12, n: '02', h: 'Gatilho', d: 'Uma notícia ou a abertura de uma sessão empurra o preço até a zona.' },
    { t0: 16, n: '03', h: 'Cascata', d: 'Cada stop executado empurra o preço até os próximos. Quando o combustível acaba, o movimento perde força: é a varredura.' },
    { t0: 23, n: '04', h: 'Blindagem', d: 'Entrada só depois da reação. Stop fora da zona óbvia e alavancagem calculada para a liquidação ficar além da próxima zona.' },
    { t0: 30, n: '', h: 'Todo stop óbvio vira combustível.', d: 'Simulação educacional com dados ilustrativos. Não é recomendação de investimento.' }
  ];

  function ease(x) { return x < 0 ? 0 : x > 1 ? 1 : 1 - Math.pow(1 - x, 3); }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function fmtP(p) { return (p * 1000).toLocaleString('pt-BR', { maximumFractionDigits: 0 }); }

  /* ---------- CSS injetado uma vez ---------- */
  var cssDone = false;
  function injectCSS() {
    if (cssDone) return; cssDone = true;
    var s = document.createElement('style');
    s.textContent =
      '.cd{position:relative;background:#05061A;color:#fff;border-radius:inherit;overflow:hidden;font-family:var(--f)}' +
      '.cd-screen{position:relative;width:100%;aspect-ratio:16/10}' +
      '.cd.compact .cd-screen{aspect-ratio:4/3.3}' +
      '.cd canvas{position:absolute;inset:0;width:100%;height:100%}' +
      '.cd-hud{position:absolute;left:12px;top:10px;right:12px;display:flex;justify-content:space-between;gap:8px;pointer-events:none}' +
      '.cd-tag{font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.55);border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:4px 8px}' +
      '.cd-count{font-size:10.5px;color:#B9BCF4;font-variant-numeric:tabular-nums;opacity:0;transition:opacity .4s}' +
      '.cd-count.on{opacity:1}' +
      '.cd-cover{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:radial-gradient(70% 60% at 50% 50%,rgba(5,6,26,.74),rgba(5,6,26,.93));transition:opacity .45s;width:100%}' +
      '.cd-cover .play-btn{width:74px;height:74px}' +
      '.cd.compact .cd-cover .play-btn{width:60px;height:60px}' +
      '.cd-cover b{font-weight:500;font-stretch:115%;font-size:clamp(15px,2vw,22px);letter-spacing:-.02em;text-align:center;padding:0 16px}' +
      '.cd-cover span.meta{color:#B9BCF4}' +
      '.cd-cover.off{opacity:0;pointer-events:none}' +
      '.cd-end{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;padding:20px;background:radial-gradient(80% 70% at 50% 50%,rgba(32,44,173,.55),rgba(5,6,26,.94));opacity:0;pointer-events:none;transition:opacity .6s}' +
      '.cd-end.on{opacity:1;pointer-events:auto}' +
      '.cd-end h5{margin:0;font-weight:500;font-stretch:122%;letter-spacing:-.035em;line-height:1.02;font-size:clamp(22px,4vw,46px)}' +
      '.cd-end h5 span{color:#B9BCF4}' +
      '.cd-end button{font-size:12px;letter-spacing:.08em;text-transform:uppercase;border-bottom:1px solid currentColor;padding-bottom:3px;color:#fff}' +
      '.cd-bar{display:grid;grid-template-columns:auto minmax(0,1fr);gap:12px;align-items:start;padding:12px 14px 10px;border-top:1px solid rgba(255,255,255,.08)}' +
      '.cd-pp{width:34px;height:34px;border-radius:50%;background:#fff;color:#040404;display:grid;place-items:center;flex:none}' +
      '.cd-pp svg{width:14px;height:14px}.cd-pp .i-pa{display:none}.cd.playing .cd-pp .i-pl{display:none}.cd.playing .cd-pp .i-pa{display:block}' +
      '.cd-cap{display:grid;grid-template-columns:auto minmax(0,1fr);gap:10px;align-items:baseline;min-height:52px}' +
      '.cd-cap .n{font-size:11px;color:#B9BCF4;font-variant-numeric:tabular-nums}' +
      '.cd-cap strong{display:block;font-weight:500;font-stretch:114%;font-size:15px;letter-spacing:-.01em}' +
      '.cd-cap p{margin:2px 0 0;font-size:12.5px;line-height:1.45;color:#B6B9D6}' +
      '.cd-cap.swap{animation:cdCap .5s cubic-bezier(.16,1,.3,1)}' +
      '@keyframes cdCap{from{opacity:0;transform:translateY(6px)}}' +
      '.cd-prog{position:relative;height:18px;margin:0 14px 12px;cursor:pointer}' +
      '.cd-prog::before{content:"";position:absolute;left:0;right:0;top:8px;height:2px;background:rgba(255,255,255,.12);border-radius:2px}' +
      '.cd-fill{position:absolute;left:0;top:8px;height:2px;width:0;background:linear-gradient(90deg,#3542E6,#B9BCF4,#fff);border-radius:2px;box-shadow:0 0 10px rgba(185,188,244,.8)}' +
      '.cd-tick{position:absolute;top:3px;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:#05061A;border:1px solid rgba(255,255,255,.3);font-size:0}' +
      '.cd-tick.past{background:#B9BCF4;border-color:#B9BCF4}' +
      '.cd.compact .cd-cap p{font-size:12px}' +
      '.cd.compact .cd-bar{padding:10px 12px 8px}';
    document.head.appendChild(s);
  }

  var ICON_PL = '<svg class="i-pl" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 001.5.86l12.2-7.5a1 1 0 000-1.72L8.5 3.64A1 1 0 007 4.5z"/></svg>';
  var ICON_PA = '<svg class="i-pa" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4.2" height="16" rx="1.2"/><rect x="13.8" y="4" width="4.2" height="16" rx="1.2"/></svg>';

  function mount(host, opts) {
    opts = opts || {};
    injectCSS();
    var root = document.createElement('div');
    root.className = 'cd' + (opts.compact ? ' compact' : '');
    root.innerHTML =
      '<div class="cd-screen">' +
        '<canvas aria-hidden="true"></canvas>' +
        '<div class="cd-hud"><span class="cd-tag">Simulação</span><span class="cd-count"></span></div>' +
        '<div class="cd-end"><h5>Todo stop óbvio<br>vira <span>combustível.</span></h5><button type="button" data-replay>Assistir de novo</button></div>' +
        '<button class="cd-cover" type="button" aria-label="Assistir: Protocolo Cascata em 30 segundos"><span class="play-btn">' + ICON_PL + '</span><b>Protocolo Cascata em 30 segundos</b><span class="meta">4 etapas · simulação</span></button>' +
      '</div>' +
      '<div class="cd-bar"><button class="cd-pp" type="button" aria-label="Reproduzir ou pausar">' + ICON_PL + ICON_PA + '</button>' +
        '<div class="cd-cap" aria-live="polite"><span class="n"></span><div><strong></strong><p></p></div></div></div>' +
      '<div class="cd-prog" role="slider" aria-label="Linha do tempo" tabindex="0"><i class="cd-fill"></i>' +
        [6, 12, 16, 23].map(function (x) { return '<span class="cd-tick" data-t="' + x + '" style="left:' + (x / T * 100) + '%"></span>'; }).join('') +
      '</div>';
    host.appendChild(root);

    var canvas = root.querySelector('canvas'), ctx = canvas.getContext('2d');
    var cover = root.querySelector('.cd-cover'), endEl = root.querySelector('.cd-end'),
      countEl = root.querySelector('.cd-count'), fill = root.querySelector('.cd-fill'),
      ticks = root.querySelectorAll('.cd-tick'), capEl = root.querySelector('.cd-cap'),
      capN = capEl.querySelector('.n'), capH = capEl.querySelector('strong'), capD = capEl.querySelector('p');
    var W = 0, H = 0, DPR = 1;
    var t = 9.6, playing = false, last = 0, raf = 0, started = false, capIdx = -1;
    var handlers = {};
    function emit(n) { (handlers[n] || []).forEach(function (f) { try { f(); } catch (e) {} }); }

    function resize() {
      var r = canvas.getBoundingClientRect();
      DPR = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(10, r.width); H = Math.max(10, r.height);
      canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      draw(t);
    }

    /* ------------------------- desenho ------------------------- */
    function draw(tt) {
      var fs = clamp(W / 62, 8.5, 12);
      var L = 10, Rg = clamp(W * 0.12, 44, 70), Tp = clamp(H * 0.12, 30, 48), B = clamp(H * 0.06, 14, 26);
      var cw = W - L - Rg, ch = H - Tp - B;
      function y(p) { return Tp + (PMAX - p) / (PMAX - PMIN) * ch; }
      function xi(i) { return L + (i + 0.5) * (cw / N); }
      var bw = Math.max(2, (cw / N) * 0.58);

      // fundo
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#080A2A'); g.addColorStop(1, '#04051A');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      var rg = ctx.createRadialGradient(W * 0.15, 0, 0, W * 0.15, 0, W * 0.8);
      rg.addColorStop(0, 'rgba(53,66,230,.28)'); rg.addColorStop(1, 'rgba(53,66,230,0)');
      ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);

      // grade + eixo
      ctx.font = '500 ' + fs + 'px Archivo, system-ui, sans-serif';
      ctx.textBaseline = 'middle';
      for (var gp = 58; gp <= 63; gp += 0.5) {
        var gy = y(gp);
        ctx.strokeStyle = 'rgba(255,255,255,.05)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(L, gy); ctx.lineTo(L + cw, gy); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,.32)';
        ctx.textAlign = 'left';
        ctx.fillText(fmtP(gp), L + cw + 8, gy);
      }

      // zona principal (combustível)
      var za = ease((tt - 6.2) / 0.9);
      var drained = DOTS.filter(function (d) { return tt >= d.trig; }).length / DOTS.length;
      if (za > 0) {
        var zy1 = y(ZONE.top), zy2 = y(ZONE.bot);
        var zalpha = za * (1 - drained * 0.65);
        var zg = ctx.createLinearGradient(0, zy1, 0, zy2);
        zg.addColorStop(0, 'rgba(185,188,244,' + (0.22 * zalpha) + ')');
        zg.addColorStop(1, 'rgba(53,66,230,' + (0.16 * zalpha) + ')');
        ctx.fillStyle = zg;
        ctx.fillRect(L, zy1, cw * za, zy2 - zy1);
        ctx.setLineDash([3, 4]); ctx.strokeStyle = 'rgba(185,188,244,' + (0.55 * zalpha) + ')';
        ctx.beginPath(); ctx.moveTo(L, zy1); ctx.lineTo(L + cw * za, zy1); ctx.moveTo(L, zy2); ctx.lineTo(L + cw * za, zy2); ctx.stroke();
        ctx.setLineDash([]);
        // rótulos
        if (tt < 23 || tt > 29.8) {
          label(L + 6, zy2 + fs * 1.3, 'ZONA DE COMBUSTÍVEL · stops + liquidações estimadas', 'rgba(185,188,244,' + za + ')', fs * 0.9, 'left');
        }
        // fundo óbvio e número redondo
        var la = ease((tt - 7.2) / 0.8) * (tt > 23 ? 0.5 : 1);
        if (la > 0) {
          hline(y(SWING), 'rgba(255,255,255,' + (0.45 * la) + ')', [2, 3]);
          label(L + cw - 6, y(SWING) - fs * 0.9, 'fundo óbvio', 'rgba(255,255,255,' + (0.7 * la) + ')', fs * 0.88, 'right');
          hline(y(ROUND), 'rgba(185,188,244,' + (0.5 * la) + ')', [6, 4]);
          label(L + cw - 6, y(ROUND) + fs * 0.95, '60.000 · número redondo', 'rgba(185,188,244,' + (0.85 * la) + ')', fs * 0.88, 'right');
        }
      }

      // mapa de liquidação (barras no eixo)
      if (za > 0) {
        var buckets = 9, bh = (y(ZONE.bot) - y(ZONE.top)) / buckets;
        for (var b = 0; b < buckets; b++) {
          var p1 = ZONE.top - (b / buckets) * (ZONE.top - ZONE.bot), p2 = ZONE.top - ((b + 1) / buckets) * (ZONE.top - ZONE.bot);
          var tot = 0, rem = 0;
          DOTS.forEach(function (d) { if (d.p <= p1 && d.p > p2) { tot++; if (tt < d.trig) rem++; } });
          var appear = ease((tt - 6.6 - b * 0.12) / 0.8);
          var len = (Rg * 0.9) * Math.min(1, tot / 7) * appear * (tot ? (0.15 + 0.85 * rem / tot) : 0);
          if (len > 0.5) {
            var by = y(p1) + 1;
            var hg = ctx.createLinearGradient(L + cw, 0, L + cw - len, 0);
            hg.addColorStop(0, 'rgba(255,255,255,.75)'); hg.addColorStop(1, 'rgba(91,107,255,.15)');
            ctx.fillStyle = hg;
            ctx.fillRect(L + cw - len, by, len, Math.max(1.5, bh - 2));
          }
        }
      }

      // ordens (pontos)
      var countFired = 0;
      DOTS.forEach(function (d, k) {
        var appear = ease((tt - 6.8 - d.s * 3.2) / 0.6);
        if (appear <= 0) return;
        var dx = L + (d.x / N) * cw, dy = y(d.p);
        if (tt < d.trig) {
          ctx.fillStyle = 'rgba(214,216,255,' + (0.85 * appear) + ')';
          ctx.beginPath(); ctx.arc(dx, dy, d.r * appear, 0, Math.PI * 2); ctx.fill();
        } else {
          countFired++;
          var u = tt - d.trig;
          if (u < 1.1) {
            // anel
            ctx.strokeStyle = 'rgba(255,255,255,' + (1 - u / 1.1) + ')';
            ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.arc(dx, dy, 3 + u * 16, 0, Math.PI * 2); ctx.stroke();
            // faíscas caindo (cascata)
            for (var q = 0; q < 3; q++) {
              var sx = dx + (q - 1) * 6 * u + (d.s - 0.5) * 10 * u;
              var sy = dy + 70 * u * u + q * 4 * u;
              ctx.fillStyle = 'rgba(185,188,244,' + (1 - u / 1.1) + ')';
              ctx.beginPath(); ctx.arc(sx, sy, 1.4, 0, Math.PI * 2); ctx.fill();
            }
            // rastro até a vela que disparou
            var cx = xi(d.ci);
            ctx.strokeStyle = 'rgba(185,188,244,' + (0.35 * (1 - u / 1.1)) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(dx, dy); ctx.quadraticCurveTo((dx + cx) / 2, dy + 20, cx, y(d.p) + 2); ctx.stroke();
          }
        }
      });
      countEl.textContent = 'ordens disparadas · ' + (countFired * 31).toLocaleString('pt-BR');
      countEl.classList.toggle('on', tt > 16 && tt < 30);

      // próxima zona (blindagem)
      var na = ease((tt - 24.4) / 0.8);
      if (na > 0) {
        ctx.fillStyle = 'rgba(185,188,244,' + (0.1 * na) + ')';
        ctx.fillRect(L, y(NEXT.top), cw, y(NEXT.bot) - y(NEXT.top));
        ctx.setLineDash([3, 4]); ctx.strokeStyle = 'rgba(185,188,244,' + (0.35 * na) + ')';
        ctx.beginPath(); ctx.moveTo(L, y(NEXT.top)); ctx.lineTo(L + cw, y(NEXT.top)); ctx.moveTo(L, y(NEXT.bot)); ctx.lineTo(L + cw, y(NEXT.bot)); ctx.stroke();
        ctx.setLineDash([]);
        label(L + 6, (y(NEXT.top) + y(NEXT.bot)) / 2, 'próxima zona', 'rgba(185,188,244,' + (0.8 * na) + ')', fs * 0.85, 'left');
      }

      // velas
      for (var i = 0; i < N; i++) {
        var f = frac(i, tt);
        if (f <= 0) continue;
        var c = CANDLES[i];
        var ef = ease(f);
        var cur = c.o + (c.c - c.o) * ef;
        var hi = f >= 1 ? c.h : Math.max(c.o, cur) + (c.h - Math.max(c.o, c.c)) * ef;
        var lo = f >= 1 ? c.l : Math.min(c.o, cur) - (Math.min(c.o, c.c) - c.l) * Math.min(1, f * 1.4);
        var up = cur >= c.o;
        var casc = i >= 39 && i <= 43;
        var col = up ? '#E9EAFF' : (casc ? '#5B6BFF' : '#3D4BE0');
        var x = xi(i);
        ctx.strokeStyle = col; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, y(hi)); ctx.lineTo(x, y(lo)); ctx.stroke();
        var yt = y(Math.max(c.o, cur)), yb = y(Math.min(c.o, cur));
        ctx.fillStyle = col;
        if (casc) { ctx.shadowColor = 'rgba(91,107,255,.9)'; ctx.shadowBlur = 12; }
        ctx.fillRect(x - bw / 2, yt, bw, Math.max(1, yb - yt));
        ctx.shadowBlur = 0;
      }

      // gatilho (notícia)
      var ga = ease((tt - 14.6) / 0.5);
      if (ga > 0) {
        var nx = xi(38);
        var fade = tt > 23 ? Math.max(0.25, 1 - (tt - 23) / 2) : 1;
        ctx.setLineDash([2, 4]); ctx.strokeStyle = 'rgba(255,255,255,' + (0.4 * ga * fade) + ')';
        ctx.beginPath(); ctx.moveTo(nx, Tp - 4); ctx.lineTo(nx, H - B); ctx.stroke(); ctx.setLineDash([]);
        var pulse = (tt - 14.6) % 1.2;
        if (tt < 17) {
          ctx.strokeStyle = 'rgba(185,188,244,' + (1 - pulse / 1.2) * ga + ')';
          ctx.beginPath(); ctx.arc(nx, Tp + 6, 6 + pulse * 14, 0, Math.PI * 2); ctx.stroke();
        }
        pill(nx, Tp + 6, 'NOTÍCIA · CPI EUA', ga * fade, fs * 0.9, true);
      }

      // varredura
      var va = ease((tt - 20.2) / 0.6) * (tt > 25 ? Math.max(0, 1 - (tt - 25) / 1.5) : 1);
      if (va > 0) {
        var vx = xi(43), vy = y(CANDLES[43].l);
        ctx.strokeStyle = 'rgba(255,255,255,' + va + ')'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(vx, vy, 8, 0, Math.PI * 2); ctx.stroke();
        pill(vx, vy + fs * 2.6, 'VARREDURA · perdeu força', va, fs * 0.88, false);
      }

      // blindagem: entrada, stop e liquidação
      var ea = ease((tt - 22.8) / 0.6);
      if (ea > 0) {
        var ex = xi(ENTRY_I), ey = y(CANDLES[ENTRY_I].c);
        ctx.setLineDash([4, 4]); ctx.strokeStyle = 'rgba(255,255,255,' + (0.6 * ea) + ')';
        ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(L + cw, ey); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(ex, ey, 4.5 * ea, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,' + (0.5 * ea) + ')';
        ctx.beginPath(); ctx.arc(ex, ey, 9 * ea, 0, Math.PI * 2); ctx.stroke();
        pill(ex, ey - fs * 2.4, 'ENTRADA · depois da reação', ea, fs * 0.88, false);
      }
      var sa = ease((tt - 23.7) / 0.6);
      if (sa > 0) {
        var sy2 = y(STOP), x0 = xi(ENTRY_I);
        ctx.strokeStyle = 'rgba(185,188,244,' + sa + ')'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x0, sy2); ctx.lineTo(x0 + (L + cw - x0) * sa, sy2); ctx.stroke();
        label(x0 + 8, sy2 - fs * 0.9, 'STOP · fora da zona óbvia', 'rgba(185,188,244,' + sa + ')', fs * 0.88, 'left');
      }
      var lqa = ease((tt - 25.0) / 0.6);
      if (lqa > 0) {
        var ly = y(LIQ), x1 = xi(ENTRY_I);
        ctx.setLineDash([2, 3]); ctx.strokeStyle = 'rgba(255,255,255,' + (0.8 * lqa) + ')'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(x1, ly); ctx.lineTo(x1 + (L + cw - x1) * lqa, ly); ctx.stroke(); ctx.setLineDash([]);
        shield(x1 + 10, ly, fs * 1.1, lqa);
        label(x1 + 10 + fs * 1.3, ly, 'LIQUIDAÇÃO · além da próxima zona', 'rgba(255,255,255,' + lqa + ')', fs * 0.88, 'left');
      }

      // escurece no final
      if (tt > 29.6) {
        ctx.fillStyle = 'rgba(5,6,26,' + (0.5 * ease((tt - 29.6) / 0.8)) + ')';
        ctx.fillRect(0, 0, W, H);
      }

      function hline(yy, color, dash) {
        ctx.setLineDash(dash || []); ctx.strokeStyle = color; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(L, yy); ctx.lineTo(L + cw, yy); ctx.stroke(); ctx.setLineDash([]);
      }
    }

    function label(x, yy, text, color, size, align) {
      ctx.font = '600 ' + size + 'px Archivo, system-ui, sans-serif';
      ctx.fillStyle = color; ctx.textAlign = align || 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(text, x, yy);
    }
    function pill(x, yy, text, a, size, filled) {
      ctx.font = '600 ' + size + 'px Archivo, system-ui, sans-serif';
      var w = ctx.measureText(text).width + size * 1.6, h = size * 2;
      var px = clamp(x - w / 2, 6, W - w - 6), py = yy - h / 2;
      ctx.globalAlpha = a;
      ctx.fillStyle = filled ? '#fff' : 'rgba(12,14,52,.92)';
      roundRect(px, py, w, h, h / 2); ctx.fill();
      if (!filled) { ctx.strokeStyle = 'rgba(185,188,244,.55)'; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.fillStyle = filled ? '#040404' : '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(text, px + w / 2, yy + 0.5);
      ctx.globalAlpha = 1;
    }
    function roundRect(x, yy, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, yy); ctx.lineTo(x + w - r, yy); ctx.quadraticCurveTo(x + w, yy, x + w, yy + r);
      ctx.lineTo(x + w, yy + h - r); ctx.quadraticCurveTo(x + w, yy + h, x + w - r, yy + h);
      ctx.lineTo(x + r, yy + h); ctx.quadraticCurveTo(x, yy + h, x, yy + h - r);
      ctx.lineTo(x, yy + r); ctx.quadraticCurveTo(x, yy, x + r, yy); ctx.closePath();
    }
    function shield(x, yy, s, a) {
      ctx.globalAlpha = a; ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(x, yy - s * 0.55); ctx.lineTo(x + s * 0.45, yy - s * 0.38); ctx.lineTo(x + s * 0.42, yy + s * 0.05);
      ctx.quadraticCurveTo(x + s * 0.3, yy + s * 0.42, x, yy + s * 0.58);
      ctx.quadraticCurveTo(x - s * 0.3, yy + s * 0.42, x - s * 0.42, yy + s * 0.05);
      ctx.lineTo(x - s * 0.45, yy - s * 0.38); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
    }

    /* ------------------------- legenda / progresso ------------------------- */
    function ui() {
      var k = 0;
      for (var i = 0; i < CAPS.length; i++) if (t >= CAPS[i].t0) k = i;
      if (!started) k = 0;
      if (k !== capIdx) {
        capIdx = k;
        capN.textContent = CAPS[k].n;
        capH.textContent = CAPS[k].h;
        capD.textContent = CAPS[k].d;
        capEl.classList.remove('swap'); void capEl.offsetWidth; capEl.classList.add('swap');
      }
      fill.style.width = (started ? (t / T) * 100 : 0) + '%';
      ticks.forEach(function (tk) { tk.classList.toggle('past', started && t >= +tk.getAttribute('data-t')); });
      endEl.classList.toggle('on', started && t >= 30.4);
    }

    function frame(ts) {
      if (!playing) return;
      var dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;
      t += dt;
      if (t >= T) { t = T; draw(t); ui(); pause(); emit('end'); return; }
      draw(t); ui();
      raf = requestAnimationFrame(frame);
    }

    function play() {
      if (playing) return;
      if (!started) { started = true; t = 0; emit('play'); if (window.OFF) window.OFF.sb.event('demo_play', opts.source || null); }
      if (t >= T) t = 0;
      playing = true;
      root.classList.add('playing');
      cover.classList.add('off');
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function pause() {
      playing = false;
      root.classList.remove('playing');
      cancelAnimationFrame(raf);
    }
    function seek(nt) {
      if (!started) { started = true; emit('play'); }
      cover.classList.add('off');
      t = clamp(nt, 0, T - 0.01);
      draw(t); ui();
    }

    cover.addEventListener('click', play);
    root.querySelector('.cd-pp').addEventListener('click', function () { playing ? pause() : play(); });
    root.querySelector('[data-replay]').addEventListener('click', function () { t = 0; ui(); play(); });
    root.querySelector('.cd-prog').addEventListener('click', function (ev) {
      var r = this.getBoundingClientRect();
      seek(((ev.clientX - r.left) / r.width) * T);
      if (!playing) play();
    });

    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
    else window.addEventListener('resize', resize);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (!e.isIntersecting && playing) pause(); });
      }, { threshold: 0.15 }).observe(root);
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { draw(t); });
    resize();
    ui();

    var api = {
      el: root, play: play, pause: pause, seek: seek,
      on: function (n, f) { (handlers[n] = handlers[n] || []).push(f); return api; }
    };
    return api;
  }

  window.CascadeDemo = { mount: mount, duration: T };
})();
