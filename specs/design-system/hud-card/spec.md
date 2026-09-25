# Feature: HUD Card

## Blueprint

### Context

Parent spec: `specs/design-system/spec.md`

The **HUD Card** is the reusable content box used inside Tactical HUD panes for compact rules, controls, and status summaries. It extracts the repeated `.hud-card` pattern from `TacticalHud.astro` so pane content can be authored consistently by the design system app, the main app, and scenario-provided HUD slots.

HUD Card is not a standalone page card or marketing surface. It belongs to inspector/dock contexts where information density is high and the data voice is appropriate.

### Architecture

| File | Responsibility |
|---|---|
| `packages/design-system/src/components/HudCard.astro` | Reusable card shell with optional mono title row and Material Symbols Sharp icon |
| `packages/design-system/src/components/TacticalHud.astro` | Uses `HudCard` for built-in pane content |
| `apps/design-system/src/pages/hud-card.astro` | Living documentation and visual examples |
| `apps/design-system/src/layouts/BaseLayout.astro` | Design-system navigation entry |

API:

```ts
interface Props {
  title?: string;
  icon?: string;
  class?: string;
}
```

- `title` renders an uppercase data-voice heading when provided.
- `icon` renders a Material Symbols Sharp glyph before the title when provided.
- The default slot receives arbitrary pane content.
- Descendant `.hud-card__copy` copy is styled by the component for simple text blocks.
- Title text uses `--freefall-type-ui-small` for dense mono UI headings.
- Copy text uses `--freefall-type-base` for normal readable prose.

Geometry:

- Background: `--freefall-bg-surface-1`
- Border: `--freefall-border-hairline`
- Radius: `2px`
- Padding: `calc(1.25 * var(--freefall-space-1))`
- Title gap: `calc(0.5 * var(--freefall-space-1))`
- Title divider: `1px solid var(--freefall-color-primary-800)`
- Title font size: `var(--freefall-type-ui-small)`
- Copy font size: `var(--freefall-type-base)`

### Constraints

HUD Card uses editorial body copy and mono headings according to `DESIGN.md`: the box title is structured data; the card body is prose or nested data components supplied by the caller.

HUD Card is a presentational shell. Interactive behavior belongs to nested controls or to the containing Tactical HUD pane.

## Contract

### Definition of Done

- [x] `HudCard.astro` exists in the design-system package.
- [x] Tactical HUD built-in pane boxes render through `HudCard`.
- [x] The design-system app has a `/hud-card/` reference page.
- [x] The design-system navigation links to `/hud-card/`.
- [x] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

- HUD Card must never require JavaScript to render its title, icon, or slot content.
- HUD Card must never use attribute stat colors for generic UI state.
- HUD Card must never render its optional icon as an interactive element.

### Scenarios

```gherkin
Scenario: Titled HUD card renders structured heading
  Given a HudCard with title "RESOLUTION MATRIX" and icon "target"
  When the page renders
  Then the card contains a mono heading with the target icon and title
  And the icon is hidden from assistive technology

Scenario: Untitled HUD card renders slot content
  Given a HudCard without a title
  When the page renders
  Then the card renders its default slot without an empty heading row

Scenario: HUD card works without JavaScript
  Given JavaScript is disabled
  When a page containing HudCard renders
  Then the card title, icon, and slot content remain visible
```
