# Feature: System Reference Document (SRD) Package & Navigation

## Blueprint

### Context

FREE//FALL v7 is built on a fast, tactical, game-agnostic resolution engine (Action Pool, Target Number, Attributes, Skills, Harm & Consequences). While the core rulebook introduces setting lore and thematic character options, the System Reference Document (SRD) contains the foundational mechanics that other rulesets follow and extend.

To establish proper architectural separation and reflect the SRD's role as the base rules engine:
1. The SRD resides in its own content package: `@free-fall/srd` (`content/srd/`).
2. The SRD is delivered at its own top-level route: `/srd/`.
3. In the site navigation rail, "System Reference v7" is placed as the **bottom-most main target**, below Home, Core Rules, Gear, and Scenarios.
4. The Tactical HUD mounts exclusively on the SRD (`/srd/`), providing GM and player tactical adjudications without intruding on reading-focused lore or gear pages.

Parent spec: `specs/content-workspace/spec.md`

### Architecture

**Content Package: `@free-fall/srd`** (`content/srd/`)

```
content/srd/
├── package.json
└── chapters/
    └── index.md
```

| File | Purpose |
|---|---|
| `content/srd/package.json` | Workspace package declaration for `@free-fall/srd` |
| `content/srd/chapters/index.md` | Core SRD markdown source (Action resolution, Attributes, Skills, Harm) |

**Astro Content Collection** (`apps/free-fall/src/content.config.ts`)

The `srd` collection loads Markdown chapters from `../../content/srd/chapters`:

```ts
const srd = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "../../content/srd/chapters",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().optional(),
  }),
});
```

**Page & Routing** (`apps/free-fall/src/pages/srd/index.astro`)

The SRD route renders at `/srd/` and mounts the Tactical HUD dock:

```astro
---
import { getCollection, render } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";

const entries = await getCollection("srd");
const entry = entries.find((e) => e.id === "index") ?? entries[0];
const { Content } = await render(entry);
---

<BaseLayout title={`${entry.data.title} — FREE//FALL`} hasHud={true}>
  <Content />
</BaseLayout>
```

**Tactical HUD Integration (`hasHud={true}`)**

The SRD mounts the Tactical HUD dock with 3 core tactical panes:
1. **Rules Glossary** (`rules`, `menu_book` icon): Resolution Matrix, Target Numbers, Success ladder, Bullet Time action sequence, Damage Mitigation formula, and GM Rule of Thumb.
2. **Dice Sim** (`dice`, `casino` icon): Interactive Action Pool Simulator (2d20–5d20, TN 11/16/21).
3. **Harm Calc** (`harm`, `emergency` icon): Interactive 3-slot harm tracker and damage calculation.

Each pane is fixed at **320px width** (`calc(40 * var(--freefall-space-1))`), perfectly matching the width of the left navigation rail/tray (`--app-tray-tray-width`).


**Navigation Rail Ordering** (`apps/free-fall/src/layouts/BaseLayout.astro`)

The primary navigation rail displays 5 top-level items in strict order:
1. **Home** (`public` icon, `/`)
2. **Core Rules v7** (`book_5` icon, `/core-rulebook/00-intro/`)
3. **Gear** (`handyman` icon, `/gear/weapons/`)
4. **Scenarios** (`map` icon, `/scenarios/`)
5. **System Reference v7** (`terminal` icon, `/srd/`) $\leftarrow$ **Bottom-most target**

Helper `getSrdNavItem(pathname)` in `apps/free-fall/src/lib/nav.ts` provides the navigation item definition.

**Backwards Compatibility & Cross-Linking**

- **Redirect**: Legacy URL `/core-rulebook/system-reference` redirects to `/srd` via `apps/free-fall/astro.config.ts`.
- **Term Resolution**: `:term[...]` directives within `/content/srd/` resolve against `content/core-rulebook/chapters/registry.md`.
- **URL Rewriting**: Relative links in SRD markdown rewrite to `/core-rulebook/` so registry terms link cleanly across packages.
- **Registry Links**: `content/core-rulebook/chapters/registry.md` points SRD mechanical terms directly to `/srd/#...`.

### Constraints

- **Single Source for Base Mechanics**: Foundational mechanics belong in `@free-fall/srd`; core-rulebook chapters do not duplicate or re-host `system-reference.md`.
- **HUD Scoping**: The Tactical HUD dock is active only on the SRD (`/srd/`); all other pages render standard clean layouts.
- **Rail Hierarchy**: "System Reference v7" is strictly the bottom-most target in the global navigation rail.

## Contract

### Definition of Done

- [x] `@free-fall/srd` package created at `content/srd/package.json`
- [x] `content/srd/chapters/index.md` contains the SRD rules content
- [x] Legacy `content/core-rulebook/chapters/system-reference.md` removed from core rulebook package
- [x] `srd` collection configured in `apps/free-fall/src/content.config.ts`
- [x] Dedicated SRD page served at `/srd/` via `apps/free-fall/src/pages/srd/index.astro`
- [x] Tactical HUD mounted exclusively on `/srd/`
- [x] "System Reference v7" (`terminal` icon) placed as the bottom-most item in the navigation rail
- [x] Legacy URL `/core-rulebook/system-reference` redirects to `/srd`
- [x] `intro.md` and `registry.md` updated to link to `/srd/`
- [x] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

- SRD must always be the bottom-most item in the global navigation rail.
- Tactical HUD must never render on non-SRD routes (`/`, `/core-rulebook/*`, `/gear/*`, `/scenarios/*`).
- `/core-rulebook/system-reference` must redirect cleanly to `/srd`.

### Scenarios

```gherkin
Scenario: Visiting SRD directly
  Given a user navigates to "/srd/"
  When the page loads
  Then the SRD content is displayed
  And the Tactical HUD dock rail is visible
  And the "System Reference v7" rail item is marked active

Scenario: Navigation rail ordering
  Given a user is on any top-level page
  When inspecting the navigation rail items
  Then the rail items appear in the order: Home, Core Rules v7, Gear, Scenarios, System Reference v7
  And "System Reference v7" is the last item

Scenario: Tactical HUD exclusivity
  Given a user navigates to "/core-rulebook/00-intro/" or "/gear/weapons/" or "/"
  When the page loads
  Then no Tactical HUD dock or panes are present in the DOM

Scenario: Legacy SRD route redirect
  Given a user navigates to "/core-rulebook/system-reference"
  When the redirect executes
  Then the user lands on "/srd"
  And the SRD page with HUD is displayed
```
