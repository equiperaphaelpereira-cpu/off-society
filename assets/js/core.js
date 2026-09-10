/* ==========================================================================
   OFF SOCIETY · núcleo compartilhado (sessão, estado, UTM, Supabase, pixel,
   checkout, animações de entrada, contagem regressiva)
   ========================================================================== */
(function () {
  'use strict';
  var C = window.OFF_CONFIG || {};

  /* ---------- storage seguro (in-app browsers às vezes bloqueiam) ---------- */
  var LS = (function () {
    try {
      var k = '__off';
      localStorage.setItem(k, '1');
      localStorage.removeItem(k);
      return localStorage;
    } catch (e) {
      var mem = {};
      return {
        getItem: function (k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
        setItem: function (k, v) { mem[k] = String(v); },
        removeItem: function (k) { delete mem[k]; }
      };
    }
  })();

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  var sid = LS.getItem('off_sid');
  if (!sid) { sid = uuid(); LS.setItem('off_sid', sid); }

  function readJSON(key) {
    try { return JSON.parse(LS.getItem(key) || '{}') || {}; } catch (e) { return {}; }
  }

  var state = {
    get: function () { return readJSON('off_state'); },
    set: function (patch) {
      var s = Object.assign(readJSON('off_state'), patch);
      LS.setItem('off_state', JSON.stringify(s));
      return s;
    }
  };

  /* ---------- UTM / origem ---------- */
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
    'fbclid', 'gclid', 'src', 'sck', 'xcod'];

  function getUtm() { return readJSON('off_utm'); }

  function captureUtm() {
    var p = new URLSearchParams(location.search);
    var found = {};
    UTM_KEYS.forEach(function (k) { var v = p.get(k); if (v) found[k] = v.slice(0, 200); });
    if (Object.keys(found).length) LS.setItem('off_utm', JSON.stringify(Object.assign(getUtm(), found)));
    if (LS.getItem('off_ref') === null) LS.setItem('off_ref', (document.referrer || '').slice(0, 500));
    if (LS.getItem('off_land') === null) LS.setItem('off_land', location.href.slice(0, 500));
  }

  /* Mantém as UTMs ao navegar entre quiz → chat → oferta */
  function withUtm(href) {
    var utm = getUtm();
    if (!Object.keys(utm).length) return href;
    try {
      var u = new URL(href, location.href);
      Object.keys(utm).forEach(function (k) { if (!u.searchParams.has(k)) u.searchParams.set(k, utm[k]); });
      return u.pathname.split('/').pop() + u.search + u.hash;
    } catch (e) { return href; }
  }

  /* ---------- Supabase (RPC com chave publicável) ---------- */
  var sb = {
    ok: !!(C.supabase && C.supabase.url && C.supabase.key),
    rpc: function (fn, body) {
      if (!this.ok) return Promise.resolve();
      return fetch(C.supabase.url.replace(/\/$/, '') + '/rest/v1/rpc/' + fn, {
        method: 'POST',
        keepalive: true,
        headers: { apikey: C.supabase.key, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).catch(function () {});
    },
    lead: function (data) {
      var payload = Object.assign({
        utm: getUtm(),
        referrer: LS.getItem('off_ref') || '',
        landing_url: LS.getItem('off_land') || '',
        user_agent: (navigator.userAgent || '').slice(0, 300)
      }, data);
      return this.rpc('upsert_lead', { p_session_id: sid, p_data: payload });
    },
    event: function (event, step, payload) {
      return this.rpc('log_event', {
        p_session_id: sid, p_event: event, p_step: step || null, p_payload: payload || {}
      });
    }
  };

  /* ---------- Pixel Meta + dataLayer ---------- */
  function initPixel() {
    var id = C.pixel && C.pixel.meta;
    if (!id || window.fbq) return;
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', id);
    window.fbq('track', 'PageView');
  }

  var STANDARD = { Lead: 1, ViewContent: 1, InitiateCheckout: 1, CompleteRegistration: 1, Contact: 1 };
  function track(name, params) {
    try {
      if (window.fbq) window.fbq(STANDARD[name] ? 'track' : 'trackCustom', name, params || {});
    } catch (e) {}
    (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: 'off_' + name }, params || {}));
  }

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function firstName(n) {
    n = String(n || '').trim().split(/\s+/)[0] || '';
    return n ? n.charAt(0).toUpperCase() + n.slice(1).toLowerCase() : '';
  }
  function delay(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function getPath(obj, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }
  function brl(v) {
    return 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var toastEl, toastT;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 4200);
  }

  /* ---------- checkout ---------- */
  function checkoutUrl() {
    var c = C.checkout || {};
    if (!c.url) return '';
    var u;
    try { u = new URL(c.url, location.href); } catch (e) { return c.url; }
    var s = state.get();
    var map = c.params || {};
    if (map.name && s.name) u.searchParams.set(map.name, s.name);
    if (map.email && s.email) u.searchParams.set(map.email, s.email);
    if (map.phone && s.whatsapp) u.searchParams.set(map.phone, String(s.whatsapp).replace(/\D/g, ''));
    if (c.passUtm !== false) {
      var utm = getUtm();
      Object.keys(utm).forEach(function (k) { if (!u.searchParams.has(k)) u.searchParams.set(k, utm[k]); });
    }
    if (c.sessionParam && !u.searchParams.has(c.sessionParam)) u.searchParams.set(c.sessionParam, sid);
    return u.toString();
  }

  function windowClosed() {
    var iso = C.entryWindow && C.entryWindow.closesAt;
    return !!iso && new Date(iso).getTime() < Date.now();
  }

  function goCheckout(origin) {
    if (windowClosed()) {
      var w = C.entryWindow || {};
      if (w.waitlistUrl) { location.href = w.waitlistUrl; return; }
      toast(w.closedMessage || 'A janela de entrada está fechada.');
      return;
    }
    track('InitiateCheckout', { value: (C.price && C.price.value) || 97, currency: 'BRL', content_name: 'Off Society' });
    sb.lead({ stage: 'checkout_clicked' });
    sb.event('checkout_click', origin || null);
    var url = checkoutUrl();
    if (!url) {
      toast('Checkout ainda não configurado: defina checkout.url em assets/js/config.js');
      return;
    }
    setTimeout(function () { location.href = url; }, 160);
  }

  /* ---------- animação de entrada ---------- */
  var io;
  function reveal(root) {
    var els = (root || document).querySelectorAll('[data-reveal]:not(.is-in)');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      els.forEach(function (e) { e.classList.add('is-in'); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    }
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- contagem regressiva real ---------- */
  function countdown(el, iso, onEnd) {
    var end = new Date(iso).getTime();
    if (!iso || isNaN(end)) return false;
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    var t;
    function tick() {
      var d = Math.max(0, end - Date.now());
      var dd = Math.floor(d / 864e5), hh = Math.floor((d % 864e5) / 36e5),
        mm = Math.floor((d % 36e5) / 6e4), ss = Math.floor((d % 6e4) / 1e3);
      el.innerHTML =
        '<span><b>' + pad(dd) + '</b><i>dias</i></span>' +
        '<span><b>' + pad(hh) + '</b><i>horas</i></span>' +
        '<span><b>' + pad(mm) + '</b><i>min</i></span>' +
        '<span><b>' + pad(ss) + '</b><i>seg</i></span>';
      if (d <= 0) { clearInterval(t); if (onEnd) onEnd(); }
    }
    tick();
    t = setInterval(tick, 1000);
    return true;
  }

  /* ---------- binds declarativos ---------- */
  function bindConfig(root) {
    root = root || document;
    root.querySelectorAll('[data-cfg]').forEach(function (el) {
      var v = getPath(C, el.getAttribute('data-cfg'));
      if (v !== undefined && v !== null && v !== '') el.textContent = v;
    });
    root.querySelectorAll('[data-cfg-hide-empty]').forEach(function (el) {
      var v = getPath(C, el.getAttribute('data-cfg-hide-empty'));
      if (!v) el.hidden = true;
    });
    var s = state.get();
    var fn = firstName(s.name);
    root.querySelectorAll('[data-name]').forEach(function (el) {
      if (fn) el.textContent = fn; else if (el.hasAttribute('data-name-fallback')) el.textContent = el.getAttribute('data-name-fallback');
    });
    root.querySelectorAll('[data-if-name]').forEach(function (el) { el.hidden = !fn; });
    root.querySelectorAll('[data-checkout]').forEach(function (el) {
      el.addEventListener('click', function (ev) { ev.preventDefault(); goCheckout(el.getAttribute('data-checkout')); });
    });
    root.querySelectorAll('a[data-keep-utm]').forEach(function (a) {
      a.setAttribute('href', withUtm(a.getAttribute('href')));
    });
  }

  function perDay() {
    var p = C.price || {};
    return brl(p.value / 30).replace(',00', '');
  }
  // "R$ 97/mês" ou "R$ 97 · pagamento único"
  function priceText() {
    var p = C.price || {};
    return (p.label || 'R$ 97') + (p.period ? p.period : (p.periodLong ? ' · ' + p.periodLong : ''));
  }
  function stackTotal() {
    return (C.valueStack || []).reduce(function (s, i) { return s + (Number(i.value) || 0); }, 0);
  }
  function brl0(v) { return 'R$ ' + Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 0 }); }

  window.OFF = {
    C: C, sid: sid, state: state, sb: sb, track: track, esc: esc, firstName: firstName,
    delay: delay, toast: toast, reveal: reveal, countdown: countdown, goCheckout: goCheckout,
    checkoutUrl: checkoutUrl, withUtm: withUtm, getUtm: getUtm, windowClosed: windowClosed,
    bindConfig: bindConfig, perDay: perDay, brl: brl, brl0: brl0, priceText: priceText, stackTotal: stackTotal, reduceMotion: reduceMotion, uuid: uuid
  };

  captureUtm();
  initPixel();
  document.addEventListener('DOMContentLoaded', function () {
    bindConfig();
    reveal();
  });
})();
