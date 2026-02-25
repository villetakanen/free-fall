# 01 — Svelte Infrastructure

**Goal:** Install Svelte 5 and configure @astrojs/svelte in both Astro apps so Svelte islands can be used. One commit.

All deliverables are independent and done in parallel.

## Deliverables

**Install dependencies**
- Add `svelte` (v5) and `@astrojs/svelte` to `packages/design-system/package.json` (peer or dev dependency — the component lives here)
- Add `@astrojs/svelte` and `svelte` to `apps/design-system/package.json` devDependencies (the demo app renders the island)
- Add `@astrojs/svelte` and `svelte` to `apps/free-fall/package.json` devDependencies (the main app will render the island)
- Run `pnpm install` from repo root

**Configure Astro integrations**
- `apps/design-system/astro.config.ts` — add `svelte()` to the `integrations` array
- `apps/free-fall/astro.config.ts` — add `svelte()` to the `integrations` array

**Verify Svelte island works**
- Create a minimal smoke-test: a trivial `.svelte` component in `packages/design-system/src/components/` (e.g., a `<button>` that logs on click) rendered with `client:load` in the design-system demo app
- Delete the smoke-test component after verifying the build passes (it exists only to prove the pipeline works)

## Done When

- [ ] `svelte` v5 and `@astrojs/svelte` are in the dependency tree
- [ ] Both Astro configs include the Svelte integration
- [ ] `pnpm build` succeeds for both apps
- [ ] `pnpm lint`, `pnpm test`, and `pnpm typecheck` pass
