---
title: How this section works
date: 2026-09-15
summary: A placeholder first post, and a short note on how articles get published here.
tags: [meta]
---

So basically I never done blogs before, but I want to have a place to write down thoughts and ideas.

## Publishing

Articles are markdown files in `articles/` in this repo. Each one starts with a small block of
frontmatter:

```yaml
---
title: How this section works
date: 2026-09-15
updated: 2026-09-16
summary: A short blurb for the list.
tags: [meta]
---
```

`date` is required and orders the list. `updated` is optional and only shows on the article,
so correcting an old post does not shove it back to the top.

Vite reads the folder at build time, so publishing is a push to `master`, and the deploy
workflow does the rest. Nothing is fetched at runtime, so there is no API to rate-limit and no
spinner before the text appears.

## Conventions

The file name becomes the URL and carries no date: `hello-world.md` is served at
`/articles/hello-world`. A file name starting with an underscore stays in the repo and off the
site, which is how drafts work.

The body is GitHub-flavoured markdown: headings, lists, tables, task lists, images, quotes,
`inline code` and fenced code blocks with syntax highlighting.

## What it looks like

Everything below is here to show the styling, not to say anything.

Body text sits at a comfortable measure with **bold**, *italic*, `inline code` and
[links](/about) picked out in the accent colour. Lists come in both flavours:

- a bullet
- another bullet
- one more, for the shape of it

1. first
2. second
3. third

> A quote is set in italics behind a gold rule, for when someone else said it better.

Code blocks are highlighted in the same palette as the rest of the site:

```ts readingMinutes.ts
export function readingMinutes(markdown: string): number {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
```

Tables scroll sideways rather than widening the page:

| Element  | Where it comes from | Styled in      |
| -------- | ------------------- | -------------- |
| Headings | markdown            | `Articles.scss` |
| Code     | rehype-highlight    | `.hljs-*`      |
| Tags     | frontmatter         | `.meta__tag`   |

Task lists work too:

- [x] render markdown
- [x] highlight code
- [ ] write something worth reading

---

And a rule closes it off.
