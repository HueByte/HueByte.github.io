import { describe, expect, it } from "vitest";
import { articles } from "@/lib/articles";

// Every markdown file in articles/, drafts included: a draft is a post that has not shipped yet.
const sources = import.meta.glob("../../articles/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

/** Characters banned from article prose, with what to write instead. */
const banned = [
  { name: "em dash", char: "—", instead: "a comma, a colon, a semicolon, or two sentences" },
  { name: "en dash", char: "–", instead: "a hyphen in ranges, or rewrite the sentence" },
];

function locate(char: string): string[] {
  return Object.entries(sources).flatMap(([path, source]) =>
    source
      .split(/\r?\n/)
      .flatMap((line, index) => (line.includes(char) ? [shorten(path) + ":" + (index + 1)] : [])),
  );
}

function shorten(path: string): string {
  return path.replace(/^(\.\.\/)+/, "");
}

describe("article markdown", () => {
  for (const { name, char, instead } of banned) {
    it("never uses an " + name, () => {
      expect(locate(char), "no " + name + " in an article; use " + instead).toEqual([]);
    });
  }

  it("gives every article a title and a slug", () => {
    for (const article of articles) {
      expect(article.slug, "an article needs a slug").not.toBe("");
      expect(article.title, article.slug + " needs a title").not.toBe("");
    }
  });
});
