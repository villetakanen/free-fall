---
name: gear-content-creator
description: Create, revise, migrate, or audit FREE//FALL gear catalog content in content/gear/items/, including weapons, armor, augmentations, utility gear, exoskeletons, and vehicles. Load this skill whenever the user asks to author equipment, add a catalog item, rebalance gear data, improve gear prose, migrate source equipment, or check catalog consistency. Use scenario-content-creator for scenario-local equipment and /spec for schemas, categories, routes, filtering, images, rules, or GearCard behavior.
---

# Gear Content Creator Skill

Create mechanically trustworthy, queryable FREE//FALL gear entries whose structured data and prose describe one coherent capability.

## Symmetrical Boundaries

* **Active Range:** Begin when the user requests creation, revision, migration, balancing, or consistency review of catalog Markdown under `content/gear/items/`; own supported frontmatter, item prose, provenance, rules alignment, and audits of dependent content affected by changed catalog facts.
* **Handoff Target:** Stop when each requested entry is schema-valid, mechanically coherent, catalog-distinct, dependency-audited, and verified by the app build. Hand scenario-only vessels, props, and loadouts to `scenario-content-creator`; route rule changes, new categories or fields, structured qualities, conditional-binding data, item routes, filtering, images, or card behavior to `/spec`, then `/plan`; route a completed changeset to `/ship` only when the user asks to commit and push.

## Steps to Execute

1. [ ] **Establish the item brief:** Identify the category, intended table function, target rules version, provenance, power level, constraints, and whether the request creates, revises, migrates, or audits content. Ask one focused question when a missing choice would materially change the mechanic.
2. [ ] **Read current authority:** Read `AGENTS.md`, `DESIGN.md`, the applicable schema branch in `apps/free-fall/src/content.config.ts`, current gear rules in `content/core-rulebook/chapters/03-core-rules.md` and `04-tools-of-the-trade.md`, the target entry, and representative catalog entries. Treat `specs/content-gear/spec.md` as intent and resolve runtime details from current code.
3. [ ] **Audit the catalog neighborhood:** Search `content/gear/items/` for overlapping functions, names, bindings, qualities, and stat profiles. Define what tactical or narrative decision makes the item distinct before assigning numbers.
4. [ ] **Model supported data:** Choose the exact category schema and fill only its supported fields using [Schemas And Templates](./references/schemas-and-templates.md). Keep mechanical facts queryable in frontmatter, use explicit `binding` and `qualities`, and represent conditional or item-local mechanics honestly in qualities and prose without inventing fields.
5. [ ] **Validate the mechanic:** Check DV, AV, FRM, SYS, size, harm type, binding, pilot binding, hardpoints, prerequisites, duration, and qualities against current rules. Apply every category-specific and cross-item gate in [Catalog Integrity](./references/catalog-integrity.md).
6. [ ] **Write the item:** Use a compact title and nickname, one clipped italic flavor line, a concrete description, an `**Effect:**` explanation for interactions or exceptions, and an optional `**Binding rationale:**`. Use the FREE//FALL editorial voice: concrete industrial capability, human cost, second person where instruction is useful, and dark humor only when it sharpens the item.
7. [ ] **Audit duplicated facts:** Compare every number and quality repeated in legacy prose with frontmatter. Make frontmatter authoritative and revise prose toward behavior and rationale rather than a second stat block.
8. [ ] **Trace consumers:** Search `content/` for the exact title, filename stem, nickname, and common shorthand. When revising an existing mechanic, recalculate affected rulebook examples, scenario loadouts, conditional bindings, and current Attribute pools; update dependent content only when it is in scope, otherwise report the concrete drift.
9. [ ] **Review presentation constraints:** Confirm the title, nickname, qualities, and stat density remain legible in `GearCard.astro`; confirm the body needs no authored H1 because the category page supplies it. Use explicit absolute site links where needed and plain Markdown without framework components or inline presentation code.
10. [ ] **Validate the entry:** Run every gate in [Catalog Integrity](./references/catalog-integrity.md), inspect the final diff, and run `pnpm --filter @free-fall/app build` and `pnpm --filter @free-fall/app typecheck`. Report any gate not run, pre-existing failure, unresolved rules ambiguity, or dependent-content drift.

## Affirmative Target Architecture

* **Output Format:** One or more kebab-case Markdown files under the appropriate organizational directory in `content/gear/items/`, each containing schema-valid category-discriminated frontmatter and concise prose rendered by the existing category catalog. Related dependent prose is updated only when requested or required to keep changed catalog facts coherent.
* **Structural Anchors:** Use the discriminated union in `apps/free-fall/src/content.config.ts`, mechanics in `content/core-rulebook/chapters/03-core-rules.md` and `04-tools-of-the-trade.md`, current catalog conventions under `content/gear/items/`, the schema forms in [Schemas And Templates](./references/schemas-and-templates.md), and the manual gates in [Catalog Integrity](./references/catalog-integrity.md).

## Post-Execution State Update

At the end of this workflow, write the current execution state to `.agent-state.json` in the workspace root:

```json
{
  "last_active_skill": "gear-content-creator",
  "status": "completed",
  "handoff_required": false,
  "next_recommended_skill": ""
}
```
