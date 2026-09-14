import { useEffect, useRef } from "react";
import { createDreamScene } from "../scene/createDreamScene";
import { readSceneDebugParams } from "../scene/debugParams";

interface DreamSceneProps {
  className?: string;
  /** Called once the first frame is on screen, or immediately when WebGL is unavailable. */
  onReady?: () => void;
}

/** Full-bleed WebGL canvas behind the landing page. Purely decorative. */
export default function DreamScene({ className, onReady }: DreamSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // The scene is created once; a changing callback must not tear it down and rebuild it.
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const handle = createDreamScene(canvas, {
      reducedMotion,
      onReady: () => onReadyRef.current?.(),
      ...readSceneDebugParams(window.location.search),
    });
    if (!handle) onReadyRef.current?.(); // no WebGL: the CSS fallback is all there is to show
    return () => handle?.dispose();
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
