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

## Sync generated SDK API docs

The hosted Javadoc lives under `public/api/sdk/` and is generated from the Turboism source repository:

```bash
npm run sync:sdk-api -- /workspace/projects/turboism
```

This runs the source repository's `sdkApiDocs` Gradle task and replaces the hosted SDK reference.

English is the authoritative source. Complete Simplified Chinese and Japanese translations are published at `/zh/docs/...` and `/ja/docs/...`; English lives at `/en/docs/...`.
