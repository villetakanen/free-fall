# 01 — Implement App Shell

**Goal:** M3-style scaffold layout — AppShell component, CSS, base.css cleanup, and all pages migrated. One commit.

All deliverables are independent and done in parallel.

## Deliverables

**CSS** (`packages/design-system/src/styles/app-shell.css`)
- `.app-shell`: flex row, min-height 100vh
- `.app-shell__body`: flex column, `flex: 1`, `min-width: 0`
- `.app-shell__bar`: top app bar — `calc(8 * var(--freefall-space-1))` height, `--freefall-bg-surface-1` background, `--freefall-border-subtle` bottom border, flex row, items centered
- `.app-shell__title`: `--freefall-text-display` color, h4 type scale font size
- `.app-shell__content`: content pane — `var(--freefall-space-2)` padding (small), `var(--freefall-space-4)` padding (medium+), `calc(120 * var(--freefall-space-1))` max-width (large)
- Small viewport: bar has left padding to clear fixed burger button (`calc(var(--app-tray-burger-size) + 2 * var(--freefall-space-2))`)
- All dimensions grid-derived — zero raw px/rem

**Base styles cleanup** (`packages/design-system/src/styles/base.css`)
- Remove `body` padding, max-width, and margin rules (they move into `app-shell.css`)
- Keep `body` background, color, and overflow-x only
- Remove `body` responsive media queries for padding/max-width
- Add `@import "./app-shell.css"` alongside existing imports

**Astro component** (`packages/design-system/src/components/AppShell.astro`)
- Props: `title` (string), `navItems` (NavItem[])
- Renders: `<html lang="en">`, `<head>` with charset, viewport, `<FontLinks />`, `<title>`, named `<slot name="head" />`
- Body: `.app-shell` flex row containing `<AppTray items={navItems} />` + `.app-shell__body`
- `.app-shell__body`: `.app-shell__bar` (with title) + `<main class="app-shell__content"><slot /></main>`
- Imports `base.css` (which includes all design system styles)

**Design system pages** (5 files in `apps/design-system/src/pages/`)
- `index.astro` — replace document skeleton with `<AppShell>` layout, move content to default slot, title/meta to props/head slot
- `tokens.astro` — same migration
- `typography.astro` — same migration
- `iconography.astro` — same migration
- `app-tray.astro` — same migration
- Remove all `<html>`, `<head>`, `<body>` tags
- Remove all `base.css` imports (shell handles it)
- Remove all `FontLinks` imports (shell handles it)
- Each page passes its own `navItems` and `title` to the shell

**Free-fall app pages** (2 files in `apps/free-fall/src/pages/`)
- `index.astro` — replace document skeleton with `<AppShell>` layout
- `rules/[...slug].astro` — replace document skeleton with `<AppShell>` layout (this page currently has no base.css — the shell fixes that)
- Remove all `<html>`, `<head>`, `<body>` tags
- Remove all `base.css` and `FontLinks` imports

## Done When

- [ ] `AppShell.astro` provides full document skeleton with top bar, AppTray, and content slot
- [ ] Both apps use the shell as their base layout on all pages
- [ ] Top app bar displays page title, clears burger on small viewports
- [ ] Content pane has responsive padding and max-width via spacing tokens
- [ ] Content area shifts when rail is visible (medium+) and when tray pushes (desktop)
- [ ] Named `head` slot allows page-specific `<head>` content
- [ ] Body padding/max-width moved from `base.css` to `app-shell.css`
- [ ] No duplicate `<html>`, `<head>`, or `base.css` imports across pages
- [ ] `pnpm build`, `pnpm lint`, `pnpm test`, and `pnpm typecheck` pass
