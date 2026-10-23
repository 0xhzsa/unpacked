/*
 * UNPACKED — story.js
 * The field-note reader. Each object opens as one long annotated page you
 * scroll through: prologue (the room), the object, its parts, its machines,
 * its materials, its sources — then a complete ledger of EVERY node in the
 * chain (nothing in the graph hides its back story), and the whole-room graph
 * one click away at the end.
 *
 * Data: window.JOURNEY (stop voices/specs/photos), window.CONTENT (chain
 * nodes: description/specs/history/process), window.UnpackedIMG (stop id ->
 * asset key, set by descent.js). Animations: reveal-on-scroll, counters,
 * staggered hand notes. No looping marquee, no glow — print-shop motion.
 */
(function () {
  "use strict";

  var $ = function (s) { return document.querySelector(s); };
  var ECHE_WORD = { 0: "the object", 1: "parts", 2: "machines", 3: "materials", 4: "sources" };
  var SCROLL, io, S = { oi: -1, open: false, counted: [] };

  function objects() { return (window.JOURNEY && window.JOURNEY.objects) || []; }
  function chains() { return (window.CONTENT && window.CONTENT.chains) || []; }
  function imgKey(stopId) {
    var m = window.UnpackedIMG || {};
    return m[stopId] || (stopId.indexOf("room") >= 0 ? "room" : null);
  }
  function imgSrc(stopId) { var k = imgKey(stopId); return k ? "assets/img/" + k + ".jpg" : null; }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ------------------------------------------------------------ builders */

  function chipsHtml(st) {
    return (st.annotations || []).map(function (an, i) {
      var left = an.x > 74 ? " left" : "";
      return '<span class="schip' + left + '" style="left:' + an.x + "%;top:" + an.y +
        '%;--sd:' + (0.28 + i * 0.16) + 's"><i class="dot"></i><i class="lb"><b>' +
        esc(an.label) + "</b>" + (an.sub ? "<em>" + esc(an.sub) + "</em>" : "") + "</i></span>";
    }).join("");
  }

  function specTable(st, counters) {
    return '<table class="spt">' + (st.specs || []).map(function (sp) {
      var v = esc(sp.value), n = String(sp.value).match(/^[\d.]+$/);
      if (n && counters) v = '<b data-count="' + esc(sp.value) + '">' + esc(sp.value) + "</b>";
      return "<tr><td>" + esc(sp.label) + "</td><td>" + v +
        (sp.unit ? '<span class="u"> ' + esc(sp.unit) + "</span>" : "") + "</td></tr>";
    }).join("") + "</table>";
  }

  function chapterHtml(st, idx) {
    var src = imgSrc(st.id);
    var kind = st.kind === "room" ? "PROLOGUE" : "CHAPTER " + String(idx).padStart(2, "0");
    var anch = stopsWithChapter(st) ? '<a class="anchor-chip" href="#' + st.id + '">↧ jump to the story</a>' : "";
    return '<section class="chapter' + (idx % 2 ? " flip" : "") + '" id="' + esc(st.id) + '">' +
      '<div class="ch-media reveal">' +
        (src ? '<img loading="lazy" src="' + src + '" alt="' + esc(st.image) + '">' : "") +
        '<div class="schips">' + chipsHtml(st) + "</div>" +
      "</div>" +
      '<div class="ch-body reveal">' +
        '<div class="ch-kick"><span>' + kind + "</span><span>·</span><span>" +
          "E" + st.echelon + " · " + (ECHE_WORD[st.echelon] || "").toUpperCase() + "</span></div>" +
        '<h2>' + esc(st.name) + "</h2>" +
        '<p class="ckick">' + esc(st.kicker) + "</p>" +
        '<p class="cnarr">' + esc(st.narration) + "</p>" +
        specTable(st, true) +
        (st.history ? '<div class="hand">' + esc(st.history) + "</div>" : "") +
        '<div class="ch-extras"></div>' +
      "</div>" +
    "</section>";
  }

  function stopsWithChapter(st) { return st.kind !== "room"; }

  function heroHtml(o, objStop, roomStop) {
    return '<section class="hero" id="' + esc(objStop.id) + '">' +
      '<div class="h-eyebrow">FIELD NOTE · ' + esc(o.name.toUpperCase()) + "</div>" +
      '<h1>' + esc(objStop.name) + "</h1>" +
      '<p class="tag">' + esc(o.tagline) + "</p>" +
      '<div class="h-lead">' + esc(objStop.narration) + "</div>" +
      '<div class="h-specs">' + (objStop.specs || []).map(function (sp) {
        return '<div class="hs"><i class="k">' + esc(sp.label) + "</i>" +
          '<i class="v"><b data-count="' + esc(sp.value) + '">' + esc(sp.value) + "</b>" +
          (sp.unit ? '<span class="u"> ' + esc(sp.unit) + "</span>" : "") + "</i></div>";
      }).join("") + "</div>" +
      (objStop.history ? '<div class="hand">' + esc(objStop.history) + "</div>" : "") +
      '<div class="hero-media reveal">' +
        '<img src="assets/img/' + imgKey(objStop.id) + '.jpg" alt="' + esc(objStop.image) + '">' +
        '<div class="schips">' + chipsHtml(objStop) + "</div>" +
        '<div class="hand hand-ov">scroll — every part, every machine, every mine it came from ↓</div>' +
      "</div>" +
      '<div class="prologue reveal" id="' + esc(roomStop.id) + '">' +
        '<div class="p-kick">PROLOGUE · E0 · ' + (roomStop.name || "the room").toUpperCase() + "</div>" +
        '<p>' + esc(roomStop.narration) + "</p>" +
      "</div>" +
    "</section>";
  }

  function ledgerHtml(o) {
    var chain = chains().filter(function (c) { return c.id === o.id; })[0];
    if (!chain) return "";
    var stMap = {};
    o.stops.forEach(function (s) { stMap[s.id] = true; });
    var out = '<section class="ledger" id="the-ledger">' +
      '<div class="l-head reveal"><div class="ch-kick"><span>APPENDIX</span><span>·</span><span>EVERY NODE</span></div>' +
      "<h2>The complete chain</h2>" +
      '<p class="l-lead">Everything the graph can show for this object — every part, machine, material and mine, ' +
      "with its own numbers. Nothing in the picture is left unexplained.</p></div>";
    [0, 1, 2, 3, 4].forEach(function (e) {
      var nodes = chain.nodes.filter(function (n) { return n.echelon === e; });
      if (!nodes.length) return;
      out += '<h3 class="l-ec reveal">E' + e + " — " + (ECHE_WORD[e] || "").toUpperCase() +
        ' <span class="l-count">' + nodes.length + " node" + (nodes.length > 1 ? "s" : "") + "</span></h3>";
      out += '<div class="l-grid' + (nodes.length === 1 ? " single" : "") + '">';
      nodes.forEach(function (n) {
        out += '<article class="nrc reveal" style="--nc:' + esc(n.color || "#44321f") + '">' +
          '<h4>' + esc(n.name) +
            (stMap[n.id] ? '<a class="nl" href="#' + esc(n.id) + '" title="read its chapter">↓ story</a>' : "") +
          "</h4>" +
          '<p class="nd">' + esc(n.description) + "</p>" +
          '<ol class="np">' + (n.process || []).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ol>" +
          '<table class="nspt">' + (n.specs || []).map(function (sp) {
            return "<tr><td>" + esc(sp.label) + "</td><td>" + esc(sp.value) +
              (sp.unit ? '<span class="u"> ' + esc(sp.unit) + "</span>" : "") + "</td></tr>";
          }).join("") + "</table>" +
          (n.history ? '<div class="hand">' + esc(n.history) + "</div>" : "") +
        "</article>";
      });
      out += "</div>";
    });
    return out + "</section>";
  }

  function closingHtml(o, objStop) {
    var aff = "";
    if (typeof window.UNPACKED_AFFILIATE_URL === "function") {
      var url = window.UNPACKED_AFFILIATE_URL(o.id, o.name);
      if (url) {
        aff = '<a class="c-buy" href="' + esc(url) + '" target="_blank" rel="sponsored noopener noreferrer">↗  Where to get one</a>' +
          (window.UNPACKED_AFFILIATE && window.UNPACKED_AFFILIATE.disclosure
            ? '<div class="aff-note">' + esc(window.UNPACKED_AFFILIATE.disclosure) + "</div>" : "");
      }
    }
    return '<section class="closing">' +
      '<div class="reveal">' +
        '<p class="c-lead">That is one everyday object, traced the whole way down — ' +
          (o.stops.length - 1) + " chapters' worth of machines and materials. " +
          "Multiply by the whole room.</p>" +
        '<div class="c-btns">' +
          '<button class="cbtn primary" id="story-finale">The whole room →</button>' +
          '<button class="cbtn ghost" id="story-share">Copy link</button>' +
          '<button class="cbtn ghost" id="story-home">All objects ↑</button>' +
        "</div>" + aff +
      "</div>" +
    "</section>" +
    '<div class="finale-hint reveal">…or press <b>G</b> anywhere on this page</div>';
  }

  /* ------------------------------------------------------------ machine sim hook */

  function machinechapterExtras(st) {
    var host = document.getElementById(st.id);
    if (!host) return;
    var box = host.querySelector(".ch-extras");
    if (!box) return;
    if (/\b(inj|mold)/i.test(st.id) && st.kind === "machine" && window.PressSim && window.DescentAPI) {
      box.innerHTML = '<button class="cbtn ghost" type="button">▶  Run the 30-second cycle</button>';
      box.querySelector("button").addEventListener("click", function () {
        window.DescentAPI.runPress(st.name + " — 30 s CYCLE");
      });
    }
  }

  /* ------------------------------------------------------------ reveal + counters */

  function bindMotion() {
    if (io) io.disconnect();
    var els = SCROLL.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add("vis");
          en.target.querySelectorAll("b[data-count]").forEach(runCount);
          if (en.target.matches("b[data-count]")) runCount(en.target);
          io.unobserve(en.target);
        });
      }, { root: SCROLL, rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
      els.forEach(function (e) { io.observe(e); });
    } else {
      els.forEach(function (e) { e.classList.add("vis"); });
    }
    // counters may sit inside already-visible blocks on short viewports
    SCROLL.querySelectorAll(".reveal.vis b[data-count]").forEach(runCount);
    SCROLL.querySelectorAll("b[data-count]").forEach(function (b) { markCount(b); });
    runPending();
  }

  /* portrait originals (the tumbler set is 3:4) plate up instead of cover-crop */
  function tagPortrait(sel) {
    SCROLL.querySelectorAll(sel).forEach(function (im) {
      var f = function () {
        if (im.naturalHeight > im.naturalWidth && im.parentNode) im.parentNode.classList.add("has-portrait");
      };
      if (im.complete && im.naturalWidth) f();
      else im.addEventListener("load", f);
    });
  }

  function markCount(b) {
    if (S.counted.indexOf(b) < 0) S.counted.push(b);
  }

  function runPending() {
    SCROLL.querySelectorAll("b[data-count]").forEach(function (b) {
      var r = b.getBoundingClientRect();
      if (r.top < SCROLL.clientHeight) runCount(b);
    });
  }

  function runCount(b) {
    if (!b || b.dataset.done) return;
    b.dataset.done = "1";
    var to = parseFloat(b.dataset.count), decimals = 0;
    if (isNaN(to)) return;
    var str = String(b.dataset.count);
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (str.indexOf(".") >= 0) decimals = (str.split(".")[1] || "").length;
    var t0 = performance.now(), dur = Math.min(1400, 520 + 90 * Math.abs(to));
    (function tick(t) {
      if (!document.body.contains(b)) return;
      var k = Math.max(0, Math.min(1, (t - t0) / dur));
      k = 1 - Math.pow(1 - k, 3);
      b.textContent = (to * k).toFixed(decimals);
      if (k < 1) requestAnimationFrame(tick);
      else b.textContent = str;
    })(t0);
  }

  function onScrollPips() {
    if (!SCROLL) return;
    var max = SCROLL.scrollHeight - SCROLL.clientHeight;
    var p = max > 0 ? SCROLL.scrollTop / max : 0;
    SCROLL.style.setProperty("--sp", (p * 100).toFixed(2) + "%");
  }

  /* ------------------------------------------------------------ open / close */

  function open(oi, anchor) {
    var o = objects()[oi];
    if (!o) return;
    S.oi = oi; S.open = true; S.counted = [];
    var roomStop = o.stops[0];
    var objStop = o.stops.filter(function (s) { return s.kind === "object"; })[0] || o.stops[1];

    var html = heroHtml(o, objStop, roomStop);
    var ch = 0;
    o.stops.forEach(function (st, i) {
      if (st.kind === "room") return;
      if (st.kind === "object") return;
      ch++;
      html += chapterHtml(st, ch);
    });
    html += ledgerHtml(o);
    html += closingHtml(o, objStop);

    var sc = $("#story");
    sc.innerHTML =
      '<div class="s-rail" aria-hidden="true"><i></i></div>' +
      '<div class="s-wrap">' +
        '<div class="s-top reveal vis">' +
        '<span class="sn">OBJECT Nº ' + (oi + 1) + '</span>' +
        '<span class="sr">' + ((((window.CONTENT && window.CONTENT.chains) || []).filter(function (c) { return c.id === o.id; })[0] || {}).nodes || []).length +
        " nodes · " + (o.stops.length - 1) + " chapters</span></div>" +
        html +
        '<footer class="s-foot">UNPACKED — an engineer’s “I, Pencil”, rebuilt. Read the next one while the kettle boils.</footer>' +
      "</div>";
    sc.classList.add("open");
    sc.setAttribute("aria-hidden", "false");
    SCROLL = sc;
    sc.scrollTop = 0;
    onScrollPips();
    sc.removeEventListener("scroll", onScrollPips);
    sc.addEventListener("scroll", onScrollPips, { passive: true });
    bindMotion();
    tagPortrait(".hero-media img");
    tagPortrait(".ch-media img");

    o.stops.forEach(machinechapterExtras);

    $("#story-home").addEventListener("click", close);

    // optional deep anchor (node sheet "Read its chapter")
    if (anchor) {
      var t = sc.querySelector("#" + String(anchor).replace(/[^a-z0-9\-_]/gi, ""));
      if (t) setTimeout(function () { t.scrollIntoView({ behavior: "smooth", block: "start" }); }, 420);
    }
    $("#story-finale").addEventListener("click", function () {
      window.DescentAPI.openFinaleFull();
    });

    var share = $("#story-share");
    if (share) share.addEventListener("click", function () {
      var link = location.href;
      var reset = function () { setTimeout(function () { share.textContent = "Copy link"; }, 2400); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link).then(
          function () { share.textContent = "Copied ✓"; reset(); },
          function () { share.textContent = link; reset(); });
      } else {
        share.textContent = link; reset();
      }
    });

    // hide descent chrome + home, keep header on top
    document.body.classList.add("story-open");
    var home = $("#home");
    if (home) home.classList.add("hide");
    var cue = $("#cue");
    if (cue) cue.classList.add("gone");
    var sub = $("#brand-sub");
    if (sub) sub.textContent = o.name + " · field note";
    document.title = o.name + " — UNPACKED";
    try { history.replaceState(null, "", "#obj/" + o.id); } catch (e) {}
  }

  function close(silent) {
    if (!S.open) return;
    S.open = false;
    var sc = $("#story");
    if (io) io.disconnect();
    sc.classList.remove("open");
    sc.setAttribute("aria-hidden", "true");
    SCROLL = null;
    document.body.classList.remove("story-open");
    if (!silent) {
      if (window.DescentAPI) window.DescentAPI.showHome();
      else { var h = $("#home"); if (h) h.classList.remove("hide"); }
    }
    if (location.hash) {
      try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
    }
  }

  window.openStory = open;
  window.closeStory = close;
  window.storyIsOpen = function () { return S.open; };

  var hm = location.hash.match(/^#obj\/([a-z0-9-]+)/i);
  function bootStory() {
    if (!hm) return;
    var objs = objects();
    for (var hbi = 0; hbi < objs.length; hbi++) {
      if (objs[hbi].id === hm[1]) { open(hbi); break; }
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bootStory);
  else bootStory();
})();
