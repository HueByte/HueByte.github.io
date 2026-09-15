import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "@/lib/frontmatter";

describe("parseFrontmatter", () => {
  it("reads keys and returns the body below them", () => {
    const { data, body } = parseFrontmatter(
      ["---", 'title: "Hello, world"', "date: 2026-09-15", "---", "", "Body text."].join("\n"),
    );
    expect(data.title).toBe("Hello, world");
    expect(data.date).toBe("2026-09-15");
    expect(body.trim()).toBe("Body text.");
  });

  it("reads inline and block lists", () => {
    const inline = parseFrontmatter(["---", "tags: [meta, rust]", "---", "x"].join("\n"));
    expect(inline.data.tags).toEqual(["meta", "rust"]);

    const block = parseFrontmatter(["---", "tags:", "  - meta", "  - rust", "---", "x"].join("\n"));
    expect(block.data.tags).toEqual(["meta", "rust"]);
  });

  it("ignores comments and blank lines", () => {
    const { data } = parseFrontmatter(["---", "# a note", "", "title: A", "---", "x"].join("\n"));
    expect(data).toEqual({ title: "A" });
  });

  it("treats a file without a frontmatter block as all body", () => {
    const { data, body } = parseFrontmatter("# Just markdown\n");
    expect(data).toEqual({});
    expect(body).toBe("# Just markdown\n");
  });
});
