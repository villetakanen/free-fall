# Feature: Design System

**Implements:** `docs/architecture/ADR-2026-07-19-design-system-contract-boundaries.md`

## Blueprint

### Context

The design system is the single source of styling truth for FREE//FALL. It provides CSS custom-property tokens, CSS styles, and components consumed by all apps in the monorepo. The goal is a cohesive visual language that avoids a framework client runtime by default and leans on native web platform capabilities wherever possible. Inline JavaScript is allowed for progressive enhancement.

**Brand and taste live in [`DESIGN.md`](../../DESIGN.md)** (repo root) — the design language document. Component specs define contracts; `DESIGN.md` defines what makes a component *look like FREE//FALL*. Read it before designing anything new.

### Architecture

**Package** (`packages/design-system/`):

| Layer | Format | Purpose |
|---|---|---|
| Foundation | Plain CSS files | Tokens (custom properties), reset, typography — mobile-first |
| Global primitives | Plain CSS files | Content grid, surfaces, callouts, and small utilities |
| Components | `.astro` files | Self-contained composition when plain HTML + CSS is insufficient |

No build step. Source is distributed directly to consuming apps via Vite aliases.
The package owns an `astro check` script so source-distributed components are
typechecked directly rather than relying on a consumer build to discover errors.

**Demo app** (`apps/design-system/`):

An Astro SSG site that imports from `packages/design-system` and renders every exported token, style, and component as a live reference. This is the living styleguide — if it's not demoed here, it doesn't exist.

**Documentation taxonomy:**

Every styleguide page belongs to exactly one of four categories, mirroring the package layering above. Placement is decided by *what kind of thing the page documents* — not by feature or theme:

| Category | What belongs | Placement rule |
|---|---|---|
| **Foundations** | Design decisions expressed as tokens, not markup — color, typography, iconography. | A token-level design primitive with no DOM of its own. |
| **Primitives** | Global CSS applied to native elements or utility classes, *not* importable — Content Grid, Callout, Definition List. | Styling you get from a class or element, with no `.astro` import. |
| **Components** | Importable `.astro` components, rendered live — App Bar, App Shell, App Tray, Drawer Brand, Gear Card, Hamburger Button, Stat Circle, Tray Button, Tray Link, Tray Link Group. | You `import` it and render it. |
| **Patterns** | Composition and data-model guides that are not a single component — Navigation Model, Subsite Navigation. | Teaches how to compose pieces or model data, not one widget. |

The rule is mechanical: importable component → Components; CSS-only element/utility → Primitives; token-level decision → Foundations; a composition or data model → Patterns. A page that seems to fit two categories is documenting two things and should be split.

The sidebar renders these categories as non-link `group` headings — it is a *reference index by kind*, deliberately unlike a product app's navigation. The product (`apps/free-fall`) navigates by destination (Core Rules, Gear, Scenarios) as top-level links with rail icons; the styleguide groups reference material by category and is browsed with the tray open (category groups have no collapsed-rail presence, by design).

**Consumption model:**

Astro server-renders all components to static HTML + CSS. Components may emit small inline progressive-enhancement scripts, but no framework client runtime is included by default. This means:

- **CSS files**: Not tree-shaken. An imported CSS file is included in full. This is fine — global styles and tokens are small and needed everywhere.
- **Astro components**: Only rendered components produce output. Unused imports cost nothing.

`AppShell` owns the one-time `base.css` import and renders `FontLinks` in the document head. Components are imported individually in pages/components that use them; consumers of `AppShell` must not duplicate either foundation dependency.

```astro
---
// Base layout — AppShell owns base.css and FontLinks
import AppShell from "@free-fall/design-system/components/AppShell.astro";
---

<AppShell title="FREE//FALL" navItems={navItems}><slot /></AppShell>
```

```astro
---
// Page — import components where used
import Heading from "@free-fall/design-system/components/Heading.astro";
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

### Anti-Patterns

- **No CSS frameworks** — The design system owns all styling. No Tailwind, Bootstrap, or similar.
- **No component without demo** — Every exported component, token set, or style file must have a corresponding entry in the demo app.
- **No framework islands for toggle UI** — If the core interaction is a state toggle (open/close, show/hide), use a CSS checkbox pattern with `:has(:checked)` and add JS as progressive enhancement only. Reserve Svelte 5 islands for genuinely complex reactive state that cannot be achieved with HTML + CSS.
- **No app-specific styles in the package** — The design system is generic to all apps. App-specific overrides live in the consuming app.
- **No build step for the package** — Source files are consumed directly. No compile, bundle, or transpile step in `packages/design-system`.
- **No strict BEM for layout wrappers** — Do not introduce arbitrary DOM elements (`<div class="block__element">`) solely to apply layout (like `position` or `z-index`) to a child component. Prefer using native CSS descendant combinators (e.g., `.parent > .child`) to style the child within the parent's context without breaking component encapsulation or muddying the DOM map.

## Contract

### Definition of Done

- [x] `packages/design-system` provides CSS custom-property tokens, global CSS, and Astro components
- [x] `AppShell` owns the `base.css` import and `FontLinks` rendering
- [x] `apps/design-system` demos every current global style and component on at least one page
- [x] `pnpm build` succeeds for both `apps/free-fall` and `apps/design-system`
- [x] `pnpm typecheck` checks `packages/design-system` Astro source and both apps
- [x] `pnpm test` passes all design system unit tests
- [x] `pnpm test:e2e` passes both app and living-styleguide Playwright suites
- [x] No `workspace:*` references in any `package.json`
- [x] Demo builds contain no framework client runtime unless an explicit island requires one; inline progressive-enhancement scripts are allowed
- [x] Design system package has no dependency on any app

### Regression Guardrails

- Adding a new export to `packages/design-system` without a demo page in `apps/design-system` is a failing review
- Every styleguide page belongs to exactly one documentation-taxonomy category (Foundations / Primitives / Components / Patterns); the category is derived by the placement rule, never by feature or theme. A page that fits two is documenting two things and must be split
- Dependency direction is one-way: apps → `packages/design-system`, never the reverse
- The static app builds contain no framework client runtime unless an explicit island is present

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

Scenario: New global CSS primitive added
  Given: A new CSS file is added to `packages/design-system/src/styles/`
  When: It is imported in `apps/design-system`
  Then: The demo app builds and renders the styled elements without requiring a framework client runtime

Scenario: New Astro component added
  Given: A new `.astro` file is added to `packages/design-system/src/components/`
  When: It is imported via `@free-fall/design-system/components/Button.astro`
  Then: Vite alias resolves it, the demo app renders it, and no framework client runtime is shipped unless explicitly required

Scenario: Token added
  Given: A new CSS custom property is added to `packages/design-system/src/styles/tokens.css`
  When: The demo app is built
  Then: The demo app displays the new token

Scenario: Demo app serves as living reference
  Given: The demo app is built
  When: A developer opens the built site
  Then: Every component, token, and style from the package is visible and demonstrable
