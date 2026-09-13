import * as THREE from "three";
import { mulberry32, terrainHeight, type SceneObject, type SharedUniforms } from "./shaders";

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute float aSeed;
attribute vec3 aColor;
varying float vAlpha;
varying vec3 vColor;

void main() {
  vColor = aColor;
  float s = aSeed * 6.2831;

  // Lazy drifting loops, each firefly on its own rhythm.
  vec3 p = position;
  p.x += sin(uTime * 0.30 + s) * 1.2 + sin(uTime * 0.77 + s * 2.0) * 0.3;
  p.y += sin(uTime * 0.50 + s * 1.5) * 0.5;
  p.z += cos(uTime * 0.25 + s * 0.7) * 1.2;

  float pulse = 0.5 + 0.5 * sin(uTime * (0.35 + aSeed * 0.5) + s * 3.0);
  vAlpha = 0.25 + 0.55 * pulse * pulse;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = (5.0 + aSeed * 9.0) * uPixelRatio * (24.0 / max(-mv.z, 1.0)) * (0.7 + 0.3 * pulse);
  gl_Position = projectionMatrix * mv;
}
`;

const fragmentShader = /* glsl */ `
varying float vAlpha;
varying vec3 vColor;

void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float core = pow(max(1.0 - d, 0.0), 3.0);
  gl_FragColor = vec4(vColor * (0.6 + core), core * vAlpha);
}
`;

export function createFireflies(count: number, shared: SharedUniforms): SceneObject {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const rand = mulberry32(777);
  const green = new THREE.Color("#00fa9a");
  const gold = new THREE.Color("#ffd36b");

  for (let i = 0; i < count; i++) {
    const x = (rand() * 2 - 1) * 28;
    const z = 2 - rand() * 48;
    // Above the grass tops: a firefly drifting inside the clumps pops in and out behind the
    // blades, which reads as sparks flickering through the field.
    const y = terrainHeight(x, z) + 1.6 + rand() * 1.2 + (2 - z) * 0.02; // far clumps are taller
    positions.set([x, y, z], i * 3);
    seeds[i] = rand();
    const c = rand() < 0.78 ? green : gold;
    colors.set([c.r, c.g, c.b], i * 3);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.ShaderMaterial({
    uniforms: { uTime: shared.uTime, uPixelRatio: shared.uPixelRatio },
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
