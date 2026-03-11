# Feature: Gear Collection

## Blueprint

### Context

The core rulebook chapter "Tools of the Trade" defines the **rules** governing equipment — qualities, categories, damage values, vehicle mechanics. But the individual gear items (weapons, armor, augmentations, utility gear, vehicles) are **data**, not prose. They have structured properties (binding costs, qualities, DV, range) that the app needs to query, filter, and eventually render into interactive components like character sheets and loadout builders.

A dedicated content package — `content/gear/` — stores each item as a Markdown file with rich frontmatter. The Markdown body provides flavor text and narrative description. The frontmatter encodes the mechanical properties in a schema the app can consume programmatically.

Gear is a bespoke content package, separate from the core rulebook. The core rulebook defines the *rules* for equipment (qualities, categories, damage tables). The gear package provides the *catalog* of items governed by those rules. This separation allows the gear catalog to evolve independently — new items, campaign-specific equipment lists, homebrew additions — without touching the rulebook prose.

Parent spec: `specs/content-workspace/spec.md`

### Architecture

**Collection location**

```
content/gear/
├── package.json
├── items/
│   ├── augmentations/
│   │   ├── adrenal-surge-gland.md
│   │   ├── synaptic-accelerator-basic.md
│   │   ├── utility-mechadendrite.md
│   │   ├── internal-oxygenator.md
│   │   ├── neural-link.md
│   │   └── monowire-projector.md
│   ├── weapons/
│   │   ├── micro-missile-pistol.md
│   │   ├── kinetic-carbine.md
│   │   ├── pneumatic-ram.md
│   │   ├── neuro-stunner.md
│   │   ├── arc-caster.md
│   │   ├── light-lance.md
│   │   ├── light-pistol.md
│   │   ├── shotgun.md
│   │   ├── heavy-kinetic-assault-rifle.md
│   │   └── rail-gun.md
│   ├── armor/
│   │   ├── ballistic-vest.md
│   │   ├── flak-jacket-plus.md
│   │   ├── rhino-hide.md
│   │   ├── chameleon-skin.md
│   │   ├── eva-suit-workhorse.md
│   │   └── void-marine.md
│   ├── utility/
│   │   ├── mule-harness.md
│   │   ├── trauma-kit.md
│   │   ├── ghost-link.md
│   │   ├── arthropod-sensors.md
│   │   ├── drone-swarm.md
│   │   ├── combat-deck.md
│   │   └── neural-scope.md
│   └── vehicles/
│       ├── void-jumper-pmu.md
│       ├── cutter-eva-frame.md
│       ├── wraith-infiltration-frame.md
│       ├── hardshell-combat-exo.md
│       └── dart-courier-shuttle.md
└── assets/
```

Gear is its own content package (`@free-fall/gear`), following the same workspace convention as `content/core-rulebook/`. The `items/` directory (analogous to `chapters/`) contains gear files organized into subdirectories by category. The subdirectories are organizational; the `category` frontmatter field is the canonical type, not the directory.

**`package.json`:**

```json
{
  "name": "@free-fall/gear",
  "version": "0.1.0",
  "type": "module",
  "description": "FREE//FALL gear catalog — structured equipment data.",
  "scripts": {
    "lint": "biome check ."
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.4"
  }
}
```

**Frontmatter schema**

All gear files share a common base with `category` as the discriminator. The Zod schema uses `z.discriminatedUnion()` so that category-specific fields are **required** on their category and absent from others. TypeScript narrows the type when you check `category`, giving strict per-category types from a single collection.

**Base fields (all categories):**

```yaml
title: "Kinetic Carbine"                  # Display name
nickname: "Standard-issue rifle"          # Short flavor label (shown in lists)
category: "weapon"                        # Discriminator: weapon | armor | augmentation | utility | vehicle
binding:                                  # Attribute Binding cost (defaults to 0/0/0)
  body: 0
  mind: 0
  ghost: 0
qualities: []                             # Array of quality strings
source: "v5-tools-of-the-trade"           # Source tracking (optional)
```

**Category-specific fields:**

