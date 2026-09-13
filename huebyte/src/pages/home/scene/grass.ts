import * as THREE from "three";
import { RIDGES, ridgeTop } from "./mountains";
import {
  mulberry32,
  NOISE_GLSL,
  TERRAIN_GLSL,
  type SceneObject,
  type SharedUniforms,
} from "./shaders";

const FIELD_DEPTH = 150; // how far in front of the camera field blades are planted
const NEAREST = 4; // closest blade, in front of the camera (camera sits at z = 8)
const RIDGE_HALF_WIDTH = 330; // how far sideways the ridge blades reach (covers the view)

export interface BladePlacement {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
}

export interface GrassOptions {
  count: number;
  seed: number;
  plant(rand: () => number): BladePlacement;
  /** 1: roots follow the terrain height field. 0: roots sit exactly at the planted y. */
  terrainWeight: number;
  fogNear: number;
  fogFar: number;
  /** Multiplied into the final colour; darker tints turn blades into silhouettes. */
  tint?: THREE.ColorRepresentation;
}

const vertexShader = /* glsl */ `
uniform float uTime;
uniform vec2 uCamXZ;
uniform vec2 uWindDir;
uniform float uWindStrength;
uniform float uTerrainWeight;

attribute vec3 aOffset;   // world position of the blade's root (y is added to the terrain)
attribute vec2 aScale;    // width, height
attribute float aAngle;   // rotation around y
attribute float aSeed;    // 0..1 per blade

varying vec2 vUv;
varying float vSeed;
varying float vGust;
varying float vDist;

${NOISE_GLSL}
${TERRAIN_GLSL}

void main() {
  vUv = uv;
  vSeed = aSeed;

  // Taper the quad into a blade: full width at the root, a point at the tip.
  float taper = 1.0 - pow(uv.y, 1.5);
  vec3 p = vec3(position.x * aScale.x * taper, position.y * aScale.y, 0.0);

  float c = cos(aAngle);
  float s = sin(aAngle);
  p.xz = mat2(c, -s, s, c) * p.xz;

  // Wind: a slow gust field drifting downwind, a faster ripple, and a per-blade sway.
  vec2 world = aOffset.xz;
  float gust = snoise(vec2(world.x * 0.04 - uTime * 0.7, world.y * 0.04 - uTime * 0.35));
  float ripple = snoise(vec2(world.x * 0.18 + uTime * 1.3, world.y * 0.18 - uTime * 0.4));
  float sway = sin(uTime * 2.2 + aSeed * 6.2831) * 0.08;
  float bend = (0.25 + 0.5 * gust + 0.2 * ripple + sway) * uWindStrength;

  // Bend grows toward the tip; the blade shortens a little as it leans.
  float k = pow(uv.y, 1.7);
  p.xz += uWindDir * bend * k * aScale.y;
  p.y -= abs(bend) * k * k * aScale.y * 0.25;

  float baseY = terrainHeight(world) * uTerrainWeight + aOffset.y;
  vec3 wp = vec3(world.x + p.x, baseY + p.y, world.y + p.z);

  vGust = gust;
  vDist = distance(wp.xz, uCamXZ);
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform vec3 uRootColor;
uniform vec3 uMidColor;
uniform vec3 uTipColor;
uniform vec3 uSparkColor;
uniform vec3 uSparkAltColor;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
uniform vec3 uTint;

varying vec2 vUv;
varying float vSeed;
varying float vGust;
varying float vDist;

void main() {
  float y = vUv.y;

  vec3 col = mix(uRootColor, uMidColor, smoothstep(0.0, 0.55, y));
  col = mix(col, uTipColor, smoothstep(0.5, 1.0, y));

  // Tips glow, and blades caught by a gust light up as they lean.
  float glow = 0.35 + 0.65 * y * y + 0.35 * max(vGust, 0.0);
  col *= glow * 0.85;

  // A pulse of light travelling up some of the blades.
  float pulse = sin(uTime * 2.5 - y * 9.0 + vSeed * 40.0);
  float carries = step(0.78, fract(vSeed * 7.31));
  float spark = smoothstep(0.9, 1.0, pulse) * smoothstep(0.35, 0.9, y) * carries;
  vec3 sparkCol = mix(uSparkColor, uSparkAltColor, step(0.8, fract(vSeed * 3.17)));
  col += sparkCol * spark * 1.4;

  // The far field is the brightest part of the dream, then it dissolves into haze.
  float far = smoothstep(15.0, 110.0, vDist);
  col += uMidColor * far * 0.22;
  col *= uTint;
  float fog = smoothstep(uFogNear, uFogFar, vDist);
  col = mix(col, uFogColor, fog);

  gl_FragColor = vec4(col, 1.0);
}
`;

