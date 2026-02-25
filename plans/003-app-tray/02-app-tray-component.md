# 02 — App Tray Component, Styles, and Demo

**Goal:** Implement the full AppTray Svelte 5 island with responsive CSS, accessibility, and demo page. One commit.

All deliverables are independent and done in parallel.

## Deliverables

**CSS** (`packages/design-system/src/styles/app-tray.css`)
- Component-scoped custom properties for z-index (tray, scrim) — no global magic numbers
- Rail layout: `calc(10 * var(--freefall-space-1))` width, `--freefall-bg-surface-2` background
- Tray layout: `calc(40 * var(--freefall-space-1))` width, `--freefall-bg-surface-1` background, `--freefall-border-subtle` right edge
- Hamburger button: `calc(6 * var(--freefall-space-1))` size
- Rail icon size: `calc(3 * var(--freefall-space-1))`
- Nav item padding: `var(--freefall-space-2)`
- Nav item states: `--freefall-text-body` default, `--freefall-text-display` active, `--freefall-action-hover` hover background
- Scrim: semi-transparent overlay, fades with tray
- Transitions: tray slide `transform 200ms ease-out` (open) / `150ms ease-in` (close), scrim `opacity` matching, hamburger crossfade `150ms`
- Responsive rules:
  - Default (< 620px): rail hidden, tray full-screen overlay when open
  - `@media (min-width: 620px)`: rail visible, tray overlays content when open
  - `@media (min-width: 780px)`: rail visible, tray pushes content when open (no scrim)
- All dimensions use `calc()` with `var(--freefall-space-1)` — zero raw px/rem values

**Svelte component** (`packages/design-system/src/components/AppTray.svelte`)
- Svelte 5 runes for open/closed state
- Hamburger `<button>` with `aria-expanded`, `aria-controls` referencing the nav
- `<nav>` with `aria-label="Main navigation"` and corresponding `id`
- Material Symbols Sharp ligatures `menu` / `close` for hamburger icon, crossfaded via CSS
- Rail: icon-only nav items, visible at tablet+ breakpoints
- Tray: full nav items (icon + label), slides in on toggle
- Scrim element: renders on small + medium when open, click-to-close
- Keyboard: `Escape` closes tray, returns focus to hamburger button
- Focus trap: active when tray overlays content (small + medium), inactive on desktop (push mode)
- Slot-based API for nav items — component is a layout shell, not content-aware
- Imports `app-tray.css`

**Base styles update** (`packages/design-system/src/styles/base.css`)
- Import `app-tray.css` so styles are available globally

**Demo page** (`apps/design-system/src/pages/app-tray.astro`)
- Renders `AppTray` as a Svelte island (`client:load`)
- Populates tray with sample nav items (3–5 items with Material Symbols icons and labels)
- Demonstrates all three responsive modes (user resizes browser to see)
- Annotates dimensions and token references

**Demo index link** (`apps/design-system/src/pages/index.astro`)
- Add app-tray page link to the Pages list

## Done When

- [ ] `AppTray.svelte` renders a responsive navigation tray with rail, full drawer, and hamburger toggle
- [ ] Small viewport: tray is hidden by default, opens as full-screen overlay
- [ ] Medium viewport: rail visible by default, tray opens as overlay
- [ ] Large viewport: rail visible by default, tray opens and pushes content
- [ ] Hamburger button animates between menu/close states
- [ ] All dimensions use `calc()` with `--freefall-space-1` — no raw px/rem
- [ ] Scrim renders on small + medium when tray is open; click-to-close works
- [ ] `aria-expanded`, `aria-controls`, `aria-label` are correct in all states
- [ ] Focus trap active when tray overlays content
- [ ] `Escape` key closes the tray
- [ ] Transitions match specified durations (200/150ms slide, 150ms crossfade)
- [ ] Demo app has an app-tray reference page showing the component
- [ ] Demo index links to the app-tray page
- [ ] `pnpm build`, `pnpm lint`, `pnpm test`, and `pnpm typecheck` pass
