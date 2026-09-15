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
import { createPlanet } from "./planet";
import { detectQuality } from "./quality";
import { ResolutionGovernor } from "./resolution";
import { CAMERA_XZ, createSharedUniforms, terrainHeight, type SceneObject } from "./shaders";
import { createSky } from "./sky";
import { createStatsOverlay } from "./statsOverlay";

export interface DreamSceneOptions {
  /** Render a single still frame instead of animating. */
  reducedMotion: boolean;
  /** Called once the first frame has been rendered. */
  onReady?: () => void;
  /** Debug: freeze the scene at this many seconds (`?still=12` on the URL). */
  stillTime?: number;
  /** Debug: switch parts off or pin settings to isolate an artefact. */
  debug?: DreamSceneDebug;
}

export interface DreamSceneDebug {
  softEdges?: boolean;
  bloom?: boolean;
  fireflies?: boolean;
  /** Pin the render scale instead of adapting it to the frame rate. */
  fixedScale?: number;
  /** Show frames per second and the render scale in a corner. */
  stats?: boolean;
}

export interface DreamSceneHandle {
  dispose(): void;
}

const EYE_HEIGHT = 3; // above the ground at the camera's feet
const STILL_FRAME_TIME = 14; // a moment of the animation that looks good frozen
const MAX_FPS = 60; // no need to render faster on 120 Hz+ screens; the scene is slow by design
const BLOOM_SCALE = 0.5; // bloom is soft by nature; its mip chain can start at half resolution
// Below this render scale the upscale switches from bilinear to nearest neighbour: a lightly
// pixelated picture reads as a deliberate "digital" look, a blurry one reads as broken.
const PIXELATE_BELOW = 0.75;

/**
 * The landing page's living background: a glowing golden grassland at night.
 * Returns null when WebGL is unavailable; the CSS fallback stays visible in that case.
 */
export function createDreamScene(
  canvas: HTMLCanvasElement,
  { reducedMotion, stillTime, onReady, debug = {} }: DreamSceneOptions,
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
  const uniforms = createSharedUniforms(quality.pixelRatio.start);
  const parts: SceneObject[] = [
    createSky(quality.stars, uniforms),
    createPlanet(uniforms),
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
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.35, 0.5, 0.85);
  composer.addPass(new RenderPass(scene, camera));
  if (debug.bloom ?? true) composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // Resolution: the canvas keeps its CSS size while its pixel buffer follows the render scale,
  // so the browser does the upscale for free. The governor moves the scale with the frame rate.
  const governor = new ResolutionGovernor(quality.pixelRatio);
  const setScale = (scale: number) => {
    renderer.setPixelRatio(scale);
    composer.setPixelRatio(scale);
    uniforms.uPixelRatio.value = scale; // point sizes are in device pixels
    canvas.style.imageRendering = scale < PIXELATE_BELOW ? "pixelated" : "auto";
  };
  const applySize = () => {
    const width = canvas.clientWidth || 1;
    const height = canvas.clientHeight || 1;
    renderer.setSize(width, height, false);
    composer.setSize(width, height); // sizes every pass at the render scale...
    const bloomScale = renderer.getPixelRatio() * BLOOM_SCALE; // ...then bloom drops to half
    bloom.setSize(width * bloomScale, height * bloomScale);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    for (const part of parts) part.resize?.(camera);
  };
  // Viewport changes: redraw at once. Setting the drawing buffer size wipes the canvas, and the
  // resize observer fires after this frame's animation callback, so waiting for the next tick
  // would show one blank frame.
  const resize = () => {
    applySize();
    renderFrame(0);
  };

  // Gentle parallax from the pointer plus a slow idle drift, so the frame never sits still.
  const pointerTarget = new THREE.Vector2();
  const pointer = new THREE.Vector2();
  let elapsed = stillTime ?? (reducedMotion ? STILL_FRAME_TIME : 0);
  let lastFrameAt: number | null = null; // animation-loop timestamp of the last rendered frame
  let painted = false; // whether the first frame has reached the canvas
  const stats = debug.stats ? createStatsOverlay(canvas.parentElement ?? document.body) : null;

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

    if (!painted) {
      painted = true;
      onReady?.(); // the boot screen may fade now: there is a finished picture behind it
    }
  };

  const tick = (time: number) => {
    // Cap the frame rate: on fast displays refreshes are skipped until a frame's worth of
    // time has passed. The first frame after (re)starting always renders.
    const since = lastFrameAt === null ? 1 / MAX_FPS : (time - lastFrameAt) / 1000;
    if (since < 1 / MAX_FPS - 0.002) return;
    lastFrameAt = time;
    stats?.update(1 / since, renderer.getPixelRatio());

    if (debug.fixedScale === undefined) {
      const scale = governor.sample(since);
      if (scale !== null) {
        setScale(scale);
        applySize(); // the frame below redraws
      }
    }
    renderFrame(Math.min(since, 0.1)); // a long pause is not a long step
  };

  const start = () => {
    if (still) return;
    lastFrameAt = null; // drop the time spent paused
    renderer.setAnimationLoop(tick);
  };
  const stop = () => renderer.setAnimationLoop(null);

  const onPointerMove = (event: PointerEvent) => {
    pointerTarget.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -((event.clientY / window.innerHeight) * 2 - 1),
    );
  };
  let visible = true;
  let onScreen = true;
  const syncRunning = () => (visible && onScreen ? start() : stop());
  const onVisibility = () => {
    visible = !document.hidden;
    syncRunning();
  };
  const onContextLost = (event: Event) => {
    event.preventDefault();
    stop();
  };
  const onContextRestored = () => syncRunning();

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  // Nothing renders while the canvas is scrolled out of view.
  const viewObserver = new IntersectionObserver(([entry]) => {
    onScreen = entry?.isIntersecting ?? true;
    syncRunning();
  });
  viewObserver.observe(canvas);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);

  setScale(debug.fixedScale ?? quality.pixelRatio.start);
  resize();
  start();

  return {
    dispose() {
      stop();
      resizeObserver.disconnect();
      viewObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      stats?.dispose();
      parts.forEach((part) => part.dispose());
      bloom.dispose();
      composer.dispose();
      target.dispose();
      renderer.dispose();
    },
  };
}
