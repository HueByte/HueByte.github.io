import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "@/App";
import { articles } from "@/lib/articles";

// The landing scene needs WebGL, which jsdom does not have.
vi.mock("@/pages/home/components/DreamScene", () => ({ default: () => null }));

const [first] = articles;

describe("Articles", () => {
  it("lists every article at /articles", async () => {
    window.history.pushState({}, "", "/articles");
    render(<App />);
    expect(await screen.findByRole("heading", { level: 1, name: "Articles" })).toBeInTheDocument();

    for (const article of articles) {
      expect(screen.getByRole("link", { name: article.title })).toHaveAttribute(
        "href",
        "/articles/" + article.slug,
      );
    }
  });

  it("is reachable from the side menu", () => {
    window.history.pushState({}, "", "/");
    render(<App />);
    const menu = screen.getByRole("navigation", { name: "Site" });
    expect(within(menu).getByRole("link", { name: "Articles" })).toHaveAttribute(
      "href",
      "/articles",
    );
  });

  it.skipIf(!first)("renders an article from its markdown file", async () => {
    window.history.pushState({}, "", "/articles/" + first?.slug);
    render(<App />);
    expect(
      await screen.findByRole("heading", { level: 1, name: first?.title }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "all articles" })).toHaveAttribute("href", "/articles");
  });

  it("says so when the slug does not exist", async () => {
    window.history.pushState({}, "", "/articles/not-a-real-article");
    render(<App />);
    expect(
      await screen.findByRole("heading", { level: 1, name: "No such article" }),
    ).toBeInTheDocument();
  });
});
