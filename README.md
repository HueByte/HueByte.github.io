# huebyte.github.io

Source of [huebyte.github.io](https://huebyte.github.io/).

## Layout

| Path               | What                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| `huebyte/`         | The current site. React 19 + Vite + TypeScript.                                                  |
| `Legacy/v_Mirage/` | The 2022-2026 version, preserved as a standalone app and served at `/legacy/v_mirage/`.          |

Every retired version of the site lives under `Legacy/v_<Name>/` as its own self-contained Vite
app with its own `package.json`. Nothing in `huebyte/` imports from them. They are only built
and copied into the final `dist/` when the whole site is assembled.

## Working on the current site

```sh
cd huebyte
npm install
npm run dev        # http://localhost:3000
```

| Script               | What it does                                                    |
| -------------------- | --------------------------------------------------------------- |
| `npm run dev`        | Vite dev server on port 3000                                    |
| `npm run build`      | Typecheck and build this app only, into `dist/`                 |
| `npm run build:site` | Build this app and every legacy version into one `dist/`        |
| `npm run preview`    | Serve `dist/` locally                                           |
| `npm run check`      | Typecheck, lint (oxlint), format check (prettier), tests (vitest) |
| `npm run test`       | Run tests once (`test:watch` for watch mode)                    |
| `npm run format`     | Format the project with prettier                                |
| `npm run deploy`     | `build:site` then push `dist/` to the `gh-pages` branch         |

## Writing an article

Articles are markdown files in `huebyte/articles/`. Add one, push to `master`, and the deploy
workflow publishes it. There is nothing else to update.

```markdown
---
title: Hello, world
date: 2026-09-15
updated: 2026-09-20
summary: One or two sentences for the list page. Optional.
tags: [meta, rust]
---

The body is GitHub-flavoured markdown, with syntax-highlighted code blocks.
```

- The file name becomes the URL and holds no date: `articles/hello-world.md` is served at
  `/articles/hello-world`.
- `date` is the one required key. The list is ordered by it, newest first, and `npm run check`
  fails if an article is missing it. File modification times cannot stand in: a CI checkout
  resets them all to the moment it cloned.
- `updated` is optional. It shows on the article as "updated ..." and does not affect the order,
  so fixing a typo in an old post leaves the list where readers last saw it.
- A file name starting with `_` is a draft: it stays in the repo and off the site.
  `articles/_template.md` is a copyable starting point.
- No frontmatter key is required. Without `title` the slug is used, and without `summary` the
  first paragraph is.
- `articles/` is excluded from prettier, so `npm run check` will not reformat your prose.
- No em dashes or en dashes. Use a comma, a colon, a semicolon, or two sentences. `npm run check`
  fails and names the file and line if one gets in, drafts included.

## Working on a legacy version

```sh
cd Legacy/v_Mirage
npm install
npm run dev        # http://localhost:3001/legacy/v_mirage/
```

Each legacy app sets `base` in its `vite.config.js` to the path it is mounted at, and passes
the same prefix to its router as `basename`. Its own routes stay written as if it lived at `/`.

## Deploying

Pushing to `master` runs `.github/workflows/deploy.yml`, which installs both apps, runs the
checks, runs `build:site`, and publishes `huebyte/dist` to the `gh-pages` branch. GitHub Pages
serves that branch at the domain root.

Client-side routing on GitHub Pages uses the
[spa-github-pages](https://github.com/rafgraph/spa-github-pages) trick. `huebyte/public/404.html`
is served for any unknown path; it re-encodes the path as a query string and bounces to the
right `index.html`, whose inline script restores the URL before the router mounts. Because
legacy versions ship their own `index.html`, the 404 page knows their prefixes and bounces deep
links into a legacy version to that version's index instead of the main one.

## Retiring the current site into `Legacy/`

1. Move the contents of `huebyte/` to `Legacy/v_<Name>/` and scaffold the new site in `huebyte/`.
2. In the moved app, set `base: "/legacy/v_<name>/"` in its Vite config and pass the same prefix
   (without the trailing slash) as `basename` to its router.
3. Register the mount path in `huebyte/scripts/build-site.mjs` (`subSites`) and in
   `huebyte/public/404.html` (`subSites`).
4. Add it to `legacySites` in `huebyte/src/lib/site.ts` so the new site links to it.
5. Add its `package-lock.json` to `cache-dependency-path` and an install step in the workflow.
