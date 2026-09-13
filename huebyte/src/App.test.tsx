import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

// The landing scene needs WebGL, which jsdom does not have.
vi.mock("@/pages/home/components/DreamScene", () => ({ default: () => null }));

describe("App", () => {
  it("renders the landing page", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: "HueByte" })).toBeInTheDocument();
  });

  it("links to the previous version of the site", () => {
    render(<App />);
    const link = screen.getByRole("link", { name: /previous site/i });
    expect(link).toHaveAttribute("href", "/legacy/v_mirage/");
  });
});
