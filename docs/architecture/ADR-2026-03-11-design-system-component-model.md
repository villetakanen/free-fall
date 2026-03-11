# ADR-2026-03-11: Design System Component Model and CSS Architecture

**Status:** Proposed

**Date:** 2026-03-11

## Context

The FREE//FALL design system (`packages/design-system`) has grown organically during alpha development. It now contains 5 token modules, 13 CSS files, and 9 Astro components. Two consuming apps exist: the main application (`apps/free-fall`) and the design system documentation site (`apps/design-system`).

The current architecture works but exhibits inconsistencies that will compound as we approach beta:

1. **Mixed scoping strategies.** Some component CSS lives in global stylesheets imported through `base.css` (e.g., `hamburger-button.css`, `tray-button.css`, `app-bar.css`), while other component CSS is scoped inside Astro `<style>` blocks (e.g., `AppTray.astro`, `DrawerBrand.astro`). There is no clear rule governing which approach to use.

2. **Implicit coupling.** Components like `HamburgerButton.astro` render markup but rely on a global stylesheet (`hamburger-button.css`) imported elsewhere in the chain. A consumer importing the component without importing `base.css` gets unstyled markup with no error or warning.

3. **Monolithic style entrypoint.** `base.css` imports everything—preflight, tokens, typography, and all component styles—as a single cascade. Consuming apps get all styles regardless of which components they use. This is acceptable at current scale but creates a coupling surface that grows with every new component.

4. **Redundant TypeScript token layer.** The design system maintains parallel TypeScript constants for every CSS custom property. These TS tokens are not imported by the main application—their only consumers are the design-system-docs app (to render token tables) and the unit tests that verify TS↔CSS parity. The TS layer adds maintenance burden and a false sense of type safety for values that are ultimately consumed as CSS custom properties.

5. **No component API contract.** Components accept props and render HTML, but there is no documented contract for which CSS classes a component emits, whether it expects global styles to be present, or how consumers should extend or override styles.

These issues must be resolved before beta to establish patterns that scale with the design system.

## Decision

We will adopt a **layered style architecture** with explicit component encapsulation, organized into three distinct layers with clear ownership rules.

### Layer 1: Foundation (global, imported once)

Foundation styles apply document-wide and are imported exactly once by the consuming app's root layout.

| File | Purpose | Scope |
|------|---------|-------|
| `preflight.css` | CSS reset | `*`, `html`, `body`, base elements |
| `tokens.css` | CSS custom properties | `:root` |
| `typography.css` | Font families, type scale classes, `.freefall-prose` | Document-level |

**Rule:** Foundation styles define custom properties and reset defaults. They never target component-specific class names.

### Layer 2: Layout Primitives (global, structural)

Layout primitives provide the structural scaffolding that components compose within.

| File | Purpose |
|------|---------|
| `content-grid.css` | Three-tier responsive content grid |
| `surface.css` | `main > .surface` elevated content area styling |

**Rule:** Layout primitives define spatial containers. They do not style content within those containers.

### Layer 3: Component Styles (co-located, encapsulated)

Every component owns its styles. Component CSS is co-located with the component and scoped to it.

**Rule:** A component must be self-contained—importing the component must be sufficient to get its styled rendering. No external stylesheet import should be required for a component to look correct (beyond Foundation being present).

