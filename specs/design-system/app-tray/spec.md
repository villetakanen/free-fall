# Feature: App Tray

## Blueprint

### Context

The app tray is the primary navigation surface for FREE//FALL. It offers modern, no-frills navigation across mobile, pad, and desktop: a viewport-capped modal drawer on small viewports, a navigation rail that expands on pad, and a persistent expanded sidebar on desktop that the reader can collapse to a rail. A hamburger button with a bar-to-cross micro-interaction controls the state at every breakpoint.

The component is built with progressive enhancement: all layout, toggle, transitions, and scrim work with pure HTML + CSS. A small inline script adds keyboard support (Escape to close) and focus trap (modal overlay mode) as enhancements.

Parent spec: `specs/design-system/spec.md`

### Architecture

**Responsive modes:**

Each breakpoint has a **default state** and a **toggled state**. The toggle follows the default: it *opens* the tray where the default is hidden or a rail (mobile, pad), and *collapses* it where the default is expanded (desktop). So the reader always gets a usable default without touching the control — full navigation on desktop, a compact rail on pad, out of the way on mobile.

| Viewport | Breakpoint | Default state | Toggled state |
|---|---|---|---|
| Small (mobile) | < 620px | Hidden (off-screen) | Modal drawer, 320px wide, viewport-capped (overlay) |
| Medium (pad) | >= 620px | Navigation rail | Full drawer (overlay on content) |
| Large (desktop) | >= 780px | Expanded tray (320px, pushes content) | Collapsed to the navigation rail |