export function createGrass(options: GrassOptions, shared: SharedUniforms): SceneObject {
  const { count } = options;
  const blade = new THREE.PlaneGeometry(1, 1, 1, 5);
  blade.translate(0, 0.5, 0); // root at y = 0, uv.y runs root -> tip

  const geometry = new THREE.InstancedBufferGeometry();
  geometry.index = blade.index;
  geometry.setAttribute("position", blade.getAttribute("position"));
  geometry.setAttribute("uv", blade.getAttribute("uv"));

  const offsets = new Float32Array(count * 3);
  const scales = new Float32Array(count * 2);
  const angles = new Float32Array(count);
  const seeds = new Float32Array(count);
  const rand = mulberry32(options.seed);

  for (let i = 0; i < count; i++) {
    const b = options.plant(rand);
    offsets.set([b.x, b.y, b.z], i * 3);
    scales.set([b.width, b.height], i * 2);
    angles[i] = rand() * Math.PI;
    seeds[i] = rand();
  }

  geometry.setAttribute("aOffset", new THREE.InstancedBufferAttribute(offsets, 3));
  geometry.setAttribute("aScale", new THREE.InstancedBufferAttribute(scales, 2));
  geometry.setAttribute("aAngle", new THREE.InstancedBufferAttribute(angles, 1));
  geometry.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds, 1));
  geometry.instanceCount = count;

  const material = new THREE.ShaderMaterial({
    uniforms: {
      ...shared,
      uFogNear: { value: options.fogNear },
      uFogFar: { value: options.fogFar },
      uTerrainWeight: { value: options.terrainWeight },
      uTint: { value: new THREE.Color(options.tint ?? "#ffffff") },
      uRootColor: { value: new THREE.Color("#3a2408") },
      uMidColor: { value: new THREE.Color("#d9962c") },
      uTipColor: { value: new THREE.Color("#ffe08a") },
      uSparkColor: { value: new THREE.Color("#fff1b8") },
      uSparkAltColor: { value: new THREE.Color("#00fa9a") },
    },
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false; // instances are placed in view by construction

  return {
    object: mesh,
    dispose() {
      geometry.dispose();
      blade.dispose();
      material.dispose();
    },
  };
}

/** The field around the camera: many small blades, denser up close, wider further out. */
export function createFieldGrass(count: number, shared: SharedUniforms): SceneObject {
  return createGrass(
    {
      count,
      seed: 1337,
      terrainWeight: 1,
      fogNear: shared.uFogNear.value,
      fogFar: shared.uFogFar.value,
      plant(rand) {
        const depth = Math.pow(rand(), 1.4) * FIELD_DEPTH;
        const t = depth / FIELD_DEPTH;
        const halfWidth = 5 + depth * 0.95;
        return {
          x: (rand() * 2 - 1) * halfWidth,
          y: 0,
          z: NEAREST - depth,
          // Far blades are taller and much wider so the field stays dense at a distance.
          width: (0.06 + rand() * 0.06) * (1 + t * 4),
          height: (0.9 + rand() * 0.9) * (1 + t * 1.4),
        };
      },
    },
    shared,
  );
}

/**
 * The far LOD: a few thousand huge blades standing on the mountain ridges, crowding the
 * crests and thinning down the slopes. At 200+ units they read as grassy hills swaying.
 */
export function createRidgeGrass(count: number, shared: SharedUniforms): SceneObject {
  return createGrass(
    {
      count,
      seed: 9001,
      terrainWeight: 0,
      fogNear: 120,
      fogFar: 460,
      tint: "#9c8c78", // silhouette tufts against the sky, lit only by their own glow
      plant(rand) {
        const layer = rand() < 0.55 ? RIDGES[1] : RIDGES[0];
        if (!layer) throw new Error("RIDGES must have two layers");
        const scale = layer.z < -220 ? 1.25 : 1;
        const x = (rand() * 2 - 1) * RIDGE_HALF_WIDTH;
        return {
          x,
          y: ridgeTop(x, layer) - 0.3 - Math.pow(rand(), 3) * 2.5,
          z: layer.z + 0.6,
          width: (0.45 + rand() * 0.6) * scale,
          height: (2 + rand() * 3) * scale,
        };
      },
    },
    shared,
  );
}
