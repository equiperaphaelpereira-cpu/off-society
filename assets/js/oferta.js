/* ==========================================================================
   ETAPA 3 · PÁGINA FINAL — interações
   ========================================================================== */
(function () {
  'use strict';
  var O = window.OFF, C = O.C, esc = O.esc;
  var S = O.state.get();
  var P = C.price || {};
  var G = C.guaranteeDays || 7;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ------------------------------------------------ preço e garantia */
  var fullPrice = (P.label || 'R$ 97') + (P.period || '');
  $$('[data-price-full]').forEach(function (e) { e.textContent = fullPrice; });
  $$('[data-price-num]').forEach(function (e) { e.textContent = String(P.value || 97); });
  $$('[data-price-period]').forEach(function (e) { e.textContent = P.period || P.accessNote || ''; });
  $$('[data-guarantee]').forEach(function (e) { e.textContent = String(G); });
  var sealText = $('#sealText');
  if (sealText) {
    sealText.textContent = 'GARANTIA · ' + G + ' DIAS · SEM PERGUNTAS · ';
    sealText.setAttribute('textLength', '478');
    sealText.setAttribute('lengthAdjust', 'spacing');
  }
  var pcSub = $('#pcSub');
  if (pcSub) {
    if (P.showPerDay && P.period) pcSub.textContent = '≈ ' + O.perDay() + ' por dia · ' + (P.periodLong || '');
    else pcSub.textContent = P.accessNote || P.periodLong || '';
  }

  /* ------------------------------------------------ personalização */
  if (S.score != null) { var hs = $('#heroScore'); if (hs) hs.textContent = S.score + '/100'; }
  else $$('.hero-chip').forEach(function (e) { e.hidden = true; });

  /* ------------------------------------------------ janela de entrada */
  var W = C.entryWindow || {};
  function setClosed() {
    $('#winLabel').textContent = 'Janela de entrada fechada';
    $('#priceLabel').textContent = 'Janela fechada';
    $('#pcStatus').textContent = 'Janela fechada';
    $('#stickySub').textContent = 'Entre na lista de espera';
    $$('[data-cta-label]').forEach(function (b) {
      if (b.tagName === 'A') b.textContent = 'Entrar na lista de espera';
      else b.childNodes[0].nodeValue = 'Entrar na lista de espera ';
    });
    $$('.dot-live').forEach(function (d) { d.style.animation = 'none'; d.style.background = '#ADADAD'; });
  }
  if (W.closesAt) {
    if (O.windowClosed()) setClosed();
    else {
      var d = new Date(W.closesAt);
      var when = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
      $('#winLabel').textContent = 'A janela fecha em ' + when;
      $('#stickySub').textContent = 'Janela fecha em ' + when;
      ['#winCount', '#priceCount'].forEach(function (id) {
        var el = $(id);
        if (O.countdown(el, W.closesAt, setClosed)) el.hidden = false;
      });
    }
  } else {
    $('#winLabel').textContent = W.openLabel || 'Janela de entrada aberta';
  }

  /* ------------------------------------------------ vídeo principal */
  var vslBox = $('#vslBox');
  var V = C.videos || {};
  if (V.vsl && window.OFFMedia) {
    $('#vslPhase').textContent = 'Assista antes de entrar';
    $('#vslTitle').innerHTML = 'O Naio explica a Off Society <span class="soft">em poucos minutos.</span>';
    window.OFFMedia.mount(vslBox, { url: V.vsl, poster: V.vslPoster, title: 'Assista antes de entrar', sub: 'Naio Rezende', source: 'offer_vsl' });
  } else if (window.CascadeDemo) {
    window.CascadeDemo.mount(vslBox, { source: 'offer' });
  }
  if (V.salaOff && window.OFFMedia) {
    var sv = $('#salaVideo');
    sv.hidden = false;
    window.OFFMedia.mount(sv, { url: V.salaOff, poster: V.salaOffPoster, title: 'Trecho de um Meet Fechado', sub: 'Ao vivo', source: 'offer_sala' });
  }
  var sal = C.salaOff || {};
  var sw = $('#salaWhen');
  if (sw) sw.textContent = (sal.schedule || 'de segunda a sexta') + (sal.time ? ', ' + sal.time : '');

  /* ------------------------------------------------ links */
  var L = C.links || {};
  if (L.instagram) { var ig = $('#igLink'); ig.href = L.instagram; ig.hidden = false; }
  if (L.privacy) { var pv = $('#privacyLink'); pv.href = L.privacy; pv.hidden = false; }
  if (L.terms) { var tr = $('#termsLink'); tr.href = L.terms; tr.hidden = false; }

  /* ------------------------------------------------ FAQ */
  var sched = (sal.schedule || 'de segunda a sexta') + (sal.time ? ', ' + sal.time : '');
  var priceAnswer = P.period
    ? 'A entrada na Off Society custa ' + fullPrice + ' (' + (P.periodLong || 'recorrente') + ').'
    : 'Pagamento único de ' + (P.label || 'R$ 97') + (P.accessNote ? ', com ' + P.accessNote : '') + '.';
  var cheapAnswer = C.hasOtherRevenue
    ? 'A entrada custa ' + fullPrice + ' para que ninguém fique de fora por causa do preço.'
    : 'O Naio vive do trade. A Off Society existe por outro motivo: ele perdeu dinheiro no começo por não ter ninguém que mostrasse o caminho, e hoje quer ser essa pessoa para outros. Ensinar não tira nada dele — o mercado de moedas gira trilhões de dólares por dia, e você operando bem não muda em nada as operações dele. O valor paga a estrutura da comunidade.';
  var FAQ = [
    ['Nunca operei. Consigo acompanhar?', 'Consegue. O curso começa do cadastro: como verificar a regulação da corretora, abrir a conta, configurar a plataforma e ler o gráfico. E ninguém opera dinheiro real antes de passar pela conta demo — é regra da sociedade.'],
    ['Quanto dinheiro preciso para começar a operar?', 'Para começar, nenhum: você começa na conta demo. Quando for para o real, a regra é posição mínima, escalando só quando o diário sustenta (Protocolo de Exposição). Nunca opere com reserva de emergência, empréstimo ou cartão.'],
    ['Vocês mandam sinais de entrada?', 'Não. É proibido pedir ou dar “entrada agora” no grupo. O Naio mostra o plano dele, na conta dele, e explica o raciocínio para você aprender a ler sozinho.'],
    ['Qual corretora ou exchange vou usar?', 'A Off Society não indica nem empurra corretora. O curso ensina você a verificar a regulação da corretora antes de abrir conta.'],
    ['Como funciona o contato direto com o Naio?', 'Bloco fixo de perguntas no fim de cada Meet Fechado (são 3 por dia), canal de dúvidas no grupo respondido pelo Naio e revisão de diários de membros ao vivo.'],
    ['Quando acontece o Meet Fechado?', 'Ao vivo, 3 vezes por dia (às 9h, 15h e 20h), de segunda a sexta. Sempre no mesmo formato: abertura, troca de ideia, 3 operações ao vivo na conta do Naio, bloco de dúvidas e encerramento. Alunos que seguem esses encontros com disciplina chegam a fazer de R$ 500 a R$ 1.000 por dia.'],
    ['Quanto custa?', priceAnswer + ' Com ' + G + ' dias de garantia.'],
    ['Por que o preço é tão baixo?', cheapAnswer],
    ['Isso é recomendação de investimento?', 'Não. É conteúdo educacional. As operações nas lives são feitas na conta do Naio, com fins educacionais, e nenhum tamanho de posição é sugerido para membros.'],
    ['E os impostos?', 'Existe um módulo complementar sobre impostos e declaração de operações com cripto e forex.']
  ];
  var ARW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 7l10 10M17 8.5V17H8.5"/></svg>';
  $('#faqList').innerHTML = FAQ.map(function (f, i) {
    var n = (i < 9 ? '0' : '') + (i + 1);
    return '<li class="row"><button class="row-h" type="button" aria-expanded="false"><span class="idx">' + n + '</span>' +
      '<span class="row-t"><b>' + esc(f[0]) + '</b></span><span class="row-a">' + ARW + '</span></button>' +
      '<div class="row-b"><div><div class="row-in"><p>' + esc(f[1]) + '</p></div></div></div></li>';
  }).join('');

  /* ------------------------------------------------ acordeões */
  $$('.acc-rows').forEach(function (list) {
    list.addEventListener('click', function (ev) {
      var h = ev.target.closest('.row-h');
      if (!h || !list.contains(h)) return;
      var li = h.parentNode;
      var open = !li.classList.contains('is-open');
      $$('.row', list).forEach(function (r) {
        r.classList.remove('is-open');
        $('.row-h', r).setAttribute('aria-expanded', 'false');
      });
      if (open) { li.classList.add('is-open'); h.setAttribute('aria-expanded', 'true'); }
      O.sb.event('offer_toggle', ($('.row-t b', li) || {}).textContent || null);
    });
  });

  /* ------------------------------------------------ cards do protocolo */
  var cards = $$('#protoCards .pcard');
  function activate(c) { cards.forEach(function (x) { x.classList.toggle('is-on', x === c); }); }
  cards.forEach(function (c) {
    c.addEventListener('mouseenter', function () { if (matchMedia('(hover:hover)').matches) activate(c); });
    c.addEventListener('click', function () { activate(c); });
    c.addEventListener('focus', function () { activate(c); });
  });

  /* ------------------------------------------------ história do Naio */
  var SLIDES = [
    { tag: 'Red Room · 2014', yr: '2014 · Red Room', h: 'Antes do mercado, <span class="soft">a música.</span>', img: 'assets/img/naio-profile-blue.webp',
      p: 'Fotógrafo de moda, diretor audiovisual e rapper. Com a chegada do trap ao Brasil, criou com a Luanna a Red Room, primeiro evento 100% trap do país, que depois virou gravadora e produtora de clipes.' },
    { tag: 'R$ 20 mil perdidos', yr: 'O mergulho', h: 'Sozinho, sem mentor, <span class="soft">sem método.</span>', img: 'assets/img/naio-wall-blue.webp',
      p: 'Conheceu o mercado financeiro e mergulhou de cabeça, aprendendo na tentativa e erro. O resultado veio rápido, e no vermelho: mais de R$ 20 mil perdidos fazendo exatamente o que a maioria faz.' },
    { tag: 'Anos no off', yr: 'No off', h: 'O prejuízo da maioria <span class="soft">tem endereço.</span>', img: 'assets/img/naio-off-blue.webp',
      p: 'Sem ter a quem perguntar, virou o próprio professor. Entendeu que os movimentos mais violentos acontecem quando milhares de traders alavancados são obrigados a sair ao mesmo tempo. Operou anos assim, no off, só para ele.' },
    { tag: 'EUA · 2024', yr: '2024 · Estados Unidos', h: 'Abriu tudo. <span class="soft">E voltou ao silêncio.</span>', img: 'assets/img/naio-usa-blue.webp',
      p: 'Numa viagem aos Estados Unidos, decidiu abrir as estratégias. Sentiu que tinha compartilhado demais e voltou ao off por mais dois anos, só estudando e operando.' },
    { tag: 'Off Society · 2026', yr: '2026 · Off Society', h: 'Agora, com alguém <span class="soft">do lado.</span>', img: 'assets/img/naio-stage-blue.webp',
      p: 'O que faltou para o Naio no começo foi alguém mostrando o caminho. A Off Society é isso: um método — o Protocolo Cascata — e alguém operando ao lado, ao vivo, todos os dias.' }
  ];
  var slidesEl = $('#naioSlides'), tagsEl = $('#naioTags'), dotsEl = $('#naioDots'), img = $('#naioImg');
  slidesEl.innerHTML = SLIDES.map(function (s) {
    return '<div class="slide"><span class="yr">' + s.yr + '</span><h3 class="hx">' + s.h + '</h3><p>' + esc(s.p) + '</p></div>';
  }).join('');
  tagsEl.innerHTML = SLIDES.map(function (s, i) { return '<button class="tag" type="button" data-i="' + i + '">' + esc(s.tag) + '</button>'; }).join('');
  dotsEl.innerHTML = SLIDES.map(function () { return '<i></i>'; }).join('');
  SLIDES.forEach(function (s) { var im = new Image(); im.src = s.img; });
  var si = -1, auto;
  function go(i, user) {
    i = (i + SLIDES.length) % SLIDES.length;
    if (i === si) return;
    si = i;
    $$('.slide', slidesEl).forEach(function (e, k) { e.classList.toggle('is-on', k === i); });
    $$('.tag', tagsEl).forEach(function (e, k) { e.classList.toggle('is-on', k === i); });
    $$('i', dotsEl).forEach(function (e, k) { e.classList.toggle('is-on', k === i); });
    img.classList.add('out');
    setTimeout(function () { img.src = SLIDES[i].img; img.classList.remove('out'); }, 260);
    if (user) { clearInterval(auto); O.sb.event('offer_story', 's' + i); }
  }
  go(0);
  tagsEl.addEventListener('click', function (ev) { var b = ev.target.closest('.tag'); if (b) go(+b.getAttribute('data-i'), true); });
  $('#naioPrev').addEventListener('click', function () { go(si - 1, true); });
  $('#naioNext').addEventListener('click', function () { go(si + 1, true); });
  if ('IntersectionObserver' in window && !O.reduceMotion) {
    var started = false;
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting && !started) { started = true; auto = setInterval(function () { go(si + 1); }, 6500); }
    }, { threshold: 0.4 }).observe($('#naio'));
  }

  /* ------------------------------------------------ calculadora */
  var cEntry = $('#cEntry'), cZone = $('#cZone'), cDist = $('#cDist'), cLev = $('#cLev');
  function num(v) {
    v = String(v).trim().replace(/\s/g, '');
    if (/,\d{1,}$/.test(v)) v = v.replace(/\./g, '').replace(',', '.');
    else if (/^\d{1,3}(\.\d{3})+$/.test(v)) v = v.replace(/\./g, '');
    return parseFloat(v);
  }
  function calc() {
    var e = num(cEntry.value), z = num(cZone.value);
    if (!(e > 0) || !(z > 0) || e === z) { cDist.textContent = '—'; cLev.textContent = '—'; return; }
    var dist = Math.abs(e - z) / e;
    var lev = Math.floor(1 / (dist * 1.25));
    cDist.textContent = (dist * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%';
    cLev.textContent = lev < 1 ? 'Seguro' : 'Nível ' + Math.min(lev, 125);
  }
  cEntry.addEventListener('input', calc);
  cZone.addEventListener('input', calc);
  var calcUsed = false;
  [cEntry, cZone].forEach(function (i) { i.addEventListener('change', function () { if (!calcUsed) { calcUsed = true; O.sb.event('calc_used'); } }); });
  calc();

  /* ------------------------------------------------ CTA fixo */
  var sticky = $('#sticky');
  var heroVisible = true, priceVisible = false, footVisible = false;
  function upd() {
    var on = !heroVisible && !priceVisible && !footVisible;
    sticky.classList.toggle('on', on);
    sticky.setAttribute('aria-hidden', on ? 'false' : 'true');
    $('button', sticky).tabIndex = on ? 0 : -1;
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; upd(); }, { threshold: 0.05 }).observe($('.hero'));
    new IntersectionObserver(function (es) { priceVisible = es[0].isIntersecting; upd(); }, { threshold: 0.15 }).observe($('.price-card'));
    new IntersectionObserver(function (es) { footVisible = es[0].isIntersecting; upd(); }, { threshold: 0.2 }).observe($('.foot-cta'));
  }

  /* ------------------------------------------------ rastreamento */
  O.sb.lead({ stage: 'offer_viewed' });
  O.sb.event('offer_view');
  O.track('ViewContent', { content_name: 'Off Society', value: P.value || 97, currency: 'BRL' });
  var marks = [25, 50, 75, 100], hit = {};
  window.addEventListener('scroll', function () {
    var h = document.documentElement;
    var pct = (h.scrollTop + innerHeight) / h.scrollHeight * 100;
    marks.forEach(function (m) { if (pct >= m && !hit[m]) { hit[m] = true; O.sb.event('offer_scroll', 'p' + m); } });
  }, { passive: true });
  $$('a[href="#preco"]').forEach(function (a) { a.addEventListener('click', function () { O.sb.event('to_price', a.className || null); }); });
})();
