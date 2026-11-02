import assert from "node:assert/strict";
import { test } from "node:test";
import { publicationTarget, needsPublication } from "../scripts/publish-sdk-api.mjs";

const sha = "5e0f8b02cf644d9f35e836d9d9712af21422434e";
const policy = {
  repository: "turboism/Turboism", channel: "stable",
  approvalScope: "published-stable-releases",
  approvedPublicSurface: true, approvedPreviewSurface: true, approvedKnownExceptions: true,
};
const release = { tag_name: "v0.67.4", draft: false, prerelease: false };

test("binds publication to the exact published stable source and version", () => {
  assert.deepEqual(publicationTarget(policy, release, sha), {
    repository: "turboism/Turboism", tag: "v0.67.4", version: "0.67.4", sourceRevision: sha,
  });
});

test("standing approval permits new published Stable releases without a per-version pin", () => {
  assert.equal(publicationTarget(policy, { ...release, tag_name: "v0.68.0" }, "a".repeat(40)).version, "0.68.0");
});

test("rejects drafts, prereleases, moving refs and malformed tags", () => {
  for (const candidate of [{ ...release, draft: true }, { ...release, prerelease: true },
    { ...release, tag_name: "v0.68.1-beta.10" }, { ...release, tag_name: "main" }]) {
    assert.throws(() => publicationTarget(policy, candidate, sha), /published stable release/);
  }
  assert.throws(() => publicationTarget(policy, release, "main"), /full source commit/);
});

test("requires all three explicit approvals without truthy coercion", () => {
  for (const key of ["approvedPublicSurface", "approvedPreviewSurface", "approvedKnownExceptions"]) {
    for (const value of [false, undefined, "true"]) {
      assert.throws(() => publicationTarget({ ...policy, [key]: value }, release, sha), /explicit/);
    }
  }
});

test("rejects another repository or an unreviewed channel", () => {
  assert.throws(() => publicationTarget({ ...policy, repository: "other/repo" }, release, sha), /stable release feed/);
  assert.throws(() => publicationTarget({ ...policy, channel: "beta" }, release, sha), /stable release feed/);
  assert.throws(() => publicationTarget({ ...policy, approvalScope: "all-branches" }, release, sha), /stable release feed/);
});

test("skips an unchanged deployment and retries missing or older published output", () => {
  const target = publicationTarget(policy, release, sha);
  assert.equal(needsPublication(target, null), true);
  assert.equal(needsPublication(target, target), false);
  assert.equal(needsPublication(publicationTarget(policy, { ...release, tag_name: "v0.67.5" }, "b".repeat(40)), target), true);
  assert.equal(needsPublication(publicationTarget(policy, { ...release, tag_name: "v0.68.0" }, "b".repeat(40)), target), true);
});

test("refuses a production downgrade, a moved tag or malformed deployed identity", () => {
  const target = publicationTarget(policy, release, sha);
  const newer = publicationTarget(policy, { ...release, tag_name: "v0.68.0" }, "b".repeat(40));
  assert.throws(() => needsPublication(target, newer), /downgrade/);
  assert.throws(() => needsPublication({ ...target, sourceRevision: "b".repeat(40) }, target), /tag moved/);
  assert.throws(() => needsPublication(target, { version: "0.67.4" }), /Invalid production/);
});
