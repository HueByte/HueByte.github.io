import * as THREE from "three";
import {
  CAMERA_XZ,
  mulberry32,
  NOISE_GLSL,
  type SceneObject,
  type SharedUniforms,
} from "./shaders";

const DOME_RADIUS = 520;
const STAR_RADIUS = 480;
const MOON_DIRECTION = new THREE.Vector3(0.36, 0.3, -0.88).normalize();
const MOON_SIZE = 62;
// The faint milky-way band runs along the great circle perpendicular to this.
const BAND_NORMAL = new THREE.Vector3(0.6, 0.35, 0.7).normalize();

const domeVertex = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const domeFragment = /* glsl */ `
uniform vec3 uHorizon;
uniform vec3 uZenith;
uniform vec3 uGlow;
uniform vec3 uMilky;
uniform vec3 uBandNormal;
varying vec3 vDir;

${NOISE_GLSL}

void main() {
  vec3 d = normalize(vDir);
  float h = d.y;

  vec3 col = mix(uHorizon, uZenith, smoothstep(-0.02, 0.45, h));
  // Warm band where the glowing field meets the sky.
  col += uGlow * exp(-max(h, 0.0) * 16.0) * 0.6;

  // Faint milky way: a soft band with noisy structure, only above the horizon.
  float band = abs(dot(d, uBandNormal));
  float structure = 0.5 + 0.5 * snoise(d.xz * 14.0 + d.y * 9.0);
  float milky = smoothstep(0.32, 0.0, band) * structure * smoothstep(0.0, 0.2, h);
  col += uMilky * milky * 0.35;

  gl_FragColor = vec4(col, 1.0);
}
`;

const starVertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;
varying float vAlpha;
varying vec3 vColor;

