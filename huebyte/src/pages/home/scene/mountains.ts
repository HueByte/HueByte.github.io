import * as THREE from "three";
import { NOISE_GLSL, type SceneObject, type SharedUniforms } from "./shaders";

interface Ridge {
  z: number;
  minHeight: number;
  maxHeight: number;
  base: string;
  rim: string;
  /** How much the layer dissolves into the warm haze (further = more). */
  haze: number;
  seed: number;
}

// Three rounded layers at the horizon, lighter and hazier the further back they sit.
// Their tones are darker shades of the gold pulse that sweeps across them.
const RIDGES: readonly Ridge[] = [
  { z: -300, minHeight: 16, maxHeight: 44, base: "#4a3616", rim: "#725426", haze: 0.36, seed: 3 },
  { z: -245, minHeight: 10, maxHeight: 30, base: "#382910", rim: "#5c421b", haze: 0.24, seed: 11 },
  { z: -195, minHeight: 5, maxHeight: 18, base: "#281d0b", rim: "#463217", haze: 0.12, seed: 23 },
];

const WIDTH = 1500;
const SEGMENTS = 260;
const FLOOR = -12;
const GLOW_HEIGHT = 22; // how far the light bleeds into the sky above a crest
const FRINGE_HEIGHT = 0.45; // tallest silhouette lobe above the crest: a couple of pixels on screen
const FRINGE_CELL = 1.1; // lobe scale of the silhouette, at the near layer
const GLOW_COLOR = "#c99a3c";

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

/** 0..1 ridge line: long rolling swells with a little variation, no sharp peaks. */
function ridge(x: number, seed: number): number {
  const broad = valueNoise(x * 0.006 + seed * 17.3);
  const mid = valueNoise(x * 0.016 + seed * 5.1);
  const soft = valueNoise(x * 0.035 + seed * 9.7);
  return 0.6 * broad + 0.3 * mid + 0.1 * soft;
}

/** World-space height of a layer's crest at x. */
function ridgeTop(x: number, layer: Ridge): number {
  return layer.minHeight + ridge(x, layer.seed) * (layer.maxHeight - layer.minHeight);
}

/** Distance scale: 1 at the near layer, about 2 at the far one; effects keep their screen size. */
function depthScale(layer: Ridge): number {
  return 1 + (-layer.z - 195) / 105;
}

const vertexShader = /* glsl */ `
attribute float aT;
attribute float aCrest;
varying float vT;
varying float vCrest;
varying vec3 vWorld;

void main() {
  vT = aT;
  vCrest = aCrest;
  vWorld = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Flat painted silhouettes: one tone per layer, a soft light along the crest, a slow glow
// drifting across, and a foot that melts into the same haze as the ground.
const ridgeFragmentShader = /* glsl */ `
uniform float uTime;
uniform vec3 uBase;
uniform vec3 uRim;
uniform vec3 uGlow;
uniform vec3 uFogColor;
uniform float uHaze;
varying float vT;
varying vec3 vWorld;

${NOISE_GLSL}

void main() {
  // Crest light, varied along the ridge so it never reads as a hard outline.
  float vary = 0.5 + 0.5 * snoise(vec2(vWorld.x * 0.03, 1.0));
  float rim = smoothstep(0.55, 1.0, vT) * (0.55 + 0.45 * vary);
  vec3 col = mix(uBase, uRim, rim * 0.8);

  // A single slow wave of warm light sweeping across, kept quiet.
  float w = sin(vWorld.x * 0.009 - uTime * 0.28 + vT * 0.8);
  float wave = smoothstep(0.75, 1.0, w);
  col += uGlow * wave * pow(vT, 2.0) * 0.3;

  // Atmosphere: the layer sits in haze, and its foot dissolves into the ground colour.
  col = mix(col, uFogColor, uHaze);
  col = mix(col, uFogColor, smoothstep(8.0, -4.0, vWorld.y) * 0.9);

  gl_FragColor = vec4(col, 1.0);
}
`;

// Grass silhouette on the crest, one tone with the hill: a soft, lobed outline cut out above
// the ridge line and animated so it reads as distant grass moving. Pixels above the outline
// are discarded, so there is no blade geometry at all.
const fringeFragmentShader = /* glsl */ `
uniform float uTime;
uniform vec3 uBase;
uniform vec3 uRim;
uniform vec3 uGlow;
uniform vec3 uFogColor;
uniform float uHaze;
uniform float uFringe;   // tallest lobe, world units
uniform float uCell;     // lobe scale, world units
uniform float uSeed;
varying float vCrest;
varying vec3 vWorld;

${NOISE_GLSL}

