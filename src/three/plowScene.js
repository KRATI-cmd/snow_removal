import * as THREE from "three";
import { mergeGeometries, mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

const SPEED = 2.6;
const LANE = 1.8;
const BLADE_X = 2.75;
const BLADE_YAW = -0.3;
const TILE = 5;
const SKY = new THREE.Color("#0a1628");

const rand = (a, b) => a + Math.random() * (b - a);

function canvasTexture(size, draw, { color = true } = {}) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  draw(c.getContext("2d"), size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

// Draw a blob at every wrapped offset so the texture tiles without seams.
function wrappedDot(ctx, size, x, y, r, fill) {
  ctx.fillStyle = fill;
  for (let dx = -1; dx <= 1; dx++)
    for (let dy = -1; dy <= 1; dy++) {
      ctx.beginPath();
      ctx.arc(x + dx * size, y + dy * size, r, 0, Math.PI * 2);
      ctx.fill();
    }
}

function makeSnowTexture() {
  return canvasTexture(512, (ctx, s) => {
    ctx.fillStyle = "#dfe7f1";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 900; i++)
      wrappedDot(ctx, s, rand(0, s), rand(0, s), rand(6, 30), "rgba(150,172,204,0.06)");
    for (let i = 0; i < 500; i++)
      wrappedDot(ctx, s, rand(0, s), rand(0, s), rand(2, 7), "rgba(255,255,255,0.35)");
    for (let i = 0; i < 700; i++)
      wrappedDot(ctx, s, rand(0, s), rand(0, s), rand(0.5, 1.3), "rgba(255,255,255,0.95)");
  });
}

function makeAsphaltTexture() {
  return canvasTexture(512, (ctx, s) => {
    ctx.fillStyle = "#323b49";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 60; i++)
      wrappedDot(ctx, s, rand(0, s), rand(0, s), rand(18, 60), "rgba(8,12,20,0.22)");
    for (let i = 0; i < 9000; i++) {
      const g = Math.floor(rand(40, 110));
      wrappedDot(ctx, s, rand(0, s), rand(0, s), rand(0.4, 1.2), `rgba(${g},${g + 4},${g + 12},0.5)`);
    }
    for (let i = 0; i < 1100; i++)
      wrappedDot(ctx, s, rand(0, s), rand(0, s), rand(0.6, 1.6), "rgba(220,236,250,0.55)");
  });
}

function makeRadialTexture(inner = "rgba(255,255,255,1)", mid = "rgba(255,255,255,0.35)") {
  const t = canvasTexture(128, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, inner);
    g.addColorStop(0.35, mid);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

function makeBeamAlpha() {
  const t = canvasTexture(
    8,
    (ctx, s) => {
      const g = ctx.createLinearGradient(0, 0, 0, s);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(1, "#000000");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);
    },
    { color: false },
  );
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

function makeDecalTexture(lines) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 256;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#eef2f7";
  ctx.fillRect(0, 0, 1024, 256);
  ctx.fillStyle = "#f97316";
  ctx.fillRect(0, 196, 1024, 36);
  ctx.fillStyle = "#0f172a";
  ctx.textAlign = "center";
  ctx.font = "800 92px 'Barlow Condensed', 'Arial Narrow', sans-serif";
  ctx.fillText(lines[0], 512, 110);
  ctx.font = "700 46px 'Barlow Condensed', 'Arial Narrow', sans-serif";
  ctx.fillStyle = "#0284c7";
  ctx.fillText(lines[1], 512, 172);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function scaleUV(geo, sx, sy) {
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * sx, uv.getY(i) * sy);
  return geo;
}

function colored(geo, hex) {
  const c = new THREE.Color(hex);
  const n = geo.attributes.position.count;
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) arr.set([c.r, c.g, c.b], i * 3);
  geo.setAttribute("color", new THREE.BufferAttribute(arr, 3));
  return geo;
}

