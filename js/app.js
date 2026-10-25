/* ============================================================
   UNPACKED v3 â€” app shell (no reload), hash router.
   Views: Wall -> Ride the Line -> Touch the Ground, Transit Map, Station sheet.
   Data: content.js (210-node graph), journey.js (126 audited stops),
         beats.js (v3 copy), meta.js (design system), imgmap.js (photos).
   ============================================================ */
(function () {
'use strict';

var BEATS = window.UNPACKED_BEATS || {};
var META = window.UNPACKED_META || {};
var LINES = META.lines || {};
var FAMS = META.fams || {};
var SERIES = META.series || {};
var J = window.JOURNEY;
var C = window.CONTENT;
var IMG = window.UnpackedIMG || {};
var AFF = window.UNPACKED_AFFILIATE_URL || function () { return null; };

var app = document.getElementById('app');
if (!app || !J || !C) return;

/* ---------------- derived data ---------------- */
var chains = (J.objects || J.chains || []).slice();
var stopMeta = {}, chainById = {};
chains.forEach(function (ch) {
  chainById[ch.id] = ch;
  (ch.stops || []).forEach(function (st, idx) {
    stopMeta[st.id] = { chainId: ch.id, chain: ch, idx: idx, stop: st };
  });
});
var nodeById = {}, nameBucket = {};
var tour = { lines: chains.length, stops: Object.keys(stopMeta).length, nodes: 0, links: 0, procs: 0, shared: 0, grounds: 0 };
(function () {
  var gset = {};
  chains.forEach(function (ch) {
    var room = (ch.stops || [])[0];
    if (!room) return;
    (room.specs || []).forEach(function (s) { if (/we end/i.test(s.label)) gset[s.value] = 1; });
  });
  tour.grounds = Object.keys(gset).length;
})();
(C.chains || []).forEach(function (ch) {
  (ch.nodes || []).forEach(function (nd) {
    nodeById[nd.id] = Object.assign({ chainId: ch.id }, nd);
    tour.nodes++;
    tour.links += (nd.inputs || []).length;
    if ((nd.process || []).length) tour.procs++;
    (nameBucket[nd.name] = nameBucket[nd.name] || []).push(nd.id);
  });
});
Object.keys(nameBucket).forEach(function (n) { if (nameBucket[n].length > 1) tour.shared++; });

/* ---------------- local state ---------------- */
function loadSet(k) { try { return new Set(JSON.parse(localStorage.getItem(k) || '[]')); } catch (e) { return new Set(); } }
function saveSet(k, s) { try { localStorage.setItem(k, JSON.stringify(Array.from(s))); } catch (e) {} }
var visited = loadSet('up3.visited');
var claimedSet = loadSet('up3.claimed');
function claim(chainId) { if (!claimedSet.has(chainId)) { claimedSet.add(chainId); saveSet('up3.claimed', claimedSet); } }

/* ---------------- helpers ---------------- */
function el(tag, cls) { var n = document.createElement(tag); if (cls) n.className = cls; return n; }
function fill(n, kids) {
  (kids || []).forEach(function (k) {
    if (k === null || k === undefined) return;
    n.appendChild(typeof k === 'string' ? document.createTextNode(k) : k);
  });
  return n;
}
function div(cls, kids) { return fill(el('div', cls), kids); }
function span(cls, kids) { return fill(el('span', cls), kids); }
function btn(cls, kids, fn) { var b = fill(el('button', cls), kids); if (fn) b.addEventListener('click', function (e) { e.stopPropagation(); fn(); }); return b; }
function chipCode(code, acc) {
  var s = span('font-tech text-[10px] font-bold tracking-[.18em] px-2.5 py-1 rounded-full', [code]);
  s.style.background = 'color-mix(in srgb, ' + acc + ' 20%, transparent)';
  s.style.color = acc;
  s.style.border = '1px solid color-mix(in srgb, ' + acc + ' 45%, transparent)';
  return s;
}
function pill(txt, cls) { return span(cls || 'font-tech text-[10px] tracking-[.16em] px-2.5 py-1 rounded-full bg-white/5 text-fog border border-white/10', [txt]); }

/* ---------------- photos: natural dims + cover-map pins ---------------- */
var DIMS = {};
function dimsFor(src, cb) {
  if (DIMS[src]) { if (cb) cb(DIMS[src]); return; }
  var probe = new Image();
  probe.onload = function () { DIMS[src] = { w: probe.naturalWidth, h: probe.naturalHeight }; if (cb) cb(DIMS[src]); };
  probe.src = src;
}
function imgSrc(stopId) { return IMG[stopId] ? 'assets/img/' + IMG[stopId] + '.jpg?v=5' : null; }
function animateNum(node, raw) {
  var str = String(raw);
  var mm = str.match(/^([\d,.]+)(.*)$/);
  if (!mm) { node.textContent = str; return; }
  var dec = mm[1].indexOf('.') > -1 ? mm[1].split('.')[1].length : 0;
  var end = parseFloat(mm[1].replace(/,/g, ''));
  if (!isFinite(end)) { node.textContent = str; return; }
  var tail = mm[2] || '';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { node.textContent = str; return; }
  function fmt(v) {
    var s = v.toFixed(dec);
    if (dec === 0 && mm[1].indexOf(',') > -1) s = Math.round(v).toLocaleString('en-US');
    return s + tail;
  }
  var t0 = performance.now();
  (function step(t) {
    var k = Math.min(1, (t - t0) / 750), e = 1 - Math.pow(1 - k, 3);
    node.textContent = fmt(end * e);
    if (k < 1) requestAnimationFrame(step);
  })(t0);
}
/* map an authored percent point (photo space) onto a cover-cropped box */
function coverPoint(pct, box, dim) {
  var scale = Math.max(box.w / dim.w, box.h / dim.h);
  var visW = box.w / scale, visH = box.h / scale;
  var offX = (dim.w - visW) / 2, offY = (dim.h - visH) / 2;
  return { x: (pct.x / 100 * dim.w - offX) * scale, y: (pct.y / 100 * dim.h - offY) * scale };
}
function shotLayer(src, cls) {
  var d = el('div', 'shot ' + (cls || 'absolute inset-0'));
  var im = el('img'); im.src = src; im.alt = ''; im.decoding = 'async'; im.draggable = false;
  d.appendChild(im);
  return d;
}

/* ---------------- router ---------------- */
var cleanupFn = null, suppressRoute = false, lastStopId = null, placement = null;
window.addEventListener('hashchange', function () {
  if (suppressRoute) { suppressRoute = false; return; }
  route();
});
function go(hash) {
  if (location.hash === hash) { route(); return; }
  location.hash = hash;
}
function goQuiet(hash) {
  if (location.hash === hash) { route(); return; }
  suppressRoute = true;
  location.hash = hash;
}
function applyAcc(chainId) {
  var l = LINES[chainId];
  document.documentElement.style.setProperty('--acc', l ? l.acc : '#F2EFE9');
}
function route() {
  if (cleanupFn) { try { cleanupFn(); } catch (e) {} cleanupFn = null; }
  placement = null;
  var parts = (location.hash || '').replace(/^#\/?/, '').split('/').filter(Boolean);
  applyAcc(null);
  var v = null;
  if (parts[0] === 'map') v = MapView();
  else if ((parts[0] === 'line') && LINES[parts[1]]) { applyAcc(parts[1]); v = RideView(parts[1], 0); }
  else if ((parts[0] === 'stop') && stopMeta[parts[1]]) { applyAcc(stopMeta[parts[1]].chainId); v = RideView(stopMeta[parts[1]].chainId, stopMeta[parts[1]].idx); }
  else if ((parts[0] === 'ground') && LINES[parts[1]]) { applyAcc(parts[1]); v = GroundView(parts[1]); }
  else if ((parts[0] === 'station') && nodeById[parts[1]]) v = StationView(parts[1]);
  else v = WallView();
  app.replaceChildren(v);
}
function reg(fn) { cleanupFn = fn; }

/* resize: re-place current pins */
window.addEventListener('resize', function () { if (placement) placement(); });

/* ================= WALL ================= */
function WallView() {
  var root = el('div', 'relative min-h-dvh overflow-x-hidden');

  var back = el('div', 'fixed inset-0');
  back.appendChild(shotLayer('assets/img/room.jpg?v=5', 'absolute inset-0 wallkbd'));
  var fade = el('div', 'fixed inset-0 pointer-events-none');
  fade.style.background = 'linear-gradient(to bottom, rgba(15,13,16,.8) 0%, rgba(15,13,16,.44) 38%, rgba(15,13,16,.88) 100%)';
  root.appendChild(back); root.appendChild(fade);

  var content = div('relative max-w-2xl mx-auto px-4 pt-10 pb-14 min-h-dvh');

  var head = div('flex flex-wrap items-end justify-between gap-x-3 gap-y-2 mb-2 a-rise', [
    fill(el('h1', 'font-disp font-bold text-3xl sm:text-4xl tracking-tight'), [SERIES.name || 'UNPACKED']),
    meterChip()
  ]);
  var sub = el('p', 'text-fog text-sm mb-8');
  sub.textContent = (SERIES.tag || 'every ordinary thing starts somewhere') + '. Pick a line and ride it to the ground.';
  content.appendChild(head); content.appendChild(sub);

  var lastId = null;
  try { lastId = localStorage.getItem('up3.last'); } catch (e) {}
  if (lastId) {
    var rsv = null;
    chains.forEach(function (c2) {
      c2.stops.forEach(function (s2) { if (s2.id === lastId) rsv = { line: c2, stop: s2 }; });
    });
    if (rsv) {
      var lm2 = LINES[rsv.line.id] || {};
      var rb = btn('press w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border a-rise mb-3', null, function () { go('#/stop/' + lastId); });
      rb.style.borderColor = lm2.acc || '#F2EFE9';
      rb.style.background = 'rgba(23,20,27,.88)';
      fill(rb, [
        chipCode(lm2.code || '??', lm2.acc || '#F2EFE9'),
        span('font-tech text-[11px] tracking-[.16em] text-fog text-right', ['RESUME \u00B7 ' + rsv.line.name.toUpperCase() + ' \u00B7 "' + (rsv.stop.name || 'STOP ' + ((rsv.stop.stop || 0) + 1)) + '"'])
      ]);
      content.appendChild(rb);
    }
  }

  var grid = el('div', 'grid grid-cols-1 sm:grid-cols-2 gap-3');
  chains.forEach(function (ch, i) {
    var m = LINES[ch.id] || {};
    var card = btn('press text-left relative overflow-hidden bg-ink2/80 border border-white/10 rounded-xl pl-4 pr-9 py-4 hover:border-white/25 transition-colors', null, function () { go('#/line/' + ch.id); });
    card.style.animationDelay = (i * 28) + 'ms';
    card.classList.add('a-rise');
    card.style.borderLeft = '3px solid ' + (m.acc || '#F2EFE9');
    var num = span('absolute top-1 right-2 font-disp font-bold text-4xl select-none pointer-events-none');
    num.textContent = String(i + 1).padStart(2, '0');
    num.style.color = m.acc || '#F2EFE9';
    num.style.opacity = '.22';
    card.appendChild(num);
    var topRow = div('flex items-center gap-2 mb-2', [
      chipCode(m.code || '??', m.acc || '#F2EFE9'),
      pill((ch.stops.length - 1) + ' STOPS DEEP')
    ]);
    var name = fill(el('h2', 'font-disp font-semibold text-2xl leading-snug tracking-tight'), [ch.name]);
    var tag = el('p', 'text-fog text-[13px] leading-snug mt-1');
    tag.textContent = ch.tagline || '';
    var foot = div('flex items-center justify-between mt-3 text-[11px] font-tech', []);
    var g = span(null, []);
    g.textContent = '\u2192 ' + (m.ground || '');
    g.style.color = claimedSet.has(ch.id) ? (m.acc || '') : '';
    if (claimedSet.has(ch.id)) g.classList.add('font-bold');
    var fam = pill((FAMS[m.fam] || {}).label || '');
    foot.appendChild(g); foot.appendChild(fam);
    if (claimedSet.has(ch.id)) {
      var dot = span('inline-block w-2 h-2 rounded-full mr-2');
      dot.style.background = m.acc || '#F2EFE9';
      foot.prepend(dot);
    }
    fill(card, [topRow, name, tag, foot]);
    grid.appendChild(card);
  });
  content.appendChild(grid);

  var notes = el('p', 'font-tech text-[11px] text-dim mt-8 text-center tracking-wide');
  notes.textContent = (SERIES.groundsNote || '') + ' \u00B7 ' + tour.lines + ' lines \u00B7 ' + tour.stops + ' stations \u00B7 ' + tour.nodes + ' nodes \u00B7 ' + tour.links + ' links';
  content.appendChild(notes);
  root.appendChild(content);
  return root;

  function meterChip() {
    var c = btn(null, null, function () { go('#/map'); });
    c.className = 'press flex items-center gap-2 px-3 py-2 rounded-full border border-white/15 bg-ink2/70 backdrop-blur';
    var segs = div('flex gap-[2px]', []);
    chains.forEach(function (ch2) {
      var seg = el('i', 'block w-[4px] h-3 rounded-[1px]');
      var lm = LINES[ch2.id] || {};
      seg.style.background = claimedSet.has(ch2.id) ? (lm.acc || '#F2EFE9') : 'rgba(255,255,255,.14)';
      segs.appendChild(seg);
    });
    fill(c, [segs, span('font-tech text-[10px] tracking-[.14em] text-fog', [claimedSet.size + '/' + tour.lines + ' GROUNDS'])]);
    return c;
  }
}

/* ================= RIDE ================= */
function RideView(chainId, idx) {
  var m = LINES[chainId], ch = chainById[chainId];
  var stops = ch.stops;
  idx = Math.max(0, Math.min(idx, stops.length - 1));
  var me = stops[idx];
  var beat = BEATS[me.id] || null;
  visited.add(me.id); saveSet('up3.visited', visited);
  try { localStorage.setItem('up3.last', me.id); } catch (e) {}

  var src = imgSrc(me.id) || 'assets/img/room.jpg?v=5';
  var leaving = null;
  if (lastStopId && lastStopId !== me.id && stopMeta[lastStopId] && stopMeta[lastStopId].chainId === chainId) {
    leaving = imgSrc(lastStopId);
  }
  lastStopId = me.id;

  var cardY = 0;
  function currentBox() { return { w: window.innerWidth, h: window.innerHeight }; }

  /* stage: two crossfading layers */
  var stage = el('div', 'stage');
  var baseLayer = null;
  if (leaving) { baseLayer = shotLayer(leaving, 'absolute inset-0 is on'.replace(' is', '')); baseLayer.classList.add('s'); baseLayer.classList.add('on'); stage.appendChild(baseLayer); }
  var curLayer = shotLayer(src, 'absolute inset-0 s');
  stage.appendChild(curLayer);
  var vivid = function () { curLayer.classList.add('on'); };
  var cim = curLayer.querySelector('img');
  if (cim.complete && cim.naturalWidth > 0) vivid();
  else { cim.addEventListener('load', vivid); cim.addEventListener('error', vivid); }

  var wrap = el('div', 'fixed inset-0 overflow-hidden bg-ink');
  wrap.appendChild(stage);
  wrap.appendChild(div('beatwash absolute inset-0', []));

  /* pins */
  function renderPins() {
    var holder = el('div', 'absolute inset-0 z-10 pointer-events-none');
    wrap.appendChild(holder);
    function place() {
      var box = currentBox(), src2 = imgSrc(me.id);
      holder.replaceChildren();
      if (!beat || !beat.call || !src2) return;
      /* safe rect: keep pins clear of the top chrome and the bottom card */
      var safeTop = 64, safeSide = 12;
      var cardEl = wrap.querySelector(':scope > .absolute.bottom-0');
      var safeBottom = cardEl ? Math.max(safeTop + 40, cardEl.getBoundingClientRect().top - 44) : box.h - 24;
      var file = IMG[me.id];
      dimsFor('assets/img/' + file + '.jpg?v=5', function (dim) {
        beat.call.forEach(function (c) {
          var pt = coverPoint({ x: c.x, y: c.y }, box, dim);
          var x = Math.min(Math.max(pt.x, safeSide), box.w - safeSide);
          var y = Math.min(Math.max(pt.y, safeTop), safeBottom);
          var pin = div('pin', null);
          pin.style.animationDelay = (beat.call.indexOf(c) * 110) + 'ms';
          pin.style.left = x + 'px'; pin.style.top = y + 'px';
          var dot = el('span', 'pdot');
          var lb = el('span', 'plb');
          lb.textContent = c.label;
          var s2 = span('plsub', [c.sub]); lb.appendChild(s2);
          pin.appendChild(dot); pin.appendChild(lb);
          holder.appendChild(pin);
          var lw = lb.offsetWidth || 110;
          var roomRight = box.w - safeSide - (x + 17 + lw);
          var roomLeft = (x - 17 - lw) - safeSide;
          if (roomRight < 0 && roomLeft > roomRight) pin.classList.add('flip');
        });
        placement = place;
        if (document.fonts && document.fonts.addEventListener) {
          document.fonts.addEventListener('loadingdone', function once() {
            document.fonts.removeEventListener('loadingdone', once);
            if (placement === place) place();
          });
        }
      });
    }
    place();
  }
  renderPins();

  /* chrome */
  var chrome = div('absolute inset-x-0 top-0 z-20 p-4 flex items-center gap-3', [
    btn('press w-10 h-10 shrink-0 rounded-full border border-white/15 bg-ink/60 backdrop-blur text-bone font-tech text-lg', ['\u2190'], function () { go('#/'); })
  ]);
  var rails = div('flex-1 flex gap-1 items-center');
  for (var i = 0; i < stops.length; i++) {
    var r = el('span', 'rail' + (i <= idx ? ' on' : ''));
    r.appendChild(el('i'));
    rails.appendChild(r);
  }
  chrome.appendChild(rails);
  chrome.appendChild(chipCode((m.code || '') + ' ' + (idx + 1) + '/' + stops.length, m.acc || '#F2EFE9'));
  wrap.appendChild(chrome);

  /* card */
  var card = div('absolute inset-x-0 bottom-0 z-20 rounded-t-xl border-t border-white/10 bg-ink/85 backdrop-blur-xl px-5 pt-4', null);
  card.style.paddingBottom = 'max(1.4rem, env(safe-area-inset-bottom))';

  function renderCard(st, b) {
    var lm = LINES[stopMeta[st.id].chainId];
    var kickRow = div('flex items-center justify-between gap-2 mb-2', [
      div('flex items-center gap-2', [
        pill(st.kind === 'room' ? 'START HERE' : (st.kind || '').toUpperCase() || 'STOP', 'font-tech text-[10px] tracking-[.2em] px-3 py-1.5 rounded-full border border-white/25 text-bone/95 bg-white/12'),
        span('font-tech text-[10px] tracking-[.2em] text-dim', ['STOP ' + (stopMeta[st.id].idx + 1) + '/' + stops.length])
      ]),
      chipCode(lm.code, lm.acc)
    ]);
    var head = fill(el('h1', 'font-disp font-semibold text-2xl leading-tight'), [b.h || st.name]);
    var statRow = div('flex items-baseline gap-2 mt-3 font-tech', []);
  var num = span('font-bold leading-none', ['\u00A0']);
  animateNum(num, b.stat.v);
    num.style.color = 'var(--acc)';
    num.style.fontSize = 'clamp(3rem, 11vw, 4.2rem)';
    num.classList.add('statnum');
    statRow.appendChild(num);
    if (b.stat.u) {
      var u = span('text-xl text-fog', [b.stat.u]);
      statRow.appendChild(u);
    }
    var lab = el('p', 'font-tech text-[12px] tracking-wide text-fog mt-1');
    lab.textContent = b.stat.l || '';
    var body = el('p', 'text-[15px] leading-relaxed text-bone/85 mt-3 max-w-prose');
    body.textContent = b.b || '';
    var cta = null;
    if (stopMeta[st.id].idx === stops.length - 1) {
      cta = div('mt-4 flex items-center gap-3', [
        btn('font-tech text-[12px] tracking-[.18em] px-5 py-3 rounded-full font-bold press', ['TOUCH THE GROUND \u2192'], function () { go('#/ground/' + chainId); })
      ]);
      var ctb = cta.firstChild;
      ctb.style.background = 'var(--acc)';
      ctb.style.color = '#141118';
    }
    card.replaceChildren(kickRow, head, statRow, lab, body);
    if (cta) card.appendChild(cta);
    card.classList.remove('a-rise');
    void card.offsetWidth;
    card.classList.add('a-rise');
  }
  renderCard(me, beat || { h: me.name, b: '', stat: { v: '', u: '', l: '' }, call: [] });

  /* advance affordance */
  var hint = span('font-tech text-[10px] tracking-[.2em] text-bone/75 tapcue a-fade', ['TAP TO CONTINUE']);
  wrap.appendChild(hint);
  hint.style.position = 'absolute';
  hint.style.bottom = 'max(1rem, env(safe-area-inset-bottom))';
  hint.style.right = '1.25rem';
  hint.style.zIndex = '30';

  /* affiliate on object stops (renders only when a tag is configured) */
  if (stopMeta[me.id].idx === 1 && me.kind !== 'room') {
    var affUrl = AFF(chainId, ch.name);
    if (affUrl) {
      var aRow = div('mt-3', []);
      var a = el('a', 'inline-block font-tech text-[11px] tracking-[.14em] px-4 py-2 rounded-full border border-white/15 bg-white/5 press');
      a.textContent = '\u2197 WHERE TO GET ONE';
      a.href = affUrl; a.target = '_blank'; a.rel = 'sponsored noopener noreferrer';
      aRow.appendChild(a);
      card.appendChild(aRow);
    }
  }

  wrap.appendChild(card);
  if (placement) placement();

  function advance() {
    if (idx >= stops.length - 1) { go('#/ground/' + chainId); return; }
    goQuiet('#/stop/' + stops[idx + 1].id);
  }
  function back() {
    if (idx <= 0) { go('#/'); return; }
    goQuiet('#/stop/' + stops[idx - 1].id);
  }

  wrap.addEventListener('click', function () {
    hint.classList.add('hidden');
    advance();
  });
  card.addEventListener('click', function () { advance(); });

  function keyHandler(e) {
    if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); advance(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); back(); }
    if (e.key === 'Escape') { go('#/'); }
  }
  document.addEventListener('keydown', keyHandler);
  var lastTouch = 0;
  wrap.addEventListener('touchstart', function (e) { lastTouch = e.changedTouches[0].clientX; }, { passive: true });
  wrap.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - lastTouch;
    if (Math.abs(dx) > 56) { hint.classList.add('hidden'); if (dx < 0) advance(); else back(); }
  }, { passive: true });

  reg(function () { document.removeEventListener('keydown', keyHandler); });

  /* preload next photo + dims */
  if (idx < stops.length - 1) { var ns = imgSrc(stops[idx + 1].id); if (ns) { var p = new Image(); p.src = ns; } }
  var cf = IMG[me.id]; if (cf) dimsFor('assets/img/' + cf + '.jpg?v=5');

  return wrap;
}

