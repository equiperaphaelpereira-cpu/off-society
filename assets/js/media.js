/* ==========================================================================
   OFF SOCIETY · player de vídeo opcional (YouTube, Vimeo ou .mp4)
   Mostra capa + botão; só carrega o player no clique (página mais leve).
   ========================================================================== */
(function () {
  'use strict';

  function parse(url) {
    if (!url) return null;
    var m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
    if (m) return { type: 'yt', id: m[1] };
    m = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([\w]+))?/);
    if (m) return { type: 'vimeo', id: m[1], hash: m[2] };
    return { type: 'file', src: url };
  }

  var PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 001.5.86l12.2-7.5a1 1 0 000-1.72L8.5 3.64A1 1 0 007 4.5z"/></svg>';

  function mount(host, opts) {
    opts = opts || {};
    var src = parse(opts.url);
    var handlers = {};
    function emit(n) { (handlers[n] || []).forEach(function (f) { try { f(); } catch (e) {} }); }
    var api = { on: function (n, f) { (handlers[n] = handlers[n] || []).push(f); return api; } };
    if (!src) return api;

    host.innerHTML =
      '<div class="player"><div class="player-frame">' +
        (opts.poster ? '<img class="player-poster" src="' + opts.poster + '" alt="" loading="lazy">' : '') +
        '<button class="player-cover" type="button" aria-label="Assistir: ' + (opts.title || 'vídeo') + '">' +
          '<span class="play-btn">' + PLAY + '</span>' +
          (opts.title ? '<span class="player-title"><b>' + opts.title + '</b>' + (opts.sub ? '<span class="meta">' + opts.sub + '</span>' : '') + '</span>' : '') +
        '</button>' +
      '</div></div>';

    var frame = host.querySelector('.player-frame');
    host.querySelector('.player-cover').addEventListener('click', function () {
      var html;
      if (src.type === 'yt') {
        html = '<iframe src="https://www.youtube-nocookie.com/embed/' + src.id + '?autoplay=1&rel=0&modestbranding=1&playsinline=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="' + (opts.title || 'Vídeo') + '"></iframe>';
      } else if (src.type === 'vimeo') {
        html = '<iframe src="https://player.vimeo.com/video/' + src.id + '?autoplay=1&title=0&byline=0&portrait=0' + (src.hash ? '&h=' + src.hash : '') + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="' + (opts.title || 'Vídeo') + '"></iframe>';
      } else {
        html = '<video src="' + src.src + '" playsinline controls autoplay' + (opts.poster ? ' poster="' + opts.poster + '"' : '') + '></video>';
      }
      frame.innerHTML = html;
      var v = frame.querySelector('video');
      if (v) v.addEventListener('ended', function () { emit('end'); });
      emit('play');
      if (window.OFF) window.OFF.sb.event('video_play', opts.source || null, { url: String(opts.url).slice(0, 200) });
    });
    return api;
  }

  window.OFFMedia = { mount: mount, parse: parse };
})();
