// A very small YAML-subset parser for the `---` block at the top of an article.
//
// Supports exactly what the article frontmatter needs and nothing else: `key: value`, inline
// lists (`tags: [a, b]`), block lists (`tags:` then `  - a`), `#` comments and optional quotes.
// A real YAML parser would be a dependency and a bundle for four keys.

export type FrontmatterValue = string | string[];

export interface Frontmatter {
  data: Record<string, FrontmatterValue>;
  body: string;
}

const FENCE = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;

/** Strips surrounding single or double quotes, if the value is wrapped in a matching pair. */
function unquote(raw: string): string {
  const value = raw.trim();
  const quote = value[0];
  if ((quote === '"' || quote === "'") && value.length > 1 && value.endsWith(quote)) {
    return value.slice(1, -1);
  }
  return value;
}

function splitInlineList(raw: string): string[] {
  return raw
    .slice(1, -1)
    .split(",")
    .map(unquote)
    .filter((item) => item.length > 0);
}

/** Splits a source file into its frontmatter keys and the markdown below them. */
export function parseFrontmatter(source: string): Frontmatter {
  const text = source.replace(/^﻿/, "");
  const match = FENCE.exec(text);
  if (!match?.[1]) return { data: {}, body: text.trimStart() };

  const data: Record<string, FrontmatterValue> = {};
  // The key an indented `- item` line would belong to.
  let listKey: string | null = null;

  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;

    const item = /^[ \t]*-[ \t]+(.*)$/.exec(line);
    if (item && listKey) {
      (data[listKey] as string[]).push(unquote(item[1] ?? ""));
      continue;
    }

    const pair = /^([A-Za-z0-9_-]+)[ \t]*:[ \t]*(.*)$/.exec(line);
    if (!pair?.[1]) continue;

    const key = pair[1];
    const value = (pair[2] ?? "").trim();

    if (value === "") {
      // Either an empty value or the header of a block list; the next line decides.
      data[key] = [];
      listKey = key;
    } else if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = splitInlineList(value);
      listKey = null;
    } else {
      data[key] = unquote(value);
      listKey = null;
    }
  }

  // A key that opened a block list but never got one reads better as an empty string.
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value) && value.length === 0) data[key] = "";
  }

  return { data, body: text.slice(match[0].length) };
}
