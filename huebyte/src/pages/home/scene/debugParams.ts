import type { DreamSceneDebug } from "./createDreamScene";

export interface SceneDebugParams {
  stillTime?: number;
  debug: DreamSceneDebug;
}

/**
 * Debug switches read from the page URL, for chasing artefacts and tuning performance:
 *
 * - "?still=12" renders one frame at t = 12 s, so two loads can be diffed pixel by pixel.
 * - "?a2c=0", "?bloom=0", "?fireflies=0" switch those parts of the scene off.
 * - "?scale=0.5" pins the render scale instead of adapting it.
 * - "?stats=1" shows frames per second and the current render scale.
 *
 * Absent parameters leave the defaults untouched, so a normal visit costs nothing.
 */
export function readSceneDebugParams(search: string): SceneDebugParams {
  const params = new URLSearchParams(search);
  const flag = (name: string) => (params.has(name) ? params.get(name) !== "0" : undefined);
  const number = (name: string) => {
    const value = Number(params.get(name));
    return params.has(name) && Number.isFinite(value) ? value : undefined;
  };

  return {
    stillTime: number("still"),
    debug: {
      softEdges: flag("a2c"),
      bloom: flag("bloom"),
      fireflies: flag("fireflies"),
      fixedScale: number("scale"),
      stats: flag("stats"),
    },
  };
}
