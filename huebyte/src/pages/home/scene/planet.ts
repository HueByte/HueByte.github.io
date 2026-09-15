import * as THREE from "three";
import { mulberry32, NOISE_GLSL, type SceneObject, type SharedUniforms } from "./shaders";

// A burgundy dream planet low over the ridges: slowly flowing marbled bands with luminous
// veins, a lit rim on the upper left, a soft halo, and a tilted ring of white dust.

// Where the planet sits on screen, in clip space (-1..1 on each axis): upper right, whatever
// the aspect ratio. A fixed world direction put it off the right edge on portrait phones.
const ANCHOR = new THREE.Vector2(0.44, 0.68);
const DISTANCE = 470; // just inside the star shell
const SIZE = 78; // width of the quad the body is drawn on
const DISC_RADIUS = SIZE * 0.3; // the body fills 60% of the quad; the rest is halo
const RING_INNER = DISC_RADIUS * 1.4;
const RING_OUTER = DISC_RADIUS * 2.35;
const RING_PARTICLES = 2600;
const RING_TILT = 0.44; // radians the ring plane is tipped toward the viewer
const RING_ROLL = 0.35; // radians the ring is rotated in the picture plane
const RING_SPIN = 0.05; // radians per second at the inner edge; outer dust orbits slower

const COLORS = {
  dark: "#23081a",
  base: "#581634",
  rim: "#c62368",
  glow: "#5a1634",
  vein: "#e2a978", // desert-sand veins
  thread: "#00fa9a", // thin spring-green threads
  ring: "#f6f1ea",
};

const quadVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// One shader for the body and the halo. The body writes depth so the ring's far side is hidden
// behind it; the halo is drawn separately without depth so it never cuts a hole in the ring.
const planetFragment = /* glsl */ `
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

  #ifdef HALO
    float halo = exp(-max(r - 0.6, 0.0) * 4.0) * (1.0 - disc);
    gl_FragColor = vec4(uGlow * halo * 0.9, halo * 0.55);
    return;
  #endif

  if (disc <= 0.0) discard;

  // Domain-warped noise: bands that bend and flow like marble or gas clouds.
  // Low frequencies on purpose: the body is small on screen, fine detail turns to speckle.
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

  gl_FragColor = vec4(body, disc);
}
`;

const ringVertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uInner;
attribute float aSize;
attribute float aAlpha;
varying float vAlpha;

void main() {
  // Each grain orbits in the ring plane; inner grains faster, like a real ring.
  float radius = length(position.xz);
  float angle = atan(position.z, position.x) + uTime * ${RING_SPIN.toFixed(3)} * inversesqrt(radius / uInner);
  vec3 p = vec3(cos(angle) * radius, position.y, sin(angle) * radius);

  vAlpha = aAlpha;
  gl_PointSize = aSize * uPixelRatio;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const ringFragment = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = smoothstep(1.0, 0.25, d) * vAlpha;
  gl_FragColor = vec4(uColor * a, a);
}
`;

/** Ring brightness across its width: bright bands, a dark gap, faint edges. */
function ringDensity(u: number): number {
  const bands = 0.55 + 0.45 * Math.sin(u * 15 + 1.2);
  const gap = 1 - 0.85 * Math.exp(-Math.pow((u - 0.66) / 0.035, 2));
  const edges = Math.sin(u * Math.PI); // fades to nothing at both rims
  return bands * gap * Math.pow(edges, 0.6);
}

function createRing(shared: SharedUniforms): SceneObject {
  const positions = new Float32Array(RING_PARTICLES * 3);
  const sizes = new Float32Array(RING_PARTICLES);
  const alphas = new Float32Array(RING_PARTICLES);
  const rand = mulberry32(9001);

  for (let i = 0; i < RING_PARTICLES; i++) {
    const u = rand();
    const radius = RING_INNER + u * (RING_OUTER - RING_INNER);
    const angle = rand() * Math.PI * 2;
    positions.set(
      [Math.cos(angle) * radius, (rand() - 0.5) * 0.6, Math.sin(angle) * radius],
      i * 3,
    );
    sizes[i] = 1.2 + rand() * 1.6;
    alphas[i] = (0.25 + 0.75 * rand()) * ringDensity(u);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: shared.uTime,
      uPixelRatio: shared.uPixelRatio,
      uInner: { value: RING_INNER },
      uColor: { value: new THREE.Color(COLORS.ring) },
    },
    vertexShader: ringVertex,
    fragmentShader: ringFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.rotation.set(RING_TILT, 0, RING_ROLL);
  points.frustumCulled = false;
  points.renderOrder = -7; // after the body, so its depth hides the far side of the ring

  return {
    object: points,
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}

export function createPlanet(shared: SharedUniforms): SceneObject {
  const geometry = new THREE.PlaneGeometry(SIZE, SIZE);
  const uniforms = {
    uTime: shared.uTime,
    uDark: { value: new THREE.Color(COLORS.dark) },
    uBase: { value: new THREE.Color(COLORS.base) },
    uRim: { value: new THREE.Color(COLORS.rim) },
    uGlow: { value: new THREE.Color(COLORS.glow) },
    uVein: { value: new THREE.Color(COLORS.vein) },
    uThread: { value: new THREE.Color(COLORS.thread) },
  };

  const haloMaterial = new THREE.ShaderMaterial({
    defines: { HALO: 1 },
    uniforms,
    vertexShader: quadVertex,
    fragmentShader: planetFragment,
    transparent: true,
    depthWrite: false,
  });
  const halo = new THREE.Mesh(geometry, haloMaterial);
  halo.renderOrder = -9;

  const bodyMaterial = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: quadVertex,
    fragmentShader: planetFragment,
    transparent: true,
    depthWrite: true,
  });
  const body = new THREE.Mesh(geometry, bodyMaterial);
  body.renderOrder = -8;

  const ring = createRing(shared);

  // Everything hangs off one group that faces the camera; the camera barely moves.
  const group = new THREE.Group();
  group.add(halo, body, ring.object);

  // Placed on every resize: the anchor is cast out from the camera to the star shell, so the
  // planet keeps its spot on screen as the projection changes with the viewport.
  const direction = new THREE.Vector3();
  const place = (camera: THREE.PerspectiveCamera) => {
    camera.updateMatrixWorld();
    direction.set(ANCHOR.x, ANCHOR.y, 0.5).unproject(camera).sub(camera.position).normalize();
    group.position.copy(camera.position).addScaledVector(direction, DISTANCE);
    group.lookAt(camera.position);
  };

  return {
    object: group,
    resize: place,
    dispose() {
      geometry.dispose();
      haloMaterial.dispose();
      bodyMaterial.dispose();
      ring.dispose();
    },
  };
}
