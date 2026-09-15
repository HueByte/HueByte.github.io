import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { siteConfig } from "@/lib/site";
import App from "./App";

// The landing scene needs WebGL, which jsdom does not have.
vi.mock("@/pages/home/components/DreamScene", () => ({ default: () => null }));

describe("App", () => {
  it("renders the landing page", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: "HueByte" })).toBeInTheDocument();
  });

  it("keeps the previous version of the site reachable from the menu", () => {
    render(<App />);
    const link = screen.getByRole("link", { name: /mirage/i });
    expect(link).toHaveAttribute("href", "/legacy/v_mirage/");
  });

  it("orbits every hero link around the avatar, in configured order", () => {
    render(<App />);
    const links = screen.getByRole("list", { name: "Links" });
    const names = Array.from(links.querySelectorAll("a")).map((a) => a.getAttribute("aria-label"));
    expect(names).toEqual(siteConfig.heroLinks.map((link) => link.label));
    expect(screen.getAllByRole("link", { name: "About me" })[0]).toHaveAttribute("href", "/about");
  });
});
