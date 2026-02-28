# Feature: Tray Link Group

## Blueprint

### Context

The Tray Link Group specifies the pattern for secondary/nested navigation links in the AppTray. As seen in interfaces like the Gemini web UI and other Material 3 implementations, these inner links appear dynamically when the tray is opened and are hidden when the tray operates as a minimized rail. On mobile viewports (where the tray is fully expanded as an overlay), they are visible by default. 

In FREE//FALL, this pattern will be used to display an index of `core-rules` articles directly within the opened drawer, allowing immediate navigation without loading an intermediate index page. It relies entirely on CSS and progressive enhancement, fitting into the existing design system architecture cleanly.

Parent spec: `specs/design-system/spec.md`

### Architecture

**State management:**

Similar to `TrayButton`, the visibility of `TrayLinkGroup` is strictly driven by CSS Container Queries (`@container`) targeting the parent container's `inline-size`.
- **Minimized (Rail):** When the tray is collapsed (e.g. width `<= 64px`), the secondary links are removed from the layout context (e.g., `display: none` or `visibility: hidden`) or structurally collapsed to avoid clutter and prevent them from being reachable by keyboard.
- **Open (Tray):** When the container fluidly expands, the links are revealed.

**Visual Design & Sizing:**

- **Hierarchy:** Secondary links use smaller typography (i.e. `.text-ui-small`) but a high-emphasis color (e.g., `var(--freefall-text-display)`) so they remain visually subordinate to the primary `TrayButton` through indentation and smaller text size while keeping high contrast.
- **Indentation:** The group is indented or padded slightly on the inline-start axis so that the sub-links align well with the text of the primary `TrayButton`, leaving the icon column clear.
- **Shape:** Follows the Material 3 specification for navigation items by using fully rounded (pill-shaped) corners (`border-radius: 9999px`).
- **Hover/Active:** Subtle interactions using design tokens (e.g., a slim left-border or light background highlight for the active link). They must not overwhelm the primary tray buttons.
- **Label presentation:** Strictly single line. Text overflows are truncated using an ellipsis.

**Component structure:**

| File | Contents |
|---|---|
| `packages/design-system/src/components/TrayLinkGroup.astro` | Renders a semantic nested list structure (`<ul>`, `<li>`) that houses the secondary links. |
| `packages/design-system/src/components/TrayLink.astro` | Individual link component within the group, providing semantic `<a>` tags and localized text truncation. |
| `packages/design-system/src/styles/tray-link-group.css` | Handles visibility via `@container` query logic, hierarchical typography rules, indentation, and interaction states. |

### Anti-Patterns

- **JavaScript Observer Dependencies:** Do not depend on JavaScript event listeners to toggle visibility when resizing or opening the tray. All geometric layout shifts must be CSS-driven via `@container`.
- **Forced heights or complex absolute positioning:** Do not fix the height of the link group. Let the document flow naturally expand vertically when the links appear, allowing them to shift elements beneath them.
- **Icon redundancy:** Do not add icons to secondary links unless they communicate essential and separate semantic meaning. Indentation and scale serve as sufficient hierarchy markers.
- **Focusing hidden elements:** Developers must not leave hidden links keyboard-reachable. A hidden state must map safely to `display: none` or `visibility: hidden` to block the `Tab` key.

## Contract

### Definition of Done

- [ ] `TrayLinkGroup.astro` and `TrayLink.astro` are implemented.
- [ ] Component renders a semantic nested list of secondary links.
- [ ] CSS Container Queries (`@container`) are exclusively used to show the links in expanded mode and collapse them entirely (hiding from view and layout) in minimized rail mode.
- [ ] Links are styled with smaller typography and clear truncation (ellipsis) preventing layout warp on long article titles.
- [ ] Nested links are unreachable via keyboard (tab order) when the tray is minimized.
- [ ] Demo app mounts a reference page (`tray-link-group.astro`) that tests the group within simulated `<div data-tray-state="open">` and `<div data-tray-state="minimized">` contexts.
- [ ] Playwright e2e tests cover all specified Scenarios.
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass optimally.

### Regression Guardrails

- The link group must smoothly disappear or hide without causing layout flashes when shifting to the rail view.
- Overflowing text must truncate cleanly and not break into multiple rows.
- Interactive bounds (padding) must provide an adequate hit area for cursor/touch interaction, despite the smaller label scale.

### Scenarios

```gherkin
Scenario: Expanded Tray shows inner links
  Given the AppTray is in the expanded (open) state
  When a user views the navigation structure
  Then the TrayLinkGroup displays its nested links fully visible and aligned with the primary text column.

Scenario: Minimized Tray hides inner links
  Given the AppTray is in the collapsed (rail) state
  When a user views the navigation rail
  Then the nested links are completely hidden, removing themselves from both visual layout and screen reader sequences.

Scenario: Screen Reader & Keyboard Navigation
  Given the AppTray is expanded
  When the user navigates using the 'Tab' key
  Then the inner links receive focus iteratively
  And they visually display their focus outline predictably.

Scenario: Prevent Focus when Minimized
  Given the AppTray is in the collapsed (rail) state
  When the user navigates using the 'Tab' key
  Then the hidden internal links do not get focus.

Scenario: Long Title Handling
  Given a TrayLink contains a label exceeding available tray width
  When rendered in the expanded tray
  Then the label truncates gracefully using a text ellipsis.
```
