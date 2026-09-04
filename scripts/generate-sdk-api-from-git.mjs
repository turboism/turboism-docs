#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repository = argumentValue("--repository=") ?? "https://github.com/turboism/Turboism.git";
const sourceRef = argumentValue("--ref=") ?? "main";
const forwarded = process.argv.slice(2).filter(
  (argument) => !argument.startsWith("--repository=") && !argument.startsWith("--ref="),
);

if (!sourceRef || sourceRef.startsWith("-") || /[\u0000-\u001f\u007f]/.test(sourceRef)) {
  throw new Error(`Invalid Turboism source ref: ${JSON.stringify(sourceRef)}`);
}
if (!repository || repository.startsWith("-") || /[\u0000-\u001f\u007f]/.test(repository)) {
  throw new Error(`Invalid Turboism repository: ${JSON.stringify(repository)}`);
}

const temporaryRoot = mkdtempSync(join(tmpdir(), "turboism-sdk-api-"));
const sourceRoot = join(temporaryRoot, "source");

try {
  run("git", ["init", "--quiet", sourceRoot]);
  run("git", ["-C", sourceRoot, "remote", "add", "origin", repository]);
  run("git", ["-C", sourceRoot, "fetch", "--quiet", "--depth=1", "origin", sourceRef]);
  run("git", ["-C", sourceRoot, "checkout", "--quiet", "--detach", "FETCH_HEAD"]);
  const revision = execFileSync("git", ["-C", sourceRoot, "rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
  if (!/^[0-9a-f]{40}$/.test(revision)) {
    throw new Error(`Resolved Turboism revision is invalid: ${revision}`);
  }
  console.log(`Turboism source: ${repository}@${sourceRef} (${revision})`);
  run(process.execPath, [join(scriptDirectory, "sync-sdk-api.mjs"), sourceRoot, ...forwarded]);
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}

function argumentValue(prefix) {
  const matches = process.argv.slice(2).filter((argument) => argument.startsWith(prefix));
  if (matches.length > 1) {
    throw new Error(`Option may only be supplied once: ${prefix}`);
  }
  return matches[0]?.slice(prefix.length);
}

function run(command, arguments_) {
  execFileSync(command, arguments_, { stdio: "inherit" });
}
