# Feature: Universal Tactical HUD (Multi-Pane Inspector Dock)

## Blueprint

### Context

Tabletop RPG play requires constant, split-second mechanical adjudication: checking Target Numbers (TNs), evaluating Success counts (0 / 1 / 2+), applying Action Pool Harm penalties (5d20 down to 2d20), verifying prerequisite costs (spending Body, Mind, or Ghost points), and referencing the Bullet Time combat sequence.

On paper, GMs relied on the physical cardboard **GM Screen**. On the web, users have historically suffered through fragmented tab juggling or navigating away from their scenario and losing their place.

The **Tactical HUD** is a multi-pane inspector that attaches to a **host layout**, not intrinsically to the viewport. Its right-hand rail and $N$ pluggable panes are positioned and sized within the host that contains it. The AppShell workspace is one supported host; a bounded region in the Design System living docs is another. The host owns the available inline size; the HUD uses that size to select in-flow, overlay, or suppressed behavior.

The HUD adapts to the host's available inline size using CSS container queries. It does not use viewport breakpoints to decide its layout, and it is not fixed to the browser window. Hosts provide an inline-size query container and a containing block. The HUD's host-relative responsive behavior is CSS-defined; the host remains responsible for placing the HUD alongside its own content in ordinary layout.

**Small-host boundary**: When the host is too narrow to present the rail and panes usefully, the HUD is suppressed. This is based on host size, not a mobile-device or viewport assumption.

Parent spec: `specs/design-system/app-shell/spec.md` (supported host integration)

### Target Users

1. **The Live GM (Desktop / Laptop at the Table)**:
   - *Context*: Running a live session with a laptop/tablet at the table or via split-screen on Discord.
   - *Need*: Split-second answers (< 3 seconds) for TNs, prerequisites, or harm consequences without navigating away or losing their place in the adventure.
