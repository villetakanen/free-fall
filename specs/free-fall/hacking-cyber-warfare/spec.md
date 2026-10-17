# Feature: Hacking & Cyber Warfare

## Blueprint

### Context

The Core Rules include hacking Skills and software-supporting gear, but need a playable software chapter. The user-supplied V5 manuscript supplies program management, types, tiers, compromise, defenses, and interface examples. These rules use the current 0.7.x action and Harm systems.

Parent spec: `specs/free-fall/core-rulebook-nav/spec.md`.

### Architecture

- A flat Markdown chapter in `content/core-rulebook/chapters/` follows Tools of the Trade through frontmatter order. Collection-driven navigation and routing discover it automatically.
- `03-core-rules.md` remains authoritative for Action Pool allocation, prerequisites, TNs, modifiers, natural results, and Harm resolution.
- `02-characters-and-crews.md` remains authoritative for Skills and fictionally feasible improvisation.
- Programs are gear: inactive storage has no Binding; activation allocates an action; active software binds Mind; deactivation releases its Binding. Counter and control programs double their tier's base cost.
- The manuscript's natural-1 program compromise applies after resolution, including successful rolls. The program becomes unavailable for the mission and restoration takes post-mission Downtime.
- Control affects declared, limited device functions. The general chapter does not establish unrestricted possession or scenario-specific AI powers.
- The control type retains the name Pwn. RED, STEEL, CHROME, and BLACK retain bonuses of +0, +5, +10, and +15 respectively. A natural 1 can meet the TN after bonuses and still compromise the software after resolution.
- The Ghost Link example uses the existing catalog's Ghost 2 and Load Bearing (6 Mind – Software Only), with arithmetic for software totals of 4 and 8 Mind.
- Registry definitions and links from existing rules make the chapter discoverable. The registry's Near Impossible definition agrees with numeric bonuses and TN 21+.

### Constraints

This is a content migration using existing page and term mechanisms. Specialties become Skills, Dice Pool becomes Action Pool, and the manuscript's 15+/20+/25+ difficulty ladder becomes 11+/16+/21+. Defensive actions use the existing action economy and TN model. Scenario-specific transmission, shielding, and AI software creation belong to scenario content.

## Contract

### Definition of Done

- [x] The chapter builds at its own Core Rules route and appears after Tools of the Trade.
- [x] Hacking follows current prerequisites, TNs, modifiers, success counts, and typed Harm mitigation.
- [x] Program activation, Binding, compromise, four types, tier values, naming, and defenses are runnable from the chapter.
- [x] Limited control remains distinguishable from unrestricted character possession.
- [x] Ghost Link examples agree with catalog values and calculated excess Binding.
- [x] New internal links and term references resolve in generated output.
- [x] `pnpm build`, `pnpm lint`, `pnpm test`, and `pnpm typecheck` pass.

### Regression Guardrails

Existing Core Rules routes and gear values remain stable. Prose is reviewed as content; automated verification targets routes, links, and term resolution rather than exact copy.

### Scenarios

```gherkin
Scenario: Compromise after success
  Given an active program is used for an action
  When the roll includes both a success and a natural 1
  Then its effect resolves and the program becomes Compromised afterward

Scenario: Software load exceeds the slate allowance
  Given a Ghost Link runs software totaling 8 Mind Binding
  When its 6-point software allowance is applied
  Then the remaining software Binding is Mind 2 alongside the slate's Ghost 2

Scenario: Bonus meets a difficult target
  Given a hacking action uses a program with a positive tier bonus
  When a modified die meets TN 21 without a natural 20
  Then that die contributes a success
```