/* ================= GROUND ================= */
function GroundView(chainId) {
  var m = LINES[chainId], ch = chainById[chainId];
  var stops = ch.stops;
  var gStop = stops[stops.length - 1];
  var beat = BEATS[gStop.id];
  claim(chainId);
  visited.add(gStop.id); saveSet('up3.visited', visited);
  lastStopId = null;

  var src = imgSrc(gStop.id) || 'assets/img/room.jpg?v=5';
  var wrap = el('div', 'fixed inset-0 overflow-hidden bg-ink');
  wrap.appendChild(shotLayer(src, 'absolute inset-0 shot-scrim'));

  var content = div('absolute inset-0 z-20 flex flex-col items-center justify-end text-center px-6', null);
  content.style.paddingBottom = 'max(2rem, env(safe-area-inset-bottom))';

  var top = div('flex items-center gap-2 mb-6', [
    chipCode(m.code + ' LINE COMPLETE', m.acc || '#F2EFE9')
  ]);

  var stamp = el('div', 'a-stamp font-tech font-bold tracking-[.28em] text-lg px-6 py-3 rounded-lg border-[3px] mb-4');
  stamp.textContent = 'GROUND CLAIMED';
  stamp.style.color = 'var(--acc)';
  stamp.style.borderColor = 'var(--acc)';
  stamp.style.transform = 'rotate(-2deg)';

  var gname = fill(el('h1', 'font-disp font-bold text-4xl md:text-5xl leading-tight a-rise'), [m.ground || gStop.name]);
  var quip = el('p', 'text-fog text-[15px] leading-relaxed mt-2 max-w-sm a-rise');
  quip.textContent = m.quip || '';
  quip.style.animationDelay = '120ms';

  var meter = div('mt-7 w-full max-w-sm', [
    span('block text-center font-tech text-[11px] tracking-[.16em] text-dim leading-relaxed mb-2', ['GROUNDS CLAIMED ' + claimedSet.size + '/' + tour.lines + ' \u00B7 ' + (SERIES.groundsNote || '')]),
    meterBar()
  ]);

  var nextCh = null;
  var unclaimed = chains.filter(function (c2) { return !claimedSet.has(c2.id); });
  if (unclaimed.length) nextCh = unclaimed.find(function (c2) { return (LINES[c2.id] || {}).fam === (m.fam || ''); }) || unclaimed[0];
  var row = div('mt-7 flex items-center justify-center gap-3 flex-wrap', [
    btn('font-tech text-[12px] tracking-[.18em] font-bold px-6 py-3 rounded-full press a-rise', ['SHARE THE CARD'], function () { openShare(); })
  ]);
  if (nextCh) {
    var nl = LINES[nextCh.id] || {};
    row.appendChild(btn('font-tech text-[12px] tracking-[.18em] font-bold px-6 py-3 rounded-full press a-rise', ['NEXT RIDE \u2192 ' + (nl.code || '?')], function () { go('#/stop/' + nextCh.stops[0].id); }));
  }
  var sb = row.querySelector('button');
  sb.style.background = 'var(--acc)';
  sb.style.color = '#141118';
  if (nextCh) {
    var nb = row.querySelectorAll('button')[1];
    nb.style.border = '2px solid ' + ((LINES[nextCh.id] || {}).acc || '#F2EFE9');
    nb.style.color = '#F2EFE9';
    nb.style.background = 'rgba(23,20,27,.7)';
  }

  var backRow = div('mt-3 flex items-center gap-2', [
    btn('font-tech text-[11px] tracking-[.16em] text-fog px-4 py-2 rounded-full press', ['\u2190 WALL'], function () { go('#/'); }),
    btn('font-tech text-[11px] tracking-[.16em] text-fog px-4 py-2 rounded-full press', ['TRANSIT MAP'], function () { go('#/map'); }),
    btn('font-tech text-[11px] tracking-[.16em] text-fog px-4 py-2 rounded-full press', ['STATION SHEET'], function () { go('#/station/' + gStop.id); })
  ]);

  fill(content, [top, stamp, gname, quip, meter, row, backRow]);
  wrap.appendChild(content);

  /* meter bar of 19 ticks */
  function meterBar() {
    var bar = div('flex gap-1', []);
    chains.forEach(function (ch2) {
      var t = el('span', 'flex-1 rounded-full');
      t.style.height = '6px';
      if (claimedSet.has(ch2.id)) t.style.background = (LINES[ch2.id] || {}).acc || '#F2EFE9';
      else t.style.background = 'rgba(255,255,255,.14)';
      bar.appendChild(t);
    });
    return bar;
  }

  /* ---- share card ---- */
  function openShare() {
    var modal = div('fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4');
    var box = div('w-full max-w-[350px] bg-ink2 border border-white/10 rounded-xl p-3', []);
    var cv = drawShare(chainId);
    cv.className = 'w-full rounded-lg block';
    var rowB = div('mt-3 grid grid-cols-3 gap-2', []);
    var save = btn('font-tech text-[11px] tracking-wide py-2.5 rounded-full bg-bone text-ink font-bold press', ['SAVE'], function () {
      cv.toBlob(function (blob) {
        if (!blob) return;
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'unpacked-' + chainId + '-card.png';
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      }, 'image/png');
    });
    var copyB = btn('font-tech text-[11px] tracking-wide py-2.5 rounded-full border border-white/15 press', ['COPY TEXT'], function () {
      var st2 = BEATS[gStop.id];
      var text = SERIES.shareKicker ? (SERIES.shareKicker + ' the ' + ch.name + ' line, all the way down to ' + (m.ground || '') + '. ') : '';
      if (st2) text += st2.stat.v + (st2.stat.u ? ' ' + st2.stat.u : '') + ': ' + (st2.stat.l || '') + '. ';
      text += (SERIES.shareUrl || '');
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () {
        copyB.textContent = 'COPIED';
        setTimeout(function () { copyB.textContent = 'COPY TEXT'; }, 1600);
      });
    });
    var closeB = btn('font-tech text-[11px] tracking-wide py-2.5 rounded-full border border-white/15 press', ['CLOSE'], function () { modal.remove(); });
    fill(rowB, [save, copyB, closeB]);
    fill(box, [cv, rowB]);
    modal.appendChild(box);
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.remove(); });
    function esc(e) { if (e.key === 'Escape') { modal.remove(); document.removeEventListener('keydown', esc); } }
    document.addEventListener('keydown', esc);
    document.body.appendChild(modal);
  }

  return wrap;
}