void main() {
  float above = vWorld.y - vCrest;

  // Shaded exactly like the hill at its crest, so the fringe is one piece with it and
  // catches the same wave of light as it sweeps past.
  float vary = 0.5 + 0.5 * snoise(vec2(vWorld.x * 0.03, 1.0));
  vec3 col = mix(uBase, uRim, (0.55 + 0.45 * vary) * 0.8);
  float w = sin(vWorld.x * 0.009 - uTime * 0.28 + 0.8);
  float wave = smoothstep(0.75, 1.0, w);
  col += uGlow * wave * 0.3;
  col = mix(col, uFogColor, uHaze);

  // Below the crest the strip is solid: it hides the seam with the hill.
  if (above <= 0.0) {
    gl_FragColor = vec4(col, 1.0);
    return;
  }

  // A low, even fringe of soft lobes riding the crest, drifting along the ridge and
  // breathing gently like grass moving in the distance.
  float x = vWorld.x / uCell + uSeed;
  float t = uTime;
  float lobes = 0.5 + 0.5 * snoise(vec2(x * 0.32 + t * 0.12, t * 0.07));
  float detail = 0.5 + 0.5 * snoise(vec2(x * 0.9 - t * 0.2, 4.0 + t * 0.05));
  float clumps = smoothstep(0.2, 0.7, 0.5 + 0.5 * snoise(vec2(x * 0.12 + 11.0, t * 0.04)));
  float height = uFringe * (0.6 + 0.4 * clumps) * (0.5 + 0.35 * lobes + 0.15 * detail);
  if (above > height) discard;

  gl_FragColor = vec4(col, 1.0);
}
`;

// Light pollution: a faint warm halo that hugs the crest and fades into the sky above it.
const glowFragmentShader = /* glsl */ `
uniform float uTime;
uniform vec3 uGlow;
uniform float uStrength;
varying float vT;
varying vec3 vWorld;

void main() {
  // vT is 1 at the crest, 0 at the top of the strip.
  float fade = pow(vT, 2.2);
  float w = sin(vWorld.x * 0.009 - uTime * 0.28);
  float pulse = 0.75 + 0.25 * smoothstep(0.75, 1.0, w);
  gl_FragColor = vec4(uGlow * fade * pulse * uStrength, 1.0);
}
`;

/**
 * A vertical strip following a ridge line. `from`/`to` give the y of the two edges at each
 * column; aT is 1 on the first edge and 0 on the second; aCrest carries the crest height.
 */
function buildStrip(
  layer: Ridge,
  from: (crest: number) => number,
  to: (crest: number) => number,
  zOffset = 0,
): THREE.BufferGeometry {
  const columns = SEGMENTS + 1;
  const positions = new Float32Array(columns * 2 * 3);
  const t = new Float32Array(columns * 2);
  const crests = new Float32Array(columns * 2);
  const indices: number[] = [];

  for (let i = 0; i < columns; i++) {
    const x = (i / SEGMENTS - 0.5) * WIDTH;
    const crest = ridgeTop(x, layer);

    positions.set([x, from(crest), layer.z + zOffset], i * 6);
    positions.set([x, to(crest), layer.z + zOffset], i * 6 + 3);
    t[i * 2] = 1;
    t[i * 2 + 1] = 0;
    crests[i * 2] = crest;
    crests[i * 2 + 1] = crest;

    if (i < SEGMENTS) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aT", new THREE.BufferAttribute(t, 1));
  geometry.setAttribute("aCrest", new THREE.BufferAttribute(crests, 1));
  geometry.setIndex(indices);
  return geometry;
}

export function createMountains(shared: SharedUniforms): SceneObject {
  const group = new THREE.Group();
  const owned: { dispose(): void }[] = [];

  for (const layer of RIDGES) {
    const scale = depthScale(layer);
    const common = {
      uTime: shared.uTime,
      uFogColor: shared.uFogColor,
      uHaze: { value: layer.haze },
      uBase: { value: new THREE.Color(layer.base) },
      uRim: { value: new THREE.Color(layer.rim) },
      uGlow: { value: new THREE.Color(GLOW_COLOR) },
    };

    // The hill: crest down to the floor.
    const ridgeGeometry = buildStrip(
      layer,
      (crest) => crest,
      () => FLOOR,
    );
    const ridgeMaterial = new THREE.ShaderMaterial({
      uniforms: { ...common },
      vertexShader,
      fragmentShader: ridgeFragmentShader,
      side: THREE.DoubleSide,
    });
    group.add(new THREE.Mesh(ridgeGeometry, ridgeMaterial));

    // The grass fringe: a thin band straddling the crest, just in front of the hill.
    const fringe = FRINGE_HEIGHT * scale;
    const fringeGeometry = buildStrip(
      layer,
      (crest) => crest + fringe,
      (crest) => crest - 0.3,
      0.3,
    );
    const fringeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        ...common,
        uFringe: { value: fringe },
        uCell: { value: FRINGE_CELL * scale },
        uSeed: { value: layer.seed * 1.37 },
      },
      vertexShader,
      fragmentShader: fringeFragmentShader,
      side: THREE.DoubleSide,
    });
    group.add(new THREE.Mesh(fringeGeometry, fringeMaterial));

    // The halo: crest up into the sky, just behind the hill.
    const glowGeometry = buildStrip(
      layer,
      (crest) => crest - 0.5,
      (crest) => crest + GLOW_HEIGHT,
      -0.5,
    );
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: shared.uTime,
        uGlow: { value: new THREE.Color(GLOW_COLOR) },
        // Nearer, darker layers throw a little more light; all of it stays faint.
        uStrength: { value: 0.26 * (1 - layer.haze) },
      },
      vertexShader,
      fragmentShader: glowFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.Mesh(glowGeometry, glowMaterial));

    owned.push(
      ridgeGeometry,
      ridgeMaterial,
      fringeGeometry,
      fringeMaterial,
      glowGeometry,
      glowMaterial,
    );
  }

  return {
    object: group,
    dispose() {
      owned.forEach((o) => o.dispose());
    },
  };
}
