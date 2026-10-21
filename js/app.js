/* UNPACKED — application shell. Wires scene, graph, rail, and status. */
(function () {
  'use strict';

  var CHAINS = (window.CONTENT && window.CONTENT.chains) || [];

  // scene.js uses short ids; content.js uses slugs
  var SCENE_ID = {
    'keyboard': 'keyboard',
    'desk-lamp': 'lamp',
    'office-chair': 'chair',
    'ceramic-mug': 'mug',
    'steel-desk': 'desk',
    'glass-window': 'window',
  };
  var CHAIN_ID = {};
  Object.keys(SCENE_ID).forEach(function (k) { CHAIN_ID[SCENE_ID[k]] = k; });

  var ECHELON_NAMES = ['OBJECT', 'COMPONENT', 'MACHINE', 'RAW MATERIAL', 'SOURCE'];

  var state = {
    chainId: null,
    nodeId: null,
    visited: {},          // nodeId -> true
    cutaway: false,
  };

  var $ = function (id) { return document.getElementById(id); };

  var els = {
    room: $('room'), rail: $('rail'), railTitle: $('rail-title'), railDesc: $('rail-desc'),
    railRows: $('rail-rows'), railSpecs: $('rail-specs'), railProcess: $('rail-process'),
    railHistory: $('rail-history'), railTag: $('rail-echelon-tag'),
    breadcrumb: $('breadcrumb'), statNodes: $('stat-nodes'), statEcho: $('stat-echo'),
    plateCounter: $('plate-counter'), hint: $('hint'), reticle: $('reticle'),
    objList: document.querySelector('#object-index ul'),
    graphOverlay: $('graph-overlay'), graphStats: $('graph-stats'),
    boot: $('boot'), bootBar: $('boot-bar'), bootStatus: $('boot-status'),
    railPlate: $('rail-plate'),
    pressLauncher: $('press-launcher'), pressOpen: $('press-open'),
    pressOverlay: $('press-overlay'), pressCanvas: $('press-canvas'),
    pressTitle: $('press-title'), pressPhaseTag: $('press-phase-tag'),
    pressCaption: $('press-caption'), pressSpeed: $('press-speed'),
    pressClose: $('press-close'),
  };

  var pressHandle = null;   // active PressSim handle (when overlay open)
  var pressNode = null;     // node owning the simulation
  var pressSpeed = 1;

  var PRESS_PHASES = [
    ['CLAMP', 'Mold halves close and lock under 80 tons of clamp force.'],
    ['INJECT / FILL', 'The screw rams forward, injecting 220 °C ABS through the sprue until the keycap cavity fills.'],
    ['PACK / HOLD', 'Holding pressure packs the cavity as the gate freezes solid.'],
    ['COOL', 'The part solidifies in the tool — watch the cavity drain from orange to gray.'],
    ['OPEN', 'The moving platen retracts, exposing the finished keycap.'],
    ['EJECT', 'Ejector pins pop the part free; it drops clear of the mold.'],
    ['PLASTICIZE', 'The screw rotates and pulls back, plasticizing the next shot from fresh pellets.'],
  ];

  /* ---------- helpers ---------- */

  function chain(id) {
    for (var i = 0; i < CHAINS.length; i++) if (CHAINS[i].id === id) return CHAINS[i];
    return null;
  }
  function nodeById(id) {
    for (var i = 0; i < CHAINS.length; i++) {
      var n = CHAINS[i].nodes;
      for (var j = 0; j < n.length; j++) if (n[j].id === id) return n[j];
    }
    return null;
  }
  function nodeMeta(chainId, nodeId) {
    var c = chain(chainId); if (!c) return null;
    var idx = -1;
    for (var i = 0; i < c.nodes.length; i++) if (c.nodes[i].id === nodeId) idx = i;
    return idx >= 0 ? { chain: c, index: idx } : null;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  /* ---------- object index ---------- */

  function buildObjectIndex() {
    els.objList.innerHTML = '';
    CHAINS.forEach(function (c, i) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.className = 'obj-row';
      btn.dataset.chain = c.id;
      btn.innerHTML =
        '<span class="flex items-center gap-2 truncate"><span class="obj-dot" style="color:' + c.color + '"></span>' +
        esc(c.name) + '</span>' +
        '<span class="text-dim text-[9px]">' + String(i + 1).padStart(2, '0') + '</span>';
      btn.addEventListener('click', function () { openObject(c.id); });
      li.appendChild(btn);
      els.objList.appendChild(li);
    });
  }

  function markObjectIndex() {
    document.querySelectorAll('.obj-row').forEach(function (b) {
      b.dataset.active = String(b.dataset.chain === state.chainId);
    });
  }

  /* ---------- rail ---------- */

  function chainRows(c) {
    els.railRows.innerHTML = '';
    var sorted = c.nodes.slice().sort(function (a, b) { return a.echelon - b.echelon; });
    sorted.forEach(function (n, i) {
      var btn = document.createElement('button');
      btn.className = 'chain-row';
      btn.dataset.node = n.id;
      var spec0 = n.specs && n.specs[0];
      btn.innerHTML =
        '<span class="row-label"><span class="row-idx">E' + n.echelon + '</span>' + esc(n.name) + '</span>' +
        '<span class="row-meta">' + esc(ECHELON_NAMES[n.echelon] || '') +
        (spec0 ? ' · ' + esc(spec0.label.toUpperCase()) + ' ' + esc(String(spec0.value)) + ' ' + esc(spec0.unit) : '') +
        '</span>';
      btn.addEventListener('click', function () { selectNode(n.id, { fly: true }); });
      els.railRows.appendChild(btn);
    });
  }

  function renderNodeDetail(n) {
    els.railTag.textContent = 'ECHELON ' + n.echelon + ' — ' + (ECHELON_NAMES[n.echelon] || '');
    els.railTitle.textContent = n.name;
    els.railDesc.textContent = n.description;

    els.railSpecs.innerHTML = (n.specs || []).map(function (s) {
      return '<tr><td>' + esc(s.label) + '</td><td>' + esc(String(s.value)) +
        (s.unit ? '<span class="unit">' + esc(s.unit) + '</span>' : '') + '</td></tr>';
    }).join('');

    els.railProcess.innerHTML = (n.process || []).map(function (p) {
      return '<li>' + esc(p) + '</li>';
    }).join('');

    els.railHistory.textContent = n.history || '—';

    drawPlate(n);
    syncPress(n);
  }

  /* ---------- plate imagery ---------- */

  function drawPlate(n) {
    if (!window.Plates || !els.railPlate) return;
    try { window.Plates.draw(els.railPlate, n); } catch (e) { console.warn('plate draw failed', e); }
  }

  /* ---------- injection press sim ---------- */

  function isPressNode(n) {
    var s = (n.name + ' ' + n.id).toLowerCase();
    return s.indexOf('injection') !== -1 || s.indexOf('molding') !== -1 || s.indexOf('press') !== -1;
  }

  function syncPress(n) {
    var want = isPressNode(n) && n.echelon === 2;
    if (want) {
      pressNode = n;
      els.pressLauncher.classList.remove('hidden');
      els.pressTitle.textContent = n.name || 'INJECTION MOLDING PRESS';
    } else {
      els.pressLauncher.classList.add('hidden');
      pressNode = null;
      if (pressHandle) closePress();
    }
  }

  function openPress() {
    if (pressHandle || !window.PressSim || !pressNode) return;
    els.pressOverlay.classList.remove('hidden');
    els.pressOverlay.classList.add('flex');
    pressHandle = window.PressSim.mount(els.pressCanvas, {
      speed: pressSpeed,
      onPhase: function (i) {
        var p = PRESS_PHASES[i] || ['—', '—'];
        els.pressPhaseTag.textContent = String(i + 1).padStart(2, '0') + ' · ' + p[0];
        els.pressCaption.textContent = p[1];
      },
    });
  }

  function closePress() {
    if (pressHandle) { pressHandle.destroy(); pressHandle = null; }
    els.pressOverlay.classList.add('hidden');
    els.pressOverlay.classList.remove('flex');
  }

  function wirePressControls() {
    if (els.pressOpen) els.pressOpen.addEventListener('click', openPress);
    if (els.pressClose) els.pressClose.addEventListener('click', closePress);
    if (els.pressOverlay) els.pressOverlay.addEventListener('click', function (e) {
      if (e.target === els.pressOverlay) closePress();
    });
    if (els.pressSpeed) els.pressSpeed.addEventListener('click', function () {
      pressSpeed = pressSpeed >= 3 ? 0.5 : pressSpeed + 0.5;
      els.pressSpeed.textContent = '×' + pressSpeed;
      if (pressHandle && pressHandle.setSpeed) pressHandle.setSpeed(pressSpeed);
    });
  }

  function markRows() {
    els.railRows.querySelectorAll('.chain-row').forEach(function (r) {
      var id = r.dataset.node;
      var m = nodeMeta(state.chainId, id);
      if (!m) return;
      var cur = nodeById(id);
      if (id === state.nodeId) r.dataset.state = 'current';
      else if (state.visited[id]) r.dataset.state = 'visited';
      else r.dataset.state = 'future';
      r.setAttribute('aria-current', id === state.nodeId ? 'true' : 'false');
      void cur;
    });
  }

  /* ---------- status ---------- */

  function updateStatus(n) {
    var c = chain(state.chainId);
    if (!c || !n) return;
    var spine = ancestorPath(state.chainId, n.id).map(nodeById)
      .filter(Boolean)
      .sort(function (a, b) { return a.echelon - b.echelon; });
    els.breadcrumb.innerHTML =
      '<span class="text-dim">ROOM</span>' +
      spine.map(function (x, i) {
        var sep = '<span class="text-dim">&#8594;</span>';
        var last = i === spine.length - 1;
        return sep + '<span class="' + (last ? 'text-amber-600' : '') + '">' + esc(x.name.toUpperCase()) + '</span>';
      }).join('');
    var total = Object.keys(state.visited).length;
    els.statNodes.textContent = total + ' NODE' + (total === 1 ? '' : 'S') + ' VISITED';
    els.statEcho.textContent = 'ECHELON ' + n.echelon + '/4';
    var idx = CHAINS.indexOf(c) + 1;
    els.plateCounter.textContent = 'PLATE ' + String(idx).padStart(2, '0') + ' / ' + String(CHAINS.length).padStart(2, '0');
  }

  /* ---------- navigation ---------- */

  function openObject(chainId) {
    var c = chain(chainId);
    if (!c) return;
    state.chainId = chainId;

    var root = c.nodes.filter(function (n) { return n.echelon === 0; })[0] || c.nodes[0];
    state.nodeId = null;

    chainRows(c);
    markObjectIndex();
    els.rail.classList.remove('translate-x-full');
    els.hint.style.opacity = '0';

    var sceneId = SCENE_ID[chainId];
    if (sceneId && window.SceneAPI) window.SceneAPI.focusOn(sceneId);

    selectNode(root.id, { fly: false });
  }

  function closeObject() {
    state.chainId = null;
    state.nodeId = null;
    els.rail.classList.add('translate-x-full');
    markObjectIndex();
    markRows();
    if (window.SceneAPI) window.SceneAPI.unfocus();
    setCutaway(false);
    closePress();
    els.breadcrumb.innerHTML = '<span class="text-dim">ROOM</span>';
    els.statEcho.textContent = 'ECHELON 0/4';
    els.plateCounter.textContent = 'PLATE 00 / ' + String(CHAINS.length).padStart(2, '0');
  }

  function selectNode(nodeId, opts) {
    opts = opts || {};
    var n = nodeById(nodeId);
    if (!n) return;
    state.nodeId = nodeId;
    state.visited[nodeId] = true;

    renderNodeDetail(n);
    markRows();
    updateStatus(n);

    // graph states: ancestors = visited path, rest future
    var path = ancestorPath(state.chainId, nodeId);
    if (window.GraphAPI) {
      window.GraphAPI.renderFor(state.chainId);
      window.GraphAPI.setStates({ current: nodeId, visited: path });
      window.GraphAPI.draw && window.GraphAPI.draw();
    }

    // deeper echelons open the section cut automatically
    if (n.echelon >= 1 && !state.cutaway) setCutaway(true);
    if (n.echelon === 0 && state.cutaway) setCutaway(false);

    if (opts.fly && window.SceneAPI) {
      var sid = SCENE_ID[state.chainId];
      if (sid) window.SceneAPI.focusOn(sid);
    }
  }

  // walk inputs[] upward from node to root → the "visited spine"
  function ancestorPath(chainId, nodeId) {
    var c = chain(chainId);
    if (!c) return [];
    var byId = {};
    c.nodes.forEach(function (n) { byId[n.id] = n; });
    var out = [];
    (function walk(id) {
      if (!byId[id] || out.indexOf(id) !== -1) return;
      out.push(id);
      var n = byId[id];
      (n.inputs || []).forEach(walk);
    })(nodeId);
    return out;
  }

  /* ---------- cutaway ---------- */

  function setCutaway(on) {
    state.cutaway = on;
    document.body.classList.toggle('cutaway', on);
    if (window.SceneAPI) window.SceneAPI.setCutaway(on);
  }

  /* ---------- full graph overlay ---------- */

  function openFullGraph() {
    els.graphOverlay.classList.remove('hidden');
    if (window.GraphAPI) {
      window.GraphAPI.init($('full-graph'));
      window.GraphAPI.renderFull();
      var s = window.GraphAPI.stats ? window.GraphAPI.stats() : null;
      if (s) {
        els.graphStats.textContent =
          s.objects + ' OBJECTS · ' + s.nodes + ' NODES · ' + s.edges + ' EDGES · ' +
          s.echelons + ' ECHELONS · ' + (s.shared || 0) + ' SHARED SOURCES';
      }
    }
  }
  function closeFullGraph() {
    els.graphOverlay.classList.add('hidden');
  }

  /* ---------- boot ---------- */

  function boot() {
    var steps = [
      ['INITIALIZING ROOM', function () { window.SceneAPI.init(els.room); }],
      ['LOADING CHAINS', function () {
        buildObjectIndex();
        window.GraphAPI.init($('mini-graph'));
      }],
      ['DRAWING PLATES', function () { /* assets preloaded */ }],
    ];
    var i = 0;
    (function next() {
      if (i >= steps.length) {
        els.bootBar.style.width = '100%';
        setTimeout(function () {
          els.boot.classList.add('done');
          setTimeout(function () {
            els.boot.style.display = 'none';
            if (window.SceneAPI && window.SceneAPI.playIntro) {
              window.SceneAPI.playIntro(function () {
                els.hint.style.opacity = '1';
              });
            } else {
              els.hint.style.opacity = '1';
            }
          }, 350);
        }, 220);
        return;
      }
      els.bootStatus.textContent = steps[i][0];
      els.bootBar.style.width = Math.round(((i + 1) / (steps.length + 1)) * 100) + '%';
      try { steps[i][1](); } catch (e) { console.error('boot step failed', steps[i][0], e); }
      i++;
      setTimeout(next, 160);
    })();
  }

  /* ---------- events ---------- */

  function wire() {
    if (window.SceneAPI) {
      window.SceneAPI.onHotspotClick = function (sceneId) {
        var chainId = CHAIN_ID[sceneId];
        if (chainId) openObject(chainId);
      };
    }
    if (window.GraphAPI) {
      window.GraphAPI.init($('mini-graph'));
      window.GraphAPI.setOnNodeClick(function (nodeId) {
        var n = nodeById(nodeId);
        if (!n) return;
        // may belong to another chain (finale clicks) — switch chains if so
        for (var i = 0; i < CHAINS.length; i++) {
          var has = CHAINS[i].nodes.some(function (x) { return x.id === nodeId; });
          if (has && CHAINS[i].id !== state.chainId) { openObject(CHAINS[i].id); break; }
        }
        selectNode(nodeId, {});
      });
    }

    $('rail-close').addEventListener('click', closeObject);
    $('btn-cutaway').addEventListener('click', function () { setCutaway(!state.cutaway); });
    $('btn-graph').addEventListener('click', openFullGraph);
    $('graph-close').addEventListener('click', closeFullGraph);
    wirePressControls();

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (!els.pressOverlay.classList.contains('hidden')) { closePress(); return; }
        if (!els.graphOverlay.classList.contains('hidden')) { closeFullGraph(); return; }
        closeObject();
      }
      if (e.key === 'c' || e.key === 'C') setCutaway(!state.cutaway);
      if (e.key === 'g' || e.key === 'G') {
        if (els.graphOverlay.classList.contains('hidden')) openFullGraph(); else closeFullGraph();
      }
    });

    // reticle visible while hovering the room
    els.room.addEventListener('mousemove', function () {
      els.reticle.style.opacity = state.chainId ? '0' : '0.8';
    });
    els.room.addEventListener('mouseleave', function () { els.reticle.style.opacity = '0'; });
  }

  /* ---------- go ---------- */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { wire(); boot(); });
  } else { wire(); boot(); }
})();
