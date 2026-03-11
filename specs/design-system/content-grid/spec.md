# Feature: Content Grid

## Blueprint

### Context

The app shell's content pane currently has basic padding and a `max-width` cap. Game content — particularly the core rulebook — needs a structured layout that provides:

1. A **main column** (67ch) for primary content (prose, rules text)
2. An optional **side column** for supplementary content (tables, infoboxes, images)
3. Responsive behavior that collapses the side column when space is insufficient

The content grid is a CSS Grid layout applied inside `<main>` (in `AppShell.astro`). It replaces the current `max-width` constraint with a grid-based content measure, and its main column (67ch) supersedes `.freefall-prose`'s `max-width: 65ch`.

Parent spec: `specs/design-system/spec.md`

### Architecture

**Grid anatomy:**

```
|  gutter  |  67ch main  |  N side  |  gutter  |  extra  |
```

Five implicit regions. Gutters provide edge spacing on both sides of the content columns. The main column holds primary content. The side column holds supplementary content. Extra space fills the remainder.

**Responsive gutters:**

Gutters adapt to container width via a private custom property (`--_gutter`):

| Container inline size | Gutter | Value |
|---|---|---|
| < 40rem | `var(--freefall-space-2)` | 1rem |
| ≥ 40rem | `var(--freefall-space-4)` | 2rem |

This matches the previous app-shell behavior where horizontal padding was 1rem on narrow viewports and 2rem on tablet+. The base tier grid template includes both left and right gutters.

**Responsive tiers (container-query driven):**

The grid adapts based on the content pane's inline size. The app-shell content pane (`<main>` (in `AppShell.astro`)) declares itself as a size container. The content grid responds via `@container` queries.

| Tier | Side column | Condition |
|---|---|---|
| **Base** | None (single column) | Available inline size < main + 25.6ch + overhead |
| **Narrow side** | 25.6ch | Available inline size fits main + 25.6ch + overhead |
| **Wide side** | 42.5ch | Available inline size fits main + 42.5ch + overhead |

*Overhead = 2 gutters + 1 column gap = `3 × var(--freefall-space-4)` = 6rem.* (At the two-column breakpoints, gutters are always `--freefall-space-4`.)

Gutters and gap are grid-derived (rem); column widths are type-derived (ch). Container query `calc()` mixes both — the browser resolves each unit in its proper context.

**Exact container-query breakpoints:**

| Tier | Condition |
|---|---|
| **Narrow side** | `@container content (inline-size >= calc(92.6ch + 6rem))` — `67ch + 25.6ch + 3 × 2rem` |
| **Wide side** | `@container content (inline-size >= calc(109.5ch + 6rem))` — `67ch + 42.5ch + 3 × 2rem` |

At the base tier, all content — including items targeting the side — flows in the single main column.

**Named grid lines:**

| Line | Position |
|---|---|
| `main-start` / `main-end` | Bounds of the 67ch primary column |
| `side-start` / `side-end` | Bounds of the side column (present only in 2-column tiers) |

**Placement classes:**

| Class | Grid column | Fallback (base tier) |
|---|---|---|
| *(default)* | `main` | Main column |
| `.content-side` | `side` | Falls into main column |
| `.content-wide` | `main-start / side-end` | Full main column |

At the base tier, `.content-side` and `.content-wide` items stay in the main column since the side column does not exist.

**Wide content overflow (base tier):**

`.content-wide` elements (e.g., large tables) may exceed the 67ch main column at base tier. To prevent layout breakage, `.content-wide` gets `overflow-x: auto` so oversized content scrolls horizontally within the main column rather than overflowing the viewport.

**Tokens (CSS custom properties):**

| Token | Value | Purpose |
|---|---|---|
| `--freefall-content-main` | `67ch` | Main column width |
| `--freefall-content-side-wide` | `42.5ch` | Wide side column |
| `--freefall-content-side-narrow` | `25.6ch` | Narrow side column |

Gutters and gap reuse existing spacing tokens (`--freefall-space-2` and `--freefall-space-4`). No new spacing tokens needed. The gutter size is managed via a private custom property `--_gutter` on `.content-grid` that switches from `space-2` to `space-4` at 40rem container width.

**Token duality:**

CSS custom properties in `tokens.css`. TypeScript constants in `src/tokens/content-grid.ts`. Values must stay in sync.

**File locations:**

| File | Contents |
|---|---|
| `src/styles/content-grid.css` | Grid layout, container query tiers, placement classes |
| `src/styles/tokens.css` | Content grid dimension tokens (`--freefall-content-*`) |
| `src/tokens/content-grid.ts` | TypeScript constants mirroring the CSS tokens |
| `src/components/AppShell.astro` | Container declaration on `<main>` (scoped styles) |

`content-grid.css` is imported via `base.css`.

**Container query setup:**

