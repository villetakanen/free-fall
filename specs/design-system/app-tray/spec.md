# Feature: App Tray

## Blueprint

### Context

The app tray is the primary navigation surface for FREE//FALL. It follows the Material 3 navigation drawer pattern — a collapsible side panel that adapts across breakpoints from a full-screen modal on small viewports to a persistent rail + tray on large ones. A hamburger button with a micro-interaction animation (menu/close morph) controls the open/closed state at every breakpoint.

Parent spec: `specs/design-system/spec.md`

### Architecture

**Responsive modes:**

| Viewport | Breakpoint | Closed state | Open state |
|---|---|---|---|
| Small (default) | < 620px | Hidden (off-screen) | Full-screen overlay |
| Medium (tablet) | >= 620px | Navigation rail | Full drawer (overlay on content) |
| Large (desktop) | >= 780px | Navigation rail | Tray (pushes content) |

The breakpoints align with `--breakpoint-tablet` (620px) and `--breakpoint-desktop` (780px).

**Anatomy:**

```
+---+-------------------------------+
| B |                               |   B = Hamburger button
| R |        Content area           |   R = Rail (icons only)
| A |                               |   T = Tray (rail + labels)
| I |                               |
| L |                               |
+---+-------------------------------+

+-------+---------------------------+
| B     |                           |
| TRAY  |      Content area         |   Tray open (desktop: pushes)
| icon  |                           |   Tray open (tablet: overlays)
| label |                           |
|       |                           |
+-------+---------------------------+
```

**Dimensions (grid-derived):**

| Dimension | Formula | Resolves to |
|---|---|---|
| Rail width | `calc(10 * var(--freefall-space-1))` | 5rem (80px) |
| Tray width | `calc(40 * var(--freefall-space-1))` | 20rem (320px) |
| Hamburger button size | `calc(6 * var(--freefall-space-1))` | 3rem (48px) |
| Rail icon size | `calc(3 * var(--freefall-space-1))` | 1.5rem (24px) |
| Tray item padding | `var(--freefall-space-2)` | 1rem |

**Hamburger button micro-interaction:**

The hamburger icon animates between `menu` and `close` states using a CSS transition. Uses the Material Symbols Sharp `menu` and `close` ligatures. The transition morphs between the two glyphs via opacity crossfade — no custom SVG path animation.

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

Since the tray requires open/close state and animated transitions, it will be implemented as a **Svelte 5 island** (per design system spec: "If a component requires client-side JS, it must use a Svelte 5 island").

| File | Contents |
|---|---|
| `src/components/AppTray.svelte` | Svelte 5 island — tray, rail, hamburger, state management |
| `src/styles/app-tray.css` | Layout, dimensions, responsive rules, transitions |

**Scrim (small + medium only):**

When the tray is open on small or medium viewports (where it overlays content), a semi-transparent scrim covers the content area. Clicking the scrim closes the tray.

**Transition:**

- Tray slide: `transform` with `200ms ease-out` (open), `150ms ease-in` (close)
- Scrim fade: `opacity` with matching duration
- Hamburger crossfade: `150ms`

**Keyboard and accessibility:**

- Hamburger button: `<button>` with `aria-expanded` and `aria-controls`
- Tray container: `<nav>` with `aria-label="Main navigation"`
- Focus trap when tray is open as overlay (small + medium)
- `Escape` closes the tray when open

### Anti-Patterns

- **No JS-free toggle hack** — Do not use hidden checkbox or `:target` for open/close state. The Svelte island owns the state for accessibility (focus trap, aria attributes).
- **No fixed pixel widths** — All dimensions derive from `--freefall-space-1`. No raw px or rem values in the CSS.
- **No z-index wars** — Define tray and scrim z-index as component-scoped custom properties, not global magic numbers.
- **No content-aware logic** — The tray is a layout shell. It provides slots for nav items but does not know about specific routes or pages.
- **No custom hamburger SVG** — Use Material Symbols Sharp ligatures (`menu` / `close`).

## Contract

### Definition of Done

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
- [ ] Transitions match specified durations
- [ ] Demo app has an app-tray reference page showing the component at all breakpoints
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

- Tray must never obscure content on desktop without a visible close affordance
- Rail must not appear below the tablet breakpoint
- Hamburger button must always be visible and reachable regardless of tray state
- Scrim must not render on desktop (tray pushes content instead of overlaying)

### Scenarios

Scenario: Small viewport — tray hidden by default
  Given: Viewport width is below 620px
  When: The page loads
  Then: No tray or rail is visible; only the hamburger button is rendered

Scenario: Small viewport — tray opens as full-screen overlay
  Given: Viewport width is below 620px
  When: The user clicks the hamburger button
  Then: The tray slides in as a full-screen overlay with scrim behind it

Scenario: Medium viewport — rail visible by default
  Given: Viewport width is between 620px and 779px
  When: The page loads
  Then: A navigation rail (icons only, 5rem wide) is visible; tray is closed

Scenario: Medium viewport — tray opens as overlay
  Given: Viewport width is between 620px and 779px
  When: The user clicks the hamburger button
  Then: The tray expands from the rail to full width (20rem) as an overlay with scrim

Scenario: Large viewport — rail visible, tray pushes content
  Given: Viewport width is 780px or above
  When: The user clicks the hamburger button
  Then: The tray expands and content area shifts right — no scrim, no overlay

Scenario: Escape closes the tray
  Given: The tray is open at any breakpoint
  When: The user presses Escape
  Then: The tray closes and focus returns to the hamburger button

Scenario: Scrim click closes the tray
  Given: The tray is open on small or medium viewport
  When: The user clicks the scrim
  Then: The tray closes

Scenario: Hamburger micro-interaction
  Given: The tray is closed
  When: The user clicks the hamburger button
  Then: The icon crossfades from `menu` to `close` within 150ms
