/** Tiny corner readout for tuning: frames per second and the current render scale. */
export interface StatsOverlay {
  update(fps: number, scale: number): void;
  dispose(): void;
}

export function createStatsOverlay(host: HTMLElement): StatsOverlay {
  const box = document.createElement("div");
  Object.assign(box.style, {
    position: "fixed",
    right: "12px",
    bottom: "12px",
    zIndex: "50",
    padding: "6px 10px",
    borderRadius: "6px",
    background: "rgba(0, 0, 0, 0.6)",
    color: "#fad5a5",
    font: "12px/1.4 monospace",
    pointerEvents: "none",
    whiteSpace: "pre",
  } satisfies Partial<CSSStyleDeclaration>);
  host.appendChild(box);

  return {
    update(fps, scale) {
      box.textContent = `${fps.toFixed(0).padStart(3)} fps\nscale ${scale.toFixed(2)}`;
    },
    dispose() {
      box.remove();
    },
  };
}
