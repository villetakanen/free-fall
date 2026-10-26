# Feature: Character Sheet Playground

**Status:** Current behavior implemented and verified locally, 2026-10-26.
Initial Playground: [#79](https://github.com/villetakanen/free-fall/issues/79);
Settings: [#81](https://github.com/villetakanen/free-fall/issues/81);
activation and Downtime: [#92](https://github.com/villetakanen/free-fall/issues/92).

## Blueprint

### Context

Parent: [App Layout](../app-layout/spec.md). Dependencies: [BMG Circle](../../design-system/bmg-circle/spec.md) and [platform](../../platform/spec.md).

Playground is a top-level section at `/playground/` on the main FREE//FALL site, marked **Experimental** in navigation, the page heading and title. It provides one editable character sheet, started empty or from a Northern Lights player character. Phase one contains only name, callsign, and Body/Mind/Ghost Current, Base, and Binding. The complete sheet travels in its URL; editing runs entirely in the browser.

### Architecture

#### Surface and ownership

- Use the existing `BaseLayout` and add Playground to the root navigation before System Reference. Follow [DESIGN.md](../../../DESIGN.md) and existing design-system controls.
- A client-only Svelte island owns the sheet and renders the existing `BmgCircle`. The static shell supplies a JavaScript-required explanation when scripting is unavailable.
- Provide an Empty option and five named Northern Lights presets, applied through an explicit Load action. Loading replaces the complete sheet. Opening a valid sheet URL restores that snapshot without applying a preset over it.
- Provide labeled name/callsign fields and direct numeric entry for Current, Base, and Binding for all three attributes. Clearing a numeric field commits `null`; zero remains zero. Invalid numeric drafts show an associated error and preserve the last committed state and URL.
- Reuse BMG's attached activation buttons, three conversion arrows, validation, and pure helpers. The controller accepts each valid proposal synchronously and updates the URL from that same snapshot.

#### Settings HUD

- The main play surface shows the committed name/callsign, BMG circle, Downtime, Settings trigger and Copy Link. Preset selection/loading, identity editing and all nine direct numeric inputs live together in a **Settings** pane in the existing Tactical HUD.
- Settings starts closed. Opening, closing or resizing the pane preserves committed values, pending input drafts and the URL. The pane's visibility is page-local UI state, excluded from the sheet URL.
- Reuse TacticalHud's `custom` pane slot with the `settings` icon. The existing Svelte controller owns one form and places that form into the HUD slot; no second sheet store or duplicate inputs are created.
- At the HUD's suppressed host width (32rem or less), the same Settings trigger opens a collapsible form within the page. Switching between the two placements preserves the form and its values. Settings remains usable at 320px.
- Settings opens with focus in the form, closes using the HUD close button or Escape, and returns focus to a visible Settings trigger. Typing numbers in the form never invokes HUD number shortcuts. Copy Link, recovery from invalid URLs and play controls remain available outside Settings.
- [DEPRECATED 2026-10-23] Always-visible preset/identity controls and the adjacent Attributes editor. The user moved sheet initialization tools into Settings to keep the main sheet focused on play.

| File | Responsibility |
| --- | --- |
| [playground/index.astro](../../../apps/free-fall/src/pages/playground/index.astro) | Route, layout, Settings HUD slot, client-only island and fallback. |
| [CharacterPlayground.svelte](../../../apps/free-fall/src/components/CharacterPlayground.svelte) | Preset selection, field editing, responsive Settings form, BMG ownership, Downtime, and link copying. |
| [playground.ts](../../../apps/free-fall/src/lib/playground.ts) | Typed presets, sheet validation, pure Downtime recovery, and URL encoding/decoding. |
| [BaseLayout.astro](../../../apps/free-fall/src/layouts/BaseLayout.astro) | Existing shared navigation. |
| [character-attributes.ts](../../../packages/design-system/src/components/character-attributes.ts) | Existing `BmgValues`, numeric validation and BMG operations. |

#### State and URL

```ts
type PlaygroundSheet = {
  version: 2;
  name: string;
  callsign: string;
  bmg: BmgValues;
  binding: Record<Attribute, number | null>;
};
```

- An empty sheet has empty identity strings, `null` for Current/Base, and zero Binding. Each number accepts a nonnegative safe integer or `null`. Base represents Initial capacity, independently of Current; Current may exceed Base.
- Numeric entry accepts decimal digits, with surrounding whitespace ignored; an empty or whitespace-only draft clears the value. Fractions, signs, exponent notation and unsafe integers remain invalid drafts. BMG actions refresh only the Current fields they change, preserving unrelated drafts.
- Store the complete snapshot as percent-encoded JSON in `#sheet=<payload>`. Preserve Unicode, punctuation, blanks and zero exactly. A preset identifier alone is insufficient to restore a sheet.
- No fragment means an empty sheet. Read and validate the complete payload on entry and on browser history/fragment navigation. Accept supported, valid snapshots atomically; treat strings as plain text.
- Every committed edit, Load, or Downtime action updates the fragment with `history.replaceState`, avoiding a history entry per keystroke. Copy Link copies the current complete URL, with a selectable link fallback if clipboard access fails.
- A failed URL write reports an error and preserves committed state. Clipboard completion applies only to the URL requested; edits keep any visible fallback link current.
- Malformed, unsupported-version or invalid snapshots show a recoverable error, preserve the supplied URL and last valid sheet, and offer an explicit reset to Empty. On first load, the last valid sheet is empty. A URL error suspends editing until a valid URL is supplied or the player resets to Empty.

#### Downtime

- The [core rules](../../../content/core-rulebook/chapters/03-core-rules.md) use
  Downtime for recovery; no separate Short Rest mechanic is defined. One play-surface action sets
  every Current to Base minus Binding atomically, preserving identity, Base,
  and Binding. This replaces manual increments as the recovery action. The
  Playground action currently covers attribute pools; Harm and gear repair
  remain outside its scope.
- Settings exposes Binding as a nonnegative safe integer or unknown (`null`).
  Binding cannot exceed a known Base; invalid edits preserve the committed URL.
  Base and Binding edits do not change Current. Spending and conversion still
  allow above-Base values under the established BMG contract.
- Downtime requires all three Base and Binding values to be known and valid.
  Otherwise it is unavailable with an associated explanation. Empty Current
  can be populated by recovery when its Base and Binding are known.
- Presets initialize Binding as Base minus the equipped Current snapshot.
  Subsequent spending, conversion, and direct Current edits never change it.
- Version-1 URLs migrate in memory with unknown Binding for all three stats;
  they remain readable/editable. The app never infers Binding from spent Current,
  callsigns, or current presets. The next committed edit writes version 2.
- Version-2 URLs carry Binding in full. Downtime is idempotent and survives URL
  copy, reload, and history navigation without storage or network requests.
- Shared [action-button styling](../../design-system/button/spec.md) supplies
  all Playground action buttons. The malformed-link reset to Empty remains a
  separate recovery action for invalid data.
- [DEPRECATED 2026-10-26] The version-1 snapshot and paired +/− controls did not
  preserve a recovery target. Version 2 adds explicit Binding and Downtime.

#### Northern Lights presets

Bundle a small typed preset list with the app, sourced from the five sheets below. Initial Attributes populate Base; the agreed equipped pools populate Current. Each preset leaves name empty because the sources supply callsigns rather than separate personal names. Triples below are **Body / Mind / Ghost**.

| Callsign and source | Base | Current | Starting configuration |
| --- | --- | --- | --- |
| [Vector — Pilot](../../../content/scenarios/northern-lights/c-01-the-pilot.md) | 6 / 12 / 8 | 4 / 10 / 5 | Outside Tiger. |
| [Vantage — Operator](../../../content/scenarios/northern-lights/c-02-the-operator.md) | 12 / 6 / 8 | 7 / 6 / 1 | Heavy overwatch: Wraith and railgun. |
| [Root — Wirehead](../../../content/scenarios/northern-lights/c-03-the-wirehead.md) | 6 / 8 / 12 | 1 / 8 / 7 | Listed loadout, before additional software. |
| [Stitch — Fixer](../../../content/scenarios/northern-lights/c-04-the-fixer.md) | 8 / 12 / 6 | 8 / 11 / 3 | Havoc, Threat-Assessment inactive. |
| [Sable — Spectre](../../../content/scenarios/northern-lights/c-05-the-spectre.md) | 12 / 6 / 8 | 5 / 6 / 7 | Void Marine and assault rifle. |

Show the chosen starting configuration alongside each preset. These are starting snapshots; subsequent edits are independent of the preset. Initialize Binding from each pair’s Base minus Current. Maintain the preset values when their source sheets change, without changing already saved URLs.

### Constraints

- Character state lives only in component memory and the URL fragment. Phase one uses no character backend, accounts, cookies, local/session storage or IndexedDB; character values are excluded from network requests and telemetry.
- Scope is one sheet with identity and three Current/Base/Binding triples. Gear-derived Binding, loadout switching, Harm, skills and character-generation rules belong to later work. The broader [Crew Keeper](../../content-scenarios/crew-keeper/spec.md) is a separate feature.
- Reuse the current Astro/Svelte integration and design-system behavior. Presets are explicit data, rather than runtime parsing of Markdown prose. Numeric fields, Load and Copy Link remain keyboard accessible; field errors are associated with their inputs.

## Contract

### Definition of Done

- [x] `/playground/` is reachable from root navigation and starts empty or restores its valid URL snapshot.
- [x] Empty and all five presets load atomically with the specified values and editable identity fields.
- [x] Direct field edits, activation and all three conversions update one authoritative sheet and its URL; Base never caps Current.
- [x] Copying and reopening a URL restores Unicode identity text and all attribute values, including zero and `null`.
- [x] Invalid input or URL state is recoverable without overwriting the last valid snapshot; clipboard failure exposes a copyable link.
- [x] Tests verify state/URL round trips, invalid payloads, preset data and browser editing/reload behavior without asserting static prose. Keyboard use and the JavaScript-disabled fallback are checked.
- [x] Settings uses the HUD on supported host widths and an accessible collapsible form on narrow hosts; close/reopen and resizing preserve the single sheet and pending drafts.
- [x] Downtime restores all three unbound pools while preserving other sheet data, including after reload.
- [x] Legacy URLs preserve Current/Base and require explicit Binding before recovery.
- [x] `pnpm typecheck` and relevant application Playwright checks pass.
- [x] `pnpm build`, `pnpm lint`, and `pnpm test` pass.

### Regression Guardrails

- Base must never cap Current, and conversions must never alter Base or update only one participating Current.
- Blank values must never become zero through input handling or serialization.
- Restored URLs must never depend on the current preset catalog or silently replace invalid state.
- Character values must never be written to browser storage or sent to a service.
- Recovery must never infer Binding from spent Current, identity, or a later preset catalog.
- Spending and conversions must never change Binding or the saved recovery target.

### Scenarios

```gherkin
Scenario: Start empty and share edits
  Given /playground/ has no fragment
  When a player enters a name and callsign and sets Body Current to 0
  Then reopening the resulting URL restores both strings and that zero
  And the other five Current/Base values remain unfilled and Binding remains zero

Scenario: Use and modify a preset
  Given a player loads Vector
  When they convert Ghost to Mind
  Then Ghost Current becomes 3 and Mind Current becomes 11
  And Body Current remains 4 and all Base values remain unchanged
  And reopening the URL restores the edited snapshot

Scenario: Reject invalid state
  Given a valid committed sheet
  When an invalid numeric draft or malformed or unsupported URL is supplied
  Then an accessible error identifies the problem and the committed sheet is preserved
  And an invalid URL remains intact until the player explicitly resets it

Scenario: JavaScript unavailable
  Given scripting is disabled
  When /playground/ opens
  Then the site navigation and JavaScript-required explanation are readable
  And no nonfunctional character-editing controls are presented

Scenario: Put setup aside while playing
  Given a loaded sheet and an unfinished numeric draft in Settings
  When the player closes and reopens Settings or changes the available screen width
  Then the same form, draft and committed sheet remain available
  And visibility changes do not alter the URL

Scenario: Restore the equipped pools
  Given Vantage has Base 12/6/8 and Binding 5/0/7
  And spending or conversion has changed Current
  When Downtime is accepted, including after reopening the URL
  Then Current becomes 7/6/1 atomically
  And identity, Base, and Binding remain unchanged
  And repeating Downtime produces the same values

Scenario: Open a legacy sheet
  Given a version-1 link with already-spent Current
  When the link opens
  Then Current and Base are preserved and Binding is unknown
  And Downtime is unavailable with an associated explanation
  When the player supplies all missing Binding values
  Then a version-2 URL preserves those values and Downtime becomes available

Scenario: Reject excessive Binding
  Given a committed Base of 12
  When a Binding draft exceeds 12
  Then the draft has an associated error
  And committed Current, Base, Binding, and the URL remain unchanged

```


### Verification references

- [Unit checks](../../../apps/free-fall/src/lib/playground.test.ts) cover complete
  URL round trips, Unicode, blank/zero distinctions, invalid data, preset
  snapshots, immutable/idempotent recovery, full Binding, and legacy migration.
- [Browser checks](../../../apps/free-fall/e2e/playground.test.ts) cover loading,
  editing, spending/conversion, Downtime after reload, legacy links, invalid
  drafts/URLs, clipboard fallback, keyboard focus, Settings relocation, 320px
  layout, and the scripting-disabled fallback.
- [Circle checks](../../../apps/design-system/e2e/character-circles.spec.ts)
  own shared control styling, composition geometry, and print verification.
- Verified locally on 2026-10-26: build, lint, typecheck, app Svelte diagnostics,
  133 unit tests, 14 Playground browser checks, and nine circle browser checks.
- [DEPRECATED 2026-10-26] The earlier verification summaries covered version 1
  and six numeric inputs. The current contract includes nine numeric inputs,
  explicit Binding, and Downtime; the Experimental designation is retained.
