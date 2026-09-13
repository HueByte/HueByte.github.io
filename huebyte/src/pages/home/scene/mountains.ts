import * as THREE from "three";
import { NOISE_GLSL, type SceneObject, type SharedUniforms } from "./shaders";

export interface Ridge {
  z: number;
  minHeight: number;
  maxHeight: number;
  base: string;
  glow: string;
  seed: number;
}

// Two layers of low hills at the horizon: a hazier far one, a nearer darker one.
export const RIDGES: readonly Ridge[] = [
  { z: -250, minHeight: 14, maxHeight: 40, base: "#0f1c30", glow: "#5e441c", seed: 3 },
  { z: -200, minHeight: 6, maxHeight: 24, base: "#0a1424", glow: "#7a5620", seed: 11 },
];

const WIDTH = 1000;
const SEGMENTS = 220;
export const FLOOR = -12;

function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function valueNoise(x: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return hash(i) * (1 - u) + hash(i + 1) * u;
}

/** 0..1 ridge line: broad hills with sharper peaks folded in. */
function ridge(x: number, seed: number): number {
  const broad = valueNoise(x * 0.008 + seed * 17.3);
  const mid = valueNoise(x * 0.02 + seed * 5.1);
  const peaks = 1 - Math.abs(2 * valueNoise(x * 0.05 + seed * 9.7) - 1);
  return 0.5 * broad + 0.3 * mid + 0.2 * peaks;
}

/** World-space height of a ridge's crest at x. Used to plant the far grass on it. */
export function ridgeTop(x: number, layer: Ridge): number {
  return layer.minHeight + ridge(x, layer.seed) * (layer.maxHeight - layer.minHeight);
}

const vertexShader = /* glsl */ `
attribute float aT;
varying float vT;
varying vec3 vWorld;

void main() {
  vT = aT;
  vWorld = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Hillsides read as grass-covered from afar: vertical noise streaks that glow toward the crest.
const fragmentShader = /* glsl */ `
uniform float uTime;
uniform vec3 uBase;
uniform vec3 uGlow;
varying float vT;
varying vec3 vWorld;

${NOISE_GLSL}

void main() {
  float streak = 0.5 + 0.5 * snoise(vec2(vWorld.x * 0.22, vWorld.y * 0.05 + uTime * 0.04));
  float fine = 0.5 + 0.5 * snoise(vec2(vWorld.x * 0.9 + 7.0, vWorld.y * 0.12));
  float cover = pow(vT, 3.0) * (0.5 + 0.35 * streak + 0.15 * fine);
  vec3 col = mix(uBase, uGlow, cover);
  gl_FragColor = vec4(col, 1.0);
}
`;

function buildRidge(layer: Ridge): THREE.BufferGeometry {
  const columns = SEGMENTS + 1;
  const positions = new Float32Array(columns * 2 * 3);
  const t = new Float32Array(columns * 2);
  const indices: number[] = [];

  for (let i = 0; i < columns; i++) {
    const x = (i / SEGMENTS - 0.5) * WIDTH;
    const h = ridgeTop(x, layer);

    // vertex 2i: crest, vertex 2i+1: floor
    positions.set([x, h, layer.z], i * 6);
    positions.set([x, FLOOR, layer.z], i * 6 + 3);
    t[i * 2] = 1;
    t[i * 2 + 1] = 0;

    if (i < SEGMENTS) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aT", new THREE.BufferAttribute(t, 1));
  geometry.setIndex(indices);
  return geometry;
}

export function createMountains(shared: SharedUniforms): SceneObject {
  const group = new THREE.Group();
  const owned: { dispose(): void }[] = [];

  for (const layer of RIDGES) {
    const geometry = buildRidge(layer);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: shared.uTime,
        uBase: { value: new THREE.Color(layer.base) },
        uGlow: { value: new THREE.Color(layer.glow) },
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
    });
    group.add(new THREE.Mesh(geometry, material));
    owned.push(geometry, material);
  }

  return {
    object: group,
    dispose() {
      owned.forEach((o) => o.dispose());
    },
  };
}
