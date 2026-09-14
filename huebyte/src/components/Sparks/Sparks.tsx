import { useMemo, type CSSProperties } from "react";
import { mulberry32 } from "@/lib/random";
import "./Sparks.scss";

const COLORS = ["#ffe9c4", "#ffe9c4", "#ffe9c4", "#fff6e6", "#c62368", "#00fa9a"];

interface Spark {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

interface SparksProps {
  count: number;
  /** PRNG seed; the same seed always gives the same sky. */
  seed: number;
  /** Region of the parent the sparks may land in, in percent. Defaults to the whole box. */
  area?: { x: [number, number]; y: [number, number] };
  className?: string;
}

function makeSparks(count: number, seed: number, area: NonNullable<SparksProps["area"]>): Spark[] {
  const rand = mulberry32(seed);
  const [x0, x1] = area.x;
  const [y0, y1] = area.y;
  return Array.from({ length: count }, () => ({
    x: x0 + rand() * (x1 - x0),
    y: y0 + rand() * (y1 - y0),
    size: 1.5 + rand() * rand() * 2.5,
    color: COLORS[Math.floor(rand() * COLORS.length)] ?? "#ffe9c4",
    delay: -rand() * 6,
    duration: 2.4 + rand() * 3.2,
  }));
}

const FULL: NonNullable<SparksProps["area"]> = { x: [0, 100], y: [0, 100] };

/** Twinkling dots scattered over the parent. Deterministic, so they never reshuffle. */
export default function Sparks({ count, seed, area = FULL, className }: SparksProps) {
  const sparks = useMemo(() => makeSparks(count, seed, area), [count, seed, area]);

  return (
    <div className={"sparks" + (className ? " " + className : "")} aria-hidden="true">
      {sparks.map((spark, i) => (
        <span
          key={i}
          className="sparks__spark"
          style={
            {
              left: spark.x + "%",
              top: spark.y + "%",
              "--size": spark.size + "px",
              "--color": spark.color,
              "--delay": spark.delay + "s",
              "--duration": spark.duration + "s",
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
