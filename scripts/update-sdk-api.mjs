#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const docsRoot = resolve(scriptDirectory, "..");
const generation = spawnSync(
  process.execPath,
  [
    join(scriptDirectory, "sync-sdk-api.mjs"),
    "--interactive",
    ...process.argv.slice(2),
  ],
  { stdio: "inherit" },
);

if (generation.error) {
  throw generation.error;
}
if (generation.status !== 0) {
  process.exit(generation.status ?? 1);
}

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
for (const task of ["lint", "typecheck", "build"]) {
  const validation = spawnSync(npm, ["run", task], {
    cwd: docsRoot,
    stdio: "inherit",
  });
  if (validation.error) {
    throw validation.error;
  }
  if (validation.status !== 0) {
    process.exit(validation.status ?? 1);
  }
}

console.log("SDK Javadoc updated and documentation validation passed.");
