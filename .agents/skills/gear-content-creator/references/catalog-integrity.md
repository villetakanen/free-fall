# Gear Catalog Integrity

Use these gates for every creation or revision. Confirm repository behavior against current code because schemas, rules, and renderers can evolve independently.

## Authority Order

1. `AGENTS.md`
2. The user's current brief
3. `DESIGN.md`
4. `apps/free-fall/src/content.config.ts` for accepted data
5. `content/core-rulebook/chapters/03-core-rules.md` and `04-tools-of-the-trade.md` for mechanics
6. Current entries in `content/gear/items/` for catalog conventions
7. `specs/content-gear/spec.md` for architectural intent
8. Archival sources under `docs/sources/` for provenance
9. Scenario and example-character copies as dependent content

Current runtime code is authoritative for schema behavior. Current rulebook prose is authoritative for mechanics. Existing entries calibrate tone and may contain legacy drift.

## Catalog Fit

- State the item's table function in one sentence.
- Identify the nearest existing alternatives and the decision that distinguishes this item.
- Match the exact public name wherever dependent content refers to the catalog entry.
- Keep the category discriminator canonical and place the file in the matching directory for human navigation.
- Preserve alphabetical catalog behavior; there is no content ordering field.
- Give powerful capabilities a visible cost, limit, prerequisite, exposure, or specialization supported by current rules.
- Keep flavor attached to function: industrial origin, operational compromise, and human cost make an item specific.

## Rules Checks

### All Categories

- Verify each binding against the current meanings of Body, Mind, and Ghost.
- Verify every quality is defined in current rules or explain it as an item-local mechanic in the body.
- Use exact quality spelling and parenthetical scope consistently with current catalog forms.
- Distinguish `Limited Use` from `Single Use`.
- Check prerequisites and cross-item combinations in both directions.
- Keep all numeric values non-negative and intentionally integral.

### Weapons

- Verify DV against intended lethality and neighboring weapons.
- Verify `Physical` or `Psychic` harm type.
- Check Range, Ammo, Burst Fire, High Impact, Piercing, Spread, Unwieldy, High Visibility, and exceptional firing behavior against current rules.
- Explain undefined legacy forms such as numbered `Impact` locally rather than presenting them as globally established rules.

### Armor

- Keep `av`, `av_type`, and any displayed AV quality synchronized.
- Distinguish ordinary AV from environmental protection.
- Check Environmental Sealing, Life Support, Hardened, Integrated System, and Load Bearing scope.
- State what attached gear a Load Bearing quality affects when current rules or item behavior constrain it.

### Augmentations And Utility

- Verify augmentation category and installation mode.
- Check whether prerequisites such as a Neural Link are explicit.
- Explain mixed installation modes and conditional costs without implying the schema can query them.
- When an augmentation attacks, verify its body prose against weapon and Harm rules even though the schema cannot store DV.
- Define utility-only quality behavior concretely enough to adjudicate at the table.

### Exoskeletons And Vehicles

- Verify FRM substitutes for Body and SYS substitutes for Mind under current machine rules.
- Verify `pilot_binding` separately from ordinary `binding`.
- Check conditional integrated-system binding and state both inactive and active costs in prose.
- Verify vehicle AV, size, movement systems, occupancy, cargo, sensors, life support, hardpoints, and remote operation where applicable.
- Confirm mounted gear interacts with hardpoints and pilot binding according to current rules.
- Manually inspect pilot binding because the current card displays ordinary binding rather than `pilot_binding`.

## Prose Checks

- Use plain Markdown without inline HTML, CSS, framework imports, or an authored H1.
- Open with one italic sentence that conveys capability rather than generic adjectives.
- Explain where the item appears and why someone accepts its cost.
- Use `**Effect:**` for behavior the structured card cannot communicate.
- Use `**Binding rationale:**` when the Attribute choice is not self-evident.
- Keep structured values in frontmatter and remove avoidable numeric duplication from new prose.
- When legacy prose repeats values, compare every repetition and repair drift in the same edit.
- Use ordinary Markdown links with absolute site paths; use plain rules language because gear does not currently resolve `:term[]`.

## Dependency Audit

Search `content/` for:

1. Exact title.
2. Filename stem.
3. Nickname and model designation.
4. Common shorthand used in scenarios or example characters.
5. Distinctive quality or prerequisite names when a change affects combinations.

For changed DV, AV, binding, pilot binding, FRM, SYS, or qualities:

- Recalculate affected character and pregen total bindings.
- Recalculate Current Body, Mind, and Ghost pools.
- Recheck hardpoint and Load Bearing treatment.
- Recheck rulebook examples and scenario prose.
- Report concrete out-of-scope drift with file paths and values.

Catalog frontmatter wins over scenario shorthand and archival source values unless the task explicitly changes the catalog.

## Presentation Audit

- Confirm the category is mapped in `apps/free-fall/src/lib/nav.ts` and rendered by `apps/free-fall/src/pages/gear/[category].astro`.
- Confirm title, nickname, qualities, and stats fit the card's information hierarchy.
- Inspect long quality lists and machine entries carefully.
- Remember that items have category pages, not individual routes or stable item anchors.
- Treat image support as application work until the schema and page pass image data to `GearCard.astro`.

## Validation Gates

1. Confirm the filename is descriptive kebab-case without a numeric prefix.
2. Confirm the directory and canonical `category` agree.
3. Validate frontmatter against the exact discriminated-union branch in `apps/free-fall/src/content.config.ts`.
4. Confirm `binding` and `qualities` are explicit and only supported fields are present.
5. Check all numbers, enums, quality strings, prerequisites, and conditional mechanics manually.
6. Compare body claims against frontmatter and current rules.
7. Search all dependent content and recalculate affected loadouts.
8. Run `pnpm --filter @free-fall/app build`.
9. Run `pnpm --filter @free-fall/app typecheck`.
10. Inspect `git diff` and report residual mechanical or dependency risks.

The app build is the critical automated schema and rendering gate. Current linting does not substantively validate Markdown, quality vocabulary, mechanical balance, conditional binding, or cross-content consistency; those remain manual gates.
