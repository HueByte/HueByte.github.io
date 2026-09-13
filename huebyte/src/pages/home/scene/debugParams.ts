import type { DreamSceneDebug } from "./createDreamScene";

export interface SceneDebugParams {
  stillTime?: number;
  debug: DreamSceneDebug;
}

/**
 * Debug switches read from the page URL, for chasing rendering artefacts:
 *
 * - "?still=12" renders one frame at t = 12 s, so two loads can be diffed pixel by pixel.
 * - "?a2c=0", "?bloom=0", "?fireflies=0" switch those parts of the scene off.
 *
 * Absent parameters leave the defaults untouched, so a normal visit costs nothing.
 */
export function readSceneDebugParams(search: string): SceneDebugParams {
  const params = new URLSearchParams(search);
  const still = Number(params.get("still"));
  const flag = (name: string) => (params.has(name) ? params.get(name) !== "0" : undefined);

  return {
    stillTime: params.has("still") && Number.isFinite(still) ? still : undefined,
    debug: {
      softEdges: flag("a2c"),
      bloom: flag("bloom"),
      fireflies: flag("fireflies"),
    },
  };
}
