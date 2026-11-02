import assert from "node:assert/strict";
import { test } from "node:test";
import { publicationTarget } from "../scripts/publish-sdk-api.mjs";

const sha = "5e0f8b02cf644d9f35e836d9d9712af21422434e";
const policy = {
  repository: "turboism/Turboism", channel: "stable",
  approvedSourceRevision: sha, approvedVersion: "0.67.4",
  approvedPublicSurface: true, approvedPreviewSurface: true, approvedKnownExceptions: true,
};
const release = { tag_name: "v0.67.4", draft: false, prerelease: false };

test("binds publication to the exact reviewed stable source and version", () => {
  assert.deepEqual(publicationTarget(policy, release, sha), {
    repository: "turboism/Turboism", tag: "v0.67.4", version: "0.67.4", sourceRevision: sha,
  });
});

test("a new release or retargeted tag requires new review", () => {
  assert.throws(() => publicationTarget(policy, { ...release, tag_name: "v0.67.5" }, sha), /needs SDK review/);
  assert.throws(() => publicationTarget(policy, release, "a".repeat(40)), /needs SDK review/);
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
});
