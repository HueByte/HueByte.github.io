import * as THREE from "three";
import { mulberry32, terrainHeight, type SceneObject, type SharedUniforms } from "./shaders";

// Sparks that climb out of the field. Each firefly owns one endless cycle: it wakes up low
// among the blades, wanders upward while its wander widens, and fades out well above the tips
// before starting over from the same root. The whole cycle runs in the vertex shader, so the
// CPU only plants them once.

// Grass clumps grow with distance (see plantClumps in grass.ts); this is the tip height a
// firefly at that depth has to climb through, so the far field launches sparks at its own scale.
const grassTip = (depth: number) => 0.9 * (1 + depth * 0.0213);

// Where sparks read: past this the grass in front of the camera hides them, further back than
// FIELD_DEPTH they are a sub-pixel flicker. The wedge tracks the view frustum rather than the
// grass one, which is wider than the screen, so few are planted out of frame.
const NEAREST = 6;
const FIELD_DEPTH = 64;
const WEDGE_BASE = 7;
const WEDGE_SLOPE = 0.95;

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uFogNear;
uniform float uFogFar;
attribute float aSeed;
attribute vec3 aColor;
attribute vec3 aFlight; // cycle seconds, phase 0..1, climb height
varying float vAlpha;
varying vec3 vColor;

void main() {
  vColor = aColor;
  float s = aSeed * 6.2831;

  // One climb, looped. The phase spreads the field out so they never launch together.
  float t = fract(uTime / aFlight.x + aFlight.y);

  // Hesitates in the blades, then leaves: slow off the ground, easing off near the top.
  float climb = smoothstep(0.06, 0.92, t);

  vec3 p = position;
  p.y += aFlight.z * climb + sin(uTime * 0.9 + s) * 0.1;

  // The wander opens up as it rises: tight between the blades, loose in the open air.
  float wander = 0.3 + climb * 1.2;
  p.x += (sin(uTime * 0.31 + s) * 0.9 + sin(uTime * 0.74 + s * 2.1) * 0.25) * wander;
  p.z += (cos(uTime * 0.27 + s * 1.3) * 0.8) * wander;

  float pulse = 0.5 + 0.5 * sin(uTime * (0.6 + aSeed * 0.9) + s * 3.0);

  // Lights up on the way out of the grass and dies away high above it.
  float env = smoothstep(0.0, 0.12, t) * (1.0 - smoothstep(0.72, 1.0, t));
  env *= 0.6 + 0.4 * climb;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float dist = -mv.z;
  env *= 1.0 - smoothstep(uFogNear, uFogFar, dist) * 0.9; // the haze swallows the far ones

  vAlpha = env * (0.45 + 0.55 * pulse * pulse);
  // A floor on the size: a spark thinner than a pixel flickers as it crosses the pixel grid.
  float size = (5.0 + aSeed * 9.0) * (26.0 / max(dist, 1.0)) * (0.7 + 0.3 * pulse);
  gl_PointSize = max(size, 2.0) * uPixelRatio;
  gl_Position = projectionMatrix * mv;
}
`;

const fragmentShader = /* glsl */ `
varying float vAlpha;
varying vec3 vColor;

void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float core = pow(max(1.0 - d, 0.0), 2.5);
  gl_FragColor = vec4(vColor * (0.7 + core * 0.8), core * vAlpha);
}
`;

export function createFireflies(count: number, shared: SharedUniforms): SceneObject {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const flights = new Float32Array(count * 3);
  const rand = mulberry32(777);
  const green = new THREE.Color("#00fa9a");
  const gold = new THREE.Color("#ffd36b");

  for (let i = 0; i < count; i++) {
    // Planted like the grass: crowded near the camera, thinning out into the wedge.
    const depth = NEAREST + Math.pow(rand(), 1.3) * FIELD_DEPTH;
    const halfWidth = WEDGE_BASE + depth * WEDGE_SLOPE;
    const x = (rand() * 2 - 1) * halfWidth;
    const z = 4 - depth;
    const tip = grassTip(depth);
    // Down among the blades, which hide it until it has climbed out: the grass is opaque and
    // writes depth, so an emerging spark really is occluded rather than faded by hand.
    const y = terrainHeight(x, z) + tip * (0.15 + rand() * 0.3);
    positions.set([x, y, z], i * 3);
    seeds[i] = rand();
    const c = rand() < 0.78 ? green : gold;
    colors.set([c.r, c.g, c.b], i * 3);
    flights.set([14 + rand() * 12, rand(), tip * (1.8 + rand() * 2.6)], i * 3);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aFlight", new THREE.BufferAttribute(flights, 3));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: shared.uTime,
      uPixelRatio: shared.uPixelRatio,
      uFogNear: shared.uFogNear,
      uFogFar: shared.uFogFar,
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;

  return {
    object: points,
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
