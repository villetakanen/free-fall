# Feature: Harm Slots

Implementation: [#99](https://github.com/villetakanen/free-fall/issues/99).
Parent: [Design System](../spec.md). Consumer: [Playground](../../free-fall/playground/spec.md).

## Blueprint

### Context

A compact three-slot Harm composition sits beside BMG in the character sheet.
The design-system `/harm-slot/` demo uses the existing character-sheet row:
Info above Harm in the supporting column, BMG in the primary column. Its initial
examples are empty, transient Physical, and permanent Compromise (3d20).

### Architecture

- `packages/design-system/src/components/HarmSlot.svelte` renders a controlled
  `value`, slot `index`, optional `interactive` (default false), and `onchange`.
- `packages/design-system/src/components/HarmSlots.svelte` composes exactly three
  slots, proposes an immutable replacement array, and derives Action Pool.
  `poolHref` optionally links the caption to rules. Interactive use requires a
  callback. The host accepts by replacing `value`, or declines by retaining it.
- `packages/design-system/src/components/character-harm.ts` owns the shared
  empty/transient/permanent slot union, supported physical/psychic/compromise
  types, empty-slot constructor, and occupancy-derived Action Pool function.
- The Playground retains its version-3 URL schema and validation boundary;
  Downtime, URL persistence, preset loading, and recovery belong to that host.

Three slots occupy one grid row with 0.5rem gaps. A full-width divider sits
0.5rem below the slots. Below it, with 0.5rem padding, Action Pool sits at the
left and the large count at the right, both top-aligned. The numeral uses the
highlight colour; the smaller d20 suffix uses normal high text colour. Each
filled slot costs one die, giving 5d20 through 2d20 regardless of permanence.

Slots have 0.5rem internal padding, a 6rem minimum height, and an 0.5rem solid
left edge. Standalone width is capped at 16rem; grouped slots share available
width. Description uses the editorial face at `--freefall-type-ui-small`.
Type labels use uppercase mono, including the Harm suffix.

| State | Marker | Top-right label | Surface and edge |
| --- | --- | --- | --- |
| Empty | Hollow square | Available, normal weight | Elevation 1, strong border |
| Transient | Filled square | Transient, bold | Elevation 1, strong border |
| Permanent | Filled square | Permanent, bold dark text on highlight background | Elevation 2, highlight edge |

Empty description is an en dash and its bottom label is Harm Slot. Filled
slots show their description and typed Harm label. The state labels are
absolutely positioned at top-right. Per-slot dice penalties are omitted.
Available and transient hover transitions bring the edge to highlight and the
background to elevation 2, using 0.22s ease-in-out on entry and exit. Reduced
motion switches immediately. Native buttons provide visible keyboard focus.

The entire interactive slot opens a centered native dialog with bounded height
and internal scrolling. A draft contains description and type; existing harm
also exposes permanence. Save trims and requires a nonblank description and
proposes one complete value. New harm starts transient. Cancel/Escape discard
the draft; Clear proposes the canonical empty value. Closing restores focus.
The dialog has compact padding and heading typography.

### Constraints

Static values render without JavaScript; interaction appears after hydration.
The surrounding sheet owns persistence and recovery eligibility. Printing
retains committed values in black on white with editing controls/dialogs hidden.
There are no new dependencies. Layout and colour use existing DS tokens.

[DEPRECATED 2026-10-26] Demo-local state, optional harm type, double permanent
edges, inverted monochrome permanent labels, and per-slot penalties were
replaced by the approved shared presentation and existing typed Playground schema.

## Contract

### Definition of Done

- [x] Demo is linked under Character Sheet navigation and shows all three states.
- [x] Shared components are used by both DS demo and Playground.
- [x] Save, Cancel, Escape, Clear, reopening and external updates preserve
  host ownership and draft separation.
- [x] Permanent and transient slots cost the same one die; count tracks occupancy.
- [x] Playground links/reload preserve harm; Downtime clears only transient slots.
- [x] Keyboard focus, centered dialog, narrow layouts and print remain usable.
- [x] `pnpm build`, `pnpm lint`, `pnpm test`, and `pnpm typecheck` pass.

### Regression Guardrails

- Draft edits must never mutate caller data or the saved URL before Save.
- Permanent harm must never cost more dice than transient harm.
- Changing host values must never emit change proposals.
- Static and print values must never depend on dialog initialization.

### Scenarios

```gherkin
Scenario: Cancel a draft
  Given a filled slot
  When its description is edited and Escape is pressed
  Then the committed slot and URL are unchanged and focus returns to its button

Scenario: Record and clear
  Given an empty slot
  When a nonblank description is saved
  Then the host receives transient harm and the accepted pool loses one die
  When Clear is accepted
  Then that slot becomes empty and the pool regains one die

Scenario: Recover shared sheet state
  Given a Playground URL containing transient and permanent harm
  When the page reloads and Downtime is taken
  Then only transient harm clears and the visible shared components update
```

### Verification (2026-10-26)

Release 0.14.1: build, lint, typecheck and all 148 unit tests pass. All 45
application and 57 design-system browser checks pass. Browser coverage includes
Save/Cancel/Escape/Clear, dialog centering, keyboard focus, narrowed layout,
printing, controlled updates through Downtime, and URL reload. Playground
composition was inspected visually beside BMG. The existing circle geometry
check failed once during an earlier concurrent run, then passed alone and in
the complete final design-system suite.