Rationale: the desktop default is the expanded sidebar because navigation whose top level is not icon-worthy (e.g. the styleguide's category groups) is useless as a rail-only default. Content-heavy apps (the rulebook) may still collapse to the rail to reclaim reading width. The breakpoints align with `--breakpoint-tablet` (620px) and `--breakpoint-desktop` (780px).

**Anatomy:**

```
+---+-------------------------------+
| B |                               |   B = Hamburger button      
| R |        Content area           |   R = Rail (TrayButton icon)
| A |                               |   T = Tray (TrayButton icon + label)
| I |                               |   
| L |                               |
+-C-+-------------------------------+   C = Rail Column (main container)

+-------+---------------------------+
| B     |                           |
| TRAY  |      Content area         |   Tray open (desktop: pushes)
| icon  |                           |   Tray open (tablet: overlays)
| label |                           |
|       |                           |
+-------+---------------------------+
```

**Toggle mechanism:**

The tray has a persistent HTML open/closed state with associated pointer controls, so opening, closing, responsive layout, and scrim dismissal remain available without JavaScript. Progressive enhancement adds keyboard button behavior, synchronized expanded state, and focus management. The concrete DOM and selectors are owned by `AppTray.astro` and `HamburgerButton.astro`.

**Dimensions (grid-derived):**

| Dimension | Formula | Resolves to |
|---|---|---|
| Rail width | `calc(10 * var(--freefall-space-1))` | 5rem (80px) |
| Tray width | `calc(40 * var(--freefall-space-1))` | 20rem (320px) |
| Hamburger button size | `calc(6 * var(--freefall-space-1))` | 3rem (48px) |
| Hamburger left pos | `var(--freefall-space-2)` | 1rem (16px) |
| Rail icon size | `calc(3 * var(--freefall-space-1))` | 1.5rem (24px) |
| Tray item rail padding | `calc(1.5 * var(--freefall-space-1))` | 12px horizontal |
| Minimized Button Size | `calc(6 * var(--freefall-space-1))` | 48px square |

The drawer itself is the inline-size query container. Its horizontal padding
leaves a query box at or below the shared `64px` threshold in rail mode, so
TrayButton and DrawerBrand collapse without receiving expanded state.

**Hamburger button micro-interaction:**

Three structural bars morph into a sharp skewed cross from checkbox `:checked`
state. See the HamburgerButton spec for its prop and motion contract.

**Surface styling:**

| Element | Token |
|---|---|
| Tray background | `--freefall-bg-surface-1` |
| Rail background | `--freefall-bg-surface-2` |
| Tray border | `--freefall-border-subtle` (right edge) |
| Nav item text | `--freefall-text-body` |
| Nav item active | `--freefall-text-display` |
| Nav item hover | `--freefall-action-hover` background |

**Component structure:**

The tray is an Astro component — server-rendered HTML + CSS with a small inline `<script>` for progressive enhancement. No framework island required.

| File | Contents |
|---|---|
| `src/components/AppTray.astro` | Astro component — AppTray composition, co-located layout/styles, scrim, and progressive enhancement script |

**What works without JavaScript:**

- Hamburger toggle (checkbox + label)
- Drawer slide-in/out transitions
- Hamburger bar morph
- Scrim display and click-to-close (label for same checkbox)
- All responsive modes (rail, overlay, push)

**What JavaScript adds (progressive enhancement):**

- Enter and Space activation with synchronized `aria-expanded` state
- Focus moves into an opened overlay and returns to the trigger when it closes
- `Escape` key closes the tray
- Focus trap when tray overlays content (small + medium viewports)

**Scrim (small + medium only):**

When the tray is open on small or medium viewports (where it overlays content), a `<label>` scrim covers the content area. Clicking the scrim unchecks the checkbox, closing the tray — no JavaScript needed.

**Transition:**

- Tray slide: `transform` with `200ms ease-out` (open), `150ms ease-in` (close)
- Scrim fade: `opacity` with matching duration
- Hamburger bar transition: `270ms` (see HamburgerButton)

**Keyboard and accessibility (progressive enhancement):**

- Tray container: `<nav>` with `aria-label="Main navigation"`
- Toggle identifies the drawer it controls and reports expanded state
- Opening an overlay moves focus to its first available destination
- Focus trap when tray is open as overlay (small + medium) — requires JS
- Closing by toggle, scrim, or `Escape` restores focus to the toggle
- Reduced-motion preference suppresses tray and toggle transitions

**Props:**

| Prop | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `items` | `NavItem[]` | yes | — | Ordered primary navigation items |
| `brandHref` | `string` | no | DrawerBrand default | Publisher link destination |

Each `NavItem` requires `icon`, `label`, and `href`; accepts `active`,
`variant: "nav" | "uplink"`, and `subItems`. Each sub-item requires `label` and
`href` and accepts `active`. Active primary items set `aria-current` and gate
their TrayLinkGroup; active sub-items set `aria-current` on TrayLink.

### Contextual navigation

The tray is **context-agnostic**: it renders whatever `navItems` array the page owner supplies and holds no opinion about site structure. That indirection is the seam for section-scoped or *subsite* navigation — a layout can hand the tray a different `navItems` set depending on the current route, and the tray simply renders it.

Pattern for a subsite (a self-contained section with its own pages, e.g. a scenario under `/scenarios/{slug}/`):

- The consuming layout branches on the route and builds a scoped `navItems` array instead of the global one. The tray needs no change.
- Include an **uplink** as the first item — a nav item with a back icon (`arrow_back`) and `variant: "uplink"`, pointing at the parent section — so the reader can always escape back to the global site. The variant renders it muted with a separator below (see `specs/design-system/tray-button/spec.md`), so the exit is discernible from the subsite's own pages.

  **[DEPRECATED 2026-07-06]** ~~The uplink is an ordinary nav item requiring no tray-specific variant.~~ Visual review of the first implementation showed the uplink was indistinguishable from sibling chapters; `TrayButton` gained the `uplink` variant.
- Everything else in the array is the subsite's own pages, grouped with `subItems` as needed.

Reference implementation: `apps/free-fall/src/layouts/BaseLayout.astro` swaps to `getScenarioSubsiteNav()` when the route is inside a scenario (spec: `specs/content-scenarios/spec.md#navigation`).

The demo (`apps/design-system/src/pages/app-tray-subsite.astro`) is a navigation *pattern* page, not a component reference: the styleguide lists it as "Subsite Navigation" under the **Patterns** category (alongside Navigation Model), and the App Tray reference page links to it — entering and leaving it is the demonstration. Its uplink exits to the styleguide home. See the documentation taxonomy in `specs/design-system/spec.md` for how pattern pages, component references, and primitives are categorized. (Content Grid is a **Primitive**, not part of this pattern.)

### Anti-Patterns

- **No framework islands for toggle UI** — If the core interaction is a state toggle (open/close, show/hide, expand/collapse), use a CSS checkbox pattern, not a Svelte/React island. Reserve framework islands for genuinely complex reactive state.
- **No fixed pixel widths** — All dimensions derive from `--freefall-space-1`. No raw px or rem values in the CSS.
- **No z-index wars** — Define tray and scrim z-index as component-scoped custom properties, not global magic numbers.
- **No content-aware logic** — The tray is a navigation component. It accepts nav items via props but does not own page layout or wrap page content.
- **No custom hamburger SVG or icon glyph swap** — HamburgerButton uses structural bars.
- **No wrapping page content** — The tray renders alongside page content, not around it. The Astro page owns its layout.

## Contract

### Definition of Done

- [x] `AppTray.astro` renders a responsive navigation tray with rail, drawer, and hamburger toggle
- [x] Toggle, transitions, and scrim work without JavaScript
- [x] Small viewport: tray is hidden by default and opens as a 320px capped modal drawer
- [x] Medium viewport: rail visible by default, tray opens with overlay and scrim
- [x] Large viewport: expanded tray (20rem) is the default and pushes content; toggling collapses it to the rail
- [x] Hamburger button morphs structural bars between menu and cross states
- [x] Component dimensions derive from spacing tokens
- [x] Scrim renders on small + medium when tray is open; click-to-close works without JS
- [x] Focus trap active when tray overlays content (progressive enhancement)
- [x] Keyboard activation and expanded state remain synchronized (progressive enhancement)
- [x] Opening an overlay moves focus inside; closing by supported controls restores focus to the trigger
- [x] `Escape` key closes the tray (progressive enhancement)
- [x] Reduced-motion preference suppresses decorative transitions
- [x] Demo app has an app-tray reference page documenting all breakpoints
- [x] Demo app links to a scoped navigation pattern with an `arrow_back` uplink
- [ ] Playwright e2e tests cover all Scenarios against build artifacts
- [x] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

- Tray must never obscure content on desktop without a visible close affordance
- Rail must not appear below the tablet breakpoint
- Hamburger button must always be visible and reachable regardless of tray state
- Scrim must not render on desktop (tray pushes content instead of overlaying)
- Core toggle must work without JavaScript — do not introduce JS dependencies for open/close state
- Do not duplicate DOM nodes for rail icons and drawer icons — use the unified `TrayButton` to handle responsive states
- **State Logic**: Do not pass expanded state to child components. Use the drawer's inline-size query container and the current `64px` threshold.
- **Icon Alignment**: Do not use arbitrary margin values to align icons. Rely on strict math equating the exact center axis computed from the fixed `HamburgerButton`'s radius + absolute left positioning.

### Scenarios

Scenario: Small viewport — tray hidden by default
  Given: Viewport width is below 620px
  When: The page loads
  Then: No tray or rail is visible; only the hamburger button is rendered

Scenario: Small viewport — tray opens as capped modal drawer
  Given: Viewport width is below 620px
  When: The user clicks the hamburger button
  Then: A 320px-wide drawer capped by the viewport slides in with a scrim behind it

Scenario: Medium viewport — rail visible by default
  Given: Viewport width is between 620px and 779px
  When: The page loads
  Then: A navigation rail (icons only, 5rem wide) is visible; tray is closed

Scenario: Medium viewport — tray opens as overlay
  Given: Viewport width is between 620px and 779px
  When: The user clicks the hamburger button
  Then: The tray expands from the rail to full width (20rem) as an overlay with scrim
  And: Overlay describes stacking and modality; it does not establish a push-behavior guarantee

Scenario: Large viewport — expanded by default, collapses to rail
  Given: Viewport width is 780px or above
  When: The page loads
  Then: The expanded tray (20rem) is visible and content is pushed right — no scrim, no overlay
  And: Clicking the hamburger collapses the tray to the rail (5rem), giving content more width

Scenario: No-JS baseline works
  Given: JavaScript is disabled
  When: The user clicks the hamburger button
  Then: The tray opens, transitions play, scrim appears — all via CSS checkbox toggle

Scenario: Escape closes the tray (JS enhancement)
  Given: JavaScript is enabled and the tray is open
  When: The user presses Escape
  Then: The tray closes and focus returns to its trigger

Scenario: Keyboard focus stays in an overlay
  Given: JavaScript is enabled and the tray is open below the desktop breakpoint
  When: The user tabs forward or backward past the final destination
  Then: Focus wraps to the opposite end of the tray

Scenario: Reduced motion
  Given: The user requests reduced motion
  When: The tray opens or closes
  Then: Its state changes without decorative transitions

Scenario: Scrim click closes the tray
  Given: The tray is open on small or medium viewport
  When: The user clicks the scrim
  Then: The tray closes (via label unchecking the checkbox — no JS)

Scenario: Hamburger micro-interaction
  Given: The tray is closed
  When: The user clicks the hamburger button
  Then: Three structural bars morph into a sharp cross

Scenario: Tray renders a scoped subsite nav set
  Given: The layout supplies a scoped `navItems` array whose first item is an `arrow_back` uplink
  When: The page loads inside a subsite route
  Then: The tray renders exactly those items, with no global items added or removed
  And: The uplink is the first item in the rail
  And: The rail, overlay, and push behaviors are identical to the global nav

Scenario: Uplink is discernible from subsite pages
  Given: A scoped `navItems` array with an uplink (variant "uplink") followed by page items
  When: The tray renders the scoped set
  Then: The uplink renders muted with a separator below it, visually distinct from the page items
