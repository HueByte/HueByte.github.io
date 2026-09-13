// Builds the complete site as deployed to huebyte.github.io:
//   1. this app  -> dist/
//   2. each sub-site (a standalone Vite app elsewhere in the repo) -> dist/<mountPath>/
//
// Every sub-site must set `base: "/<mountPath>/"` in its own vite config, and the same
// prefix must be listed in public/404.html so deep links into it bounce to the right index.
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const appDir = path.resolve(path.dirname(scriptPath), "..");
const repoRoot = path.resolve(appDir, "..");
const distDir = path.join(appDir, "dist");

const subSites = [
  {
    dir: path.join(repoRoot, "Legacy", "v_Mirage"),
    mountPath: "legacy/v_mirage",
  },
];

// `command` is a fixed string, never user input: it goes through a shell so that
// `npm` resolves to npm.cmd on Windows as well.
function run(command, cwd) {
  console.log(`\n> ${command}  (${path.relative(repoRoot, cwd) || "."})`);
  const result = spawnSync(command, { cwd, stdio: "inherit", shell: true });
  if (result.status !== 0) {
    console.error(`\nCommand failed with exit code ${result.status ?? "?"}: ${command}`);
    process.exit(result.status ?? 1);
  }
}

run("npm run build", appDir);

for (const site of subSites) {
  const label = path.relative(repoRoot, site.dir);
  if (!existsSync(path.join(site.dir, "node_modules"))) {
    run("npm ci", site.dir);
  }
  run("npm run build", site.dir);

  const builtIndex = path.join(site.dir, "dist", "index.html");
  if (!readFileSync(builtIndex, "utf8").includes(`/${site.mountPath}/`)) {
    console.error(
      `\n${label} was not built with base "/${site.mountPath}/". ` +
        `Fix \`base\` in its vite config or \`mountPath\` in ${path.relative(appDir, scriptPath)}.`,
    );
    process.exit(1);
  }

  const target = path.join(distDir, ...site.mountPath.split("/"));
  rmSync(target, { recursive: true, force: true });
  mkdirSync(path.dirname(target), { recursive: true });
  cpSync(path.join(site.dir, "dist"), target, { recursive: true });
  console.log(`\nMounted ${label} at /${site.mountPath}/`);
}

console.log(`\nSite assembled in ${path.relative(repoRoot, distDir)}/`);
