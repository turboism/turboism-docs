import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmod, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const workflow = await readFile(new URL("../.github/workflows/update-sdk-api.yml", import.meta.url), "utf8");
const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);
const gitGenerator = await readFile(
  new URL("../scripts/generate-sdk-api-from-git.mjs", import.meta.url),
  "utf8",
);

test("release dispatch regenerates from the exact source identity", () => {
  assert.match(workflow, /repository_dispatch:\n\s+types: \[sdk-release-published\]/);
  assert.match(workflow, /SOURCE_REF="\$RELEASE_SOURCE_SHA"/);
  assert.match(workflow, /test "\$RELEASE_TAG" = "v\$RELEASE_VERSION"/);
  assert.match(workflow, /test "\$REVISION" = "\$RELEASE_SOURCE_SHA"/);
  assert.match(workflow, /test "\$TAG_SHA" = "\$REVISION"/);
  assert.match(workflow, /releases\/tags\/\$RELEASE_TAG/);
  assert.match(workflow, /jq -r \.draft/);
  assert.match(workflow, /jq -r \.prerelease/);
  assert.match(workflow, /--approved-public-surface --approved-preview-surface/);
});

test("synchronization only commits generated SDK files", () => {
  assert.match(workflow, /git status --porcelain -- public\/api\/sdk/);
  assert.match(workflow, /git add public\/api\/sdk/);
  assert.doesNotMatch(workflow, /git add (?:-A|\.)/);
});

test("Git-backed commands default to the remote main branch", () => {
  assert.equal(
    packageJson.scripts["generate:sdk-api:git"],
    "node scripts/generate-sdk-api-from-git.mjs",
  );
  assert.equal(
    packageJson.scripts["sync:sdk-api:git"],
    "node scripts/generate-sdk-api-from-git.mjs --sync",
  );
  assert.match(gitGenerator, /"https:\/\/github\.com\/turboism\/Turboism\.git"/);
  assert.match(gitGenerator, /argumentValue\("--ref="\) \?\? "main"/);
  assert.match(gitGenerator, /checkout", "--quiet", "--detach", "FETCH_HEAD"/);
});

test("generated constant-value package anchors are accepted without weakening ordinary anchors", async () => {
  const root = await mkdtemp(join(tmpdir(), "sdk-api-validation-"));
  const source = join(root, "source");
  await mkdir(join(source, "gradle"), { recursive: true });
  await writeFile(
    join(source, "gradle/common-java.gradle.kts"),
    'rootProject.extra["turboismFrameworkVersion"] = "1.2.3"\n',
  );
  const gradlew = join(source, "gradlew");
  await writeFile(
    gradlew,
    `#!/bin/sh
set -eu
out="$PWD/build/worktree/$TURBOISM_WORKTREE_ID/sdk/docs/javadoc"
mkdir -p "$out"
printf '%s' '<html><body>dev.turboism.sdk sdk 1.2.3 API</body></html>' > "$out/index.html"
printf '%s' 'dev.turboism.sdk.sample' > "$out/element-list"
printf '%s' '[{"p":"dev.turboism.sdk.sample","l":"Thing"}]' > "$out/type-search-index.js"
if [ "\${BROKEN_SDK_ANCHOR:-}" = 1 ]; then
  printf '%s' '<html><body><a href="#missing">broken</a></body></html>' > "$out/constant-values.html"
else
  printf '%s' '<html><body><a href="#dev.turboism">dev.turboism.*</a><section id="dev.turboism.sdk.sample"></section></body></html>' > "$out/constant-values.html"
fi
`,
  );
  await chmod(gradlew, 0o755);
  for (const arguments_ of [
    ["init", "--quiet", source],
    ["-C", source, "config", "user.name", "SDK Test"],
    ["-C", source, "config", "user.email", "sdk-test@example.invalid"],
    ["-C", source, "add", "."],
    ["-C", source, "commit", "--quiet", "-m", "fixture"],
    ["-C", source, "branch", "-M", "main"],
  ]) {
    const git = spawnSync("git", arguments_, { encoding: "utf8" });
    assert.equal(git.status, 0, git.stderr || git.stdout);
  }
  const script = new URL("../scripts/sync-sdk-api.mjs", import.meta.url);
  try {
    const accepted = spawnSync(process.execPath, [script.pathname, source], {
      encoding: "utf8",
    });
    assert.equal(accepted.status, 0, accepted.stderr || accepted.stdout);

    const wrapper = new URL("../scripts/generate-sdk-api-from-git.mjs", import.meta.url);
    const cloned = spawnSync(
      process.execPath,
      [wrapper.pathname, `--repository=${source}`, "--ref=main"],
      { encoding: "utf8" },
    );
    assert.equal(cloned.status, 0, cloned.stderr || cloned.stdout);
    assert.match(cloned.stdout, /Turboism source: .*@main \([0-9a-f]{40}\)/);

    const rejected = spawnSync(process.execPath, [script.pathname, source], {
      encoding: "utf8",
      env: { ...process.env, BROKEN_SDK_ANCHOR: "1" },
    });
    assert.notEqual(rejected.status, 0);
    assert.match(rejected.stderr, /broken local link: constant-values\.html -> #missing/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
