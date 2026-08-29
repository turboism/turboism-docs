import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
let sourceArgument;
let sync = false;
let approvedPublicSurface = false;
let expectedVersion;

for (const argument of args) {
  if (argument === "--sync") {
    sync = true;
  } else if (argument === "--approved-public-surface") {
    approvedPublicSurface = true;
  } else if (argument.startsWith("--expected-version=")) {
    expectedVersion = argument.slice("--expected-version=".length).trim();
  } else if (argument.startsWith("--")) {
    throw new Error(`Unknown option: ${argument}`);
  } else if (sourceArgument === undefined) {
    sourceArgument = argument;
  } else {
    throw new Error(`Unexpected argument: ${argument}`);
  }
}

const configuredSource = sourceArgument ?? process.env.TURBOISM_SOURCE_ROOT;
if (!configuredSource) {
  throw new Error(
    "Pass the Turboism source directory or set TURBOISM_SOURCE_ROOT.",
  );
}

const sourceRoot = resolve(configuredSource);
const gradle = join(sourceRoot, "gradlew");

if (!existsSync(gradle)) {
  throw new Error(`Turboism source repository not found: ${sourceRoot}`);
}

if (sync && !expectedVersion) {
  throw new Error("--sync requires --expected-version=<version>.");
}
if (sync && !approvedPublicSurface) {
  throw new Error(
    "--sync requires --approved-public-surface after reviewing the generated public API.",
  );
}

const worktreeId = process.env.TURBOISM_WORKTREE_ID ?? "docs-sdk-api";
const environment = {
  ...process.env,
  TURBOISM_WORKTREE_ID: worktreeId,
};

execFileSync(
  gradle,
  [
    ":sdk:javadoc",
    "-PturboismRelease=true",
    "--no-daemon",
    "--console=plain",
  ],
  {
    cwd: sourceRoot,
    env: environment,
    stdio: "inherit",
  },
);

const generated = join(
  sourceRoot,
  "build",
  "worktree",
  worktreeId,
  "sdk",
  "docs",
  "javadoc",
);
const generatedIndex = join(generated, "index.html");

if (!existsSync(generatedIndex)) {
  throw new Error(`Generated SDK Javadoc is missing: ${generated}`);
}

const index = readFileSync(generatedIndex, "utf8");
if (!index.includes("dev.turboism.sdk")) {
  throw new Error("Generated SDK Javadoc index does not contain the SDK package name");
}
if (index.includes("-SNAPSHOT")) {
  throw new Error("Generated SDK Javadoc still contains a SNAPSHOT version.");
}
if (expectedVersion && !index.includes(`sdk ${expectedVersion} API`)) {
  throw new Error(
    `Generated SDK Javadoc does not identify itself as sdk ${expectedVersion} API.`,
  );
}

console.log(`Generated SDK Javadoc: ${generated}`);

if (!sync) {
  console.log(
    "Generation complete. Review the public type surface and version before syncing.",
  );
  process.exit(0);
}

const output = join(docsRoot, "public", "api", "sdk");
rmSync(output, { recursive: true, force: true });
mkdirSync(dirname(output), { recursive: true });
cpSync(generated, output, { recursive: true });

const outputIndex = readFileSync(join(output, "index.html"), "utf8");
if (!outputIndex.includes(`sdk ${expectedVersion} API`)) {
  throw new Error("Synced SDK Javadoc failed its version check.");
}

console.log(`SDK Javadoc synced to ${output}`);
