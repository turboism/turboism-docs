# Turboism Violet 1.0.0

Canonical source: `turboism/turboism-www`, `src/brand/`.
The same `brand.css`, `shell.tsx`, and `brand.test.mjs` are vendored into each independently deployed site. They have no runtime dependency on a sibling repository or a remote stylesheet. Import the CSS once from the root layout, after framework CSS. Site adapters own locale persistence, routing and their tool actions. Semantic status colors and code token styles are not replaced.

Homepage artwork and its display typography are intentionally not part of this shared package. The site footer is copyright only. Legal documents, authentication, databases, release validation and content APIs are outside this visual revision.

From the main site's checkout, explicitly synchronize checked-out siblings with `node scripts/sync-brand.mjs ../turboism-docs ../turboism-learn ../turboism-plugin-directory ../turboism-chat ../turboism-thanks`. Use `--check` before those paths to detect drift without writing. Run `node --test src/brand/brand.test.mjs` in www or `node --test brand/brand.test.mjs` in a sibling, then the repository's existing release checks and build.

This source contract test is not a substitute for a production Next.js build or browser workflows. Review download failure-closed behavior, documentation search, code copy/collapse, plugin filtering/actions, tutorial layouts, authenticated chat and contributor dragging in each site's preview before merging.