void main() {
  vColor = aColor;
  float twinkle = sin(uTime * (0.6 + aPhase * 1.4) + aPhase * 31.0);
  vAlpha = 0.55 + 0.45 * twinkle;
  gl_PointSize = aSize * uPixelRatio * (0.8 + 0.2 * twinkle);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const starFragment = /* glsl */ `
varying float vAlpha;
varying vec3 vColor;

void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = pow(max(1.0 - d, 0.0), 2.0);
  gl_FragColor = vec4(vColor * vAlpha, a * vAlpha);
}
`;

const moonVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// A burgundy dream moon: slowly flowing marbled bands with luminous veins, a lit rim on
// the upper left and a soft halo. Kept dim enough that it never competes with the field.
const moonFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uDark;
uniform vec3 uBase;
uniform vec3 uRim;
uniform vec3 uGlow;
uniform vec3 uVein;
uniform vec3 uThread;
varying vec2 vUv;

${NOISE_GLSL}

void main() {
  vec2 p = (vUv - 0.5) * 2.0;
  float r = length(p);
  float disc = 1.0 - smoothstep(0.58, 0.6, r);

  // Domain-warped noise: bands that bend and flow like marble or gas clouds.
  // Low frequencies on purpose: the moon is small on screen, fine detail turns to speckle.
  vec2 q = p * 1.5;
  float t = uTime * 0.04;
  float warp = snoise(q * 1.1 + vec2(1.7, t));
  float warp2 = snoise(q * 1.7 + vec2(-4.2 + warp, -t * 0.7));
  vec2 wq = q + vec2(warp, warp2) * 0.8;

  float bands = sin(wq.y * 3.2 + snoise(wq * 1.4) * 2.5);
  float pools = smoothstep(-0.2, 0.6, snoise(wq * 1.0 + 9.0));
  float veins = smoothstep(0.55, 0.95, bands);
  float threads = smoothstep(0.9, 0.99, sin(wq.x * 4.5 + warp * 3.0));

  vec3 body = mix(uDark, uBase, 0.35 + 0.65 * pools);
  body = mix(body, uBase * 1.5, smoothstep(0.0, 0.9, bands) * 0.35);
  body += uVein * veins * 0.55;
  body += uThread * threads * 0.3;

  // Lit from the upper left, darker toward the limb.
  float lit = dot(p / max(r, 0.001), normalize(vec2(-0.6, 0.5)));
  body *= 0.75 + 0.25 * lit;
  body *= 1.0 - smoothstep(0.35, 0.6, r) * 0.4;
  float rim = smoothstep(0.46, 0.6, r) * disc * max(lit, 0.0);
  body += uRim * rim * 0.45;

  float halo = exp(-max(r - 0.6, 0.0) * 4.0) * (1.0 - disc);
  vec3 col = body * disc + uGlow * halo * 0.9;
  float alpha = disc + halo * 0.55;
  gl_FragColor = vec4(col, alpha);
}
`;

const STAR_COLORS = [
  { color: "#ffffff", weight: 0.55 },
  { color: "#cfe3ff", weight: 0.2 },
  { color: "#ffe6b8", weight: 0.15 },
  { color: "#9dffd6", weight: 0.1 }, // a hint of spring green
];

function pickStarColor(r: number): THREE.Color {
  let acc = 0;
  for (const entry of STAR_COLORS) {
    acc += entry.weight;
    if (r <= acc) return new THREE.Color(entry.color);
  }
  return new THREE.Color("#ffffff");
}

function createDome(): SceneObject {
  const geometry = new THREE.SphereGeometry(DOME_RADIUS, 48, 24);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uHorizon: { value: new THREE.Color("#0d1f33") },
      uZenith: { value: new THREE.Color("#02050d") },
      uGlow: { value: new THREE.Color("#2a1c0c") },
      uMilky: { value: new THREE.Color("#264d4d") },
      uBandNormal: { value: BAND_NORMAL },
    },
    vertexShader: domeVertex,
    fragmentShader: domeFragment,
    side: THREE.BackSide,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = -10;
  return {
    object: mesh,
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}

function createStars(count: number, shared: SharedUniforms): SceneObject {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const rand = mulberry32(4242);
  const dir = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    // Uniform direction on the upper hemisphere.
    const u = rand();
    const v = rand();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(1 - v); // 0..90 degrees from the zenith
    dir.set(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta));

    // Some stars crowd toward the milky-way band.
    if (rand() < 0.35) {
      dir.addScaledVector(BAND_NORMAL, -dir.dot(BAND_NORMAL) * (0.7 + rand() * 0.25));
      dir.normalize();
    }
    if (dir.y < 0.02) dir.y = 0.02 + rand() * 0.05;

    dir.normalize().multiplyScalar(STAR_RADIUS);
    positions.set([dir.x, dir.y, dir.z], i * 3);

    const bright = rand();
    sizes[i] = 1.6 + bright * bright * 3.8;
    phases[i] = rand();
    const c = pickStarColor(rand());
    colors.set([c.r, c.g, c.b], i * 3);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.ShaderMaterial({
    uniforms: { uTime: shared.uTime, uPixelRatio: shared.uPixelRatio },
    vertexShader: starVertex,
    fragmentShader: starFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  points.renderOrder = -9;
  return {
    object: points,
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}

function createMoon(shared: SharedUniforms): SceneObject {
  const geometry = new THREE.PlaneGeometry(MOON_SIZE, MOON_SIZE);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: shared.uTime,
      uDark: { value: new THREE.Color("#23081a") },
      uBase: { value: new THREE.Color("#581634") },
      uRim: { value: new THREE.Color("#c62368") },
      uGlow: { value: new THREE.Color("#5a1634") },
      uVein: { value: new THREE.Color("#e2a978") }, // desert-sand veins
      uThread: { value: new THREE.Color("#00fa9a") }, // thin spring-green threads
    },
    vertexShader: moonVertex,
    fragmentShader: moonFragment,
    transparent: true,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(MOON_DIRECTION).multiplyScalar(STAR_RADIUS - 10);
  mesh.lookAt(CAMERA_XZ.x, 0, CAMERA_XZ.z); // face the camera; it barely moves
  mesh.renderOrder = -8;

  return {
    object: mesh,
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}

export function createSky(starCount: number, shared: SharedUniforms): SceneObject {
  const parts = [createDome(), createStars(starCount, shared), createMoon(shared)];
  const group = new THREE.Group();
  for (const part of parts) group.add(part.object);
  return {
    object: group,
    dispose() {
      parts.forEach((p) => p.dispose());
    },
  };
}
