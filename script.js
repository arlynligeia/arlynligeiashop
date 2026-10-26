import * as THREE from 'three';

// ---------- Dimensiones de la cámara (unidades ≈ metros) ----------
const W = 8, H = 5, L = 24;
const hw = W / 2, hl = L / 2, EYE = 1.7;
const DOOR_Z = -4;

// ---------- Escena, cámara y renderer ----------
const host = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
host.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07031a);
scene.fog = new THREE.FogExp2(0x07031a, 0.04);

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 60);
camera.rotation.order = 'YXZ';

function resize() {
  const w = host.clientWidth, h = host.clientHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(host);

// ---------- Grupos (capas activables) ----------
const layers = {
  panels: new THREE.Group(),
  door: new THREE.Group(),
  floor: new THREE.Group(),
  led: new THREE.Group(),
};
Object.values(layers).forEach(g => scene.add(g));

// ---------- Paneles acústicos (pirámides instanciadas) ----------
const S = 0.354;
const pyr = new THREE.ConeGeometry(0.25, 0.35, 4, 1, true);
pyr.rotateY(Math.PI / 4);
pyr.translate(0, 0.175, 0);
const foam = new THREE.MeshStandardMaterial({ roughness: 0.55, flatShading: true });
const palette = [0x2b1a8a, 0x4a1fa8, 0x7a24c8, 0x1d3fa0, 0x3a0f70].map(c => new THREE.Color(c));

function panel(origin, u, v, lenU, lenV, normal, skip) {
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
  const pts = [];
  for (let i = 0; i < Math.floor(lenU / S); i++) {
    for (let j = 0; j < Math.floor(lenV / S); j++) {
      const p = origin.clone().addScaledVector(u, (i + 0.5) * S).addScaledVector(v, (j + 0.5) * S);
      if (!skip || !skip(p)) pts.push(p);
    }
  }
  const mesh = new THREE.InstancedMesh(pyr, foam, pts.length);
  const m = new THREE.Matrix4();
  pts.forEach((p, i) => {
    m.compose(p, q, new THREE.Vector3(1, 1, 1));
    mesh.setMatrixAt(i, m);
    mesh.setColorAt(i, palette[(Math.random() * palette.length) | 0]);
  });
  layers.panels.add(mesh);
}

const X = new THREE.Vector3(1, 0, 0), Y = new THREE.Vector3(0, 1, 0), Z = new THREE.Vector3(0, 0, 1);
const doorSkip = p => Math.abs(p.z - DOOR_Z) < 1.05 && p.y < 2.9;
panel(new THREE.Vector3(-hw, 0, -hl), Z, Y, L, H, X);                            // pared izquierda
panel(new THREE.Vector3(hw, 0, -hl), Z, Y, L, H, X.clone().negate(), doorSkip);  // pared derecha
panel(new THREE.Vector3(-hw, 0, -hl), X, Y, W, H, Z);                            // pared del fondo
panel(new THREE.Vector3(-hw, 0, hl), X, Y, W, H, Z.clone().negate());            // pared trasera
panel(new THREE.Vector3(-hw, H, -hl), X, Z, W, L, Y.clone().negate());           // techo

// ---------- Suelo ----------
const c = document.createElement('canvas');
c.width = c.height = 256;
const g = c.getContext('2d');
g.fillStyle = '#0c0a2e'; g.fillRect(0, 0, 256, 256);
g.strokeStyle = '#5b3fd6'; g.lineWidth = 6; g.strokeRect(0, 0, 256, 256);
const tex = new THREE.CanvasTexture(c);
tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
tex.repeat.set(W / 0.6, L / 0.6);
tex.anisotropy = 8;
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(W, L),
  new THREE.MeshStandardMaterial({ map: tex, metalness: 0.7, roughness: 0.35, color: 0xa090ff })
);
floor.rotation.x = -Math.PI / 2;
layers.floor.add(floor);

// ---------- Luces LED ----------
const neon = (hex) => new THREE.MeshBasicMaterial({ color: hex });
const MAG = 0xff2bd6, CYA = 0x19d9ff;
for (let i = 0; i < 5; i++) {
  for (const side of [-1, 1]) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 2.6), neon((i + (side > 0 ? 1 : 0)) % 2 ? CYA : MAG));
    strip.position.set(side * 2.3, H - 0.37, -10 + i * 4.8);
    layers.led.add(strip);
  }
}
for (const side of [-1, 1]) {
  const edge = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, L - 1), neon(CYA));
  edge.position.set(side * (hw - 0.45), 0.02, 0);
  layers.led.add(edge);
}
const baseGlow = new THREE.Mesh(new THREE.BoxGeometry(W - 1, 0.03, 0.06), neon(CYA));
baseGlow.position.set(0, 0.02, -hl + 0.45);
layers.led.add(baseGlow);

// Luces reales que tiñen los paneles
scene.add(new THREE.AmbientLight(0x3a2a80, 0.9));
[-10, -4, 2, 8].forEach((z, i) => {
  const l = new THREE.PointLight(i % 2 ? CYA : MAG, 28, 14, 2);
  l.position.set(0, H - 0.8, z);
  layers.led.add(l);
});
const doorLight = new THREE.PointLight(MAG, 18, 8, 2);
doorLight.position.set(hw - 1, 1.6, DOOR_Z);
layers.door.add(doorLight);

