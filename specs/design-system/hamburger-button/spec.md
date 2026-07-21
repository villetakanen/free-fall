# Feature: Hamburger Button

## Blueprint

### Context

The Hamburger Button is an interactive UI component used to toggle navigation sidebars and trays (such as the AppTray). It provides an animated micro-interaction that cleanly transitions between a "menu" (three parallel horizontal bars) and a "close" (cross) state.

In keeping with the FREE//FALL design system constraints, the visual state and pointer interaction work without JavaScript. Progressive enhancement supplies keyboard button semantics and synchronizes expanded state for assistive technology. The control keeps the Material Design 3 (M3) target size while using FREE//FALL's sharp visual character.

Parent spec: `specs/design-system/spec.md`

### Architecture

**Interaction contract:**

The component owns a persistent boolean state control and a visible 48px trigger. Pointer activation and visual state work without JavaScript. With JavaScript available, the trigger behaves as a keyboard-operable button, references the region it controls, and exposes whether that region is expanded.

**Visual Design & Sizing:**

- **Background container**: Fully rounded (`border-radius: 50%`) matching M3 icon button guidelines. Background color dynamically shifts on hover.
- **Touch target size**: Matches M3 accessible targets utilizing existing layout grid tokens (`calc(6 * var(--freefall-space-1))` evaluates to 48px).
- **Bars**: Three inner `<span>` pseudo-elements. The bars feature completely straight, non-rounded edges (`border-radius: 0`).

**Visual transition:**

The parallel bars become a sharp skewed cross rather than a soft rotated icon. The transition preserves straight outer cuts and is suppressed when the user requests reduced motion. Exact transforms and timing are implementation details owned by `HamburgerButton.astro`.

**Tokens used:**

| Property | Token |
|---|---|
| Interaction target (`width/height`) | `calc(6 * var(--freefall-space-1))` |
| Icon lines color | `--freefall-text-body` |
| Hover surface background | `--freefall-action-hover` |

**Props:**

| Prop | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `id` | `string` | no | `"hamburger-toggle"` | Internal checkbox id and trigger id prefix |
| `controls` | `string` | no | — | Id exposed through `aria-controls` |
| `label` | `string` | no | `"Toggle navigation"` | Trigger accessible name |

**Component structure:**

| File | Contents |
|---|---|
| `src/components/HamburgerButton.astro` | State, semantic trigger, animated bars, co-located styling, and progressive keyboard/ARIA enhancement. |

### Anti-Patterns

- **CSS baseline**: Pointer operation and visual state remain available without JavaScript or a framework island.
- **No rotation for the X**: The top and bottom crossbars must exclusively use `skewY()` instead of `rotate()`. If horizontal lines become slanted but the vertical edges tilt, the specification is broken. The vertical outer cuts must stay completely vertical.
- **No rounded edges on bars**: Bars must have sharp `border-radius: 0` geometry.
- **No center-collapse on middle bar**: The middle bar must collapse strictly towards the absolute right, rather than scaling evenly toward the horizontal center. 
- **No inline SVG paths**: Since we require rigid box-model skewing rather than path morphing, the geometry must be built with structural `<span>` blocks or `::before`/`::after` elements.

## Contract

### Definition of Done

- [x] `HamburgerButton.astro` provides the HTML scaffold for a CSS boolean toggle.
- [x] Co-located style manages the 48px rounded target and nested bars.
- [x] Checkbox `:checked` CSS handles the transition to the close state.
- [x] Middle bar compresses toward the right and shifts to the link color.
- [x] Top and bottom bars form a cross using translate and skew transforms.
- [x] Bars use sharp zero-radius edges.
- [x] The visible trigger exposes button semantics, controlled region, and synchronized expanded state with JavaScript.
- [x] Enter and Space activate the focused trigger; focus remains visibly indicated.
- [x] Reduced motion reduces transition duration.
- [x] Demo app mounts a standalone reference page.
- [ ] Playwright e2e tests cover all Scenarios against build artifacts.
- [x] `pnpm build`, `pnpm lint`, and `pnpm test` tasks pass cleanly.

### Regression Guardrails

- Pointer operation and visual state remain functional with client JavaScript disabled.
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

Scenario: Keyboard activation exposes state
  Given: JavaScript is enabled and focus is on the trigger
  When: The user presses Enter or Space
  Then: The controlled region toggles and the trigger reports the resulting expanded state

Scenario: Reduced motion
  Given: The user requests reduced motion
  When: The control changes state
  Then: The visual state changes without a decorative transition

Scenario: Hover state interactions
  Given: The user views the button
  When: The hardware cursor enters the 48px boundary coordinates
  Then: A circular background canvas color (`--freefall-action-hover`) highlights to broadcast its interactive trigger nature.
