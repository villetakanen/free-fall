# FREE//FALL — Project Review & Continuation Plan

**Date:** 2026-07-05
**Reviewer:** Claude (Fable 5)
**Branch reviewed:** `dev` (in sync with `origin/main` via PR #38)

---

## 1. Executive summary

The project is in a **healthy but dormant alpha state**. The last commit on `dev` landed 2026-03-13 — nearly four months ago. Everything is green: `pnpm build`, `pnpm typecheck`, and `pnpm test` all pass cleanly (47 unit tests across 3 files). The spec-driven workflow (specs → GitHub Issues → micro-commits) is well established and the artifact trail is unusually coherent for a solo project.

The biggest immediate finding: **the two open GitHub issues (#23, #24 — term resolution) are already implemented, tested, and wired into the Astro pipeline, but were never closed.** The backlog is effectively empty. (`main` initially appeared 65 commits stale, but that was only the local branch — remote `main` was already synced via PR #38 and local `main` has been fast-forwarded during this review.) The project's paper state lags its real state — the cheapest wins are bookkeeping, then new feature work.

---

## 2. Current state

### What exists and works

| Area | State |
|---|---|
| **Platform** | pnpm monorepo, Astro SSG, Biome, Vitest, Playwright, Lefthook. All toolchain commands pass. |
| **Core rulebook** | 7 chapters (~1,045 lines) in `content/core-rulebook/chapters/`, rendered at `/core-rulebook/[id]/` with collection-driven nav. |
| **Gear catalog** | 34 items across 5 categories in `content/gear/`, discriminated-union schema, rendered as GearCards at `/gear/[category]/`. |
| **Design system** | 11 Astro components (AppShell, AppBar, AppTray, GearCard, StatCircle, tray family…), 7 foundation stylesheets, dedicated docs app with 13 showcase pages. |
| **Term resolution** | `remark-term-resolution` plugin (9 unit tests) + `rehype-content-url-rewrite` (10 tests), both registered in `astro.config.ts`. Registry migrated to `<dfn>` format (23 terms); `:term[]` directives in use in chapters 02 and system-reference. |
| **CSS architecture** | ADR-2026-03-11 migration is **complete**: component styles inlined and scoped, `app-shell.css` deleted, element styles scoped under `main`/prose, TS token layer deleted (`src/tokens/` is gone). |

### Recent work arc (March 2026)

The last burst of work was the gear-card visual push: `EquipmentCard` → `GearCard` rename, lifted binding props, image support with 16:9 zone and shader overlay, binding row moved to the card's bottom border. The spec (`specs/design-system/gear-card/spec.md`) was kept aligned with the API as it evolved. This work is committed and merged to `main` via PR #38.

### Hygiene gaps found

1. **Issues #23 and #24 are open but done.** Plugin, tests, registry migration, and pipeline wiring all verified in the working tree. Close them (or verify DoD checkboxes first, then close).
2. **Orphaned code:** `apps/free-fall/src/pages/rules/[...slug].astro` still builds a `/rules/getting-started/` page from `src/content/rules/getting-started.md`, but nothing links to it. Either it's the intended "getting started" entry point (then link it) or legacy (then delete route + content + the `content-url-rewrite` assumptions that may depend on it — check before deleting).
3. **Landing page spec drift:** spec calls for `hero`, `features`/`alpha-status` blocks; only `hero.md` and `intro.md` exist. Either add the missing block or amend the spec — the DoD checklist is unmarked either way.
4. **Spec DoD tracking is inconsistent.** Most specs have unmarked checklists even where the work is demonstrably done (app-layout, site-content, content-workspace). Low-cost fix that keeps "specs as source of truth" honest.
5. **Test coverage is thin outside StatCircle.** 1 of 11 design-system components has unit tests; 5 e2e files are mostly smoke/responsive. GearCard — the most complex component, freshly churned — has zero tests. `lib/nav.ts` helpers are untested.

---

## 3. Scenarios for continuation

Four plausible directions, in recommended order. A and B are sequential prerequisites; C and D are the real fork in the road.

### Scenario A — Consolidate & release (recommended first, ~1 session)

Close the paper-vs-reality gap and cut a release so the four months of `dev` work is landed.

- Verify DoD for issues #23/#24 against the specs, tick checkboxes, close both issues.
- Sweep spec DoD checklists across app-layout, site-content, content-workspace, landing-page; amend the landing-page spec or add the missing block.
- Resolve the orphaned `/rules/` route (link or delete — decision needed).
- Tag a release, e.g. `7.0.0-alpha.2` (or whatever the versioning scheme dictates — `content/core-rulebook/package.json` drives the VersionInfo badge).
- Optional: raise ADR-2026-03-11 and ADR-002 from *Proposed* to *Accepted* — they're implemented.

**Why first:** the backlog is currently misleading, and a clean baseline makes the C/D fork an unencumbered choice.

### Scenario B — Test hardening (~1–2 sessions)

The gear-card work was heavily iterated with no test safety net. Before more visual churn:

- Unit tests for `GearCard` (prop → rendered structure: binding row, image zone, qualities, category stats) mirroring the StatCircle test suite pattern.
- Unit tests for `lib/nav.ts` (`getCoreRulebookNavItems`, `getGearNavItems` — sorting, category filtering, route mapping).
- One e2e for the gear catalog page (cards render, modal/expand works, nav submenu correct).
- Build-time check that landing-page content blocks exist (ADR-001 flags this as a known negative consequence — a tiny Vitest that asserts the files exist would close it).

### Scenario C — Content push toward a playable rulebook (the "game" track)

The rulebook is ~5 chapters of core material. What a playable alpha still lacks, judging from the chapter inventory and the V5 source doc:

- **Character creation walkthrough / character sheet reference** — chapter 02 covers characters and crews, but there's no printable/interactive sheet.
- **GM section**: running jobs/heists, opposition, threat clocks — nothing in `chapters/` covers the GM side.
- **Term coverage**: only 2 of 7 chapters use `:term[]` directives; sweeping chapters 00–04 for registry terms would exercise the new pipeline and make the glossary genuinely useful.
- **Gear images**: GearCard now supports images with a 16:9 zone and shader overlay, but item frontmatter presumably lacks art. Even placeholder art for one category would validate the pipeline end-to-end.

### Scenario D — Interactive tooling (the "web-native" track)

This is where the project's stated identity ("tabletop RPG delivered as a web-native application") stops being static content. Candidates, in order of leverage:

1. **Dice roller island** — small, self-contained, and the memory-documented threshold case where a Svelte island *is* justified (genuinely reactive state). Would establish the island pattern properly after the app-tray lesson.
2. **Character sheet** — the flagship. Needs a spec first (`/spec`), plus decisions on persistence (localStorage vs. nothing vs. backend — backend would violate the current SSG-only architecture, so likely localStorage first).
3. **Gear picker / loadout builder** — composes the existing gear collection + StatCircle binding visuals into an interactive tool; high flavor-to-effort ratio since the data and cards already exist.

**Recommendation:** dice roller first as the pattern-proving slice, then spec the character sheet.

---

## 4. Proposed next steps (concrete)

1. **Now:** Scenario A in one sitting — close #23/#24, sweep DoDs, decide the `/rules/` route question, tag a release.
2. **Next session:** Scenario B's GearCard + nav tests (small, mechanical, high protection value).
3. **Then choose the fork:** run `/spec` for either the GM chapter (Scenario C) or the dice-roller island (Scenario D), and `/plan` it into issues. Both are good; D differentiates the project, C makes it playable. If play-testing with real people is on the horizon, C wins; otherwise D.

### Open questions for the maintainer

- Is `/rules/getting-started` intentional (future onboarding page) or legacy?
- Should the landing page get its `alpha-status`/`features` blocks, or should the spec be trimmed to match reality?
- What's the release cadence intent for `main` — deploy branch, or just stable checkpoint?
- Is there art direction (or an art pipeline) for gear images, or should the image zone stay dormant for now?

---

## 5. Health snapshot (verified 2026-07-05)

```
pnpm typecheck   ✓  0 errors (both apps)
pnpm test        ✓  47 tests, 3 files (19 app + 28 design-system)
pnpm build       ✓  15 pages built
git status       ✓  clean on dev
open issues      2  (#23, #24 — both already implemented)
open PRs         0
```