function drawShare(chainId) {
  var m = LINES[chainId], ch = chainById[chainId];
  var stops = ch.stops, gStop = stops[stops.length - 1], beat = BEATS[gStop.id] || {};
  var cv = document.createElement('canvas');
  cv.width = 1080; cv.height = 1350;
  var ctx = cv.getContext('2d');
  ctx.fillStyle = '#141218';
  ctx.fillRect(0, 0, 1080, 1350);
  var glow = ctx.createRadialGradient(200, 160, 40, 200, 160, 700);
  glow.addColorStop(0, 'color-mix(in srgb, ' + (m.acc || '#F2EFE9') + ' 25%, transparent)');
  glow.addColorStop(1, 'rgba(20,18,24,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1080, 1350);

  ctx.fillStyle = '#A9A2A8';
  ctx.font = '700 30px "JetBrains Mono", monospace';
  ctx.fillText('U N P A C K E D', 80, 110);
  ctx.font = '400 26px "JetBrains Mono", monospace';
  ctx.fillStyle = '#6E6670';
  ctx.fillText((m.code || '') + ' LINE', 80, 156);

  ctx.fillStyle = '#F2EFE9';
  ctx.font = '600 92px "Clash Display", "Space Grotesk", sans-serif';
  wrapText(ctx, ch.name, 80, 320, 900, 104).forEach(function (ln, i) {
    ctx.fillText(ln, 80, 320 + i * 104);
  });
  ctx.fillStyle = '#A9A2A8';
  ctx.font = '400 38px "Space Grotesk", sans-serif';
  ctx.fillText('rode end to end, ' + (stops.length - 1) + ' stops deep', 80, 320 + 1 * 104 + 46);

  var stv = String((beat.stat || {}).v || '');
  var stu = String((beat.stat || {}).u || '');
  var stl = String((beat.stat || {}).l || '');
  ctx.fillStyle = m.acc || '#F2EFE9';
  ctx.font = '700 ' + (stv.length > 6 ? 170 : 260) + 'px "JetBrains Mono", monospace';
  var baseY = 780;
  ctx.fillText(stv, 80, baseY);
  if (stu) {
    var wid = ctx.measureText(stv).width;
    ctx.font = '700 80px "JetBrains Mono", monospace';
    ctx.fillText(stu, 100 + wid, baseY - 130);
  }
  ctx.fillStyle = '#A9A2A8';
  ctx.font = '400 40px "JetBrains Mono", monospace';
  wrapText(ctx, stl, 80, baseY + 70, 880, 54).forEach(function (ln, i) {
    ctx.fillText(ln, 80, baseY + 70 + i * 54);
  });

  ctx.fillStyle = '#F2EFE9';
  ctx.font = '600 56px "Clash Display", sans-serif';
  ctx.fillText('the line ends at', 80, 1120);
  ctx.fillStyle = m.acc || '#F2EFE9';
  ctx.font = '600 72px "Clash Display", sans-serif';
  wrapText(ctx, m.ground || '', 80, 1210, 900, 78).forEach(function (ln, i) {
    ctx.fillText(ln, 80, 1210 + i * 78);
  });

  ctx.fillStyle = '#6E6670';
  ctx.font = '400 26px "JetBrains Mono", monospace';
  ctx.fillText(SERIES.shareFooter || 'every stat verified', 80, 1300);

  return cv;
}
function wrapText(ctx, text, x, y, maxW, lineHeight) {
  var words = String(text).split(' ');
  var lines = [], cur = '';
  words.forEach(function (w) {
    var t = cur ? cur + ' ' + w : w;
    if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; }
    else cur = t;
  });
  if (cur) lines.push(cur);
  return lines;
}

