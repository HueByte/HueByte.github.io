# AGENTS.md

This file provides guidance to coding agents (Codex, Claude Code and others) when working with code in this repository.

## Repository layout

Two independent apps live here. Each has its own `package.json`, lockfile and `node_modules`.

- `huebyte/` - the current site. React 19 + Vite + TypeScript. Served at `/`.
- `Legacy/v_Mirage/` - the 2022-2026 site (React 19 + Vite, plain JSX), preserved as-is. Served at `/legacy/v_mirage/`.

Retired versions follow the pattern `Legacy/v_<Name>/` and are always self-contained Vite apps. `huebyte/` never imports from them; they are only built and copied into `huebyte/dist/<mountPath>/` by `huebyte/scripts/build-site.mjs`. See the root `README.md` for the retire checklist.

## Development Commands

**Working Directory**: run these inside `huebyte/` unless stated otherwise.

- `npm run dev` (or `npm start`) - Vite dev server on port 3000
- `npm run build` - `tsc -b` then `vite build`, this app only, into `dist/`
- `npm run build:site` - this app plus every legacy app, assembled into one `dist/`
- `npm run check` - typecheck, oxlint, prettier check, vitest (what CI runs)
- `npm run test` / `npm run test:watch` - vitest
- `npm run lint`, `npm run format`, `npm run format:check`, `npm run typecheck`
- `npm run preview` - serve `dist/` locally
- `npm run deploy` - `build:site` then push `dist/` to `gh-pages` (CI normally does this)

Legacy app (`cd Legacy/v_Mirage`): `npm run dev` serves `http://localhost:3001/legacy/v_mirage/`; `npm run build` outputs `dist/`.

## huebyte/ conventions

- TypeScript strict. `@/` aliases `src/` (declared in both `tsconfig.app.json` `paths` and `vite.config.ts` `resolve.alias`; keep them in sync).
- Routing: React Router v7. Routes live in `src/router/routes.tsx`. `Home` is imported eagerly; every other page is `React.lazy()`. `src/components/Layout/Layout.tsx` wraps all pages (Nav and Footer go there).
- Styles: SCSS with `@use`. Tokens in `src/styles/_theme.scss` (`$maron: #c62368`, `$swamp: #001220` carried over from Mirage), globals in `src/styles/global.scss`. Component styles sit next to the component and `@use "@/styles/theme"`.
- Site constants (name, GitHub user, `heroLinks`, `legacySites`) live in `src/lib/site.ts`.
- Landing page (`src/pages/home/`): a full-viewport three.js "dream field" (`scene/`) behind an HTML hero (`components/AvatarOrbit.tsx`: avatar in a morphing blob, link blobs orbiting it). `DreamScene.tsx` is lazy so three.js never blocks first paint.
  - `scene/createDreamScene.ts` owns renderer, camera, bloom composer, loop, resize, pointer parallax, pause on hidden tab, `prefers-reduced-motion` (single still frame) and disposal. Everything else returns a `SceneObject` with its own `dispose()`.
  - `scene/shaders.ts` holds the shared GLSL (simplex noise, terrain) and the JS twin of `terrainBase`; keep the two in sync. `scene/quality.ts` picks blade/star/galaxy counts per device.
  - `scene/grass.ts` builds any instanced grass from a `plant()` callback: the near field (`createFieldGrass`) and the far LOD of ~1k large tufts on the mountain crests (`createRidgeGrass`). `scene/mountains.ts` exports the ridge shape (`RIDGES`, `ridgeTop`) the tufts stand on. `scene/galaxy.ts` is the slowly turning spiral; the burgundy moon is a shader plane in `scene/sky.ts`.
- Side menu: `src/components/Nav/Nav.tsx` (slide-in panel, modelled on the Mirage menu), entries from `navLinks` in `src/lib/site.ts`. Mounted in `Layout.tsx`.
  - Look is tuned by constants in the shaders and `createDreamScene.ts` (exposure, bloom, fog colour, grass colours). Bloom is easy to overexpose; check a screenshot after changing brightness.
  - The avatar is bundled at `src/assets/avatar.png` (the GitHub avatar).
- Tests: vitest + Testing Library on jsdom. Setup in `src/test/setup.ts`; tests are colocated as `*.test.tsx`.
- Lint: oxlint (`.oxlintrc.json`). Format: prettier (`printWidth: 100`, otherwise defaults).

## Legacy/v_Mirage/ rules

- Preserve behaviour and look exactly. Touch it only for build or hosting fixes.
- `base` in `vite.config.js` is `/legacy/v_mirage/`; `src/App.jsx` derives the router `basename` from `import.meta.env.BASE_URL`. All routes and links inside stay written as if the app lived at `/`.
- The menu has one addition over the original: a plain `<a href="/">New site</a>` that leaves the sub-site.
- The GitHub API is called unauthenticated (60 req/hour/IP); `useGitHubData` caches in sessionStorage for 30 minutes and surfaces an `error` state. Preserve both.

## GitHub Pages deployment

- `.github/workflows/deploy.yml` runs on push to `master`: `npm ci` in both apps, `npm run check`, `npm run build:site`, then publishes `huebyte/dist` to `gh-pages` (peaceiris/actions-gh-pages).
- Client-side routing uses the spa-github-pages pattern. `huebyte/public/404.html` holds a `subSites` list of mount prefixes; a deep link into a sub-site bounces to that sub-site's `index.html` (`/legacy/v_mirage/?/projects/...`), anything else bounces to the main `index.html` (`/?/repositories`). Each `index.html` has the inline restore script.
- Adding a sub-site means updating all of: `subSites` in `public/404.html`, `subSites` in `scripts/build-site.mjs`, `legacySites` in `src/lib/site.ts`, and the install and cache steps in the workflow.
- Test routing changes against `/some-route`, `/legacy/v_mirage/` and `/legacy/v_mirage/projects/MyThingsSaver`.
