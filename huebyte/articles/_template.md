---
title: Title of the article
date: 2026-01-01
updated: 2026-01-02
summary: One or two sentences for the list page. Optional; the first paragraph is used instead.
tags: [tag, another-tag]
---

The body is plain GitHub-flavoured markdown: headings, lists, tables, task lists, images,
`inline code` and fenced code blocks with syntax highlighting.

## A heading

Copy this file to `articles/<name>.md` and start writing. The file name becomes the URL, with
no date in it. The leading underscore in this file name keeps it out of the article list, so it
is also how you park a draft.

`date` is the only required key: the list is ordered by it, newest first. `updated` is optional,
shows on the article as "updated ...", and deliberately does not change the order. Drop it until
you actually revise something.

No em dashes and no en dashes. Use a comma, a colon, a semicolon, or two sentences instead.
`npm run check` fails and names the line if one slips in.
