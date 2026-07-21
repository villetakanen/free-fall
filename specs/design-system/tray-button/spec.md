# Feature: Tray Button

## Blueprint

### Context

The Tray Button is an interactive navigation component specifically designed for use within the application's sidebar (AppTray). It dynamically adapts its layout based on the parent tray's state: showing just an icon when the tray is minimized (on tablet/desktop), and an icon alongside a text label when the tray is fully open (across all screen sizes). This behavior mirrors modern dashboard and chat interfaces (e.g., Gemini).

The minimized/open presentation is CSS-driven from the parent query box. No
expanded-state prop or data attribute is part of the contract.

Parent spec: `specs/design-system/spec.md`

### Architecture

**State management:**

The component's visual presentation (minimized vs. open) is strictly dictated by the width of its parent container using CSS Container Queries (`@container`).
- When the nearest inline-size query container is `<= 64px`, the button visually hides its text label, removes the gap, and renders a centered 48px target.
- When the parent container expands, the button natively expands into its fluid geometry, displaying both its icon and the text label.

**Visual Design & Sizing:**

- **Layout**: Flexbox container (`display: flex; align-items: center;`) to perfectly align the icon and text vertically.
- **Typography**: Uses high-emphasis text color (`var(--freefall-text-display)`) to ensure good visibility against the rail background.
- **Spacing**: Adequate padding ensuring a safe, accessible touch target. Gap between icon and label uses a standard spacing token.
- **Label presentation**: Handled as a single line (`white-space: nowrap`). During tray minimization, the label is visually hidden seamlessly without breaking layout.
- **Interactive States**: Clear visual feedback for hover (`:hover`), focus (`:focus-visible`), and active/selected/current-page states.

**Variants:**

`variant?: "nav" | "uplink"` (default `"nav"`). The `uplink` variant renders the exit from a subsite scope (see `specs/design-system/app-tray/spec.md#contextual-navigation`): text and icon use `--freefall-text-muted` (restored to `--freefall-text-display` on hover/focus), and an `::after` hairline separator (`--freefall-border-subtle`) draws below the button so the uplink reads as "up a level" rather than a sibling page. Added 2026-07-06 after visual review: with uplink and chapters rendered identically, the two were indistinguishable in the rail.

**Props:**

| Prop | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `icon` | `string` | yes | — | Material Symbols Sharp ligature |
| `label` | `string` | yes | — | Visible and accessible destination label |
| `href` | `string` | yes | — | Link destination |
| `active` | `boolean` | no | falsy | Sets `aria-current="page"` and filled icon styling |
| `variant` | `"nav" \| "uplink"` | no | `"nav"` | Selects ordinary destination or scope-exit presentation |

**Component structure:**

| File | Contents |
|---|---|
| `src/components/TrayButton.astro` | Astro markup: flex container, icon injection (slot or prop), and text label. Co-located `<style>` block owns flexbox layout, interaction states, the uplink variant styling, and a `@container` query that manages the responsive hiding logic and geometry reset for the minimized label. |

### Anti-Patterns

- **Hardcoded JavaScript Resize Checks**: The component must not observe window width or consume inert state attributes. Rely on the nearest inline-size query container.
- **Text Wrapping**: Text should not wrap to a second line when the container width diminishes. Overflows must be aggressively controlled (`overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`).
- **Inaccessible Icon-only States**: When the label is visually hidden in minimized mode, the button must still expose its intent to screen readers (e.g., using `aria-label` or visually-hidden utility classes), ensuring it does not become an unlabeled icon button.

## Contract

### Definition of Done

- [x] `TrayButton.astro` renders an icon and text label inside a link.
- [x] Co-located style manages flex layout, gaps, and token-derived padding.
- [x] At a query box width of 64px or less, the label is visually hidden and the icon target is centered.
- [x] Label uses no-wrap, overflow hiding, and ellipsis.
- [x] Visually hidden label remains in the accessibility tree.
- [x] Hover, focus, current-page, and uplink states have distinct styling.
- [x] Demo uses real inline-size query containers and includes uplink and current-page states.
- [ ] Playwright e2e tests cover all Scenarios against build artifacts.
- [x] `pnpm build`, `pnpm lint`, and `pnpm test` tasks pass cleanly.

### Scenarios

Scenario: Open Tray State
  Given: The AppTray is in its expanded (open) state
  When: The user views the Tray Button
  Then: The button prominently displays both the icon and the text label adjacent to each other.

Scenario: Minimized Tray State (Desktop/Tablet)
  Given: The nearest inline-size query container is 64px or narrower
  When: The user views the Tray Button
  Then: Only the icon is visible, the container gap is `0`, and the button forces a strict `48px` width/height to perfectly align center with external toggles.

Scenario: Screen Reader Accessibility in Minimized State
  Given: The Tray Button has its text label visually hidden
  When: A screen reader focuses on the button
  Then: The button's purpose is correctly announced (using aria-label or visually-hidden text), providing parity with the expanded state.

Scenario: Uplink variant is visually distinct from sibling items
  Given: A Tray Button with variant="uplink" above ordinary nav items
  When: The user views the tray (open or rail state)
  Then: The uplink renders muted with a separator below it, clearly distinct from the items that follow
  And: Hover or focus restores full text emphasis