**Implementation:** Astro components use `<style>` blocks (Astro's scoped styles) or `<style is:global>` when the component needs to style slotted/child content. The key constraint is that the styles live *in the component file*, not in a separate global stylesheet.

### Target Structure

```yaml
packages/design-system/src/:
  styles/:                          # Layer 1 + 2 — global CSS only
    base.css:                       # imports preflight → tokens → typography → layout primitives
    preflight.css:                  # Layer 1: CSS reset
    tokens.css:                     # Layer 1: CSS custom properties (:root)
    typography.css:                 # Layer 1: font families, type scale, .freefall-prose
    content-grid.css:               # Layer 2: three-tier responsive grid
    surface.css:                    # Layer 2: main > .surface elevated content areas

  components/:                      # Layer 3 — self-contained Astro components
    AppShell.astro:                 # imports base.css; composes AppBar + AppTray
    AppBar.astro:                   # <style> co-located (migrated from app-bar.css)
    AppTray.astro:                  # <style> co-located (already scoped)
    HamburgerButton.astro:          # <style> co-located (migrated from hamburger-button.css)
    TrayButton.astro:               # <style> co-located (merge existing partial <style> + tray-button.css)
    TrayLink.astro:                 # <style> co-located
    TrayLinkGroup.astro:            # <style> co-located (migrated from tray-link-group.css)
    DrawerBrand.astro:              # <style> co-located (already scoped)
    FontLinks.astro:                # no styles — emits <link> tags only

  assets/:
    freefall-logo.svg:
    freefall-logo-white.svg:
```

**Removed files:**
- `styles/hamburger-button.css` → inlined into `HamburgerButton.astro`
- `styles/tray-button.css` → merged into `TrayButton.astro`
- `styles/tray-link-group.css` → inlined into `TrayLinkGroup.astro`
- `styles/app-bar.css` → inlined into `AppBar.astro`
- `styles/pre.css` → scoped under `.freefall-prose pre` in `typography.css` (intentional scope narrowing: bare `<pre>` outside prose sections will no longer receive these styles)
- `styles/em.css` → scoped under `.freefall-prose em` in `typography.css` (same scope narrowing)
- `styles/app-shell.css` → dead code; targets `.app-shell__body` and `.app-shell__content` which no component renders. `AppShell.astro` has its own scoped styles with different selectors.

**Retained files** (reclassified):
- `styles/surface.css` → stays in `styles/`, selector changed to `main > .surface`, promoted to Layout Primitives (Layer 2)

**Removed files** (TS token layer deleted):
- `tokens/` directory (all `.ts` and `.test.ts` files)
- `index.ts` barrel export

### Migration Path

Component stylesheets (`hamburger-button.css`, `tray-button.css`, `tray-link-group.css`, `app-bar.css`) will be inlined into their Astro components. Element styles (`pre.css`, `em.css`) will be scoped under `.freefall-prose` in `typography.css`. `surface.css` will be reclassified as a Layout Primitive (Layer 2) with selector `main > .surface`. `base.css` will be reduced to importing only Layer 1 (Foundation) and Layer 2 (Layout Primitives).

**Phases** (each phase is one PR, independently shippable):

1. **Delete dead code.** Remove `app-shell.css` (targets classes no component renders) and its `@import` from `base.css`. Update e2e tests and specs that reference its class names.
2. **Inline component styles.** Migrate `hamburger-button.css`, `tray-button.css`, `tray-link-group.css`, `app-bar.css` into their Astro components. Flatten BEM class names. One component per commit.
3. **Scope element styles.** Move `pre.css` and `em.css` into `.freefall-prose` in `typography.css`.
4. **Reclassify `surface.css` as Layout Primitive.** Change selector to `main > .surface`, keep in `styles/`, ensure `base.css` imports it with other Layer 2 files.
5. **Delete TS token layer.** Remove `tokens/` directory, `index.ts` barrel, and rewrite design-system-docs token pages.

**Verification:** Each phase must pass `pnpm typecheck && pnpm lint && pnpm test && pnpm test:e2e` plus manual visual inspection of both apps before merging.

### Component Authoring Conventions

1. **Astro-first.** All design system components are Astro components (`.astro`). Framework islands (Svelte, etc.) are used only when a component requires complex reactive state that cannot be achieved with HTML + CSS + inline `<script>`.

2. **Progressive enhancement.** Core functionality (layout, visibility, navigation) must work without JavaScript. Inline `<script>` blocks add enhancements (keyboard shortcuts, focus traps, animations) that degrade gracefully.

3. **CSS checkbox pattern for UI state.** Toggles, drawers, accordions, and similar binary-state interactions use the `<input type="checkbox">` + `:has(:checked)` pattern instead of JavaScript state management.

4. **Props define the API; classes are internal.** Component consumers interact through typed Astro props. CSS class names are implementation details and should not be relied upon by consuming apps. If a consumer needs to customize appearance, they should use CSS custom properties exposed by the component (not class name overrides).

5. **No BEM. Ever.** BEM naming (`.block__element--modifier`) is an artefact of flat global CSS. Modern CSS has proper structural selectors (`>`, `:has()`, `:where()`) that express element relationships directly — BEM encodes the same relationships in class names, wasting bytes on the wire for human readability that devtools already provide. Inside scoped `<style>` blocks, Astro's `data-astro-*` attributes handle collision avoidance; inside `<style is:global>` blocks, child combinators (`.root > .item`) scope just as tightly without inventing a naming taxonomy. Existing BEM class names (e.g., `.tray-button__icon`, `.app-bar__title`) will be flattened during migration.

6. **`freefall-` prefix for Foundation/Layout only.** Global styles in Layer 1 and Layer 2 use the `freefall-` prefix (e.g., `.freefall-prose`, `--freefall-space-1`) to avoid collisions. Component-scoped styles do not need a prefix.

### Token Consumption Contract

- **CSS custom properties** (`--freefall-*`) are the single source of truth for all design tokens. All spacing, color, and typography values in CSS must use tokens—never raw `px`, `rem`, or color values.
- **No TypeScript token layer.** The existing `tokens/*.ts` constants and their unit tests are removed. CSS custom properties defined in `tokens.css` are the canonical token definitions. There is no parallel TS representation to keep in sync.
- **Design-system-docs** will reference token values directly from `tokens.css` or from static documentation rather than importing TS constants.

### Package Distribution

The design system remains **source-distributed** with no independent package build step. Consuming apps resolve imports via Vite aliases (`@free-fall/design-system` → `packages/design-system/src`) and Astro/Vite processes the source at app build time. This is appropriate for a monorepo where all consumers are Astro apps with identical toolchains.

## Consequences

**Positive:**
- Components become portable—importing a component guarantees correct rendering without hunting for companion stylesheets.
- `base.css` becomes a thin foundation layer instead of a monolithic entrypoint, making the style cascade predictable.
- New components follow a single, clear pattern: one `.astro` file containing markup, props, styles, and optional script.
- The three-layer model gives every CSS declaration an unambiguous home.
- Removing the TS token layer eliminates a maintenance surface (5 modules + 5 test files + barrel export) that served no production purpose.

**Negative:**
- Migration effort: 7 existing global component stylesheets must be inlined into their Astro components. This is mechanical but touches many files.
- Astro scoped styles add generated `data-astro-*` attributes to the DOM, slightly increasing HTML size. This is negligible for our scale.
- Some component styles need `<style is:global>` for slotted content. Known cases: `AppShell.astro` (styles `<main>` which contains the page slot) and `AppTray.astro` (if styling slotted link groups). Each `is:global` block must scope via child combinators (`.root > .child`) and be documented in the component's spec.
- E2E tests (`responsive.test.ts`) and specs (`app-shell`, `content-grid`, `app-bar`) reference BEM class names from the deleted stylesheets. These must be updated as part of the migration.

**Neutral:**
- The design-system-docs app's component imports propagate naturally, but its token pages (`tokens.astro`, `typography.astro`, `index.astro`) import TS constants that are being deleted. Those pages must be rewritten to read token values from `tokens.css` or static data.
- The `calc()` grid-derivation pattern remains as-is—it operates purely in CSS.

## Alternatives Considered

### 1. CSS Modules

**Rejected.** CSS Modules (`.module.css`) provide scoping through generated class names, but they require explicit `import styles from './foo.module.css'` in each component and produce opaque class names in the DOM. Astro's built-in scoped styles achieve the same isolation with better developer ergonomics and readable class names during development.

### 2. Utility-first CSS (Tailwind / UnoCSS)

**Rejected.** Utility-first frameworks optimize for rapid prototyping but conflict with our design token architecture. Our tokens encode a deliberate, constrained design language; utility classes would expose the full CSS property space and bypass token enforcement. Additionally, the design system has a small component surface—the overhead of a utility framework is not justified.

### 3. Shadow DOM (Web Components)

**Rejected.** Shadow DOM provides the strongest style encapsulation, but it breaks Astro's slot mechanism and SSR model. Styling slotted content requires `::part()` or `::slotted()` selectors, and global resets do not penetrate the shadow boundary (CSS custom properties inherit through, but regular declarations do not). The encapsulation benefits do not outweigh the integration costs for an Astro-first component library.

### 4. Keep Current Approach (global stylesheets for all component CSS)

**Rejected.** The current approach works at small scale but creates invisible dependencies between components and global stylesheets. As the component library grows, it becomes increasingly difficult to know which styles are needed for which components, leading to either "import everything" (current state) or brittle cherry-picking.

### 5. Single-file CSS-in-JS (e.g., vanilla-extract, Panda CSS)

**Rejected.** These tools provide type-safe, co-located styles but introduce a build step and additional dependencies. The design system's explicit goal is zero build step, source-distributed simplicity. Astro's native `<style>` blocks already provide co-location without additional tooling.
