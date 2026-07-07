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
├── package.json                # name: @free-fall/scenarios — lint script only, no build tooling, no TS (matches sibling packages)
└── {scenario-slug}/
    ├── index.md                # scenario overview + full metadata frontmatter
    ├── {page}.md               # content pages (acts, locations, NPCs…) — plain slugs;
    ├── {page}.md               #   order and grouping come from the contents manifest
    └── assets/                 # scenario-scoped images
```

Scenario slugs are kebab-case and become URL segments.

**Frontmatter schemas**

Defined in `apps/free-fall/src/content.config.ts`, alongside the existing `core-rulebook` and `gear` collections.

Scenario overview (`index.md`):

```yaml
title: "..."                # display name
synopsis: "..."             # one-paragraph pitch; reserved for SEO/description and future listing detail (not rendered in the compact list)
type: "..."                 # scenario format: "Demo (one-shot)", "One-shot", "Mini-campaign", …
system:
  variant: "..."            # rules variant: "FREE//FALL", "Al Presa", "3rd Orleas", "SRD", …
  version: "..."            # variant version the scenario is written against, e.g. "7.0.0-alpha"
length: "..."               # estimated play time, e.g. "3–4 hours"
players:
  min: 2
  max: 5
content_warnings: []        # array of strings; defaults to empty
order: 1                    # optional; listing sort order
contents:                   # optional navigation manifest — see Navigation
  - section: "GM Materials" # section label, free-form
    icon: "menu_book"       # optional Material Symbols name; defaults to menu_book
    pages:                  # page filenames (no extension), in reading order
      - 01-preface
      - 02-the-approach
  - section: "Appendices"
    icon: "bookmarks"
    pages: [a-01-the-story-so-far, b-01-the-vessel]
