/**
 * The boot screen lives in index.html so it paints from the first bytes of the document,
 * before the bundle has even downloaded. The landing page claims it, then dismisses it once
 * the WebGL scene has drawn its first frame, so the fade reveals a finished picture instead
 * of a half-built one.
 */

/** How long the screen stays up at minimum, so a fast load still reads as a deliberate intro. */
const MIN_VISIBLE_MS = 700;
/** Must match the transition on #boot in index.html. */
const FADE_MS = 500;
/** Nothing reported in: show the page anyway rather than sitting on a loader forever. */
const FAILSAFE_MS = 8000;

let claimed = false;
let dismissed = false;

/** Tell the failsafe that a page will dismiss the screen itself when it is ready. */
export function claimBootScreen(): void {
  claimed = true;
}

/** Fade the screen out and remove it. Safe to call more than once, and before the minimum. */
export function dismissBootScreen(): void {
  if (dismissed) return;
  dismissed = true;

  const boot = document.getElementById("boot");
  if (!boot) return;

  // performance.now() is measured from the start of navigation, which is when the screen
  // first painted, so it is exactly the age of what the visitor is looking at.
  window.setTimeout(
    () => {
      boot.classList.add("is-done");
      window.setTimeout(() => boot.remove(), FADE_MS);
    },
    Math.max(0, MIN_VISIBLE_MS - performance.now()),
  );
}

/** Dismiss the screen for pages that never claim it, and for a claim that never arrives. */
export function startBootFailsafe(): void {
  // Runs after the first paint, by which time a mounted page has claimed the screen.
  requestAnimationFrame(() => {
    if (!claimed) dismissBootScreen();
  });
  window.setTimeout(dismissBootScreen, FAILSAFE_MS);
}
