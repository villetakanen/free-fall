# Feature: BMG Circle

**Status:** Implemented and verified locally, 2026-10-26. Initial implementation:
[#78](https://github.com/villetakanen/free-fall/issues/78); current controls:
[#92](https://github.com/villetakanen/free-fall/issues/92); arrow treatment:
[#93](https://github.com/villetakanen/free-fall/issues/93).

## Blueprint

### Context

Parent spec: [Design System](../spec.md).

The first character-sheet component presents Body, Mind, and Ghost together,
with Current and Base values and the resource-conversion relationships between
them. It serves populated static sheets, printable sheets, and interactive
Svelte character sheets through one presentation contract.

The supplied R14 sheet informs the triangular arrangement and diagonal value
split. The product's [design language](../../../DESIGN.md) supplies typography,
palette, spacing, and interaction treatment.

Composition contract:

- The value initially described as “Max” means **Base**, not a ceiling.
- Current may exceed Base. Changing Base does not change Current.
- The three conversions are Ghost → Mind, Ghost → Body, and Mind → Body.
  Each spends 2 Current and grants 1 Current. The other directions are absent.
- Interactive mode supplies one-point spending and the three conversions.
- The outer circle is split into three directed arc segments surrounding the
  three AttributeCircle instances, with one attached activation control per attribute.

The [core rules](../../../content/core-rulebook/chapters/03-core-rules.md)
describe Initial and Maximum Current after Binding. This DS primitive validates
independent Current/Base values and imposes neither a Base nor a Binding cap.
[Playground](../../free-fall/playground/spec.md) owns explicit Binding and its
Downtime recovery target; that target does not constrain BMG conversions.

### Architecture

#### Ownership and integration

The public component is `BmgCircle`, implemented in Svelte 5 inside
the existing [component directory](../../../packages/design-system/src/components/).
It composes three [AttributeCircle](../attribute-circle/spec.md) instances;
the group owns their arrangement and inter-attribute conversions, while each
primitive owns its Current/Base presentation and Current adjustment controls.
The group holds one authoritative snapshot for both kinds of action. Accepted
conversions supply updated Current props to both participating children;
received prop updates never generate additional child adjustment events.
Its state and conversion functions belong to the design-system package and
are usable without mounting a component. Source: `packages/design-system/src/components/BmgCircle.svelte` and
`packages/design-system/src/components/character-attributes.ts`.

This is distinct from [Stat Circle](../stat-circle/spec.md), which remains the
compact single-value attribute indicator used by gear. BMG introduces its own
two-value anatomy rather than changing the meaning of that existing component.

The [platform spec](../../platform/spec.md) owns Astro/Svelte integration.
The package is source-distributed, with client rendering opted into by its host.

| Surface | Behavior |
| --- | --- |
| Static Astro use | Build-time Svelte rendering produces complete values, labels, and conversion reminders as HTML/CSS, with no component client script. |
| Hydrated Astro use | A Svelte sheet/controller owns the state and hydrates the interactive view. Serialized initial values produce a readable pre-hydration snapshot. |
| CSR use | A Svelte parent or script-driven host supplies state and receives proposed changes. The same component renders the circle. |
| Print | The currently committed values render in monochrome with persistent labels and conversion directions. Editors, focus treatments, and live announcements are hidden. |

#### Data and scripting contract

The API uses plain serializable values:

```ts
type Attribute = "body" | "mind" | "ghost";
type AttributeValue = { current: number | null; base: number | null };
type BmgValues = Record<Attribute, AttributeValue>;
type Conversion = "ghost-to-mind" | "ghost-to-body" | "mind-to-body";
```

- Numbers are nonnegative safe integers. Base and Current are independent.
  Two digits are the normal visual range; larger valid values remain readable
  through responsive reflow rather than truncation or clamping.
- `null` means intentionally unfilled. A blank field remains available for
  handwriting on a printed sheet. Zero remains a visible numeric value.
- Props supply `value`, an accessible group label, an editing opt-in, and an
  optional print appearance override. The default is a read-only snapshot.
- An editable consumer provides a synchronous change callback. Each valid edit proposes
  a complete new `BmgValues` plus a `BmgChange` cause: an attribute adjustment
  (`type: "adjust"`, `attribute`, `delta`) or a conversion
  (`type: "convert"`, `conversion`). Base edits are external prop updates. The consumer accepts a proposal by supplying the next value.
- Incoming props remain authoritative. The component does not mutate supplied
  objects. Rejected proposals leave the committed snapshot unchanged. Current
  adjustment proposals from each child are mapped into the complete snapshot
  by the group; Base is supplied by the sheet.
- The callback accepts by updating the owned state during the same turn, or
  declines by leaving it unchanged. Persistence may run separately afterward;
  asynchronous acceptance and pending transactions are outside phase one.
- Editing Base changes only Base. Editing Current changes only Current.
  Neither operation derives the other value, imposes a recovery rule, or
  performs a conversion.
- Pure conversion helpers accept a snapshot and a named direction, returning
  either a complete new snapshot or a typed failure reason. UI controls and
  scripted consumers use the same operation.
- Every instance owns its state through its consumer. Persistence, networking,
  gear Binding, dice, Harm, and character creation remain sheet/application
  responsibilities.


#### Exported API and examples

- The [Attribute Circle](../attribute-circle/spec.md) spec owns its child API,
  face sizing, labels, activation placement, and feedback treatment.
- `BmgCircle.svelte`: `value`, `label?`, `interactive?`, `onchange?(next, cause)`,
  `appearance?`. Both components default to read-only and `appearance="screen"`.
- `character-attributes.ts`: `validateBmg`, `adjustCurrent`, `setAttributeValue`,
  `convertBmg`, the serializable types, and the three `CONVERSIONS` descriptors.
  `adjustCurrent` supports signed script operations; visible activation emits
  only `delta: -1`. Operations return `{ ok: true, value }` or `{ ok: false, reason, message }`.
  Failures include invalid input, unfilled Current, insufficient source, overflow,
  and unsupported direction. Invalid rendering props throw an explicit TypeError;
  callers validate untrusted snapshots before committing them.
- Demos: `/attribute-circle/`, `/bmg-circle/` (hydrated and client-only hosts),
  `/character-sheet-static/` (no island, populated and blank print specimens).
- Long values switch to readable stacked fields inside the circular face; the
  diagonal is retained for ordinary values. The BMG composition expands vertically
  for long values and narrow containers. Mind stays left of Body; long-value
  reflow staggers their heights to preserve control clearance. Print limits the
  long-value composition to 40 spacing units wide so the entire ring fits a page.
  No number is truncated or clamped.

#### Conversion transaction

For source `S` and destination `D`, one accepted conversion produces
`S.current - 2` and `D.current + 1` together. Every Base and the third Current
remain unchanged. Each successful conversion reduces total Current by one.

The operation succeeds when both participating Current values are filled,
the source has at least 2, and the resulting numbers remain safe integers.
Destination Base is not consulted, including when Base is null or below the
destination Current. Failure returns a reason and leaves all values unchanged.

Each activation represents one conversion against the latest supplied state.
The synchronous ownership contract ensures the next activation sees accepted
changes. Rapid input must not create lost updates or overspend a source.

#### Visual anatomy

The normal composition fills its host up to **35rem** (560px at a 16px root).
The child spec owns each face; this spec owns their arrangement and routes.

- Attribute names use the shared small mono typography in uppercase. Ghost's
  label area is above its face; Mind and Body reserve it below. Composition
  anchors use the circular faces, keeping their positions independent of the
  label area's side.
- Ghost is above; Mind is lower left; Body is lower right. Positions remain
  stable across screen, print, and input states.
- Each attribute has a circular two-value face divided diagonally. Current
  is the dominant numeral in the upper area; Base occupies the lower-right
  area. The AttributeCircle spec owns the anatomy and attached controls.
  Attribute names remain horizontal outside their faces.
- Attribute identities use the existing Body, Mind, and Ghost CSS tokens.
  Numerals and field labels use IBM Plex Mono; explanatory interaction copy
  uses Lato. Color is reinforced by names and stable positions.
- One outer ring is divided into three separated arrow segments sharing a
  center and radius at normal widths. The upper-left arc runs Ghost → Mind;
  the upper-right arc runs Ghost → Body; the lower arc runs Mind → Body.
  Each arc is one continuous line ending in a single straight inward barb,
  folded back at approximately 30° to the arc’s tangent, like the user’s
  open `<______` sketch.
  In the 560-unit drawing, each barb’s centerline is about 28 units long.
  The tip is the junction of the arc and barb; the barb has uniform line
  weight and an open end. This preserves the confirmed directional graph.
  The arrow body is 12 units wide in the drawing, about 10.5px in the inset
  ring at the default 560px composition. The highlight remains a separate
  non-scaling 1px outline.
- Each segment carries a native conversion button using the shared
  [action-button style](../button/spec.md) and square target. It contains the
  Material Symbols Sharp `sync_alt` icon. A fixed `::after` label reads `2:1`
  directly below it, using the shared small mono typography. The label does
  not enlarge or restyle the button. Unavailable-action explanations appear
  below the ratio label. Its accessible name
  identifies source, cost, destination, and gain. Hover or keyboard focus
  fills the matching arrow with a gradient from the source attribute's highlight
  token to the destination's (`--freefall-attr-ghost`, `--freefall-attr-mind`,
  `--freefall-attr-body`). Colors interpolate in LCH using the shorter hue path,
  progressing around the arc from its source end to its destination barb.
  The resting fill uses `--freefall-border-strong`. A separate 0.0625rem (1px)
  `--freefall-action-base` outline follows the complete silhouette and keeps its
  existing color. Hovering the painted arrow shape gives the same feedback.
  The outline follows both arc edges and the complete angular tip, with
  non-scaling stroke width. Fill and outline entry and exit both use 0.33s ease-in-out.
  Participating circles retain their own feedback timing and treatment.
  Reduced motion applies both treatments immediately; print omits both. The arrowhead
  and accessible name convey direction independently of that highlighting.
  Static and print output replace the buttons with text ratios and retain
  all three arrows.
- [DEPRECATED 2026-10-26] Keeping the arrow body dark during hover was replaced
  by a source-to-destination LCH fill gradient; the outline remains independent.
- [DEPRECATED 2026-10-23] Independent thin connector paths. The user requested
  one outer circle visibly divided into three arrows around the composed
  single-circle elements.
- Each AttributeCircle exposes its own activation button on its left rim.
  These adjust only that attribute's Current. Conversion controls remain
  separate and act directly on their named source and destination.
- At ordinary widths, the arrow ring is inset by 6.25% on each side, bringing
  its radius 12.5% closer to the center. Conversion buttons follow the ring.
  Arrows may nearly touch the circular faces, and child activation buttons
  may overlap them. The buttons paint above the arrows and remain operable.
  Conversion and activation targets stay separate; labels and values remain
  readable, including the slight numeral overlap allowed by the child contract.
  Narrow and long-value compositions retain the full ring footprint to
  accommodate their reflowed circles and controls.
- [DEPRECATED 2026-10-26] Reserving clearance around the entire child footprint
  made the ring too distant. Activation buttons may overlap decorative arrows.
- Every accepted spend immediately recomputes conversion availability
  against the same updated snapshot. A conversion emits one group proposal,
  updates both child displays together, and recomputes their adjustment and
  conversion availability. No action depends on a separate selected circle.
- [DEPRECATED 2026-10-23] Selecting a circle to open a shared Current/Base
  editor below the diagram. The user's single-circle sketch replaces this
  with directly attached controls; Base editing belongs to the sheet.
- Valid Current values above Base retain the ordinary visual treatment. The
  component expresses numeric values rather than a proportion of Base.
- A zero Current is still an ordinary, visible zero. A conversion becomes
  unavailable based on its source; its reason remains accessible, including
  without pointer hover.
- Screen geometry uses design-system spacing tokens. At a 320px viewport,
  values remain readable and interactive targets are at least 44px and
  do not overlap each other or cover values. Text enlargement and larger values trigger reflow when
  needed. At narrow widths the outer ring elongates vertically to preserve
  readable child circles and control targets; the three directional routes
  and Ghost-above/Mind-left/Body-right arrangement remain. The child faces
  remain circular. Circle geometry is the deliberate circular-radius exception.
- Print uses black text and the child contract’s 3px outlines/dividers on white, with no reliance
  on background printing, color, gradients, glow, or the web font download.
  The component is kept together across page breaks.

#### Accessibility and errors

The static representation exposes attribute names and the two fields as
structured text. The diagram's decorative paths do not duplicate that text
in the accessibility tree. Interactive controls use native button
semantics, visible focus, logical tab order, and attribute-specific labels.

An accepted conversion announces the source and destination values together
in one polite status update. Focus stays on the activated control, including
when it becomes unavailable. An aria-disabled control checks availability
before executing and exposes its reason through an associated description.
Readonly/static instances render text reminders rather than disabled buttons.

Invalid programmatic data produces
a typed validation failure at the consumer boundary rather than a misleading
zero, clamped value, or partially rendered valid-looking state.

[DEPRECATED 2026-10-23] The shared numeric editor's draft validation and
explicit clearing behavior. Numeric entry belongs to consuming sheets;
the attached controls issue only single-step Current adjustments.

[DEPRECATED 2026-10-26] Tangential arrowheads and full-fill accent highlighting
were replaced by single inward barbs, source-to-target LCH fill, and a separate
thin silhouette highlight. Outer arrows use 0.33s ease-in-out in both directions.

[DEPRECATED 2026-10-26] A separate triangular head on an inward shaft was
replaced by the user’s single continuous line with one straight inward barb.

### Constraints

- One Svelte presentation is reused for static rendering and client use;
  printing is a presentation of that same committed data.
- Client interaction is opt-in. Without JavaScript, the initial snapshot and
  conversion relationships remain readable; interactive controls become
  available only when their handlers are ready.
- The editable Astro integration owns callbacks inside its Svelte island;
  callback functions are not passed through Astro's serialized island props.
- The design-system [demo app](../../../apps/design-system/src/) documents
  populated static, blank print, populated print, and interactive examples,
  including zero, Current above Base, invalid programmatic data, and multiple instances.
- Verification asserts numeric behavior, atomicity, accessibility, rendering
  modes, and data contracts. It does not assert prose or exact UI wording.

## Contract

### Definition of Done

- [x] The three attributes expose independent Current and Base values using
  the specified positions and two-field anatomy.
- [x] The surrounding ring has three single inward barbs, source-to-destination
  LCH fill gradients, and separate thin outlines. Entry and exit use 0.33s
  ease-in-out; child timing stays independent.
- [x] The surrounding ring has three directed segments and one associated
  shared `sync_alt` button with a fixed `2:1` caption each. Conversion targets
  stay separate from activation targets; decorative arcs may pass behind them.
- [x] Supplied state renders correctly at build time and in a client-rendered
  or hydrated Svelte host.
- [x] Each allowed conversion commits both Current changes atomically through
  the same pure operation used by scripts; reverse directions are rejected.
- [x] Conversion and Current adjustment allow Current above Base. A Base change
  leaves all Current values unchanged.
- [x] Insufficient source, unfilled participating Current, unsafe arithmetic,
  and invalid programmatic input preserve the previous committed snapshot.
- [x] Controlled updates, rejection, rapid repeated input, and multiple
  instances preserve ownership and avoid stale transactions.
- [x] Child spending actions update conversion availability immediately;
  conversion prop updates produce no duplicate child change events.
- [x] Zero and blank values remain distinct on screen, in accessible text,
  and in print. Unfilled Base alone does not disable a valid conversion.
- [x] Keyboard and touch users can adjust each attribute's Current, perform
  a conversion, and discover why a conversion is unavailable.
- [x] Static output remains complete with JavaScript disabled and ships no
  component client runtime; hydration preserves the initial snapshot.
- [x] Printed output preserves the latest accepted values and conversion
  reminders with background printing disabled, in monochrome.
- [x] The demo documents all modes and verifies layout at 320px, text zoom,
  larger values, font fallback, and multiple component instances.
- [x] `pnpm typecheck` and relevant built-site Playwright checks pass.
- [x] `pnpm build`, `pnpm lint`, and `pnpm test` pass.


### Verification references

- [Pure operation tests](../../../packages/design-system/src/components/character-attributes.test.ts)
  cover immutable updates, independent Base, permitted routes, unfilled values,
  and safe arithmetic.
- [Circle browser checks](../../../apps/design-system/e2e/character-circles.spec.ts)
  cover spending/conversion ownership, repeated input, keyboard/touch,
  independent instances, shared button styling, static/hydrated/CSR modes,
  320–1100px layouts, enlarged text, font fallback, and monochrome print.
- [Demo print styles](../../../apps/design-system/src/styles/character-sheet-print.css)
  adapt the scrolling docs shell for print; consuming sheets own their page flow.
- Manual inspection confirms the inset ring, 30° inward barbs, three correctly
  directed LCH gradients, unchanged 1px outline, and fixed ratio captions.
- [DEPRECATED 2026-10-26] Earlier eight-check summaries described paired +/−
  controls. The current browser suite covers six controls and the shared button
  contract; the child spec owns the consolidated visual acceptance criteria.

### Regression Guardrails

- Base must never act as a ceiling, progress-meter denominator, or conversion
  eligibility condition.
- A conversion must never change Base or only one participating Current.
- Programmatic updates to child Current props must never emit adjustment
  events or recursively trigger a second group update.
- Component operations must never mutate the caller's snapshot in place.
- Readonly and printed sheets must never depend on client initialization to
  expose their values or relationships.
- Existing StatCircle usage must retain its single-value behavior.

### Scenarios

```gherkin
Scenario: Conversion feedback follows its direction
  Given an interactive BMG circle with dark resting arrows
  When a user hovers an arrow or hovers or focuses its conversion button
  Then that arrow fades to an LCH gradient from its source highlight to its target highlight
  And its separate 1px outline keeps the shared action color
  And both transitions use 0.33s ease-in-out on entry and exit
  And the participating circles retain their own feedback timing
  When reduced motion is requested
  Then arrow feedback changes immediately

Scenario: Convert beyond Base
  Given Ghost Current is 4 and Body Current and Base are both 12
  When Ghost-to-Body is accepted
  Then Ghost Current is 2 and Body Current is 13
  And every Base and Mind Current is unchanged

Scenario: Local adjustment updates both outgoing arrows
  Given Ghost Current is 2
  When Ghost's activation is accepted
  Then Ghost Current is 1
  And Ghost-to-Mind and Ghost-to-Body are unavailable
  When the host supplies Ghost Current 2
  Then both routes become available without an additional child proposal

Scenario: Conversion updates the composed controls once
  Given Ghost Current is 2 and Body Current is 8
  When Ghost-to-Body is accepted
  Then the Ghost child displays 0 and the Body child displays 9 together
  And Ghost's activation control and both outgoing conversions are unavailable
  And neither child's received props emit an additional adjustment proposal

Scenario: Narrow composition
  Given the group is displayed at a 320px viewport
  When all six interactive controls are visible
  Then their effective targets are at least 44px and do not overlap
  And values remain readable, control targets stay clear, and arrowheads remain visible
  And the vertically elongated outer ring preserves all three directions

Scenario: Use the last source pair
  Given Mind Current is 2 and Body Current is 9
  When Mind-to-Body is accepted
  Then Mind Current is 0 and Body Current is 10
  And another Mind-to-Body conversion is unavailable

Scenario: Insufficient source
  Given Ghost Current is 1
  When a script requests Ghost-to-Mind
  Then the result identifies insufficient source
  And the supplied snapshot is unchanged

Scenario: Unsupported direction
  Given Body Current is 12
  When a script requests Body-to-Ghost
  Then the operation rejects the direction and preserves the snapshot

Scenario: Base is independent
  Given Body Current is 13 and Base is 12
  When the consumer changes Body Base to 6
  Then Body Current remains 13

Scenario: Blank is distinct from zero
  Given Mind Current is 0 and Ghost Current is null
  When the static sheet is printed
  Then Mind retains its numeric zero and Ghost has a writable empty field
  And both retain their attribute and field labels

Scenario: Blank Base is not a conversion limit
  Given Ghost Current is 2 and Mind Current is 3 and Mind Base is null
  When Ghost-to-Mind is accepted
  Then Ghost Current is 0 and Mind Current is 4 and Mind Base remains null

Scenario: Invalid programmatic value
  Given Body Current is 9
  When a consumer supplies a negative or fractional Current value
  Then validation reports the invalid value
  And the committed Body Current remains 9

Scenario: Consumer rejects a proposal
  Given an editable snapshot and a consumer that declines an edit
  When the user requests that edit
  Then the committed display retains the supplied snapshot
  And the user can make a subsequent proposal after rejection resolves

Scenario: Two rapid conversions
  Given Ghost Current is 3
  When two conversion activations occur in quick succession
  Then the second evaluates the state accepted after the first
  And only one conversion succeeds
  And accepted state never becomes negative

Scenario: Static rendering
  Given an unhydrated BMG instance
  When JavaScript is unavailable
  Then all supplied values and three conversion directions remain readable
  And no nonfunctional editing controls are exposed

Scenario: Print accepted interactive state
  Given a conversion has been accepted by the interactive host
  When the browser prints with backgrounds disabled
  Then the printout contains the updated Current and unchanged Base values
  And all field labels and three conversion reminders remain legible
  And editing controls and selection decoration are absent

Scenario: Independent instances
  Given two BMG instances with different supplied snapshots
  When the first accepts a conversion
  Then the second snapshot and its accessible control associations are unchanged
```
