# AGENTS.md

FREE//FALL — tabletop RPG delivered as a web-native application

> **Core constraint:** Experimental; prioritize learning velocity and clean architecture over premature optimization.

## Vision

FREE//FALL is an experiment in **publishing tabletop RPGs in a web-native format**. The goal is to reimagine how game rules, concepts, and material are delivered — as if the trappings of traditional formats (the book, the PDF, the page) had never existed.

Everything — content structure, components, navigation, prose — is tested against this vision:

- **The web is the medium, not a viewer for a book.** Content is hypertext, data, and live components: a term registry instead of a glossary page, gear as queryable data instead of stat tables, navigation as a play aid instead of a table of contents.
- **The UI conveys theme; it is an artifact of how games could be delivered in the future.** Not an art project: the game's mood comes through palette, typography, and tone, while the UI itself stays a modern, functional delivery vehicle. The visual language is defined in [`DESIGN.md`](./DESIGN.md) — read it before any visual or UI work.
- **No print nostalgia.** If a convention exists only because paper worked that way — page numbers, appendix letters, fixed spreads — question it. (Filename series prefixes already died this death; more will follow.)

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

We follow the [ASDLC](https://asdlc.io) spec-anchored methodology: **specs capture intent** (living hypotheses of the feature's state — refined by what implementation teaches), **code is the source of truth** for runtime behavior, and **tests verify the code-derived contracts**. GitHub Issues are the delta. A spec is never a BDUF artifact — implementation doesn't invalidate a spec, it *completes* it.

| Artifact | Location | Purpose |
|---|---|---|
| Spec | `specs/{domain}/{feature}/spec.md` | Intent: how the feature is meant to work (state, as a living hypothesis) |
| Spec template | `specs/TEMPLATE.md` | Template for new specs |
| PBI (issue) | GitHub Issues | What to change next (delta) |

**Specs before code** — Every feature has a spec. Create one with `/spec` before implementation.

**Issues before implementation** — Decompose work into GitHub Issues with `/plan`. Each issue is one committable unit of work.

## Personas

Invoke via skill: `/spec`, `/plan`, `/ship`
Definitions: `.claude/skills/`
