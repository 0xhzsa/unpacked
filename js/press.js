/* PressSim — UNPACKED / "Injection Molding Press" (echelon 2)
   Side cross-section schematic, canvas 2D only, no modules, no deps.
   Exposes window.PressSim = { mount(canvasEl, opts) -> handle, destroy() }
   opts: { speed = 1, amps = 1, onPhase(phaseIndex) }                        */
(function () {
  'use strict';

  /* ---- palette (duotone technical plate) ---- */
  var BG = '#f3ead4', AMBER = '#b65c38', WARM = '#c9a04e', STEEL = '#6e8896', EDGE = '#93805f';
  var AW = [232, 134, 29], WW = [251, 146, 60], SW = [138, 138, 138];
  var MONO = '"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,"Courier New",monospace';

  /* ---- plate / machine geometry (virtual units) ---- */
  var VW = 1000, VH = 540, AX = 300;
  var BX0 = 100, BX1 = 560, BAR_T = 268, BAR_B = 332, BORE_T = 278, BORE_B = 322;
  var NOZ_X = 620;
  var PLAT_X = 620, PLAT_W = 30;                 /* fixed platen */
  var MH_X0 = 650, MH_W = 50, MH_Y0 = 214, MH_Y1 = 386;
  var PX = 700;                                   /* parting line */
  var MOV_X = 750, MOV_W = 32, PLAT_Y = 158, PLAT_H = 284;
  var STROKE = 100;
  var TAIL_X = 938, TAIL_W = 32;
  var TIE_Y0 = 196, TIE_Y1 = 404;
  var BED_Y = 428, BED_H = 38;
  var SCR_X = 158, TIP_BACK = 460, TIP_FWD = 545, PITCH = 34, OD = 19;
  var HOP = { x0: 196, x1: 312, yt: 112, yj: 196, tx0: 238, tx1: 270, yb: 266, cx: 254 };
  var CAV_CY = 303;

  /* ---- cycle definition ---- */
  var PHASES = [
    { name: 'CLAMP', short: 'CLAMP', ms: 900 },
    { name: 'INJECT / FILL', short: 'INJECT', ms: 1000 },
    { name: 'PACK / HOLD', short: 'PACK', ms: 700 },
    { name: 'COOL', short: 'COOL', ms: 3600 },
    { name: 'OPEN', short: 'OPEN', ms: 900 },
    { name: 'EJECT', short: 'EJECT', ms: 1100 },
    { name: 'PLASTICIZE', short: 'PLAST', ms: 2300 }
  ];
  var TOTAL = 0, i;
  for (i = 0; i < PHASES.length; i++) TOTAL += PHASES[i].ms;

  /* ---- small math ---- */
  function cl(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function eo(t) { t = cl(t, 0, 1); return 1 - Math.pow(1 - t, 3); }
  function ei(t) { t = cl(t, 0, 1); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function mixc(a, b, t) {
    t = cl(t, 0, 1);
    return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * t) + ',' +
      Math.round(a[1] + (b[1] - a[1]) * t) + ',' +
      Math.round(a[2] + (b[2] - a[2]) * t) + ')';
  }
  function pad5(n) { return ('00000' + n).slice(-5); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function rng(seed) { return function () { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }

  /* ---- primitives ---- */
  function line(ctx, x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
  function txt(ctx, s, text, x, y, align, alpha) {
    ctx.font = (10 / s).toFixed(2) + 'px ' + MONO;
    ctx.textAlign = align || 'left';
    ctx.fillStyle = 'rgba(232,134,29,' + (alpha == null ? 0.85 : alpha) + ')';
    ctx.fillText(text, x, y);
    ctx.textAlign = 'left';
  }
  function leader(ctx, x1, y1, x2, y2) {
    ctx.strokeStyle = 'rgba(232,134,29,0.4)'; ctx.lineWidth = 1;
    line(ctx, x1, y1, x2, y2);
    ctx.fillStyle = 'rgba(232,134,29,0.85)';
    ctx.fillRect(x2 - 1.5, y2 - 1.5, 3, 3);
  }
  /* keycap profile, centred on local origin (top face up, stem below) */
  function cavityPath(ctx) {
    ctx.beginPath();
    ctx.moveTo(-35, -33); ctx.lineTo(35, -33); ctx.lineTo(26, 11);
    ctx.lineTo(6, 11); ctx.lineTo(6, 27); ctx.lineTo(13, 27);
    ctx.lineTo(13, 33); ctx.lineTo(-13, 33); ctx.lineTo(-13, 27);
    ctx.lineTo(-6, 27); ctx.lineTo(-6, 11); ctx.lineTo(-26, 11);
    ctx.closePath();
  }

  /* ================================================================ mount */
  function mount(canvasEl, opts) {
    opts = opts || {};
    var el = canvasEl;
    if (!el || !el.getContext) { throw new Error('PressSim.mount: canvas element required'); }
    var ctx = el.getContext('2d');
    if (!ctx) { throw new Error('PressSim.mount: 2d context unavailable'); }

    var speed = cl(parseFloat(opts.speed) || 1, 0.1, 10);
    var amps = opts.amps == null ? 1 : (+opts.amps || 0);
    var onPhase = typeof opts.onPhase === 'function' ? opts.onPhase : null;

    var dpr = 1, cw = 1, ch = 1, alive = true, raf = 0, last = 0;
    var ro = null;

    var st = {
      idx: 0, phaseT: 0, t: 0, cool: 0, press: 0, rot: 0, pelletT: 0,
      parts: 0, cycles: 0, ejected: false, reported: -1,
      pellets: [], shot: null, hopper: []
    };
    var r = rng(20261020);
    for (i = 0; i < 26; i++) {
      var py = 150 + r() * 108;
      var hw = py <= HOP.yj ? 58 : 58 - (58 - 17) * ((py - HOP.yj) / (HOP.yb - HOP.yj));
      st.hopper.push({ x: HOP.cx + (r() * 2 - 1) * (hw - 5), y: py });
    }

    function report() {
      if (st.reported === st.idx || !onPhase) return;
      st.reported = st.idx;
      try { onPhase(st.idx); } catch (e) { /* host error must not kill the loop */ }
    }

    /* ------------------------------------------------------- simulation */
    function progress() { return cl(st.phaseT / PHASES[st.idx].ms, 0, 1); }

    /* ms elapsed from cycle start up to the start of phase k */
    function phaseStart(k) {
      var acc = 0, n;
      for (n = 0; n < k; n++) acc += PHASES[n].ms;
      return acc;
    }

    function geom() {
      var k = st.idx, p = progress();
      var g = { p: p, retract: 0, screw: 0, fill: 0, temp: 0, pool: 1, ext: 0 };
      if (k === 0) { g.retract = STROKE * (1 - eo(p)); g.pool = 1; }
      else if (k === 1) { g.screw = ei(p); g.fill = p; g.pool = 1 - 0.95 * ei(p); }
      else if (k === 2) { g.screw = 1; g.fill = 1; g.pool = 0.05; }
      else if (k === 3) { g.screw = 1; g.fill = 1; g.temp = p; g.pool = 0.05; }
      else if (k === 4) { g.retract = STROKE * ei(p); g.screw = 1; g.fill = 1; g.temp = 1; g.pool = 0.05; }
      else if (k === 5) {
        g.retract = STROKE; g.screw = 1; g.temp = 1; g.pool = 0.05;
        g.fill = st.ejected ? 0 : 1;
        g.ext = p < 0.35 ? 60 * eo(p / 0.35) : (p < 0.6 ? 60 : 60 * (1 - (p - 0.6) / 0.4));
      } else { g.retract = STROKE; g.screw = 1 - ei(p); g.temp = 0; g.pool = 0.05 + 0.95 * ei(p); }
      return g;
    }

    function spawnPellet() {
      if (st.pellets.length > 40) return;
      st.pellets.push({
        x: HOP.tx0 + 4 + Math.random() * (HOP.tx1 - HOP.tx0 - 8), y: 248,
        vx: 0, vy: 30 + Math.random() * 50, g: 0
      });
    }

    function stepPellets(ms) {
      var dt = ms / 1000, tip = TIP_BACK + (TIP_FWD - TIP_BACK) * geom().screw, n = st.pellets.length;
      for (var j = n - 1; j >= 0; j--) {
        var q = st.pellets[j];
        if (q.g === 0) {
          q.vy += 640 * dt; q.y += q.vy * dt;
          if (q.y >= 288) { q.g = 1; q.y = 284 + Math.random() * 8; q.vx = 45 + Math.random() * 25; q.vy = 0; }
        } else {
          q.x += q.vx * dt;
          if (q.x > tip - 14) { st.pellets.splice(j, 1); continue; }
        }
        if (q.y > 420) st.pellets.splice(j, 1);
      }
    }

    function update(ms) {
      st.t += ms;
      if (st.idx === 3) st.cool += ms;
      var guard = 0;
      st.phaseT += ms;
      while (st.phaseT >= PHASES[st.idx].ms && guard++ < 8) {
        st.phaseT -= PHASES[st.idx].ms;
        st.idx++;
        if (st.idx >= PHASES.length) { st.idx = 0; st.cycles++; st.ejected = false; }
        if (st.idx === 0) { st.ejected = false; }
        report();
      }
      var p = progress();
      if (st.idx === 5 && !st.ejected && p > 0.35) {
        st.ejected = true;
        st.parts++;
        st.shot = { x: PX + 60, y: CAV_CY, vx: 26, vy: -70, rot: 0, vr: 1.1 };
      }
      if (st.idx === 6) {
        st.rot += ms * 0.0016;
        st.pelletT += ms;
        while (st.pelletT >= 75) { st.pelletT -= 75; spawnPellet(); }
      }
      var target = (st.idx === 1 || st.idx === 2) ? 1 : (st.idx === 3 ? 0.35 : 0);
      st.press += (target - st.press) * Math.min(1, ms / 180);
      stepPellets(ms);
      if (st.shot) {
        var dt = ms / 1000, s = st.shot;
        s.vy += 900 * dt; s.x += s.vx * dt; s.y += s.vy * dt; s.rot += s.vr * dt;
        if (s.y > VH + 90) st.shot = null;
      }
    }

    /* --------------------------------------------------------- machine art */
    function drawBed(g) {
      g.fillStyle = '#2b2115'; g.fillRect(40, BED_Y, 930, BED_H);
      g.save(); g.beginPath(); g.rect(40, BED_Y, 930, BED_H); g.clip();
      g.strokeStyle = 'rgba(138,138,138,0.3)'; g.lineWidth = 1;
      for (var x = 24; x < 990; x += 13) line(g, x, BED_Y + BED_H, x + 38, BED_Y);
      g.restore();
      g.strokeStyle = STEEL; g.lineWidth = 1; g.strokeRect(40.5, BED_Y + 0.5, 929, BED_H - 1);
      g.strokeStyle = STEEL; g.strokeRect(210.5, BAR_B + 0.5, 43, BED_Y - BAR_B);
      g.strokeRect(452.5, BAR_B + 0.5, 43, BED_Y - BAR_B);
    }

    function drawFrame(g, ret) {
      g.strokeStyle = STEEL; g.lineWidth = 3;
      line(g, MH_X0, TIE_Y0, TAIL_X + 16, TIE_Y0);
      line(g, MH_X0, TIE_Y1, TAIL_X + 16, TIE_Y1);
      g.lineWidth = 1.2;
      var pr = MOV_X + MOV_W + ret, sp = (ret / STROKE) * 40;
      var cx = (pr + TAIL_X) / 2 - (ret / STROKE) * 15;
      g.strokeStyle = AMBER; g.lineWidth = 1.5;
      line(g, pr, 265, cx, 265 - sp); line(g, cx, 265 - sp, TAIL_X, 265);
      line(g, pr, 335, cx, 335 + sp); line(g, cx, 335 + sp, TAIL_X, 335);
      g.strokeRect(cx - 7, 272, 14, 56);
      g.strokeStyle = STEEL; g.lineWidth = 1.2;
      g.strokeRect(TAIL_X + 0.5, PLAT_Y + 0.5, TAIL_W, PLAT_H);
      g.strokeRect(626.5, PLAT_Y + PLAT_H, 18, BED_Y - PLAT_Y - PLAT_H);
    }

    function drawBarrel(g) {
      g.fillStyle = '#2b2115'; g.fillRect(BX0, BAR_T, BX1 - BX0, BAR_B - BAR_T);
      g.strokeStyle = AMBER; g.lineWidth = 1.4;
      g.strokeRect(BX0 + 0.5, BAR_T + 0.5, BX1 - BX0 - 1, BAR_B - BAR_T - 1);
      g.lineWidth = 1; g.strokeStyle = 'rgba(232,134,29,0.55)';
      line(g, BX0, BORE_T + 0.5, BX1, BORE_T + 0.5);
      line(g, BX0, BORE_B + 0.5, BX1, BORE_B + 0.5);
      /* nozzle */
      g.beginPath();
      g.moveTo(BX1, BAR_T); g.lineTo(NOZ_X, 293); g.lineTo(NOZ_X, 307); g.lineTo(BX1, BAR_B);
      g.strokeStyle = AMBER; g.lineWidth = 1.4; g.stroke();
      /* heater bands */
      var bx = [330, 382, 434, 486], k;
      g.strokeStyle = 'rgba(232,134,29,0.8)'; g.lineWidth = 1;
      for (k = 0; k < bx.length; k++) {
        g.strokeRect(bx[k] + 0.5, 262.5, 30, 75);
        g.save(); g.beginPath(); g.rect(bx[k], 262, 30, 76); g.clip();
        g.strokeStyle = 'rgba(232,134,29,0.35)';
        for (var d = -20; d < 40; d += 9) line(g, bx[k] + d, 338, bx[k] + d + 30, 262);
        g.restore();
      }
    }

    function drawHopper(g) {
      g.fillStyle = '#2b2115';
      g.beginPath();
      g.moveTo(HOP.x0, HOP.yt); g.lineTo(HOP.x1, HOP.yt); g.lineTo(HOP.x1, HOP.yj);
      g.lineTo(HOP.tx1, HOP.yb); g.lineTo(HOP.tx0, HOP.yb); g.lineTo(HOP.x0, HOP.yj);
      g.closePath(); g.fill();
      g.strokeStyle = AMBER; g.lineWidth = 1.4;
      g.beginPath();
      g.moveTo(HOP.x0, HOP.yt); g.lineTo(HOP.x1, HOP.yt); g.lineTo(HOP.x1, HOP.yj);
      g.lineTo(HOP.tx1, HOP.yb); g.moveTo(HOP.x0, HOP.yj); g.lineTo(HOP.tx0, HOP.yb);
      g.moveTo(HOP.x0, HOP.yt); g.lineTo(HOP.x0, HOP.yj);
      g.stroke();
      var j;
      for (j = 0; j < st.hopper.length; j++) {
        g.fillStyle = '#2b2115'; g.fillRect(st.hopper[j].x - 2.5, st.hopper[j].y - 2.5, 5, 5);
        g.strokeStyle = 'rgba(232,134,29,0.55)'; g.lineWidth = 1;
        g.strokeRect(st.hopper[j].x - 2.5, st.hopper[j].y - 2.5, 5, 5);
      }
    }

    function drawScrew(g, tip, rot, pool, t, amps) {
      var j;
      g.strokeStyle = AMBER;
      g.fillStyle = '#2b2115'; g.lineWidth = 1.4;
      g.strokeRect(40.5, 272.5, 60, 55);
      /* drive / thrust end with rotation marker */
      g.lineWidth = 1.2;
      g.beginPath(); g.arc(70, AX, 17, 0, 6.2832); g.stroke();
      var a = rot * 6.2832;
      line(g, 70, AX, 70 + Math.cos(a) * 17, AX + Math.sin(a) * 17);
      g.fillStyle = AMBER;
      g.fillRect(70 + Math.cos(a) * 13 - 2, AX + Math.sin(a) * 13 - 2, 4, 4);
      /* shaft + core */
      g.fillStyle = '#2b2115';
      g.fillRect(60, AX - 6, tip - 60, 12);
      g.lineWidth = 1; g.strokeStyle = 'rgba(232,134,29,0.75)';
      line(g, 60, AX - 6.5, tip, AX - 6.5); line(g, 60, AX + 6.5, tip, AX + 6.5);
      g.beginPath();
      g.moveTo(SCR_X, AX - 8); g.lineTo(tip, AX - 13); g.lineTo(tip, AX + 13); g.lineTo(SCR_X, AX + 8);
      g.closePath();
      g.fillStyle = '#2b2115'; g.fill();
      g.strokeStyle = AMBER; g.lineWidth = 1.2; g.stroke();
      /* flight envelope */
      g.lineWidth = 1; g.strokeStyle = 'rgba(232,134,29,0.65)';
      line(g, SCR_X, AX - OD, tip, AX - OD); line(g, SCR_X, AX + OD, tip, AX + OD);
      line(g, tip, AX - OD, tip, AX + OD);
      /* chevron flight wrap (clipped to screw body) */
      g.save();
      g.beginPath(); g.rect(SCR_X, AX - OD - 2, tip - SCR_X, OD * 2 + 4); g.clip();
      g.beginPath();
      var phase = ((rot % 1) + 1) % 1, x0 = tip - 6 + phase * PITCH, up = true, first = true;
      for (var x = x0; x > SCR_X - PITCH; x -= PITCH / 2) {
        var y = up ? AX - OD : AX + OD;
        if (first) { g.moveTo(x, y); first = false; } else { g.lineTo(x, y); }
        up = !up;
      }
      g.strokeStyle = AMBER; g.lineWidth = 1.4; g.stroke();
      g.restore();
      /* feed pellets travelling along the screw */
      g.lineWidth = 1;
      for (j = 0; j < st.pellets.length; j++) {
        var q = st.pellets[j];
        g.fillStyle = '#2b2115'; g.fillRect(q.x - 2.5, q.y - 2.5, 5, 5);
        g.strokeStyle = 'rgba(232,134,29,0.7)'; g.strokeRect(q.x - 2.5, q.y - 2.5, 5, 5);
      }
      /* melt pool in front of the screw + nozzle channel */
      var wob = amps ? Math.sin(t * 0.007) * 2 * Math.min(1, amps) : 0;
      var mstart = BX1 - (BX1 - tip) * pool;
      if (pool > 0.002) {
        g.fillStyle = WARM;
        g.fillRect(mstart, BORE_T, BX1 - mstart, BORE_B - BORE_T);
        g.strokeStyle = 'rgba(251,146,60,0.9)'; g.lineWidth = 1;
        g.beginPath();
        g.moveTo(mstart + wob, BORE_T);
        g.lineTo(mstart - wob, BORE_B);
        g.stroke();
      }
      g.beginPath();
      g.moveTo(BX1, BORE_T); g.lineTo(NOZ_X - 4, 296); g.lineTo(NOZ_X - 4, 304); g.lineTo(BX1, BORE_B);
      g.closePath(); g.fillStyle = WARM; g.fill();
      g.strokeStyle = 'rgba(251,146,60,0.85)'; g.lineWidth = 1; g.stroke();
    }

    function drawMold(g, ret, fill, temp, ext, cooled) {
      var col = mixc(WW, SW, temp * 0.9);
      /* platens + blocks */
      g.fillStyle = '#2b2115'; g.strokeStyle = STEEL; g.lineWidth = 1.3;
      g.strokeRect(PLAT_X + 0.5, PLAT_Y + 0.5, PLAT_W, PLAT_H);
      g.fillRect(PLAT_X, PLAT_Y, PLAT_W, PLAT_H);
      g.strokeRect(MH_X0 + 0.5, MH_Y0 + 0.5, MH_W, MH_Y1 - MH_Y0);
      g.fillRect(MH_X0, MH_Y0, MH_W, MH_Y1 - MH_Y0);
      g.save(); g.translate(ret, 0);
      g.strokeRect(MOV_X + 0.5, PLAT_Y + 0.5, MOV_W, PLAT_H);
      g.fillRect(MOV_X, PLAT_Y, MOV_W, PLAT_H);
      g.strokeRect(PX + 0.5, MH_Y0 + 0.5, MH_W, MH_Y1 - MH_Y0);
      g.fillRect(PX, MH_Y0, MH_W, MH_Y1 - MH_Y0);
      /* cooling channels (animated while cooling) */
      g.save();
      g.setLineDash([7, 7]); g.lineDashOffset = -cooled * 0.05;
      g.strokeStyle = 'rgba(138,138,138,0.95)'; g.lineWidth = 2;
      line(g, PX + 8, 236, PX + MH_W - 8, 236);
      line(g, PX + 8, 364, PX + MH_W - 8, 364);
      g.restore();
      g.restore();
      g.save();
      g.setLineDash([7, 7]); g.lineDashOffset = -cooled * 0.05;
      g.strokeStyle = 'rgba(138,138,138,0.95)'; g.lineWidth = 2;
      line(g, MH_X0 + 8, 236, MH_X0 + MH_W - 8, 236);
      line(g, MH_X0 + 8, 364, MH_X0 + MH_W - 8, 364);
      g.restore();

      /* runner/sprue through platen + fixed half, then the cavity fill.
         The shot fills the runner first (~first quarter), then the cavity. */
      if (fill > 0.001) {
        var run = cl(fill / 0.25, 0, 1);
        var cav = cl((fill - 0.25) / 0.75, 0, 1);
        g.fillStyle = col;
        g.fillRect(NOZ_X, 296, (PX - NOZ_X) * run, 8);
        if (cav > 0) {
          g.save();
          g.translate(PX + ext, CAV_CY);
          cavityPath(g); g.clip();
          g.fillRect(-40, -40, 70 * cav + 8, 84);
          if (cav < 0.999) {
            g.fillStyle = 'rgba(232,134,29,0.95)';
            g.fillRect(-35 + 70 * cav, -34, 1.5, 45);
          }
          g.restore();
        }
        /* sprue channel outline */
        g.strokeStyle = 'rgba(232,134,29,0.5)'; g.lineWidth = 1;
        g.strokeRect(NOZ_X + 0.5, 296.5, PX - NOZ_X - 1, 7);
      }
      /* cavity outline, split at the parting line */
      g.strokeStyle = AMBER; g.lineWidth = 1.3;
      g.save(); g.beginPath(); g.rect(0, 0, PX, VH); g.clip();
      g.translate(PX, CAV_CY); cavityPath(g); g.stroke(); g.restore();
      g.save(); g.translate(ret, 0); g.beginPath(); g.rect(PX, 0, VW, VH); g.clip();
      g.translate(PX, CAV_CY); cavityPath(g); g.stroke(); g.restore();

      /* ejector pins (fixed side, push the part into the daylight) */
      var k, py = [282, 310];
      g.strokeStyle = AMBER; g.lineWidth = 1.2; g.fillStyle = '#2b2115';
      for (k = 0; k < 2; k++) {
        g.strokeRect(628.5, py[k] - 7.5, 14, 15);
        g.fillRect(628, py[k] - 7, 14, 14);
        line(g, 642, py[k], 665 + ext, py[k]);
        g.fillStyle = AMBER;
        g.fillRect(663 + ext, py[k] - 2.5, 5, 5);
        g.fillStyle = '#2b2115';
      }
    }

    function drawGauge(g, press) {
      var gx = 478, gy = 214, gh = 44, gw = 12;
      g.fillStyle = '#2b2115'; g.fillRect(gx, gy, gw, gh);
      g.fillStyle = AMBER;
      var h = (gh - 4) * cl(press, 0, 1);
      g.fillRect(gx + 2, gy + gh - 2 - h, gw - 4, h);
      g.strokeStyle = 'rgba(232,134,29,0.8)'; g.lineWidth = 1;
      g.strokeRect(gx + 0.5, gy + 0.5, gw, gh);
      g.strokeStyle = 'rgba(232,134,29,0.35)';
      for (var k = 1; k < 4; k++) line(g, gx + gw, gy + (gh / 4) * k, gx + gw + 4, gy + (gh / 4) * k);
    }

    function drawLabels(g, s, ret, idx) {
      txt(g, s, 'HOPPER', 196, 104); leader(g, 214, 108, 240, 112);
      txt(g, s, 'HEATER BANDS', 330, 252, 'left', 0.6); leader(g, 344, 256, 344, 263);
      txt(g, s, 'MELT PRESSURE', 478, 206, 'left', 0.6);
      txt(g, s, 'BARREL', 110, 356); leader(g, 128, 350, 128, 335);
      txt(g, s, 'SCREW', 300, 356); leader(g, 316, 350, 316, 320);
      txt(g, s, 'MELT POOL', 470, 356); leader(g, 502, 350, 508, 335);
      txt(g, s, 'NOZZLE', 556, 356); leader(g, 578, 350, 592, 320);
      txt(g, s, 'CAVITY', 656, 204); leader(g, 690, 208, 668, 266);
      txt(g, s, 'FIXED PLATEN', 610, 150, 'left', 0.6); leader(g, 640, 154, 640, 159);
      txt(g, s, 'MOVING PLATEN', 756 + ret, 150, 'left', 0.6); leader(g, 792 + ret, 154, 792 + ret, 159);
      txt(g, s, 'TIE BAR', 700, 422, 'left', 0.6); leader(g, 716, 418, 716, 406);
      txt(g, s, 'CLAMP UNIT', 800, 456, 'left', 0.6); leader(g, 816, 450, 858, 344);
      if (idx === 5) { txt(g, s, 'EJECTOR PINS', 616, 250, 'right', 0.9); leader(g, 604, 254, 644, 282); }
    }

    function drawMachine(g, s) {
      var mg = geom();
      var tip = TIP_BACK + (TIP_FWD - TIP_BACK) * mg.screw;
      g.save();
      g.beginPath(); g.rect(0, 0, VW, VH); g.clip();
      drawBed(g);
      drawFrame(g, mg.retract);
      drawBarrel(g);
      drawHopper(g);
      drawScrew(g, tip, st.rot, mg.pool, st.t, amps);
      drawMold(g, mg.retract, mg.fill, mg.temp, mg.ext, st.cool);
      drawGauge(g, st.press);
      drawLabels(g, s, mg.retract, st.idx);
      /* ejected part */
      if (st.shot) {
        var q = st.shot;
        g.save(); g.translate(q.x, q.y); g.rotate(q.rot);
        cavityPath(g);
        g.fillStyle = mixc(WW, SW, 0.9); g.fill();
        g.strokeStyle = AMBER; g.lineWidth = 1.3; g.stroke();
        g.restore();
      }
      g.restore();
    }

    /* ---------------------------------------------------------------- HUD */
    function drawHUD(g, w, h) {
      var pad = 14, prog = cl((phaseStart(st.idx) + st.phaseT) / TOTAL, 0, 1);
      g.textBaseline = 'alphabetic';

      g.font = '600 15px ' + MONO;
      g.fillStyle = AMBER;
      g.fillText(pad2(st.idx + 1) + ' \u00b7 ' + PHASES[st.idx].name, pad, pad + 14);

      /* phase stepper, top-right */
      var items = [], gap = 12, total = 9, k;
      g.font = '9px ' + MONO;
      for (k = 0; k < PHASES.length; k++) {
        items.push(g.measureText(PHASES[k].short).width);
        total += items[k] + gap;
      }
      var x = w - pad - total;
      for (k = 0; k < PHASES.length; k++) {
        var cur = k === st.idx;
        g.fillStyle = cur ? AMBER : 'rgba(232,134,29,0.3)';
        if (cur) g.fillRect(x - 9, pad + 7, 5, 5);
        g.fillText(PHASES[k].short, x, pad + 14);
        x += items[k] + gap;
      }

      /* cycle progress bar */
      var bw = 210;
      g.strokeStyle = EDGE; g.lineWidth = 1;
      g.strokeRect(pad + 0.5, pad + 22.5, bw, 5);
      g.fillStyle = AMBER;
      g.fillRect(pad + 1, pad + 23, (bw - 1) * prog, 4);
      for (k = 1; k < PHASES.length; k++) {
        g.fillStyle = EDGE;
        g.fillRect(pad + 1 + (bw - 1) * (phaseStart(k) / TOTAL), pad + 23, 1, 4);
      }

      /* readout */
      g.font = '10px ' + MONO;
      g.fillStyle = 'rgba(232,134,29,0.75)';
      var read = 'CYCLE ' + ((phaseStart(st.idx) + st.phaseT) / 1000).toFixed(1) + ' / ' +
        (TOTAL / 1000).toFixed(1) + ' s    PARTS ' + pad5(st.parts) +
        (speed !== 1 ? '    \u00d7' + speed.toFixed(1) : '');
      g.fillText(read, pad, pad + 46);

      /* legend */
      var ly = h - 14, lx = pad;
      g.font = '9px ' + MONO;
      var legs = [[WARM, 'MELT / PLASTIC'], [STEEL, 'MOLD / STEEL'], [AMBER, 'STRUCTURE']], t;
      for (t = 0; t < legs.length; t++) {
        g.fillStyle = legs[t][0];
        g.fillRect(lx, ly - 8, 8, 8);
        g.fillStyle = 'rgba(232,134,29,0.55)';
        g.fillText(legs[t][1], lx + 12, ly);
        lx += 12 + g.measureText(legs[t][1]).width + 16;
      }
    }

    /* -------------------------------------------------------------- frame */
    function render() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, cw, ch);
      var s = Math.min(cw / VW, ch / VH);
      if (!(s > 0)) s = 1;
      ctx.save();
      ctx.translate((cw - VW * s) / 2, (ch - VH * s) / 2);
      ctx.scale(s, s);
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'miter';
      drawMachine(ctx, s);
      ctx.restore();
      drawHUD(ctx, cw, ch);
      ctx.strokeStyle = EDGE; ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, cw - 1, ch - 1);
    }

    function frame(ts) {
      if (!alive) return;
      if (!last) last = ts;
      var dt = Math.min(64, ts - last);
      last = ts;
      if (dt > 0) update(dt * speed);
      render();
      raf = requestAnimationFrame(frame);
    }

    function resize() {
      if (!alive) return;
      /* The canvas's own CSS box is the source of truth. The parent is only a
         fallback for the first paint — reading the parent while the parent is
         sized by the canvas would feed back and spiral. */
      var w = 0, h = 0;
      var rect = el.getBoundingClientRect();
      if (rect.width > 1) w = rect.width;
      if (rect.height > 1) h = rect.height;
      if (!(w > 1) || !(h > 1)) {
        var par = el.parentElement;
        if (par) {
          if (!(w > 1)) w = par.clientWidth || 0;
          if (!(h > 1)) h = par.clientHeight || 0;
        }
      }
      if (!(w > 1)) w = 800;
      if (!(h > 1)) h = 440;
      el.style.width = Math.round(w) + 'px';
      el.style.height = Math.round(h) + 'px';
      dpr = window.devicePixelRatio || 1;
      cw = Math.max(1, Math.round(w));
      ch = Math.max(1, Math.round(h));
      el.width = Math.round(cw * dpr);
      el.height = Math.round(ch * dpr);
      render();
    }

    var onResize = function () { resize(); };
    if (typeof ResizeObserver !== 'undefined' && el.parentElement) {
      ro = new ResizeObserver(onResize);
      ro.observe(el.parentElement);
    }
    window.addEventListener('resize', onResize);
    resize();
    report();
    raf = requestAnimationFrame(frame);

    return {
      canvas: el,
      destroy: function () {
        if (!alive) return;
        alive = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        if (ro) { ro.disconnect(); ro = null; }
        window.removeEventListener('resize', onResize);
        st.pellets.length = 0;
        st.shot = null;
      },
      reset: function () {
        st.idx = 0; st.phaseT = 0; st.parts = 0; st.cycles = 0;
        st.ejected = false; st.shot = null; st.pellets.length = 0;
        st.reported = -1; report();
      },
      setSpeed: function (v) { speed = cl(parseFloat(v) || 1, 0.1, 10); },
      getPhase: function () { return st.idx; }
    };
  }

  window.PressSim = { mount: mount };
}());
