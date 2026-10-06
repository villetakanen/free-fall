# Feature: Core Rules Tactical HUD (Action Resolution Pane)

## Blueprint

### Context

Core Rules pages (`/core-rulebook/[id]`) serve both reader immersion and active tabletop reference. During play and scenario prep, the Game Master repeatedly checks core mechanical adjudication:
1. "What is the Target Number (TN) for this difficulty?"
2. "How many successes did they roll, and what does that achieve?"
3. "How do critical hits, complications, and modifiers modify this action?"
4. "What are the steps, pool limits, and prerequisites to attempt this action?"

Rather than requiring the GM to navigate away from their current chapter or scroll through long editorial prose, Core Rules routes mount a single static reference pane—**Action Resolution**—in the existing 320px Tactical HUD dock.

Parent spec: `specs/design-system/tactical-hud/spec.md` (shared multi-pane inspector dock and host-adaptive layout)
Related spec: `specs/free-fall/app-layout/spec.md` (BaseLayout and AppShell HUD slot integration)
Rules authority: `content/core-rulebook/chapters/03-core-rules.md` (Action Resolution, Critical Hits, Complications, Action Pool, Prerequisites)

### Architecture

**Route Integration**:
- `apps/free-fall/src/pages/core-rulebook/[id].astro` composes `TacticalHud` into the `hud` slot of `BaseLayout`.
- The HUD is configured with exactly one pane definition:
  ```ts
  const CORE_RULES_PANES: HudPaneDefinition[] = [
    {
      id: "rules",
      title: "ACTION RESOLUTION",
      icon: "menu_book",
    },
  ];
  ```
- The reference content is provided via slot `slot="pane-rules"` using the app-owned component `ActionResolutionPane.astro`.

**Component Responsibility**:
| File | Responsibility |
|---|---|
| `apps/free-fall/src/components/ActionResolutionPane.astro` | App-owned static reference component containing the 4-part Action Resolution hierarchy and deep links |
| `apps/free-fall/src/pages/core-rulebook/[id].astro` | Composes `TacticalHud` with `CORE_RULES_PANES` into `BaseLayout`'s `hud` slot |
| `packages/design-system/src/components/TacticalHud.astro` | Shared dock shell providing rail button, pane header, close button, container-query responsiveness, and keyboard shortcuts |

**Agreed Content & Visual Hierarchy**:
The pane layout prioritizes immediate tabletop glanceability over textbook prose. All reference data fits in a single screen without vertical scrolling:

[REFINED 2026-10-06] The pane is composed as a single unified avionics telemetry panel divided by hairline dividers, matching the high-contrast tabular HUD cockpit layout:

1. **Difficulty (`DIFFICULTY`)**:
   - Table displaying Base Difficulty vs Target Number:
     - Normal: `— Auto —`
     - Challenging: `TN 11+`
     - Hard: `TN 16+`
     - Near impossible: `TN 21+`
   - Compact outcome ladder caption: `0: Fail/Comp · 1: Success · 2+: Greater`
   - Direct link to full section: `/core-rulebook/03-core-rules/#4-rolling--determining-success`
2. **Exceptions (`EXCEPTIONS`)**:
   - Tabular key-value grid:
     - `NAT 20`: `≥1 Success · 2× DV in optimal range (standard DV outside optimal)`
     - `NAT 1`: `Conflict complication on any 1`
     - `MODS`: `Bonus: +n to dice · Penalty: +5 TN`
   - Deep links to `/core-rulebook/03-core-rules/#critical-hits-natural-20-on-attack`, `#complications-natural-1`, and `#4-rolling--determining-success`.
3. **Action & Pool (`ACTION & POOL`)**:
   - Tabular key-value grid:
     - `POOL`: `5d20 base (−1d20 per Harm, min 2d20)`
     - `PREREQS`: `Skill · Gear · 1 Stat · 1 Harm`
     - `FLOW`: `Declare → Prereq → Roll → Resolve`
   - Deep links to `/core-rulebook/03-core-rules/#1-the-action-pool`, `#3-prerequisites-for-specialized-actions`, and `#action-resolution-making-your-move`.

