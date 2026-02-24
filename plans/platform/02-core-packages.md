# 02 — Core Packages

**Goal:** Astro app, design system package, Biome, and Lefthook — all wired up and independently functional.

These are parallel workstreams that only depend on the foundation. Delivered as one commit.

## Deliverables

**Astro app** (`apps/free-fall/`)
- Astro SSG project with `astro.config.ts`
- `tsconfig.json` extending root
- Single index page with placeholder content
- Root `pnpm build` produces `apps/free-fall/dist/`

**Design system package** (`packages/design-system/`)
- `package.json` as `@free-fall/design-system`
- `tsconfig.json` extending root
- Barrel export (`src/index.ts`)
- Breakpoint tokens and one sample Astro component

**Biome**
- `biome.json` at repo root
- `pnpm lint` and `pnpm format` scripts

**Lefthook + Conventional Commits**
- `lefthook.yml` with pre-commit (lint) and commit-msg (conventional commits) hooks
- Commit message validation

## Done When

- `pnpm build` generates `apps/free-fall/dist/index.html` with zero `<script>` tags
- `pnpm lint` exits 0 across all packages
- `pnpm typecheck` exits 0
- A non-conventional commit message is rejected by the hook
- `packages/design-system` has no dependency on either app
