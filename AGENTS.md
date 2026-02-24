# AGENTS.md

FREE//FALL — tabletop RPG delivered as a web-native application

> **Core constraint:** Experimental; prioritize learning velocity and clean architecture over premature optimization.

## Toolchain

_No toolchain configured yet. Update this table as tools are added._

| Action | Command | Authority |
|---|---|---|
| Build | TBD | — |
| Test | TBD | — |
| Lint | TBD | — |

## Judgment Boundaries

**NEVER**
- Commit secrets, tokens, or `.env` files
- Add external dependencies without discussion
- Guess on ambiguous specs — stop and ask

**ASK**
- Before adding new dependencies
- Before creating new top-level directories or establishing architectural patterns
- Before deleting files or reverting changes

**ALWAYS**
- Explain your plan before writing code
- Handle errors explicitly — never swallow exceptions silently
- Prefer simple, readable code over clever abstractions

## Personas

Invoke via skill: `/spec`
Definitions: `.claude/skills/`
