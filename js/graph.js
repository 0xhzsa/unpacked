/* UNPACKED — dependency graph finale.
 * Orthogonal directed graph of a manufacturing chain: object at top,
 * echelon 4 sources at bottom. renderFull() merges every chain so the
 * shared sources (bauxite, iron ore, SPCC, crude oil) fan into all objects.
 * Plain browser JS. Reads window.CONTENT from js/content.js:
 *   CONTENT.chains = [{ id, name, color, nodes: [{ id, name, echelon,
 *     color, inputs: [childIds], ... }] }]
 */
(function () {
  "use strict";

  var AMBER = "#e8861d", EDGE = "#2a2a2a", FILL = "#0d0d0d", FILL_HOT = "#141414";
  var TEXT = "#e5e5e5", MUTED = "#8a8a8a", DIM = "#525252";
  var NODE_W = 120, NODE_H = 40, H_GAP = 40, ROW_GAP = 12, V_GAP = 64, PAD = 56;
  var EDGE_MS = 600, HOVER_MS = 150, STAGGER_MS = 110;
  var MONO = '"IBM Plex Mono", Menlo, Monaco, "Courier New", monospace';

  var S = {
    canvas: null, ctx: null, dpr: 1, w: 0, h: 0,
    graph: null, nodes: [], bands: [], bounds: null,
    mode: "full", objectId: null, stats: { nodes: 0, edges: 0, echelons: 0 },
    fit: { s: 1, tx: 0, ty: 0 },
    hoverId: null, onNodeClick: null,
    animStart: 0, rafId: null, lastNow: null, ro: null, listeners: [],
    chrome: null // {top, bottom, stats} UI-owned margins, see setChrome()
  };

  /* ---------------------------------------------------------------- data */

  function chainList() { return (window.CONTENT && window.CONTENT.chains) || []; }

  function norm(s) { return String(s == null ? "" : s).toLowerCase().replace(/\s+/g, " ").trim(); }

  // merge=true collapses same-named nodes across chains (Bauxite Mine,
  // Iron Ore Mine, SPCC coil, ...) so the shared structure shows up.
  function buildGraph(chains, merge) {
    var nodes = [], byId = Object.create(null), edges = [], seen = Object.create(null);

    function add(chain, src) {
      var key = merge ? norm(src.name) : src.id, node = byId[key];
      if (node) {
        if (node.chains.indexOf(chain.id) < 0) node.chains.push(chain.id);
        return node;
      }
      node = {
        id: key, name: src.name, echelon: src.echelon | 0, color: src.color || "#666666",
        chains: [chain.id], x: 0, y: 0, w: NODE_W, h: NODE_H, band: 0,
        state: "default", hover: 0, portTop: false, portBot: false
      };
      byId[key] = node;
      nodes.push(node);
      return node;
    }

    chains.forEach(function (chain) {
      var m = Object.create(null);
      chain.nodes.forEach(function (n) { m[n.id] = add(chain, n).id; });
      chain.nodes.forEach(function (n) {
        var from = m[n.id];
        (n.inputs || []).forEach(function (cid) {
          var to = m[cid];
          if (!from || !to || from === to || seen[from + ">" + to]) return;
          seen[from + ">" + to] = 1;
          edges.push({ from: from, to: to, pts: [], len: 0, t0: 0 });
        });
      });
    });
    return { nodes: nodes, edges: edges, byId: byId };
  }

  /* -------------------------------------------------------------- layout */

  // Order a layer by the mean position of its relatives in the reference
  // layer, which keeps edge crossings down without a full graph layout.
  function sortLayer(layer, ref, links) {
    var pos = Object.create(null), base = Object.create(null);
    ref.forEach(function (n, i) { pos[n.id] = i; });
    layer.forEach(function (n, i) { base[n.id] = i; });
    var keyed = layer.map(function (n) {
      var rel = links[n.id] || [], sum = 0, c = 0;
      for (var i = 0; i < rel.length; i++) if (pos[rel[i]] !== undefined) { sum += pos[rel[i]]; c++; }
      return { n: n, k: c ? sum / c : ref.length + base[n.id], b: base[n.id] };
    });
    keyed.sort(function (a, b) { return a.k - b.k || a.b - b.b; });
    return keyed.map(function (x) { return x.n; });
  }

  // L-shaped orthogonal route: parent bottom -> mid gap -> child top.
  function route(e, a, b) {
    var x1 = Math.round(a.x + a.w / 2) + 0.5, y1 = Math.round(a.y + a.h) + 0.5;
    var x2 = Math.round(b.x + b.w / 2) + 0.5, y2 = Math.round(b.y) + 0.5;
    var pts = [[x1, y1]];
    if (Math.abs(x2 - x1) > 1) {
      var my = Math.round((y1 + y2) / 2) + 0.5;
      if (my < y1 + 6) my = y1 + 6;
      pts.push([x1, my], [x2, my]);
    }
    pts.push([x2, y2]);
    var len = 0;
    for (var i = 1; i < pts.length; i++) len += Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]);
    e.pts = pts;
    e.len = len;
    a.portBot = true;
    b.portTop = true;
  }

  function bandSize(n, cols) {
    var c = Math.min(cols, n), rows = Math.ceil(n / c);
    return { c: c, rows: rows, h: rows * NODE_H + (rows - 1) * ROW_GAP, w: c * NODE_W + (c - 1) * H_GAP };
  }

  // Column count is a trade: fewer columns make a narrower but taller
  // world. Pick the one that maximises the fitted scale so the finale
  // stays legible instead of shrinking everything to fit one row.
  function chooseCols(levels, counts, availW) {
    if (!S.w || !S.h) return Math.max(1, Math.floor((availW + H_GAP) / (NODE_W + H_GAP)));
    var best = -1, bestCols = 1, maxN = Math.max.apply(null, counts);
    for (var c = 1; c <= maxN; c++) {
      var h = 0, w = 0;
      for (var i = 0; i < levels.length; i++) { var b = bandSize(counts[i], c); h += b.h + V_GAP; w = Math.max(w, b.w); }
      var s = fitScale(w, h - V_GAP);
      if (s >= best) { best = s; bestCols = c; }
    }
    return bestCols;
  }

  function layout(availW) {
    var g = S.graph;
    if (!g) return;
    var par = Object.create(null), chd = Object.create(null);
    g.edges.forEach(function (e) {
      (par[e.to] = par[e.to] || []).push(e.from);
      (chd[e.from] = chd[e.from] || []).push(e.to);
    });

    var byEcho = Object.create(null);
    g.nodes.forEach(function (n) {
      n.portTop = n.portBot = false;
      (byEcho[n.echelon] = byEcho[n.echelon] || []).push(n);
    });
    var levels = Object.keys(byEcho).map(Number).sort(function (a, b) { return a - b; });
    var order = Object.create(null);
    levels.forEach(function (L, i) {
      order[L] = i ? sortLayer(byEcho[L], order[levels[i - 1]], par) : byEcho[L];
    });
    for (var i = levels.length - 2; i >= 0; i--) order[levels[i]] = sortLayer(order[levels[i]], order[levels[i + 1]], chd);

    var counts = levels.map(function (L) { return order[L].length; });
    var cols = chooseCols(levels, counts, availW), cursor = 0, maxW = 0;
    S.bands = [];
    levels.forEach(function (L) {
      var layer = order[L], band = bandSize(layer.length, cols), bandIndex = S.bands.length;
      S.bands.push({ L: L, y: cursor, h: band.h });
      layer.forEach(function (n, i) {
        var r = Math.floor(i / band.c), col = i % band.c;
        var inRow = Math.min(band.c, layer.length - r * band.c);
        var rowW = inRow * NODE_W + (inRow - 1) * H_GAP;
        n.x = Math.round(-rowW / 2 + col * (NODE_W + H_GAP));
        n.y = Math.round(cursor + r * (NODE_H + ROW_GAP));
        n.band = bandIndex;
      });
      cursor += band.h + V_GAP;
      maxW = Math.max(maxW, band.w);
    });

    g.edges.forEach(function (e) { route(e, g.byId[e.from], g.byId[e.to]); });
    var h = Math.max(1, cursor - V_GAP);
    S.bounds = { minX: -maxW / 2, maxX: maxW / 2, minY: 0, maxY: h, cx: 0, cy: h / 2, w: Math.max(1, maxW), h: h };
    refit();
  }

  // Reserved margins: the count overlay owns the top-left, the scale tick
  // the bottom-right, so content is centred inside what is left. setChrome()
  // lets the host page reserve those regions for its own chrome (title bar,
  // quote panel) instead of the built-in overlay.
  function topReserve() {
    if (S.chrome && S.chrome.top != null) return S.chrome.top;
    return S.mode === "full" ? 64 : 32;
  }
  function bottomReserve() {
    if (S.chrome && S.chrome.bottom != null) return S.chrome.bottom;
    return 32;
  }

  function fitScale(w, h) {
    var s = Math.min(1, (S.w - PAD) / w, (S.h - topReserve() - bottomReserve()) / h);
    return isFinite(s) && s > 0 ? s : 1;
  }

  function refit() {
    if (!S.w || !S.h || !S.bounds) return;
    var b = S.bounds;
    S.fit.s = fitScale(b.w, b.h);
    S.fit.tx = S.w / 2 - b.cx * S.fit.s;
    S.fit.ty = (topReserve() + (S.h - bottomReserve())) / 2 - b.cy * S.fit.s;
  }

  function setChrome(cfg) {
    S.chrome = cfg || null;
    if (S.bounds) refit();
    kick();
  }

  function availW() { return S.w > 160 ? S.w - PAD : 900; }

  function startAnim() {
    S.animStart = (window.performance && performance.now) ? performance.now() : Date.now();
    S.lastNow = null;
    S.graph.edges.forEach(function (e) { e.t0 = S.animStart + (S.graph.byId[e.from].band || 0) * STAGGER_MS; });
  }

  function computeStats() {
    var ech = Object.create(null), obj = Object.create(null), shared = 0;
    S.nodes.forEach(function (n) {
      ech[n.echelon] = 1;
      n.chains.forEach(function (c) { obj[c] = 1; });
      if (n.chains.length > 1) shared++;
    });
    S.stats = {
      nodes: S.nodes.length, edges: S.graph.edges.length,
      echelons: Object.keys(ech).length, objects: Object.keys(obj).length, shared: shared
    };
    return S.stats;
  }

  /* -------------------------------------------------------------- render */

  function wrapLabel(text, maxChars) {
    var words = String(text).toUpperCase().split(/\s+/), lines = [], cur = "";
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (!cur) cur = w;
      else if (cur.length + 1 + w.length <= maxChars) cur += " " + w;
      else { lines.push(cur); cur = w; }
      while (cur.length > maxChars) { lines.push(cur.slice(0, maxChars - 1) + "-"); cur = cur.slice(maxChars - 1); }
    }
    if (cur) lines.push(cur);
    if (lines.length > 2) {
      lines = lines.slice(0, 2);
      lines[1] = lines[1].slice(0, maxChars - 1) + "…";
    }
    return lines;
  }

  function drawNode(ctx, n) {
    var hovered = n.hover > 0;
    var bw = 1, bc = n.color, fill = FILL, alpha = 1, fg = TEXT;
    if (n.state === "current") { bw = 2; bc = AMBER; fill = FILL_HOT; fg = AMBER; }
    else if (n.state === "visited") { bc = AMBER; fg = AMBER; }
    else if (n.state === "future") { alpha = 0.4 + 0.6 * n.hover; fg = DIM; }
    if (n.state !== "current" && hovered) fill = FILL_HOT;
    if (hovered && n.state !== "future") fg = TEXT;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = fill;
    ctx.fillRect(n.x, n.y, n.w, n.h);
    ctx.lineWidth = bw;
    ctx.strokeStyle = bc;
    ctx.strokeRect(n.x + bw / 2, n.y + bw / 2, n.w - bw, n.h - bw);

    ctx.fillStyle = fg;
    ctx.font = "10px " + MONO;
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0.05em";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    var lines = wrapLabel(n.name, Math.floor((n.w - 12) / 6.05));
    var y0 = n.y + (n.h - lines.length * 12) / 2 + 9;
    for (var i = 0; i < lines.length; i++) ctx.fillText(lines[i], n.x + 6, y0 + i * 12);

    if (n.portTop) { ctx.fillStyle = AMBER; ctx.fillRect(n.x + n.w / 2 - 1, n.y - 1, 2, 2); }
    if (n.portBot) { ctx.fillStyle = AMBER; ctx.fillRect(n.x + n.w / 2 - 1, n.y + n.h - 1, 2, 2); }
    if (S.mode === "full" && n.chains.length > 1) {
      ctx.fillStyle = AMBER;
      ctx.fillRect(n.x + n.w - 6, n.y + 3, 3, 3);
    }
    ctx.restore();
  }

  function drawEdge(ctx, e, now) {
    var to = S.graph.byId[e.to];
    var active = to && (to.state === "visited" || to.state === "current");
    var p = (now - e.t0) / EDGE_MS;
    if (p < 0) return true;
    if (p > 1) p = 1;
    if (!e.len || p === 0) return p < 1;

    ctx.save();
    ctx.strokeStyle = active ? AMBER : EDGE;
    ctx.lineWidth = 1;
    ctx.setLineDash([e.len, e.len]);
    ctx.lineDashOffset = e.len * (1 - p);
    ctx.beginPath();
    ctx.moveTo(e.pts[0][0], e.pts[0][1]);
    for (var i = 1; i < e.pts.length; i++) ctx.lineTo(e.pts[i][0], e.pts[i][1]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;
    if (p >= 1) {
      var t = e.pts[e.pts.length - 1];
      ctx.beginPath();
      ctx.moveTo(t[0] - 4, t[1] - 5);
      ctx.lineTo(t[0], t[1]);
      ctx.lineTo(t[0] + 4, t[1] - 5);
      ctx.stroke();
    }
    ctx.restore();
    return p < 1;
  }

  function drawBands(ctx) {
    ctx.save();
    ctx.font = "9px " + MONO;
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0.05em";
    ctx.fillStyle = DIM;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    S.bands.forEach(function (b) { ctx.fillText("E" + b.L, S.bounds.minX - 10, b.y + b.h / 2); });
    ctx.restore();
  }

  // Count overlay: the UI may also read the same numbers from stats().
  function drawOverlay(ctx) {
    var st = S.stats;
    ctx.save();
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0.05em";
    ctx.font = "10px " + MONO;
    ctx.textBaseline = "top";
    if (S.mode === "full" && !(S.chrome && S.chrome.stats === false)) {
      ctx.textAlign = "left";
      ctx.fillStyle = AMBER;
      ctx.fillText("FULL GRAPH", 16, 16);
      ctx.fillStyle = MUTED;
      ctx.fillText(st.objects + " OBJECTS · " + st.nodes + " NODES · " + st.edges + " EDGES", 16, 30);
      ctx.fillStyle = DIM;
      ctx.fillText(st.echelons + " ECHELONS · " + st.shared + " SHARED NODES FAN OUT", 16, 44);
    }
    ctx.textAlign = "right";
    ctx.fillStyle = DIM;
    ctx.fillText("SCALE " + (1 / S.fit.s).toFixed(2) + ":1", S.w - 16, S.h - 24);
    if (S.mode === "chain" && S.objectId) {
      var obj = chainList().filter(function (c) { return c.id === S.objectId; })[0];
      if (obj) { ctx.fillStyle = MUTED; ctx.fillText(String(obj.name).toUpperCase() + " · " + st.nodes + " NODES · " + st.edges + " EDGES", S.w - 16, S.h - 38); }
    }
    ctx.restore();
  }

  function draw(now) {
    if (!S.ctx || !S.graph || !S.bounds || !S.w || !S.h) return false;
    if (S.lastNow == null) S.lastNow = now;
    var dt = Math.min(64, now - S.lastNow);
    S.lastNow = now;

    var busy = false, i, n;
    for (i = 0; i < S.nodes.length; i++) {
      n = S.nodes[i];
      var target = n.id === S.hoverId ? 1 : 0;
      if (n.hover !== target) {
        var step = dt / HOVER_MS;
        n.hover = n.hover < target ? Math.min(target, n.hover + step) : Math.max(target, n.hover - step);
        busy = true;
      }
    }

    var ctx = S.ctx;
    ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
    ctx.clearRect(0, 0, S.w, S.h);
    ctx.save();
    ctx.translate(S.fit.tx, S.fit.ty);
    ctx.scale(S.fit.s, S.fit.s);

    drawBands(ctx);
    for (i = 0; i < S.graph.edges.length; i++) if (drawEdge(ctx, S.graph.edges[i], now)) busy = true;
    for (i = 0; i < S.nodes.length; i++) drawNode(ctx, S.nodes[i]);

    ctx.restore();
    drawOverlay(ctx);
    return busy;
  }

  function tick(now) { S.rafId = null; if (draw(now)) S.rafId = requestAnimationFrame(tick); }
  function kick() { if (!S.rafId) S.rafId = requestAnimationFrame(tick); }

  /* ---------------------------------------------------------- interaction */

  function nodeAt(mx, my) {
    if (!S.bounds) return null;
    var wx = (mx - S.fit.tx) / S.fit.s, wy = (my - S.fit.ty) / S.fit.s;
    for (var i = S.nodes.length - 1; i >= 0; i--) {
      var n = S.nodes[i];
      if (wx >= n.x && wx <= n.x + n.w && wy >= n.y && wy <= n.y + n.h) return n;
    }
    return null;
  }

  function localPoint(ev) {
    var r = S.canvas.getBoundingClientRect();
    return { x: ev.clientX - r.left, y: ev.clientY - r.top };
  }

  function bind(el, type, fn) {
    el.addEventListener(type, fn);
    S.listeners.push({ el: el, type: type, fn: fn });
  }

  function teardown() {
    if (S.ro) { S.ro.disconnect(); S.ro = null; }
    S.listeners.forEach(function (l) { l.el.removeEventListener(l.type, l.fn); });
    S.listeners = [];
    if (S.rafId) { cancelAnimationFrame(S.rafId); S.rafId = null; }
  }

  function resize() {
    if (!S.canvas) return;
    var r = S.canvas.getBoundingClientRect();
    var w = Math.max(0, Math.round(r.width)), h = Math.max(0, Math.round(r.height));
    var dpr = Math.min(window.devicePixelRatio || 1, 3);
    if (!w || !h || (w === S.w && h === S.h && dpr === S.dpr)) return;
    S.w = w; S.h = h; S.dpr = dpr;
    S.canvas.width = Math.round(w * dpr);
    S.canvas.height = Math.round(h * dpr);
    if (S.graph) layout(availW());
    refit();
    kick();
  }

  /* ------------------------------------------------------------------ api */

  function mount(graph, mode, objectId) {
    S.graph = graph;
    S.nodes = graph.nodes;
    S.mode = mode;
    S.objectId = objectId;
    S.nodes.forEach(function (n) { n.state = "default"; });
    layout(availW());
    startAnim();
    kick();
    return computeStats();
  }

  function renderFor(objectId) {
    var list = chainList().filter(function (c) { return c.id === objectId || norm(c.name) === norm(objectId); });
    return list.length ? mount(buildGraph(list, false), "chain", list[0].id) : stats();
  }

  function renderFull() { return mount(buildGraph(chainList(), true), "full", null); }

  function ids(v) { return !v ? [] : Array.isArray(v) ? v : [v]; }

  // setStates({ current, visited, future }) — ids or arrays of ids.
  // Nodes left out fall back to "future" while a traversal is active.
  function setStates(spec) {
    spec = spec || {};
    var cur = ids(spec.current), vis = ids(spec.visited), fut = ids(spec.future);
    function set(a) { var m = Object.create(null); a.forEach(function (id) { m[id] = 1; }); return m; }
    var curSet = set(cur), visSet = set(vis), futSet = set(fut);
    var active = cur.length + vis.length + fut.length > 0;
    S.nodes.forEach(function (n) {
      n.state = curSet[n.id] ? "current" : visSet[n.id] ? "visited"
        : (futSet[n.id] || (active && spec.future === undefined)) ? "future" : "default";
    });
    kick();
    return S.stats;
  }

  function resetStates() {
    S.nodes.forEach(function (n) { n.state = "default"; });
    kick();
  }

  function stats() {
    var s = S.stats;
    return { nodes: s.nodes, edges: s.edges, echelons: s.echelons, objects: s.objects || 0, shared: s.shared || 0 };
  }

  function init(canvasEl) {
    if (!canvasEl || !canvasEl.getContext) return;
    teardown();
    S.canvas = canvasEl;
    S.ctx = canvasEl.getContext("2d");
    S.w = S.h = 0;
    S.hoverId = null;

    function setHover(n) {
      var id = n ? n.id : null;
      if (id === S.hoverId) return;
      S.hoverId = id;
      canvasEl.style.cursor = n ? "pointer" : "";
      kick();
    }
    bind(canvasEl, "mousemove", function (ev) { var p = localPoint(ev); setHover(nodeAt(p.x, p.y)); });
    bind(canvasEl, "mouseleave", function () { setHover(null); });
    bind(canvasEl, "click", function (ev) {
      var p = localPoint(ev), n = nodeAt(p.x, p.y);
      if (n && typeof S.onNodeClick === "function") S.onNodeClick(n.id);
    });

    if (window.ResizeObserver) {
      S.ro = new ResizeObserver(function () { resize(); });
      S.ro.observe(canvasEl);
      if (canvasEl.parentElement) S.ro.observe(canvasEl.parentElement);
    } else {
      bind(window, "resize", resize);
    }

    resize();
    renderFull();
  }

  window.GraphAPI = {
    init: init,
    renderFor: renderFor,
    renderFull: renderFull,
    setOnNodeClick: function (fn) { S.onNodeClick = fn; },
    stats: stats,
    setStates: setStates,
    resetStates: resetStates,
    setChrome: setChrome
  };
})();
