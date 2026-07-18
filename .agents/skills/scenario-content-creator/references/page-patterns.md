# Scenario Page Patterns

Choose only the patterns the scenario needs. Section names are free-form, and page types do not determine filenames.

## Overview

Use `index.md` to orient both players and the GM.

```markdown
---
title: "Scenario Name"
synopsis: "Player-facing premise and pressure."
type: "One-shot"
system:
  variant: "FREE//FALL"
  version: "0.7.x"
length: "3-5 hours"
players:
  min: 3
  max: 5
content_warnings: []
contents:
  - section: "Run the Job"
    pages: [briefing, approach, breach]
---

# SCENARIO NAME

An optional short diegetic brief.

## What This Is

The playable promise and core pressure.

## Who It Is For

Player and GM expectations, including required prep.

## The Job

The objective, stakes, and first decision.
```

Keep the synopsis player-facing. Place spoilers and hidden causality in GM pages.

## Scene

Build a scene around decisions and state changes rather than a predetermined plot beat.

```markdown
---
title: "Scene: Descriptive Name"
---

# Descriptive Name

Open with the immediate situation. State what starts the scene and what moves play onward.

> **"A concise line the GM can say aloud."**

## The Situation

What the characters perceive, what is pressing now, and what remains uncertain.

## Approaches

Describe likely approaches as examples. For each, state what it buys, what it costs, and what changes later.

## What Is Really Happening

Give the GM the hidden logic needed to extrapolate when players invent another approach.

## Character Pressure

Connect pregens, relationships, gear, and abilities to competing choices.

## Move On When

State the changed situation and link the next useful page by name.
```

A strong scene usually follows: situation, approaches, hidden implications, character pressure, consequences, transition. Compress or reorder that sequence when table use improves.

## GM Reference

Use for backstory, factions, timelines, locations, and hidden systems.

- State whether the page is canonical for this scenario or adjustable support.
- Put table-facing facts before deep explanation.
- Use timelines and compact matrices when lookup speed matters.
- Track each faction's objective, knowledge, false assumptions, resources, and trigger for action.
- Explain enough causal logic that the GM can answer deviations without memorizing lore.
- Separate fixed load-bearing facts from names, details, and motives the GM can replace.

## Pregen

Pregens are scenario mechanisms, not generic sample characters.

```markdown
---
title: "The Role"
---

# The Role

| Callsign | Origin | Age | Sex |
|---|---|---|---|
| Name | Place | 00 | X |

Identity, competence, and relationship to this job.

## Sheet

- **Class:** Class (Skill: Skill)
- **Initial Attributes:** Mind 0, Ghost 0, Body 0
- **Gear Loadout:** Current catalog names and values
- **Calculations:** Explicit binding arithmetic
- **Current Pool:** Explicit Body, Mind, and Ghost results

## In This Scenario

- A decision this character has reason to influence.
- A mechanical spotlight only this character handles cleanly.
- A thematic vulnerability or contradiction that the scenario pressures.
- A later payoff established before it matters.

## Hooks

- A concise unresolved detail the player can own.
```

Give the player leverage and difficult choices. A secret may create temptation or safety; it does not command betrayal.

## Scenario Gear Or Vessel

- Start with why the object matters in play.
- Separate fictional description from table-facing capabilities.
- Cite or match catalog gear when an entry exists.
- Label bespoke changes and scenario-only capabilities.
- Explain bindings, crew requirements, hardpoints, and conditional values.
- Treat embedded YAML as a readable stat presentation, not validated collection data.
- Connect capabilities to actual scene decisions and consequences.

## Handout

- Write only information the recipient can perceive or is meant to believe.
- Make the handout actionable: a choice, leverage, uncertainty, or changed objective.
- Identify delivery timing and recipient in the GM page that invokes it.
- Keep secret instructions permissive; preserve the player's authority over their character.
- Assume the route is publicly accessible even when the fiction calls the handout secret.

## Continuity Pass

After drafting, make a compact state trace for private working use:

| Beat | New information | Choice | Cost | State carried forward | Spotlight |
|---|---|---|---|---|---|
| Opening | What changes | What players decide | What it spends | What later pages must honor | Who matters |

Use the trace to revise the published pages, then remove private notes from the scenario folder. Private working files placed beside scenario Markdown become public routes.
