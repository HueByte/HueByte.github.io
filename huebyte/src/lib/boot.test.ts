import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The module keeps its own "claimed"/"dismissed" state, so each test imports a fresh copy.
async function freshBoot() {
  vi.resetModules();
  return import("./boot");
}

function addBootElement(): HTMLElement {
  const boot = document.createElement("div");
  boot.id = "boot";
  document.body.appendChild(boot);
  return boot;
}

describe("boot screen", () => {
  beforeEach(() => {
    // "performance" is faked too: the module measures the screen's age with performance.now().
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "performance"] });
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps the screen up briefly, then fades it out and removes it", async () => {
    const { dismissBootScreen } = await freshBoot();
    const boot = addBootElement();

    dismissBootScreen();
    vi.advanceTimersByTime(699);
    expect(boot.classList.contains("is-done")).toBe(false); // still inside the minimum

    vi.advanceTimersByTime(1); // the minimum the screen stays visible
    expect(boot.classList.contains("is-done")).toBe(true);
    expect(boot.isConnected).toBe(true); // still fading

    vi.advanceTimersByTime(500); // the fade
    expect(boot.isConnected).toBe(false);
  });

  it("dismisses the screen for a page that never claims it", async () => {
    const { startBootFailsafe } = await freshBoot();
    const boot = addBootElement();
    const frame = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });

    startBootFailsafe();
    vi.advanceTimersByTime(2000);
    expect(boot.isConnected).toBe(false);

    frame.mockRestore();
  });

  it("leaves a claimed screen to the page that claimed it", async () => {
    const { claimBootScreen, startBootFailsafe } = await freshBoot();
    const boot = addBootElement();
    const frame = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });

    claimBootScreen();
    startBootFailsafe();
    vi.advanceTimersByTime(2000);
    expect(boot.isConnected).toBe(true);

    frame.mockRestore();
  });
});
