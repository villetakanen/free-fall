# Feature: Scenario Crew Keeper

## Blueprint

### Context

FREE//FALL scenarios ship with pre-generated characters: *Northern Lights* provides five contractors (Pilot, Operator, Wirehead, Fixer, Spectre). In tabletop play, capability is defined by the interaction between innate **Resources** (Initial Body, Mind, Ghost), **Binding Costs** (points subtracted from attributes to power equipped Chrome), and **Harm** (3 slots, each imposing a -1d20 penalty to the 5d20 Action Pool).

Previously, pre-gen sheets were authored as static Markdown bullet points with arithmetic written out in prose (`Body: 6 − 2 = 4`). A player or GM at the table had to calculate and track pools and harm on scrap paper.

The **Crew Keeper** delivers characters as structured data and reactive play machinery:
1. A unified **Crew Keeper** dashboard (`/scenarios/{scenario}/crew/`) giving the GM and players an at-a-glance overview of the entire team: who holds which skill, active pools, bound points, harm state, and action pool dice.
2. An interactive **Operator Card** embedded on each character's detail route (`/scenarios/{scenario}/c-0{N}-{slug}/`) that presents their live tactical sheet alongside their narrative dossier.

Parent spec: `specs/content-scenarios/spec.md`

### Architecture

#### 1. Data Contract & Frontmatter Schema

Character pages remain within the `scenario-pages` Astro collection (`content/scenarios/{scenario}/*.md`). The collection schema in `apps/free-fall/src/content.config.ts` extends to support structured character metadata:

```typescript
const characterSchema = z.object({
  callsign: z.string().min(1),
  class: z.string().min(1),
  origin: z.string().min(1),
  age: z.number().int().positive().optional(),
  sex: z.string().optional(),
  skill: z.string().min(1),
  attributes: z.object({
    body: z.number().int().positive(),
    mind: z.number().int().positive(),
    ghost: z.number().int().positive(),
  }),
  binding: z.object({
    body: z.number().int().nonnegative().default(0),
    mind: z.number().int().nonnegative().default(0),
    ghost: z.number().int().nonnegative().default(0),
  }).default({ body: 0, mind: 0, ghost: 0 }),
  gear_summary: z.array(
    z.object({
      name: z.string().min(1),
      detail: z.string().optional(),
      binding: z.object({
        body: z.number().default(0),
        mind: z.number().default(0),
        ghost: z.number().default(0),
      }).default({ body: 0, mind: 0, ghost: 0 }),
    })
  ).default([]),
});
```

When these fields are present, the page is recognized as an Operator Sheet. If omitted, the page is treated as standard narrative prose (e.g. `the-approach.md`, `onboarding.md`).

#### 2. Component: `OperatorCard`

Location: `packages/design-system/src/components/OperatorCard.astro`

A self-contained component for displaying an operator's tactical status:
- **Header**: Callsign, Class badge, Origin, and Innate Skill.
- **Resource Pools**: Three `StatCircle` components (Body, Mind, Ghost) displaying:
  - Large value: **Current Max Pool** (`Initial - Binding`).
  - Mono caption: `INIT {initial} · BIND {binding}`.
- **Action Pool Readout**: Base `5d20`, decremented by `1d20` per filled Harm slot (floor `2d20`).
- **Harm Track**: 3 Harm slots rendered with discrete, themed indicators (empty bracket `[ ]` vs filled isotope marker `[/]`).
- **Chrome Summary**: Compact list of equipped gear and augmentations with their binding impact.

#### 3. Route: `/scenarios/{scenario}/crew/`

Location: `apps/free-fall/src/pages/scenarios/[scenario]/crew.astro`

- Renders all operators defined in the scenario as a responsive tactical grid.
- Desktop ($\ge 780\text{px}$): Multi-column roster comparing all crew members side-by-side.
- Mobile ($< 620\text{px}$): Stacked operator cards with quick-navigation anchors.
- Each operator card in the keeper links directly to their full dossier (`/scenarios/{scenario}/{page}/`).

