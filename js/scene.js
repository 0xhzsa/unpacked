/* UNPACKED - scene.js
 * Three.js r160 room scene. Plain browser JS, THREE global from CDN.
 * Dusk-lit industrial room: matte charcoal solids, warm amber crease lines
 * (threshold-angle EdgesGeometry), real lights + soft shadows, window light
 * shaft, drifting dust, gentle fog. No composer - tone mapping + CSS vignette.
 */
(function () {
  'use strict';

  // ------------------------------------------------------------------ config

  var AMBER = 0xe8861d;
  var BG = 0x0a0b0d;
  var EDGE_BASE = 0.5;      // resting line opacity
  var EDGE_HOVER = 1.0;     // hovered / cutaway line opacity
  var EDGE_ANGLE = 30;      // crease threshold (deg): silhouettes + major folds

  var EST_POS = new THREE.Vector3(2.6, 2.4, 6.4);
  var EST_LOOK = new THREE.Vector3(-0.2, 1.05, -2.5); // desk center
  var INTRO_POS = new THREE.Vector3(4.9, 4.5, 11.0);
  var INTRO_LOOK = new THREE.Vector3(0.2, 1.7, -1.2);

  // ------------------------------------------------------------------- state

  var container = null;
  var renderer = null;
  var scene = null;
  var camera = null;
  var clock = null;
  var raycaster = null;
  var pointer = null;

  var grid = null;
  var vignette = null;
  var dust = null;
  var dustBase = null;
  var dustPhase = null;

  // objectId -> { root, edges[], materials[], meshes[], inner, focusPoint, radius }
  var objects = {};
  var pickables = [];
  var allEdges = [];

  var hoveredId = null;
  var focusedId = null;
  var cutaway = false;

  // camera rig
  var camStart = new THREE.Vector3();
  var camEnd = new THREE.Vector3();
  var lookStart = new THREE.Vector3();
  var lookEnd = new THREE.Vector3();
  var camCurrentLook = new THREE.Vector3().copy(EST_LOOK);

  var tweenT = 1;
  var tweenDur = 0.7;
  var tweening = false;
  var tweenDone = null;
  var introActive = false;

  var running = false;
  var rafId = 0;
  var HOVER_EPS = 0.05;     // damped pointer follow

  // ---------------------------------------------------------------- helpers

  function stdMat(color, opts) {
    opts = opts || {};
    var m = new THREE.MeshStandardMaterial({
      color: color,
      roughness: opts.roughness !== undefined ? opts.roughness : 0.85,
      metalness: opts.metalness !== undefined ? opts.metalness : 0.06,
      emissive: opts.emissive !== undefined ? opts.emissive : 0x000000,
      emissiveIntensity: opts.emissiveIntensity !== undefined ? opts.emissiveIntensity : 1,
      side: opts.side !== undefined ? opts.side : THREE.FrontSide,
      transparent: !!opts.transparent,
      opacity: opts.opacity !== undefined ? opts.opacity : 1,
      depthWrite: opts.depthWrite !== undefined ? opts.depthWrite : true
    });
    // remembered so hover / cutaway can restore exactly
    m.userData.baseEm = m.emissive.getHex();
    m.userData.baseEi = m.emissiveIntensity;
    m.userData.baseOp = m.opacity;
    m.userData.baseSide = m.side;
    m.userData.baseTransparent = m.transparent;
    m.userData.baseDepthWrite = m.depthWrite;
    return m;
  }

  function box(w, h, d, m, x, y, z) {
    var mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x || 0, y || 0, z || 0);
    return mesh;
  }

  function cyl(rt, rb, h, seg, m, x, y, z, open) {
    var mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(rt, rb, h, seg || 20, 1, !!open), m);
    mesh.position.set(x || 0, y || 0, z || 0);
    return mesh;
  }

  // Cylinder spanned between two points (for lamp arms, chair posts...)
  function seg(p0, p1, r, m) {
    var dir = new THREE.Vector3().subVectors(p1, p0);
    var len = dir.length();
    var mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 14), m);
    mesh.position.copy(p0).addScaledVector(dir, 0.5);
    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return mesh;
  }

  function canvasTex(w, h, draw) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    var t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  // Bright at v=0 (the window end), fading along the shaft; soft side edges.
  function shaftTexture() {
    return canvasTex(32, 128, function (x, w, h) {
      var gv = x.createLinearGradient(0, h, 0, 0);
      gv.addColorStop(0, 'rgba(255,255,255,1)');
      gv.addColorStop(0.4, 'rgba(255,255,255,0.42)');
      gv.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = gv; x.fillRect(0, 0, w, h);
      var gh = x.createLinearGradient(0, 0, w, 0);
      gh.addColorStop(0, 'rgba(0,0,0,0)');
      gh.addColorStop(0.25, 'rgba(0,0,0,1)');
      gh.addColorStop(0.75, 'rgba(0,0,0,1)');
      gh.addColorStop(1, 'rgba(0,0,0,0)');
      x.globalCompositeOperation = 'destination-in';
      x.fillStyle = gh; x.fillRect(0, 0, w, h);
    });
  }

  // Dusk sky seen through the window: cool zenith, warm horizon glow.
  function skyTexture() {
    return canvasTex(16, 128, function (x, w, h) {
      var g = x.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#0d1826');
      g.addColorStop(0.45, '#27455f');
      g.addColorStop(0.72, '#4d7288');
      g.addColorStop(0.9, '#93826c');
      g.addColorStop(1, '#b08a5e');
      x.fillStyle = g; x.fillRect(0, 0, w, h);
    });
  }

  // ------------------------------------------- edge lines + registration

  // Add low-opacity amber crease lines to meshes under root, register for picking.
  function wire(root) {
    var id = root.userData.objectId;
    root.traverse(function (n) {
      if (!n.isMesh || n.userData.noEdge) return;
      n.userData.objectId = id;
      pickables.push(n);
      n.castShadow = !n.userData.noShadow;
      n.receiveShadow = !n.userData.noShadow;
      if (n.userData.noLines) return;
      var eg = n.geometry.userData.edgesGeo;
      if (!eg) {
        eg = new THREE.EdgesGeometry(n.geometry, EDGE_ANGLE);
        n.geometry.userData.edgesGeo = eg;
      }
      var base = EDGE_BASE * (n.userData.edgeScale !== undefined ? n.userData.edgeScale : 1);
      var lm = new THREE.LineBasicMaterial({
        color: AMBER, transparent: true, opacity: base
      });
      lm.toneMapped = false;
      lm.userData.base = base;
      lm.userData.target = base;
      var ls = new THREE.LineSegments(eg, lm);
      ls.renderOrder = 3;
      n.add(ls); // follows the mesh transform exactly
      objects[id].edges.push(lm);
      allEdges.push(lm);
    });
  }

  function register(root, id) {
    root.userData.objectId = id;
    scene.add(root);
    var rec = {
      root: root, edges: [], materials: [], meshes: [], inner: null,
      focusPoint: new THREE.Vector3(), radius: 0.6
    };
    objects[id] = rec;
    root.traverse(function (n) {
      if (n.isMesh && !n.userData.noLines) {
        if (rec.materials.indexOf(n.material) === -1) rec.materials.push(n.material);
        rec.meshes.push(n);
      }
    });
    wire(root);

    var bb = new THREE.Box3().setFromObject(root);
    bb.getCenter(rec.focusPoint);
    rec.radius = bb.getSize(new THREE.Vector3()).length() * 0.5;
    return rec;
  }

  // Inner "component" cluster revealed by cutaway. Attached after register()
  // so it never joins the pick list or the shadow pass.
  function attachInner(rec, g) {
    rec.inner = g;
    g.visible = false;
    rec.root.add(g);
    g.traverse(function (n) {
      if (!n.isMesh) return;
      var eg = n.geometry.userData.edgesGeo;
      if (!eg) {
        eg = new THREE.EdgesGeometry(n.geometry, EDGE_ANGLE);
        n.geometry.userData.edgesGeo = eg;
      }
      var lm = new THREE.LineBasicMaterial({ color: AMBER, transparent: true, opacity: 0.85 });
      lm.toneMapped = false;
      lm.userData.base = 0.85;
      lm.userData.target = 0.85;
      var ls = new THREE.LineSegments(eg, lm);
      ls.renderOrder = 3;
      n.add(ls);
      rec.edges.push(lm);
      allEdges.push(lm);
    });
  }

  // ------------------------------------------------------------- room build

  function buildRoom() {
    var floorMat = stdMat(0x141519, { roughness: 0.95, metalness: 0 });
    var wallB = stdMat(0x2b2724, { roughness: 0.95, metalness: 0 });   // warm graphite
    var wallL = stdMat(0x272421, { roughness: 0.95, metalness: 0 });
    var wallR = stdMat(0x282521, { roughness: 0.95, metalness: 0 });
    var ceilMat = stdMat(0x1b1c1f, { roughness: 0.95, metalness: 0 });

    var floor = new THREE.Mesh(new THREE.PlaneGeometry(9, 8), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    function wall(m, w, h, d, x, y, z) {
      var b = box(w, h, d, m, x, y, z);
      b.receiveShadow = true;
      scene.add(b);
      return b;
    }

    wall(wallB, 8.2, 3.2, 0.12, 0, 1.6, -3.5);          // back
    wall(wallL, 0.12, 3.2, 7.1, -4, 1.6, 0);            // left
    // right wall built around the window opening (y 1.0..2.6, z -1.2..1.2)
    wall(wallR, 0.12, 1.0, 7.1, 4, 0.5, 0);
    wall(wallR, 0.12, 0.6, 7.1, 4, 2.9, 0);
    wall(wallR, 0.12, 1.6, 2.3, 4, 1.8, -2.35);
    wall(wallR, 0.12, 1.6, 2.3, 4, 1.8, 2.35);
    wall(ceilMat, 8.2, 0.1, 7.1, 0, 3.25, 0);           // ceiling (no shadow cast)

    grid = new THREE.GridHelper(7, 28, 0x39424e, 0x2a313b);
    grid.position.y = 0.004;
    grid.material.transparent = true;
    grid.material.opacity = 0.22;
    scene.add(grid);
  }

  function buildShaft() {
    var mat = new THREE.MeshBasicMaterial({
      map: shaftTexture(),
      color: 0x9dc4ea,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      fog: false
    });
    var g = new THREE.Group();
    var L = 5.5, W = 2.6;
    var geo = new THREE.PlaneGeometry(W, L);
    var axis = new THREE.Vector3(-1, -0.5, 0).normalize();  // window -> desk
    var x = new THREE.Vector3(0, 0, 1);
    var z = new THREE.Vector3().crossVectors(x, axis);
    g.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, axis, z));
    g.position.set(3.9, 1.8, 0);
    var p1 = new THREE.Mesh(geo, mat);
    p1.position.y = L / 2;
    p1.userData.noLines = true;
    p1.userData.noShadow = true;
    var p2 = new THREE.Mesh(geo, mat);
    p2.position.y = L / 2;
    p2.rotation.y = Math.PI / 2;      // crossed pair reads from any angle
    p2.userData.noLines = true;
    p2.userData.noShadow = true;
    g.add(p1); g.add(p2);
    scene.add(g);
  }

  function buildLights() {
    scene.add(new THREE.HemisphereLight(0x2a3a4a, 0x1a1510, 0.55));
    scene.add(new THREE.AmbientLight(0x232a33, 0.35));

    var key = new THREE.DirectionalLight(0xcfe0f2, 1.7);   // window-side key
    key.position.set(6.5, 5.0, 2.0);
    key.target.position.set(-0.5, 1.0, -2.5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -6;
    key.shadow.camera.right = 6;
    key.shadow.camera.top = 6;
    key.shadow.camera.bottom = -6;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 30;
    key.shadow.bias = -0.0006;
    key.shadow.normalBias = 0.02;
    scene.add(key);
    scene.add(key.target);
  }

  // ------------------------------------------------------------- objects

  function buildWindow() {
    var g = new THREE.Group();
    var frameMat = stdMat(0x26292f, { roughness: 0.65, metalness: 0.25 });
    var glassMat = stdMat(0x7fa8c8, {
      roughness: 0.12, metalness: 0, transparent: true, opacity: 0.15,
      side: THREE.DoubleSide, depthWrite: false, emissive: 0x3a5a72, emissiveIntensity: 0.25
    });

    g.add(box(0.14, 0.1, 2.5, frameMat, 0, 2.65, 0));          // head
    g.add(box(0.14, 0.1, 2.5, frameMat, 0, 0.95, 0));          // bottom rail
    g.add(box(0.14, 1.8, 0.1, frameMat, 0, 1.8, -1.25));       // jamb
    g.add(box(0.14, 1.8, 0.1, frameMat, 0, 1.8, 1.25));
    g.add(box(0.26, 0.07, 2.7, frameMat, -0.08, 0.88, 0));     // sill into room
    g.add(box(0.1, 1.6, 0.07, frameMat, 0, 1.8, 0));           // mullion v
    g.add(box(0.1, 0.07, 2.4, frameMat, 0, 1.8, 0));           // mullion h

    var glass = box(0.03, 1.6, 2.4, glassMat, 0, 1.8, 0);
    glass.userData.noShadow = true;
    g.add(glass);

    // mild emissive cool pane (the "glow" of dusk through the glass)
    var pane = box(0.02, 1.62, 2.42,
      new THREE.MeshBasicMaterial({ color: 0x3a5a72, transparent: true, opacity: 0.35 }),
      0.05, 1.8, 0);
    pane.userData.noLines = true;
    pane.userData.noShadow = true;
    g.add(pane);

    // dusk sky beyond the wall
    var sky = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.7),
      new THREE.MeshBasicMaterial({ map: skyTexture() }));
    sky.rotation.y = -Math.PI / 2;
    sky.position.set(0.18, 1.8, 0);
    sky.userData.noLines = true;
    sky.userData.noShadow = true;
    g.add(sky);

    g.position.set(3.94, 0, 0);
    var rec = register(g, 'window');
    var inner = new THREE.Group();
    var glazeMat = stdMat(0x18242e, { roughness: 0.2, metalness: 0, emissive: 0x3a5a72, emissiveIntensity: 0.45 });
    inner.add(box(0.015, 1.45, 2.25, glazeMat, 0.02, 1.8, 0));
    inner.add(box(0.015, 1.45, 2.25, glazeMat, 0.07, 1.8, 0));
    attachInner(rec, inner);
  }

  function buildDesk() {
    var g = new THREE.Group();
    var m = stdMat(0x2a2d33, { roughness: 0.55, metalness: 0.35 });

    g.add(box(2.6, 0.08, 1.1, m, 0, 1.0, 0));                 // top, surface y=1.04
    var lx = 1.2, lz = 0.45;
    g.add(box(0.09, 1.0, 0.09, m, -lx, 0.5, -lz));
    g.add(box(0.09, 1.0, 0.09, m, lx, 0.5, -lz));
    g.add(box(0.09, 1.0, 0.09, m, -lx, 0.5, lz));
    g.add(box(0.09, 1.0, 0.09, m, lx, 0.5, lz));
    g.add(box(0.15, 0.04, 0.15, m, -lx, 0.02, -lz));          // feet
    g.add(box(0.15, 0.04, 0.15, m, lx, 0.02, -lz));
    g.add(box(0.15, 0.04, 0.15, m, -lx, 0.02, lz));
    g.add(box(0.15, 0.04, 0.15, m, lx, 0.02, lz));
    g.add(box(2.3, 0.55, 0.05, m, 0, 0.62, -0.4));            // modesty panel
    g.add(box(2.4, 0.07, 0.07, m, 0, 0.93, -0.42));           // under-top rail

    g.position.set(-0.4, 0, -2.6);
    var rec = register(g, 'desk');
    var inner = new THREE.Group();
    var railMat = stdMat(0x101216, { roughness: 0.7, metalness: 0.2, emissive: 0xe8861d, emissiveIntensity: 0.35 });
    inner.add(box(2.2, 0.06, 0.06, railMat, 0, 0.9, 0));      // cable rail
    inner.add(box(0.2, 0.1, 0.14, railMat, 0.6, 0.86, 0));    // junction box
    attachInner(rec, inner);
  }

  function buildKeyboard() {
    var g = new THREE.Group();
    var shell = stdMat(0x2b2f36, { roughness: 0.7, metalness: 0.12 });
    var capMat = stdMat(0x33373f, { roughness: 0.8, metalness: 0.05 });

    g.add(box(0.86, 0.05, 0.3, shell, 0, 0.025, 0));          // base 0..0.05

    var capGeo = new THREE.BoxGeometry(0.05, 0.02, 0.05);
    function cap(x, z) {
      var k = new THREE.Mesh(capGeo, capMat);
      k.position.set(x, 0.06, z);
      k.userData.edgeScale = 0.45;                            // keep the grid quiet
      g.add(k);
    }
    var r, c;
    for (r = 0; r < 3; r++)                                   // 3 rows of 13
      for (c = 0; c < 13; c++) cap(-0.38 + c * 0.063, -0.1 + r * 0.06);
    var mods = [-0.38, -0.32, -0.26, -0.2, 0.2, 0.26, 0.32, 0.38];
    for (c = 0; c < mods.length; c++) cap(mods[c], 0.085);
    g.add(box(0.32, 0.02, 0.05, capMat, 0, 0.06, 0.085));     // spacebar

    g.position.set(-0.6, 1.04, -2.42);
    g.rotation.y = 0.06;
    var rec = register(g, 'keyboard');
    var inner = new THREE.Group();
    var pcb = stdMat(0x16382a, { roughness: 0.6, metalness: 0.1, emissive: 0x1f7a52, emissiveIntensity: 0.5 });
    var chip = stdMat(0x101216, { roughness: 0.5, emissive: 0xe8861d, emissiveIntensity: 0.6 });
    inner.add(box(0.78, 0.012, 0.24, pcb, 0, 0.03, 0));
    inner.add(box(0.1, 0.02, 0.1, chip, 0.12, 0.045, -0.02));
    inner.add(box(0.06, 0.015, 0.04, chip, -0.2, 0.042, 0.05));
    attachInner(rec, inner);
  }

  function buildLamp() {
    var g = new THREE.Group();
    var metal = stdMat(0x3a3d44, { roughness: 0.45, metalness: 0.55 });
    var shadeMat = stdMat(0x3a3d44, {
      roughness: 0.4, metalness: 0.5, side: THREE.DoubleSide
    });

    g.add(cyl(0.13, 0.16, 0.05, 28, metal, 0, 0.025, 0));     // weighted base
    g.add(cyl(0.05, 0.06, 0.04, 18, metal, 0, 0.07, 0));      // collar

    var E = new THREE.Vector3(0.06, 0.5, 0);                  // elbow
    var H = new THREE.Vector3(0.3, 0.7, 0.02);                // head
    g.add(seg(new THREE.Vector3(0, 0.08, 0), E, 0.022, metal));
    g.add(seg(E, H, 0.018, metal));
    var joint = new THREE.Mesh(new THREE.SphereGeometry(0.045, 14, 10), metal);
    joint.position.copy(E);
    g.add(joint);

    var d = new THREE.Vector3(-0.3, -1, 0.35).normalize();     // shade points down-left
    var shade = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.16, 0.24, 26, 1, true), shadeMat);
    shade.position.copy(H).addScaledVector(d, 0.12);
    shade.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().negate());
    shade.castShadow = true; shade.receiveShadow = true;
    g.add(shade);
    var knob = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 10), metal);
    knob.position.copy(H);
    g.add(knob);

    var bulbMat = stdMat(0xfff0d0, { roughness: 0.4, emissive: 0xffd9a0, emissiveIntensity: 1.6 });
    var bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 10), bulbMat);
    bulb.position.copy(H).addScaledVector(d, 0.1);
    bulb.userData.noLines = true;
    g.add(bulb);

    var warm = new THREE.PointLight(0xffb060, 2.2, 3.2, 2);   // warm pool on the desk
    warm.position.copy(H).addScaledVector(d, 0.14);
    g.add(warm);

    g.position.set(0.45, 1.04, -2.85);
    var rec = register(g, 'lamp');
    var inner = new THREE.Group();
    var wireMat = stdMat(0x1a1410, { roughness: 0.6, emissive: 0xe8861d, emissiveIntensity: 0.5 });
    inner.add(seg(new THREE.Vector3(0, 0.08, 0), H, 0.008, wireMat));   // loom
    inner.add(box(0.09, 0.03, 0.06, wireMat, 0.02, 0.1, 0));            // driver
    attachInner(rec, inner);
  }

  function buildMug() {
    var g = new THREE.Group();
    var ceramic = stdMat(0xd8d2c6, { roughness: 0.42, metalness: 0.0 });

    g.add(cyl(0.09, 0.075, 0.17, 30, ceramic, 0, 0.085, 0));  // tapered body
    var rim = new THREE.Mesh(new THREE.TorusGeometry(0.088, 0.007, 8, 30), ceramic);
    rim.rotation.x = -Math.PI / 2;
    rim.position.y = 0.172;
    rim.castShadow = true;
    g.add(rim);
    var handle = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 8, 18, Math.PI), ceramic);
    handle.rotation.z = -Math.PI / 2;
    handle.position.set(0.085, 0.095, 0);
    handle.castShadow = true;
    g.add(handle);

    g.position.set(0.0, 1.04, -2.28);
    var rec = register(g, 'mug');
    var inner = new THREE.Group();
    var coffee = stdMat(0x1e1208, { roughness: 0.35, emissive: 0x4a2a10, emissiveIntensity: 0.5 });
    inner.add(cyl(0.078, 0.078, 0.05, 24, coffee, 0, 0.13, 0));
    attachInner(rec, inner);
  }

  function buildChair() {
    var g = new THREE.Group();
    var dark = stdMat(0x1e2024, { roughness: 0.75, metalness: 0.1 });
    var post = stdMat(0x2c2f36, { roughness: 0.4, metalness: 0.6 });

    // contoured seat: plate + cushion (slight recline)
    g.add(box(0.5, 0.05, 0.48, dark, 0, 0.5, 0));
    var cushion = box(0.46, 0.06, 0.44, dark, 0, 0.555, -0.01);
    cushion.rotation.x = 0.04;
    g.add(cushion);
    // backrest, tilted back
    var back = box(0.44, 0.52, 0.055, dark, 0, 0.88, -0.24);
    back.rotation.x = -0.1;
    g.add(back);
    g.add(box(0.07, 0.3, 0.05, post, 0, 0.62, -0.22));

    // central post
    g.add(cyl(0.035, 0.035, 0.36, 16, post, 0, 0.3, 0));
    g.add(cyl(0.06, 0.06, 0.1, 18, post, 0, 0.45, 0));

    // 5-star base + casters
    g.add(cyl(0.08, 0.09, 0.06, 20, post, 0, 0.06, 0));
    for (var i = 0; i < 5; i++) {
      var a = (i / 5) * Math.PI * 2 + 0.3;
      var arm = box(0.32, 0.045, 0.07, post, Math.cos(a) * 0.17, 0.055, Math.sin(a) * 0.17);
      arm.rotation.y = -a;
      g.add(arm);
      var caster = new THREE.Group();
      caster.position.set(Math.cos(a) * 0.33, 0.035, Math.sin(a) * 0.33);
      caster.rotation.y = -a;
      var wheel = cyl(0.035, 0.035, 0.032, 14, dark, 0, 0, 0);
      wheel.rotation.x = Math.PI / 2;               // roll axis tangential to the arm
      caster.add(wheel);
      g.add(caster);
    }

    g.position.set(-1.45, 0, -1.4);
    g.rotation.y = Math.PI - 0.35;                            // faces the desk
    var rec = register(g, 'chair');
    var inner = new THREE.Group();
    var spring = stdMat(0x14161a, { roughness: 0.4, metalness: 0.5, emissive: 0x3a5a72, emissiveIntensity: 0.5 });
    var mech = stdMat(0x101216, { roughness: 0.5, emissive: 0xe8861d, emissiveIntensity: 0.45 });
    inner.add(cyl(0.028, 0.028, 0.34, 14, spring, 0, 0.3, 0));   // gas spring
    inner.add(box(0.18, 0.09, 0.16, mech, 0, 0.46, 0));          // tilt mechanism
    attachInner(rec, inner);
  }

  function buildDust() {
    var N = 250;
    var pos = new Float32Array(N * 3);
    dustBase = new Float32Array(N * 3);
    dustPhase = new Float32Array(N);
    for (var i = 0; i < N; i++) {
      var x, y, z;
      if (i < 175) {        // biased into the lamp / desk pool
        x = -1.4 + Math.random() * 3.0;
        y = 1.0 + Math.random() * 1.4;
        z = -3.3 + Math.random() * 1.9;
      } else {
        x = -3.6 + Math.random() * 7.2;
        y = 0.15 + Math.random() * 2.9;
        z = -3.4 + Math.random() * 6.6;
      }
      pos[i * 3] = dustBase[i * 3] = x;
      pos[i * 3 + 1] = dustBase[i * 3 + 1] = y;
      pos[i * 3 + 2] = dustBase[i * 3 + 2] = z;
      dustPhase[i] = Math.random() * Math.PI * 2;
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    dust = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0xffcf9a, size: 0.016, sizeAttenuation: true,
      transparent: true, opacity: 0.22,
      blending: THREE.AdditiveBlending, depthWrite: false
    }));
    dust.userData.noLines = true;
    scene.add(dust);
  }

  // ------------------------------------------------------------ interaction

  function refreshEdges() {
    var mult = EDGE_HOVER / EDGE_BASE;
    Object.keys(objects).forEach(function (k) {
      var hi = (k === hoveredId) || (cutaway && k === focusedId);
      var edges = objects[k].edges;
      for (var i = 0; i < edges.length; i++) {
        edges[i].userData.target = Math.min(EDGE_HOVER, edges[i].userData.base * (hi ? mult : 1));
      }
    });
  }

  function setHighlight(id, on) {
    if (!id || !objects[id]) return;
    objects[id].materials.forEach(function (m) {
      if (!m.emissive) return;
      if (on) {
        m.emissive.setHex(0x8a5a1e);
        m.emissiveIntensity = Math.max(m.userData.baseEi || 0, 0.45);
      } else {
        m.emissive.setHex(m.userData.baseEm || 0);
        m.emissiveIntensity = m.userData.baseEi !== undefined ? m.userData.baseEi : 1;
      }
    });
  }

  function updateHover() {
    if (!camera || !renderer) return;
    raycaster.setFromCamera(pointer, camera);
    var hits = raycaster.intersectObjects(pickables, false);
    var id = null;
    for (var i = 0; i < hits.length; i++) {
      if (hits[i].object.userData.objectId) {
        id = hits[i].object.userData.objectId;
        break;
      }
    }
    if (id !== hoveredId) {
      setHighlight(hoveredId, false);
      hoveredId = id;
      setHighlight(hoveredId, true);
      if (container) container.style.cursor = hoveredId ? 'pointer' : 'default';
      refreshEdges();
    }
  }

  function onPointerMove(e) {
    if (!renderer) return;
    var r = renderer.domElement.getBoundingClientRect();
    var nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    var ny = -((e.clientY - r.top) / r.height) * 2 + 1;
    pointer.x += (nx - pointer.x) * (1 - HOVER_EPS);
    pointer.y += (ny - pointer.y) * (1 - HOVER_EPS);
  }

  function onClick() {
    if (hoveredId && typeof SceneAPI.onHotspotClick === 'function') {
      SceneAPI.onHotspotClick(hoveredId);
    }
  }

  function onKey(e) {
    if (!renderer) return;
    if (e.key === 'c' || e.key === 'C') SceneAPI.setCutaway(!cutaway);
    if (e.key === 'Escape') SceneAPI.unfocus();
  }

  // ------------------------------------------------------------- camera api

  function frameObject(rec) {
    var target = rec.focusPoint.clone();
    var dist = Math.max(rec.radius * 3.2, 1.4);

    // Dolly from the room-center axis, biased to the open/window side (+z, +x),
    // but never so far +x that we end up outside the right wall.
    var dir = target.clone().sub(new THREE.Vector3(0, 1.4, 0));
    if (dir.lengthSq() < 0.001) dir.set(0, 0, 1);
    dir.normalize();
    dir.z = Math.max(dir.z, 0.55);
    dir.y = Math.max(dir.y, 0.15);
    dir.x = Math.min(Math.max(dir.x, 0.05), (3.3 - target.x) / dist);
    dir.normalize();

    var pos = target.clone().addScaledVector(dir, dist);
    pos.y = Math.min(Math.max(pos.y, 0.9), 3.0);
    pos.z = Math.min(pos.z, 5.4);                 // stay near the open side
    pos.x = Math.max(-3.6, Math.min(3.3, pos.x));
    // keep a sane framing distance after the clamps
    if (pos.distanceTo(target) < rec.radius * 1.8) {
      pos.copy(target).addScaledVector(
        pos.clone().sub(target).normalize(), rec.radius * 1.8);
    }

    startTween(pos, target, 0.7);
  }

  function startTween(pos, look, dur) {
    camStart.copy(camera.position);
    camEnd.copy(pos);
    lookStart.copy(camCurrentLook);
    lookEnd.copy(look);
    tweenDur = dur || 0.7;
    tweenT = 0;
    tweening = true;
  }

  function easeOutCubic(t) {
    var u = 1 - t;
    return 1 - u * u * u;
  }

  function playIntro(onComplete) {
    if (!camera || !renderer) { if (onComplete) onComplete(); return; }
    introActive = true;
    camera.position.copy(INTRO_POS);
    camCurrentLook.copy(INTRO_LOOK);
    camStart.copy(INTRO_POS);
    lookStart.copy(INTRO_LOOK);
    camEnd.copy(EST_POS);
    lookEnd.copy(EST_LOOK);
    tweenT = 0;
    tweenDur = 2.8;
    tweening = true;
    tweenDone = function () {
      introActive = false;
      if (onComplete) onComplete();
    };
  }

  // --------------------------------------------------------------- cutaway

  function applyCutaway() {
    Object.keys(objects).forEach(function (k) {
      var o = objects[k];
      var on = cutaway && k === focusedId;
      if (o.inner) o.inner.visible = on;
      o.materials.forEach(function (m) {
        if (on) {
          // clean section: front faces fall away, shell ghosts the form
          m.side = THREE.BackSide;
          m.transparent = true;
          m.opacity = (m.userData.baseOp !== undefined ? m.userData.baseOp : 1) * 0.3;
          m.depthWrite = false;
        } else {
          m.side = m.userData.baseSide !== undefined ? m.userData.baseSide : THREE.FrontSide;
          m.transparent = m.userData.baseTransparent || false;
          m.opacity = m.userData.baseOp !== undefined ? m.userData.baseOp : 1;
          m.depthWrite = m.userData.baseDepthWrite !== undefined ? m.userData.baseDepthWrite : true;
        }
        m.needsUpdate = true;
      });
    });
    refreshEdges();
  }

  // ----------------------------------------------------------------- loop

  function animate() {
    if (!running) return;
    rafId = requestAnimationFrame(animate);
    var dt = Math.min(clock.getDelta(), 0.1);

    if (tweening) {
      tweenT = Math.min(1, tweenT + dt / tweenDur);
      var e = easeOutCubic(tweenT);
      camera.position.lerpVectors(camStart, camEnd, e);
      camCurrentLook.lerpVectors(lookStart, lookEnd, e);
      if (tweenT >= 1) {
        tweening = false;
        var done = tweenDone;
        tweenDone = null;
        if (done) done();
      }
    }

    // gentle pointer parallax so the viewport feels alive (off during intro)
    var px = introActive ? 0 : (focusedId ? 0.03 : 0.12);
    var desired = camCurrentLook.clone();
    desired.x += pointer.x * px;
    desired.y += pointer.y * px * 0.6;
    camera.lookAt(
      camera.position.x + (desired.x - camera.position.x) * 0.12,
      camera.position.y + (desired.y - camera.position.y) * 0.12,
      camera.position.z + (desired.z - camera.position.z) * 0.12
    );

    // edge lines ease toward their target opacity
    var k = Math.min(1, dt * 12);
    for (var i = 0; i < allEdges.length; i++) {
      var em = allEdges[i];
      var t = em.userData.target;
      if (em.opacity !== t) em.opacity += (t - em.opacity) * k;
    }

    // drifting dust motes
    if (dust) {
      var time = performance.now() * 0.001;
      var p = dust.geometry.attributes.position.array;
      for (var j = 0; j < dustPhase.length; j++) {
        var ph = dustPhase[j];
        p[j * 3] = dustBase[j * 3] + Math.sin(time * 0.12 + ph) * 0.07;
        p[j * 3 + 1] = dustBase[j * 3 + 1] + Math.sin(time * 0.09 + ph * 1.7) * 0.05;
        p[j * 3 + 2] = dustBase[j * 3 + 2] + Math.cos(time * 0.1 + ph) * 0.07;
      }
      dust.geometry.attributes.position.needsUpdate = true;
    }

    updateHover();
    renderer.render(scene, camera);
  }

  function onResize() {
    if (!renderer || !camera || !container) return;
    var w = container.clientWidth || window.innerWidth;
    var h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  }

  // ------------------------------------------------------------------ init

  function addVignette() {
    var cs = window.getComputedStyle(container);
    if (cs.position === 'static') container.style.position = 'relative';
    var v = document.createElement('div');
    v.style.cssText = 'position:absolute;left:0;top:0;right:0;bottom:0;' +
      'pointer-events:none;z-index:1;' +
      'background:radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%);';
    container.appendChild(v);
    vignette = v;
  }

  function init(el) {
    if (renderer) return SceneAPI;
    container = el || document.body;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(BG);
    scene.fog = new THREE.FogExp2(0x0a0b0d, 0.045);

    camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.1, 100);
    camera.position.copy(EST_POS);
    camCurrentLook.copy(EST_LOOK);
    camera.lookAt(camCurrentLook);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setClearColor(BG, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    addVignette();

    clock = new THREE.Clock();
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2(0, 0);
    pickables = [];
    allEdges = [];

    buildLights();
    buildRoom();
    buildShaft();
    buildWindow();
    buildDesk();
    buildKeyboard();
    buildLamp();
    buildMug();
    buildChair();
    buildDust();

    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('click', onClick);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    onResize();

    running = true;
    animate();
    return SceneAPI;
  }

  function dispose() {
    running = false;
    cancelAnimationFrame(rafId);
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('resize', onResize);
    if (container) {
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('click', onClick);
    }
    if (scene) {
      scene.traverse(function (n) {
        if (n.geometry) n.geometry.dispose();
        if (n.material) {
          var mats = Array.isArray(n.material) ? n.material : [n.material];
          for (var i = 0; i < mats.length; i++) mats[i].dispose();
        }
      });
    }
    if (renderer) {
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }
    if (vignette && vignette.parentNode) vignette.parentNode.removeChild(vignette);
    vignette = null;
    renderer = null; scene = null; camera = null; container = null;
  }

  // ------------------------------------------------------------- public api

  var SceneAPI = {
    init: init,
    dispose: dispose,
    onHotspotClick: null,

    playIntro: playIntro,

    focusOn: function (objectId) {
      var rec = objects[objectId];
      if (!rec) return false;
      focusedId = objectId;
      frameObject(rec);
      applyCutaway();
      return true;
    },

    unfocus: function () {
      focusedId = null;
      startTween(EST_POS, EST_LOOK, 0.7);
      applyCutaway();
    },

    setCutaway: function (on) {
      cutaway = !!on;
      applyCutaway();
    },

    isCutaway: function () { return cutaway; },
    focusedObject: function () { return focusedId; }
  };

  window.SceneAPI = SceneAPI;
})();
