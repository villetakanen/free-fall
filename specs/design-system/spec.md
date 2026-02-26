# Feature: Design System

## Blueprint

### Context

The design system is the single source of styling truth for FREE//FALL. It provides tokens, CSS styles, and components consumed by all apps in the monorepo. The goal is a cohesive visual language that ships zero JavaScript by default and leans on native web platform capabilities wherever possible.

### Architecture

**Package** (`packages/design-system/`):

| Layer | Format | Purpose |
|---|---|---|
| Tokens | TypeScript constants | Breakpoints, colors, spacing — importable by both TS and Astro |
| Styles | Plain CSS files | Global resets, base styles, component styles — mobile-first |
| Components | `.astro` files | Composition wrappers only when plain HTML + CSS is insufficient |

No build step. Source is distributed directly to consuming apps via Vite aliases.

**Demo app** (`apps/design-system/`):

An Astro SSG site that imports from `packages/design-system` and renders every exported token, style, and component as a live reference. This is the living styleguide — if it's not demoed here, it doesn't exist.

**Consumption model:**

Astro server-renders all components to static HTML + CSS. There is no client-side JS bundle to tree-shake. This means:

- **CSS files**: Not tree-shaken. An imported CSS file is included in full. This is fine — global styles and tokens are small and needed everywhere.
- **Astro components**: Only rendered components produce output. Unused imports cost nothing.

The recommended pattern is a **base layout** in each app that imports the full design system styles once. Components are imported individually in pages/components that use them — this is a template necessity, not an optimization.

```astro
---
// Base layout — import styles once here
import "@free-fall/design-system/styles/base.css";
---

<html lang="en">
  <head><slot name="head" /></head>
  <body><slot /></body>
</html>
```

```astro
---
// Page — import components where used
import Heading from "@free-fall/design-system/components/Heading.astro";
import { breakpoints } from "@free-fall/design-system";
---
```

All resolved via Vite aliases and `tsconfig.json` paths — no `workspace:*` protocol.

**Component decision rule:**

Use plain HTML + CSS by default. Provide an Astro component only when one or more of these apply:

- Composition of multiple elements with slot-based content
- Conditional rendering or layout logic in the template
- Props-driven variants that would be error-prone to replicate in raw HTML
- Encapsulating accessible patterns (e.g., modals, disclosure widgets)

When none of these apply, provide CSS classes or custom properties instead.

**Preflight / CSS reset** (in `base.css`):

A modern preflight inspired by Tailwind/modern-normalize, applied globally via `base.css`. Key rules:

- `box-sizing: border-box` on all elements (including pseudo-elements)
- Universal `margin: 0` reset
- `line-height: 1.5` on `html`, inherited by `body`
- `-webkit-font-smoothing: antialiased` on `body`
- Media elements (`img`, `picture`, `video`, `canvas`, `svg`) set to `display: block` and `max-width: 100%`
- Form elements (`input`, `button`, `textarea`, `select`) inherit font
- `overflow-wrap: break-word` on text elements; `text-wrap: balance` on headings
- Anchor reset (inherit color and text-decoration)
- Table `border-collapse: collapse`

The preflight lives in `src/styles/preflight.css` and is imported first in `base.css`.

**Token duality:**

Design tokens exist in two forms that must stay in sync:

- **TypeScript** (`src/tokens/*.ts`) — for use in Astro frontmatter, tests, and build-time logic
- **CSS custom properties** (`src/styles/*.css`) — for use in stylesheets and inline styles

### Anti-Patterns

- **No CSS frameworks** — The design system owns all styling. No Tailwind, Bootstrap, or similar.
- **No component without demo** — Every exported component, token set, or style file must have a corresponding entry in the demo app.
- **No framework islands for toggle UI** — If the core interaction is a state toggle (open/close, show/hide), use a CSS checkbox pattern with `:has(:checked)` and add JS as progressive enhancement only. Reserve Svelte 5 islands for genuinely complex reactive state that cannot be achieved with HTML + CSS.
- **No app-specific styles in the package** — The design system is generic to all apps. App-specific overrides live in the consuming app.
- **No build step for the package** — Source files are consumed directly. No compile, bundle, or transpile step in `packages/design-system`.

## Contract

### Definition of Done

- [ ] `packages/design-system` exports at least one token, one CSS file, and one component
- [ ] `apps/design-system` demos every exported feature on at least one page
- [ ] `pnpm build` succeeds for both `apps/free-fall` and `apps/design-system`
- [ ] `pnpm test` passes all design system unit tests
- [ ] No `workspace:*` references in any `package.json`
- [ ] Zero JavaScript in the demo app build output (unless a Svelte island is present)
- [ ] Design system package has no dependency on any app

### Regression Guardrails

- Adding a new export to `packages/design-system` without a demo page in `apps/design-system` is a failing review
- Token values in TypeScript and CSS custom properties must match
- Dependency direction is one-way: apps → `packages/design-system`, never the reverse

### Architecture

The project is structured as a monorepo containing a shared library and consumer applications.

- `packages/design-system`: The source of truth. Contains design tokens, shared CSS architecture, and reusable UI components.
- `apps/design-system`: The interactive documentation and development sandbox for the design system itself.
- `apps/free-fall`: The main user-facing application (the TTRPG web app).

### Component Philosophy

FREE//FALL strictly minimizes JavaScript shipped to the client. The design system leverages **pure HTML and CSS** where possible. Abstracting semantic HTML nodes like text formatting or headings into JS wrappers is actively avoided. Complex interactions should use `svelte` components carefully tailored to progressive enhancement.

Astro components are used for macro-structural layouts (e.g., `AppShell`, `AppTray`) or SVG icon encapsulations, where build-time templating provides value without introducing runtime JS overhead.

```astro
---
// apps/design-system/src/pages/index.astro
import AppShell from "@free-fall/design-system/components/AppShell.astro";
---
<AppShell title="FREE//FALL Components">
  <h1 class="text-chapter">Design System Reference</h1>
</AppShell>
```

### Scenarios

Scenario: New CSS component added
  Given: A new CSS file is added to `packages/design-system/src/styles/`
  When: It is imported in `apps/design-system`
  Then: The demo app builds and renders the styled elements with zero JS

Scenario: New Astro component added
  Given: A new `.astro` file is added to `packages/design-system/src/components/`
  When: It is imported via `@free-fall/design-system/components/Button.astro`
  Then: Vite alias resolves it, the demo app renders it, and no JS is shipped

Scenario: Token added
  Given: A new token is added to `packages/design-system/src/tokens/`
  When: It is exported from the barrel (`src/index.ts`) and has a CSS counterpart
  Then: Both values match, a unit test covers the token, and the demo app displays it

Scenario: Demo app serves as living reference
  Given: The demo app is built
  When: A developer opens the built site
  Then: Every component, token, and style from the package is visible and demonstrable
