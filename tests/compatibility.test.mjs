import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const data = JSON.parse(readFileSync("lib/compatibility/data.json", "utf8"));

test("compatibility data records pinned source commit and reviewed versions", () => {
  assert.equal(data.format, "turboism-docs.compatibility/v1");
  assert.equal(data.sourceCommit, "5e0f8b02c");
  assert.equal(data.reviewedVersions.length, 20);
  assert.equal(data.reviewedRange, "5.0.00–5.3.04");
  assert.equal(data.plugins.length, 32);
  assert.equal(data.capabilityGroups.length, 37);
  assert.equal(data.restrictedCapabilities.length, 14);
});

test("release table covers 0.67.4 stable and 0.44.0 history", () => {
  const current = data.releases.find((r) => r.version === "0.67.4");
  const previous = data.releases.find((r) => r.version === "0.44.0");
  assert.ok(current);
  assert.equal(current.channel, "stable");
  assert.equal(current.cubismVersions.length, 20);
  assert.equal(current.cubismRange, "5.0.00–5.3.04");
  assert.deepEqual(current.platforms, ["windows-x64"]);
  assert.ok(previous);
  assert.deepEqual(previous.cubismVersions, ["5.2.03", "5.3.02", "5.3.03"]);
  assert.deepEqual(previous.platforms, ["windows-x64"]);
});

test("all four locales provide compatibility pages and navigation entries", () => {
  for (const suffix of ["", ".zh", ".ja", ".ko"]) {
    const meta = JSON.parse(
      readFileSync(`content/docs/use/meta${suffix}.json`, "utf8"),
    );
    assert.ok(
      meta.pages.includes("compatibility"),
      `meta${suffix}.json must include compatibility`,
    );

    const page = readFileSync(
      `content/docs/use/compatibility${suffix}.mdx`,
      "utf8",
    );
    assert.match(page, /<CompatibilityReleaseTable\b/);
    assert.match(page, /<CompatibilityPluginTable\b/);
    assert.match(page, /<CompatibilityCapabilityTable\b/);
    assert.match(page, /0\.44\.0/);
    assert.match(page, /0\.67\.4/);
    assert.match(page, /5\.1\.02/);
    assert.match(page, /5\.2\.00/);
  }
});
