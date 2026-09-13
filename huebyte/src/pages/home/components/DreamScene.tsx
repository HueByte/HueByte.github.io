import { useEffect, useRef } from "react";
import { createDreamScene } from "../scene/createDreamScene";

interface DreamSceneProps {
  className?: string;
}

/** Full-bleed WebGL canvas behind the landing page. Purely decorative. */
export default function DreamScene({ className }: DreamSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Debug hooks: `?still=12` renders one frame at t = 12 s so two loads can be diffed;
    // `?a2c=0`, `?bloom=0`, `?fireflies=0` switch those parts off to isolate an artefact.
    const params = new URLSearchParams(window.location.search);
    const stillParam = params.get("still");
    const stillTime = stillParam === null ? undefined : Number(stillParam);
    const flag = (name: string) => (params.has(name) ? params.get(name) !== "0" : undefined);
    const handle = createDreamScene(canvas, {
      reducedMotion,
      stillTime: Number.isFinite(stillTime) ? stillTime : undefined,
      debug: { softEdges: flag("a2c"), bloom: flag("bloom"), fireflies: flag("fireflies") },
    });
    return () => handle?.dispose();
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
