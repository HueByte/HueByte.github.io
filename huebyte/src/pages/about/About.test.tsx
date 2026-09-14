import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "@/App";

// The landing scene needs WebGL, which jsdom does not have.
vi.mock("@/pages/home/components/DreamScene", () => ({ default: () => null }));

describe("About page", () => {
  it("renders at /about", async () => {
    window.history.pushState({}, "", "/about");
    render(<App />);
    expect(await screen.findByRole("heading", { level: 1, name: "HueByte" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Who I am" })).toBeInTheDocument();
  });

  it("is reachable from the side menu", () => {
    window.history.pushState({}, "", "/");
    render(<App />);
    const menu = screen.getByRole("navigation", { name: "Site" });
    expect(within(menu).getByRole("link", { name: "About me" })).toHaveAttribute("href", "/about");
  });
});