/* ================= TRANSIT MAP ================= */
function MapView() {
  var root = el('div', 'min-h-dvh relative');
  var colW = 128, rowH = 108, padX = 60, padTop = 120, padBot = 80;
  var maxE = 0;
  (C.chains || []).forEach(function (ch) { (ch.nodes || []).forEach(function (nd) { if (nd.echelon > maxE) maxE = nd.echelon; }); });
  var rows = maxE + 1;
  var W = padX * 2 + chains.length * colW;
  var H = padTop + rows * rowH + padBot;

  var bar = div('sticky top-0 z-30 bg-ink/90 backdrop-blur-lg border-b border-white/10 px-4 py-3 flex items-center gap-3', [
    btn('press w-9 h-9 rounded-full border border-white/15 bg-ink2 text-bone font-tech', ['\u2190'], function () { go('#/'); }),
    fill(el('h1', 'font-disp font-semibold text-xl'), ['The Transit Map']),
    span('flex-1', []),
    pill(tour.lines + ' LINES \u00B7 ' + tour.stops + ' STATIONS \u00B7 ' + tour.nodes + ' NODES \u00B7 ' + tour.grounds + ' GROUNDS', 'font-tech text-[10px] tracking-[.12em] px-3 py-1.5 rounded-full bg-white/5 text-fog border border-white/10')
  ]);
  root.appendChild(bar);

  var scroll = div('scroller overflow-x-auto', []);
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', W); svg.setAttribute('height', H);
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  scroll.appendChild(svg);
  var mapWrap = div('relative');
  mapWrap.appendChild(scroll);
  var fadeL = el('div', 'pointer-events-none absolute inset-y-0 left-0 w-16 z-10');
  fadeL.style.background = 'linear-gradient(to right, #0F0D10 22%, rgba(15,13,16,0) 100%)';
  fadeL.style.opacity = '0';
  var fadeR = el('div', 'pointer-events-none absolute inset-y-0 right-0 w-20 z-10');
  fadeR.style.background = 'linear-gradient(to left, #0F0D10 22%, rgba(15,13,16,0) 100%)';
  mapWrap.appendChild(fadeL); mapWrap.appendChild(fadeR);
  var hint = el('div', 'pointer-events-none absolute bottom-2 right-4 z-10 font-tech text-[10px] tracking-[.2em] text-dim');
  hint.textContent = 'SCROLL TO EXPLORE \u2192';
  mapWrap.appendChild(hint);
  scroll.addEventListener('scroll', function () {
    var max = scroll.scrollWidth - scroll.clientWidth;
    fadeR.style.opacity = scroll.scrollLeft < max - 8 ? '1' : '0';
    fadeL.style.opacity = scroll.scrollLeft > 8 ? '1' : '0';
    hint.style.opacity = scroll.scrollLeft > 24 ? '0' : '1';
  });
  root.appendChild(mapWrap);

  var NS = 'http://www.w3.org/2000/svg';
  function mk(tag, attrs, kids) {
    var n = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    (kids || []).forEach(function (k) { if (k) n.appendChild(k); });
    return n;
  }
  function mtext(x, y, s, attrs) {
    var t = mk('text', Object.assign({ x: x, y: y, fill: '#A9A2A8', 'font-family': '"JetBrains Mono", monospace', 'font-size': '9', 'text-anchor': 'middle' }, attrs || {}));
    t.textContent = s;
    return t;
  }

  var legend = div('px-4 pb-10 pt-2 max-w-4xl mx-auto', []);
  var lgTitle = el('p', 'font-tech text-[11px] tracking-[.2em] text-dim mt-6 mb-2');
  lgTitle.textContent = 'EQUELON ROWS 0-4 \u00B7 SOLID = ON THE RIDE \u00B7 RING = INTERCHANGE (SAME NODE NAME ON TWO LINES) \u00B7 TAP ANY NODE';
  lgTitle.textContent = 'ECHELON ROWS 0-4 \u00B7 SOLID = ON THE RIDE \u00B7 RING = INTERCHANGE (SAME NAME ON 2+ LINES) \u00B7 TAP ANY NODE';
  legend.appendChild(lgTitle);
  var famRow = div('flex flex-wrap gap-2', []);
  Object.keys(FAMS).forEach(function (f) {
    var fdata = FAMS[f];
    var chips = chains.filter(function (c) { return (LINES[c.id] || {}).fam === f; });
    if (!chips.length) return;
    var p = pill(fdata.label.toUpperCase() + ' \u00B7 ' + chips.length + ' LINE' + (chips.length > 1 ? 'S' : ''),
      'font-tech text-[10px] tracking-[.12em] px-3 py-1.5 rounded-full bg-white/5 text-fog border border-white/10');
    famRow.appendChild(p);
  });
  legend.appendChild(famRow);
  var note = el('p', 'text-fog/80 text-[13px] mt-4');
  note.textContent = (SERIES.groundsNote || '') + '. The ride travels ' + tour.stops + ' of these stations; the rest power it from the side. Grounds are where lines stop digging.';
  legend.appendChild(note);
  root.appendChild(legend);

  /* draw: chains as columns */
  chains.forEach(function (ch, ci) {
    var meta = LINES[ch.id] || {};
    var acc = meta.acc || '#F2EFE9';
    var cx = padX + ci * colW + colW / 2;

    svg.appendChild(mtext(cx, padTop - 34, meta.code || '', { fill: acc, 'font-size': '20', 'font-weight': '700' }));
    svg.appendChild(mtext(cx, padTop - 16, String(ci + 1).padStart(2, '0'), { fill: '#6E6670', 'font-size': '9' }));

    var nodes = (C.chains.find(function (x) { return x.id === ch.id; }) || { nodes: [] }).nodes || [];
    var posById = {};
    nodes.forEach(function (nd) {
      var ry = padTop + nd.echelon * rowH;
      posById[nd.id] = { x: cx, y: ry, nd: nd };
    });
    var rows2 = [];
    nodes.forEach(function (nd) {
      var e2 = nd.echelon | 0;
      (rows2[e2] = rows2[e2] || []).push(nd.id);
    });
    var slotK = {};
    rows2.forEach(function (ids) {
      if (!ids) return;
      var k = ids.length;
      if (k < 2) return;
      var step = k >= 3 ? 24 : 30;
      ids.forEach(function (id, i2) {
        slotK[id] = k;
        posById[id].y += i2 * step;
      });
    });
    nodes.forEach(function (nd) {
      var p = posById[nd.id];
      (nd.inputs || []).forEach(function (inp) {
        var q = posById[inp];
        if (!q) return;
        svg.appendChild((function () { var pp = mk('path', { d: 'M' + q.x + ',' + q.y + ' L' + p.x + ',' + p.y, stroke: acc, 'stroke-opacity': '.35', 'stroke-width': '5', fill: 'none', 'stroke-linecap': 'round', 'class': 'mdraw' }); pp.style.animationDelay = (p.nd.echelon * 130) + 'ms'; return pp; })());
      });
    });
    nodes.forEach(function (nd) {
      var p = posById[nd.id];
      var isStop = !!BEATS[nd.id];
      var isShared = (nameBucket[nd.name] || []).length > 1;
      var g = mk('g', { class: 'mnode' });
      if (isShared) {
        g.appendChild(mk('circle', { cx: p.x, cy: p.y, r: 13, fill: '#0F0D10', stroke: acc, 'stroke-width': '3' }));
      }
      g.appendChild(mk('circle', {
        cx: p.x, cy: p.y, r: isStop ? 7 : 4.5,
        fill: isStop ? acc : 'color-mix(in srgb, ' + acc + ' 38%, transparent)',
        stroke: isStop ? '#0F0D10' : acc, 'stroke-width': isStop ? 2.5 : 1.2
      }));
      g.appendChild(mk('title', {}, [])).textContent = nd.name + (isStop ? ' \u00B7 station' : ' \u00B7 map-only node');
      var label = isStop || isShared;
      if (label) {
        var kk = slotK[nd.id] || 1;
        var maxc = kk > 1 ? 12 : 16;
        var nm = nd.name.length > maxc ? nd.name.slice(0, maxc - 1) + '\u2026' : nd.name;
        g.appendChild(mtext(p.x, p.y + 18, nm, { fill: isStop ? '#F2EFE9' : '#6E6670', 'font-size': kk > 1 ? '9' : (isStop ? '10' : '9') }));
      }
      g.addEventListener('click', function () { go('#/station/' + nd.id); });
      svg.appendChild(g);
    });
  });

  return root;
}

