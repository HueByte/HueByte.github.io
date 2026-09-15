import { describe, expect, it } from "vitest";
import { articles } from "@/lib/articles";

// Every markdown file in articles/, drafts included: a draft is a post that has not shipped yet.
const sources = import.meta.glob("../../articles/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

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

  it("gives every article a title", () => {
    for (const article of articles) {
      expect(article.title, article.slug + " needs a title").not.toBe("");
    }
  });

  // File names carry no date, and a CI checkout resets every file's mtime, so the frontmatter
  // is the only thing that can order the list. An article without one sorts to the bottom.
  it("dates every article", () => {
    const undated = articles.filter((article) => !ISO_DATE.test(article.date));
    expect(
      undated.map((article) => article.slug),
      "date: YYYY-MM-DD is required",
    ).toEqual([]);
  });

  it("does not put an updated date before the published one", () => {
    const backwards = articles.filter(
      (article) => article.updated && article.updated < article.date,
    );
    expect(
      backwards.map((article) => article.slug),
      "updated precedes date",
    ).toEqual([]);
  });
});
