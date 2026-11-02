import { execFileSync } from "node:child_process";
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const targetFile = join(root, "build", "sdk-publication-target.json");

/** Standing approval covers published Stable releases, never a moving branch. */
export function publicationTarget(policy, release, sourceRevision) {
  if (policy.repository !== "turboism/Turboism" || policy.channel !== "stable" ||
      policy.approvalScope !== "published-stable-releases") {
    throw new Error("SDK publication must use the Turboism stable release feed.");
  }
  if (release.draft !== false || release.prerelease !== false ||
      !/^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(release.tag_name)) {
    throw new Error("SDK documentation requires a published stable release.");
  }
  if (!/^[a-f0-9]{40}$/.test(sourceRevision)) {
    throw new Error("The release tag must resolve to a full source commit SHA.");
  }
  const version = release.tag_name.slice(1);
  for (const key of ["approvedPublicSurface", "approvedPreviewSurface", "approvedKnownExceptions"]) {
    if (policy[key] !== true) throw new Error(`SDK publication requires explicit ${key} approval.`);
  }
  return { repository: policy.repository, tag: release.tag_name, version, sourceRevision };
}

/** Only a completed production deployment advances the observed release. */
export function needsPublication(target, published) {
  if (published === null) return true;
  if (published.repository !== target.repository ||
      !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(published.version) ||
      published.tag !== `v${published.version}` || !/^[a-f0-9]{40}$/.test(published.sourceRevision)) {
    throw new Error("Invalid production SDK publication identity.");
  }
  const current = published.version.split(".").map(BigInt);
  const wanted = target.version.split(".").map(BigInt);
  for (let index = 0; index < 3; index++) {
    if (wanted[index] > current[index]) return true;
    if (wanted[index] < current[index]) throw new Error("Refusing to downgrade the published stable SDK reference.");
  }
  if (target.sourceRevision !== published.sourceRevision) {
    throw new Error("Published Stable tag moved to a different source commit.");
  }
  return false;
}

function github(endpoint) {
  return JSON.parse(execFileSync("gh", ["api", endpoint], { encoding: "utf8" }));
}

function resolveTarget() {
  const policy = JSON.parse(readFileSync(join(root, "sdk-publication.json"), "utf8"));
  const release = github("repos/turboism/Turboism/releases/latest");
  if (!/^v\d+\.\d+\.\d+$/.test(release.tag_name ?? "")) {
    throw new Error("Unexpected stable release tag.");
  }
  // Resolve the tag itself: target_commitish may be a branch or an annotated tag.
  const commit = github(`repos/turboism/Turboism/commits/${encodeURIComponent(release.tag_name)}`);
  const target = publicationTarget(policy, release, commit.sha);
  mkdirSync(dirname(targetFile), { recursive: true });
  writeFileSync(targetFile, JSON.stringify(target, null, 2) + "\n");
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `source_sha=${target.sourceRevision}\nversion=${target.version}\n`);
  }
  console.log(JSON.stringify(target));
  return target;
}

async function publishedTarget() {
  const response = await fetch("https://turboism.dev/sdk/publication.json", {
    headers: { Accept: "application/json", "Cache-Control": "no-cache" },
    signal: AbortSignal.timeout(30_000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Cannot read production SDK identity: HTTP ${response.status}`);
  return response.json();
}

async function checkRelease() {
  const target = resolveTarget();
  const changed = needsPublication(target, await publishedTarget());
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);
  console.log(changed ? `New Stable SDK: ${target.tag}` : `SDK ${target.tag} is already deployed; skipping.`);
}

async function validatePublication() {
  const target = JSON.parse(readFileSync(targetFile, "utf8"));
  needsPublication(target, await publishedTarget());
}

function syncTarget(sourceArgument) {
  if (!sourceArgument) throw new Error("Pass the exact checked-out Turboism source directory.");
  const source = resolve(sourceArgument);
  const target = JSON.parse(readFileSync(targetFile, "utf8"));
  const policy = JSON.parse(readFileSync(join(root, "sdk-publication.json"), "utf8"));
  publicationTarget(policy, { tag_name: target.tag, draft: false, prerelease: false }, target.sourceRevision);
  const actual = execFileSync("git", ["-C", source, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  if (actual !== target.sourceRevision) throw new Error("SDK source checkout does not match the approved release.");
  const dirty = execFileSync("git", ["-C", source, "status", "--porcelain"], { encoding: "utf8" }).trim();
  if (dirty) throw new Error("SDK documentation must be generated from a clean source checkout.");
  execFileSync(process.execPath, [
    join(root, "scripts", "sync-sdk-api.mjs"), source, "--sync",
    `--expected-version=${target.version}`,
    "--approved-public-surface", "--approved-preview-surface", "--approved-known-exceptions",
  ], { cwd: root, stdio: "inherit" });
  writeFileSync(join(root, "public", "api", "sdk", "publication.json"), JSON.stringify(target, null, 2) + "\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [command, source, ...extra] = process.argv.slice(2);
  if (command === "resolve" && !source) resolveTarget();
  else if (command === "check" && !source) await checkRelease();
  else if (command === "validate" && !source) await validatePublication();
  else if (command === "sync" && source && extra.length === 0) syncTarget(source);
  else throw new Error("Usage: node scripts/publish-sdk-api.mjs resolve | check | validate | sync <source-directory>");
}