**Visual & Interaction Constraints**:
- **Design System Conformance**: Lato for explanations and descriptive text; IBM Plex Mono for TNs, dice formulas, step numbers, and headers. Surfaces stepped (`--freefall-bg-surface-1`, `--freefall-bg-surface-2`). Acid yellow (`--freefall-color-accent-400`) restrained for TN accents, successes, and key highlights.
- **KISS & Static Delivery**: No interactive dice rollers, harm slot trackers, dice assignment inputs, or accordion expanders. All reference content is immediately visible without scrolling.
- **Pane Width & Height**: Pane inline size is fixed at 320px (`calc(40 * var(--freefall-space-1))`). Entire content fits within ~400–450px vertical height to ensure complete zero-scroll glanceability on standard laptop displays.
- **Host Adaptation**: Inherited from `TacticalHud.astro` container queries on `hud-host` (in-flow above 75rem, host overlay between 32rem and 75rem, suppressed at or below 32rem).
- **Keyboard Navigation**: Rail toggle and header close buttons are accessible by keyboard; hotkey `1` toggles the pane and `Escape` closes it.

### Constraints

- The Core Rules HUD exposes exactly one pane titled `ACTION RESOLUTION`. Interactive tools (Dice Sim, Harm Tracker) belong to the SRD and are not mounted on Core Rules routes.
- Links to Core Rules sections use absolute path targets with anchor hashes (`/core-rulebook/03-core-rules/#...`) so they resolve reliably from any `/core-rulebook/*` page.
- Reference content preserves Core Rules mechanical qualifiers (e.g. natural 20 attack range dependency for DV doubling, natural 1 in conflict, minimum pool floor of 2d20).

## Contract

### Definition of Done

- [ ] All Core Rules pages (`/core-rulebook/[id]`) mount a Tactical HUD dock with exactly one rail button and pane titled `ACTION RESOLUTION`.
- [ ] The pane presents the agreed glanceable 3-part hierarchy: Difficulty (with inline outcome ladder), Exceptions, and Action & Pool.
- [ ] All reference content is immediately visible without scrolling on standard viewports (height $\ge 600\text{px}$); no interactive rolling, harm tracking, or dice input controls are rendered.
- [ ] Core Rules qualifiers are preserved: natural 20 DV doubling requires optimal range; natural 1 applies to conflict; pool floor is 2d20; specialized actions require 1 of 4 prerequisites.
- [ ] Deep links target valid heading IDs in `/core-rulebook/03-core-rules/`.
- [ ] The pane fits 320px width without horizontal scroll.
- [ ] Keyboard controls (Hotkey `1`, `Escape`, Enter/Space on buttons) toggle and dismiss the pane.
- [ ] Host-scoped container query behavior (overlay on constrained host, dock suppression at <=32rem) functions identically to the SRD HUD.
- [ ] The SRD retains its 3-pane HUD; non-rulebook pages (e.g. Home, Gear, Scenarios) do not render a HUD.
- [ ] `pnpm build`, `pnpm lint`, `pnpm test`, and `pnpm test:e2e` pass.

### Regression Guardrails

- `BaseLayout.astro` must continue to support custom slotted HUDs when `hasHud` is false.
- The SRD (`/srd/`) must retain its three default panes (`RULES GLOSSARY`, `DICE SIM`, `HARM`).
- Non-rules pages (`/`, `/gear/*`, `/scenarios/*`) must never render a Tactical HUD.
- The Action Resolution pane must never include client-side interactive state, dice sandboxes, or form inputs.

### Scenarios

```gherkin
Scenario: Core Rules route mounts Action Resolution HUD
  Given a user navigates to any Core Rules chapter (e.g. "/core-rulebook/03-core-rules/" or "/core-rulebook/00-intro/")
  When the page loads on a desktop host
  Then the Tactical HUD rail is visible on the right edge
  And the rail contains exactly 1 button with title "ACTION RESOLUTION (Hot-key: 1)"

Scenario: Opening the Action Resolution pane displays glanceable layout without scroll
  Given the user is on a Core Rules page with the HUD rail visible
  When the user clicks the "ACTION RESOLUTION" rail button or presses "1"
  Then the "ACTION RESOLUTION" pane opens at 320px width
  And all reference content fits in view without vertical scrolling
  And Difficulty shows Base Difficulties, Target Numbers, and inline outcome ladder
  And Exceptions lists Nat 20 optimal-range DV doubling, Nat 1 conflict complication, and modifiers
  And Action & Pool lists Pool limits, prerequisites, and flow

Scenario: Deep links resolve to full Core Rules sections
  Given the Action Resolution pane is open
  When the user clicks the section link for Difficulty, Outcomes, or Exceptions
  Then the browser navigates to the corresponding anchor in "/core-rulebook/03-core-rules/"

Scenario: Keyboard accessibility
  Given the user is on a Core Rules page
  When the user presses key "1"
  Then the Action Resolution pane opens
  When the user presses "Escape"
  Then the pane closes

Scenario: Host-scoped suppression on narrow hosts
  Given the HUD host is constrained to <= 32rem width
  When the page renders
  Then the Tactical HUD dock is suppressed from the display
```