#### 4. Navigation Integration

In `apps/free-fall/src/lib/nav.ts`, the scenario subsite navigation includes a top-level `The Crew` item linking to `/scenarios/{scenario}/crew/` with icon `groups`. The individual character pages appear as sub-items or within the Characters group.

#### 5. Progressive Enhancement & Client State

- **HTML/CSS Baseline (Zero JS)**:
  - Renders all initial pools, binding calculations, and 5d20 action pool cleanly.
  - Harm slots are interactive via CSS checkbox toggles (`<input type="checkbox" class="harm-toggle">`).
- **Progressive Enhancement (JavaScript)**:
  - Toggling a Harm checkbox dynamically updates the displayed Action Pool readout ($5d20 \rightarrow 4d20 \rightarrow 3d20 \rightarrow 2d20$).
  - State is saved to `sessionStorage` (scoped by scenario and character callsign) so refreshing during play preserves battle damage.
  - A "Reset" button restores the pre-gen's default starting state.

### Constraints

- The design strictly adheres to `DESIGN.md`: no semantic red/green damage bars; palette uses Void canvas, Ceramic text, and Isotope accent.
- Formula for Action Pool is invariant: $\max(2, 5 - \text{Filled Harm Slots})$.
- Initial Attributes follow the standard array `[12, 8, 6]` across Body, Mind, Ghost for all 5 pre-gens.
- Non-character scenario pages must remain completely unaffected.

---

## Contract

### Definition of Done

- [ ] `scenarioPages` schema in `content.config.ts` validates optional character metadata without breaking existing scenario pages.
- [ ] Frontmatter of all 5 Northern Lights characters (`c-01` through `c-05`) is updated with structured callsign, class, origin, skill, attributes, binding, and gear summary.
- [ ] `OperatorCard` component renders callsign, class, skill, attribute pools with `StatCircle`, 3 harm slots, and action pool readout.
- [ ] `/scenarios/northern-lights/crew/` renders all 5 operators in a responsive layout.
- [ ] Individual character pages (`/scenarios/northern-lights/c-01-the-pilot/`, etc.) render the `OperatorCard` above their narrative dossier.
- [ ] Harm slot toggles dynamically update the Action Pool readout between 5d20 and 2d20.
- [ ] Subsite navigation in `nav.ts` includes `The Crew` (`/scenarios/{scenario}/crew/`) with `groups` icon.
- [ ] `pnpm build`, `pnpm lint`, `pnpm test`, and `pnpm typecheck` pass.

### Regression Guardrails

- Scenario pages without character metadata must render identical markdown output to before.
- Core rulebook and gear catalog routes must remain unaffected.
- The Crew Keeper must render complete, valid HTML with CSS even if JavaScript is disabled.

### Scenarios

```gherkin
Scenario: Operator Card displays calculated pools
  Given Vector has Initial Body 6 and Body Binding 2
  When a user views /scenarios/northern-lights/c-01-the-pilot/
  Then the Body StatCircle displays 4
  And the label indicates Initial 6 and Bound 2

Scenario: Harm slots decrement Action Pool
  Given Root currently has 0 filled harm slots and an Action Pool of 5d20
  When the user marks 1 harm slot as filled
  Then the Action Pool displays 4d20
  When the user marks all 3 harm slots as filled
  Then the Action Pool displays 2d20 (minimum floor)

Scenario: Crew Keeper renders all five contractors
  When a user navigates to /scenarios/northern-lights/crew/
  Then OperatorCards for Vector, Vantage, Root, Stitch, and Sable are displayed
  And each card links to that contractor's full scenario dossier

Scenario: Non-character page retains normal layout
  When a user views /scenarios/northern-lights/the-approach/
  Then the page renders standard narrative prose without an OperatorCard
```
