import { useEffect, useState, type CSSProperties } from "react";
import { useLocation } from "react-router-dom";
import Sparks from "@/components/Sparks/Sparks";
import "./BlobBackdrop.scss";

// Pages where the menu's corner blob spreads out to become the background.
const BLOB_PAGES = ["/about"];

// The blob outline (see $blob-path) keeps at least this many px between the corner and its edge,
// so scaling it by (viewport diagonal / this) guarantees it covers the whole page.
const BLOB_INNER_RADIUS = 100;

function measureCover() {
  return Math.hypot(window.innerWidth, window.innerHeight) / BLOB_INNER_RADIUS + 1;
}

/** Scale factor that grows the 170x130 corner blob until it covers the viewport. */
function useCoverScale() {
  const [scale, setScale] = useState(measureCover);

  useEffect(() => {
    const update = () => setScale(measureCover());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return scale;
}

/**
 * The menu's corner blob, grown out of the corner until it is the page background on some
 * routes and pulled back into the corner on the others. Lives in the layout so the retract
 * plays over whichever page comes next.
 */
export default function BlobBackdrop() {
  const { pathname } = useLocation();
  const cover = useCoverScale();
  const wantExpanded = BLOB_PAGES.includes(pathname.replace(/\/+$/, "") || "/");

  // Start collapsed and flip after the first paint so a direct visit to /about still animates.
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setExpanded(wantExpanded));
    return () => cancelAnimationFrame(frame);
  }, [wantExpanded]);

  return (
    <div
      className={"blob-backdrop" + (expanded ? " blob-backdrop--expanded" : "")}
      aria-hidden="true"
    >
      <div className="blob-backdrop__blob" style={{ "--cover": cover } as CSSProperties} />
      <div className="blob-backdrop__sky" />
      <Sparks className="blob-backdrop__sparks" count={140} seed={2026} />
    </div>
  );
}
