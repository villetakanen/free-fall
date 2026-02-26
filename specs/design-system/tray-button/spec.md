# Feature: Tray Button

## Blueprint

### Context

The Tray Button is an interactive navigation component specifically designed for use within the application's sidebar (AppTray). It dynamically adapts its layout based on the parent tray's state: showing just an icon when the tray is minimized (on tablet/desktop), and an icon alongside a text label when the tray is fully open (across all screen sizes). This behavior mirrors modern dashboard and chat interfaces (e.g., Gemini).

In aligning with the FREE//FALL design system, the transition between minimized and open states should be managed as gracefully as possible, favoring CSS-driven layout changes based on the parent container's state (e.g., via CSS container queries or parent data attributes).

Parent spec: `specs/design-system/spec.md`

### Architecture

**State management:**

The component's visual presentation (minimized vs. open) is strictly dictated by the width of its parent container using CSS Container Queries (`@container`).
- When the parent container is narrow (e.g., `<= 160px` during the AppTray minimized rail state), the button hides its text label and removes internal flex gaps, shrinking down to display only the geometrically centered icon.
- When the parent container expands, the button natively expands into its fluid geometry, displaying both its icon and the text label.

**Visual Design & Sizing:**

- **Layout**: Flexbox container (`display: flex; align-items: center;`) to perfectly align the icon and text vertically.
- **Spacing**: Adequate padding ensuring a safe, accessible touch target. Gap between icon and label uses a standard spacing token.
- **Label presentation**: Handled as a single line (`white-space: nowrap`). During tray minimization, the label is visually hidden seamlessly without breaking layout.
- **Interactive States**: Clear visual feedback for hover (`:hover`), focus (`:focus-visible`), and active/selected/current-page states.

**Component structure:**

| File | Contents |
|---|---|
| `src/components/TrayButton.astro` | Astro markup: flex container, icon injection (slot or prop), and text label. Provides fallback accessibility traits. |
| `src/styles/tray-button.css` | Flexbox layout, interaction states, and a `@container` query that manages the responsive hiding logic and geometry reset for the minimized label. |

### Anti-Patterns

- **Hardcoded JavaScript Resize Checks**: The component should not observe window width via JavaScript to toggle the label, nor rely on data attribute toggles (`[data-state]`) that CSS cannot naturally animate. Rely entirely on fluid CSS logic (CSS Container Queries `@container`).
- **Text Wrapping**: Text should not wrap to a second line when the container width diminishes. Overflows must be aggressively controlled (`overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`).
- **Inaccessible Icon-only States**: When the label is visually hidden in minimized mode, the button must still expose its intent to screen readers (e.g., using `aria-label` or visually-hidden utility classes), ensuring it does not become an unlabeled icon button.

## Contract

### Definition of Done

- [ ] `TrayButton.astro` provides the HTML scaffold for rendering an icon and text label.
- [ ] `tray-button.css` manages the flex layout, gaps, and padding using design system tokens.
- [ ] When the parent context dictates a minimized tray, the text label is visually hidden, centering the icon.
- [ ] Implements `white-space: nowrap` and `overflow: hidden` to handle text bounds strictly.
- [ ] Employs accessible labeling so screen readers recognize the button context regardless of visual layout.
- [ ] Defines interactive state styling (hover/focus/active) mirroring other interactive components.
- [ ] Demo app mounts a reference section testing the button in simulated open and closed tray environments.
- [ ] Playwright e2e tests cover all Scenarios against build artifacts.
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` tasks pass cleanly.

### Scenarios

Scenario: Open Tray State
  Given: The AppTray is in its expanded (open) state
  When: The user views the Tray Button
  Then: The button prominently displays both the icon and the text label adjacent to each other.

Scenario: Minimized Tray State (Desktop/Tablet)
  Given: The AppTray is collapsed to its minimized state (narrow container width)
  When: The user views the Tray Button
  Then: Only the icon is visible, the container gap is `0`, and the button forces a strict `48px` width/height to perfectly align center with external toggles.

Scenario: Screen Reader Accessibility in Minimized State
  Given: The Tray Button has its text label visually hidden
  When: A screen reader focuses on the button
  Then: The button's purpose is correctly announced (using aria-label or visually-hidden text), providing parity with the expanded state.
