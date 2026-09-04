# Turboism Docs

The authoritative Turboism documentation, canonically served at [`turboism.dev/docs`](https://turboism.dev/docs) while remaining independently deployed.

## Local development

```bash
npm install
npm run dev
```

Before a local production preview, run:

```bash
npm run release:check
npm run build
```

English is the authoritative source. Keep the Simplified Chinese and Japanese
pages semantically aligned with every documentation change.

## Deployment

Install the pinned provider CLI with `npm install --global vercel@59.10.0`,
then link the checkout once with `vercel link`. The generated `.vercel/`
directory stays local and must not be committed.

For a CLI preview deployment:

```bash
vercel pull --yes --environment=preview
npm run release:build
DEPLOYMENT_URL="$(vercel deploy --prebuilt)"
npm run verify:deployment -- "$DEPLOYMENT_URL"
```

For production, use the production environment for both build and deployment,
then verify the deployment and canonical alias:

```bash
vercel pull --yes --environment=production
npm run release:build -- --prod
DEPLOYMENT_URL="$(vercel deploy --prebuilt --prod)"
npm run verify:deployment -- "$DEPLOYMENT_URL"
npm run verify:production
```

`.github/workflows/deploy.yml` applies the same flow to trusted branch pushes:
non-`main` branches create previews and `main` deploys production. Configure the
repository secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`;
the IDs come from the local `.vercel/project.json` created by `vercel link`.
Vercel Git deployments are disabled in `vercel.json` to prevent duplicate
provider and GitHub Actions deployments. Keep the token in GitHub secrets or a
protected environment, never in the repository.

## SDK Javadoc update workflow

SDK Javadoc is part of the documentation update workflow whenever the public SDK,
its documentation, or its version changes. The hosted files live under
`public/api/sdk/` and must be generated from the matching Turboism source tree.

### 1. Generate a review copy

Pass the source checkout explicitly or set `TURBOISM_SOURCE_ROOT`:

```bash
npm run generate:sdk-api -- ../turboism
```

To fetch and generate directly from the current remote `main` without keeping a local Turboism checkout:

```bash
npm run generate:sdk-api:git
```

Use `-- --ref=<branch-tag-or-sha>` to select a different immutable source. The helper resolves the ref in a temporary checkout and removes it after validation.

This runs the real Gradle task, `:sdk:javadoc`, in release-version mode. It does
not overwrite the hosted reference.

### 2. Review before publishing

Before syncing, confirm that:

- the generated version is the version being documented and is not a snapshot;
- every publicly searchable package and type belongs in the public SDK reference;
- internal or non-stable implementation types are not exposed as public API;
- Preview APIs follow the approved public-reference policy;
- generated descriptions do not expose local paths, private validation material,
  host logs, credentials, or implementation-only evidence; and
- guided English, Simplified Chinese, and Japanese documentation matches the
  generated public surface.

If any check fails, leave `public/api/sdk/` unchanged and document the blocker on
the generated API status page.

### 3. Sync an approved version

Only after public-surface review, sync the reviewed output with the expected
version and explicit approval flag:

```bash
npm run sync:sdk-api -- ../turboism \
  --expected-version=<version> \
  --approved-public-surface
```

The Git-backed equivalent defaults to the latest remote `main`:

```bash
npm run sync:sdk-api:git -- \
  --expected-version=<version> \
  --approved-public-surface \
  --approved-preview-surface
```

The script refuses to sync snapshot output, output with the wrong version, or
output without the explicit public-surface approval flag.

### 4. Validate the documentation site

After syncing, review the generated-file diff and run:

```bash
npm run release:check
npm run build
```

Do not treat successful generation as approval to publish. Generation, public API
review, synchronization, and site validation are separate required steps.

### Automated release synchronization

`.github/workflows/update-sdk-api.yml` supports two paths:

- manual `workflow_dispatch` against `main`, a tag, or an exact commit, in either `validate` or `sync` mode;
- `sdk-release-published` repository dispatches from the protected Turboism release publisher.

Release dispatches always check out the exact released source SHA, verify its version and tag, regenerate the Javadoc, run the same publication checks, validate the documentation build, and commit only `public/api/sdk/` when the generated output changed. Manual sync requires the confirmation value `sync-sdk-api`.

The Turboism repository requires a `DOCS_RELEASE_DISPATCH_TOKEN` secret that can dispatch this repository. This docs repository must allow GitHub Actions to write `main`; its normal Vercel deployment secrets remain required for the resulting push to deploy.
