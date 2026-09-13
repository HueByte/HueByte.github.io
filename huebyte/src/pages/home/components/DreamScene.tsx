import { useEffect, useRef } from "react";
import { createDreamScene } from "../scene/createDreamScene";
import { readSceneDebugParams } from "../scene/debugParams";

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
    const handle = createDreamScene(canvas, {
      reducedMotion,
      ...readSceneDebugParams(window.location.search),
    });
    return () => handle?.dispose();
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
