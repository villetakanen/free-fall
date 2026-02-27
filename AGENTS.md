# AGENTS.md

FREE//FALL — tabletop RPG delivered as a web-native application

> **Core constraint:** Experimental; prioritize learning velocity and clean architecture over premature optimization.

## Toolchain

| Action | Command | Notes |
|---|---|---|
| Install | `pnpm install` | From repo root |
| Build | `pnpm build` | Builds all apps via pnpm -r |
| Lint | `pnpm lint` | Biome check across all packages |
| Format | `pnpm format` | Biome auto-fix |
| Typecheck | `pnpm typecheck` | Root tsc + astro check per app |
| Test | `pnpm test` | Vitest across all packages |
| E2E | `pnpm test:e2e` | Playwright against built dist/ |
| Dev (all) | `pnpm dev` | Both apps in parallel |
| Dev (free-fall) | `pnpm --filter @free-fall/app dev` | Port 4321 |
| Dev (design-system) | `pnpm --filter @free-fall/design-system-docs dev` | Port 4322 |

**Always use `pnpm` — never use `npm` or `npx` when `pnpm` or `pnpm exec` can do the job.**

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

## Workflow

Specs are the permanent source of truth. GitHub Issues are the delta.

| Artifact | Location | Purpose |
|---|---|---|
| Spec | `specs/{domain}/{feature}/spec.md` | How the system works (state) |
| Spec template | `specs/TEMPLATE.md` | Template for new specs |
| PBI (issue) | GitHub Issues | What to change next (delta) |

**Specs before code** — Every feature has a spec. Create one with `/spec` before implementation.

**Issues before implementation** — Decompose work into GitHub Issues with `/plan`. Each issue is one committable unit of work.

## Personas

Invoke via skill: `/spec`
Definitions: `.claude/skills/`
