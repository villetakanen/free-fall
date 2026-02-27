# Feature: Hamburger Button

## Blueprint

### Context

The Hamburger Button is an interactive UI component used to toggle navigation sidebars and trays (such as the AppTray). It provides an animated micro-interaction that cleanly transitions between a "menu" (three parallel horizontal bars) and a "close" (cross) state.

In keeping with the FREE//FALL design system constraints, the visual state is managed entirely through pure CSS — shipping zero JavaScript to the client. The component also enforces the Material Design 3 (M3) spatial layout, adhering strictly to global spacing tokens while introducing a highly specific visual character.

Parent spec: `specs/design-system/spec.md`

### Architecture

**State management:**

The open/close interactive state is managed via the **CSS Checkbox Hack**. A visually hidden `<input type="checkbox">` stores the state, while the visible button container acts as an associated `<label>`. CSS sibling combinators (e.g., `input:checked + .bars-container`) trigger the animation. 

**Visual Design & Sizing:**

- **Background container**: Fully rounded (`border-radius: 50%`) matching M3 icon button guidelines. Background color dynamically shifts on hover.
- **Touch target size**: Matches M3 accessible targets utilizing existing layout grid tokens (`calc(6 * var(--freefall-space-1))` evaluates to 48px).
- **Bars**: Three inner `<span>` pseudo-elements. The bars feature completely straight, non-rounded edges (`border-radius: 0`).

**Animation Choreography:**

Traditionally, CSS hamburger menus rotate their top and bottom bars to form an "X". To create a distinct, modern identity, **this component uses `skewY()` instead of `rotate()`**. Because the skew operation transforms the Y axis without altering the X plane bounds, the left and right outer vertical edges of the bars remain perfectly straight and vertical, creating a sharp stylized cross.

1. **Top Bar**: Translates down to the Y-center, and applies `transform: skewY(45deg)`.
2. **Bottom Bar**: Translates up to the Y-center, and applies `transform: skewY(-45deg)`.
3. **Middle Bar**: Animates out purely via horizontal compression anchored entirely to the right edge. Specifically, width compresses using `transform-origin: right center; transform: scaleX(0.15);` alongside a neon yellow background color fade.

All animations use an `ease-in-out` timing function stretching across 270ms.

**Tokens used:**

| Property | Token |
|---|---|
| Interaction target (`width/height`) | `calc(6 * var(--freefall-space-1))` |
| Icon lines color | `--freefall-text-body` |
| Hover surface background | `--freefall-action-hover` |

**Component structure:**

| File | Contents |
|---|---|
| `src/components/HamburgerButton.astro` | Astro markup: hidden checkbox, accessible label, animated bars. |
| `src/styles/hamburger-button.css` | Component styles, sizing, rounded flexbox container styling, and the `:checked` skew layout logic. |

### Anti-Patterns

- **No JavaScript**: The open/close core state and transition animation must not require JS or Svelte. No event listeners on the client.
- **No rotation for the X**: The top and bottom crossbars must exclusively use `skewY()` instead of `rotate()`. If horizontal lines become slanted but the vertical edges tilt, the specification is broken. The vertical outer cuts must stay completely vertical.
- **No rounded edges on bars**: Bars must have sharp `border-radius: 0` geometry.
- **No center-collapse on middle bar**: The middle bar must collapse strictly towards the absolute right, rather than scaling evenly toward the horizontal center. 
- **No inline SVG paths**: Since we require rigid box-model skewing rather than path morphing, the geometry must be built with structural `<span>` blocks or `::before`/`::after` elements.

## Contract

### Definition of Done

- [ ] `HamburgerButton.astro` provides the HTML scaffold for a pure-CSS boolean toggle.
- [ ] `hamburger-button.css` manages the 48px rounded M3 target container and nested bars.
- [ ] Checkbox `:checked` CSS handles the transition to the close state.
- [ ] Middle bar compresses horizontally to the right via `transform-origin: right` and `scaleX(0.15)` bounding, shifting to the accent color.
- [ ] Top and bottom bars form an X using `translateY` offset and `skewY` (45deg / -45deg).
- [ ] Left and right limits of all expanding/skewing bars act as perfectly vertical bounds.
- [ ] Bars utilize sharp 0px border-radius edges.
- [ ] Demo app mounts a reference subpage testing the toggle in standalone isolation.
- [ ] Playwright e2e tests cover all Scenarios against build artifacts.
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` tasks pass cleanly.

### Regression Guardrails

- The component enforces 100% operation with client JavaScript explicitly disabled.
- The visual vertical edges of the horizontal top and bottom bars must never become slanted at any point during or after the tween frame animation.

### Scenarios

Scenario: Default closed state
  Given: The hamburger button renders with its untoggled (unchecked) input state
  When: The user observes the component
  Then: Three uniform, straight horizontal bars are stacked parallel within a circular 48px boundary.

Scenario: Toggle to open state
  Given: The hamburger button rests in its default parallel state
  When: The user clicks the round label target
  Then: The middle bar scales out of view toward the rigid right edge. The top and bottom bars snap to the collective center coordinates and skew oppositely at 45 degrees, establishing a sharply cut "X" formation.

Scenario: Hover state interactions
  Given: The user views the button
  When: The hardware cursor enters the 48px boundary coordinates
  Then: A circular background canvas color (`--freefall-action-hover`) highlights to broadcast its interactive trigger nature.
