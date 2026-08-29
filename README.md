# Turboism Docs

The documentation site for Turboism, served at `docs.turboism.dev`.

## Local development

```bash
npm install
npm run dev
```

Before a production preview, run:

```bash
npm run lint
npm run typecheck
npm run build
```

English is the authoritative source. Keep the Simplified Chinese and Japanese
pages semantically aligned with every documentation change.

## SDK Javadoc update workflow

SDK Javadoc is part of the documentation update workflow whenever the public SDK,
its documentation, or its version changes. The hosted files live under
`public/api/sdk/` and must be generated from the matching Turboism source tree.

### 1. Generate a review copy

Pass the source checkout explicitly or set `TURBOISM_SOURCE_ROOT`:

```bash
npm run generate:sdk-api -- ../turboism
```

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

The script refuses to sync snapshot output, output with the wrong version, or
output without the explicit public-surface approval flag.

### 4. Validate the documentation site

After syncing, review the generated-file diff and run:

```bash
npm run lint
npm run typecheck
npm run build
```

Do not treat successful generation as approval to publish. Generation, public API
review, synchronization, and site validation are separate required steps.
