# Feature: Attribute Circle

**Status:** Implemented and verified locally, 2026-10-26.
Initial implementation: [#77](https://github.com/villetakanen/free-fall/issues/77).
Visual refinements: [#91](https://github.com/villetakanen/free-fall/issues/91),
[#92](https://github.com/villetakanen/free-fall/issues/92).

## Blueprint

### Context

Parent: [Design System](../spec.md). Consumer: [BMG Circle](../bmg-circle/spec.md).

`AttributeCircle` presents independent Current and Base values with an optional
one-point activation control. The same component serves static, printed,
hydrated, and client-rendered sheets. It is distinct from the single-value
[StatCircle](../stat-circle/spec.md) used by gear.

### Architecture

#### Ownership and API

[AttributeCircle.svelte](../../../packages/design-system/src/components/AttributeCircle.svelte)
uses Svelte 5 and the [platform integration](../../platform/spec.md). The host
owns values; the component proposes changes without mutating caller data.

| Input | Contract |
| --- | --- |
| `type` | `body`, `mind`, or `ghost`; selects the existing attribute palette. |
| `label` | Attribute name; defaults to the name for `type`. |
| `current`, `base` | Independent nonnegative safe integers or `null` for unfilled. Base is a reference, not a ceiling. |
| `interactive` | False by default; activation appears after handlers are ready. |
| `oncurrentchange` | Required for interactive use; receives proposed Current and delta `-1`. The host accepts synchronously by replacing Current, or declines by retaining it. |
| `appearance` | `screen` by default; `print` forces monochrome. Print media does so automatically. |
| `labelPosition` | `above` by default, or `below`; reserves space on only that side. |
| `highlighted` | False by default; shows feedback for a participating conversion endpoint. |

Prop updates change the display without emitting proposals. Changing Base
preserves Current. Invalid props and a missing interactive callback fail
explicitly. The pure [character-attributes.ts](../../../packages/design-system/src/components/character-attributes.ts)
helpers remain usable by scripts, including signed adjustments; the visible
control only spends one point. Conversion, recovery, direct entry, and saving
belong to the group or sheet.

#### Size and typography

Defaults below assume a 16px root size. Dimensions derive from DS spacing;
face-relative numeral sizes respond to the face's inline-size CSS container.

| Part | Contract |
| --- | --- |
| Complete width | `--freefall-attribute-circle-width`, default **11.25rem** (180px), including left control overhang; constrained by available width. |
| Circular face | **9.875rem** (158px) at default width, close to a face in the 35rem BMG composition. |
| Label allocation | **1.75rem** (28px) above or below, with a **0.5rem** gap; no allocation on the opposite side. Default total height is **11.625rem** (186px). |
| Attribute name | `--freefall-font-mono`, forced uppercase, `--freefall-type-ui-small` (**0.875rem**). Shared DS typography, independent of circle width. |
| Value and field-label face | IBM Plex Mono; Current/Base labels follow the diagonal. |
| Current | Dominant upper numeral; ordinary one- and two-digit values use **40cqw**. |
| Base | Smaller lower-right numeral; ordinary values use **18cqw**. |
| Activation target | Shared `--freefall-button-height`: **2.75rem × 2.75rem**. |

Three-digit values use compact type; longer values use stacked fields inside
the face and omit the diagonal. Ordinary larger numerals may slightly overflow
or overlap surrounding artwork/labels: this is intentional. They stay unclipped
and readable, with usable, uncovered controls. At narrow widths, preserve the
control target and prevent horizontal page overflow rather than shrinking every
value to fit the artwork.

Values, attribute names, and Current/Base labels are non-selectable by pointer.
Their semantic text remains available to assistive technology and static/print
rendering. Zero remains visible; `null` has an unfilled description and space
for handwriting when printed.

#### Face and feedback

- The circular outline and diagonal divider use `--freefall-border-strong` at
  **0.1875rem** (3px), independent of face diameter.
- The divider rises from lower left to upper right and crosses about two-thirds
  down the face at its horizontal center. Current occupies the larger upper
  area. The Current label ends near the right rim, parallel to the divider;
  Base and its label occupy the lower area.
- The face uses `--freefall-bg-surface-1`, extending **0.1875rem** beyond the
  outline in every direction. This flat backing does not alter layout space;
  its default painted diameter is 164px.
- Hover, active press, keyboard-visible focus, and `highlighted` add a
  **0.0625rem** (1px) attribute-color highlight centered within both 3px rules.
  The strong rule remains visible on both sides. The background and its
  extension rise to `--freefall-bg-surface-2`.
- Entering feedback uses **0.12s ease-in**; leaving uses **0.4s ease-out** for
  highlight opacity and background. Keyboard-visible focus or `highlighted`
  retains feedback independently of pointer hover.
- Reduced motion applies changes immediately. Print uses black text and 3px
  rules on white, with no backing extension, highlight, controls, or animation;
  it remains readable with background printing disabled.

#### Activation

One native button sits on the lower-left rim. Its center is half a button plus
half a spacing unit below the face center: **1.625rem** (26px) at default scale.
The component reserves its left overhang in the public footprint, and removing
controls for static/print use preserves the value positions.

The button uses the Material Symbols Sharp `bolt` icon and an accessible name
that describes spending one Current of the named attribute. The
[Action Button](../button/spec.md) contract owns its size, colors, typography,
hover, focus, and disabled styling. The circle owns only placement; its
attribute-color feedback does not recolor the button.

Each pointer, touch, Enter, or Space activation proposes Current minus one and
preserves Base. Zero and unfilled Current disable spending with an associated
reason. Null Base and above-Base Current do not block a valid spend. An
`aria-disabled` button retains focus and guards its action. Accepted changes
announce the attribute and Current once; declined proposals do not announce a
successful change.

### Constraints

- One presentation serves static and interactive modes. Static output exposes
  the name and values without a client runtime; controls appear only when ready.
- Callback ownership stays inside the Svelte host when used as an Astro island.
- Attribute color identifies data; shared DS action styling identifies actions.
- Geometry changes preserve the BMG composition's face anchors and readable
  print output. The surrounding sheet owns page flow and printing layout.

### Superseded decisions

- [DEPRECATED 2026-10-26] The 17.5rem standalone width was replaced by 11.25rem
  to match a face in the full-size BMG composition.
- [DEPRECATED 2026-10-26] Paired +/− controls were replaced by one activation
  button at the former minus position. Recovery belongs to the sheet.
- [DEPRECATED 2026-10-26] Recoloring the whole rule and immediate feedback exit
  were replaced by the centered highlight and asymmetric entry/exit timings.
- [DEPRECATED 2026-10-26] Strict numeral-to-artwork clearance gave way to
  intentional slight overflow; control clearance and readability remain required.

## Contract

### Definition of Done

- [x] Default dimensions, one-sided label allocation, and shared uppercase mono
  name typography match the sizing contract.
- [x] Current remains visually dominant; approved slight numeral overlap is
  retained without clipping values or blocking controls.
- [x] Values and labels resist pointer selection while retaining semantic text.
- [x] Strong rules, elevated backing, centered highlight, timing, reduced
  motion, and monochrome print match the feedback contract.
- [x] One shared DS activation button occupies the specified lower-left position
  and proposes exactly one spend per accepted activation.
- [x] Base independence, zero/null behavior, rejection, external updates,
  keyboard focus, and accepted-change announcements preserve ownership.
- [x] Static, hydrated, CSR, and print modes retain the same values and anatomy.
- [x] Narrow layouts, large numbers, font fallback, and text enlargement preserve
  usable controls and readable data.
- [x] `pnpm typecheck` and relevant circle browser checks pass.
- [x] `pnpm build`, `pnpm lint`, and `pnpm test` pass.

### Regression Guardrails

- Base must never cap Current or change through activation.
- Prop updates must never produce additional spending proposals.
- The circle must never override shared action-button visual styling.
- Circle artwork must never clip ordinary numerals to enforce strict fit.
- Existing gear StatCircle consumers must retain their separate contract.

### Scenarios

```gherkin
Scenario: Spend above Base
  Given Current is 13 and Base is 12
  When activation is accepted
  Then Current is 12 and Base is 12

Scenario: Spend the final point
  Given Current is 1
  When activation is accepted
  Then Current is 0 and the button retains focus with an unavailable reason
  And further activation emits no proposal

Scenario: Decline or externally update
  Given Current is 8
  When the host declines a proposed spend
  Then Current remains 8 and no successful spend is announced
  When the host supplies Current 9 or a new Base
  Then the supplied values display without emitting a proposal

Scenario: Move the attribute name
  Given the label is above
  When labelPosition changes to below
  Then the reserved area moves to that side only
  And the face diameter, shared label typography, and values remain unchanged

Scenario: Unfilled static and printed values
  Given Current is null
  When the sheet renders without JavaScript or prints
  Then its attribute and field names remain readable with a writable empty field
  And no active editing controls appear

Scenario: Circle feedback remains separate from button styling
  Given an ordinary circle
  When its activation button receives pointer hover
  Then the circle gains its thin attribute-color highlight with 0.12s ease-in
  And the button retains the shared DS hover treatment
  When hover ends and no other feedback state remains
  Then the circle returns to its default surface with 0.4s ease-out
```

### Verification references

- [Pure operations](../../../packages/design-system/src/components/character-attributes.test.ts):
  immutable state, Base independence, unfilled/zero values, safe arithmetic.
- [Circle browser checks](../../../apps/design-system/e2e/character-circles.spec.ts):
  controlled updates, native input, shared button styles, 320–1100px layouts,
  200% text sizing, font fallback, static output, and monochrome print.
- Manual DS inspection on 2026-10-26 confirmed the 180 × 186px footprint,
  158px face, 44px target, 26px action offset, feedback timings, intentional
  numeral overlap, and non-selectable semantic text.
