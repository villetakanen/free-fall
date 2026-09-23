# Feature: Universal Tactical HUD (Multi-Pane Inspector Dock)

## Blueprint

### Context

Tabletop RPG play requires constant, split-second mechanical adjudication: checking Target Numbers (TNs), evaluating Success counts (0 / 1 / 2+), applying Action Pool Harm penalties (5d20 down to 2d20), verifying prerequisite costs (spending Body, Mind, or Ghost points), and referencing the Bullet Time combat sequence.

On paper, GMs relied on the physical cardboard **GM Screen**. On the web, users have historically suffered through fragmented tab juggling or navigating away from their scenario and losing their place.

The **Tactical HUD** is an always-accessible, non-destructive **multi-pane docked inspector system** (inspired by Adobe InDesign and Illustrator tool docks) built for `AppShell`. It provides a dedicated right-hand dock rail hosting $N$ pluggable tactical panes. Users can toggle multiple panes to sit **side-by-side** simultaneously on wide displays, or float as an elevated overlay when screen width is constrained.

**Mobile boundary**: On mobile viewports ($< 620\text{px}$), the HUD dock does not exist. Cramming a multi-panel flight console onto a 390px touch screen is an anti-pattern; mobile reference is handled through clean in-situ touch flows (in-situ term inspection and dedicated mobile drawer pages) rather than desktop drawer emulation.

Parent spec: `specs/design-system/app-shell/spec.md`

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
   - Positioned on the right edge of the viewport.
   - Contains vertical icon buttons for each available tactical pane.
   - Active state: Isotope Neon vertical indicator bar (`--freefall-color-accent-400`).
2. **Side-by-Side Panes Row (`.tactical-dock__panes`)**:
   - Horizontal flex container holding the active panes arranged side-by-side from left to right.
   - Each pane has fixed width: `calc(40 * var(--freefall-space-1))` (320px, matching the left navigation rail/tray width `--app-tray-tray-width`).
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

#### 2. Adaptive Spatial Responsibility

The dock adapts its layout behavior based on screen real estate to protect reading measure:

| Viewport Tier | Width | Left Tray | HUD Rail | Open Panes Layout Mode | Max Open Panes |
|---|---|---|---|---|---|
| **Large Desktop (27")** | $\ge 1800\text{px}$ | 320px tray | 48px rail | **In-Flow Push**: All open panes physically push the main content left. Content remains $\ge 700\text{px}$ wide. | Up to 4 side-by-side |
| **Laptop / Medium Desktop** | $1024\text{px} - 1799\text{px}$ | 320px tray (or 80px rail) | 48px rail | **Hybrid**: 1 open pane pushes in-flow. When 2+ panes open, panes transition to a **Floating Overlay** docked to the right rail, preventing content crushing. | 1–3 side-by-side |
| **Tablet (iPad)** | $620\text{px} - 1023\text{px}$ | 80px rail | 48px rail | **Overlay**: Panes float above content docked to the rail, capped at 1 open pane at a time. | 1 pane |
| **Mobile** | $< 620\text{px}$ | Drawer (hidden) | Hidden | Hidden entirely. | 0 |

---

#### 3. Core Tactical Panes & Ruleset Extensibility

The standard System Reference HUD ships with three core tactical panes (each 320px wide, equal to the left tray), and is architecturally open to ruleset and scenario extensions:

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
- [ ] `TacticalHud.astro` component implements the dock rail, side-by-side panes row, and core panes.
- [ ] Multiple panes can be opened and displayed side-by-side simultaneously.
- [ ] Each open pane has a header with icon, mono title, and close `[×]` button.
- [ ] Dock rail contains icon buttons with active indicators for each pane.
- [ ] Large viewports ($\ge 1800\text{px}$) push main content in-flow.
- [ ] Constrained viewports ($1024\text{px} - 1799\text{px}$) switch to floating overlay when multiple panes exceed content minimum width.
- [ ] Tablet viewports ($620\text{px} - 1023\text{px}$) open panes as an overlay capped at 1 pane.
- [ ] Mobile viewports ($< 620\text{px}$) suppress the dock entirely.
- [ ] Interactive dice pool roller works inside the `DICE SIM` pane.
- [ ] Custom panes can be plugged in via props and slots.
- [ ] Demo page at `apps/design-system/src/pages/tactical-hud.astro` demonstrates multi-pane side-by-side layout with core panes and a custom scenario pane.
- [ ] Playwright e2e tests cover multi-pane toggle and side-by-side rendering.
- [ ] `pnpm build`, `pnpm lint`, `pnpm test`, and `pnpm typecheck` pass.

### Scenarios

```gherkin
Scenario: Opening multiple panes side-by-side
  Given a user views the site on a wide desktop viewport (>= 1800px)
  When they click "ADJUDICATE" in the right dock rail
  Then the Adjudicate pane opens at 280px width pushing content left
  When they click "DICE SIM" in the right dock rail
  Then both Adjudicate and Dice Sim panes are open side-by-side at 560px combined width
  And the main content area continues to push left without text truncation

Scenario: Closing a pane via close button
  Given both "ADJUDICATE" and "DICE SIM" panes are open side-by-side
  When the user clicks the close button [×] on the Adjudicate pane
  Then the Adjudicate pane closes
  And the Dice Sim pane smoothly shifts into the primary docked position next to the rail

Scenario: Automatic overlay on constrained laptop viewports
  Given a user views the site on a 1280px laptop viewport
  When they open 3 panes simultaneously
  Then the panes transition to a floating overlay above the text
  And the main content maintains its minimum readable width without horizontal squeeze

Scenario: Tablet single-pane overlay
  Given a user views the site on an iPad tablet (768px - 1023px)
  When they tap "COMBAT" in the right dock rail
  Then the Combat pane opens as an overlay
  When they tap "DICE SIM"
  Then the Dice Sim pane replaces the Combat pane as the single active overlay

Scenario: Hidden on mobile
  Given a user views the site on a mobile viewport (< 620px)
  Then the right dock rail and tactical panes are completely hidden
```
