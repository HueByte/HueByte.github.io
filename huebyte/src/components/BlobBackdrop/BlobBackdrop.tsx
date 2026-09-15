import { useEffect, useState, type CSSProperties } from "react";
import { useLocation } from "react-router-dom";
import Sparks from "@/components/Sparks/Sparks";
import { isBlobPage } from "@/lib/site";
import "./BlobBackdrop.scss";

/** How long the blob takes to spread over the page. The layout holds the page being left this long. */
export const BLOB_EXPAND_MS = 1100;
/** How long it takes to pull back into the corner. */
export const BLOB_RETRACT_MS = 900;

// The blob outline (see $blob-path) keeps at least this many px between the corner and its edge,
// so scaling it by (viewport diagonal / this) guarantees it covers the whole page.
const BLOB_INNER_RADIUS = 100;

// Star density: one spark per this many CSS pixels of viewport, within these bounds. A flat
// count packed a phone screen as tightly as a desktop one.
const PX_PER_SPARK = 14000;
const MIN_SPARKS = 24;
const MAX_SPARKS = 180;

function measureViewport() {
  return { width: window.innerWidth, height: window.innerHeight };
}

function useViewport() {
  const [size, setSize] = useState(measureViewport);

  useEffect(() => {
    const update = () => setSize(measureViewport());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}

/**
 * The menu's corner blob, grown out of the corner until it is the page background on some
 * routes and pulled back into the corner on the others. Lives in the layout so the retract
 * plays over whichever page comes next.
 */
export default function BlobBackdrop() {
  const { pathname } = useLocation();
  const { width, height } = useViewport();
  // Scale factor that grows the 170x130 corner blob until it covers the viewport.
  const cover = Math.hypot(width, height) / BLOB_INNER_RADIUS + 1;
  const sparkCount = Math.min(
    MAX_SPARKS,
    Math.max(MIN_SPARKS, Math.round((width * height) / PX_PER_SPARK)),
  );
  const wantExpanded = isBlobPage(pathname);

  // Start collapsed and flip after the first paint so a direct visit to /about still animates.
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setExpanded(wantExpanded));
    return () => cancelAnimationFrame(frame);
  }, [wantExpanded]);

  return (
    <div
      className={"blob-backdrop" + (expanded ? " blob-backdrop--expanded" : "")}
      style={
        {
          "--cover": cover,
          "--blob-expand": BLOB_EXPAND_MS + "ms",
          "--blob-retract": BLOB_RETRACT_MS + "ms",
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <div className="blob-backdrop__blob" />
      <div className="blob-backdrop__sky" />
      <Sparks className="blob-backdrop__sparks" count={sparkCount} seed={2026} />
    </div>
  );
}
