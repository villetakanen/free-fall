# Feature: Attribute Circle

**Status:** Implemented and verified locally, 2026-10-23. Tracked by [#77](https://github.com/villetakanen/free-fall/issues/77).

## Blueprint

### Context

Parent: [Design System](../spec.md). Consumer: [BMG Circle](../bmg-circle/spec.md).

`AttributeCircle` shows one attribute's independent Current and Base values.
Its interactive form has stacked +/− buttons attached to the left edge,
following the user's supplied single-circle sketch. The same anatomy serves
static and printed character sheets. This is the first implementation unit;
the three-attribute composition and conversions follow separately.

This two-value control is separate from the existing
[StatCircle](../stat-circle/spec.md), whose compact single-value contract remains.

### Architecture

#### Component and ownership

`AttributeCircle` is a Svelte 5 component in the existing
[component directory](../../../packages/design-system/src/components/), using
the [design language](../../../DESIGN.md) and existing attribute color tokens.
The [platform spec](../../platform/spec.md) supplies the island integration
model. Svelte 5 and the Astro integration provide static rendering and opt-in hydration.
`AttributeCircle.svelte` and the pure `character-attributes.ts` helpers live in
`packages/design-system/src/components/`.

Public inputs:

| Input | Contract |
| --- | --- |
| `type` | Body, Mind, or Ghost identity, selecting the existing attribute palette. |
| `label` | Accessible attribute name; defaults to the name for `type`. |
| `current` | Nonnegative safe integer, or null for an unfilled field. |
| `base` | Independent nonnegative safe integer, or null. It is a reference, not a ceiling. |
| `interactive` | False by default. True exposes the Current adjustment controls once handlers are ready. |
| `oncurrentchange` | Required for interactive use. Receives the proposed next Current and delta (+1 or −1). |
| `appearance` | `screen` (default) or `print`; monochrome is also automatic in print media. |
| `labelPosition` | `above` (default) or `below`, for composition. |
| `highlighted` | False by default; marks a participating conversion endpoint. |

The consumer owns values and synchronously accepts an adjustment by updating
Current, or declines by leaving it unchanged. The component emits one proposal
per activation and never mutates caller data. Programmatic prop changes update
the display without emitting adjustment proposals; Base changes preserve
Current. This lets a BMG conversion update two instances atomically without
recursively firing their +/− callbacks. Saving and network activity belong to
the consumer.

#### Anatomy

- A circular outline and diagonal divider rising from lower left to upper
  right establish the two fields, as in the supplied sketch.
- Current is the dominant upright numeral in the upper area. Base is a
  smaller upright numeral in the lower-right area. Each has an explicit label
  aligned with its side of the diagonal, kept clear of the numerals.
- The attribute name remains horizontal outside the face. Numerals and field
  labels use the data typeface, IBM Plex Mono.
- Two native buttons overlap the left rim: + above −. Each has a nonoverlapping
  target of at least 44px. Controls remain visible during interaction; selecting
  the circle or opening a separate editor is unnecessary.
- Controls modify Current only. Base editing and direct numeric entry, if
  needed by a sheet, are separate consumer-owned controls.
- The component reserves space for its buttons within its public footprint.
  Parent layouts do not need knowledge of its internal overflow or classes.
- The value pair retains the same positions when buttons are absent. Print
  uses dark text and thin rules on white, independently of background printing.
- Normal values include 0–36. Three-digit values use smaller type with clear
  space for the attached controls. Longer values use stacked fields inside the
  circle, with space reserved on the left for the controls, rather than truncation. At a 320px viewport the component,
  labels, and controls fit without horizontal overflow or overlapping content.
- Production dimensions derive from design tokens; circular radii are the
  existing circle exception. Attribute color identifies the statistic and is
  reinforced by its name. Controls have square or barely eased corners.

#### Interaction and value states

- + proposes Current + 1; − proposes Current − 1. Both leave Base unchanged.
- Current can pass Base in either direction. Base does not determine control
  availability or a progress proportion.
- At zero, − is unavailable and exposes the reason. At the largest safe
  integer, + is unavailable. A null Current leaves both controls unavailable
  until the consumer supplies a number. A null Base does not block adjustment.
- Native buttons support pointer, touch, Enter, and Space. Focus remains on
  the activated control when its availability changes. An aria-disabled control
  checks eligibility before proposing a change and has an accessible reason.
- Accepted changes announce the attribute and Current once through a polite
  status region. A declined proposal is not announced as an accepted change.
- Zero is visibly 0. Null is an empty writable field in print and has an
  accessible unfilled description. Invalid numeric input from a consumer is
  rejected explicitly rather than clamped or silently replaced with zero.

The public CSS property `--freefall-attribute-circle-width` sets the complete
footprint width; the default is 35 spacing units. Labels and control overhang
are included in that footprint.

### Constraints

- Static rendering exposes the name and both values as semantic text without
  client JavaScript. Static and print modes omit the adjustment controls.
- Client rendering or hydration uses the same Svelte component and data model.
  A Svelte host owns callback functions when integrating through Astro islands.
- The primitive owns one value pair and its Current controls. The BMG group
  owns conversion operations, relationships, and atomic multi-attribute updates.
- The [demo app](../../../apps/design-system/src/) shows all three identities,
  interactive and static instances, print, blank values, zero, and Current above
  Base. Verification checks behavior and structure rather than exact copy.

## Contract

### Definition of Done

- [x] Current, Base, attribute name, diagonal division, and stacked left-side
  +/− controls follow the specified anatomy.
- [x] One activation proposes exactly one ±1 Current change with unchanged
  Base; accepted props update the displayed value and declined changes do not.
- [x] Current can exceed Base, and changing Base does not change Current.
- [x] Zero, null, and numeric boundaries have distinct and accessible behavior.
- [x] Keyboard and touch controls retain focus, expose unavailability reasons,
  and announce accepted Current changes.
- [x] Static rendering is complete without JavaScript; static/print modes
  contain no active adjustment controls and preserve the value positions.
- [x] Print remains legible in monochrome with background printing disabled.
- [x] The demo passes narrow-layout, text-enlargement, multi-instance, and
  multiple-digit checks with nonoverlapping control targets.
- [x] `pnpm typecheck` and relevant built-site Playwright checks pass.
- [x] `pnpm build`, `pnpm lint`, and `pnpm test` pass.


### Implementation evidence (2026-10-23)

- Source: `packages/design-system/src/components/AttributeCircle.svelte`,
  `BmgCircle.svelte`, and `character-attributes.ts`.
- `character-attributes.test.ts` verifies immutable updates, independent Base,
  all permitted directions, rejected input, unfilled values and safe arithmetic.
- `apps/design-system/e2e/character-circles.spec.ts` exercises controlled
  acceptance/rejection, rapid input, keyboard/touch, CSR and hydrated instances,
  static HTML without JavaScript, 320–1100px layouts, 200% text size, font fallback,
  uncovered value text and nonoverlapping 44px targets. Print checks include a
  browser-generated PDF with backgrounds disabled and visual inspection.
- Repository build, lint, unit tests and typecheck pass. Both built-site browser
  suites pass (51 design-system and 28 application checks); the component's eight
  browser checks also pass after final visual refinements.
- Demo-only `character-sheet-print.css` resets the scrolling docs shell for
  paginated print. Sheet consumers likewise own their surrounding print flow.

### Regression Guardrails

- Base must never cap Current or change through the +/− controls.
- This primitive must never perform a conversion or change another attribute.
- A single activation must never emit multiple adjustments.
- Readonly/print output must never require JavaScript to expose supplied values.
- Existing StatCircle consumers must retain their current contract.

### Scenarios

```gherkin
Scenario: Increment past Base
  Given Current is 12 and Base is 12
  When + is activated and the consumer accepts
  Then Current is 13 and Base is 12

Scenario: Decrement to zero
  Given Current is 1 and Base is 12
  When − is activated and the consumer accepts
  Then Current is 0 and Base is 12
  And − retains focus and becomes unavailable
  And another activation emits no change

Scenario: External Base update
  Given Current is 8 and Base is 12
  When the consumer supplies Base 6
  Then Current remains 8 and both adjustment controls remain available

Scenario: Consumer declines
  Given Current is 8
  When + proposes 9 and the consumer retains 8
  Then the displayed Current remains 8
  And no accepted change to 9 is announced

Scenario: Unfilled Current
  Given Current is null and Base is 12
  When the component renders
  Then Current is unfilled and both controls are unavailable
  And a static print leaves room to write Current by hand

Scenario: Independent instances
  Given Body and Mind use separate AttributeCircle instances
  When Body accepts an increment
  Then Mind and both Base values remain unchanged

Scenario: Parent applies a conversion result
  Given Current is 8
  When the parent supplies Current 9 after a conversion
  Then the component displays 9 and recalculates its control availability
  And no Current adjustment proposal is emitted

Scenario: Print the latest value
  Given an interactive increment has been accepted
  When printing with backgrounds disabled
  Then the latest Current and unchanged Base are legible
  And the +/− controls are absent
```