```

Content pages (all other `.md` files):

```yaml
title: "..."
```

**[DEPRECATED 2026-07-07]** ~~Content pages carry `order` (sort order within the scenario).~~ Ordering moved to the `contents` manifest in `index.md` — declaring page order per page spread the scenario's structure across files, and section membership was inferred from filename prefixes (hidden magic strings). Filenames are now pure slugs with no semantics.

**Collections**

Two Astro collections load from the shared package, split by filename so each gets strict schema validation:

| Collection | Glob (base `../../content/scenarios`) | Schema |
|---|---|---|
| `scenarios` | `*/index.md` | full scenario metadata (above), including the optional `contents` manifest |
| `scenario-pages` | `*/*.md` excluding `index.md` | `title` only |

A scenario page's parent scenario is derived from the first segment of its entry id (the folder name).

**Routes**

| Route | Page file | Renders |
|---|---|---|
| `/scenarios/` | `apps/free-fall/src/pages/scenarios/index.astro` | Compact list of all scenarios — title linking to the overview plus a one-line metadata summary (type, system variant + version, length, players) — sorted by `order` then title; an empty state when the package holds no scenarios |
| `/scenarios/{scenario}/` | `apps/free-fall/src/pages/scenarios/[scenario]/index.astro` | Metadata block (type, variant + version, length, players, content warnings), `index.md` body, table of contents grouped by section linking the scenario's pages |
| `/scenarios/{scenario}/{page}/` | `apps/free-fall/src/pages/scenarios/[scenario]/[page].astro` | Page body in BaseLayout |

**[DEPRECATED 2026-07-07]** ~~`/scenarios/{scenario}/appendices/` — generated appendices index grouped by series letter.~~ Lived one day: it depended on filename-prefix classification, which the `contents` manifest replaced; with uniform section groups in the rail, a separate appendices landing page has no role.

**Navigation**

A scenario is a **subsite**: once the reader is inside one, the rail belongs to *that scenario*, not the whole app. `BaseLayout.astro` chooses the navigation mode from the route.

*Global mode* — every route except a specific scenario (the app pages, and the `/scenarios/` listing itself). The rail carries the app-wide items, scenarios among them:

- `getScenarioNavItems(pathname)` in `apps/free-fall/src/lib/nav.ts`, shaped like `getGearNavItems`: rail item icon `map`, label `Scenarios`, href `/scenarios/`, active on the `/scenarios/` prefix — always rendered; one subItem per scenario (its overview URL), sorted by `order` then title; empty when the package holds no scenarios.

*Scenario mode* — any route matching `/scenarios/{scenario}/…` (deeper than the listing). The rail is replaced by `getScenarioSubsiteNav(slug, pathname)`, scoped to that scenario:

- An **uplink** first item — icon `arrow_back`, label `All Scenarios`, href `/scenarios/`, `variant: "uplink"` (muted + separator, so the exit is discernible from the chapters) — the way back out to the global site.
- The scenario **Overview** — the scenario's own title, icon `map`, href `/scenarios/{slug}/`.
- One **group per section** of the scenario's contents (see below) — anchored on the section's first page (top-level tray items must be links, issue #42), icon from the manifest (default `menu_book`), with one sub-link per page in declared order.

  **[DEPRECATED 2026-07-06]** ~~One top-level item per body page; appendices reached through the overview's table of contents only.~~ Revised same day: with body pages as top-level items the rail mixed levels (chapters as siblings of the Overview).

  **[DEPRECATED 2026-07-06]** ~~Hardcoded GM Materials group + Appendices item linking a generated appendices index.~~ Superseded next day by the `contents` manifest: section names and membership are the author's, not the code's.

**Scenario contents** — a scenario's structure is declared, not inferred. `getScenarioContents(slug)` in `apps/free-fall/src/lib/nav.ts` resolves it:

- The optional `contents` manifest in `index.md` frontmatter defines sections and page order, exactly as declared. Section labels are free-form — chapters name themselves (*GM Materials*, *Backstory*, *Characters*…).
- Pages on disk not listed in the manifest collect into a trailing **Assorted** section, alphabetical by filename. A scenario without a manifest is the degenerate case: every page unlisted, one alphabetical group. Drafts flow, structure is added when the scenario earns it.
- A manifest entry naming a page that does not exist fails the build (that is a typo, not a workflow).
- Filenames are pure slugs: they carry no ordering or classification semantics.

  **[DEPRECATED 2026-07-07]** ~~Page classification by filename prefix: leading digit = body page, leading letter = appendix.~~ Hidden magic strings; replaced by the explicit manifest.

Both the scoped rail and the overview's table of contents render from `getScenarioContents()`, so the two cannot diverge.

**Design-system dependency** — the scoped rail composes existing tray primitives. The uplink is a `TrayButton` with `variant="uplink"` (`arrow_back` icon, muted + separator) per `specs/design-system/tray-button/spec.md`; all other items are default `TrayButton`s. The tray itself is context-agnostic; scoped-vs-global selection lives in `BaseLayout.astro`, not the tray.

**Wiring**

- `pnpm-workspace.yaml` already globs `content/*`; the new package needs no workspace change
- The HMR watcher in `apps/free-fall/astro.config.ts` adds `../../content/scenarios` alongside the existing chapter and gear watchers

### Constraints

- Scenarios introduce no terms of their own. A scenario's `:term[]` directives resolve against the registry of its target rules variant+version (`specs/content-workspace/term-resolution/spec.md`): the scenarios package has no `registry.md`, and its `remarkTermResolution` instance in `astro.config.ts` points `registryPath` at the parent variant's registry — initially `content/core-rulebook/chapters/registry.md`, with term links resolving to `/core-rulebook/registry/#slug`. When scenarios target multiple variants, registry selection follows `system.variant`.
- Scenario metadata — including the navigation structure (`contents`) — lives in `index.md` frontmatter only. Content pages carry `title`; everything the app queries about a scenario comes from one place.
- `system.variant`, `system.version`, and `type` are free-form strings validated as non-empty. The variant and type vocabularies grow with the game; the schema does not enumerate them. `type` classifies the format — a *Demo* ships with ready-made characters and runs out of the box; duration belongs in `length`.
- All relative Markdown links in scenario prose rewrite to the parent variant's base path (`/core-rulebook/`) — the `rehypeContentUrlRewrite` instance for `/content/scenarios/` shares the term-link configuration. Links between a scenario's own pages use absolute `/scenarios/{scenario}/{page}/` paths. *(Discovered during #39: the rewrite plugin's `basePath` is static per instance.)*

## Contract

### Definition of Done

- [x] `content/scenarios/package.json` exists with a version and no build tooling
- [x] `scenarios` and `scenario-pages` collections defined in `apps/free-fall/src/content.config.ts` with the schemas above
- [x] A scenario's `index.md` missing `type`, `system.variant`, `system.version`, `length`, `players`, or `synopsis` fails the build with a schema error
- [x] `/scenarios/{scenario}/` renders metadata block, overview prose, and an ordered list of the scenario's pages
- [x] `/scenarios/{scenario}/{page}/` renders each content page
- [x] `/scenarios/` lists all scenarios as a compact list (title + metadata line), and renders an empty state when the package holds none
- [x] In global mode the Scenarios rail item is always present, linking to `/scenarios/`, with one subItem per scenario
- [x] The app builds with zero scenarios in the package
- [x] Adding a new scenario folder produces its routes and nav entry without code changes
- [ ] Every route under `/scenarios/{scenario}/` (overview and content pages) renders the rail in scenario mode: uplink `All Scenarios` → `/scenarios/` (variant `uplink`), an Overview item → `/scenarios/{scenario}/`, and one group per section with sub-links per page in manifest order
- [ ] Pages not listed in the `contents` manifest render in a trailing "Assorted" section, alphabetical by filename; a scenario without a manifest renders all pages that way
- [ ] A `contents` entry naming a nonexistent page fails the build with an error naming the scenario, section, and page
- [ ] A scenario-mode rail contains none of the global app items (Home, Core Rules, Gear, Scenarios listing)
- [ ] Routes outside a scenario subsite, including the `/scenarios/` listing, render the global-mode rail
- [ ] The scenario-mode rail's body pages appear in the same order as in the overview's table of contents (both from `getScenarioPages()` in `nav.ts`)
- [ ] The rail item matching the current route is marked active in scenario mode
- [x] `astro.config.ts` registers a `remarkTermResolution` instance for `/content/scenarios/` with `registryPath` set to `content/core-rulebook/chapters/registry.md`, and term links from scenario pages resolve to `/core-rulebook/registry/#slug`
- [x] HMR watcher covers `content/scenarios/`
- [x] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

- URL continuity is a redirect concern, not a filename freeze: when a URL worth preserving changes, add an entry to Astro's `redirects` in `apps/free-fall/astro.config.ts` (or the deploy platform's equivalent). Slugs and filenames may change freely. Pre-1.0 (no official domain, semver 0.x) no URL continuity is promised at all.

  **[DEPRECATED 2026-07-07]** ~~Scenario URLs (`/scenarios/{scenario}/…`) must remain stable once a scenario is published.~~ Freezing filenames to preserve links was the wrong mechanism — redirects do that job without constraining content.
- The `scenarios` collection schema must never accept an entry without variant, version, length, and player count — listings depend on these fields being present
- The app must always build with an empty scenarios package
- A scenario-mode rail must always include the uplink to `/scenarios/` — a subsite must never be a dead end with no route back to the global site
- The scenario-mode rail and the overview table of contents must never diverge in sections or ordering — both derive from `getScenarioContents()` in `nav.ts`
- Filenames must never regain navigation semantics — structure is declared in the `contents` manifest, or absent

### Scenarios

```gherkin
Scenario: Scenario overview renders metadata
  Given content/scenarios/demo-job/index.md declares variant "FREE//FALL", version "7.0.0-alpha", length "One-shot, 3–4 hours", players 2–5
  When a user visits /scenarios/demo-job/
  Then the page shows the variant, version, length, and player count
  And the overview prose from index.md
  And links to the scenario's content pages in order

Scenario: Content page renders under its scenario in scenario mode
  Given content/scenarios/demo-job/01-briefing.md with title "The Briefing"
  When a user visits /scenarios/demo-job/01-briefing/
  Then the page body renders in BaseLayout
  And the rail is in scenario mode, scoped to demo-job
  And the "The Briefing" rail item is marked active

Scenario: Scenario overview is in scenario mode
  Given content/scenarios/demo-job/index.md declares contents sections "GM Materials" and "Backstory"
  When a user visits /scenarios/demo-job/
  Then the rail shows the uplink "All Scenarios" linking to /scenarios/
  And an Overview item linking to /scenarios/demo-job/, marked active
  And a group per declared section with sub-links per page in manifest order
  And none of the global items (Home, Core Rules, Gear) appear

Scenario: Uplink returns to the global site
  Given a user is on /scenarios/demo-job/02-the-approach/
  When the user activates the "All Scenarios" uplink
  Then they arrive at /scenarios/
  And the rail is in global mode

Scenario: The listing stays in global mode
  When a user visits /scenarios/
  Then the rail shows the global app items
  And the Scenarios item is marked active

Scenario: Unlisted pages collect into Assorted
  Given content/scenarios/demo-job/ has a page notes.md not listed in the contents manifest
  When the build runs
  Then the rail and overview TOC show an "Assorted" section after the declared sections
  And notes.md is listed there

Scenario: No manifest, alphabetical listing
  Given a scenario index.md without a contents field
  When the build runs
  Then all pages render in one group, alphabetical by filename

Scenario: Manifest typo fails the build
  Given a contents section lists a page "02-the-aproach" that does not exist
  When the build runs
  Then the build fails naming the scenario, the section, and the unknown page

Scenario: Scoped rail and overview contents agree
  Given content/scenarios/demo-job/ declares a contents manifest
  When a user visits the overview and any content page
  Then the sections and page order in the scenario-mode rail match the overview's table of contents

Scenario: Incomplete metadata fails the build
  Given a scenario index.md without a system.variant field
  When the build runs
  Then the build fails with a schema validation error naming the file

Scenario: Empty package builds clean with an empty listing
  Given content/scenarios/ contains only package.json
  When the build runs
  Then the build succeeds
  And the Scenarios rail item links to /scenarios/
  And /scenarios/ renders an empty state with no scenario links

Scenario: New scenario needs no code
  Given a new folder content/scenarios/void-run/ with a valid index.md
  When the build runs
  Then /scenarios/void-run/ exists
  And "Void Run" appears as a subItem under Scenarios in the rail

Scenario: Scenario terms resolve to the parent variant's registry
  Given content/core-rulebook/chapte
  rs/registry.md contains <dfn id="action-pool">
  And a scenario page contains :term[Action Pool]
  When the build runs
  Then the rendered link points to /core-rulebook/registry/#action-pool

Scenario: Scenario term missing from the parent registry fails the build
  Given a scenario page contains :term[Imaginary Rule]
  And no <dfn id="imaginary-rule"> exists in the parent variant's registry
  When the build runs
  Then the build fails identifying the file and the unresolved term
```