| Category | Required fields | Notes |
|---|---|---|
| `weapon` | `dv` (number), `harm_type` (Physical / Psychic) | — |
| `armor` | `av` (number), `av_type` (string, default "Physical") | — |
| `augmentation` | `augmentation_category` (Spliced / Bionic / Cybernetic), `integration` (Invasive / Field-Operable) | — |
| `utility` | *(none beyond base)* | — |
| `vehicle` | `frame` (number), `systems` (number), `pilot_binding` (binding object), `vehicle_av` (number), `size_category` (Personal / Small / Medium / Large / Huge) | — |

**Zod schema definition** (added to `content.config.ts`):

```ts
const bindingSchema = z.object({
  body: z.number().default(0),
  mind: z.number().default(0),
  ghost: z.number().default(0),
});

const gearBase = z.object({
  title: z.string(),
  nickname: z.string().optional(),
  binding: bindingSchema.default({ body: 0, mind: 0, ghost: 0 }),
  qualities: z.array(z.string()).default([]),
  source: z.string().optional(),
});

const weaponSchema = gearBase.extend({
  category: z.literal("weapon"),
  dv: z.number(),
  harm_type: z.enum(["Physical", "Psychic"]),
});

const armorSchema = gearBase.extend({
  category: z.literal("armor"),
  av: z.number(),
  av_type: z.string().default("Physical"),
});

const augmentationSchema = gearBase.extend({
  category: z.literal("augmentation"),
  augmentation_category: z.enum(["Spliced", "Bionic", "Cybernetic"]),
  integration: z.enum(["Invasive", "Field-Operable"]),
});

const utilitySchema = gearBase.extend({
  category: z.literal("utility"),
});

const vehicleSchema = gearBase.extend({
  category: z.literal("vehicle"),
  frame: z.number(),
  systems: z.number(),
  pilot_binding: bindingSchema,
  vehicle_av: z.number(),
  size_category: z.enum(["Personal", "Small", "Medium", "Large", "Huge"]),
});

const gearSchema = z.discriminatedUnion("category", [
  weaponSchema,
  armorSchema,
  augmentationSchema,
  utilitySchema,
  vehicleSchema,
]);

const gear = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "../../content/gear/items",
  }),
  schema: gearSchema,
});
```

**Type narrowing in consumers:**

```ts
const items = await getCollection("gear");
for (const item of items) {
  // item.data.title, .binding, .qualities — always available
  if (item.data.category === "weapon") {
    item.data.dv;        // number (not number | undefined)
    item.data.harm_type; // "Physical" | "Psychic"
  }
  if (item.data.category === "vehicle") {
    item.data.frame;     // number
    item.data.systems;   // number
  }
}
```

This gives one collection, one loader, one query surface — but strict per-category validation at build time and full type narrowing in consumer code.

**Markdown body**

The body of each gear file contains:

1. A flavor text paragraph (italic, narrative voice)
2. A **Description** paragraph explaining what the item is
3. An **Effect/Function** section describing mechanical behavior in prose
4. Optional **Binding Rationale** explaining *why* the binding costs are what they are

This keeps narrative content in Markdown (renderable as prose) while mechanical data stays in frontmatter (queryable by the app).

**Example gear file: `weapons/kinetic-carbine.md`**

```markdown
---
title: "Kinetic Carbine"
nickname: "Standard-issue rifle"
category: "weapon"
binding:
  body: 1
qualities:
  - "Range (Medium)"
  - "Ammo (Standard)"
  - "Burst Fire"
dv: 2
harm_type: "Physical"
source: "v5-tools-of-the-trade"
---

*Standard-issue kinetic assault rifle. Reliable, versatile, and ubiquitous.*

A common ballistic rifle found throughout the system. Requires bracing against recoil for effective sustained fire.

**Effect:** Inflicts DV 2 Physical Harm per hit. Burst Fire allows each Success to count as a separate hit, distributable across nearby targets.

**Binding rationale:** Body 1 — requires bracing against recoil for effective sustained fire.
```

**Consumption patterns**

The gear collection enables:

1. **Gear catalog pages** — list/detail views at `/gear/[id]` or similar
2. **Category filtering** — `getCollection("gear").filter(g => g.data.category === "weapon")` — returns narrowed weapon type
3. **Character sheet integration** — query gear by ID, display binding costs, compute total binding
4. **Loadout builder** — select gear, sum binding costs against attribute budgets, validate constraints

These consumer features are out of scope for this spec. This spec covers the data layer only.

**Content file standard**

