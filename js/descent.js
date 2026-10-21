/*
 * UNPACKED — descent.js
 * A full-screen cinematic descent. For a chosen object you zoom inward through
 * photographic stops: room → object → component → machine → material → source.
 * Two slide layers cross-zoom (Eames "Powers of Ten") between stops; leader-line
 * callouts, a depth meter and a pips rail track where you are.
 *
 * Plain browser JS. Reads window.JOURNEY (js/journey.js) and window.GraphAPI /
 * window.PressSim when available.
 */
(function () {
  "use strict";

  /* ============================================================ image map */
  // stop id -> local asset (assets/img/<key>.jpg). Authored descent -> real photo.
  var IMG = {
    // mechanical keyboard
    "keyboard-room": "room",
    "keyboard-01": "keyboard",
    "keyboard-spring-01": "spring",
    "keyboard-keycap-01": "keycap",
    "keyboard-inj-02": "press",
    "keyboard-mold-tooling": "mold",
    "keyboard-abs-03": "pellets",
    "keyboard-petroleum-04": "oil",

    // LED desk lamp
    "desk-lamp-room": "room",
    "desk-lamp-01": "lamp",
    "desk-lamp-head-01": "pcb",
    "desk-lamp-smt-02": "cnc",
    "desk-lamp-mcpcb-03": "aluminum",
    "desk-lamp-bauxite-04": "bauxite",

    // ergonomic office chair
    "office-chair-room": "room",
    "office-chair-01": "chair",
    "office-chair-base-01": "chaibase",
    "office-chair-injection-02": "press",
    "office-chair-pa-03": "pellets",
    "office-chair-petroleum-04": "oil",

    // ceramic mug
    "ceramic-mug-room": "room",
    "ceramic-mug-01": "mug",
    "ceramic-mug-body-01": "kiln",
    "ceramic-mug-pugmill-02": "pugmill",
    "ceramic-mug-kaolin-03": "clay",
    "ceramic-mug-kaolinmine-04": "mine",

    // steel desk
    "steel-desk-room": "room",
    "steel-desk-01": "metaldesk",
    "steel-desk-top-01": "steel",
    "steel-desk-press-02": "stamping",
    "steel-desk-spcc-03": "foundry",
    "steel-desk-ironore-04": "mine",

    // float glass window
    "glass-window-room": "room",
    "glass-window-01": "window",
    "glass-window-pane-01": "glass",
    "glass-window-float-02": "floatfurnace",
    "glass-window-soda-03": "batch",
    "glass-window-sand-04": "sand",

    // mechanical keyboard (inserted stop)
    "keyboard-switch-01": "switch",

    // hardcover book
    "hardcover-book-room": "room",
    "hardcover-book-01": "book",
    "hardcover-book-pages-01": "sewnspine",
    "hardcover-book-press-02": "offsetpress",
    "hardcover-book-paper-03": "coatedpaper",
    "hardcover-book-forest-04": "sprucelogs",

    // ceiling fan
    "ceiling-fan-room": "room",
    "ceiling-fan-01": "fan",
    "ceiling-fan-motor-01": "coil",
    "ceiling-fan-hardware-01": "screw",
    "ceiling-fan-stamping-02": "stamping",
    "ceiling-fan-magwire-03": "magwire",
    "ceiling-fan-copper-04": "mine",

    // candle
    "candle-room": "room",
    "candle-01": "candle",
    "candle-wax-01": "wax",
    "candle-chimney-01": "chimney",
    "candle-blow-02": "blow",
    "candle-batch-03": "batch",
    "candle-quarry-04": "sand",

    // rattan armchair
    "armchair-room": "room",
    "armchair-01": "armchair",
    "armchair-cane-01": "cane",
    "armchair-frame-01": "frame",
    "armchair-splitter-02": "splitter",
    "armchair-peels-03": "peels",
    "armchair-grove-04": "grove"
  };

  var KIND_WORD = {
    room: "ROOM", object: "THE OBJECT", component: "COMPONENT",
    machine: "MACHINE", mold: "TOOLING", material: "MATERIAL", source: "SOURCE"
  };

  var DIVE_OUT = 2.2;    // outgoing scale when diving deeper (Powers-of-Ten punch)
  var DIVE_IN = 0.5;     // incoming start scale when diving deeper
  var ZOOM_MS = 1150;    // total zoom transition

  /* ============================================================ state */
  var S = {
    mode: "home",       // home | descent | finale
    oi: 0,              // object index
    si: 0,              // stop index
    front: 0,           // which slide layer is currently visible (0/1)
    animating: false,
    finaleMode: "full", // full | object
    press: null,
    wheelLock: 0
  };

  var $ = function (s) { return document.querySelector(s); };
  var layers, el = {};

  /* ============================================================ helpers */
  function objects() { return (window.JOURNEY && window.JOURNEY.objects) || []; }
  function obj() { return objects()[S.oi]; }
  function stops() { return obj().stops; }
  function stop() { return stops()[S.si]; }

  function srcFor(st) {
    var key = IMG[st.id];
    if (!key) {
      // fallback: by kind
      var byKind = { room: "room", object: "keyboard", component: "keycap", machine: "press", mold: "mold", material: "pellets", source: "mine" };
      key = byKind[st.kind] || "room";
    }
    return "assets/img/" + key + ".jpg";
  }

  function focusOf(st) {
    var z = st.zoom || { x: 50, y: 50 };
    return (z.x == null ? 50 : z.x) + "% " + (z.y == null ? 50 : z.y) + "%";
  }

  // authored {x,y} are % coords on the SOURCE PHOTO. The stage shows the photo
  // with background:cover inside a box at inset:-2% — invert that crop so each
  // dot lands on the thing it names at any viewport. Raw coords are used until
  // the photo's natural size is known; dimsFor re-renders once it loads.
  var IMGDIMS = {}; // src -> {w, h}
  function dimsFor(src) {
    if (IMGDIMS[src]) return IMGDIMS[src];
    var im = new Image();
    im.onload = function () {
      IMGDIMS[src] = { w: im.naturalWidth, h: im.naturalHeight };
      if (S.mode === "descent") renderAnno(stop(), false);
    };
    im.src = src;
    return null;
  }
  function mapXY(st, an) {
    var d = dimsFor(srcFor(st));
    var vw = window.innerWidth, vh = window.innerHeight;
    var x = Math.max(0, Math.min(100, an.x));
    var y = Math.max(0, Math.min(100, an.y));
    if (!d) return { x: x, y: y };
    var bw = vw * 1.04, bh = vh * 1.04;        // .img sits at inset:-2%
    var s = Math.max(bw / d.w, bh / d.h);      // background-size: cover
    var ox = -vw * 0.02 + (bw - d.w * s) / 2;
    var oy = -vh * 0.02 + (bh - d.h * s) / 2;
    return {
      x: (x / 100 * d.w * s + ox) / vw * 100,
      y: (y / 100 * d.h * s + oy) / vh * 100
    };
  }

  // would a label extending right of this dot land on the text column?
  function annoOverText(x, y) {
    if (window.innerWidth <= 860) return false; // mobile hides #anno entirely
    var nodes = document.querySelectorAll(
      "#kicker,#headline,#narration,#specs,#details-toggle,#actions,#history");
    var vw = window.innerWidth, vh = window.innerHeight;
    var lx = x / 100 * vw, ly = y / 100 * vh;
    for (var i = 0; i < nodes.length; i++) {
      var r = nodes[i].getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (lx < r.right + 10 && lx + 300 > r.left &&
          ly > r.top - 14 && ly < r.bottom + 14) return true;
    }
    return false;
  }

  function uniqEchelons() {
    var seen = [], out = [];
    stops().forEach(function (s) {
      if (seen.indexOf(s.echelon) < 0) { seen.push(s.echelon); out.push(s.echelon); }
    });
    return out;
  }

  function echelonWord(e) {
    var s = stops().filter(function (x) { return x.echelon === e; })[0];
    return KIND_WORD[s ? s.kind : ""] || ("E" + e);
  }

  /* ============================================================ preload */
  function preload() {
    var seen = {};
    objects().forEach(function (o) {
      o.stops.forEach(function (st) {
        var s = srcFor(st);
        if (!seen[s]) { seen[s] = 1; dimsFor(s); }
      });
    });
  }

  /* ============================================================ HOME */
  function buildPicker() {
    var p = el.picker;
    p.innerHTML = "";
    objects().forEach(function (o, i) {
      var st = o.stops[1] || o.stops[0];
      var b = document.createElement("button");
      b.className = "pk";
      b.type = "button";
      b.style.backgroundImage =
        "linear-gradient(180deg, rgba(10,8,6,.18), rgba(10,8,6,.86)), url('" + srcFor(st) + "')";
      b.innerHTML =
        '<span class="m">' + (o.stops.length - 1) + " STOPS DEEP</span>" +
        '<span class="n">' + o.name + "</span>" +
        '<span class="m">' + o.tagline + "</span>";
      b.addEventListener("click", function () { open(i, 1); });
      p.appendChild(b);
    });
  }

  function showHome() {
    S.mode = "home";
    closeFinale();
    closePress();
    el.home.classList.remove("hide");
    el.content.classList.add("gone");
    el.depth.classList.add("gone");
    el.controls.classList.add("gone");
    el.pips.classList.add("gone");
    el.anno.classList.add("gone");
    if (el.cue) el.cue.classList.add("gone");
    // stage shows the room
    setLayer(layers[0], "assets/img/room.jpg", "50% 50%", 1, 1, true);
    setLayer(layers[1], "assets/img/room.jpg", "50% 50%", 1, 0, true);
    S.front = 0;
    document.title = "UNPACKED — everything in the room, and what it took";
  }

  /* ============================================================ layer control */
  function setLayer(node, src, origin, opacity, vis, instant) {
    var img = node.querySelector(".img");
    if (img.dataset.src !== src) {
      img.style.backgroundImage = "url('" + src + "')";
      img.dataset.src = src;
    }
    node.style.transformOrigin = origin;
    if (instant) {
      node.style.transition = "none";
      node.style.opacity = String(vis);
      node.style.transform = "scale(1)";
      node.style.filter = "";
      // force style flush
      void node.offsetWidth;
      node.style.transition = "";
    } else {
      node.style.opacity = String(opacity);
    }
  }

  /* ============================================================ RENDER A STOP */
  function renderStop(st, animate, dir) {
    var src = srcFor(st);

    if (!animate) {
      setLayer(layers[0], src, focusOf(st), 1, 1, true);
      setLayer(layers[1], src, focusOf(st), 1, 0, true);
      S.front = 0;
      fillText(st);
      renderAnno(st, false);
      return;
    }

    // ---- cinematic cross-zoom between the two layers
    var frontNode = layers[S.front];
    var backNode = layers[1 - S.front];
    var frontImg = frontNode.querySelector(".img");
    var backImg = backNode.querySelector(".img");

    var outScale = dir >= 0 ? DIVE_OUT : DIVE_IN;
    var inScale = dir >= 0 ? DIVE_IN : DIVE_OUT;

    // back layer: place new image, start at inScale, animate to 1
    if (backImg.dataset.src !== src) {
      backImg.style.backgroundImage = "url('" + src + "')";
      backImg.dataset.src = src;
    }
    backNode.style.transition = "none";
    backNode.style.transformOrigin = focusOf(st);
    backNode.style.transform = "scale(" + inScale + ")";
    backNode.style.opacity = "0";
    backNode.style.filter = "blur(10px)";
    void backNode.offsetWidth; // flush

    // front layer: dive away toward its own focus point
    frontNode.style.transformOrigin = frontNode.style.transformOrigin || "50% 50%";
    frontNode.style.transition = "opacity " + (ZOOM_MS * 0.72) + "ms cubic-bezier(.6,0,.3,1), transform " + ZOOM_MS + "ms cubic-bezier(.68,0,.18,1), filter " + (ZOOM_MS * 0.6) + "ms ease-in";
    frontNode.style.transform = "scale(" + outScale + ")";
    frontNode.style.opacity = "0";
    frontNode.style.filter = "blur(14px)";

    // back layer animates in
    backNode.style.transition = "opacity " + (ZOOM_MS * 0.66) + "ms ease-out " + (ZOOM_MS * 0.26) + "ms, transform " + ZOOM_MS + "ms cubic-bezier(.16,.84,.3,1), filter " + (ZOOM_MS * 0.5) + "ms ease-out " + (ZOOM_MS * 0.22) + "ms";
    backNode.style.transform = "scale(1)";
    backNode.style.opacity = "1";
    backNode.style.filter = "blur(0px)";

    S.front = 1 - S.front;

    // text swap mid-zoom
    setTimeout(function () { fillText(st, true); }, ZOOM_MS * 0.3);
    // callouts draw in as the zoom settles
    setTimeout(function () { renderAnno(st, true); }, ZOOM_MS * 0.52);

    clearTimeout(S._zt);
    S._zt = setTimeout(function () {
      // settle front layer (now the visible one) to a clean identity
      var v = layers[S.front];
      v.style.transition = "none";
      v.style.transform = "scale(1)";
      v.style.opacity = "1";
      v.style.filter = "";
      void v.offsetWidth;
      v.style.transition = "";
      S.animating = false;
    }, ZOOM_MS + 40);
  }

  /* ============================================================ text column */
  function fillText(st, animate) {
    var c = el.content;
    var paint = function () {
      el.kicker.textContent = (st.kicker || KIND_WORD[st.kind] || "");
      el.headline.textContent = st.name;
      el.narration.textContent = st.narration;

      // specs
      el.specs.innerHTML = "";
      (st.specs || []).forEach(function (sp) {
        var d = document.createElement("div");
        d.className = "sp";
        var u = sp.unit ? '<span class="u">' + sp.unit + "</span>" : "";
        d.innerHTML = '<div class="k">' + sp.label + '</div><div class="v">' + sp.value + u + "</div>";
        el.specs.appendChild(d);
      });

      // history
      if (st.history) {
        el.history.textContent = st.history;
        el.history.style.display = "";
      } else {
        el.history.style.display = "none";
      }

      // progressive disclosure: detail starts hidden so each screen is one idea
      if (el.details) el.details.classList.remove("open");
      if (el.detailsToggle) {
        var hasDetail = (st.specs && st.specs.length) || st.history;
        el.detailsToggle.style.display = hasDetail ? "" : "none";
        el.detailsToggle.textContent = "The details +";
        el.detailsToggle.setAttribute("aria-expanded", "false");
      }

      // contextual action: injection-molding press -> run the cycle
      el.actions.innerHTML = "";
      if (/\b(inj|mold)/i.test(st.id) && st.kind === "machine") {
        var btn = document.createElement("button");
        btn.className = "cbtn ghost";
        btn.type = "button";
        btn.textContent = "▶  Run the 30-second cycle";
        btn.style.pointerEvents = "auto";
        btn.addEventListener("click", openPress);
        el.actions.appendChild(btn);
      }

      // affiliate: "where to get one" on the object stop only (config in js/affiliate.js)
      if (st.kind === "object" && typeof window.UNPACKED_AFFILIATE_URL === "function") {
        var affUrl = window.UNPACKED_AFFILIATE_URL(obj().id, obj().name);
        if (affUrl) {
          var buy = document.createElement("a");
          buy.className = "cbtn ghost buy";
          buy.href = affUrl;
          buy.target = "_blank";
          buy.rel = "sponsored noopener noreferrer";
          buy.textContent = "↗  Where to get one";
          el.actions.appendChild(buy);
          var affNote = document.createElement("div");
          affNote.className = "aff-note";
          affNote.textContent = (window.UNPACKED_AFFILIATE && window.UNPACKED_AFFILIATE.disclosure) || "";
          el.actions.appendChild(affNote);
        }
      }

      // header sub + document title
      el.brandSub.textContent = obj().name + "  ·  " + (S.si + 1) + " / " + stops().length;
      document.title = st.name + " — UNPACKED";
    };

    if (animate) {
      c.classList.add("out");
      setTimeout(function () {
        paint();
        c.classList.remove("out");
        c.classList.add("in");
        setTimeout(function () { c.classList.remove("in"); }, 620);
      }, 240);
    } else {
      paint();
    }
  }

  /* ============================================================ callouts */
  function renderAnno(st, animate) {
    var a = el.anno;
    a.innerHTML = "";
    var list = st.annotations || [];
    list.forEach(function (an, i) {
      var p = mapXY(st, an);
      var x = Math.max(4, Math.min(94, p.x)), y = Math.max(12, Math.min(86, p.y));
      var toLeft = x > 74 || (annoOverText(x, y) && x > 26);
      var d = document.createElement("div");
      d.className = "anno-item" + (toLeft ? " left" : "");
      d.style.left = x + "%";
      d.style.top = y + "%";
      d.style.setProperty("--d", (i * 0.11) + "s");
      d.innerHTML =
        '<span class="adot"></span>' +
        '<span class="aline"></span>' +
        '<span class="albl"><b>' + an.label + "</b>" + (an.sub ? "<i>" + an.sub + "</i>" : "") + "</span>";
      if (animate) { d.classList.add("draw"); }
      a.appendChild(d);
    });
  }

  /* ============================================================ chrome */
  function renderChrome() {
    // depth meter
    var es = uniqEchelons();
    var curE = stop().echelon;
    el.depth.innerHTML = "";
    es.forEach(function (e) {
      var d = document.createElement("div");
      d.className = "d" + (e === curE ? " on" : "") + (e < curE ? " past" : "");
      d.innerHTML = '<span class="tick"></span><span class="lb">E' + e + " · " + echelonWord(e) + "</span>";
      el.depth.appendChild(d);
    });

    // pips
    el.pips.innerHTML = "";
    stops().forEach(function (_, i) {
      var p = document.createElement("span");
      p.className = "p" + (i < S.si ? " past" : "") + (i === S.si ? " on" : "");
      el.pips.appendChild(p);
    });

    // controls
    el.btnBack.disabled = false;
    el.btnBack.textContent = S.si === 0 ? "↑ Room" : "↑ Back";
    var last = S.si === stops().length - 1;
    el.btnNext.innerHTML = last ? "The whole room →" : "Descend ↓";

    // dive affordance: always present in descent, wording tracks the next action
    if (el.cue) {
      el.cue.classList.remove("gone");
      el.cueText.textContent = last ? "See how it all connects" : "Go deeper";
    }
  }

  /* ============================================================ open / nav */
  function open(oi, si) {
    S.oi = oi; S.si = si; S.mode = "descent";
    el.home.classList.add("hide");
    el.content.classList.remove("gone");
    el.depth.classList.remove("gone");
    el.controls.classList.remove("gone");
    el.pips.classList.remove("gone");
    el.anno.classList.remove("gone");
    closeFinale();
    closePress();

    var first = si === 1;
    renderStop(stop(), first, 1);
    if (!first) fillText(stop(), false);
    if (first) { fillText(stop(), false); renderAnno(stop(), true); }
    renderChrome();
  }

  function goTo(si, dir) {
    if (S.animating) return;
    si = Math.max(0, Math.min(stops().length - 1, si));
    if (si === S.si) return;
    S.si = si;
    S.animating = true;
    renderStop(stop(), true, dir);
    renderChrome();
  }

  function next() {
    if (S.si >= stops().length - 1) { openFinale("object"); return; }
    goTo(S.si + 1, 1);
  }
  function prev() {
    if (S.si === 0) { showHome(); return; }
    goTo(S.si - 1, -1);
  }

  /* ============================================================ FINALE */
  function openFinale(mode) {
    if (!window.GraphAPI) return;
    S.finaleMode = mode || S.finaleMode;
    S.mode = "finale";
    el.finale.classList.add("show");
    if (el.cue) el.cue.classList.add("gone");
    el.finaleToggle.textContent = S.finaleMode === "full" ? "This object only" : "The whole room";

    // size is available only once visible
    requestAnimationFrame(function () {
      var api = window.GraphAPI;
      api.init($("#full-graph"));
      // the finale chrome owns the top-left (title) and bottom-left (quote):
      // keep graph nodes clear of both regions.
      api.setChrome({ top: 62, bottom: 204, stats: false });
      var stats;
      if (S.finaleMode === "object") {
        api.renderFor(obj().id);
        stats = api.stats();
        $("#finale-title").textContent = obj().name.toUpperCase();
        el.finaleToggle.style.display = "none";
      } else {
        api.renderFull();
        stats = api.stats();
        $("#finale-title").textContent = "THE WHOLE ROOM";
        el.finaleToggle.style.display = "";
        api.setOnNodeClick(function (id) {
          // jump into the object that owns the clicked node
          for (var i = 0; i < objects().length; i++) {
            var o = objects()[i];
            for (var j = 0; j < o.stops.length; j++) {
              if (o.stops[j].id === id) { open(i, j); return; }
            }
          }
        });
      }
      renderQuote(stats);
    });
  }

  function closeFinale() {
    if (el.finale) el.finale.classList.remove("show");
  }

  function countUp(node, to, suffix) {
    var start = performance.now(), dur = 1400;
    function tick(t) {
      var k = Math.max(0, Math.min(1, (t - start) / dur));
      k = 1 - Math.pow(1 - k, 3);
      node.textContent = Math.round(to * k) + (suffix || "");
      if (k < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function renderQuote(stats) {
    var q = el.finaleQuote;
    var nodes = (stats && stats.nodes) || 0;
    var edges = (stats && stats.edges) || 0;
    var shared = (stats && stats.shared) || 0;
    var ob = (stats && stats.objects) || 0;
    var ech = (stats && stats.echelons) || 0;
    q.innerHTML =
      '<div class="qstat">' +
        '<span><b data-n="' + nodes + '">0</b> processes</span>' +
        '<span><b data-n="' + edges + '">0</b> links</span>' +
        '<span><b data-n="' + shared + '">0</b> shared sources</span>' +
        '<span><b data-n="' + ob + '">0</b> objects</span>' +
        '<span class="flat">' + ech + " echelons</span>" +
      "</div>" +
      "<p>“Not only is everything around you the result of someone's life work — the ability to make that thing is the result of a hundred life's works to make things you never see.”</p>" +
      '<cite>— Ben Reinhardt</cite>';
    q.querySelectorAll("b[data-n]").forEach(function (b) {
      countUp(b, +b.dataset.n, "");
    });
  }

  /* ============================================================ PRESS SIM */
  var PRESS_PHASES = [
    ["CLAMP", "Mold halves close and lock under 80 tons of clamp force."],
    ["INJECT / FILL", "The screw rams forward, injecting 220 °C ABS through the sprue until the keycap cavity fills."],
    ["PACK / HOLD", "Holding pressure packs the cavity as the gate freezes solid."],
    ["COOL", "The part solidifies in the tool — watch the cavity drain from orange to gray."],
    ["OPEN", "The moving platen retracts, exposing the finished keycap."],
    ["EJECT", "Ejector pins pop the part free; it drops clear of the mold."],
    ["PLASTICIZE", "The screw rotates and pulls back, plasticizing the next shot from fresh pellets."]
  ];

  function openPress() {
    if (!window.PressSim) return;
    el.pressOverlay.classList.add("show");
    $("#press-title").textContent = stop().name + " — 30 s CYCLE";
    closePress();
    S.press = window.PressSim.mount($("#press-canvas"), {
      speed: 1,
      onPhase: function (i) {
        var p = PRESS_PHASES[Math.max(0, Math.min(PRESS_PHASES.length - 1, i))];
        $("#press-cap").innerHTML = '<b>' + p[0] + "</b> — " + p[1];
      }
    });
  }

  function closePress() {
    if (S.press && S.press.destroy) { try { S.press.destroy(); } catch (e) {} }
    S.press = null;
    if (el.pressOverlay) el.pressOverlay.classList.remove("show");
  }

  /* ============================================================ INPUT */
  function onKey(e) {
    if (e.key === "Escape") {
      if (el.pressOverlay.classList.contains("show")) { closePress(); return; }
      if (S.mode === "finale") { closeFinale(); S.mode = "descent"; return; }
      showHome(); return;
    }
    if (S.mode === "finale") return;
    if (S.mode === "home") {
      var n = e.key === "0" ? 10 : parseInt(e.key, 10);
      if (n >= 1 && n <= objects().length) open(n - 1, 1);
      if (e.key === "ArrowDown" || e.key === "Enter") open(0, 1);
      if (e.key === "g" || e.key === "G") openFinale("full");
      return;
    }
    if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") {
      e.preventDefault(); next();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault(); prev();
    } else if (e.key === "g" || e.key === "G") {
      openFinale("full");
    }
  }

  function onWheel(e) {
    if (S.mode !== "descent") return;
    var now = Date.now();
    if (now - S.wheelLock < 820) return;
    if (Math.abs(e.deltaY) < 18) return;
    S.wheelLock = now;
    if (e.deltaY > 0) next(); else prev();
  }

  /* touch: vertical swipe = dive/surface (mobile has no scroll wheel) */
  var touchStart = null;
  document.addEventListener("touchstart", function (e) {
    if (S.mode !== "descent") return;
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
  }, { passive: true });
  document.addEventListener("touchend", function (e) {
    if (S.mode !== "descent" || !touchStart) return;
    var dx = e.changedTouches[0].clientX - touchStart.x;
    var dy = e.changedTouches[0].clientY - touchStart.y;
    var dt = Date.now() - touchStart.t;
    touchStart = null;
    if (dt > 900) return;                        // long press = not a swipe
    if (Math.abs(dy) < 44 || Math.abs(dy) < Math.abs(dx) * 1.4) return;
    var now = Date.now();
    if (now - S.wheelLock < 820) return;
    S.wheelLock = now;
    if (dy < 0) next(); else prev();
  }, { passive: true });

  /* keep callout dots on their subjects when the viewport changes */
  window.addEventListener("resize", function () {
    if (S.mode === "descent" && !S.animating) renderAnno(stop(), false);
  });

  /* ============================================================ BOOT */
  function boot() {
    layers = [].slice.call(document.querySelectorAll("#stage .slide"));
    el = {
      home: $("#home"), picker: $("#picker"),
      content: $("#content"), kicker: $("#kicker"), headline: $("#headline"),
      narration: $("#narration"), specs: $("#specs"), history: $("#history"), actions: $("#actions"),
      details: $("#details"), detailsToggle: $("#details-toggle"),
      cue: $("#cue"), cueText: $("#cue-text"),
      anno: $("#anno"), depth: $("#depth"), pips: $("#pips"),
      controls: $("#controls"), btnBack: $("#btn-back"), btnNext: $("#btn-next"),
      brandSub: $("#brand-sub"),
      finale: $("#finale"), finaleQuote: $("#finale-quote"), finaleToggle: $("#finale-toggle"),
      pressOverlay: $("#press-overlay")
    };

    preload();
    buildPicker();
    showHome();

    el.btnBack.addEventListener("click", prev);
    el.btnNext.addEventListener("click", next);

    // progressive disclosure toggle
    if (el.detailsToggle) {
      el.detailsToggle.addEventListener("click", function () {
        var open = el.details.classList.toggle("open");
        el.detailsToggle.textContent = open ? "The details −" : "The details +";
        el.detailsToggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    // dive affordance: click or keyboard to go deeper
    if (el.cue) {
      el.cue.addEventListener("click", function () { if (S.mode === "descent") next(); });
      el.cue.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (S.mode === "descent") next(); }
      });
    }

    $("#btn-objects").addEventListener("click", showHome);
    $("#btn-room").addEventListener("click", function () { openFinale("full"); });
    $("#finale-close").addEventListener("click", function () {
      closeFinale();
      if (S.mode === "finale") S.mode = stops() && obj() ? "descent" : "home";
    });
    el.finaleToggle.addEventListener("click", function () {
      S.finaleMode = S.finaleMode === "full" ? "object" : "full";
      openFinale(S.finaleMode);
    });
    $("#press-close").addEventListener("click", closePress);
    document.querySelectorAll("#press-overlay [data-speed]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (S.press && S.press.setSpeed) S.press.setSpeed(parseFloat(b.dataset.speed));
      });
    });

    document.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });

    // tap right half to descend, left half to go back (touch/desktop convenience)
    layers[0].parentNode.addEventListener("click", function (e) {
      if (S.mode !== "descent") return;
      if (e.target.closest("#controls,#content,#anno,header,#depth,#pips,#home,#finale,#press-overlay")) return;
      if (e.clientX > window.innerWidth * 0.5) next(); else prev();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
