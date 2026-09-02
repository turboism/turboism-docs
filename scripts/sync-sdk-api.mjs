import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
let sourceArgument;
let sync = false;
let interactive = false;
let approvedPublicSurface = false;
let approvedPreviewSurface = false;
let expectedVersion;

for (const argument of args) {
  if (argument === "--sync") {
    sync = true;
  } else if (argument === "--interactive") {
    interactive = true;
    sync = true;
  } else if (argument === "--approved-public-surface") {
    approvedPublicSurface = true;
  } else if (argument === "--approved-preview-surface") {
    approvedPreviewSurface = true;
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

const conventionalSourceCandidates = [];
let currentDirectory = docsRoot;
while (true) {
  conventionalSourceCandidates.push(
    join(currentDirectory, "turboism"),
    resolve(currentDirectory, "..", "turboism"),
  );
  const parent = dirname(currentDirectory);
  if (parent === currentDirectory) {
    break;
  }
  currentDirectory = parent;
}

const sourceCandidates = [
  sourceArgument,
  process.env.TURBOISM_SOURCE_ROOT,
  ...conventionalSourceCandidates,
].filter(Boolean);
const sourceRoot = sourceCandidates
  .map((candidate) => resolve(candidate))
  .find((candidate) => existsSync(join(candidate, "gradlew")));

if (!sourceRoot) {
  throw new Error(
    "Turboism source repository not found. Pass its directory or set TURBOISM_SOURCE_ROOT.",
  );
}

const gradle = join(sourceRoot, "gradlew");
const versionFile = join(sourceRoot, "gradle", "common-java.gradle.kts");
if (!existsSync(versionFile)) {
  throw new Error(`Turboism version source is missing: ${versionFile}`);
}

const versionSource = readFileSync(versionFile, "utf8");
const versionMatch = versionSource.match(
  /rootProject\.extra\["turboismFrameworkVersion"\]\s*=\s*"([^"]+)"/,
);
if (!versionMatch) {
  throw new Error("Unable to read turboismFrameworkVersion from the source tree.");
}

const sourceVersion = versionMatch[1];
if (expectedVersion && expectedVersion !== sourceVersion) {
  throw new Error(
    `Expected version ${expectedVersion} does not match source version ${sourceVersion}.`,
  );
}
expectedVersion ??= sourceVersion;

