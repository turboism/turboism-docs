# Docs Project Rules

This repository owns the independently deployed docs service, canonically mounted at `turboism.dev/docs`; `docs.turboism.dev` is a legacy redirect and gateway origin.

- Keep this site independent from `www/`, `learn/`, and `plugin/` at runtime; the apex site proxies `/docs/*` to this deployment.
- English is the authoritative language for documentation body content. English and Chinese interface text are both required.
- Do not state unverified installation steps, API signatures, compatibility combinations, SDK coordinates, or release availability as facts.
- Product documentation belongs here; third-party plugin-specific manuals belong with their authors.
- Match the approved Violet V4 brand: #6A5ACD primary, #EEE8AA highlight, #FCFBF7 paper and the vendored `brand/` shell. Preserve readable content, semantic state colors and code highlighting; do not apply the homepage's floating words to documentation.
- Before changing Next.js routing or APIs, read the matching document in `node_modules/next/dist/docs/`.
- When starting a preview server, also expose it via a public tunnel and share that URL.
- Apply the idempotent SDK style adapter during build/dev; never change the public API review or sync approval guards for a visual update.