function lumpy(source, amount) {
  const geo = mergeVertices(source);
  source.dispose();
  const p = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = Math.sin(v.x * 7.1) * Math.cos(v.y * 5.3) * Math.sin(v.z * 6.7);
    v.multiplyScalar(1 + n * amount);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

function makeTreeGeometry() {
  const parts = [colored(new THREE.CylinderGeometry(0.12, 0.17, 0.9, 6).translate(0, 0.45, 0), "#3b2a1e")];
  const tiers = [
    [1.45, 1.7, 1.45],
    [1.12, 1.45, 2.35],
    [0.78, 1.25, 3.15],
  ];
  for (const [r, h, y] of tiers) {
    parts.push(colored(new THREE.ConeGeometry(r, h, 9).translate(0, y, 0), "#173a2f"));
    parts.push(colored(new THREE.ConeGeometry(r * 0.78, h * 0.42, 9).translate(0, y + h * 0.3, 0), "#f1f5f9"));
  }
  return mergeGeometries(parts.map((g) => g.toNonIndexed()));
}

export function createPlowScene(canvas, { reducedMotion = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  const mobile = window.matchMedia("(max-width: 768px)").matches;
  const maxRatio = Math.min(window.devicePixelRatio, mobile ? 1.5 : 1.5);
  let ratio = maxRatio;
  renderer.setPixelRatio(ratio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.localClippingEnabled = true;

  const scene = new THREE.Scene();
  scene.background = SKY;
  scene.fog = new THREE.FogExp2(SKY, 0.022);
  const world = new THREE.Group();
  scene.add(world);

  // The truck drives left to right. The cleared lane and near snowbank are revealed behind the blade
  // with clipping planes whose constants follow the blade each frame.
  let tx = 0;
  let bx = BLADE_X;
  const laneClip = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);
  const aheadClip = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
  const bankClip = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 220);
  const camTarget = new THREE.Vector3();
  const camBase = new THREE.Vector3();
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };

  const disposables = [];
  const track = (...items) => (disposables.push(...items), items[0]);

  // ---------- Lights ----------
  world.add(new THREE.HemisphereLight("#7c9cd2", "#1e2a3e", 1.5));
  const moon = new THREE.DirectionalLight("#a9c1ee", 1.3);
  moon.position.set(-8, 16, 10);
  moon.castShadow = true;
  moon.shadow.mapSize.set(1024, 1024);
  Object.assign(moon.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 40 });
  moon.shadow.bias = -0.0015;
  world.add(moon, moon.target);
  const fill = new THREE.DirectionalLight("#bcd0f0", 0.7);
  fill.position.set(6, 7, 14);
  world.add(fill);

  // ---------- Textures & materials ----------
  const snowTex = track(makeSnowTexture());
  const bankTex = track(snowTex.clone());
  bankTex.needsUpdate = true;
  const asphaltTex = track(makeAsphaltTexture());
  const flakeTex = track(makeRadialTexture());
  const glowTex = track(makeRadialTexture("rgba(255,255,255,1)", "rgba(255,255,255,0.18)"));
  const beamAlpha = track(makeBeamAlpha());

  const snowMat = track(new THREE.MeshStandardMaterial({ map: snowTex, roughness: 0.95 }));
  const snowAheadMat = track(new THREE.MeshStandardMaterial({ map: snowTex, roughness: 0.95, clippingPlanes: [aheadClip] }));
  const bankMat = track(new THREE.MeshStandardMaterial({ map: bankTex, roughness: 0.95, transparent: true, clippingPlanes: [bankClip] }));
  const farBankMat = track(new THREE.MeshStandardMaterial({ map: bankTex, roughness: 0.95 }));
  const pileMat = track(new THREE.MeshStandardMaterial({ color: "#f5f8fc", emissive: "#223350", emissiveIntensity: 0.35, roughness: 1 }));
  const asphaltMat = track(new THREE.MeshStandardMaterial({
    map: asphaltTex, roughness: 0.38, metalness: 0.25, transparent: true, clippingPlanes: [laneClip],
    polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1,
  }));

  // ---------- Ground ----------
  const addPlane = (w, d, x, y, z, mat) => {
    const g = track(scaleUV(new THREE.PlaneGeometry(w, d), w / TILE, d / TILE));
    const m = new THREE.Mesh(g, mat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, y, z);
    m.receiveShadow = true;
    world.add(m);
    return m;
  };
  const SNOW_Y = 0.22;
  addPlane(220, 70, 0, SNOW_Y, LANE + 35, snowMat);
  addPlane(220, 70, 0, SNOW_Y, -(LANE + 35), snowMat);
  addPlane(220, LANE * 2, 0, SNOW_Y, 0, snowAheadMat);
  addPlane(220, LANE * 2, 0, 0, 0, snowMat);
  addPlane(220, LANE * 2, 0, 0.01, 0, asphaltMat);

  const addBank = (radius, z, sx, sy, material, withCap) => {
    const len = 220;
    const g = new THREE.CylinderGeometry(radius, radius, len, 22, 1);
    g.rotateZ(Math.PI / 2);
    scaleUV(g, (2 * Math.PI * radius) / TILE, len / TILE);
    track(g);
    const m = new THREE.Mesh(g, material);
    m.position.set(0, 0, z);
    m.scale.set(1, sy, sx);
    m.receiveShadow = true;
    world.add(m);
    if (!withCap) return null;
    const cap = new THREE.Mesh(track(new THREE.SphereGeometry(radius, 20, 12)), material);
    cap.scale.set(1.6, sy, sx);
    cap.position.z = z;
    world.add(cap);
    return cap;
  };
  const nearCap = addBank(0.7, LANE + 0.55, 1.4, 0.55, bankMat, true);
  addBank(0.45, -(LANE + 0.25), 1.2, 0.8, farBankMat, false);

  // ---------- Truck ----------
  const truck = new THREE.Group();
  world.add(truck);
  const mat = (color, opts = {}) => track(new THREE.MeshStandardMaterial({ color, roughness: 0.55, ...opts }));
  const box = (w, h, d, material, x, y, z) => {
    const m = new THREE.Mesh(track(new THREE.BoxGeometry(w, h, d)), material);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    truck.add(m);
    return m;
  };

  const white = mat("#e9eef4", { roughness: 0.35, metalness: 0.2 });
  const dark = mat("#161c26", { roughness: 0.8 });
  const steel = mat("#5b6778", { roughness: 0.45, metalness: 0.6 });
  const glass = mat("#0a1220", { roughness: 0.08, metalness: 0.9 });
  const orange = mat("#f97316", { roughness: 0.4, metalness: 0.35 });

  box(4.3, 0.36, 1.72, dark, -0.1, 0.74, 0);
  box(1.4, 1.32, 1.9, white, 0.6, 1.52, 0);
  box(0.78, 0.66, 1.82, white, 1.68, 1.12, 0);
  box(0.06, 0.56, 1.72, glass, 1.31, 1.8, 0);
  box(0.92, 0.5, 0.03, glass, 0.62, 1.82, 0.955);
  box(0.92, 0.5, 0.03, glass, 0.62, 1.82, -0.955);
  box(0.05, 0.4, 1.3, dark, 2.08, 1.08, 0);
  box(0.12, 0.22, 1.9, dark, 2.1, 0.78, 0);
  box(1.95, 1.02, 1.76, steel, -1.18, 1.44, 0);
  box(1.86, 0.08, 1.66, mat("#dbe6f1", { roughness: 1 }), -1.18, 1.96, 0);
  box(0.3, 0.1, 1.45, dark, 0.6, 2.24, 0);

  const doorDecal = track(makeDecalTexture(["SNOW REMOVAL CANADA", "24/7 DISPATCH · 1-800-SNOW-CAN"]));
  const decal = new THREE.Mesh(
    track(new THREE.PlaneGeometry(1.95, 0.49)),
    track(new THREE.MeshStandardMaterial({ map: doorDecal, roughness: 0.6 })),
  );
  decal.position.set(-1.18, 1.44, 0.885);
  truck.add(decal);
  const doorStripe = new THREE.Mesh(track(new THREE.PlaneGeometry(1.36, 0.1)), orange);
  doorStripe.position.set(0.6, 1.18, 0.956);
  truck.add(doorStripe);

  const lampMat = track(new THREE.MeshStandardMaterial({ color: "#fff6e0", emissive: "#fff1cf", emissiveIntensity: 6 }));
  for (const z of [0.68, -0.68]) box(0.05, 0.16, 0.32, lampMat, 2.09, 1.24, z);

  const beaconMats = [0, 1].map(() =>
    track(new THREE.MeshStandardMaterial({ color: "#ff8a1f", emissive: "#ff7a10", emissiveIntensity: 0 })),
  );
  box(0.26, 0.15, 0.36, beaconMats[0], 0.6, 2.36, 0.5);
  box(0.26, 0.15, 0.36, beaconMats[1], 0.6, 2.36, -0.5);

  const wheels = [];
  const wheelGeo = track(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 22).rotateX(Math.PI / 2));
  const hubGeo = track(new THREE.BoxGeometry(0.5, 0.12, 0.42));
  for (const x of [1.15, -1.35])
    for (const z of [0.9, -0.9]) {
      const w = new THREE.Mesh(wheelGeo, mat("#0d1117", { roughness: 0.9 }));
      w.add(new THREE.Mesh(hubGeo, steel));
      w.position.set(x, 0.5, z);
      w.castShadow = true;
      truck.add(w);
      wheels.push(w);
    }

  const spinner = new THREE.Mesh(track(new THREE.CylinderGeometry(0.26, 0.26, 0.05, 12)), dark);
  spinner.position.set(-2.3, 0.62, 0);
  spinner.add(new THREE.Mesh(track(new THREE.BoxGeometry(0.5, 0.08, 0.06)), steel));
  truck.add(spinner);

  // Curved moldboard blade, concave side facing forward.
  const R = 0.75;
  const bladeGeo = track(new THREE.CylinderGeometry(R, R, 3.9, 28, 1, true, -Math.PI / 2 - 0.9, 1.8).rotateX(-Math.PI / 2));
  const blade = new THREE.Group();
  const board = new THREE.Mesh(bladeGeo, track(new THREE.MeshStandardMaterial({ color: "#f97316", emissive: "#7a2e05", emissiveIntensity: 0.6, roughness: 0.45, metalness: 0.2, side: THREE.DoubleSide })));
  board.castShadow = true;
  blade.add(board);
  const edge = new THREE.Mesh(track(new THREE.BoxGeometry(0.1, 0.08, 3.9)), steel);
  edge.position.set(-0.62 * R + 0.02, -0.58 * R, 0);
  blade.add(edge);
  blade.position.set(BLADE_X + 0.47, 0.6, 0);
  blade.rotation.y = BLADE_YAW;
  truck.add(blade);
  for (const z of [0.55, -0.55]) box(0.95, 0.12, 0.12, steel, 2.35, 0.6, z);

  // Churning snow roll in front of the blade.
  const pile = [];
  const pileGeo = track(lumpy(new THREE.IcosahedronGeometry(0.5, 4), 0.24));
  for (let i = 0; i < 9; i++) {
    const z = -1.75 + (i / 8) * 3.3;
    const m = new THREE.Mesh(pileGeo, pileMat);
    const s = (0.4 + (i / 8) * 0.45) * (i % 2 ? 0.8 : 1.15);
    m.userData = { baseX: BLADE_X + 0.05 + (i % 3) * 0.12 - z * Math.tan(-BLADE_YAW), baseY: 0.14 + s * 0.16, z, s, phase: i * 1.7 };
    m.rotation.set(rand(0, 6), rand(0, 6), rand(0, 6));
    m.scale.setScalar(s);
    m.castShadow = true;
    world.add(m);
    pile.push(m);
  }

  // ---------- Truck lights ----------
  const headlights = [];
  const beamMat = track(new THREE.MeshBasicMaterial({
    color: "#fff1d2", alphaMap: beamAlpha, transparent: true, opacity: 0.07,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  }));
  const beamGeo = track(new THREE.ConeGeometry(2.2, 11, 32, 1, true).rotateZ(Math.PI / 2));
  const head = new THREE.SpotLight("#fff1d0", 55, 30, 0.5, 0.8, 1.5);
  head.position.set(2.1, 1.3, 0);
  head.target.position.set(14, 0, 0);
  truck.add(head, head.target);
  headlights.push(head);
  const glowSprite = (color, scale, opacity) => {
    const m = track(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false }));
    const sp = new THREE.Sprite(m);
    sp.scale.setScalar(scale);
    return sp;
  };
  for (const z of [0.68, -0.68]) {
    const lampGlow = glowSprite("#fff0cc", 1.6, 0.9);
    lampGlow.position.set(2.2, 1.24, z);
    truck.add(lampGlow);
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(2.1 + 5.5, 1.1, z);
    beam.rotation.z = 0.06;
    truck.add(beam);
  }

  const sweep = new THREE.SpotLight("#ff7d1a", 0, 18, 0.3, 0.6, 1.6);
  sweep.position.set(0.6, 2.5, 0);
  truck.add(sweep, sweep.target);
  const beaconSprites = [0.5, -0.5].map((z) => {
    const sp = glowSprite("#ff7a1a", 2.4, 0);
    sp.position.set(0.6, 2.4, z);
    truck.add(sp);
    return sp;
  });

  // ---------- Roadside: pines, streetlights, houses ----------
  const SPAN = 116;
  const MIN_X = -50;

  const treeGeo = track(makeTreeGeometry());
  const treeMat = track(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 }));
  const TREE_COUNT = mobile ? 34 : 52;
  const trees = new THREE.InstancedMesh(treeGeo, treeMat, TREE_COUNT);
  const treeData = Array.from({ length: TREE_COUNT }, (_, i) => {
    return {
      x: rand(MIN_X, MIN_X + SPAN),
      z: -rand(7, 26),
      s: rand(0.8, 1.7),
      r: rand(0, Math.PI * 2),
    };
  });
  world.add(trees);
  const dummy = new THREE.Object3D();
  const layoutTrees = () => {
    treeData.forEach((t, i) => {
      dummy.position.set(t.x, SNOW_Y - 0.05, t.z);
      dummy.scale.setScalar(t.s);
      dummy.rotation.y = t.r;
      dummy.updateMatrix();
      trees.setMatrixAt(i, dummy.matrix);
    });
    trees.instanceMatrix.needsUpdate = true;
  };

  const lampHeadMat = track(new THREE.MeshStandardMaterial({ color: "#ffe2b0", emissive: "#ffc46b", emissiveIntensity: 5 }));
  const poleMat = mat("#2b3442", { metalness: 0.5 });
  const poolMat = track(new THREE.MeshBasicMaterial({ map: glowTex, color: "#ffb55e", transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
  const haloMat = track(new THREE.SpriteMaterial({ map: glowTex, color: "#ffc27a", transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
  for (let i = 0; i < 7; i++) {
    const g = new THREE.Group();
    const pole = new THREE.Mesh(track(new THREE.CylinderGeometry(0.06, 0.09, 5.4, 8)), poleMat);
    pole.position.y = 2.7;
    const arm = new THREE.Mesh(track(new THREE.BoxGeometry(0.07, 0.07, 1.3)), poleMat);
    arm.position.set(0, 5.3, 0.6);
    const head = new THREE.Mesh(track(new THREE.BoxGeometry(0.28, 0.12, 0.5)), lampHeadMat);
    head.position.set(0, 5.22, 1.2);
    const halo = new THREE.Sprite(haloMat);
    halo.position.set(0, 5.1, 1.2);
    halo.scale.setScalar(2.6);
    const pool = new THREE.Mesh(track(new THREE.PlaneGeometry(7, 7)), poolMat);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(0, SNOW_Y + 0.015, 0.9);
    g.add(pole, arm, head, halo, pool);
    g.position.set(MIN_X + i * (SPAN / 7), SNOW_Y, -(LANE + 3.4));
    world.add(g);
  }

  const roofMat = mat("#eaf0f7", { roughness: 1 });
  const winMat = track(new THREE.MeshStandardMaterial({ color: "#ffd9a0", emissive: "#ffb85c", emissiveIntensity: 2.6 }));
  const houseColors = ["#394559", "#4a3f3b", "#34463f", "#3e3a52", "#4b4a46"];
  for (let i = 0; i < 8; i++) {
    const g = new THREE.Group();
    const w = rand(4, 5.5);
    const h = rand(2.4, 3.2);
    const body = new THREE.Mesh(track(new THREE.BoxGeometry(w, h, 4)), mat(houseColors[i % houseColors.length], { roughness: 0.85 }));
    body.position.y = h / 2;
    const r = (w / Math.sqrt(3)) * 1.12;
    const roof = new THREE.Mesh(track(new THREE.CylinderGeometry(r, r, 4.5, 3).rotateX(-Math.PI / 2)), roofMat);
    roof.scale.y = 0.5;
    roof.position.y = h + r * 0.25;
    g.add(body, roof);
    for (const wx of [-w * 0.28, w * 0.28]) {
      if (Math.random() < 0.25) continue;
      const win = new THREE.Mesh(track(new THREE.PlaneGeometry(0.75, 0.75)), winMat);
      win.position.set(wx, h * 0.55, 2.01);
      g.add(win);
    }
    g.position.set(MIN_X + i * (SPAN / 8) + rand(-2, 2), SNOW_Y, -rand(16, 22));
    world.add(g);
  }

  // ---------- Particles ----------
  const pointsMat = (size, color, opacity = 1) =>
    track(new THREE.PointsMaterial({ size, map: flakeTex, color, transparent: true, opacity, depthWrite: false, sizeAttenuation: true }));

  const FLAKES = mobile ? 2200 : 5000;
  const flakePos = new Float32Array(FLAKES * 3);
  const flakeVel = new Float32Array(FLAKES * 2);
  for (let i = 0; i < FLAKES; i++) {
    flakePos.set([rand(-40, 40), rand(0, 22), rand(-26, 15)], i * 3);
    flakeVel[i * 2] = rand(0.9, 2);
    flakeVel[i * 2 + 1] = rand(0, Math.PI * 2);
  }
  const flakeGeo = track(new THREE.BufferGeometry());
  flakeGeo.setAttribute("position", new THREE.BufferAttribute(flakePos, 3));
  const snowfall = new THREE.Points(flakeGeo, pointsMat(0.13, "#f4f8ff", 0.9));
  snowfall.frustumCulled = false;
  world.add(snowfall);

  const makePool = (count, size, color) => {
    const pos = new Float32Array(count * 3).fill(-999);
    const vel = new Float32Array(count * 3);
    const life = new Float32Array(count).fill(-1);
    const geo = track(new THREE.BufferGeometry());
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(geo, pointsMat(size, color));
    pts.frustumCulled = false;
    world.add(pts);
    return { count, pos, vel, life, geo, cursor: 0, carry: 0 };
  };
  const spray = makePool(mobile ? 500 : 900, 0.11, "#eef4fb");
  const salt = makePool(360, 0.055, "#cfe6ff");

  const emit = (pool, n, init) => {
    for (let k = 0; k < n; k++) {
      const i = pool.cursor;
      pool.cursor = (pool.cursor + 1) % pool.count;
      init(pool.pos, pool.vel, i * 3);
      pool.life[i] = 0;
    }
  };

  const stepPool = (pool, dt, landY, onLand) => {
    const { pos, vel, life } = pool;
    for (let i = 0; i < pool.count; i++) {
      if (life[i] < 0) continue;
      const j = i * 3;
      life[i] += dt;
      vel[j + 1] -= 9.8 * dt;
      pos[j] += vel[j] * dt;
      pos[j + 1] += vel[j + 1] * dt;
      pos[j + 2] += vel[j + 2] * dt;
      const floor = landY(pos[j], pos[j + 2]);
      if (pos[j + 1] < floor) {
        pos[j + 1] = floor;
        vel[j] = 0;
        vel[j + 1] = 0;
        vel[j + 2] = 0;
        onLand?.(i);
      }
      if (life[i] > 2.4) {
        life[i] = -1;
        pos[j + 1] = -999;
      }
    }
    pool.geo.attributes.position.needsUpdate = true;
  };

  const groundAt = (x, z) => {
    if (z > LANE + 0.1 && x < bx) return 0.5;
    if (z < -(LANE + 0.1)) return 0.45;
    if (x < bx && Math.abs(z) <= LANE) return 0.03;
    return SNOW_Y + 0.02;
  };

  // ---------- Layout ----------
  let width = 1;
  let height = 1;
  let startX = -12;
  let endX = 12;
  const resize = () => {
    const parent = canvas.parentElement;
    width = parent.clientWidth || 1;
    height = parent.clientHeight || 1;
    const aspect = width / height;
    renderer.setSize(width, height, false);
    camera.aspect = aspect;
    if (aspect < 1.05) {
      camera.fov = 50;
      camBase.set(0, 6.5, 15);
      camTarget.set(0, 5.4, 0);
    } else {
      camera.fov = 38;
      camBase.set(0, 8, 17);
      camTarget.set(0, 5.1, 0);
    }
    camera.updateProjectionMatrix();
    // Enter fully off-screen left, exit fully off-screen right.
    const halfW = camBase.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect;
    startX = -halfW - 4.5;
    endX = halfW + 3.5;
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);
  resize();

  const onPointer = (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  // ---------- Update ----------
  let t = 0;
  let refill = -1;
  const update = (dt) => {
    t += dt;
    const driving = refill < 0;
    const move = driving ? SPEED * dt : 0;
    if (driving) {
      tx += move;
      if (tx > endX) refill = 0;
    } else {
      // Fresh snow settles over the cleared lane, then the next pass begins.
      refill += dt;
      const fade = Math.max(0, 1 - refill / 1.4);
      asphaltMat.opacity = fade;
      bankMat.opacity = fade;
      if (refill > 1.7) {
        refill = -1;
        tx = startX;
        asphaltMat.opacity = 1;
        bankMat.opacity = 1;
      }
    }
    truck.position.x = tx;
    bx = tx + BLADE_X;
    laneClip.constant = bx;
    aheadClip.constant = -bx;
    bankClip.constant = bx - 0.4;
    nearCap.position.x = bx - 0.4;
    moon.position.set(tx - 8, 16, 10);
    moon.target.position.set(tx, 0, 0);

    for (const w of wheels) w.rotation.z -= move / 0.5;
    spinner.rotation.y += dt * 18;
    truck.position.y = Math.sin(t * 21) * 0.012;
    truck.rotation.x = Math.sin(t * 2.3) * 0.004;

    const flashA = Math.max(0, Math.sin(t * 9)) ** 3;
    const flashB = Math.max(0, Math.sin(t * 9 + Math.PI)) ** 3;
    beaconMats[0].emissiveIntensity = 1 + flashA * 14;
    beaconMats[1].emissiveIntensity = 1 + flashB * 14;
    beaconSprites[0].material.opacity = 0.15 + flashA * 0.85;
    beaconSprites[1].material.opacity = 0.15 + flashB * 0.85;
    const a = t * 3.2;
    sweep.target.position.set(0.6 + Math.cos(a) * 7, 0, Math.sin(a) * 7);
    sweep.intensity = 38 + Math.sin(a) * 12;

    for (const m of pile) {
      const { baseX, baseY, z, s, phase } = m.userData;
      m.position.set(tx + baseX + Math.sin(t * 5 + phase) * 0.05, baseY + Math.abs(Math.sin(t * 7 + phase)) * 0.06, z);
      m.rotation.z -= dt * 2.4;
      m.rotation.x += dt * 0.7;
      const k = s * (1 + Math.sin(t * 6 + phase) * 0.04);
      m.scale.set(k * 1.1, k * 0.7, k);
    }

    for (let i = 0; i < FLAKES; i++) {
      const j = i * 3;
      flakePos[j] += dt * 0.5;
      flakePos[j + 1] -= flakeVel[i * 2] * dt;
      flakePos[j + 2] += Math.sin(t * 0.9 + flakeVel[i * 2 + 1]) * 0.35 * dt;
      if (flakePos[j + 1] < 0) flakePos[j + 1] += 22;
      if (flakePos[j] > 40) flakePos[j] -= 80;
    }
    flakeGeo.attributes.position.needsUpdate = true;

    spray.carry += driving ? dt * (mobile ? 180 : 320) : 0;
    const nSpray = Math.floor(spray.carry);
    spray.carry -= nSpray;
    emit(spray, nSpray, (p, v, j) => {
      const along = Math.random() ** 0.6;
      const z = -1.4 + along * 3.3;
      p[j] = bx + 0.1 - z * 0.3 + rand(-0.1, 0.2);
      p[j + 1] = 0.9 + rand(0, 0.35);
      p[j + 2] = z;
      v[j] = SPEED * 0.6 + rand(-1.2, 0.8);
      v[j + 1] = rand(1.8, 4.2) * (0.5 + along * 0.7);
      v[j + 2] = rand(1.5, 4.2) * (0.3 + along);
    });
    stepPool(spray, dt, groundAt);

    salt.carry += driving ? dt * 140 : 0;
    const nSalt = Math.floor(salt.carry);
    salt.carry -= nSalt;
    emit(salt, nSalt, (p, v, j) => {
      const ang = rand(Math.PI * 0.55, Math.PI * 1.45);
      const sp = rand(2, 4.5);
      p[j] = tx - 2.3;
      p[j + 1] = 0.6;
      p[j + 2] = 0;
      v[j] = SPEED + Math.cos(ang) * sp;
      v[j + 1] = rand(0.3, 1.2);
      v[j + 2] = Math.sin(ang) * sp;
    });
    stepPool(salt, dt, groundAt);

    pointer.sx += (pointer.x - pointer.sx) * Math.min(1, dt * 2.5);
    pointer.sy += (pointer.y - pointer.sy) * Math.min(1, dt * 2.5);
    camera.position.set(
      camBase.x + pointer.sx * 0.9,
      camBase.y - pointer.sy * 0.5 + Math.sin(t * 0.5) * 0.08,
      camBase.z + Math.sin(t * 0.3) * 0.15,
    );
    camera.lookAt(camTarget);
  };

  // ---------- Loop ----------
  let last = 0;
  let raf = 0;
  let running = false;
  // Adaptive resolution: trade sharpness for a smooth frame rate on weaker GPUs.
  let sampleTime = 0;
  let sampleFrames = 0;
  const adapt = (dt) => {
    sampleTime += dt;
    sampleFrames++;
    if (sampleTime < 1) return;
    const fps = sampleFrames / sampleTime;
    sampleTime = 0;
    sampleFrames = 0;
    const next = fps < 45 ? Math.max(0.8, ratio - 0.1) : fps > 57 ? Math.min(maxRatio, ratio + 0.1) : ratio;
    if (Math.abs(next - ratio) > 0.01) {
      ratio = next;
      renderer.setPixelRatio(ratio);
      renderer.setSize(width, height, false);
    }
  };
  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const dt = last ? (now - last) / 1000 : 1 / 60;
    last = now;
    update(Math.min(dt, 1 / 20));
    adapt(dt);
    renderer.render(scene, camera);
  };

  layoutTrees();
  // Start mid-pass so the very first frame already shows the plow and a cleared lane.
  tx = startX + (endX - startX) * 0.42;
  // Warm up so spray, salt and the first frame look mid-action.
  for (let i = 0; i < 90; i++) update(1 / 60);
  renderer.render(scene, camera);

  return {
    setActive(active) {
      if (reducedMotion || active === running) return;
      running = active;
      if (active) {
        last = 0;
        raf = requestAnimationFrame(frame);
      } else cancelAnimationFrame(raf);
    },
    dispose() {
      cancelAnimationFrame(raf);
      running = false;
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      disposables.forEach((d) => d.dispose?.());
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
