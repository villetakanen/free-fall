---
name: scenario-content-creator
description: Create or revise FREE//FALL playable scenario content in content/scenarios/, including overviews, scenes, GM references, handouts, scenario gear, and pregenerated characters. Load this skill whenever the user asks to write, expand, restructure, or audit an adventure, one-shot, mission, encounter sequence, or other scenario-level material. Use /spec instead for scenario platform, schema, routing, or component behavior.
---

# Scenario Content Creator Skill

Create table-ready, web-native FREE//FALL scenarios whose choices, mechanics, characters, and navigation form one playable structure.

## Symmetrical Boundaries

* **Active Range:** Begin when the user provides a scenario premise or requests creation, revision, expansion, or playability review of Markdown under `content/scenarios/{scenario-slug}/`; own the scenario's overview, scenes, GM references, handouts, local gear descriptions, and pregenerated characters.
* **Handoff Target:** Stop when the requested scenario pages are coherent, manifest-integrated, mechanically checked, and validated by the app build. Route changes to collection schemas, routes, navigation, remark/rehype behavior, or design-system components to `/spec`, then `/plan`; route a completed content changeset to `/ship` only when the user asks to commit and push.

## Steps to Execute

1. [ ] **Establish the brief:** Identify the target rules variant and version, scenario format, player range, run time, content boundaries, intended experience, and requested deliverables. Ask one focused question when a missing answer would materially change the scenario; preserve explicit user decisions as constraints.
2. [ ] **Read current authority:** Read `AGENTS.md`, `DESIGN.md`, `specs/content-scenarios/spec.md`, `apps/free-fall/src/content.config.ts`, the target scenario files, and the rules and gear entries used by the scenario. Use `content/scenarios/northern-lights/` as tonal and structural calibration while accounting for the exceptions listed in [Repository Contract](./references/repository-contract.md).
3. [ ] **Model the playable spine:** State the job, immediate pressure, player-facing objective, hidden truth, escalating reversals, climax, and possible aftermath. For every scene, identify its opening situation, meaningful decisions, information changes, costs, downstream consequences, character spotlights, and exit condition.
4. [ ] **Map the web structure:** Choose plain kebab-case page slugs and declare section membership and order in `index.md` frontmatter. Keep navigation useful during play, make every published page purposeful, and use the applicable patterns in [Page Patterns](./references/page-patterns.md).
5. [ ] **Author for table use:** Write second-person, present-tense, clipped editorial prose. Lead scenes with actionable situations, separate player-facing material from GM truth, supply concise read-aloud language where it helps, and make alternatives expandable rather than exhaustive. Make early player choices alter later information, position, resources, relationships, or opposition.
6. [ ] **Bind content to mechanics:** Resolve rules language against `content/core-rulebook/chapters/registry.md`; verify classes, skills, target numbers, gear names, qualities, damage and armor values, bindings, and pool arithmetic against current rule and gear sources. Recalculate duplicated values instead of trusting existing scenario prose.
7. [ ] **Integrate characters:** Give every pregen a distinct reason to advocate for different choices, at least one mechanical spotlight, at least one thematic pressure point, and a later payoff. Preserve player agency: secrets, compromises, and hooks create decisions rather than prescribing betrayal or outcomes.
8. [ ] **Audit continuity and usability:** Trace facts, clocks, locations, factions, secrets, resources, and consequences from overview through aftermath. Replace stale print-oriented references with descriptive text or absolute scenario links, confirm GM-only labels are clear, and ensure the scenario remains runnable when players invent an unlisted approach.
9. [ ] **Validate the package:** Apply every gate in [Repository Contract](./references/repository-contract.md), inspect the final diff, and run `pnpm --filter @free-fall/app build`. Run `pnpm --filter @free-fall/app typecheck` when content uses raw HTML or presentation primitives; report any validation not run or any pre-existing failure.

## Affirmative Target Architecture

* **Output Format:** An edited or newly created `content/scenarios/{scenario-slug}/` package with one metadata-bearing `index.md`, flat Markdown content pages, and an explicit `contents` manifest once page order matters. Each page is playable on its own route and useful from the scenario-scoped rail.
* **Structural Anchors:** Use the schemas in `apps/free-fall/src/content.config.ts`, the behavior in `specs/content-scenarios/spec.md`, `:term[Registered Term]` for registry-backed rules terms, absolute `/scenarios/{scenario-slug}/{page-slug}/` links between scenario pages, current catalog data under `content/gear/items/`, and the templates in [Page Patterns](./references/page-patterns.md).

## Post-Execution State Update

At the end of this workflow, write the current execution state to `.agent-state.json` in the workspace root:

```json
{
  "last_active_skill": "scenario-content-creator",
  "status": "completed",
  "handoff_required": false,
  "next_recommended_skill": ""
}
```
