# Feature: Custom Scrollbars

## Blueprint

### Context

Browsers and desktop operating systems default to wide, high-contrast grey or white scrollbars with opaque rectangular tracks that visually disrupt the dark aesthetic of **The Void** (`--freefall-bg-canvas` / `--freefall-color-primary-950`).

The Custom Scrollbars feature defines a coherent, hardware-themed styling layer applied globally across both applications (`apps/free-fall` and `apps/design-system`) to all scrollable containers, `<main>` content viewports, sliding drawer navigation, and Tactical HUD inspector panes.

Parent spec: `specs/design-system/design-tokens/spec.md`

### Architecture

**Token definitions (`packages/design-system/src/styles/tokens.css`):**

| Token | Value | Role |
|---|---|---|
| `--freefall-scrollbar-track` | `transparent` | Transparent track blending into the container's background surface |
| `--freefall-scrollbar-thumb` | `var(--freefall-color-primary-700)` | Resting thumb color (subtle dark slate) |
| `--freefall-scrollbar-thumb-hover` | `var(--freefall-color-primary-600)` | Hover state thumb |
| `--freefall-scrollbar-thumb-active` | `var(--freefall-color-accent-400)` | Active drag state thumb (Isotope Neon) |
| `--freefall-scrollbar-width` | `6px` | Standard cross-browser thickness |

**Global Application (`packages/design-system/src/styles/base.css`):**

Applied universally to all elements (`*`):
- W3C Standard (Baseline Widely Available):
  - `scrollbar-width: thin;`
  - `scrollbar-color: var(--freefall-scrollbar-thumb) var(--freefall-scrollbar-track);`
- Progressive Enhancement (WebKit / Blink):
  - `::-webkit-scrollbar` (width: 6px, height: 6px)
  - `::-webkit-scrollbar-track` (background: transparent)
  - `::-webkit-scrollbar-thumb` (background: primary-700, border-radius: 3px)
  - `::-webkit-scrollbar-thumb:hover` (background: primary-600)
  - `::-webkit-scrollbar-thumb:active` (background: accent-400)

### Anti-Patterns

- **No browser default scrollbars** — Default OS light/white scrollbars must never appear on dark surfaces.
- **No hardcoded scrollbar hex values** — All scrollbar colors and dimensions must resolve to `--freefall-scrollbar-*` tokens.
- **No intrusive tracks** — Scrollbar tracks must remain transparent, never filling containers with separate background bars.

## Contract

### Definition of Done

- [x] `--freefall-scrollbar-*` tokens defined in `packages/design-system/src/styles/tokens.css`
- [x] Universal scrollbar rules declared in `packages/design-system/src/styles/base.css`
- [x] Scrollbar tokens documented in `apps/design-system/src/pages/tokens.astro`
- [x] Dedicated showcase page created at `apps/design-system/src/pages/scrollbars.astro`
- [x] Custom Scrollbars linked in Design Tokens navigation in `apps/design-system/src/layouts/BaseLayout.astro`
- [x] Automated E2E test validates presence and styling of custom scrollbars

### Scenarios

```gherkin
Scenario: Scrollbars inherit dark theme tokens
  Given: a user visits any page on the main site or design system
  When: the content overflows vertically or horizontally
  Then: the scrollbar track is transparent
  And: the scrollbar thumb resolves to --freefall-scrollbar-thumb
  And: the scrollbar width is thin (6px)

Scenario: Design system documents scrollbars
  Given: a user navigates to /scrollbars/ in the design system
  When: the page renders
  Then: live scroll demonstrations are visible across Canvas, Surface 1, and Surface 2
  And: token specifications table is displayed
```
