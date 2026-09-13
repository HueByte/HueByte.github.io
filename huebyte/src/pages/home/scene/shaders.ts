import * as THREE from "three";

// GLSL chunks shared by the scene's materials, plus the JS twin of the terrain's base
// shape so the camera and fireflies can sit on the same ground the shaders draw.

/** Where the camera stands on the XZ plane. Baked into the terrain so the ground is calm around it. */
export const CAMERA_XZ = { x: 0, z: 8 } as const;

/** 2D simplex noise (Ashima Arts / Stefan Gustavson, MIT). */
export const NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

/**
 * Rolling dunes. `terrainBase` is smooth sines (mirrored in JS below); `terrainHeight` adds
 * noise detail that fades out around the camera so the eye never sits inside a bump.
 */
export const TERRAIN_GLSL = /* glsl */ `
float terrainBase(vec2 p) {
  return sin(p.x * 0.045 + p.y * 0.02) * 1.6
       + sin(p.y * 0.06 - p.x * 0.03 + 1.7) * 1.1
       + sin((p.x + p.y) * 0.025 + 0.6) * 0.9;
}

float terrainHeight(vec2 p) {
  float detail = snoise(p * 0.03) * 1.8 + snoise(p * 0.09 + 3.1) * 0.45;
  float away = smoothstep(6.0, 40.0, length(p - vec2(${CAMERA_XZ.x.toFixed(1)}, ${CAMERA_XZ.z.toFixed(1)})));
  return terrainBase(p) + detail * away;
}
`;

/** JS twin of the GLSL `terrainBase`. Keep the two in sync. */
export function terrainBase(x: number, z: number): number {
  return (
    Math.sin(x * 0.045 + z * 0.02) * 1.6 +
    Math.sin(z * 0.06 - x * 0.03 + 1.7) * 1.1 +
    Math.sin((x + z) * 0.025 + 0.6) * 0.9
  );
}

/** Uniforms every material in the scene reads. One object, updated once per frame. */
export interface SharedUniforms {
  uTime: THREE.IUniform<number>;
  uPixelRatio: THREE.IUniform<number>;
  uCamXZ: THREE.IUniform<THREE.Vector2>;
  uWindDir: THREE.IUniform<THREE.Vector2>;
  uWindStrength: THREE.IUniform<number>;
  uFogColor: THREE.IUniform<THREE.Color>;
  uFogNear: THREE.IUniform<number>;
  uFogFar: THREE.IUniform<number>;
  [uniform: string]: THREE.IUniform;
}

export function createSharedUniforms(pixelRatio: number): SharedUniforms {
  return {
    uTime: { value: 0 },
    uPixelRatio: { value: pixelRatio },
    uCamXZ: { value: new THREE.Vector2(CAMERA_XZ.x, CAMERA_XZ.z) },
    uWindDir: { value: new THREE.Vector2(0.85, 0.35).normalize() },
    uWindStrength: { value: 1 },
    // Warm haze: the far field dissolves into glowing gold rather than darkness.
    uFogColor: { value: new THREE.Color("#33250e") },
    uFogNear: { value: 30 },
    uFogFar: { value: 180 },
  };
}

/** Something the scene owns and must release on unmount. */
export interface SceneObject {
  object: THREE.Object3D;
  /** Per-frame hook for objects that move on the CPU side. */
  update?(elapsed: number, dt: number): void;
  dispose(): void;
}

export { mulberry32 } from "@/lib/random";