2. **The Prepping GM (Encounter & Mission Planning on 27" Monitors)**:
   - *Context*: Quiet desk prep on a wide display ($\ge 1800\text{px}$).
   - *Need*: Keeping multiple panes open side-by-side simultaneously (e.g. Combat Sequence + Dice Pool Roller) while reading scenario text.
3. **The First-Time Visitor (System Evaluator)**:
   - *Context*: Exploring FREE//FALL on desktop to evaluate the mechanics.
   - *Need*: A tactile, immediate demonstration of the core engine (dice pool, TNs, success ladder) without reading 20 pages of rules prose.

---

### Architecture

#### 1. Docked Multi-Pane Anatomy

```
+---------+------------------------------+-------+-------+---+
| Left    | Main Page Content            | Pane  | Pane  | R |
| AppTray | (Rules, Scenario, or Tools)  | 1     | 2     | A |
|         |                              |       |       | I |
| 320px   | Flexible / In-flow           | 320px | 320px | L |
+---------+------------------------------+-------+-------+---+
```

1. **Right Dock Rail (`.tactical-dock__rail`)**:
   - Fixed width: `calc(6 * var(--freefall-space-1))` (48px).
   - Anchored to the right edge of the HUD's host, never the viewport.
   - Contains vertical icon buttons for each available tactical pane.
   - Active state: Isotope Neon vertical indicator bar (`--freefall-color-accent-400`).
2. **Side-by-Side Panes Row (`.tactical-dock__panes`)**:
   - Horizontal flex container holding the active panes arranged side-by-side from left to right.
   - Each pane has fixed width: `calc(40 * var(--freefall-space-1))` (320px, derived from the spacing grid).
   - Surfaces stepped up to `var(--freefall-bg-surface-2)`.
   - Left hairline border: `var(--freefall-border-hairline)`.
3. **Standard Pane Chrome**:
   - **Header** (40px height):
     - Pane icon (`material-symbols-sharp`).
     - Uppercase Title in IBM Plex Mono (`.text-caption`).
     - Close button (`[×]`) that removes the pane from the open set.
   - **Body**:
     - `flex: 1; min-height: 0; overflow-y: auto; scrollbar-width: thin;`.
     - Co-located data and tactical reference components.

---

#### 2. Host-Scoped Adaptive Layout

The host establishes an inline-size query container (for example, `.workspace` or a bounded showcase frame). The HUD adapts to that container's size with CSS container queries; viewport dimensions and device categories do not define its behavior.

| Host inline size | HUD behavior |
|---|---|
| **Wide** | Panes sit in the host's layout flow. When the host lays the HUD beside content in flex/grid, opening panes consume their natural width and the host reallocates remaining space. |
| **Constrained** | Panes overlay content within the host, anchored to the host's right edge and rail. The host must establish the containing block for the overlay. |
| **Too narrow** | The dock and panes are suppressed within that host. |


The component uses a constrained-layout threshold of `75rem` and suppresses the dock at `32rem` or below, expressed as CSS container-query conditions on the host. No behavior may assume a particular viewport, left tray width, or global page layout. The HUD does not impose a layout policy on adjacent host content.

---

#### 3. Core Tactical Panes & Ruleset Extensibility

The standard System Reference HUD ships with three core tactical panes (each 320px wide), and is architecturally open to ruleset and scenario extensions:

```typescript
export interface HudPaneDefinition {
  id: string;
  title: string;
  icon: string;
  badge?: string;
  defaultOpen?: boolean;
}
```

1. **`RULES GLOSSARY`** (`rules`, `menu_book` icon):
   - **Resolution Matrix**:
     - `Normal` — Automatic (no roll required)
     - `Challenging` — TN 11+
     - `Hard` — TN 16+
     - `Near-Impossible` — TN 21+
   - **Success Ladder**:
     - `0 Successes` — Failure & Complication
     - `1 Success` — Basic Success (baseline goal met)
     - `2+ Successes` — Greater Success (increased speed, scale, or bonus effect)
     - `Natural 20` — Always $\ge 1$ Success + Critical Effect.
   - **Bullet Time Sequence**:
     - 1. Declare $\rightarrow$ 2. Prereqs $\rightarrow$ 3. Roll Pool $\rightarrow$ 4. Resolve.
   - **Damage Mitigation**:
     - Damage Value (DV) reduced by Armor Value (AV) point-for-point.
   - **GM Rule of Thumb**:
     - If no consequence for failure or time pressure, adjudicate as Normal without roll.
2. **`DICE SIM`** (`dice`, `casino` icon):
   - Interactive 2d20–5d20 dice pool sandbox with TN selection (TN 11, 16, 21), roll animation, Isotope Neon success highlights, and Nat 20 badges.
3. **`HARM`** (`harm`, `emergency` icon):
   - Interactive 3-slot harm tracker with slot states (Transient, Permanent, Broken Asset, Ousted), damage calculation, and downtime reset.
4. **Pluggable Panes**:
   - Custom rulesets or scenarios can provide additional panes via slots or pane definitions (e.g. `CREW ROSTER`, `COUNTDOWN CLOCKS`, or `VESSEL SYSTEMS`).

---

#### 4. Design Discipline (`DESIGN.md` Conformance)

- **Product surface, not a movie prop**: Modern, high-speed ergonomic delivery machinery. Zero fake CRT scanlines, faux-military brackets, or 90s terminal green text.
- **Palette**: Void dark canvas (`--freefall-bg-canvas`), Surface elevation (`--freefall-bg-surface-2`), Ceramic off-white display typography (`--freefall-text-display`), and scarce Isotope acid-yellow (`--freefall-color-accent-400`) reserved exclusively for active indicators, dice hits, and criticals.
- **Typography**: Lato for explanatory text; IBM Plex Mono for all TN values, formulas, dice outputs, and pane title headers.

---

## Contract

### Definition of Done

- [x] Multi-pane dock architecture specified and documented.
- [x] `TacticalHud.astro` component implements the dock rail, side-by-side panes row, and core panes.
- [x] Multiple panes can be opened and displayed side-by-side simultaneously.
- [x] Each open pane has a header with icon, mono title, and close `[×]` button.
- [x] Dock rail contains icon buttons with active indicators for each pane.
- [x] HUD adapts to host inline size through CSS container queries, not viewport breakpoints.
- [x] Overlay panes are anchored to the host and remain within its bounds.
- [x] HUD selects in-flow, host-bounded overlay, or suppressed behavior from host inline size.
- [x] A too-narrow host suppresses the dock, independent of viewport/device category.
- [x] Interactive dice pool roller works inside the `DICE SIM` pane.
- [x] Custom panes can be plugged in via props and slots.
- [x] Demo page at `apps/design-system/src/pages/tactical-hud.astro` demonstrates multi-pane side-by-side layout with core panes and a custom scenario pane.
- [x] Playwright e2e tests cover multi-pane toggle, host-size adaptation, and pluggable panes.
- [x] `pnpm build`, `pnpm lint`, `pnpm test`, and `pnpm typecheck` pass.

### Scenarios

```gherkin
Scenario: Opening multiple panes side-by-side
  Given a HUD is mounted in a wide host
  When the user clicks a pane button in the right dock rail
  Then that pane opens at 320px width in the host layout
  When the user clicks another pane button
  Then both panes sit side-by-side
  And the host reallocates space to adjacent content

Scenario: Closing a pane via close button
  Given both "ADJUDICATE" and "DICE SIM" panes are open side-by-side
  When the user clicks the close button [×] on the Adjudicate pane
  Then the Adjudicate pane closes
  And the Dice Sim pane smoothly shifts into the primary docked position next to the rail

Scenario: Automatic overlay in a constrained host
  Given a HUD is mounted in a constrained host
  When they open 3 panes simultaneously
  Then the panes transition to an overlay anchored to that host's right edge
  And content outside the host remains unaffected

Scenario: Independent host sizing
  Given a page contains two HUD hosts with different inline sizes
  When one host changes size without a viewport resize
  Then only that host's HUD adapts

Scenario: Suppressed in a narrow host
  Given the HUD's host becomes narrower than the documented minimum
  Then the rail and panes are hidden within that host, regardless of viewport width
```