`<main>` (in `AppShell.astro`) gains `container-type: inline-size` and `container-name: content`. The content grid CSS uses `@container content (inline-size >= ...)` to switch between tiers. Container queries are required (not media queries) because the content pane's available width depends on the nav tray state, not just viewport width.

**Changes to app-shell:**

| Current | After |
|---|---|
| `max-width: calc(120 * var(--freefall-space-1))` on `<main>` (in `AppShell.astro`) | Removed — the grid template defines width constraints |
| Horizontal padding on `<main>` (in `AppShell.astro`) | Removed — the grid's gutter columns handle edge spacing |
| Vertical padding on `<main>` (in `AppShell.astro`) | Unchanged |
| No container declaration | `container-type: inline-size; container-name: content` |

**Relationship to `.freefall-prose`:**

The content grid's 67ch main column replaces `.freefall-prose`'s `max-width: 65ch` as the content measure. `.freefall-prose` will be removed in a future pass once the main content grid is active on all content pages.

**Demo page:**

The design system demo app gets a `content-grid` page (`apps/design-system/src/pages/content-grid.astro`) showing:

- All three tiers with sample content in main and side columns
- Each placement class (default, `.content-side`, `.content-wide`)
- How tier transitions look when the viewport / tray state changes

### Anti-Patterns

- **No fixed pixel widths for content columns** — Column widths use `ch` to maintain a readable measure regardless of font size or type-base changes.
- **No media queries for tier switching** — Use container queries. The content pane's width depends on nav tray state, not just viewport.
- **No nesting content grids** — One content grid per page. It is a page-level layout concern, not a nestable component.
- **No raw values in grid template** — All column widths reference tokens. The `67ch` / `42.5ch` / `25.6ch` values live in `tokens.css`, not inline in the grid template.

## Contract

### Definition of Done

- [ ] `src/styles/tokens.css` defines `--freefall-content-main`, `--freefall-content-side-wide`, `--freefall-content-side-narrow`
- [ ] `src/tokens/content-grid.ts` exports TypeScript constants matching the CSS tokens
- [ ] `src/index.ts` barrel exports the content-grid tokens
- [ ] Unit tests verify TypeScript token values
- [ ] `src/styles/content-grid.css` implements the three-tier responsive grid with container queries
- [ ] Placement classes (`.content-side`, `.content-wide`) work in all three tiers
- [ ] At base tier, side-targeted content falls back to the main column without overflow or hidden content
- [ ] `.content-wide` has `overflow-x: auto` so oversized content (e.g., wide tables) scrolls horizontally at base tier
- [ ] `<main>` (in `AppShell.astro`) declares `container-type: inline-size` in `AppShell.astro` scoped styles
- [ ] Current `max-width` and horizontal padding on `<main>` (in `AppShell.astro`) removed
- [ ] `content-grid.css` imported via `base.css`
- [ ] Design system demo app has a `content-grid` page demonstrating all tiers and placement classes
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

- Main column must never exceed 67ch at any tier
- Side column must not appear when the container is too narrow to fit it alongside the main column
- Placement fallback: `.content-side` and `.content-wide` items must be visible (not hidden, clipped, or overflowing) at all tiers
- Grid gutters must use spacing tokens, never raw values
- Gutters must remain wider than the browser scrollbar (~15–17px); even the narrow gutter `--freefall-space-2` (1rem / 16px) satisfies this
- Container query breakpoints must account for gutters and gap — no content clipping at tier boundaries
- Token values in CSS and TypeScript must match

### Scenarios

```gherkin
Scenario: Single-column layout on narrow container
  Given the content pane is narrower than the narrow-side threshold
  When a page uses .content-grid
  Then all content, including .content-side items, renders in a single column up to 67ch wide

Scenario: Narrow side column appears
  Given the content pane is wide enough for 67ch + 25.6ch + overhead
  When a page uses .content-grid with .content-side items
  Then the main column is 67ch and the side column is 25.6ch

Scenario: Wide side column appears
  Given the content pane is wide enough for 67ch + 42.5ch + overhead
  When a page uses .content-grid with .content-side items
  Then the main column is 67ch and the side column is 42.5ch

Scenario: Tray toggle changes tier
  Given a desktop viewport at the wide-side tier with nav tray closed
  When the user opens the nav tray, reducing content pane width
  Then the grid may drop to narrow-side or base tier based on remaining space

Scenario: Wide content spans both columns
  Given the grid is in a two-column tier
  When an element has the .content-wide class
  Then it spans from main-start to side-end

Scenario: Wide content scrolls at base tier
  Given the grid is in the base (single-column) tier
  When a .content-wide element (e.g., a wide table) exceeds 67ch
  Then the element shows a horizontal scrollbar within the main column
  And the page layout does not overflow horizontally

Scenario: Demo page shows all tiers
  Given the design system demo app is built
  When a developer navigates to the content-grid page
  Then all three tiers are demonstrated with sample content in main and side placements
```
