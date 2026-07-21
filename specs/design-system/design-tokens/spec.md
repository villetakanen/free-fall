# Feature: Design Tokens

## Blueprint

### Context

Design tokens define the visual vocabulary of FREE//FALL: colors, breakpoints, spacing, typography, and content dimensions. They are the lowest layer of the design system, consumed by styles, components, and apps. CSS custom properties in `tokens.css` are the sole token source; there is no TypeScript token layer, barrel export, or parity requirement.

Parent spec: `specs/design-system/spec.md`

### Architecture

**Two-layer token model:**

| Layer | Purpose | Naming pattern |
|---|---|---|
| Base palette | Raw color values, not used directly in components | `--freefall-color-{scale}-{step}` |
| Semantic tokens | Role-based aliases that reference the base palette | `--freefall-{role}-{variant}` |

Components and styles consume **semantic tokens only**. Base palette tokens exist to define the palette and to be referenced by semantic tokens — they should not appear in component CSS.

Production component dimensions derive from design tokens. Literal lengths remain
only where CSS cannot consume custom properties in a query condition, where a
large radius encodes a circle or pill, and where the standard visually-hidden
clipping technique requires one-pixel geometry.

**Base palette: Deep Space Cobalt** (`primary`)

11-step scale from ceramic white to absolute void:

| Step | HSL | Role |
|---|---|---|
| 50 | `hsl(210, 36%, 96%)` | Harsh Ceramic Glare |
| 100 | `hsl(210, 37%, 88%)` | Cold Ceramic Surface |
| 200 | `hsl(210, 32%, 78%)` | Shadowed Ceramic |
| 300 | `hsl(211, 23%, 44%)` | Illuminated Cobalt |
| 400 | `hsl(212, 26%, 36%)` | Mid-Space Grey |
| 500 | `hsl(213, 29%, 28%)` | Cobalt Surface (Base) |
| 600 | `hsl(213, 32%, 22%)` | Dimmed Hull |
| 700 | `hsl(214, 34%, 16%)` | Deep Steel |
| 800 | `hsl(216, 36%, 11%)` | Penumbra |
| 900 | `hsl(219, 41%, 7%)` | Void Black |
| 950 | `hsl(220, 43%, 3%)` | Absolute Zero |

**Base palette: Isotope Neon** (`accent`)

3-step scale for harsh industrial contrast:

| Step | HSL | Role |
|---|---|---|
| 400 | `hsl(64, 80%, 54%)` | Isotope Contrast |
| 500 | `hsl(64, 90%, 45%)` | Hover state |
| 900 | `hsl(64, 70%, 15%)` | Alert background |

**Semantic tokens:**

| Token | References | Usage |
|---|---|---|
| `--freefall-bg-canvas` | `primary-950` | Page background |
| `--freefall-bg-surface-1` | `primary-900` | Card / panel background |
| `--freefall-bg-surface-2` | `primary-800` | Elevated surface |
| `--freefall-text-display` | `primary-50` | Headings, hero text |
| `--freefall-text-body` | `primary-100` | Body copy |
| `--freefall-text-muted` | `primary-200` | Secondary / disabled text with normal-text contrast |
| `--freefall-text-high` | `primary-50` | Explicit high-emphasis text |
| `--freefall-text-link` | `accent-500` | Link marker and definition emphasis |
| `--freefall-border-subtle` | `primary-800` | Dividers, low-contrast borders |
| `--freefall-border-strong` | `primary-700` | High-contrast borders |
| `--freefall-action-base` | `primary-500` | Buttons, links (default) |
| `--freefall-action-hover` | `primary-400` | Buttons, links (hover) |
| `--freefall-alert-base` | `accent-400` | Alert text, emphasis |
| `--freefall-alert-bg` | `accent-900` | Alert panel background |
| `--freefall-text-shadow-overlay` | *(composite)* | 3-layer text shadow for legibility over images/backgrounds |

**File locations:**

| File | Contents |
|---|---|
| `src/styles/tokens.css` | All CSS custom properties (base palette + semantic + breakpoints) |

**Breakpoints** (defined in platform spec, owned here):

| Name | Value | CSS property |
|---|---|---|
| tablet | `620px` | `--breakpoint-tablet` |
| desktop | `780px` | `--breakpoint-desktop` |

### Anti-Patterns

- **No semantic color aliases referencing other semantic tokens** — Semantic color aliases reference base palette values only. Composite non-color tokens such as text shadows are documented separately.
- **No base palette in component CSS** — Components use semantic tokens. The palette is an internal detail.
- **No hardcoded color values in components** — Every color must come from a token. If a needed color doesn't exist, add a token first.
- **No opacity hacks for color variants** — Each needed shade gets its own palette step. Do not use `rgba()` or `opacity` to derive variants from existing tokens.

## Contract

### Definition of Done

- [x] `src/styles/tokens.css` defines all base palette and semantic custom properties listed above
- [x] Semantic color tokens reference base palette tokens via `var()`
- [x] `src/styles/base.css` imports `tokens.css`
- [x] Demo app shows every base palette and public semantic color token listed above; other token families have representative demos on their owning pages
- [ ] `--freefall-text-muted` meets WCAG AA for normal text on canvas and supported surfaces
- [x] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

- Semantic color aliases must only reference base palette custom properties
- No color value may appear in a component or style file that isn't a `var(--freefall-*)` reference
- Normal-size semantic text tokens maintain at least 4.5:1 contrast on their supported backgrounds

### Scenarios

Scenario: Base palette renders correctly
  Given: `tokens.css` is imported via `base.css`
  When: An element uses `var(--freefall-bg-canvas)`
  Then: The element background is `hsl(220, 43%, 3%)`

Scenario: Demo page shows color tokens
  Given: The demo app is built
  When: A developer navigates to the tokens page
  Then: All base palette and public semantic color tokens listed in this spec are rendered as labeled color swatches
