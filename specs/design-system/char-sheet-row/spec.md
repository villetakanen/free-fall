# Feature: Character Sheet Row — Layout 1

**Status:** Implemented, 2026-10-23. Tracked by [#84](https://github.com/villetakanen/free-fall/issues/84).

## Blueprint

### Context

Parent: [Design System](../spec.md). Related: [Content Grid](../content-grid/spec.md), [BMG Circle](../bmg-circle/spec.md), and [Playground](../../free-fall/playground/spec.md).

A character-sheet row pairs compact identity and supporting information with a larger play element. Layout 1 reverses the prose grid's wide composition: the small column comes first and the reading-measure column comes second. It is an atomic pair that stays beside itself or stacks in source order according to its own available width.

### Architecture

- Provide a framework-independent `.char-sheet-row` CSS primitive with exactly two direct children. The first is the compact column; the second is the primary column. Consumers choose semantic elements and content. The primitive owns only layout, not fields, sheet state, or Harm rules.
- Reuse the existing prose measures: `--freefall-content-side-wide` (42.5ch) first, `--freefall-content-main` (67ch) second, separated by `--freefall-space-4`. These are the established approximate golden companion proportions; their values remain unchanged.
- When the row can fit both measures and their gap, top-align the two children side by side. Otherwise stack the first child before the second, each filling the available width up to the main prose measure. Layout 1 has two states; it does not adopt the prose grid's intermediate 25.6ch side column.
- Native flex wrapping uses those measures as the two children's bases. The row caps its total width at their sum plus the gap; a child on its own line expands up to the primary measure. This gives host-based adaptation without duplicating the token values in a query condition. A narrow host on a wide viewport still stacks.
- A row placed in the existing page content grid uses the existing `.breakout` placement class to obtain both content tracks. It supplies no page gutters or surface treatment of its own.
- Content stays in DOM order in both arrangements. Nested text and controls may wrap; flexible children can shrink without expanding the page horizontally. Static HTML, Svelte-rendered HTML and print use the same CSS.
- The living reference at `/char-sheet-row-layout-1/` demonstrates real character-sheet content at the available page width and in a narrow host. Navigation exposes it under Character Sheet. Examples distinguish layout from any future Harm editor behavior.
- The Layout 1 specimen stacks Info/Meta above three Harm slots in the compact column, beside one BMG circle in the primary column. On a small host the complete compact column precedes BMG. Both specimens render statically with the same values; this is a composition reference, not a character editor.
- [Playground](../../free-fall/playground/spec.md) consumes the same primitive with callsign-led identity, chosen Class Skills, three editable Harm slots and derived Action Pool in the compact column and one interactive BMG circle in the primary column. The consumer owns character state, recovery and controls; its sheet toolbar sits outside the row.

| File | Responsibility |
| --- | --- |
| [char-sheet-row.css](../../../packages/design-system/src/styles/char-sheet-row.css) | Shared two-column/stacked layout primitive. |
| [base.css](../../../packages/design-system/src/styles/base.css) | Include the primitive with the shared foundation. |
| [char-sheet-row-layout-1.astro](../../../apps/design-system/src/pages/char-sheet-row-layout-1.astro) | Living reference, composition examples and usage. |
| [BaseLayout.astro](../../../apps/design-system/src/layouts/BaseLayout.astro) | Reference navigation entry. |
| [char-sheet-row.test.ts](../../../apps/design-system/e2e/char-sheet-row.test.ts) | Layout proportions, atomic pairing, host-size adaptation and static rendering checks. |

### Constraints

The implementation uses the existing HTML/CSS layout layer and existing spacing/content tokens. The example is a design-system specimen; the Playground sheet and canonical character data are separate consumers. The layout works without hydration or a JavaScript layout controller. Its first release introduces Layout 1 only.

## Contract

### Definition of Done

- [x] Shared row CSS is available from the design-system foundation and demonstrated in the living reference.
- [x] At a sufficient host width, compact and primary columns top-align at 42.5ch and 67ch with one space-4 gap.
- [x] At insufficient width, each pair stacks in source order without interleaving with another row or hiding content.
- [x] The same wide viewport can contain a side-by-side row and an independently stacked narrow row.
- [x] The 320px example has readable content and no page-level horizontal overflow; JavaScript-disabled and print rendering preserve the same content order.
- [x] Browser tests verify geometry, host adaptation and rendering behavior; `pnpm typecheck` passes.
- [x] `pnpm build`, `pnpm lint`, and `pnpm test` pass.

### Regression Guardrails

- The existing prose grid's tracks, reading measure and placement behavior must not change.
- Row layout must not reorder or duplicate child content between responsive states.
- A row must never depend on viewport width or a global navigation width to decide its layout.
- The design-system package must not import app-owned character state or presets.

### Scenarios

```gherkin
Scenario: Use the prose proportions in reverse
  Given a row has room for both prose measures and their gap
  Then its compact child is on the left and its primary child is on the right
  And the primary child has the 67ch prose measure

Scenario: Resize one host
  Given two rows on a wide page
  When only one host becomes too narrow for the pair
  Then only that row stacks
  And its compact content precedes its primary content

Scenario: Render static content
  Given JavaScript is unavailable
  When the reference page loads or prints
  Then both parts of each row remain present in source order
```

### Implementation evidence (2026-10-23)

- Four layout browser checks cover reversed prose-track geometry, independent host resizing at the fit boundary, complete pair ordering at 320px, and static/print content without hydration.
- Build, lint, typecheck and all 120 unit tests pass. All 95 browser checks pass across the main app and design-system reference.
- Native wrapping derives the fit boundary from the existing tokens, avoiding a second font-sensitive threshold calculation.
