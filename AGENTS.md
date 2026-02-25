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
| Dev (free-fall) | `pnpm --filter @free-fall/app dev` | Astro dev server |
| Dev (design-system) | `pnpm --filter @free-fall/design-system-docs dev` | DS docs dev server |

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

## Personas

Invoke via skill: `/spec`
Definitions: `.claude/skills/`
