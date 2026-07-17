# Scenario Repository Contract

Use this reference as a checklist, then confirm it against the named source files because code and specs may evolve.

## Sources Of Truth

Read these in order when instructions conflict:

1. `AGENTS.md`
2. The user's current brief
3. `DESIGN.md`
4. `specs/content-scenarios/spec.md`
5. `apps/free-fall/src/content.config.ts`
6. Current rules in `content/core-rulebook/chapters/`
7. Current catalog entries in `content/gear/items/`
8. Existing scenario content as calibration, not authority

`content/scenarios/northern-lights/` is the initial scenario and the closest style example. It is incomplete and contains legacy appendix references, numeric character filename prefixes, references to unwritten scenes, and possible catalog drift. Preserve its strongest play patterns; do not reproduce its stale conventions.

## Package Shape

```text
content/scenarios/{scenario-slug}/
|-- index.md
|-- {page-slug}.md
`-- assets/                 # only when scenario-scoped assets are required
```

- Use a kebab-case scenario folder and plain kebab-case page slugs.
- Keep Markdown pages one level below the scenario folder. The current loader does not publish nested page directories.
- Treat every immediate non-index Markdown file as public and routable.
- Put all queryable scenario metadata and navigation structure in `index.md`.
- Give every page `title` frontmatter and an authored H1; the renderer does not generate the H1.
- Declare navigation order and grouping through `contents`, not filename prefixes.
- Add every intentional page to `contents`. An omitted file appears publicly under `Assorted`; it is not a private draft.
- List manifest page names without `.md`.
- Use a valid Material Symbols Sharp name when a section icon carries useful information; omit `icon` to accept the default.

## Overview Frontmatter

```yaml
---
title: "Scenario Name"
synopsis: "A one-paragraph player-facing pitch."
type: "One-shot"
system:
  variant: "FREE//FALL"
  version: "0.7.x"
length: "3-5 hours"
players:
  min: 3
  max: 5
content_warnings:
  - "Violence"
order: 2
contents:
  - section: "Run the Job"
    pages:
      - briefing
      - first-contact
  - section: "Crew"
    icon: "groups"
    pages:
      - the-pilot
---
```

Verify that `players.min <= players.max`, section names and page entries are unique, each declared page exists, and every on-disk page is intentionally listed. The schema does not enforce all of these invariants.

## Links And Terms

- Write scenario-local links as absolute paths: `[First Contact](/scenarios/{scenario-slug}/first-contact/)`.
- Use relative Markdown links only for the parent core-rulebook content they are intended to target. Current scenario rewriting sends relative links to `/core-rulebook/`.
- Replace print references such as `Appendix A.02`, page numbers, and arbitrary numbering with named links or unambiguous names.
- Confirm every `:term[Label]` against an explicit `<dfn id="...">` in `content/core-rulebook/chapters/registry.md`.
- Treat current term resolution and relative-link rewriting as hardcoded to the core FREE//FALL rulebook. Hand off multi-variant behavior changes to `/spec`.

## Voice And Delivery

- Use second person and present tense for table instruction.
- Keep prose clipped, concrete, and confident; use dark humor where it sharpens play.
- Keep editorial prose readable and reserve mono/data presentation for stats, labels, calculations, and diegetic machine speech.
- Put diegetic transmissions in content and plain language in UI-facing metadata.
- Use structure as a play aid: quick-reference sections, explicit transitions, visible tradeoffs, and named links beat book-like sequence markers.
- Use raw callout markup only when the information must not be missed and follow the existing callout structure in `content/scenarios/northern-lights/preface.md`.
- Treat GM-only warnings as reader guidance, not access control. All routes remain public.

## Playability Gates

- The opening gives the table an immediate situation and a decision.
- Each scene states what begins it and what moves play onward.
- Listed approaches have genuine advantages, honest costs, and downstream consequences.
- The GM has enough hidden logic to answer reasonable player questions without forcing a path.
- Unlisted approaches can be adjudicated from established pressures and facts.
- Information asymmetry is explicit: identify what each faction and character knows, assumes, and wants.
- Reversals emerge from established choices, competence, or facts rather than GM fiat.
- Clocks and constraints can change play and are not decorative lore.
- Every pregen has scenario-specific mechanical and thematic work.
- The ending supports consequences of player choices rather than requiring one outcome.

## Mechanical Integrity Gates

- Match classes, skills, and core procedures to current rulebook prose.
- Match gear title, category, DV, AV, qualities, binding, pilot binding, hardpoints, and other capabilities to current files under `content/gear/items/`.
- Recompute each character's bound and current Body, Mind, and Ghost pools from initial attributes and loadout.
- Distinguish normal and conditional values such as piloted EXO bindings.
- Label scenario-local or modified gear explicitly rather than presenting it as catalog-identical.
- Treat fenced YAML stat blocks in scenario prose as unvalidated prose; inspect every field manually.
- Check scenario `system.version` against the actual rules package version or the user-approved compatibility range.

## Validation Gates

1. Confirm frontmatter matches `apps/free-fall/src/content.config.ts`.
2. Confirm folder and page slugs are kebab-case and flat.
3. Compare `contents` against all immediate scenario Markdown pages.
4. Search changed prose for stale scene, appendix, page-number, and plain-text cross-references.
5. Confirm absolute scenario links and registered term directives.
6. Recheck every copied mechanic and all arithmetic against source data.
7. Read the scenario in manifest order and trace continuity, clocks, and consequences.
8. Run `pnpm --filter @free-fall/app build`.
9. Run `pnpm --filter @free-fall/app typecheck` when raw HTML or presentation primitives changed.
10. Inspect `git diff` and report validation results and residual content risks.

The app build is the critical automated gate: it exercises collection schemas, routes, manifest references, and term resolution. Biome does not currently provide substantive Markdown prose validation.
