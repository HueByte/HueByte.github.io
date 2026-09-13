import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { createFireflies } from "./fireflies";
import { createGalaxy } from "./galaxy";
import { createGrass } from "./grass";
import { createGround } from "./ground";
import { createMountains } from "./mountains";
import { detectQuality } from "./quality";
import { CAMERA_XZ, createSharedUniforms, terrainHeight, type SceneObject } from "./shaders";
import { createSky } from "./sky";

export interface DreamSceneOptions {
  /** Render a single still frame instead of animating. */
  reducedMotion: boolean;
  /** Debug: freeze the scene at this many seconds (`?still=12` on the URL). */
  stillTime?: number;
  /** Debug: switch parts off to isolate an artefact (`?a2c=0`, `?bloom=0`, `?fireflies=0`). */
  debug?: DreamSceneDebug;
}

export interface DreamSceneDebug {
  softEdges?: boolean;
  bloom?: boolean;
  fireflies?: boolean;
}

export interface DreamSceneHandle {
  dispose(): void;
}

const EYE_HEIGHT = 3; // above the ground at the camera's feet
const STILL_FRAME_TIME = 14; // a moment of the animation that looks good frozen

/**
 * The landing page's living background: a glowing golden grassland at night.
 * Returns null when WebGL is unavailable; the CSS fallback stays visible in that case.
 */
export function createDreamScene(
  canvas: HTMLCanvasElement,
  { reducedMotion, stillTime, debug = {} }: DreamSceneOptions,
): DreamSceneHandle | null {
  const still = reducedMotion || stillTime !== undefined;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false, // the composer's MSAA target handles it
      powerPreference: "high-performance",
    });
  } catch (error) {
    console.warn("DreamScene: WebGL unavailable, keeping the static background.", error);
    return null;
  }

  const quality = detectQuality();
  renderer.setPixelRatio(quality.pixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;

  // The camera stands in the field a little above the grass tops, looking slightly down at
  // the horizon.
  const eye = new THREE.Vector3(
    CAMERA_XZ.x,
    terrainHeight(CAMERA_XZ.x, CAMERA_XZ.z) + EYE_HEIGHT,
    CAMERA_XZ.z,
  );
  const lookTarget = new THREE.Vector3(0, eye.y - 2, -60);
  const camera = new THREE.PerspectiveCamera(55, 1, 0.5, 1500);
  camera.position.copy(eye);
  camera.lookAt(lookTarget);

  const scene = new THREE.Scene();
  const uniforms = createSharedUniforms(quality.pixelRatio);
  const parts: SceneObject[] = [
    createSky(quality.stars, uniforms),
    createGalaxy(quality.galaxy, uniforms),
    createMountains(uniforms),
    createGround(quality.groundSegments, uniforms),
    createGrass(quality.clumps, uniforms, {
      anisotropy: renderer.capabilities.getMaxAnisotropy(),
      softEdges: (debug.softEdges ?? true) && quality.msaa > 0,
    }),
  ];
  if (debug.fireflies ?? true) parts.push(createFireflies(quality.fireflies, uniforms));
  for (const part of parts) scene.add(part.object);

  // Post: render -> bloom (the "glow") -> tone mapping + sRGB output.
  const target = new THREE.WebGLRenderTarget(1, 1, {
    type: THREE.HalfFloatType,
    samples: quality.msaa,
  });
  const composer = new EffectComposer(renderer, target);
  composer.setPixelRatio(quality.pixelRatio);
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.35, 0.5, 0.85);
  composer.addPass(new RenderPass(scene, camera));
  if (debug.bloom ?? true) composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // Gentle parallax from the pointer plus a slow idle drift, so the frame never sits still.
  const pointerTarget = new THREE.Vector2();
  const pointer = new THREE.Vector2();
  const clock = new THREE.Clock();
  let elapsed = stillTime ?? (reducedMotion ? STILL_FRAME_TIME : 0);

  const renderFrame = (dt: number) => {
    elapsed += dt;
    uniforms.uTime.value = elapsed;
    for (const part of parts) part.update?.(elapsed, dt);
    pointer.lerp(pointerTarget, 1 - Math.exp(-dt * 3));
    camera.position.set(
      eye.x + pointer.x * 0.9 + Math.sin(elapsed * 0.12) * 0.35,
      eye.y + pointer.y * 0.35 + Math.sin(elapsed * 0.17) * 0.12,
      eye.z,
    );
    camera.lookAt(lookTarget);
    composer.render();
  };

  const start = () => {
    if (still) return;
    clock.getDelta(); // drop the time spent paused
    renderer.setAnimationLoop(() => renderFrame(Math.min(clock.getDelta(), 0.1)));
  };
  const stop = () => renderer.setAnimationLoop(null);

  const resize = () => {
    const width = canvas.clientWidth || 1;
    const height = canvas.clientHeight || 1;
    renderer.setSize(width, height, false);
    composer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (still) renderFrame(0);
  };

  const onPointerMove = (event: PointerEvent) => {
    pointerTarget.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -((event.clientY / window.innerHeight) * 2 - 1),
    );
  };
  const onVisibility = () => (document.hidden ? stop() : start());
  const onContextLost = (event: Event) => {
    event.preventDefault();
    stop();
  };
  const onContextRestored = () => start();

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);

  resize();
  start();

  return {
    dispose() {
      stop();
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      parts.forEach((part) => part.dispose());
      bloom.dispose();
      composer.dispose();
      target.dispose();
      renderer.dispose();
    },
  };
}