// ---------- Puerta ----------
const dx = hw - 0.12;
const door = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.5, 1.4), new THREE.MeshStandardMaterial({ color: 0x15113f, metalness: 0.6, roughness: 0.4 }));
door.position.set(dx + 0.03, 1.25, DOOR_Z);
layers.door.add(door);
const bar = (w, h, d, x, y, z, hex) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), neon(hex));
  m.position.set(x, y, z);
  layers.door.add(m);
};
bar(0.06, 2.56, 0.06, dx, 1.28, DOOR_Z - 0.75, MAG);
bar(0.06, 2.56, 0.06, dx, 1.28, DOOR_Z + 0.75, MAG);
bar(0.06, 0.06, 1.56, dx, 2.56, DOOR_Z, MAG);
bar(0.06, 0.5, 0.06, dx - 0.04, 1.2, DOOR_Z + 0.5, CYA); // manija

// ---------- Controles ----------
const start = { x: 0, z: 10, yaw: 0, pitch: 0 };
let pos = { ...start };
const keys = {};
addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'Escape') reset();
  if (e.code.startsWith('Arrow')) e.preventDefault();
});
addEventListener('keyup', e => { keys[e.code] = false; });

document.querySelectorAll('[data-key]').forEach(b => {
  const k = b.dataset.key;
  b.addEventListener('pointerdown', () => { keys[k] = true; b.classList.add('down'); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev =>
    b.addEventListener(ev, () => { keys[k] = false; b.classList.remove('down'); }));
});
document.getElementById('esc').addEventListener('click', reset);

function reset() { pos = { ...start }; t0 = performance.now(); }

let drag = null;
host.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY }; host.setPointerCapture(e.pointerId); });
host.addEventListener('pointerup', () => { drag = null; });
host.addEventListener('pointermove', e => {
  if (!drag) return;
  pos.yaw -= (e.clientX - drag.x) * 0.004;
  pos.pitch = Math.max(-1.2, Math.min(1.2, pos.pitch - (e.clientY - drag.y) * 0.004));
  drag = { x: e.clientX, y: e.clientY };
});

// ---------- Capas ----------
document.querySelectorAll('#capas button').forEach(b => {
  b.addEventListener('click', () => {
    b.classList.toggle('on');
    layers[b.dataset.layer].visible = b.classList.contains('on');
  });
});

// ---------- Esquema superior ----------
const map = document.getElementById('mapa');
const mg = map.getContext('2d');
function drawMap() {
  const w = map.width, h = map.height, k = (h - 20) / L;
  const ox = w / 2, oz = h / 2;
  mg.clearRect(0, 0, w, h);
  mg.strokeStyle = '#6a5cff'; mg.lineWidth = 2;
  mg.strokeRect(ox - hw * k, oz - hl * k, W * k, L * k);
  if (layers.panels.visible) { mg.strokeStyle = '#8a4dff55'; mg.lineWidth = 6; mg.strokeRect(ox - hw * k + 4, oz - hl * k + 4, W * k - 8, L * k - 8); }
  if (layers.door.visible) { mg.fillStyle = '#ff2bd6'; mg.fillRect(ox + hw * k - 4, oz + (DOOR_Z - 0.75) * k, 5, 1.5 * k); }
  mg.save();
  mg.translate(ox + pos.x * k, oz + pos.z * k);
  mg.rotate(-pos.yaw);
  mg.fillStyle = '#19d9ff';
  mg.beginPath(); mg.moveTo(0, -7); mg.lineTo(5, 5); mg.lineTo(-5, 5); mg.closePath(); mg.fill();
  mg.restore();
}

// ---------- Bucle principal ----------
const coord = document.getElementById('coord');
const tiempo = document.getElementById('tiempo');
let t0 = performance.now(), last = t0;
const pad = n => String(n).padStart(2, '0');

function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  const f = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0);
  const s = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0);
  const speed = 3.2 * dt;
  pos.x += (-Math.sin(pos.yaw) * f + Math.cos(pos.yaw) * s) * speed;
  pos.z += (-Math.cos(pos.yaw) * f - Math.sin(pos.yaw) * s) * speed;
  pos.x = Math.max(-hw + 0.8, Math.min(hw - 0.8, pos.x));
  pos.z = Math.max(-hl + 0.8, Math.min(hl - 0.8, pos.z));

  camera.position.set(pos.x, EYE, pos.z);
  camera.rotation.set(pos.pitch, pos.yaw, 0);
  renderer.render(scene, camera);

  coord.textContent = `COORD: X: ${pos.x.toFixed(2)} Y: ${EYE.toFixed(2)} Z: ${pos.z.toFixed(2)}`;
  const t = Math.floor((now - t0) / 1000);
  tiempo.textContent = `TIEMPO: ${pad(Math.floor(t / 3600))}:${pad(Math.floor(t / 60) % 60)}:${pad(t % 60)}`;
  drawMap();
  requestAnimationFrame(frame);
}
resize();
requestAnimationFrame(frame);
