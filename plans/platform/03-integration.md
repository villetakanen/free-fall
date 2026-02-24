# 03 — Integration

**Goal:** Wire cross-package imports, Markdown content pipeline, Vitest, and design system docs app.

These are parallel workstreams that depend on the core packages. Delivered as one commit.

## Deliverables

**Vite alias wiring**
- `apps/free-fall` Astro/Vite config resolves `@free-fall/design-system` via alias
- `apps/design-system` does the same
- No `workspace:*` references anywhere

**Markdown content pipeline**
- Astro content collection or Markdown page route in `apps/free-fall`
- At least one sample `.md` file that renders as a page

**Vitest**
- Per-package Vitest configs
- At least one test in `packages/design-system`
- Root `pnpm test` runs all package tests

**Design system docs app** (`apps/design-system/`)
- Astro SSG site importing from `packages/design-system` via alias
- At least one page showing the sample component

## Done When

- `pnpm build` succeeds for both apps
- A Markdown file renders as HTML in the free-fall build output
- `pnpm test` runs Vitest with at least one passing test
- Design system app imports and renders a component from the shared package
- Vite aliases resolve correctly (no `workspace:*` in any `package.json`)