if (sync && !interactive && !approvedPublicSurface) {
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
if (!index.includes(`sdk ${expectedVersion} API`)) {
  throw new Error(
    `Generated SDK Javadoc does not identify itself as sdk ${expectedVersion} API.`,
  );
}

const textExtensions = new Set([".css", ".html", ".js", ".json", ".txt"]);
const blockedContent = [
  ["snapshot version", /-SNAPSHOT/i],
  ["local workspace path", /(?:^|[\s"'(=])\/workspace\//m],
  ["local home path", /(?:^|[\s"'(=])\/home\//m],
  ["PreviewApi", /\bPreviewApi\b/],
  ["private Cubism reference", /\bcubism-ref\//],
  ["private research material", /\bresearch\//],
  ["private evidence material", /\b(?:host-)?evidence\//],
  ["host runtime logs", /\bruntime\/logs\//],
  ["private SDK review script", /\bsdk_api_tiers_trust\.py\b/],
  [
    "private Cubism availability script",
    /\bgenerate_cubism_editor_api_availability\.py\b/,
  ],
  [
    "internal contract published as API",
    /\bInternal contract helpers\b/i,
  ],
  [
    "type excluded from the stable plugin API",
    /\bNot part of the stable plugin API surface\b/i,
  ],
];
const blockedMatches = [];
const previewFiles = new Set();
const htmlFiles = [];

function scanDirectory(directory) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) {
      scanDirectory(path);
      continue;
    }
    if (!textExtensions.has(extname(name))) {
      continue;
    }
    if (extname(name) === ".html") {
      htmlFiles.push(path);
    }
    const relativePath = path.slice(generated.length + 1);
    const content = readFileSync(path, "utf8");
    if (/\bPreview(?:[ -]API)?\b/.test(content)) {
      previewFiles.add(relativePath);
    }
    for (const [label, pattern] of blockedContent) {
      if (pattern.test(content)) {
        blockedMatches.push(`${label}: ${relativePath}`);
      }
    }
  }
}

scanDirectory(generated);

function decodeHtmlAttribute(value) {
  return value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&");
}

const targetIds = new Map();
function idsFor(path) {
  if (!targetIds.has(path)) {
    const content = readFileSync(path, "utf8");
    const ids = new Set();
    for (const match of content.matchAll(/\b(?:id|name)="([^"]+)"/g)) {
      ids.add(decodeHtmlAttribute(match[1]));
    }
    targetIds.set(path, ids);
  }
  return targetIds.get(path);
}

const brokenLinks = [];
for (const htmlFile of htmlFiles) {
  const content = readFileSync(htmlFile, "utf8");
  for (const match of content.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const reference = decodeHtmlAttribute(match[1]);
    if (
      /^(?:[a-z]+:)?\/\//i.test(reference) ||
      /^(?:data|javascript|mailto):/i.test(reference)
    ) {
      continue;
    }

    const [referencePath, encodedFragment] = reference.split("#", 2);
    const pathWithoutQuery = referencePath.split("?", 1)[0];
    let target = htmlFile;
    if (pathWithoutQuery) {
      try {
        target = resolve(dirname(htmlFile), decodeURIComponent(pathWithoutQuery));
      } catch {
        brokenLinks.push(
          `${htmlFile.slice(generated.length + 1)} -> ${reference}`,
        );
        continue;
      }
    }
    if (!existsSync(target)) {
      brokenLinks.push(`${htmlFile.slice(generated.length + 1)} -> ${reference}`);
      continue;
    }
    if (encodedFragment !== undefined && encodedFragment !== "") {
      let fragment;
      try {
        fragment = decodeURIComponent(encodedFragment);
      } catch {
        brokenLinks.push(
          `${htmlFile.slice(generated.length + 1)} -> ${reference}`,
        );
        continue;
      }
      if (!idsFor(target).has(fragment)) {
        brokenLinks.push(`${htmlFile.slice(generated.length + 1)} -> ${reference}`);
      }
    }
  }
}

const publicationBlockers = [
  ...new Set(blockedMatches),
  ...new Set(brokenLinks.map((link) => `broken local link: ${link}`)),
];
if (publicationBlockers.length > 0) {
  throw new Error(
    `Generated SDK Javadoc failed publication checks:\n${publicationBlockers
      .map((match) => `- ${match}`)
      .join("\n")}`,
  );
}

const packages = readFileSync(join(generated, "element-list"), "utf8")
  .split("\n")
  .map((value) => value.trim())
  .filter(Boolean);
const typeIndex = readFileSync(join(generated, "type-search-index.js"), "utf8");
const typeCount = (typeIndex.match(/\{"p":/g) ?? []).length;

console.log(`Generated SDK Javadoc: ${generated}`);
console.log(`Version: ${expectedVersion}`);
console.log(`Public packages: ${packages.length}`);
console.log(`Searchable public types: ${typeCount}`);
console.log(`Files containing Preview API language: ${previewFiles.size}`);

if (sync && !interactive && previewFiles.size > 0 && !approvedPreviewSurface) {
  throw new Error(
    "Generated SDK Javadoc contains Preview API language. Review it and pass --approved-preview-surface to sync.",
  );
}

if (!sync) {
  console.log(
    "Generation complete. Review the public type surface and version before syncing.",
  );
  process.exit(0);
}

if (interactive) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error(
      "Interactive update requires a terminal. Use --sync --approved-public-surface in automation.",
    );
  }

  console.log("Review the generated Javadoc before approving synchronization.");
  const confirmation =
    previewFiles.size > 0
      ? `publish ${expectedVersion} including Preview APIs`
      : `publish ${expectedVersion}`;
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await prompt.question(`Type \"${confirmation}\" to continue: `);
  prompt.close();
  if (answer.trim() !== confirmation) {
    console.log("SDK Javadoc synchronization canceled.");
    process.exit(1);
  }
  approvedPublicSurface = true;
  approvedPreviewSurface = previewFiles.size > 0;
}

if (!approvedPublicSurface) {
  throw new Error("The generated public surface has not been approved.");
}
if (previewFiles.size > 0 && !approvedPreviewSurface) {
  throw new Error("The generated Preview API surface has not been approved.");
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
