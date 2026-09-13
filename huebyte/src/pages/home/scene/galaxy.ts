import * as THREE from "three";
import { CAMERA_XZ, mulberry32, type SceneObject, type SharedUniforms } from "./shaders";

const DISTANCE = 440;
const DIRECTION = new THREE.Vector3(-0.42, 0.26, -0.87).normalize();
const TILT = 0.55; // radians away from face-on, so the spiral reads as a disc
const RADIUS = 135;
const BRANCHES = 3;
const SPIN = 2.2; // how far the arms wind from core to rim
const SPIN_SPEED = 0.012; // radians per second the whole galaxy turns

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;
varying vec3 vColor;
varying float vAlpha;

void main() {
  vColor = aColor;
  float twinkle = 0.7 + 0.3 * sin(uTime * (0.5 + aPhase) + aPhase * 40.0);
  vAlpha = twinkle;
  gl_PointSize = aSize * uPixelRatio * twinkle;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = pow(max(1.0 - d, 0.0), 2.4);
  gl_FragColor = vec4(vColor * vAlpha, a * vAlpha);
}
`;

/** A spiral galaxy of particles hanging in the upper-left sky, turning very slowly. */
export function createGalaxy(count: number, shared: SharedUniforms): SceneObject {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const rand = mulberry32(2024);

  const core = new THREE.Color("#ffe3b3");
  const arm = new THREE.Color("#00fa9a");
  const rim = new THREE.Color("#c62368"); // burgundy at the edges
  const c = new THREE.Color();

  const scatter = () => {
    const sign = rand() < 0.5 ? -1 : 1;
    return sign * Math.pow(rand(), 2.6);
  };

  for (let i = 0; i < count; i++) {
    const r = Math.pow(rand(), 1.5) * RADIUS;
    const t = r / RADIUS;
    const branchAngle = ((i % BRANCHES) / BRANCHES) * Math.PI * 2;
    const angle = branchAngle + t * SPIN * Math.PI;

    // Arms are tight near the core and fuzzier toward the rim; the disc is thin.
    const spread = 0.06 + t * 0.32;
    const x = Math.cos(angle) * r + scatter() * spread * RADIUS * 0.3;
    const z = Math.sin(angle) * r + scatter() * spread * RADIUS * 0.3;
    const y = scatter() * (0.03 + t * 0.05) * RADIUS;
    positions.set([x, y, z], i * 3);

    if (t < 0.3) c.copy(core).lerp(arm, t / 0.3);
    else c.copy(arm).lerp(rim, (t - 0.3) / 0.7);
    if (rand() < 0.08) c.lerp(core, 0.6); // scattered bright warm stars
    colors.set([c.r, c.g, c.b], i * 3);

    const bright = rand();
    sizes[i] = (1.2 + bright * bright * 3.4) * (t < 0.15 ? 1.4 : 1);
    phases[i] = rand();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.ShaderMaterial({
    uniforms: { uTime: shared.uTime, uPixelRatio: shared.uPixelRatio },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const disc = new THREE.Points(geometry, material);
  disc.frustumCulled = false;

  // Outer group faces the camera; the tilt object leans the disc away from face-on;
  // the disc itself spins around its own axis.
  const group = new THREE.Group();
  group.position.copy(DIRECTION).multiplyScalar(DISTANCE);
  group.lookAt(CAMERA_XZ.x, 3, CAMERA_XZ.z);
  const tilt = new THREE.Object3D();
  tilt.rotation.set(Math.PI / 2 - TILT, 0, 0.5); // disc normal (+y) toward the camera (+z)
  tilt.add(disc);
  group.add(tilt);
  group.renderOrder = -9;

  return {
    object: group,
    update(_elapsed, dt) {
      disc.rotation.y += dt * SPIN_SPEED;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