Gear files follow the content workspace convention (see `specs/content-workspace/spec.md`):
- Plain Markdown body, no inline HTML or CSS
- Frontmatter is the single source of mechanical truth
- Body text provides narrative context renderable in `.freefall-prose` scope
- Filenames are kebab-case, no numeric prefixes

### Anti-Patterns

- **No mechanical data in Markdown body** — DV, AV, binding costs, qualities must be in frontmatter. The body is for flavor and explanation only. Duplicating numbers in prose creates drift.
- **No category inference from directory** — The `category` frontmatter field is canonical. Subdirectories are organizational convenience only.
- **No computed fields in frontmatter** — Don't store derived values (e.g., "total binding = 4"). Consumers compute from the base fields.
- **No framework components in gear files** — Same rule as chapters: zero framework imports in content packages.
- **No "stat block" HTML in body** — Resist the temptation to build formatted stat blocks in Markdown. The app renders stat blocks from frontmatter data using its own components.

## Contract

### Definition of Done

- [ ] `content/gear/` exists as a workspace member with `package.json` and `items/` directory
- [ ] `content/gear/items/` has subdirectories: `augmentations/`, `weapons/`, `armor/`, `utility/`, `vehicles/`
- [ ] All gear items from V5 "Tools of the Trade" source are migrated as individual `.md` files with frontmatter matching the schema
- [ ] `apps/free-fall/src/content.config.ts` defines a `gear` collection with the Zod schema above
- [ ] `getCollection("gear")` returns all gear entries with correctly typed data
- [ ] Every gear file has `title`, `category`, `binding`, and `qualities` in frontmatter
- [ ] Weapon files include required `dv` and `harm_type` — validated by discriminated union
- [ ] Augmentation files include required `augmentation_category` and `integration` — validated by discriminated union
- [ ] Vehicle files include required `frame`, `systems`, `pilot_binding`, `vehicle_av`, and `size_category` — validated by discriminated union
- [ ] Armor files include required `av` — validated by discriminated union
- [ ] A weapon file missing `dv` fails the build with a Zod validation error
- [ ] No gear file contains inline HTML or CSS
- [ ] HMR watcher in `astro.config.ts` watches `../../content/gear/items`
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

- Existing core-rulebook chapter routes must not break
- Navigation must not show gear entries in the chapter list
- The gear collection must remain a separate Astro content collection from `core-rulebook`
- Frontmatter schema changes must not silently drop fields — Zod validation must catch missing required fields at build time

### Scenarios

```gherkin
Scenario: Gear entry is queryable by category
  Given the gear collection contains "kinetic-carbine.md" with category "weapon"
  When the app queries getCollection("gear") filtered by category "weapon"
  Then the result includes an entry with title "Kinetic Carbine" and dv 2

Scenario: Binding costs are structured data
  Given the gear entry "neural-link.md" has binding ghost 3
  When the app reads the entry's data.binding
  Then binding.ghost equals 3 and binding.body equals 0 and binding.mind equals 0

Scenario: Vehicle entry has machine attributes
  Given the gear entry "hardshell-combat-exo.md" has frame 24 and systems 6
  When the app reads the entry's data
  Then data.frame equals 24 and data.systems equals 6 and data.pilot_binding.ghost equals 3

Scenario: Gear file body renders as prose
  Given the gear entry "kinetic-carbine.md" has a Markdown body with italic flavor text
  When the entry's Content is rendered in a .freefall-prose scope
  Then the flavor text renders as italic and the description renders as a paragraph

Scenario: Missing discriminator fails build
  Given a gear file exists with no "category" in frontmatter
  When pnpm build runs
  Then the build fails with a Zod validation error identifying the missing discriminator

Scenario: Missing category-specific field fails build
  Given a weapon file exists with category "weapon" but no "dv" field
  When pnpm build runs
  Then the build fails with a Zod validation error for the missing required field

Scenario: Type narrows on category check
  Given the gear collection contains a weapon entry and a vehicle entry
  When consumer code filters by category "weapon"
  Then the filtered entries have data.dv typed as number, not number | undefined

Scenario: New gear file auto-discovered
  Given a new file "plasma-cutter.md" is added to content/gear/items/utility/
  When the app is rebuilt
  Then getCollection("gear") includes an entry with the ID derived from "plasma-cutter"
```
