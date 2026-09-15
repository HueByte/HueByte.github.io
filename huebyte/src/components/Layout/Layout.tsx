import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useLocation, type Location } from "react-router-dom";
import BlobBackdrop, {
  BLOB_EXPAND_MS,
  BLOB_RETRACT_MS,
} from "@/components/BlobBackdrop/BlobBackdrop";
import Nav from "@/components/Nav/Nav";
import { isBlobPage } from "@/lib/site";
import "./Layout.scss";

interface LayoutProps {
  /** Renders the page for a location. Called once for the current page and once for a held one. */
  children: (location: Location) => ReactNode;
}

interface HeldPage {
  location: Location;
  /** Where the page was scrolled to when it was left, so it does not jump while held. */
  scrollY: number;
  ms: number;
}

interface Pages {
  current: Location;
  held: HeldPage | null;
  /** True when the blob has to spread over this page before it can be seen. */
  covered: boolean;
}

/** True when arriving here means waiting for the blob to spread out first. */
function isCovered(from: string | null, to: string): boolean {
  // On a first load the blob starts in the corner and expands, so a blob page is covered too.
  return isBlobPage(to) && (from === null || !isBlobPage(from));
}

/** How long to keep the page being left on screen, if the blob has to cover or uncover it. */
function holdFor(from: string, to: string): number {
  const toBlob = isBlobPage(to);
  if (isBlobPage(from) === toBlob) return 0;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return 0;
  return toBlob ? BLOB_EXPAND_MS : BLOB_RETRACT_MS;
}

/**
 * Shared frame around every page. Footer belongs here once it exists.
 *
 * When a route change makes the BlobBackdrop spread out or pull back, the page being left stays
 * mounted (same instance, so the landing scene keeps running) in a fixed wrapper for the length
 * of that transition, so the blob visibly covers or uncovers it instead of it vanishing first.
 */
export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [pages, setPages] = useState<Pages>(() => ({
    current: location,
    held: null,
    covered: isCovered(null, location.pathname),
  }));

  // Decided during render, never in an effect: the old page must not unmount for even a frame.
  if (pages.current.pathname !== location.pathname) {
    const ms = holdFor(pages.current.pathname, location.pathname);
    setPages({
      current: location,
      held: ms > 0 ? { location: pages.current, scrollY: window.scrollY, ms } : null,
      covered: isCovered(pages.current.pathname, location.pathname),
    });
  }

  const { current, held, covered } = pages;

  useEffect(() => {
    if (!held) return;
    const timer = window.setTimeout(
      () => setPages((p) => (p.held === held ? { ...p, held: null } : p)),
      held.ms,
    );
    return () => window.clearTimeout(timer);
  }, [held]);

  // The incoming page starts at the top; the held one keeps the scroll offset it was left at.
  const heldRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [current.pathname]);
  useLayoutEffect(() => {
    if (held && heldRef.current) heldRef.current.scrollTop = held.scrollY;
  }, [held]);

  // Keyed by path so React keeps the held page's instance when its role changes.
  const slots = [
    { key: current.pathname, location: current, held: null as HeldPage | null },
    ...(held ? [{ key: held.location.pathname, location: held.location, held }] : []),
  ];

  return (
    <div className="app-shell">
      <Nav />
      <BlobBackdrop />
      <main className="app-main">
        {slots.map((slot) =>
          slot.held ? (
            <div
              key={slot.key}
              ref={heldRef}
              className={
                "app-page app-page--held" + (isBlobPage(slot.key) ? " app-page--held-over" : "")
              }
              inert
              aria-hidden="true"
            >
              {children(slot.location)}
            </div>
          ) : (
            <div key={slot.key} className={"app-page" + (covered ? " app-page--covered" : "")}>
              {children(slot.location)}
            </div>
          ),
        )}
      </main>
    </div>
  );
}