/* ================= STATION SHEET ================= */
function StationView(nodeId) {
  var node = nodeById[nodeId];
  var m = LINES[node.chainId] || {};
  var ch = chainById[node.chainId];
  var isStop = !!BEATS[nodeId];
  var sm = stopMeta[nodeId];

  var root = el('div', 'min-h-dvh relative');

  var photo = imgSrc(nodeId);
  if (photo) {
    var heroWrap = el('div', 'relative h-[46vh] min-h-[300px]');
    heroWrap.appendChild(shotLayer(photo, 'absolute inset-0'));
    root.appendChild(heroWrap);
  } else {
    var spacer = div('h-24', []);
    root.appendChild(spacer);
  }

  var sheet = div('relative z-10 -mt-10 rounded-t-xl border-t border-white/10 bg-ink min-h-[54vh] px-5 pb-16 pt-5 max-w-2xl mx-auto', []);

  var top = div('flex items-center justify-between gap-2 mb-4', [
    btn('press w-9 h-9 rounded-full border border-white/15 bg-ink2 text-bone font-tech', ['\u2190'], function () { history.back(); }),
    div('flex items-center gap-2', [chipCode(m.code || '', m.acc || '#F2EFE9'), pill((FAMS[m.fam] || {}).label || '')])
  ]);
  sheet.appendChild(top);

  sheet.appendChild(fill(el('h1', 'font-disp font-semibold text-3xl leading-tight'), [node.name]));
  if (isStop) {
    var pos = span('font-tech text-[10px] tracking-[.2em] text-dim mt-2 block', []);
    pos.textContent = 'STATION ' + (sm.idx + 1) + '/' + sm.chain.stops.length + ' ON THE ' + (m.code || '') + ' LINE';
    sheet.appendChild(pos);
  } else {
    var pos2 = span('font-tech text-[10px] tracking-[.2em] text-dim mt-2 block', []);
    pos2.textContent = 'MAP-ONLY NODE \u00B7 ECHELON ' + node.echelon + ' \u00B7 THE ' + (m.code || '') + ' LINE';
    sheet.appendChild(pos2);
  }

  if (isStop) {
    var beat = BEATS[nodeId];
    var statRow = div('flex items-baseline gap-2 mt-4 font-tech', []);
    var num = span('font-bold leading-none', [String(beat.stat.v)]);
    num.style.color = 'var(--acc)';
    num.style.fontSize = 'clamp(2.6rem, 9vw, 3.6rem)';
    statRow.appendChild(num);
    if (beat.stat.u) statRow.appendChild(span('text-lg text-fog', [beat.stat.u]));
    sheet.appendChild(statRow);
    var lab = el('p', 'font-tech text-[12px] tracking-wide text-fog mt-1');
    lab.textContent = beat.stat.l || '';
    sheet.appendChild(lab);
    var body = el('p', 'text-[15px] leading-relaxed text-bone/90 mt-4');
    body.textContent = beat.b;
    sheet.appendChild(body);
  } else {
    var desc = el('p', 'text-[15px] leading-relaxed text-bone/85 mt-4');
    desc.textContent = node.description || '';
    sheet.appendChild(desc);
  }

  /* specs */
  if ((node.specs || []).length) {
    var spTitle = el('p', 'font-tech text-[11px] tracking-[.2em] text-dim mt-7 mb-2');
    spTitle.textContent = 'SPECS';
    sheet.appendChild(spTitle);
    var spGrid = div('flex flex-wrap gap-2', []);
    node.specs.forEach(function (s) {
      spGrid.appendChild(pill(s.label.toUpperCase() + ': ' + s.value + (s.unit || ''), 'font-tech text-[11px] tracking-[.08em] px-3 py-1.5 rounded-full bg-white/5 text-bone/90 border border-white/10'));
    });
    sheet.appendChild(spGrid);
  }

  /* history */
  if (isStop && stopMeta[nodeId].stop.history) {
    var hTitle = el('p', 'font-tech text-[11px] tracking-[.2em] text-dim mt-7 mb-2');
    hTitle.textContent = 'HISTORY';
    sheet.appendChild(hTitle);
    var hBody = el('p', 'text-[14px] leading-relaxed text-fog');
    hBody.textContent = stopMeta[nodeId].stop.history;
    sheet.appendChild(hBody);
  } else if (node.history) {
    var hTitle2 = el('p', 'font-tech text-[11px] tracking-[.2em] text-dim mt-7 mb-2');
    hTitle2.textContent = 'HISTORY';
    sheet.appendChild(hTitle2);
    var hBody2 = el('p', 'text-[14px] leading-relaxed text-fog');
    hBody2.textContent = node.history;
    sheet.appendChild(hBody2);
  }

  /* process (map-only nodes) */
  if (!isStop && (node.process || []).length) {
    var pTitle = el('p', 'font-tech text-[11px] tracking-[.2em] text-dim mt-7 mb-2');
    pTitle.textContent = 'HOW IT IS MADE';
    sheet.appendChild(pTitle);
    var ol = el('ol', 'space-y-1.5');
    node.process.forEach(function (s, i) {
      var li = el('li', 'text-[14px] text-fog flex gap-2');
      li.appendChild(span('font-tech text-[11px] text-dim mt-[3px]', [String(i + 1).padStart(2, '0')]));
      li.appendChild(span(null, [s]));
      ol.appendChild(li);
    });
    sheet.appendChild(ol);
  }

  /* shared-name interchanges */
  var others = (nameBucket[node.name] || []).filter(function (id2) { return id2 !== nodeId; });
  if (others.length) {
    var shTitle = el('p', 'font-tech text-[11px] tracking-[.2em] text-dim mt-7 mb-2');
    shTitle.textContent = 'SHARED WITH ' + others.length + ' OTHER NODE' + (others.length > 1 ? 'S' : '');
    sheet.appendChild(shTitle);
    var shRow = div('flex flex-wrap gap-2', []);
    others.forEach(function (id2) {
      var other = nodeById[id2];
      var om = LINES[other.chainId] || {};
      var c2 = btn(null, null, function () { go('#/station/' + id2); });
      c2.className = 'font-tech text-[10px] tracking-[.14em] px-3 py-1.5 rounded-full border press';
      c2.style.borderColor = 'color-mix(in srgb, ' + om.acc + ' 45%, transparent)';
      c2.style.color = om.acc || '#F2EFE9';
      c2.style.background = 'color-mix(in srgb, ' + om.acc + ' 12%, transparent)';
      c2.textContent = (om.code || '') + ' \u00B7 ' + other.name;
      shRow.appendChild(c2);
    });
    sheet.appendChild(shRow);
  }

  /* photo credit */
  var file = IMG[nodeId];
  if (file) {
    var credit = el('p', 'font-tech text-[10px] tracking-wide text-dim mt-7');
    var man = window.UNPACKED_CREDITS && window.UNPACKED_CREDITS[file];
    var label = man ? ('PHOTO: ' + man.title + ' \u00B7 ' + man.licc) : 'PHOTO: WIKIMEDIA COMMONS \u00B7 SEE LOADED ATTRIBUTION LOG';
    credit.textContent = label;
    if (man && man.url) {
      var a = el('a', 'underline hover:text-fog');
      a.textContent = label;
      a.href = man.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      credit.replaceChildren(a);
    }
    sheet.appendChild(credit);
  }

  /* ride / neighbors */
  var nav = div('mt-8 flex flex-wrap items-center gap-3', []);
  if (isStop) {
    var ride = btn('font-tech text-[12px] tracking-[.18em] font-bold px-5 py-3 rounded-full press', ['RIDE THE LINE \u2192'], function () { go('#/stop/' + nodeId); });
    ride.style.background = 'var(--acc)';
    ride.style.color = '#141118';
    nav.appendChild(ride);
    if (sm.idx > 0) nav.append(pill('\u2190 PREV: ' + sm.chain.stops[sm.idx - 1].name.toUpperCase()));
    if (sm.idx < sm.chain.stops.length - 1) nav.append(pill('NEXT: ' + sm.chain.stops[sm.idx + 1].name.toUpperCase() + ' \u2192'));
  }
  sheet.appendChild(nav);

  var mapRow = div('mt-6', [
    btn('font-tech text-[11px] tracking-[.16em] text-fog px-4 py-2 rounded-full border border-white/10 press', ['SEE THE LINE ON THE TRANSIT MAP'], function () { go('#/map'); })
  ]);
  sheet.appendChild(mapRow);

  root.appendChild(sheet);
  return root;
}

/* ---------------- boot ---------------- */
function boot() { if (!window.__routeBooted) { window.__routeBooted = true; route(); } }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
})();
