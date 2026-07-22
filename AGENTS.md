# Docs Project Rules

This repository owns `docs.turboism.dev` and is intended for `github.com/turboism/turboism-docs`.

- Keep this site independent from `www/`, `learn/`, and `plugin/` at runtime.
- English is the authoritative language for documentation body content. English and Chinese interface text are both required.
- Do not state unverified installation steps, API signatures, compatibility combinations, SDK coordinates, or release availability as facts.
- Product documentation belongs here; third-party plugin-specific manuals belong with their authors.
- This site is dark-only and uses Turboism’s restrained Klein-blue developer-tool visual language.
- Before changing Next.js routing or APIs, read the matching document in `node_modules/next/dist/docs/`.
- When starting a preview server, also expose it via a public tunnel and share that URL.
