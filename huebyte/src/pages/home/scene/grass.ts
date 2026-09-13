import * as THREE from "three";
import { mulberry32, terrainHeight, type SceneObject, type SharedUniforms } from "./shaders";
import { createTuftTexture } from "./tuftTexture";

// "Fluffy" grass in the FluffyGrass / Elysium manner: instead of one quad per blade, each
// instance is a clump of a few alpha-textured cards fanned around a point. The tuft texture
// carries the blades, so a handful of cards read as dozens of soft overlapping leaves.

const FIELD_DEPTH = 150; // how far in front of the camera clumps are planted
// Nearest clump, just in front of the camera (which sits at z = 8), so the bottom edge of the
// frame shows blade tips rather than roots.
const NEAREST = 5;
// The planted wedge must cover the widest viewport plus pointer parallax. A 55° vertical FOV
// on a 21:9 screen sees about 1.25 units sideways per unit of depth; this leaves headroom.
const WEDGE_BASE = 8;
const WEDGE_SLOPE = 1.5;
const CARDS = 9; // textured cards per clump
// Card height as a fraction of its width. Taller than the 2:1 texture, which stretches the
// blades a little and softens them.
const CARD_HEIGHT = 0.7;
// Alpha below which a texel is discarded. With alpha-to-coverage the soft edge does the rest.
const CUTOFF_SOFT = 0.22;
const CUTOFF_HARD = 0.45;

const COLORS = {
  root: "#2b1410",
  mid: "#b8781f",
  tip: "#ffd97a",
  tipAlt: "#d2e394", // a spring tint some clumps lean toward
};

export interface GrassOptions {
  /** Texture anisotropy supported by the renderer. */
  anisotropy: number;
  /** Use alpha-to-coverage for soft blade edges (needs a multisampled target). */
  softEdges: boolean;
}

// Vertex work stays tiny: no noise, no terrain maths. Roots come pre-placed on the ground and
// the wind is two sines, so the field runs on the fragment budget alone.
const vertexShader = /* glsl */ `
uniform float uTime;
uniform vec2 uCamXZ;
uniform vec2 uWindDir;
uniform float uWindStrength;

attribute vec3 aRoot;    // world position of the clump's root, already on the ground
attribute vec4 aClump;   // scale, yaw, seed, tint

varying vec2 vUv;
varying float vSeed;
varying float vTint;
varying float vSwell;
varying float vDist;

void main() {
  vUv = uv;
  vSeed = aClump.z;
  vTint = aClump.w;

  vec3 p = position * aClump.x;
  float c = cos(aClump.y);
  float s = sin(aClump.y);
  p.xz = mat2(c, -s, s, c) * p.xz;

  // One wind. A long swell rolls downwind across the whole field with a shorter wave riding
  // on it, so neighbours lean together; each clump adds only a whisper of its own sway.
  float along = dot(aRoot.xz, uWindDir);
  float across = dot(aRoot.xz, vec2(-uWindDir.y, uWindDir.x));
  float swell = sin(along * 0.05 - uTime * 0.45 + across * 0.012);
  float ripple = sin(along * 0.17 - uTime * 0.85 + across * 0.03 + 1.3);
  float sway = sin(uTime * 0.8 + aClump.z * 6.2831) * 0.05;
  float bend = (0.35 + 0.3 * swell + 0.12 * ripple + sway) * uWindStrength;

  // The cards shear: roots stay planted, tops slide downwind.
  float reach = aClump.x * ${CARD_HEIGHT.toFixed(2)};
  p.xz += uWindDir * bend * uv.y * reach;
  p.y -= abs(bend) * uv.y * uv.y * reach * 0.2;

  vec3 wp = aRoot + p;

  vSwell = swell;
  vDist = distance(wp.xz, uCamXZ);
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform sampler2D uTuft;
uniform float uCutoff;
uniform vec3 uRootColor;
uniform vec3 uMidColor;
uniform vec3 uTipColor;
uniform vec3 uTipAltColor;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;

varying vec2 vUv;
varying float vSeed;
varying float vTint;
varying float vSwell;
varying float vDist;

void main() {
  float a = texture2D(uTuft, vUv).a;
  // Distant mips average the blades away; push their alpha back up so the far field stays full.
  a *= 1.0 + smoothstep(15.0, 90.0, vDist) * 0.8;
  if (a < uCutoff) discard;

  float y = vUv.y;
  vec3 tip = mix(uTipColor, uTipAltColor, vTint * 0.6);
  vec3 col = mix(uRootColor, uMidColor, smoothstep(0.0, 0.7, y));
  col = mix(col, tip, smoothstep(0.55, 1.0, y));

  // Dark in the roots, glowing at the tips, a touch brighter on the crest of the swell.
  float glow = 0.3 + 0.7 * y * y + 0.2 * max(vSwell, 0.0) * y;
  col *= glow * 0.8;

  // A very slow breathing of light, different per clump. No pulses: on cards this size a
  // flash reads as a light flickering through the field, not as a spark.
  col *= 1.0 + 0.06 * sin(uTime * 0.3 + vSeed * 6.2831);

  // The far field lifts toward gold in its darker parts, then dissolves into the haze.
  float far = smoothstep(15.0, 110.0, vDist);
  col += uMidColor * far * 0.14 * (1.0 - y * y);
  col = mix(col, uFogColor, smoothstep(uFogNear, uFogFar, vDist));

  // Never let a blade reach the bloom threshold (0.85). Sub-pixel tips that cross it bloom
  // for a frame at a time and read as flashes all over the field.
  col = min(col, vec3(0.8));

  #if SOFT_EDGES
    // Alpha becomes sample coverage: the texture's soft edge turns into an antialiased one.
    gl_FragColor = vec4(col, smoothstep(uCutoff, uCutoff + 0.45, a));
  #else
    gl_FragColor = vec4(col, 1.0);
  #endif
}
`;

