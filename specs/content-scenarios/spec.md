# Feature: Scenarios Collection

## Blueprint

### Context

FREE//FALL ships playable scenarios (adventures) alongside the rulebook: the demo scenario pitched in the core rulebook's introduction is the first. A scenario is a multi-page document set — an overview plus any number of content pages (acts, locations, NPCs, handouts) — with structured metadata the app can render and filter on: which rules variant and version it targets, how long it runs, and how many players it seats.

Scenarios are not rulebook chapters. They target a specific **rules variant** — the core FREE//FALL rules, a setting variant such as *Al Presa* or *3rd Orleas*, or the SRD — at a specific version, and they evolve on their own cadence. A dedicated content package, `content/scenarios/`, holds them, following the content-workspace pattern established by `content/core-rulebook/` and `content/gear/`.

The first scenario's prose arrives as a Markdown export of an existing Google Doc (work item deferred until the source lands in `./tmp`). This spec defines the structure that will receive it.

Parent spec: `specs/content-workspace/spec.md`

### Architecture

**Package layout**

One folder per scenario inside the shared package. Every scenario folder contains an `index.md` (the overview, carrying the scenario's metadata) and zero or more ordered content pages:

```
content/scenarios/
├── package.json                # name: @free-fall/scenarios, version only — no scripts, no TS
└── {scenario-slug}/
    ├── index.md                # scenario overview + full metadata frontmatter
    ├── 01-{page}.md            # ordered content pages (acts, locations, NPCs…)
    ├── 02-{page}.md
    └── assets/                 # scenario-scoped images
```

Scenario slugs are kebab-case and become URL segments.

**Frontmatter schemas**

Defined in `apps/free-fall/src/content.config.ts`, alongside the existing `core-rulebook` and `gear` collections.

Scenario overview (`index.md`):

```yaml
title: "..."                # display name
synopsis: "..."             # one-paragraph pitch, shown in listings
system:
  variant: "..."            # rules variant: "FREE//FALL", "Al Presa", "3rd Orleas", "SRD", …
  version: "..."            # variant version the scenario is written against, e.g. "7.0.0-alpha"
length: "..."               # estimated play time, e.g. "One-shot, 3–4 hours"
players:
  min: 2
  max: 5
content_warnings: []        # array of strings; defaults to empty
order: 1                    # optional; listing/nav sort order
```

Content pages (all other `.md` files):

```yaml
title: "..."
order: 1                    # sort order within the scenario
```

**Collections**

Two Astro collections load from the shared package, split by filename so each gets strict schema validation:

| Collection | Glob (base `../../content/scenarios`) | Schema |
|---|---|---|
| `scenarios` | `*/index.md` | full scenario metadata (above) |
| `scenario-pages` | `*/*.md` excluding `index.md` | `title` + `order` |

A scenario page's parent scenario is derived from the first segment of its entry id (the folder name).

**Routes**

| Route | Page file | Renders |
|---|---|---|
| `/scenarios/{scenario}/` | `apps/free-fall/src/pages/scenarios/[scenario]/index.astro` | Metadata block (variant + version, length, players, content warnings), `index.md` body, ordered table of contents linking the scenario's pages |
| `/scenarios/{scenario}/{page}/` | `apps/free-fall/src/pages/scenarios/[scenario]/[page].astro` | Page body in BaseLayout |

**Navigation**

`getScenarioNavItems(pathname)` in `apps/free-fall/src/lib/nav.ts`, following the shape of `getGearNavItems`:

- Rail item: icon `map`, label `Scenarios`, href of the first scenario's overview, active on the `/scenarios/` prefix
- One subItem per scenario (its overview URL), sorted by `order` then title
- `BaseLayout.astro` renders the rail item only when at least one scenario exists, so the app builds cleanly while the package is empty

**Wiring**

- `pnpm-workspace.yaml` already globs `content/*`; the new package needs no workspace change
- The HMR watcher in `apps/free-fall/astro.config.ts` adds `../../content/scenarios` alongside the existing chapter and gear watchers

### Constraints

- Term resolution is package-scoped (`specs/content-workspace/term-resolution/spec.md`). Scenario prose renders game terms as plain text; when the scenarios package ships its own `registry.md`, a second `remarkTermResolution` instance is registered in `astro.config.ts` for it.
- Scenario metadata lives in `index.md` frontmatter only. Content pages carry `title` and `order`; everything the app queries about a scenario comes from one place.
- `system.variant` and `system.version` are free-form strings validated as non-empty. The variant list grows with the game; the schema does not enumerate it.

## Contract

### Definition of Done

- [ ] `content/scenarios/package.json` exists with a version and no build tooling
- [ ] `scenarios` and `scenario-pages` collections defined in `apps/free-fall/src/content.config.ts` with the schemas above
- [ ] A scenario's `index.md` missing `system.variant`, `system.version`, `length`, `players`, or `synopsis` fails the build with a schema error
- [ ] `/scenarios/{scenario}/` renders metadata block, overview prose, and an ordered list of the scenario's pages
- [ ] `/scenarios/{scenario}/{page}/` renders each content page
- [ ] Scenarios rail item with per-scenario subItems appears when the package contains at least one scenario
- [ ] The app builds with zero scenarios in the package (rail item absent)
- [ ] Adding a new scenario folder produces its routes and nav entry without code changes
- [ ] HMR watcher covers `content/scenarios/`
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

- Scenario URLs (`/scenarios/{scenario}/…`) must remain stable once a scenario is published
- The `scenarios` collection schema must never accept an entry without variant, version, length, and player count — listings depend on these fields being present
- The app must always build with an empty scenarios package

### Scenarios

```gherkin
Scenario: Scenario overview renders metadata
  Given content/scenarios/demo-job/index.md declares variant "FREE//FALL", version "7.0.0-alpha", length "One-shot, 3–4 hours", players 2–5
  When a user visits /scenarios/demo-job/
  Then the page shows the variant, version, length, and player count
  And the overview prose from index.md
  And links to the scenario's content pages in order

Scenario: Content page renders under its scenario
  Given content/scenarios/demo-job/01-briefing.md with title "The Briefing"
  When a user visits /scenarios/demo-job/01-briefing/
  Then the page body renders in BaseLayout
  And the Scenarios rail item is marked active

Scenario: Incomplete metadata fails the build
  Given a scenario index.md without a system.variant field
  When the build runs
  Then the build fails with a schema validation error naming the file

Scenario: Empty package builds clean
  Given content/scenarios/ contains only package.json
  When the build runs
  Then the build succeeds
  And no Scenarios item appears in the navigation rail

Scenario: New scenario needs no code
  Given a new folder content/scenarios/void-run/ with a valid index.md
  When the build runs
  Then /scenarios/void-run/ exists
  And "Void Run" appears as a subItem under Scenarios in the rail
```
