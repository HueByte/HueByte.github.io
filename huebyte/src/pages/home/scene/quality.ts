export interface Quality {
  /** Grass clumps in the field around the camera. */
  clumps: number;
  stars: number;
  galaxy: number;
  fireflies: number;
  groundSegments: number;
  /** Render scale (canvas pixels per CSS pixel) the frame starts at, and the range it may adapt in. */
  pixelRatio: { start: number; min: number; max: number };
  /** MSAA samples for the render target (0 disables). */
  msaa: number;
}

/** Cheap heuristic: phones and low-core machines get a lighter scene. */
export function detectQuality(): Quality {
  const cores = navigator.hardwareConcurrency ?? 4;
  const small = Math.min(window.innerWidth, window.innerHeight) < 700;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const low = small || coarse || cores <= 4;
  const dpr = window.devicePixelRatio || 1;

  if (low) {
    return {
      clumps: 3200,
      stars: 1400,
      galaxy: 1100,
      fireflies: 60,
      groundSegments: 96,
      pixelRatio: { start: Math.min(dpr, 0.8), min: 0.5, max: Math.min(dpr, 1) },
      msaa: 0,
    };
  }

  return {
    clumps: 8000,
    stars: 3000,
    galaxy: 2200,
    fireflies: 140,
    groundSegments: 160,
    pixelRatio: { start: Math.min(dpr, 1.25), min: 0.6, max: Math.min(dpr, 1.5) },
    msaa: 4,
  };
}
