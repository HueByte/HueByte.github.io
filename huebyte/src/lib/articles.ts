import { parseFrontmatter, type FrontmatterValue } from "@/lib/frontmatter";

/**
 * Articles are plain markdown files in `huebyte/articles/`. Vite reads that folder at build
 * time, so publishing is: add or edit a file, push to master, and the deploy workflow ships it.
 *
 * They are inlined rather than fetched from the GitHub API at runtime because the site is
 * rebuilt on every push anyway: inlining costs no request, has no rate limit, survives GitHub
 * being slow, and renders on the first paint instead of after a spinner. If articles ever need
 * to land without a rebuild, this file is the only one that has to change.
 *
 * The cost is that every article body ships with the index page. That is a few kB today; past
 * roughly fifty posts the glob should go lazy, with the frontmatter kept in a generated index.
 */
const sources = import.meta.glob("../../articles/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export interface Article {
  /** URL segment: the file name without its extension, unless frontmatter overrides it. */
  slug: string;
  title: string;
  /** ISO `YYYY-MM-DD` the article was published. The only thing the list is ordered by. */
  date: string;
  /** ISO `YYYY-MM-DD` of the last meaningful edit, if the file declares one. */
  updated: string;
  summary: string;
  tags: string[];
  /** The markdown below the frontmatter. */
  body: string;
  readingMinutes: number;
}

/** Average adult prose speed; close enough for a "5 min read" badge. */
const WORDS_PER_MINUTE = 220;
const FILE_NAME = /([^/]+)\.md$/;

function asText(value: FrontmatterValue | undefined): string {
  if (typeof value === "string") return value;
  return value?.join(", ") ?? "";
}

function asList(value: FrontmatterValue | undefined): string[] {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function countWords(markdown: string): number {
  return markdown.split(/\s+/).filter(Boolean).length;
}

/** First paragraph of the body, used when a file has no `summary` of its own. */
function firstParagraph(markdown: string): string {
  for (const block of markdown.split(/\r?\n[ \t]*\r?\n/)) {
    const text = block.trim();
    if (!text || text.startsWith("#") || text.startsWith("```")) continue;
    return text.replace(/\s+/g, " ");
  }
  return "";
}

function toArticle(path: string, source: string): Article | null {
  const fileName = FILE_NAME.exec(path)?.[1];
  if (!fileName) return null;

  // Drafts: a leading underscore keeps a file in the repo but off the site.
  if (fileName.startsWith("_")) return null;

  const { data, body } = parseFrontmatter(source);
  const slug = asText(data.slug) || fileName;

  return {
    slug,
    title: asText(data.title) || slug,
    date: asText(data.date),
    updated: asText(data.updated),
    summary: asText(data.summary) || firstParagraph(body),
    tags: asList(data.tags),
    body,
    readingMinutes: Math.max(1, Math.round(countWords(body) / WORDS_PER_MINUTE)),
  };
}

/**
 * Every article, newest published first, with undated files last and ties broken by title.
 *
 * Ordering is by `date`, never by `updated`: fixing a typo in a two-year-old post should not
 * throw it back to the top of the list, and a reader who has seen the list before should find
 * it in the same order. `updated` is shown on the article instead. This is what most blogs do.
 */
export const articles: Article[] = Object.entries(sources)
  .map(([path, source]) => toArticle(path, source))
  .filter((article): article is Article => article !== null)
  .sort(
    (a, b) =>
      Number(!a.date) - Number(!b.date) ||
      b.date.localeCompare(a.date) ||
      a.title.localeCompare(b.title),
  );

export function getArticle(slug: string | undefined): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

/** `2026-09-15` as `15 September 2026`. Returns "" for an article with no date. */
export function formatArticleDate(date: string): string {
  if (!date) return "";
  const parsed = new Date(date + "T00:00:00Z");
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