// Card corners as (x across the card, v up the card).
const CORNERS: readonly (readonly [number, number])[] = [
  [-0.5, 0],
  [0.5, 0],
  [-0.5, 1],
  [0.5, 1],
];

/** One clump at unit size: CARDS cards fanned around the origin, tops leaning outward. */
function buildClump(): THREE.BufferGeometry {
  const rand = mulberry32(99);
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let k = 0; k < CARDS; k++) {
    const yaw = (k / CARDS) * Math.PI + (rand() - 0.5) * 0.3;
    const width = 0.85 + rand() * 0.3;
    const height = CARD_HEIGHT * width;
    const shift = (rand() - 0.5) * 0.3; // slide along the card
    const push = (rand() - 0.5) * 0.4; // offset along the card's normal
    const lean = (0.2 + rand() * 0.3) * Math.sign(push || 1); // top leans away from the centre
    const c = Math.cos(yaw);
    const s = Math.sin(yaw);
    const base = k * 4;

    for (const [cx, v] of CORNERS) {
      const x = cx * width + shift;
      const y = v * height;
      const z = push + v * height * lean;
      positions.push(c * x - s * z, y, s * x + c * z);
      uvs.push(cx + 0.5, v);
    }
    indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  return geometry;
}

interface Clump {
  x: number;
  z: number;
  scale: number;
  yaw: number;
  seed: number;
  tint: number;
}

/**
 * Where the clumps stand: denser near the camera, thinning with distance, in a wedge that
 * widens to fill the view. Returned nearest first so the front of the field fills the depth
 * buffer and most fragments of the clumps behind it are rejected before they are shaded.
 */
function plantClumps(count: number): Clump[] {
  const rand = mulberry32(1337);
  const clumps: Clump[] = [];

  for (let i = 0; i < count; i++) {
    const depth = Math.pow(rand(), 1.4) * FIELD_DEPTH;
    const t = depth / FIELD_DEPTH;
    const halfWidth = WEDGE_BASE + depth * WEDGE_SLOPE;
    clumps.push({
      x: (rand() * 2 - 1) * halfWidth,
      z: NEAREST - depth,
      // Far clumps are much larger so the field stays dense at a distance.
      scale: (1 + rand() * 0.6) * (1 + t * 3.2),
      yaw: rand() * Math.PI,
      seed: rand(),
      tint: rand(),
    });
  }

  return clumps.sort((a, b) => b.z - a.z);
}

/** The field around the camera: soft clumps, denser up close, larger further out. */
export function createGrass(
  count: number,
  shared: SharedUniforms,
  { anisotropy, softEdges }: GrassOptions,
): SceneObject {
  const clump = buildClump();
  const geometry = new THREE.InstancedBufferGeometry();
  geometry.index = clump.index;
  geometry.setAttribute("position", clump.getAttribute("position"));
  geometry.setAttribute("uv", clump.getAttribute("uv"));

  const roots = new Float32Array(count * 3);
  const params = new Float32Array(count * 4);
  plantClumps(count).forEach((c, i) => {
    roots.set([c.x, terrainHeight(c.x, c.z) - 0.05, c.z], i * 3);
    params.set([c.scale, c.yaw, c.seed, c.tint], i * 4);
  });
  geometry.setAttribute("aRoot", new THREE.InstancedBufferAttribute(roots, 3));
  geometry.setAttribute("aClump", new THREE.InstancedBufferAttribute(params, 4));
  geometry.instanceCount = count;

  const tuft = createTuftTexture(anisotropy);
  const material = new THREE.ShaderMaterial({
    defines: { SOFT_EDGES: softEdges ? 1 : 0 },
    uniforms: {
      ...shared,
      uTuft: { value: tuft },
      uCutoff: { value: softEdges ? CUTOFF_SOFT : CUTOFF_HARD },
      uRootColor: { value: new THREE.Color(COLORS.root) },
      uMidColor: { value: new THREE.Color(COLORS.mid) },
      uTipColor: { value: new THREE.Color(COLORS.tip) },
      uTipAltColor: { value: new THREE.Color(COLORS.tipAlt) },
    },
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    alphaToCoverage: softEdges,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false; // instances are placed in view by construction

  return {
    object: mesh,
    dispose() {
      geometry.dispose();
      clump.dispose();
      material.dispose();
      tuft.dispose();
    },
  };
}
