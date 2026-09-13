import * as THREE from "three";
import { mulberry32, NOISE_GLSL, type SceneObject, type SharedUniforms } from "./shaders";

const DOME_RADIUS = 520;
const STAR_RADIUS = 480;
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

/** The night: a gradient dome with a faint milky way, and the stars as particles. */
export function createSky(starCount: number, shared: SharedUniforms): SceneObject {
  const parts = [createDome(), createStars(starCount, shared)];
  const group = new THREE.Group();
  for (const part of parts) group.add(part.object);
  return {
    object: group,
    dispose() {
      parts.forEach((p) => p.dispose());
    },
  };
}
