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
