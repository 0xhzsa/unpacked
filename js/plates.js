/* Plates.js - amber-on-black technical plate illustrations for UNPACKED.
   One duotone schematic per node, keyed off ECHELON + subject keywords.
   Plain browser JS, Canvas 2D only. Exposes window.Plates.draw(canvas, node, opts). */
(function () {
  'use strict';

  var C = {
    bg: '#0d0d0d', ink: '#e8861d', mut: '#8a8a8a',
    hot: '#fb923c', cool: '#3a5a72', edge: '#333333'
  };

  var VW = 220, VH = 150;                       /* virtual plate units */
  var AREA = { x: 12, y: 26, w: 196, h: 106 };  /* live drawing area   */

  /* ---------------- deterministic rng ---------------- */

  function hash(str) {
    var h = 2166136261 >>> 0, i;
    str = String(str == null ? '' : str);
    for (i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function mulberry32(a) {
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------------- primitives ---------------- */

  function W(g, px) { return (px || 1) / g.scale; }

  function line(g, x1, y1, x2, y2, c, px) {
    var ctx = g.ctx;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.strokeStyle = c || C.ink; ctx.lineWidth = W(g, px); ctx.stroke();
  }

  function poly(g, pts, c, px, close) {
    var ctx = g.ctx, i;
    if (!pts.length) return;
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    if (close) ctx.closePath();
    ctx.strokeStyle = c || C.ink; ctx.lineWidth = W(g, px); ctx.stroke();
  }

  function fillPoly(g, pts, c) {
    var ctx = g.ctx, i;
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath(); ctx.fillStyle = c; ctx.fill();
  }

  function rectG(g, x, y, w, h, c, px) { poly(g, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], c, px, true); }

  function circG(g, x, y, r, c, px) {
    var ctx = g.ctx;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = c || C.ink; ctx.lineWidth = W(g, px); ctx.stroke();
  }

  function ellG(g, x, y, rx, ry, c, px) {
    var ctx = g.ctx;
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = c || C.ink; ctx.lineWidth = W(g, px); ctx.stroke();
  }

  function fillCirc(g, x, y, r, c) {
    var ctx = g.ctx;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill();
  }

  function fillRectA(g, x, y, w, h, c) { g.ctx.fillStyle = c; g.ctx.fillRect(x, y, w, h); }

  function dot(g, x, y, r, c) { fillCirc(g, x, y, r || 1.1, c || C.ink); }

  function arrowHead(g, x, y, ang, len, c) {
    var ctx = g.ctx, s = len || 3.6;
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.lineTo(x - s * Math.cos(ang - 0.42), y - s * Math.sin(ang - 0.42));
    ctx.lineTo(x - s * Math.cos(ang + 0.42), y - s * Math.sin(ang + 0.42));
    ctx.closePath(); ctx.fillStyle = c || C.ink; ctx.fill();
  }

  function arrow(g, x1, y1, x2, y2, c, px) {
    line(g, x1, y1, x2, y2, c, px);
    arrowHead(g, x2, y2, Math.atan2(y2 - y1, x2 - x1), 3.8, c);
  }

  function arcArrow(g, cx, cy, r, a0, a1, c) {
    var ctx = g.ctx, i, n = 18, pts = [];
    for (i = 0; i <= n; i++) {
      var a = a0 + (a1 - a0) * (i / n);
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    poly(g, pts, c, 0.9);
    var e = pts[pts.length - 1], p = pts[pts.length - 2];
    arrowHead(g, e[0], e[1], Math.atan2(e[1] - p[1], e[0] - p[0]), 3.4, c);
  }

  /* diagonal hatch clipped to a rect (caller may clip a shape first) */
  function hatch(g, x, y, w, h, sp, c, px, dir, phase) {
    var ctx = g.ctx, b;
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.beginPath();
    if (dir >= 0) {
      for (b = (y - x - w) + phase; b <= (y + h - x); b += sp) { ctx.moveTo(x, x + b); ctx.lineTo(x + w, x + w + b); }
    } else {
      for (b = (x + y) + phase; b <= (x + w + y + h); b += sp) { ctx.moveTo(x, b - x); ctx.lineTo(x + w, b - x - w); }
    }
    ctx.strokeStyle = c || C.mut; ctx.lineWidth = W(g, px || 0.7); ctx.stroke();
    ctx.restore();
  }

  function crossHatch(g, x, y, w, h, sp, c, px, phase) {
    hatch(g, x, y, w, h, sp, c, px, 1, phase);
    hatch(g, x, y, w, h, sp, c, px, -1, phase);
  }

  function hLines(g, x, y, w, h, sp, c, px, phase) {
    var ctx = g.ctx, yy;
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.beginPath();
    for (yy = y + phase; yy <= y + h; yy += sp) { ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); }
    ctx.strokeStyle = c || C.mut; ctx.lineWidth = W(g, px || 0.7); ctx.stroke();
    ctx.restore();
  }

  /* hatch inside an arbitrary closed path */
  function hatchShape(g, pathFn, x, y, w, h, sp, c, px, dir, phase) {
    var ctx = g.ctx;
    ctx.save(); pathFn(); ctx.clip();
    hatch(g, x, y, w, h, sp, c, px, dir, phase);
    ctx.restore();
  }

  function txt(g, s, x, y, size, c, align) {
    var ctx = g.ctx;
    ctx.font = size + 'px "Courier New", ui-monospace, monospace';
    ctx.fillStyle = c || C.mut;
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(s, x, y);
  }

  function measure(g, s, size) {
    g.ctx.font = size + 'px "Courier New", ui-monospace, monospace';
    return g.ctx.measureText(s).width;
  }

  /* ---------------- annotations ---------------- */

  function dimH(g, x1, x2, y, label, ext) {
    if (ext) { line(g, x1, y - ext, x1, y + 2, C.mut, 0.6); line(g, x2, y - ext, x2, y + 2, C.mut, 0.6); }
    line(g, x1, y, x2, y, C.mut, 0.7);
    line(g, x1, y - 2.6, x1, y + 2.6, C.mut, 0.7);
    line(g, x2, y - 2.6, x2, y + 2.6, C.mut, 0.7);
    if (label) txt(g, label, (x1 + x2) / 2, y - 2.6, 4, C.mut, 'center');
  }

  function dimV(g, y1, y2, x, label, ext) {
    if (ext) { line(g, x - 2, y1, x + ext, y1, C.mut, 0.6); line(g, x - 2, y2, x + ext, y2, C.mut, 0.6); }
    line(g, x, y1, x, y2, C.mut, 0.7);
    line(g, x - 2.6, y1, x + 2.6, y1, C.mut, 0.7);
    line(g, x - 2.6, y2, x + 2.6, y2, C.mut, 0.7);
    if (label) {
      var ctx = g.ctx;
      ctx.save(); ctx.translate(x - 3.2, (y1 + y2) / 2); ctx.rotate(-Math.PI / 2);
      txt(g, label, 0, 0, 4, C.mut, 'center'); ctx.restore();
    }
  }

  /* leader line from a point on the part out to a label */
  function leader(g, x, y, tx, ty, label, align) {
    var right = align !== 'right', tail = right ? 5 : -5;
    line(g, x, y, tx, ty, C.ink, 0.7);
    dot(g, x, y, 1, C.ink);
    line(g, tx, ty, tx + tail, ty, C.ink, 0.7);
    txt(g, label, tx + tail + (right ? 1.6 : -1.6), ty + 1.7, 4, C.ink, right ? 'left' : 'right');
  }

  /* ---------------- plate chrome ---------------- */

  function pad3(n) { n = String(n); while (n.length < 3) n = '0' + n; return n; }

  function trunc(g, s, maxW, size) {
    if (measure(g, s, size) <= maxW) return s;
    while (s.length > 1 && measure(g, s + '..', size) > maxW) s = s.slice(0, -1);
    return s + '..';
  }

  function chrome(g, node, opts) {
    var ctx = g.ctx, e = node.echelon | 0, plate = pad3(100 + (g.seed % 900));
    var i, corners = [[6, 6, 1, 1], [VW - 6, 6, -1, 1], [VW - 6, VH - 6, -1, -1], [6, VH - 6, 1, -1]];

    ctx.strokeStyle = C.edge; ctx.lineWidth = W(g, 1); ctx.strokeRect(3.5, 3.5, VW - 7, VH - 7);

    for (i = 0; i < 4; i++) {
      var c = corners[i];
      line(g, c[0], c[1], c[0] + 7 * c[2], c[1], C.ink, 1);
      line(g, c[0], c[1], c[0], c[1] + 7 * c[3], C.ink, 1);
    }

    /* faint blueprint grid */
    ctx.save(); ctx.globalAlpha = 0.07; ctx.strokeStyle = C.ink; ctx.lineWidth = W(g, 0.6);
    ctx.beginPath();
    for (i = AREA.x + 8; i < AREA.x + AREA.w; i += 13) { ctx.moveTo(i, AREA.y); ctx.lineTo(i, AREA.y + AREA.h); }
    for (i = AREA.y + 6; i < AREA.y + AREA.h; i += 13) { ctx.moveTo(AREA.x, i); ctx.lineTo(AREA.x + AREA.w, i); }
    ctx.stroke(); ctx.restore();

    txt(g, 'E' + e, 12, 17, 8, C.ink, 'left');
    line(g, 26, 14, 34, 14, C.mut, 0.8);
    txt(g, ['RAW SOURCE', 'MATERIAL', 'PROCESS', 'COMPONENT', 'OBJECT'][e] || '', 37, 15.6, 4.4, C.mut, 'left');
    txt(g, 'PLATE ' + plate, VW - 12, 16.4, 5, C.mut, 'right');

    var name = trunc(g, String(node.name || node.id || 'UNTITLED').toUpperCase(), 150, 5.4);
    txt(g, name, 12, VH - 9, 5.4, C.ink, 'left');
    fillRectA(g, 12 + measure(g, name, 5.4) + 5, VH - 13.4, 4, 4, g.accent);
    txt(g, 'SECT A-A  1:1', VW - 12, VH - 9, 4.4, C.mut, 'right');
  }

  /* ---------------- shared scene builders ---------------- */

  /* cluster of pellets / granules / chunks */
  function pellets(g, x, y, w, h, n, title, shape) {
    var i, cols = Math.max(3, Math.round(Math.sqrt(n * w / h))), rows = Math.ceil(n / cols);
    var cw = w / cols, ch = h / rows, r = Math.min(cw, ch) * 0.32;
    for (i = 0; i < n; i++) {
      var cx = x + (i % cols) * cw + cw / 2 + (g.rng() - 0.5) * cw * 0.25;
      var cy = y + Math.floor(i / cols) * ch + ch / 2 + (g.rng() - 0.5) * ch * 0.25;
      var rr = r * (0.82 + g.rng() * 0.36);
      if (shape === 'square') rectG(g, cx - rr, cy - rr, rr * 2, rr * 2, C.ink, 0.9);
      else circG(g, cx, cy, rr, C.ink, 0.9);
      if (i % 4 === 0) dot(g, cx + rr * 0.35, cy - rr * 0.3, 0.7, C.mut);
    }
    if (title) txt(g, title, x, y - 3, 4.2, C.mut, 'left');
  }

  /* extruded billet / ingot: hatched cylinder in section-ish side view */
  function billet(g, x, y, w, h, label) {
    var rx = h * 0.16;
    ellG(g, x + rx, y + rx, rx, rx, C.ink, 1);           /* far cap  */
    line(g, x + rx, y, x + w - rx, y, C.ink, 1);
    line(g, x + rx, y + h, x + w - rx, y + h, C.ink, 1);
    ellG(g, x + w - rx, y + rx, rx, rx, C.hot, 1);        /* near cap */
    ellG(g, x + w - rx, y + rx, rx * 0.55, rx * 0.55, C.mut, 0.7);
    ctxClipRect(g, x + rx, y, w - rx * 2, h);
    hLines(g, x + rx, y, w - rx * 2, h, 2.4, C.mut, 0.6, g.rng() * 2);
    unclip(g);
    line(g, x + rx, y + rx, x + w - rx, y + rx, C.mut, 0.6);
    line(g, x + rx, y + h - rx, x + w - rx, y + h - rx, C.mut, 0.6);
    if (label) txt(g, label, x, y + h + 6.5, 4.2, C.mut, 'left');
  }

  /* flat spiral: coil stock */
  function coilSpiral(g, cx, cy, r, turns, c) {
    var ctx = g.ctx, i, n = turns * 36, pts = [];
    for (i = 0; i <= n; i++) {
      var t = i / 36, a = t * Math.PI * 2, rr = r * (0.16 + 0.84 * (i / n));
      pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a) * 0.86]);
    }
    poly(g, pts, c || C.ink, 1);
    circG(g, cx, cy, r * 0.16, C.mut, 0.7);
  }

  /* stacked sheets / laminate */
  function sheetStack(g, x, y, w, layers, gap, accentLayer) {
    var i;
    for (i = 0; i < layers; i++) {
      var yy = y + i * gap, off = (i % 2 ? 2.5 : 0);
      rectG(g, x + off, yy, w - 5, gap - 1.4, i === accentLayer ? C.hot : C.ink, 0.9);
      line(g, x + off + 2, yy + (gap - 1.4) / 2, x + off + w - 9, yy + (gap - 1.4) / 2, C.mut, 0.5);
    }
  }

  /* generic strata bands with hatch styles */
  var HATCH_STYLES = [
    function (g, x, y, w, h) { hatch(g, x, y, w, h, 4, C.mut, 0.6, 1, 0); },
    function (g, x, y, w, h) { hatch(g, x, y, w, h, 3, C.mut, 0.6, -1, 1); },
    function (g, x, y, w, h) { crossHatch(g, x, y, w, h, 3.6, C.hot, 0.6, 0); },
    function (g, x, y, w, h) { hLines(g, x, y, w, h, 2.6, C.mut, 0.6, 0.5); },
    function (g, x, y, w, h) { hatch(g, x, y, w, h, 2.2, C.cool, 0.6, 1, 0); }
  ];

  function strata(g, x, y, w, layers, labels) {
    var i, yy = y;
    for (i = 0; i < layers.length; i++) {
      var L = layers[i];
      HATCH_STYLES[L.s % HATCH_STYLES.length](g, x, yy, w, L.t);
      line(g, x, yy, x + w, yy, C.ink, 0.9);
      if (L.t > 9) line(g, x + w * 0.62, yy + L.t / 2, x + w - 3, yy + L.t / 2, C.mut, 0.5);
      if (labels && L.label) txt(g, L.label, x + 2, yy + 5, 3.8, L.s === 2 ? C.hot : C.mut, 'left');
      yy += L.t;
    }
    line(g, x, yy, x + w, yy, C.ink, 0.9);
    rectG(g, x, y, w, yy - y, C.ink, 1);
    return yy;
  }

  /* ---------------- E0 object glyphs ---------------- */

  function glyphKeyboard(g) {
    var x = 42, y = 52, w = 136, h = 60, r, c, kx, ky;
    poly(g, [[x, y], [x + w, y], [x + w - 5, y + h], [x + 5, y + h]], C.ink, 1.2, true);
    for (r = 0; r < 4; r++) {
      for (c = 0; c < 12; c++) {
        kx = x + 9 + c * 10 + r * 1.6; ky = y + 8 + r * 10;
        if (kx > x + w - 16) continue;
        rectG(g, kx, ky, 8.2, 8.2, r === 0 && c === 5 ? g.accent : C.mut, 0.7);
      }
    }
    rectG(g, x + 52, y + h - 12, 34, 8, C.mut, 0.7);
    leader(g, x + 68, y + 6, x + 150, y - 12, 'KEYCAP ROW R1');
    leader(g, x + 5, y + h - 4, x - 8, y + h + 12, 'DECK', 'right');
    leader(g, x + w - 3, y + 30, x + w + 8, y + 18, 'I/O EDGE');
  }

  function glyphChair(g) {
    var x = 74, y = 46, seatY = 92;
    poly(g, [[x + 4, seatY], [x + 74, seatY], [x + 74, seatY + 5], [x + 4, seatY + 5]], C.ink, 1.2, true);
    hatch(g, x + 4, seatY, 70, 5, 3, C.mut, 0.6, 1, 0);
    poly(g, [[x + 8, seatY], [x + 2, y + 6], [x + 9, y + 2], [x + 15, seatY]], C.ink, 1.2, true);
    hatch(g, x + 1, y + 2, 15, seatY - y - 2, 3, C.mut, 0.6, -1, 1);
    line(g, x + 66, seatY + 5, x + 68, seatY + 34, C.ink, 1.2);
    line(g, x + 10, seatY + 5, x + 8, seatY + 34, C.ink, 1.2);
    line(g, x + 8, seatY + 26, x + 68, seatY + 26, C.mut, 0.8);
    leader(g, x + 6, y + 20, x - 22, y + 8, 'BACKREST PLY');
    leader(g, x + 40, seatY + 2, x + 100, seatY - 16, 'SEAT PAN 18mm');
    leader(g, x + 68, seatY + 30, x + 92, seatY + 40, 'LEG Ø25 TUBE');
  }

  function glyphLamp(g) {
    var bx = 104, by = 120;
    ellG(g, bx, by, 22, 5, C.ink, 1.1);
    ellG(g, bx, by - 2, 13, 3, C.mut, 0.7);
    line(g, bx, by - 3, bx - 16, by - 46, C.ink, 1.2);
    line(g, bx - 16, by - 46, bx + 18, by - 64, C.ink, 1.2);
    fillCirc(g, bx - 16, by - 46, 1.8, C.ink);
    fillCirc(g, bx + 18, by - 64, 1.8, C.ink);
    fillPoly(g, [[bx + 16, by - 62], [bx + 42, by - 50], [bx + 26, by - 34]], C.hot, 0.9);
    poly(g, [[bx + 16, by - 62], [bx + 42, by - 50], [bx + 26, by - 34]], C.hot, 1, true);
    line(g, bx + 30, by - 40, bx + 40, by - 24, C.mut, 0.6);
    line(g, bx + 36, by - 46, bx + 50, by - 36, C.mut, 0.6);
    leader(g, bx + 32, by - 48, bx + 56, by - 62, 'SHADE SPUN AL');
    leader(g, bx - 8, by - 28, bx - 54, by - 20, 'ARM + SPHERICAL JOINT', 'right');
    leader(g, bx + 16, by, bx + 44, by + 8, 'WEIGHTED BASE');
  }

  function glyphMug(g) {
    var x = 84, y = 48, w = 46, h = 62;
    poly(g, [[x, y], [x + 4, y + h], [x + w - 4, y + h], [x + w, y]], C.ink, 1.2, true);
    ellG(g, x + w / 2, y, w / 2, 4.5, C.ink, 1.1);
    ellG(g, x + w / 2, y, w / 2 - 3, 2.6, C.mut, 0.7);
    var ctx = g.ctx;
    ctx.beginPath();
    ctx.moveTo(x + w - 1, y + 14);
    ctx.bezierCurveTo(x + w + 22, y + 16, x + w + 22, y + 44, x + w - 2, y + 46);
    ctx.strokeStyle = C.ink; ctx.lineWidth = W(g, 1.2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + w - 1, y + 19);
    ctx.bezierCurveTo(x + w + 14, y + 21, x + w + 14, y + 39, x + w - 2, y + 41);
    ctx.strokeStyle = C.mut; ctx.lineWidth = W(g, 0.7); ctx.stroke();
    line(g, x + 2, y + 26, x + w - 2, y + 26, C.cool, 0.7);
    leader(g, x + w / 2, y, x + w / 2 + 6, y - 14, 'RIM Ø82');
    leader(g, x + w + 12, y + 30, x + w + 30, y + 24, 'HANDLE');
    leader(g, x + 1, y + 52, x - 26, y + 58, 'WALL 3.5', 'right');
  }

  function glyphWindow(g) {
    var x = 76, y = 36, w = 70, h = 76;
    rectG(g, x, y, w, h, C.ink, 1.2);
    rectG(g, x + 5, y + 5, w - 10, h - 10, C.mut, 0.8);
    line(g, x + w / 2, y + 5, x + w / 2, y + h - 5, C.ink, 1);
    line(g, x + 5, y + h / 2, x + w - 5, y + h / 2, C.ink, 1);
    hatch(g, x + 6, y + 6, w / 2 - 7, h / 2 - 7, 5, C.cool, 0.5, 1, 0);
    hatch(g, x + w / 2 + 1, y + h / 2 + 1, w / 2 - 7, h / 2 - 7, 5, C.cool, 0.5, 1, 0);
    line(g, x - 6, y + h, x + w + 6, y + h, C.ink, 1.2);
    line(g, x - 6, y + h, x - 2, y + h + 5, C.mut, 0.8);
    line(g, x + w + 6, y + h, x + w + 2, y + h + 5, C.mut, 0.8);
    leader(g, x + 16, y + 16, x - 22, y + 6, 'IGLU / ARGON GAP', 'right');
    leader(g, x + w / 2, y + h / 2, x + w + 22, y + h / 2 - 8, 'MUNTIN');
    leader(g, x + w - 8, y + h + 2, x + w + 20, y + h + 12, 'SILL');
  }

  function glyphDesk(g) {
    var x = 44, y = 70, w = 132;
    rectG(g, x, y, w, 7, C.ink, 1.2);
    hatch(g, x, y, w, 7, 3, C.mut, 0.6, -1, 0);
    line(g, x + 8, y + 7, x + 10, y + 52, C.ink, 1.2);
    line(g, x + w - 8, y + 7, x + w - 10, y + 52, C.ink, 1.2);
    line(g, x + 26, y + 7, x + 26, y + 34, C.ink, 1);
    rectG(g, x + 30, y + 12, 46, 22, C.ink, 1);
    line(g, x + 34, y + 23, x + 72, y + 23, C.mut, 0.7);
    line(g, x + 10, y + 44, x + w - 10, y + 44, C.mut, 0.7);
    dimH(g, x, x + w, y - 10, '1400', true);
    leader(g, x + w / 2, y + 3, x + w / 2 + 10, y - 24, 'VENEER TOP 25 PLY');
    leader(g, x + 50, y + 20, x + 108, y + 44, 'DRAWER BOX');
    leader(g, x + w - 9, y + 40, x + w + 12, y + 30, 'STRETCHER');
  }

  function glyphPcb(g) {
    var x = 46, y = 54, w = 128, h = 60, i;
    rectG(g, x, y, w, h, C.ink, 1.2);
    for (i = 0; i < 7; i++) {
      var tx = x + 10 + g.rng() * (w - 40), ty = y + 8 + g.rng() * (h - 20);
      line(g, tx, ty, tx + 16 + g.rng() * 22, ty, C.mut, 0.7);
      line(g, tx + 16, ty, tx + 16, ty + 8 + g.rng() * 12, C.mut, 0.7);
      dot(g, tx, ty, 1, C.cool); dot(g, tx + 16, ty + 10, 1, C.cool);
    }
    rectG(g, x + 44, y + 16, 26, 20, C.ink, 1);
    hatch(g, x + 44, y + 16, 26, 20, 3, C.mut, 0.6, 1, 0);
    rectG(g, x + 88, y + 34, 18, 12, C.hot, 1);
    for (i = 0; i < 5; i++) rectG(g, x + 8 + i * 5, y + h - 12, 3, 8, C.mut, 0.6);
    leader(g, x + 57, y + 16, x + 30, y - 14, 'BGA 256');
    leader(g, x + 97, y + 34, x + 130, y + 18, 'MCU QFP');
    leader(g, x + 10, y + h - 8, x - 14, y + h + 10, 'HEADER 2.54', 'right');
    dimV(g, y, y + h, x - 8, '', true);
  }

  function glyphKeycap(g) {
    var x = 78, y = 52, w = 60, h = 44;
    poly(g, [[x, y + h], [x + 9, y], [x + w - 9, y], [x + w, y + h]], C.ink, 1.2, true);
    hatchShape(g, function () {
      poly(g, [[x, y + h], [x + 9, y], [x + w - 9, y], [x + w, y + h]], C.ink, 0.1, true);
    }, x, y, w, h, 3.2, C.mut, 0.6, 1, 0);
    poly(g, [[x + 15, y + 5], [x + 6, y + h], [x + 12, y + h], [x + 20, y + 5]], C.bg, 0.8, true);
    poly(g, [[x + w - 15, y + 5], [x + w - 6, y + h], [x + w - 12, y + h], [x + w - 20, y + 5]], C.bg, 0.8, true);
    rectG(g, x + w / 2 - 6, y + h - 12, 12, 12, C.mut, 0.8);
    line(g, x + w / 2, y + h - 12, x + w / 2, y + h, C.mut, 0.6);
    txt(g, 'R1', x + w / 2, y + 16, 6, g.accent, 'center');
    dimH(g, x, x + w, y + h + 8, '18.5', true);
    dimV(g, y, y + h, x - 8, 'H9.4', true);
    leader(g, x + 9, y + 3, x - 24, y - 12, 'DOUBLE-SHOT LEGEND', 'right');
    leader(g, x + w / 2 + 4, y + h - 6, x + w + 22, y + h + 2, 'STEM +x');
  }

  /* ---------------- clip helpers ---------------- */

  function ctxClipRect(g, x, y, w, h) {
    g.ctx.save(); g.ctx.beginPath(); g.ctx.rect(x, y, w, h); g.ctx.clip();
  }

  function unclip(g) { g.ctx.restore(); }

  /* ---------------- E1 sections ---------------- */

  function sectionPcbStack(g) {
    var x = 66, y = 36, w = 92, rows = [
      ['SOLDERMASK', C.cool], ['CU 35um', C.hot], ['FR4 1080', C.mut],
      ['CU CORE', C.hot], ['FR4 1080', C.mut], ['CU 35um', C.hot], ['SOLDERMASK', C.cool]
    ], i, gap = 10;
    for (i = 0; i < rows.length; i++) {
      var yy = y + i * gap;
      rectG(g, x, yy, w, gap - 2.5, rows[i][1], 0.9);
      if (i % 2 === 1) hatch(g, x, yy, w, gap - 2.5, 3, C.mut, 0.5, 1, 0);
      txt(g, rows[i][0], x + w + 5, yy + 6, 3.8, i % 2 ? C.hot : C.mut, 'left');
      line(g, x + w, yy + 4, x + w + 3.5, yy + 4, C.mut, 0.5);
    }
    var tot = y + rows.length * gap - 2.5;
    line(g, x + 22, y, x + 22, tot, C.mut, 0.8);
    arrowHead(g, x + 22, y, -Math.PI / 2, 3, C.mut);
    arrowHead(g, x + 22, tot, Math.PI / 2, 3, C.mut);
    line(g, x + 52, y, x + 52, tot, C.mut, 0.8);
    arrowHead(g, x + 52, y, -Math.PI / 2, 3, C.mut);
    arrowHead(g, x + 52, tot, Math.PI / 2, 3, C.mut);
    dot(g, x + 22, y + gap * 3.5, 1.2, C.bg); dot(g, x + 52, y + gap * 3.5, 1.2, C.bg);
    txt(g, 'VIA', x + 26, y + gap * 3.5 + 1.5, 3.8, C.mut, 'left');
    dimV(g, y, tot, x - 8, '1.6', true);
    txt(g, 'SECTION A-A', x, tot + 10, 4.2, C.mut, 'left');
  }

  function sectionMugWall(g) {
    var cx = 108, y = 34, h = 74, topW = 34, botW = 27, t = 5;
    poly(g, [[cx - topW, y], [cx - botW, y + h], [cx - botW + t, y + h], [cx - topW + t, y]], C.ink, 1.1, true);
    poly(g, [[cx + topW, y], [cx + botW, y + h], [cx + botW - t, y + h], [cx + topW - t, y]], C.ink, 1.1, true);
    hatch(g, cx - topW, y, topW - botW + t, h, 2.6, C.mut, 0.55, 1, 0);
    hatch(g, cx + botW - t, y, topW - botW + t, h, 2.6, C.mut, 0.55, -1, 0);
    ellG(g, cx, y, topW, 4, C.ink, 1);
    ellG(g, cx, y, topW - t, 2.4, C.mut, 0.7);
    line(g, cx - topW + t, y + 26, cx + topW - t, y + 26, C.cool, 0.8);
    txt(g, 'GLAZE 0.3', cx + topW + 6, y + 24, 3.8, C.cool, 'left');
    dimH(g, cx - topW, cx - topW + t, y - 8, '3.5', true);
    dimV(g, y, y + h, cx - topW - 12, 'H 95', true);
    leader(g, cx + botW - t / 2, y + h - 10, cx + botW + 26, y + h - 4, 'FOOT RING');
    txt(g, 'WALL SECTION 8:1', cx - topW, y + h + 14, 4.2, C.mut, 'left');
  }

  function sectionPane(g) {
    var x = 58, y = 50, w = 112, panes = [0, 46], i;
    for (i = 0; i < 2; i++) {
      var px = x + panes[i];
      rectG(g, px, y, 8, 52, C.ink, 1);
      hatch(g, px, y, 8, 52, 3, C.cool, 0.5, 1, 0);
      txt(g, 'GLASS 6mm', px - 2, y - 6, 3.8, C.mut, 'left');
    }
    rectG(g, x + 8, y + 18, 38, 10, C.mut, 0.8);
    hatch(g, x + 8, y + 18, 38, 10, 2.4, C.mut, 0.5, -1, 0);
    txt(g, 'SPACER + DESICCANT', x + 8, y + 14, 3.6, C.mut, 'left');
    line(g, x + 10, y, x + 10, y + 52, C.hot, 0.6);
    txt(g, 'LOW-E', x + 12, y + 40, 3.6, C.hot, 'left');
    line(g, x + 8.5 + 46, y + 4, x + 8.5 + 46, y + 48, C.cool, 0.6);
    txt(g, 'Ar 90%', x + 24, y + 64, 4, C.cool, 'center');
    dimH(g, x, x + 54, y - 14, '24 UNIT', true);
    leader(g, x + 4, y + 30, x - 22, y + 16, 'PYROLYTIC COAT', 'right');
    leader(g, x + 54, y + 30, x + 74, y + 16, 'CAVITY');
  }

  function sectionPlywood(g) {
    var x = 62, y = 48, w = 100, i, gap = 7;
    for (i = 0; i < 6; i++) {
      var yy = y + i * gap;
      rectG(g, x, yy, w, gap - 1.6, C.ink, 0.9);
      if (i % 2) hatch(g, x, yy, w, gap - 1.6, 2.4, C.mut, 0.5, 1, 0);
      else hatch(g, x, yy, w, gap - 1.6, 2.4, C.mut, 0.5, -1, 0);
    }
    var tot = y + 6 * gap - 1.6;
    dimV(g, y, tot, x - 9, '18', true);
    txt(g, 'CROSS-BAND LAMINATION', x, tot + 9, 4.2, C.mut, 'left');
    leader(g, x + 30, y + gap * 2.5, x + w + 12, y + 10, 'CORE VENEER');
    leader(g, x + 30, y + 1, x + w + 12, y - 8, 'FACE BALSA 1.4');
  }

  function sectionThread(g) {
    var x = 60, y = 44, w = 108, core = 30, pitch = 21, i, pts = [];
    rectG(g, x, y + core, w, 26, C.ink, 1);
    hatch(g, x, y + core, w, 26, 2.6, C.mut, 0.55, 1, 0);
    pts.push([x, y + core]);
    for (i = 0; i < 6; i++) {
      pts.push([x + i * pitch + pitch * 0.25, y + 8]);
      pts.push([x + i * pitch + pitch * 0.5, y + core]);
    }
    pts.push([x + w, y + core]);
    poly(g, pts, C.ink, 1.1);
    var low = [];
    for (i = 0; i < 6; i++) {
      low.push([x + i * pitch + pitch * 0.25, y + core + 26]);
      low.push([x + i * pitch + pitch * 0.5, y + core + 54 - 8]);
    }
    poly(g, [[x, y + core + 26]].concat(low, [[x + w, y + core + 26]]), C.ink, 1.1);
    dimH(g, x + pitch * 0.5, x + pitch * 1.5, y - 8, 'P 1.5', true);
    dimV(g, y + 8, y + core, x - 10, 'D', true);
    leader(g, x + pitch * 3.5, y + 10, x + pitch * 3.5 + 16, y - 2, '60 deg THREAD');
    txt(g, 'MAJOR DIA 12.0  h6', x, y + core + 68, 4.2, C.mut, 'left');
  }

  function sectionKeycapProfile(g) {
    var x = 72, y = 44, w = 72, h = 42;
    poly(g, [[x, y + h], [x + 11, y + 6], [x + w - 11, y + 6], [x + w, y + h]], C.ink, 1.2, true);
    hatchShape(g, function () {
      poly(g, [[x, y + h], [x + 11, y + 6], [x + w - 11, y + 6], [x + w, y + h]], C.ink, 0.1, true);
    }, x, y, w, h, 3, C.mut, 0.6, 1, 0);
    poly(g, [[x + 9, y + h - 6], [x + 17, y + 12], [x + w - 17, y + 12], [x + w - 9, y + h - 6]], C.bg, 0.9, true);
    rectG(g, x + w / 2 - 7, y + h - 16, 14, 16, C.mut, 0.8);
    line(g, x + w / 2, y + h - 16, x + w / 2, y + h, C.mut, 0.6);
    txt(g, 'SOUND DAMPING FOAM', x + 14, y + h - 8, 3.6, C.mut, 'left');
    dimH(g, x, x + w, y + h + 8, '18.5', true);
    dimV(g, y + 6, y + h, x - 10, '9.4', true);
    leader(g, x + w - 11, y + 8, x + w + 16, y - 4, 'R1 DISH');
    leader(g, x + 2, y + h - 2, x - 22, y + h + 8, 'WALL 1.5', 'right');
  }

  /* ---------------- E2 machines ---------------- */

  function machineInjection(g) {
    var y = 60, h = 34;
    fillPoly(g, [[36, y - 12], [50, y - 20], [50, y - 32], [62, y - 32], [62, y - 20], [50, y - 12]], C.mut, 0.6);
    poly(g, [[36, y - 12], [50, y - 20], [50, y - 32], [62, y - 32], [62, y - 20], [50, y - 12]], C.ink, 1.1, true);
    txt(g, 'HOPPER', 34, y - 36, 3.8, C.mut, 'left');
    rectG(g, 46, y, 96, h, C.ink, 1.2);
    var i, turns = 9;
    for (i = 0; i <= turns; i++) {
      var sx = 52 + i * (88 / turns);
      ellG(g, sx, y + h / 2, 2.4, h / 2 - 6, i > turns - 3 ? C.hot : C.mut, 0.7);
    }
    line(g, 52, y + h / 2, 140, y + h / 2, C.ink, 1);
    for (i = 0; i < 6; i++) line(g, 60 + i * 14, y - 3, 60 + i * 14, y, C.mut, 0.8);
    txt(g, 'BARREL + SCREW L/D 22', 46, y + h + 8, 4, C.mut, 'left');
    txt(g, 'MELT', 118, y + h + 8, 4, C.hot, 'left');
    rectG(g, 30, y + 4, 16, h - 8, C.ink, 1);
    hatch(g, 30, y + 4, 16, h - 8, 2.6, C.mut, 0.55, 1, 0);
    txt(g, 'DRIVE', 28, y + h + 8, 3.8, C.mut, 'left');
    rectG(g, 150, y - 8, 16, h + 16, C.ink, 1.1);
    rectG(g, 166, y - 8, 16, h + 16, C.ink, 1.1);
    hatch(g, 150, y - 8, 16, h + 16, 2.6, C.mut, 0.55, 1, 0);
    poly(g, [[166, y + 4], [174, y + h / 2], [166, y + h + 4]], C.hot, 1, true);
    arrow(g, 146, y + h / 2, 150, y + h / 2, C.hot, 0.9);
    arrow(g, 190, y + h / 2, 196, y + h / 2, C.mut, 0.9);
    arrow(g, 148, y - 14, 142, y - 14, C.mut, 0.8);
    arrow(g, 168, y - 14, 174, y - 14, C.mut, 0.8);
    txt(g, 'CLAMP 180t', 146, y - 18, 4, C.mut, 'center');
    txt(g, 'MOLD HALVES', 150, y + h + 16, 4, C.mut, 'left');
    arcArrow(g, 70, y + h / 2, 13, 0.2, 2.4, C.ink);
    txt(g, 'SCREW ROTATION', 62, y + h + 20, 3.8, C.mut, 'left');
  }

  function machineCnc(g) {
    var cx = 110, baseY = 106;
    rectG(g, 56, baseY, 108, 12, C.ink, 1.1);
    hatch(g, 56, baseY, 108, 12, 3, C.mut, 0.55, -1, 0);
    rectG(g, 84, 40, 52, 18, C.ink, 1.2);
    hatch(g, 84, 40, 52, 18, 2.6, C.mut, 0.5, 1, 0);
    txt(g, 'SPINDLE 18k RPM', 84, 34, 4, C.mut, 'left');
    rectG(g, cx - 9, 58, 18, 14, C.ink, 1);
    poly(g, [[cx - 6, 72], [cx + 6, 72], [cx + 3, 86], [cx - 3, 86]], C.ink, 1.1, true);
    for (var i = 0; i < 4; i++) line(g, cx - 5 + i * 0.6, 74 + i * 2.4, cx + 5 - i * 0.6, 76 + i * 2.4, C.mut, 0.6);
    rectG(g, 78, 86, 64, 18, C.ink, 1.1);
    hatch(g, 78, 86, 64, 18, 2.6, C.mut, 0.55, 1, 0);
    poly(g, [[96, 86], [100, 78], [120, 78], [124, 86]], C.bg, 1, true);
    txt(g, 'WORKPIECE 7075-T6', 78, baseY + 9, 4, C.mut, 'left');
    arcArrow(g, cx, 66, 17, -0.6, 2.2, C.hot);
    arrow(g, cx + 24, 96, cx + 40, 96, C.hot, 0.9);
    txt(g, 'FEED', cx + 26, 92, 3.8, C.hot, 'left');
    arrow(g, 50, 66, 50, 96, C.mut, 0.8);
    arrowHead(g, 50, 66, -Math.PI / 2, 3.2, C.mut);
    txt(g, 'Z', 44, 80, 4, C.mut, 'left');
    arrow(g, 162, 112, 190, 112, C.mut, 0.8);
    arrowHead(g, 162, 112, Math.PI, 3.2, C.mut);
    txt(g, 'X 600', 168, 108, 4, C.mut, 'left');
    line(g, cx - 3, 86, cx - 3, 92, C.cool, 0.7);
    line(g, cx + 2, 86, cx + 2, 90, C.cool, 0.7);
    txt(g, 'COOLANT', cx + 8, 92, 3.6, C.cool, 'left');
  }

  function machineKiln(g) {
    var x = 62, y = 46, w = 100, h = 62;
    rectG(g, x, y, w, h, C.ink, 1.2);
    var ctx = g.ctx;
    ctx.beginPath(); ctx.moveTo(x + 12, y + h); ctx.lineTo(x + 12, y + h - 22);
    ctx.arc(x + 26, y + h - 22, 14, Math.PI, 0); ctx.lineTo(x + 40, y + h);
    ctx.strokeStyle = C.ink; ctx.lineWidth = W(g, 1.1); ctx.stroke();
    fillPoly(g, [[x + 14, y + h], [x + 14, y + h - 18], [x + 26, y + h - 32], [x + 38, y + h - 18], [x + 38, y + h]], C.hot, 0.5);
    var i;
    for (i = 0; i < 5; i++) for (var j = 0; j < 3; j++) {
      line(g, x + 48 + (j % 2) * 8, y + 8 + i * 10, x + 96, y + 8 + i * 10, C.mut, 0.4);
    }
    hatch(g, x + 46, y + 4, w - 50, h - 8, 4, C.mut, 0.5, -1, 0);
    rectG(g, x + 78, y - 22, 12, 22, C.ink, 1);
    hatch(g, x + 78, y - 22, 12, 22, 2.6, C.mut, 0.5, 1, 0);
    txt(g, 'STACK', x + 76, y - 26, 3.8, C.mut, 'left');
    txt(g, 'KILN 1240C  OXID', x + 46, y + h + 9, 4.2, C.hot, 'left');
    txt(g, 'FIREBRICK 340mm', x + 46, y + h - 4, 3.8, C.mut, 'left');
    arcArrow(g, x + 100, y + 30, 12, -1.2, 1.2, C.hot);
    txt(g, 'AIR', x + 114, y + 30, 3.8, C.mut, 'left');
    leader(g, x + 6, y + h - 10, x - 24, y + h + 2, 'WARE SETTING', 'right');
  }

  function machineRolling(g) {
    var cy = 84, rx = 20;
    circG(g, 84, cy, rx, C.ink, 1.2);
    circG(g, 84, cy, 5, C.mut, 0.8);
    circG(g, 136, cy, rx, C.ink, 1.2);
    circG(g, 136, cy, 5, C.mut, 0.8);
    var i;
    for (i = 0; i < 8; i++) {
      var a = i * Math.PI / 4;
      line(g, 84 + 5 * Math.cos(a), cy + 5 * Math.sin(a), 84 + rx * Math.cos(a), cy + rx * Math.sin(a), C.mut, 0.6);
      line(g, 136 + 5 * Math.cos(a), cy + 5 * Math.sin(a), 136 + rx * Math.cos(a), cy + rx * Math.sin(a), C.mut, 0.6);
    }
    rectG(g, 34, cy - 3, 152, 6, C.hot, 1);
    hatch(g, 34, cy - 3, 152, 6, 2.4, C.mut, 0.5, 1, 0);
    txt(g, 'STRIP 1250 x 3mm', 34, cy - 8, 4, C.hot, 'left');
    arcArrow(g, 84, cy, rx + 6, 1.6, 4.2, C.ink);
    arcArrow(g, 136, cy, rx + 6, -1.1, 1.5, C.ink);
    arrow(g, 160, cy - 16, 186, cy - 16, C.mut, 0.9);
    txt(g, '56 m/s', 162, cy - 20, 4, C.mut, 'left');
    line(g, 60, cy - rx, 60, cy - rx - 14, C.cool, 0.7);
    line(g, 66, cy - rx, 66, cy - rx - 10, C.cool, 0.7);
    txt(g, 'LAMINAR COOL', 54, cy - rx - 18, 3.8, C.cool, 'left');
    dimV(g, cy - rx, cy + rx, 196, 'D450', false);
  }

  function machineReflow(g) {
    var y = 74, i;
    rectG(g, 34, y + 18, 152, 8, C.ink, 1.1);
    for (i = 0; i < 16; i++) circG(g, 40 + i * 9.6, y + 22, 3, C.mut, 0.7);
    rectG(g, 76, y - 2, 62, 8, C.ink, 1.1);
    for (i = 0; i < 4; i++) rectG(g, 82 + i * 14, y + 1, 8, 3, C.hot, 0.7);
    arrow(g, 100, y + 12, 132, y + 12, C.mut, 0.9);
    var zones = ['PREHEAT', 'SOAK', 'REFLOW', 'COOL'];
    for (i = 0; i < 4; i++) {
      var zx = 40 + i * 38;
      line(g, zx, y - 34, zx, y + 14, C.mut, 0.5);
      txt(g, zones[i], zx + 3, y - 36, 3.8, i === 2 ? C.hot : C.mut, 'left');
      arrowHead(g, zx + 30, y - 30, Math.PI / 2, 3, i === 2 ? C.hot : C.mut);
      line(g, zx + 30, y - 40, zx + 30, y - 30, i === 2 ? C.hot : C.mut, 0.7);
    }
    txt(g, 'PICK-PLACE + REFLOW 245C', 34, y + 38, 4.2, C.mut, 'left');
    leader(g, 100, y + 4, 100, y - 12, 'SOLDER JOINT');
  }

  function machineDriver(g) {
    var x = 44, y = 62, w = 62, h = 40;
    rectG(g, x, y, w, h, C.ink, 1.2);
    hatch(g, x, y, w, h, 3.4, C.mut, 0.5, 1, 0);
    txt(g, 'DRIVER 24VDC', x, y - 6, 4, C.mut, 'left');
    line(g, x + w, y + 12, x + w + 26, y + 12, C.ink, 1);
    line(g, x + w, y + 28, x + w + 26, y + 28, C.ink, 1);
    var lx = x + w + 40, ly = y + 20;
    poly(g, [[lx - 10, ly + 6], [lx + 10, ly + 6], [lx, ly - 10]], C.hot, 1.1, true);
    line(g, lx - 10, ly + 10, lx + 10, ly + 10, C.hot, 1.1);
    line(g, lx - 6, ly - 12, lx - 8, ly - 18, C.hot, 0.7);
    line(g, lx + 6, ly - 12, lx + 8, ly - 18, C.hot, 0.7);
    arrowHead(g, lx - 8, ly - 18, -1.9, 2.6, C.hot);
    arrowHead(g, lx + 8, ly - 18, -1.2, 2.6, C.hot);
    txt(g, 'LED MODULE 9W', lx - 16, ly + 24, 4, C.hot, 'left');
    arrow(g, x + 8, y - 6, x + 8, y - 16, C.mut, 0.8);
    txt(g, '230V ~', x + 12, y - 10, 3.8, C.mut, 'left');
    arcArrow(g, x + w + 13, y + 20, 6, 0.5, 5.5, C.cool);
    txt(g, 'CONSTANT CURRENT', x, y + h + 10, 3.8, C.cool, 'left');
  }

  /* ---------------- E3 materials ---------------- */

  function matSamples(g) {
    var x = 26, y = 34, cw = 80, ch = 44;
    pellets(g, x, y + 6, 62, 26, 24, 'PELLETS');
    billet(g, x + cw + 14, y + 2, 62, 22, 'BILLET');
    coilSpiral(g, x + 28, y + ch + 26, 20, 4, C.ink);
    txt(g, 'COIL', x + 2, y + ch + 54, 4.2, C.mut, 'left');
    sheetStack(g, x + cw + 16, y + ch + 12, 62, 4, 6, 1);
    txt(g, 'SHEET', x + cw + 14, y + ch + 54, 4.2, C.mut, 'left');
    line(g, x + cw + 4, y - 4, x + cw + 4, y + ch * 2 + 20, C.edge, 0.8);
    line(g, x - 8, y + ch + 2, x + cw * 2 + 12, y + ch + 2, C.edge, 0.8);
  }

  /* ---------------- E4 sources ---------------- */

  function srcMine(g, oreLabel) {
    var x = 20, y = 28, w = 180, gy = y + 16, steps = 4, bw = w / (steps * 2 + 2), bh = 11, i, pts = [[x, gy]];
    line(g, x, gy, x + w, gy, C.mut, 0.6);
    for (i = 0; i < steps; i++) { pts.push([x + i * bw, gy]); pts.push([x + i * bw, gy + (i + 1) * bh]); pts.push([x + (i + 1) * bw, gy + (i + 1) * bh]); }
    pts.push([x + steps * bw, gy + steps * bh]);
    var fx = x + steps * bw + bw * 1.6;
    pts.push([fx, gy + steps * bh]);
    for (i = steps - 1; i >= 0; i--) {
      pts.push([fx + (steps - i - 1) * bw, gy + (i + 1) * bh]);
      pts.push([fx + (steps - i - 1) * bw, gy + i * bh]);
      pts.push([fx + (steps - i) * bw, gy + i * bh]);
    }
    pts.push([x + w, gy]);
    poly(g, pts, C.ink, 1.2);
    ctxClipRect(g, x, gy, w, 90);
    hatch(g, x, gy + 1, w, steps * bh - 1, 4, C.mut, 0.55, 1, g.rng() * 3);
    var oy = gy + steps * bh + 1;
    var ctx = g.ctx;
    ctx.beginPath();
    ctx.moveTo(x + 18, oy + 26); ctx.quadraticCurveTo(fx, oy - 4, x + w - 14, oy + 24);
    ctx.quadraticCurveTo(fx, oy + 8, x + 18, oy + 26); ctx.closePath();
    ctx.strokeStyle = C.hot; ctx.lineWidth = W(g, 1); ctx.stroke();
    hatchShape(g, function () {
      ctx.beginPath();
      ctx.moveTo(x + 18, oy + 26); ctx.quadraticCurveTo(fx, oy - 4, x + w - 14, oy + 24);
      ctx.quadraticCurveTo(fx, oy + 8, x + 18, oy + 26); ctx.closePath();
    }, x, oy - 6, w, 40, 3.2, C.hot, 0.55, -1, 0);
    unclip(g);
    line(g, x, oy + 40, x + w, oy + 40, C.ink, 0.9);
    hatch(g, x, oy + 40, w, 14, 2.4, C.cool, 0.5, 1, 0);
    txt(g, oreLabel || 'ORE BODY', x + 22, oy + 22, 4.2, C.hot, 'left');
    txt(g, 'OVERBURDEN', x + 2, gy + 9, 3.8, C.mut, 'left');
    txt(g, 'BEDROCK', x + 2, oy + 50, 3.8, C.cool, 'left');
    txt(g, 'BENCH 15m', fx - 26, gy + steps * bh - 3, 3.8, C.mut, 'left');
    arrow(g, x + 6, gy + 6, x + 30, gy + 6, C.mut, 0.7);
    rectG(g, x + 96, gy - 9, 14, 7, C.ink, 0.8);
    circG(g, x + 99, gy - 1, 1.8, C.mut, 0.6); circG(g, x + 107, gy - 1, 1.8, C.mut, 0.6);
    txt(g, 'HAUL', x + 113, gy - 3, 3.6, C.mut, 'left');
  }

  function srcDerrick(g, label) {
    var x = 20, y = 30, w = 180, gy = y + 14, cx = 70, i;
    var bottom = strata(g, x, gy + 34, w, [
      { t: 16, s: 0, label: 'SHALE' },
      { t: 22, s: 3, label: 'SANDSTONE' },
      { t: 18, s: 2, label: label || 'RESERVOIR' },
      { t: 16, s: 4 }
    ], true);
    var apex = gy + 32;
    poly(g, [[cx - 20, apex], [cx, y - 4], [cx + 20, apex]], C.ink, 1.2);
    line(g, cx - 14, apex, cx + 14, apex, C.ink, 1);
    for (i = 1; i < 6; i++) {
      var t = i / 6, yy = apex + (y - 4 - apex) * t, half = 20 * (1 - t);
      line(g, cx - half, yy, cx + half, yy, C.mut, 0.6);
      if (i < 6) line(g, cx - half, yy, cx + half * 0.7, yy - (apex - y + 4) / 6, C.mut, 0.5);
    }
    rectG(g, cx - 6, y - 9, 12, 5, C.ink, 0.9);
    line(g, cx, y - 4, cx, bottom - 6, C.hot, 1);
    for (i = 0; i < 8; i++) fillCirc(g, cx - 1.6 + (i % 2) * 3.2, gy + 46 + i * 5, 1, C.hot);
    line(g, cx - 10, bottom - 6, cx + 10, bottom - 6, C.mut, 0.8);
    line(g, cx - 10, bottom - 6, cx - 10, bottom - 2, C.mut, 0.8);
    line(g, cx + 10, bottom - 6, cx + 10, bottom - 2, C.mut, 0.8);
    txt(g, 'WELLHEAD', cx + 14, bottom - 4, 3.8, C.mut, 'left');
    leader(g, cx + 2, gy + 74, cx + 40, gy + 64, 'PAY ZONE -2400m');
    leader(g, cx - 18, y + 10, cx - 48, y - 2, 'DERRICK 41m', 'right');
    arrow(g, 150, gy + 6, 150, gy + 30, C.mut, 0.8);
    txt(g, 'OIL IN', 154, gy + 20, 3.6, C.mut, 'left');
  }

  function srcSand(g) {
    var x = 20, y = 30, w = 180, gy = y + 16;
    strata(g, x, gy, w, [
      { t: 14, s: 0, label: 'TOPSOIL' },
      { t: 24, s: 3, label: 'SILICA SAND 99.6% SiO2' },
      { t: 20, s: 1, label: 'CLAY' },
      { t: 22, s: 4 }
    ], true);
    var i;
    for (i = 0; i < 26; i++) {
      var gx = x + 14 + g.rng() * (w - 28), gyv = gy + 17 + g.rng() * 18;
      circG(g, gx, gyv, 1 + g.rng() * 1.2, C.mut, 0.5);
    }
    var cx = 158, apex = gy - 2;
    poly(g, [[cx - 15, apex], [cx, apex - 26], [cx + 15, apex]], C.ink, 1);
    line(g, cx - 9, apex - 8, cx + 9, apex - 8, C.mut, 0.6);
    line(g, cx - 4, apex - 16, cx + 4, apex - 16, C.mut, 0.6);
    txt(g, 'DREDGE', cx - 18, apex - 30, 3.8, C.mut, 'left');
    circG(g, x + 44, gy + 56, 18, C.ink, 1);
    for (i = 0; i < 7; i++) {
      var a = i * 0.9;
      circG(g, x + 44 + 9 * Math.cos(a), gy + 56 + 9 * Math.sin(a), 2.4 + g.rng(), C.mut, 0.6);
    }
    txt(g, 'GRAIN 200um', x + 68, gy + 56, 4, C.mut, 'left');
    line(g, x + 62, gy + 50, x + 70, gy + 40, C.mut, 0.6);
    txt(g, 'SECTION A-A', x, gy + 92, 4.2, C.mut, 'left');
  }

  function clayPit(g) {
    var x = 20, y = 32, w = 180, gy = y + 16;
    strata(g, x, gy, w, [
      { t: 12, s: 0, label: 'TOPSOIL' },
      { t: 30, s: 1, label: 'KAOLIN CLAY' },
      { t: 18, s: 3, label: 'SANDSTONE' },
      { t: 20, s: 4 }
    ], true);
    poly(g, [[x + 30, gy + 12], [x + 150, gy + 12], [x + 130, gy + 42], [x + 50, gy + 42]], C.bg, 1, true);
    hatchShape(g, function () {
      poly(g, [[x + 30, gy + 12], [x + 150, gy + 12], [x + 130, gy + 42], [x + 50, gy + 42]], C.bg, 0.1, true);
    }, x + 30, gy + 12, 120, 30, 3, C.mut, 0.55, 1, 0);
    poly(g, [[x + 30, gy + 12], [x + 150, gy + 12], [x + 130, gy + 42], [x + 50, gy + 42]], C.ink, 1, true);
    txt(g, 'EXCAVATION 8m', x + 62, gy + 30, 4, C.mut, 'left');
    pellets(g, x + 6, gy + 56, 60, 22, 16, 'WET CAKE', 'square');
    txt(g, 'SECTION A-A', x, gy + 92, 4.2, C.mut, 'left');
  }

  function barrelGlyph(g) {
    var x = 84, y = 42, w = 52, h = 72, ctx = g.ctx;
    ctx.beginPath();
    ctx.moveTo(x, y + 6);
    ctx.bezierCurveTo(x - 7, y + h / 2, x - 7, y + h / 2, x, y + h - 6);
    ctx.lineTo(x + w, y + h - 6);
    ctx.bezierCurveTo(x + w + 7, y + h / 2, x + w + 7, y + h / 2, x + w, y + 6);
    ctx.closePath();
    ctx.strokeStyle = C.ink; ctx.lineWidth = W(g, 1.2); ctx.stroke();
    ellG(g, x + w / 2, y + 6, w / 2, 5, C.ink, 1);
    line(g, x - 3, y + 26, x + w + 3, y + 26, C.mut, 0.8);
    line(g, x - 3, y + h - 26, x + w + 3, y + h - 26, C.mut, 0.8);
    hatchShape(g, function () {
      ctx.beginPath();
      ctx.moveTo(x, y + 6);
      ctx.bezierCurveTo(x - 7, y + h / 2, x - 7, y + h / 2, x, y + h - 6);
      ctx.lineTo(x + w, y + h - 6);
      ctx.bezierCurveTo(x + w + 7, y + h / 2, x + w + 7, y + h / 2, x + w, y + 6);
      ctx.closePath();
    }, x - 8, y, w + 16, h, 3.6, C.hot, 0.5, 1, 0);
    txt(g, 'CRUDE', x + 8, y + 52, 6, C.hot, 'left');
    leader(g, x + w / 2, y + 2, x + w + 26, y - 12, '36 API');
    leader(g, x - 2, y + h - 16, x - 26, y + h + 4, 'HOOP', 'right');
    dimV(g, y, y + h, x - 16, '0.16 m3', true);
  }

  function sandPile(g) {
    var bx = 60, by = 108, i;
    poly(g, [[bx - 46, by], [bx, by - 48], [bx + 46, by]], C.ink, 1.2, true);
    hatchShape(g, function () { poly(g, [[bx - 46, by], [bx, by - 48], [bx + 46, by]], C.ink, 0.1, true); },
      bx - 46, by - 48, 92, 48, 3, C.mut, 0.55, -1, 0);
    poly(g, [[bx - 46, by], [bx, by - 48], [bx + 46, by]], C.ink, 1.2, true);
    line(g, bx - 46, by, bx + 46, by, C.ink, 1.2);
    circG(g, 156, 64, 24, C.ink, 1.1);
    for (i = 0; i < 9; i++) {
      var a = i * 0.7, r = 6 + g.rng() * 12;
      circG(g, 156 + r * Math.cos(a), 64 + r * Math.sin(a), 1.6 + g.rng() * 1.4, C.mut, 0.6);
    }
    txt(g, 'GRAIN 150-300um', 132, 98, 4, C.mut, 'left');
    line(g, 138, 78, 106, 96, C.mut, 0.6);
    txt(g, 'SILICA SiO2 99.6%', bx - 46, by + 9, 4.2, C.mut, 'left');
    dimH(g, bx - 46, bx + 46, by + 16, '', true);
  }

  function clayLumps(g) {
    pellets(g, 46, 52, 74, 56, 18, 'WET CAKE / GREEN BODY');
    var i;
    for (i = 0; i < 10; i++) {
      var lx = 50 + g.rng() * 66, ly = 56 + g.rng() * 48;
      hatch(g, lx - 4, ly - 4, 8, 8, 2.2, C.mut, 0.5, 1, 0);
    }
    circG(g, 158, 74, 26, C.ink, 1.1);
    var ctx = g.ctx;
    ctx.save(); ctx.beginPath(); ctx.arc(158, 74, 26, 0, Math.PI * 2); ctx.clip();
    for (i = 0; i < 5; i++) line(g, 132, 54 + i * 10, 184, 46 + i * 12, C.mut, 0.5);
    ctx.restore();
    circG(g, 158, 74, 14, C.mut, 0.7);
    txt(g, 'PARTICLE 2um', 130, 112, 4, C.mut, 'left');
    leader(g, 150, 62, 122, 44, 'PLATELET');
    txt(g, 'MOISTURE 22%', 46, 120, 4.2, C.mut, 'left');
  }

  /* ---------------- springs, screws, switches ---------------- */

  function glyphSpring(g, compressed) {
    var cx = 108, top = compressed ? 56 : 40, bot = 108, turns = 6, rx = 22, ry = (bot - top) / (turns * 2), i, pts = [];
    ellG(g, cx, top, rx, ry, C.mut, 0.8);
    for (i = 0; i <= turns * 2; i++) {
      var yy = top + i * ((bot - top) / (turns * 2));
      pts.push([cx - rx, yy]);
      pts.push([cx + rx, yy + (bot - top) / (turns * 2) / 2]);
    }
    poly(g, pts, C.ink, 1.2);
    ellG(g, cx, bot, rx, ry, C.mut, 0.8);
    line(g, cx - rx - 12, top, cx + rx + 12, top, C.mut, 0.7);
    line(g, cx - rx - 12, bot, cx + rx + 12, bot, C.mut, 0.7);
    dimV(g, top, bot, cx - rx - 18, compressed ? 'L 16' : 'L 24', true);
    arrow(g, cx, top - 14, cx, top - 3, C.hot, 0.9);
    if (!compressed) arrow(g, cx, bot + 14, cx, bot + 3, C.hot, 0.9);
    txt(g, compressed ? 'WORKING 42N' : 'FREE LENGTH', cx + rx + 14, top + 6, 4, C.hot, 'left');
    leader(g, cx + rx - 2, top + 12, cx + rx + 26, bot - 26, 'WIRE 1.2 CR-SI');
    dimH(g, cx - rx, cx + rx, bot + 10, 'OD 22', true);
  }

  function glyphScrew(g) {
    var cx = 108, y = 34, shankY = 54, bot = 112, i, pts = [];
    ellG(g, cx, y + 8, 20, 6, C.ink, 1.2);
    poly(g, [[cx - 20, y + 8], [cx - 14, shankY], [cx + 14, shankY], [cx + 20, y + 8]], C.ink, 1.2, true);
    hatch(g, cx - 20, y + 8, 40, shankY - y - 8, 3, C.mut, 0.55, 1, 0);
    line(g, cx - 10, y + 6, cx + 10, y + 10, C.mut, 1);
    line(g, cx - 14, shankY, cx - 10, bot, C.ink, 1.2);
    line(g, cx + 14, shankY, cx + 10, bot, C.ink, 1.2);
    poly(g, [[cx - 10, bot], [cx, bot + 8], [cx + 10, bot]], C.ink, 1.2, true);
    for (i = 0; i < 9; i++) {
      var yy = shankY + 4 + i * 6;
      line(g, cx - 14 + i * 0.4, yy, cx - 10 + i * 0.4, yy + 3, C.ink, 0.9);
      line(g, cx + 14 - i * 0.4, yy, cx + 10 - i * 0.4, yy + 3, C.ink, 0.9);
    }
    dimH(g, cx - 20, cx + 20, y - 8, 'DIA 5', true);
    dimV(g, shankY, bot, cx + 26, 'L 40', true);
    txt(g, 'ISO 4762  8.8', cx - 44, bot + 4, 4.2, C.mut, 'left');
    leader(g, cx - 12, y + 46, cx - 40, y + 40, 'HEX SOCKET', 'right');
  }

  function switchAssembly(g) {
    var cx = 106, baseY = 104;
    rectG(g, cx - 46, baseY, 92, 14, C.ink, 1.2);
    hatch(g, cx - 46, baseY, 92, 14, 3, C.mut, 0.55, 1, 0);
    txt(g, 'PCB + SOCKET', cx - 46, baseY + 22, 4, C.mut, 'left');
    rectG(g, cx - 26, baseY - 30, 52, 30, C.ink, 1.1);
    poly(g, [[cx - 12, baseY - 30], [cx - 12, baseY - 52], [cx + 12, baseY - 52], [cx + 12, baseY - 30]], C.ink, 1.2, true);
    hatch(g, cx - 12, baseY - 52, 24, 22, 2.6, C.mut, 0.5, -1, 0);
    txt(g, 'STEM POM', cx + 16, baseY - 54, 3.8, C.mut, 'left');
    var i, sx = cx - 8;
    for (i = 0; i < 5; i++) ellG(g, sx + (i % 2) * 16, baseY - 14 + i * 2.6, 8, 2, C.hot, 0.7);
    txt(g, 'SPRING 50gf', cx + 22, baseY - 10, 3.8, C.hot, 'left');
    line(g, cx + 26, baseY - 20, cx + 40, baseY - 24, C.mut, 0.7);
    line(g, cx + 26, baseY - 12, cx + 40, baseY - 8, C.mut, 0.7);
    dot(g, cx + 40, baseY - 24, 1, C.cool); dot(g, cx + 40, baseY - 8, 1, C.cool);
    txt(g, 'CONTACT AG', cx + 44, baseY - 14, 3.6, C.cool, 'left');
    arrow(g, cx, baseY - 74, cx, baseY - 58, C.ink, 1);
    txt(g, 'TRAVEL 3.6', cx + 6, baseY - 72, 4, C.mut, 'left');
    dimV(g, baseY - 52, baseY, cx - 54, '', true);
    leader(g, cx - 26, baseY - 6, cx - 60, baseY + 8, 'BASE + LEAD PINS', 'right');
    txt(g, 'SWITCH SECTION 6:1', cx - 46, baseY - 66, 4.2, C.mut, 'left');
  }

  function endMill(g) {
    var cx = 108, y = 30, i;
    rectG(g, cx - 12, y, 24, 22, C.ink, 1.1);
    hatch(g, cx - 12, y, 24, 22, 2.6, C.mut, 0.5, 1, 0);
    rectG(g, cx - 8, y + 22, 16, 62, C.ink, 1.2);
    for (i = 0; i < 7; i++) {
      var yy = y + 26 + i * 8.6;
      ctxHelix(g, cx, yy, 8, 3, i % 2 ? C.mut : C.ink);
    }
    poly(g, [[cx - 8, y + 84], [cx - 5, y + 92], [cx + 5, y + 92], [cx + 8, y + 84]], C.ink, 1.1, true);
    dimH(g, cx - 8, cx + 8, y + 100, 'D6', true);
    dimV(g, y + 22, y + 84, cx + 18, 'LOC 42', true);
    leader(g, cx - 8, y + 40, cx - 40, y + 32, '2FL CARBIDE', 'right');
    txt(g, 'HELIX 38 deg', cx - 40, y + 66, 4, C.mut, 'left');
    arcArrow(g, cx, y + 52, 15, -0.7, 2.3, C.hot);
  }

  function ctxHelix(g, cx, y, rx, dy, c) {
    var ctx = g.ctx, i, n = 12, pts = [];
    for (i = 0; i <= n; i++) {
      var t = i / n, a = Math.PI * t;
      pts.push([cx - rx + 2 * rx * t, y + dy * Math.sin(a)]);
    }
    poly(g, pts, c, 0.8);
  }

  /* ---------------- defaults ---------------- */

  function defObject(g) {
    var x = 60, y = 44, w = 100, h = 62;
    rectG(g, x, y, w, h, C.ink, 1.2);
    rectG(g, x + 10, y + 10, 34, 24, C.mut, 0.9);
    hatch(g, x + 10, y + 10, 34, 24, 3, C.mut, 0.5, 1, 0);
    rectG(g, x + 56, y + 10, 34, 18, C.ink, 0.9);
    rectG(g, x + 56, y + 34, 34, 18, C.hot, 0.9);
    circG(g, x + 27, y + 48, 9, C.ink, 0.9);
    line(g, x, y + h / 2, x + 10, y + h / 2, C.mut, 0.6);
    dimH(g, x, x + w, y - 8, 'W', true);
    dimV(g, y, y + h, x - 10, 'H', true);
    leader(g, x + 27, y + 16, x - 26, y + 4, 'SUB-ASSY A', 'right');
    leader(g, x + 73, y + 43, x + w + 20, y + 52, 'MODULE B');
    leader(g, x + w - 4, y + h - 6, x + w + 24, y + h + 6, 'INTERFACE');
  }

  /* neutral part-in-section for unmatched components */
  function defSection(g) {
    var x = 66, y = 44, w = 92, h = 54;
    poly(g, [[x, y + 14], [x + 18, y], [x + w - 18, y], [x + w, y + 14],
             [x + w, y + h - 14], [x + w - 18, y + h], [x + 18, y + h], [x, y + h - 14]],
         C.ink, 1.2, true);
    hatchShape(g, function () {
      poly(g, [[x, y + 14], [x + 18, y], [x + w - 18, y], [x + w, y + 14],
               [x + w, y + h - 14], [x + w - 18, y + h], [x + 18, y + h], [x, y + h - 14]],
           C.ink, 0.1, true);
    }, x, y, w, h, 3.2, C.mut, 0.6, 1, 0);
    poly(g, [[x, y + 14], [x + 18, y], [x + w - 18, y], [x + w, y + 14],
             [x + w, y + h - 14], [x + w - 18, y + h], [x + 18, y + h], [x, y + h - 14]],
         C.ink, 1.2, true);
    poly(g, [[x + 30, y + 20], [x + w - 30, y + 20], [x + w - 30, y + h - 20], [x + 30, y + h - 20]],
         C.bg, 0.9, true);
    line(g, x + w / 2, y - 8, x + w / 2, y + h + 8, C.mut, 0.5);
    line(g, x - 8, y + h / 2, x + w + 8, y + h / 2, C.mut, 0.5);
    dimH(g, x, x + w, y - 8, 'SECTION A-A', true);
    dimV(g, y, y + h, x + w + 10, 'H', true);
    leader(g, x + 4, y + 12, x - 24, y - 2, 'WALL', 'right');
    leader(g, x + w / 2 + 12, y + 24, x + w + 22, y + 10, 'BORE');
  }

  /* warp-knit mesh (chair backs, technical textiles) */
  function meshGrid(g) {
    var x = 54, y = 40, w = 112, h = 68, i, j;
    rectG(g, x, y, w, h, C.ink, 1.2);
    ctxClipRect(g, x, y, w, h);
    for (i = 0; i <= 14; i++) line(g, x + i * 8, y, x + i * 8 - 10, y + h, C.mut, 0.6);
    for (j = 0; j <= 9; j++) line(g, x, y + j * 7.6, x + w, y + j * 7.6 + 5, C.mut, 0.6);
    unclip(g);
    rectG(g, x, y, w, h, C.ink, 1.2);
    circG(g, x + w - 24, y + 24, 15, C.hot, 1);
    ctxClipRect(g, x + w - 24, y + 24, 0.1, 0.1); unclip(g);
    txt(g, 'x40', x + w - 12, y + h - 6, 4, C.hot, 'left');
    dimH(g, x, x + w, y + h + 8, 'GAUGE 24/in', true);
    dimV(g, y, y + h, x - 10, '180 g/m2', true);
    leader(g, x + 20, y + 10, x - 26, y - 4, 'NYLON 66 MONO', 'right');
    leader(g, x + w - 40, y + 46, x + w + 16, y + 40, 'SELVEDGE');
    txt(g, 'WARP KNIT - PELLICLE', x, y + h + 20, 4.2, C.mut, 'left');
  }

  function defMachine(g) {
    var cx = 92, cy = 76, r1 = 26, r2 = 17, i;
    gear(g, cx, cy, r1, 12, C.ink);
    gear(g, cx + r1 + r2 - 2, cy - 6, r2, 8, C.ink);
    circG(g, cx, cy, 6, C.mut, 0.8);
    circG(g, cx + r1 + r2 - 2, cy - 6, 4, C.mut, 0.8);
    arcArrow(g, cx, cy, r1 + 7, 0.4, 2.6, C.hot);
    arcArrow(g, cx + r1 + r2 - 2, cy - 6, r2 + 7, -2.4, -0.4, C.hot);
    arrow(g, cx + 50, cy + 4, cx + 84, cy + 4, C.mut, 0.9);
    txt(g, 'TORQUE 120Nm', cx + 50, cy - 2, 4, C.mut, 'left');
    rectG(g, cx + 62, cy + 20, 60, 30, C.ink, 1);
    hatch(g, cx + 62, cy + 20, 60, 30, 3, C.mut, 0.5, -1, 0);
    txt(g, 'LOAD', cx + 82, cy + 38, 4.2, C.mut, 'left');
    line(g, cx + 84, cy + 4, cx + 84, cy + 20, C.mut, 0.8);
    line(g, cx - 60, cy + 40, cx + 46, cy + 40, C.mut, 0.6);
    txt(g, 'MECHANISM - GENERAL ARRANGEMENT', cx - 60, cy + 52, 4.2, C.mut, 'left');
    dimH(g, cx - r1, cx + r1 + r2 * 2, cy - r1 - 12, '', true);
  }

  function gear(g, cx, cy, r, teeth, c) {
    var i, pts = [];
    circG(g, cx, cy, r * 0.78, c, 1);
    for (i = 0; i < teeth; i++) {
      var a0 = (i / teeth) * Math.PI * 2, a1 = ((i + 0.5) / teeth) * Math.PI * 2, a2 = ((i + 1) / teeth) * Math.PI * 2;
      pts.push([cx + r * 0.78 * Math.cos(a0), cy + r * 0.78 * Math.sin(a0)]);
      pts.push([cx + r * Math.cos(a0 + 0.06), cy + r * Math.sin(a0 + 0.06)]);
      pts.push([cx + r * Math.cos(a1), cy + r * Math.sin(a1)]);
      pts.push([cx + r * 0.78 * Math.cos(a2 - 0.02), cy + r * 0.78 * Math.sin(a2 - 0.02)]);
    }
    poly(g, pts, c, 1, true);
  }

  function defSource(g) { srcMine(g, 'ORE BODY'); }

  /* ---------------- subject plates ---------------- */

  function drawKeycap(g, e) {
    if (e === 0) return glyphKeycap(g);
    if (e === 1) return sectionKeycapProfile(g);
    if (e === 2) return switchAssembly(g);
    if (e === 3) return pellets(g, 54, 48, 110, 62, 40, 'ABS 757S RESIN', 'square');
    return srcDerrick(g, 'NAPHTHA');
  }

  function drawKeyboard(g, e) {
    if (e === 0) return glyphKeyboard(g);
    if (e === 1) return sectionKeycapProfile(g);
    if (e === 2) return switchAssembly(g);
    if (e === 3) return pellets(g, 54, 48, 110, 62, 40, 'ABS PELLETS', 'square');
    return srcDerrick(g, 'CRUDE -> MONOMER');
  }

  function drawPcb(g, e) {
    if (e === 0) return glyphPcb(g);
    if (e === 1) return sectionPcbStack(g);
    if (e === 2) return machineReflow(g);
    if (e === 3) return sheetStackInline(g, 'CU FOIL + FR4 LAMINATE');
    return srcMine(g, 'CU MO ORE LENS');
  }

  function sheetStackInline(g, label) {
    sheetStack(g, 64, 46, 96, 5, 9, 2);
    dimV(g, 46, 46 + 5 * 9 - 2, 52, '1.6', true);
    txt(g, label || 'SHEET STOCK', 64, 108, 4.2, C.mut, 'left');
    leader(g, 130, 46 + 2 * 9 + 3, 170, 40, 'ACTIVE LAYER');
  }

  function drawMoldPress(g, e) {
    if (e === 0) return glyphMoldBlock(g);
    if (e === 1) return sectionMoldCavity(g);
    if (e === 2) return machineInjection(g);
    if (e === 3) return billet(g, 60, 52, 100, 34, 'H13 TOOL STEEL BILLET');
    return srcMine(g, 'FE / AL ORE');
  }

  function glyphMoldBlock(g) {
    var x = 56, y = 46, w = 108, h = 62;
    rectG(g, x, y, w / 2, h, C.ink, 1.2);
    rectG(g, x + w / 2, y, w / 2, h, C.ink, 1.2);
    hatch(g, x, y, w / 2, h, 3.4, C.mut, 0.55, 1, 0);
    hatch(g, x + w / 2, y, w / 2, h, 3.4, C.mut, 0.55, -1, 0);
    line(g, x + w / 2, y, x + w / 2, y + h, C.hot, 1.1);
    txt(g, 'PARTING LINE', x + w / 2 + 4, y - 6, 4, C.hot, 'left');
    circG(g, x + 16, y + 14, 4, C.mut, 0.8); circG(g, x + 16, y + h - 14, 4, C.mut, 0.8);
    circG(g, x + w - 16, y + 14, 4, C.mut, 0.8); circG(g, x + w - 16, y + h - 14, 4, C.mut, 0.8);
    txt(g, 'GUIDE BUSH', x + 4, y + h + 9, 3.8, C.mut, 'left');
    dimH(g, x, x + w, y + h + 16, '400 x 400', true);
    dimV(g, y, y + h, x - 10, 'H 260', true);
    leader(g, x + w / 2, y + 30, x + w + 22, y + 16, 'CAVITY insert');
  }

  function sectionMoldCavity(g) {
    var cx = 110, y = 42, h = 66, i;
    rectG(g, cx - 66, y, 60, h, C.ink, 1.2);
    rectG(g, cx + 6, y, 60, h, C.ink, 1.2);
    hatch(g, cx - 66, y, 60, h, 3.4, C.mut, 0.55, 1, 0);
    hatch(g, cx + 6, y, 60, h, 3.4, C.mut, 0.55, -1, 0);
    poly(g, [[cx - 6, y + 18], [cx - 6, y + 48], [cx + 6, y + 48], [cx + 6, y + 18]], C.hot, 1.1, true);
    txt(g, 'CAVITY', cx - 24, y + 12, 4, C.hot, 'left');
    for (i = 0; i < 4; i++) {
      line(g, cx - 66 + 12 + i * 12, y + h, cx - 66 + 12 + i * 12, y + 50, C.mut, 0.8);
      arrowHead(g, cx - 66 + 12 + i * 12, y + 50, -Math.PI / 2, 2.6, C.mut);
    }
    txt(g, 'EJECTOR PINS', cx - 60, y + h + 9, 3.8, C.mut, 'left');
    line(g, cx, y, cx, y - 12, C.cool, 0.8);
    txt(g, 'SPRUE 4mm', cx + 4, y - 6, 3.8, C.cool, 'left');
    dimV(g, y, y + h, cx + 76, '260', true);
    arrow(g, cx - 30, y + h / 2, cx - 10, y + h / 2, C.mut, 0.9);
    arrow(g, cx + 30, y + h / 2, cx + 10, y + h / 2, C.mut, 0.9);
    txt(g, 'CLOSE 180t', cx - 22, y + h / 2 - 5, 4, C.mut, 'left');
  }

  function drawScrew(g, e) {
    if (e === 0) return glyphScrew(g);
    if (e === 1) return sectionThread(g);
    if (e === 2) return screwInBarrel(g);
    if (e === 3) return billet(g, 58, 54, 104, 30, 'BRIGHT DRAWN ROD SWCH18A');
    return srcMine(g, 'FE ORE');
  }

  function screwInBarrel(g) {
    var y = 62, h = 30;
    rectG(g, 40, y, 128, h, C.ink, 1.2);
    var i;
    for (i = 0; i < 12; i++) {
      var sx = 46 + i * 10.2;
      ellG(g, sx, y + h / 2, 2.2, h / 2 - 5, i > 8 ? C.hot : C.mut, 0.7);
    }
    line(g, 46, y + h / 2, 162, y + h / 2, C.ink, 1.1);
    poly(g, [[162, y + 6], [172, y + h / 2], [162, y + h - 6]], C.hot, 1.1, true);
    fillPoly(g, [[162, y + 6], [172, y + h / 2], [162, y + h - 6]], C.hot, 0.35);
    fillPoly(g, [[48, y - 10], [60, y - 18], [60, y - 30], [72, y - 30], [72, y - 18], [60, y - 10]], C.mut, 0.5);
    poly(g, [[48, y - 10], [60, y - 18], [60, y - 30], [72, y - 30], [72, y - 18], [60, y - 10]], C.ink, 1, true);
    txt(g, 'FEED HOPPER', 46, y - 34, 4, C.mut, 'left');
    arcArrow(g, 74, y + h / 2, 15, 0.3, 2.6, C.ink);
    for (i = 0; i < 5; i++) line(g, 96 + i * 12, y - 3, 96 + i * 12, y, C.mut, 0.9);
    txt(g, 'HEATER BANDS 220C', 92, y + h + 9, 4, C.mut, 'left');
    txt(g, 'MELT', 146, y - 6, 4, C.hot, 'left');
    dimH(g, 40, 168, y + h + 16, 'L/D 22', true);
    leader(g, 56, y + h - 4, 34, y + h + 14, 'SOLID BED', 'right');
    leader(g, 150, y + 8, 176, y - 8, 'METERING');
  }

  function drawSpring(g, e) {
    if (e === 0 || e === 1) return glyphSpring(g, false);
    if (e === 2) return glyphSpring(g, true);
    if (e === 3) return coilSpiralInline(g);
    return srcMine(g, 'CR ORE');
  }

  function coilSpiralInline(g) {
    coilSpiral(g, 96, 76, 40, 5, C.ink);
    line(g, 136, 76, 166, 76, C.ink, 1.1);
    arrow(g, 150, 76, 166, 76, C.mut, 0.9);
    txt(g, 'DRAW + COIL', 138, 70, 4, C.mut, 'left');
    dimH(g, 56, 136, 128, 'OD 80', true);
    leader(g, 110, 44, 140, 34, 'WIRE 1.2 CR-SI');
    txt(g, 'SPRING WIRE COIL', 56, 40, 4.2, C.mut, 'left');
  }

  function drawCnc(g, e) {
    if (e === 0 || e === 2) return machineCnc(g);
    if (e === 1) return endMill(g);
    if (e === 3) return billet(g, 58, 52, 104, 34, 'AL 7075-T6 BILLET');
    return srcMine(g, 'BAUXITE / AL ORE');
  }

  function drawMine(g, e) {
    if (e === 3) return pellets(g, 46, 48, 128, 62, 34, 'RUN-OF-MINE ROM');
    return srcMine(g);
  }

  function drawPellets(g, e) {
    if (e === 4) return srcMine(g, 'POLYMER FEED');
    if (e === 2) return machineInjection(g);
    pellets(g, 40, 42, 140, 70, 56, 'RESIN PELLET 3mm', e === 0 ? 'square' : undefined);
  }

  function drawOil(g, e) {
    if (e === 4) return srcDerrick(g, 'RESERVOIR');
    if (e === 3) return barrelGlyph(g);
    if (e === 2) return machineFractionation(g);
    return barrelGlyph(g);
  }

  function machineFractionation(g) {
    var x = 104, y = 30, w = 26, h = 84, i;
    rectG(g, x, y, w, h, C.ink, 1.2);
    for (i = 1; i < 8; i++) line(g, x + 2, y + i * (h / 8), x + w - 2, y + i * (h / 8), C.mut, 0.6);
    hatch(g, x, y, w, h, 4, C.cool, 0.4, 1, 0);
    txt(g, 'CDU COLUMN', x - 6, y - 6, 4, C.mut, 'left');
    var streams = [['LPG', 12, C.hot], ['NAPHTHA', 30, C.hot], ['KERO', 50, C.mut], ['DIESEL', 68, C.mut], ['RESID', 88, C.mut]];
    for (i = 0; i < streams.length; i++) {
      var sy = y + streams[i][1];
      line(g, x + w, sy, x + w + 30, sy, streams[i][2], 0.9);
      arrowHead(g, x + w + 30, sy, 0, 3, streams[i][2]);
      txt(g, streams[i][0], x + w + 33, sy + 1.6, 3.8, streams[i][2], 'left');
    }
    line(g, x - 30, y + h, x - 6, y + h, C.hot, 1);
    arrowHead(g, x - 6, y + h, 0, 3, C.hot);
    txt(g, 'FURNACE 350C', x - 60, y + h + 4, 4, C.hot, 'left');
    rectG(g, x - 58, y + h - 10, 24, 20, C.ink, 1);
    hatch(g, x - 58, y + h - 10, 24, 20, 2.6, C.mut, 0.5, 1, 0);
    line(g, x + w / 2, y + h, x + w / 2, y + h + 16, C.mut, 0.9);
    txt(g, 'CRUDE IN', x + w / 2 - 34, y + h + 20, 4, C.mut, 'left');
    arrow(g, x - 12, y + h + 16, x + 10, y + h + 16, C.mut, 0.9);
    txt(g, 'FRACTIONATION 1 ATM', x - 60, y + h + 34, 4.2, C.mut, 'left');
  }

  function drawSand(g, e) {
    if (e === 4) return srcSand(g);
    if (e === 3) return sandPile(g);
    if (e === 2) return machineFurnace(g);
    if (e === 1) return grainDetail(g);
    return sandPile(g);
  }

  function grainDetail(g) {
    var cx = 96, cy = 74, i;
    circG(g, cx, cy, 32, C.ink, 1.2);
    hatch(g, cx - 32, cy - 32, 64, 64, 4, C.cool, 0.5, 1, 0);
    circG(g, cx, cy, 32, C.ink, 1.2);
    for (i = 0; i < 5; i++) {
      var a = i * 1.25, r = 14 + (i % 2) * 8;
      circG(g, cx + r * Math.cos(a), cy + r * Math.sin(a), 3 + (i % 3), C.mut, 0.7);
    }
    txt(g, 'ROUNDNESS 0.7', cx + 44, cy - 20, 4, C.mut, 'left');
    dimH(g, cx - 32, cx + 32, cy + 44, '300um', true);
    leader(g, cx - 20, cy - 20, cx - 60, cy - 34, 'SiO2 GRAIN', 'right');
    txt(g, 'WASH + SIZE FRACTION', cx - 60, cy + 60, 4.2, C.mut, 'left');
    circG(g, 168, 60, 16, C.ink, 1);
    txt(g, '-40/+70 MESH', 140, 92, 4, C.mut, 'left');
  }

  function machineFurnace(g) {
    var x = 52, y = 44, w = 96, h = 62;
    rectG(g, x, y, w, h, C.ink, 1.2);
    var ctx = g.ctx;
    ctx.beginPath();
    ctx.moveTo(x + 10, y + h); ctx.lineTo(x + 10, y + 26);
    ctx.quadraticCurveTo(x + w / 2, y + 2, x + w - 10, y + 26);
    ctx.lineTo(x + w - 10, y + h);
    ctx.strokeStyle = C.ink; ctx.lineWidth = W(g, 1.1); ctx.stroke();
    fillPoly(g, [[x + 12, y + h], [x + 12, y + 30], [x + w / 2, y + 8], [x + w - 12, y + 30], [x + w - 12, y + h]], C.hot, 0.32);
    var i;
    for (i = 0; i < 4; i++) {
      line(g, x + 16 + i * 6, y + h - 6 - i * 2, x + 24 + i * 6, y + h - 14 - i * 2, C.hot, 0.8);
      arrowHead(g, x + 24 + i * 6, y + h - 14 - i * 2, -0.9, 2.6, C.hot);
    }
    rectG(g, x + w - 10, y + h - 26, 34, 8, C.hot, 1);
    arrow(g, x + w + 24, y + h - 22, x + w + 52, y + h - 22, C.hot, 0.9);
    txt(g, 'DRAW 1050C', x + w + 6, y + h - 30, 3.8, C.hot, 'left');
    rectG(g, x + 22, y - 22, 12, 22, C.ink, 1);
    hatch(g, x + 22, y - 22, 12, 22, 2.4, C.mut, 0.5, 1, 0);
    txt(g, 'BATCH SILO', x + 38, y - 14, 3.8, C.mut, 'left');
    line(g, x + 28, y - 22, x + 28, y + 6, C.mut, 0.7);
    arrowHead(g, x + 28, y + 6, Math.PI / 2, 2.6, C.mut);
    txt(g, 'FLOAT BATH SnO2', x, y + h + 12, 4.2, C.mut, 'left');
    txt(g, 'MELT 1550C', x + 44, y + h - 6, 4, C.hot, 'left');
  }

  function drawBillet(g, e) {
    if (e === 4) return srcMine(g, 'AL ORE / BAUXITE');
    if (e === 2) return machineRolling(g);
    billet(g, 54, 54, 110, 36, 'DC CAST BILLET 6063');
    dimH(g, 54, 164, 40, 'L 4000', true);
  }

  function drawGlass(g, e) {
    if (e === 0) return glyphPane(g);
    if (e === 1) return sectionPane(g);
    if (e === 2) return machineFurnace(g);
    if (e === 3) { sheetStack(g, 64, 50, 96, 5, 10, 2); txt(g, 'FLOAT GLASS 6mm', 64, 118, 4.2, C.mut, 'left'); return; }
    return srcSand(g);
  }

  function glyphPane(g) {
    var x = 70, y = 44, w = 80, h = 62;
    rectG(g, x, y, w, h, C.ink, 1.2);
    var i;
    for (i = 0; i < 4; i++) line(g, x + 8 + i * 9, y + h - 6 - i * 4, x + 30 + i * 9, y + 6, C.cool, 0.8);
    hatch(g, x, y, w, h, 6, C.cool, 0.4, 1, 0);
    rectG(g, x, y, w, h, C.ink, 1.2);
    dimH(g, x, x + w, y - 8, '2400', true);
    dimV(g, y, y + h, x - 10, 'H 1800', true);
    leader(g, x + w - 6, y + 20, x + w + 22, y + 8, 'EDGE DET.');
    txt(g, 'SODA-LIME SHEET', x, y + h + 14, 4.2, C.mut, 'left');
  }

  function drawSteel(g, e) {
    if (e === 4) return srcMine(g, 'FE ORE + COKE SEAM');
    if (e === 2) return machineRolling(g);
    if (e === 1) {
      var lbl = /drawer|box|panel|desktop|base/.test(g.nodeId || '') ? 'SPCC SHEET 0.8' : 'STRIP 1.2 SKMP';
      return sheetStackInline(g, lbl);
    }
    coilSpiral(g, 84, 76, 34, 5, C.ink);
    sheetStack(g, 138, 56, 54, 3, 8, 1);
    txt(g, 'COIL + SHEET', 46, 122, 4.2, C.mut, 'left');
    dimH(g, 50, 118, 122, '', true);
  }

  function drawCeramic(g, e) {
    if (e === 0) return glyphMug(g);
    if (e === 1) return sectionMugWall(g);
    if (e === 2) return machineKiln(g);
    if (e === 3) return clayLumps(g);
    return clayPit(g);
  }

  function drawChair(g, e) {
    if (e === 0) return glyphChair(g);
    if (e === 1) return jointDetail(g);
    if (e === 3) return tubeAndWood(g);
    if (e === 4) return srcMine(g, 'TIMBER / STEEL BED');
    return jointDetail(g);
  }

  function jointDetail(g) {
    var x = 74, y = 46;
    rectG(g, x, y + 24, 70, 26, C.ink, 1.2);
    hatch(g, x, y + 24, 70, 26, 3, C.mut, 0.5, 1, 0);
    rectG(g, x + 76, y + 28, 10, 18, C.ink, 1.1);
    rectG(g, x + 24, y + 4, 22, 20, C.ink, 1.2);
    hatch(g, x + 24, y + 4, 22, 20, 3, C.mut, 0.5, -1, 0);
    circG(g, x + 35, y + 42, 4, C.hot, 0.9);
    line(g, x + 35, y + 4, x + 35, y - 8, C.mut, 0.6);
    txt(g, 'DOWEL 8mm', x + 40, y - 6, 3.8, C.mut, 'left');
    dimH(g, x + 24, x + 46, y - 14, 'TENON', true);
    dimV(g, y + 24, y + 50, x - 10, '18', true);
    leader(g, x + 66, y + 24, x + 96, y + 8, 'MORTISE');
    txt(g, 'JOINT DETAIL 4:1', x, y + 64, 4.2, C.mut, 'left');
  }

  function tubeAndWood(g) {
    billet(g, 44, 46, 84, 24, 'TUBE 25 x 1.5');
    sheetStack(g, 44, 92, 84, 3, 7, 1);
    txt(g, 'PLY 18 PLY', 44, 124, 4, C.mut, 'left');
    circG(g, 160, 74, 22, C.ink, 1.1);
    circG(g, 160, 74, 14, C.mut, 0.8);
    var i;
    for (i = 0; i < 4; i++) circG(g, 160, 74, 4 + i * 2.6, C.mut, 0.4);
    txt(g, 'LOG Ø400', 132, 110, 4, C.mut, 'left');
  }

  function drawLamp(g, e) {
    if (e === 0) return glyphLamp(g);
    if (e === 1) return shadeSection(g);
    if (e === 2) return machineDriver(g);
    if (e === 3) return pellets(g, 48, 50, 122, 60, 36, 'PC + AL 6063', 'square');
    return srcMine(g, 'ALUMINA + POLYCARB');
  }

  function shadeSection(g) {
    var x = 76, y = 44;
    poly(g, [[x, y], [x + 62, y], [x + 88, y + 54], [x - 26, y + 54]], C.ink, 1.2, true);
    hatch(g, x - 26, y, 114, 54, 4, C.mut, 0.5, 1, 0);
    poly(g, [[x, y], [x + 62, y], [x + 88, y + 54], [x - 26, y + 54]], C.ink, 1.2, true);
    poly(g, [[x + 8, y + 8], [x + 54, y + 8], [x + 74, y + 46], [x - 12, y + 46]], C.bg, 1, true);
    line(g, x + 8, y + 44, x + 54, y + 44, C.hot, 1.2);
    txt(g, 'DIFFUSER', x + 12, y + 40, 3.8, C.hot, 'left');
    dimH(g, x - 26, x + 88, y + 64, 'SPUN 0.8 AL', true);
    dimV(g, y, y + 54, x + 96, 'H54', true);
    leader(g, x + 2, y + 4, x - 30, y - 8, 'CROWN', 'right');
    txt(g, 'SHADE SECTION 3:1', x - 26, y + 78, 4.2, C.mut, 'left');
  }

  function drawWindow(g, e) {
    if (e === 0) return glyphWindow(g);
    if (e === 1) return sectionPane(g);
    if (e === 3) { sheetStack(g, 64, 50, 96, 4, 11, 2); txt(g, 'IGLU UNIT STOCK', 64, 118, 4.2, C.mut, 'left'); return; }
    return srcSand(g);
  }

  function drawDesk(g, e) {
    var steelDesk = /steel|spcc|metal/.test(String(g.nodeId || ''));
    if (e === 0) return glyphDesk(g);
    if (e === 1) return steelDesk ? sheetStackInline(g, 'SPCC SHEET 1.2') : sectionPlywood(g);
    if (e === 3) return sheetStackInline(g, steelDesk ? 'SPCC COIL 1.2' : 'PLY + VENEER');
    if (e === 4) return srcMine(g, steelDesk ? 'IRON ORE BED' : 'TIMBER STAND');
    return defMachine(g);
  }

  /* progressive stamping press: ram, die set, coil feed */
  function stampingPress(g) {
    var cx = 104, y = 34;
    poly(g, [[cx - 52, y], [cx - 20, y], [cx - 20, y + 24], [cx + 30, y + 24],
             [cx + 30, y + 108], [cx + 56, y + 108], [cx + 56, y + 120], [cx - 56, y + 120], [cx - 56, y]],
         C.ink, 1.2, true);
    hatch(g, cx - 52, y, 32, 120, 3.4, C.mut, 0.55, 1, 0);
    poly(g, [[cx - 52, y], [cx - 20, y], [cx - 20, y + 24], [cx + 30, y + 24],
             [cx + 30, y + 108], [cx + 56, y + 108], [cx + 56, y + 120], [cx - 56, y + 120], [cx - 56, y]],
         C.ink, 1.2, true);
    rectG(g, cx - 34, y + 34, 46, 14, C.ink, 1.1);
    rectG(g, cx - 30, y + 48, 38, 8, C.hot, 1);
    poly(g, [[cx - 30, y + 48], [cx - 26, y + 56], [cx - 22, y + 48]], C.hot, 0.8, true);
    poly(g, [[cx - 14, y + 48], [cx - 10, y + 56], [cx - 6, y + 48]], C.hot, 0.8, true);
    rectG(g, cx - 34, y + 70, 46, 10, C.ink, 1.1);
    rectG(g, cx - 34, y + 80, 46, 12, C.ink, 1);
    hatch(g, cx - 34, y + 80, 46, 12, 2.6, C.mut, 0.5, -1, 0);
    line(g, cx - 56, y + 66, cx + 56, y + 66, C.cool, 1);
    txt(g, 'STRIP 2.0 DP600', cx - 54, y + 62, 3.8, C.cool, 'left');
    arrow(g, cx + 30, y + 29, cx + 30, y + 33, C.ink, 1);
    arrow(g, cx + 30, y + 44, cx + 30, y + 40, C.hot, 1);
    arcArrow(g, cx + 44, y + 18, 12, -0.4, 2.6, C.ink);
    txt(g, 'CRANK 60 spm', cx + 20, y + 12, 3.8, C.mut, 'left');
    dimV(g, y + 48, y + 70, cx - 64, 'STROKE', true);
    leader(g, cx - 8, y + 52, cx + 68, y + 44, 'PUNCH');
    leader(g, cx + 10, y + 75, cx + 68, y + 86, 'DIE');
    txt(g, '200t PROGRESSIVE PRESS', cx - 56, y + 132, 4.2, C.mut, 'left');
  }

  /* technical textile: knit mesh at E0-2, filament/resin feedstock at E3+ */
  function drawTextile(g, e) {
    if (e >= 3) return pellets(g, 48, 48, 122, 62, 42, 'NYLON 66 PELLET FEED', 'square');
    meshGrid(g);
  }

  /* rotating drum on trunnion rolls: ball mill, pugmill, tumbler */
  function drumMill(g) {
    var cx = 106, cy = 76, rx = 52, ry = 26;
    ellG(g, cx - rx, cy, 7, ry, C.ink, 1.1);
    ellG(g, cx + rx, cy, 7, ry, C.ink, 1.1);
    line(g, cx - rx, cy - ry, cx + rx, cy - ry, C.ink, 1.2);
    line(g, cx - rx, cy + ry, cx + rx, cy + ry, C.ink, 1.2);
    var i;
    for (i = 1; i < 7; i++) {
      var lx = cx - rx + (i * 2 * rx) / 7;
      ellG(g, lx, cy, 4.5, ry, C.mut, 0.5);
    }
    hatch(g, cx - rx, cy - ry, rx * 2, ry * 2, 3.6, C.mut, 0.5, 1, g.rng() * 3);
    line(g, cx - rx, cy - ry, cx + rx, cy - ry, C.ink, 1.2);
    line(g, cx - rx, cy + ry, cx + rx, cy + ry, C.ink, 1.2);
    ellG(g, cx - rx, cy, 7, ry, C.ink, 1.1);
    ellG(g, cx + rx, cy, 7, ry, C.ink, 1.1);
    circG(g, cx - rx - 12, cy + ry + 6, 7, C.mut, 0.9);
    circG(g, cx + rx + 12, cy + ry + 6, 7, C.mut, 0.9);
    line(g, cx - rx - 12, cy + ry + 6, cx - rx - 4, cy + ry, C.mut, 0.8);
    line(g, cx + rx + 12, cy + ry + 6, cx + rx + 4, cy + ry, C.mut, 0.8);
    arcArrow(g, cx, cy, ry + 9, -0.5, 2.3, C.hot);
    fillCirc(g, cx - 24, cy + 12, 2.6, C.mut);
    fillCirc(g, cx - 8, cy + 16, 2.2, C.mut);
    fillCirc(g, cx + 10, cy + 10, 2.8, C.mut);
    txt(g, 'CHARGE', cx - 44, cy - ry - 8, 4, C.mut, 'left');
    arrow(g, cx - 44, cy - ry - 4, cx - 30, cy - ry + 2, C.mut, 0.8);
    dimH(g, cx - rx, cx + rx, cy + ry + 20, 'DRUM 200 L / 30 RPM', true);
    leader(g, cx + rx - 10, cy - 14, cx + rx + 34, cy - 30, 'ALUMINA MEDIA');
    txt(g, 'GRIND 6 hr -> 45 um', cx - rx - 26, cy - ry - 20, 4.2, C.mut, 'left');
  }

  /* ram extrusion: billet pushed through a die into a profile */
  function extrusionPress(g) {
    var y = 62, bh = 30;
    rectG(g, 38, y, 44, bh, C.ink, 1.2);
    hatch(g, 38, y, 44, bh, 2.8, C.hot, 0.55, 1, 0);
    txt(g, 'BILLET 475C', 38, y - 6, 4, C.hot, 'left');
    rectG(g, 26, y + 4, 12, bh - 8, C.ink, 1.1);
    arrow(g, 20, y + bh / 2, 25, y + bh / 2, C.ink, 1.2);
    txt(g, 'RAM 1000t', 14, y + bh / 2 - 6, 4, C.mut, 'left');
    rectG(g, 82, y - 8, 12, bh + 16, C.ink, 1.2);
    hatch(g, 82, y - 8, 12, bh + 16, 2.6, C.mut, 0.5, -1, 0);
    txt(g, 'DIE', 82, y + bh + 22, 4, C.mut, 'left');
    poly(g, [[94, y + 8], [168, y + 10], [168, y + 16], [94, y + 18]], C.ink, 1.1, true);
    poly(g, [[94, y + 12], [168, y + 13.5], [94, y + 14]], C.hot, 0.8, true);
    arrow(g, 140, y + 4, 166, y + 4, C.mut, 0.9);
    txt(g, 'PROFILE 10 m/min', 118, y - 2, 4, C.mut, 'left');
    poly(g, [[150, y - 8], [186, y - 8], [186, y - 2], [150, y - 2]], C.cool, 0.9, true);
    txt(g, 'QUENCH', 152, y - 12, 3.8, C.cool, 'left');
    line(g, 158, y - 2, 158, y + 8, C.cool, 0.7);
    line(g, 166, y - 2, 166, y + 8, C.cool, 0.7);
    txt(g, 'HOLLOW PORTRAIT DIE', 38, y + bh + 30, 4.2, C.mut, 'left');
    leader(g, 60, y + bh - 4, 46, y + bh + 16, 'CONTAINER', 'right');
  }

  /* E1 tube / profile section: concentric walls in cutaway */
  function tubeSection(g) {
    var cx = 108, cy = 74, R = 34, t = 5, i;
    circG(g, cx, cy, R, C.ink, 1.2);
    circG(g, cx, cy, R - t, C.ink, 1.1);
    var ctx = g.ctx;
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    ctx.beginPath(); ctx.arc(cx, cy, R - t, 0, Math.PI * 2); ctx.clip();
    hatch(g, cx - R, cy - R, R * 2, R * 2, 2.8, C.mut, 0.55, 1, 0);
    ctx.restore();
    circG(g, cx, cy, R, C.ink, 1.2);
    circG(g, cx, cy, R - t, C.ink, 1.1);
    line(g, cx - R - 10, cy, cx + R + 10, cy, C.mut, 0.5);
    line(g, cx, cy - R - 10, cx, cy + R + 10, C.mut, 0.5);
    dimH(g, cx, cx + R, cy - R - 12, 'OD 25', true);
    dimH(g, cx + R - t, cx + R, cy + R + 12, '1.2', true);
    leader(g, cx + R * 0.72, cy - R * 0.72, cx + R + 26, cy - R - 6, 'ERW SEAM');
    dot(g, cx + R * 0.72, cy - R * 0.72, 1.4, C.hot);
    txt(g, 'TUBE SECTION 8:1', cx - R, cy + R + 26, 4.2, C.mut, 'left');
  }

  function drawBallMill(g, e) {
    if (e === 2) return drumMill(g);
    if (e === 1) return drumMill(g);
    return DEFAULTS[e](g, e);
  }

  function drawExtrusion(g, e) {
    if (e === 2) return extrusionPress(g);
    if (e === 1) return tubeSection(g);
    if (e === 3) return billet(g, 58, 52, 104, 34, 'PREHEATED BILLET 450C');
    return srcMine(g, 'BAUXITE ORE');
  }

  function drawTube(g, e) {
    if (e === 1) return tubeSection(g);
    if (e === 2) return machineRolling(g);
    if (e === 3) return coilSpiralInline(g);
    return srcMine(g, 'SKMP STRIP FEED');
  }

  /* neutral part for unmatched components: case, base, casters, brackets */
  function drawPart(g, e) {
    if (e === 2) return defMachine(g);
    if (e >= 3) return DEFAULTS[e](g, e);
    return defSection(g);
  }

  /* ---------------- subject registry ---------------- */

  var MATCHERS = [
    { k: ['keycap'], f: drawKeycap },
    { k: ['keyboard'], f: drawKeyboard },
    { k: ['pcb', 'circuit', 'solder', 'board', 'laminate', 'copper', 'fr-4', 'smt', 'placement line'], f: drawPcb },
    { k: ['stamping', 'progressive', 'die set', 'die cast'], f: stampingPress },
    { k: ['extrusion press', 'extruded', 'extrusion die'], f: drawExtrusion },
    { k: ['ball mill', 'tumbler', 'drum mill'], f: drawBallMill },
    { k: ['knitting', 'loom', 'textile', 'mesh', 'fabric', 'monofilament', 'nylon', 'yarn'], f: drawTextile },
    { k: ['pugmill', 'auger', 'extruder'], f: drawScrew },
    { k: ['tube', 'tubular', 'pipe', 'erw'], f: drawTube },
    { k: ['mold', 'tooling'], f: drawMoldPress },
    { k: ['press', 'injection', 'molding', 'clamping'], f: drawMoldPress },
    { k: ['screw', 'fastener', 'thread', 'bolt'], f: drawScrew },
    { k: ['spring', 'wire', 'coiler'], f: drawSpring },
    { k: ['cnc', 'milling', 'lathe', 'spindle', 'machining', 'end mill'], f: drawCnc },
    { k: ['crude', 'petroleum', 'naphtha', 'refin', 'derrick', 'well'], rx: /\boil\b/, f: drawOil },
    { k: ['sand', 'silica', 'quartz', 'batch'], f: drawSand },
    { k: ['pellet', 'resin', 'granul', 'nurdle', 'polymer', 'abs', 'pelletiz'], f: drawPellets },
    { k: ['caster', 'wheel', 'base', 'housing', 'case', 'enclosure', 'bracket', 'mechanism', 'arm'], f: drawPart },
    { k: ['billet', 'aluminum', 'aluminium', 'ingot', 'cast'], f: drawBillet },
    { k: ['glass', 'pane', 'float line', 'lehr'], f: drawGlass },
    { k: ['lamp', 'bulb', 'luminaire', 'light'], rx: /\bled\b/, f: drawLamp },
    { k: ['desk', 'table', 'furniture', 'wood', 'plywood', 'veneer'], f: drawDesk },
    { k: ['steel', 'coil', 'rolling', 'slab', 'strip'], f: drawSteel },
    { k: ['ceramic', 'mug', 'kiln', 'clay', 'porcelain', 'glaze', 'stoneware', 'kaolin', 'feldspar'], f: drawCeramic },
    { k: ['mine', 'quarry', 'ore', 'bauxite', 'mining', 'extract'], f: drawMine },
    { k: ['chair', 'seat'], f: drawChair },
    { k: ['window', 'glazing'], f: drawWindow }
  ];

  var DEFAULTS = [defObject, defSection, defMachine, matSamples, defSource];

  function matchIn(text, fn) {
    var i, j, m;
    for (i = 0; i < MATCHERS.length; i++) {
      m = MATCHERS[i];
      if (m.rx && m.rx.test(text)) return m.f;
      for (j = 0; m.k && j < m.k.length; j++) {
        if (text.indexOf(m.k[j]) !== -1) return m.f;
      }
    }
    return fn || null;
  }

  /* match on the human name first; chain-prefixed ids (keyboard-...) are only
     a fallback, otherwise every node in a chain would inherit the object name */
  function pickSubject(node) {
    var name = String(node.name || '').toLowerCase();
    var id = String(node.id || '').toLowerCase();
    return matchIn(name) || matchIn(id) || null;
  }

  /* ---------------- public API ---------------- */

  function normalizeAccent(node, opts) {
    var a = (opts && opts.accent) || node.color || node.accent || '';
    if (typeof a === 'string' && /^#[0-9a-f]{3,8}$/i.test(a)) {
      return a.length === 4 ? '#' + a[1] + a[1] + a[2] + a[2] + a[3] + a[3] : a;
    }
    return C.ink;
  }

  function draw(canvas, node, opts) {
    if (!canvas || !canvas.getContext) return;
    opts = opts || {};
    node = node || {};
    var e = Math.max(0, Math.min(4, node.echelon | 0));
    node.echelon = e;
    var dpr = Math.max(1, Math.min(3, (typeof window !== 'undefined' && window.devicePixelRatio) || 1));
    var cssW = canvas.clientWidth || canvas.width || VW;
    var cssH = canvas.clientHeight || canvas.height || VH;
    if (cssW < 8 || cssH < 8) { cssW = VW; cssH = VH; }

    var bw = Math.round(cssW * dpr), bh = Math.round(cssH * dpr);
    if (canvas.width !== bw) canvas.width = bw;
    if (canvas.height !== bh) canvas.height = bh;

    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, cssW, cssH);

    var scale = Math.min(cssW / VW, cssH / VH);
    ctx.translate((cssW - VW * scale) / 2, (cssH - VH * scale) / 2);
    ctx.scale(scale, scale);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';

    var seed = hash(node.id || node.name || 'plate');
    var g = {
      ctx: ctx, scale: scale, seed: seed,
      rng: mulberry32(seed),
      accent: normalizeAccent(node, opts),
      nodeId: (String(node.id || '') + ' ' + String(node.name || '')).toLowerCase()
    };

    chrome(g, node, opts);

    ctx.save();
    ctx.beginPath(); ctx.rect(AREA.x, AREA.y, AREA.w, AREA.h); ctx.clip();
    var fn = pickSubject(node) || DEFAULTS[e];
    try { fn(g, e); } catch (err) {
      if (typeof console !== 'undefined' && console.warn) console.warn('Plates: draw failed for', node.id, err);
      DEFAULTS[e](g, e);
    }
    ctx.restore();

    canvas.__plates = { node: node, opts: opts };
  }

  function attachAutoResize(canvas) {
    if (typeof ResizeObserver === 'undefined' || canvas.__platesRO) return;
    var ro = new ResizeObserver(function () {
      var st = canvas.__plates;
      if (st) draw(canvas, st.node, st.opts);
    });
    ro.observe(canvas);
    canvas.__platesRO = ro;
  }

  window.Plates = {
    draw: function (canvas, node, opts) { draw(canvas, node, opts); attachAutoResize(canvas); },
    version: '1.0.0'
  };
})();
