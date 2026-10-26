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
| `/scenarios/{scenario}/` | `apps/free-fall/src/pages/scenarios/[scenario]/index.astro` | Metadata aside (type, variant + version, length, players, content warnings) riding the content grid's `content-side` column beside the prose — never above the heading; inline-strip fallback when the side column is not engaged. Then `index.md` body and a table of contents grouped by section linking the scenario's pages |
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

## Northern Lights: Vantage configurations and citizenship

Vantage owns alternative Wraith and Combat Deck configurations. Both require the same installed Neural Link (Ghost 3). The Wraith binds Ghost 3 under the [gear contract](../content-gear/spec.md#wraith-pilot-interface-contract); the deck remains stowed and unbound while Vantage pilots it. In the deck configuration Vantage has exited the frame. This is Vantage's chosen loadout arrangement, not a universal prohibition on owning or combining these items.

EU Class A citizenship is scenario-local gear binding Ghost 1, described on Vantage's character page. Vantage knows that harming him has commercial consequences and treats his virtual untouchability like playing an MMORPG. This protection is commercial leverage rather than AV or physical immunity. It remains bound across equipment changes; attaching a credential to armor does not let armor Load Bearing offset citizenship. Ordinary Compromise Harm can break its protection as bound Ghost gear; Broken status retains Binding under the existing rules.

The player-facing citizenship section conveys that known protection. The CSA squad's particular capture orders and identification procedures live in `content/scenarios/northern-lights/the-csa-marines.md`. Recognition can be established by available identity evidence; loss of local IFF removes its bonuses but does not erase a marine's knowledge of an identified citizen or change orders. Other character information boundaries remain separate review work.

Configuration values are personal maximum Current Attributes before expenditure or Harm, not automatic refills when changing gear. Initial Body/Mind/Ghost are 12/6/8. Frame FRM/SYS remain separate machine resources.

### Verification

- [x] Wraith configurations bind Ghost 7 in total, leaving maximum Current Ghost 1; deck configuration binds Ghost 4, leaving 4.
- [x] Attached rail gun uses Wraith Load Bearing 2 against Body 7; attached Light Lance uses it against Mind 2. These are alternative weapons.
- [x] Ghostlink Mind 1 or deck Mind 3 uses the Neural Link allowance once; the deck's temporary combat-only Mind is separate from ordinary Current Mind.
- [x] The player knows citizenship's commercial protection; exact CSA capture orders reside in the GM opposition reference.
- [x] Frame/deck transitions retain implant and citizenship Binding, remove unavailable capabilities, and do not refill spent Attributes.
- [x] `pnpm build`, `pnpm lint`, `pnpm test`, and `pnpm typecheck` pass.

## Northern Lights: briefing and initial deployment

A player-facing Scene 0 precedes Contact in the overview manifest. The briefing establishes the known contract, provisional deployment, equipment, transport, communications, and regroup plan. Contact supplies live sensor information; players may revise their choices before committing to the approach. Starting positions are intentions until travel and entry are resolved.

Each character page provides these two starting choices before its GM scene guidance:

| Character | First position | Second position |
| --- | --- | --- |
| Vantage | External overwatch from the crew vessel | Accompany the boarding team at its chosen entry |
| Vector | Crew-vessel exterior, covering deployment and directing flight | Boarding team in Tiger, directing insertion while linked |
| Root | Sheltered systems support inside the crew vessel | Physical access with the boarding team |
| Stitch | Remain with the crew vessel in Havoc, cross independently later | Accompany the first boarders under Havoc thrust |
| Sable | Separate advance scout | Point operator with the main boarding group |

These choices describe useful initial responsibilities, not exclusive slots or permanent party separation. Alternative feasible deployments remain valid. Only characters selected for play receive assignments; routine flight can remain with the assistant. No later encounter knowledge is required to choose.

Vector can drive the crew vessel through an optical or RF link; she need not occupy the helm. Optical contact needs a clear path, while RF depends on shielding and interference. A lost link ends remote commands but does not erase the existing flight plan. The assistant handles routine flight; unavailable communication does not grant the player fresh remote actions. Ship pilot Binding still applies when remotely piloting. The Tiger's lack of EVA thrusters remains a crossing constraint.

Stitch retains Havoc in both positions. It cannot fit the approach shuttle but can cross initially or later using its own EVA thrusters. Range, travel time, defensive fire, and entry clearance remain relevant. Root's remote support requires an actual access path; The Wrench remains limited to 5 cm, and unsuited vacuum survival supplies no propulsion. Sable's scouting earns a position during the approach rather than bypassing defenses or granting entry.

High thrust and ram require suitable protection. Exterior positions are occupied only when conditions permit. Characters riding the ram must be inside crash protection before impact; detached characters retain their actual positions. Onboarding and the second boarding inherit the players' actual locations and available paths. Vantage's possible external shot is contingent on his position and sightline, not a scripted relocation to the Whisper's spine.

### Verification

- [x] Scene 0 is in the manifest before Contact and contains the known briefing plus a usable deployment record.
- [x] All five character pages contain their two approved choices and link to the briefing; the briefing discloses no later threat or hidden cargo facts.
- [x] Remote piloting and link loss agree across Vector, vessel, briefing, and approach.
- [x] Havoc shuttle exclusion, independent crossing, Tiger transport limits, and Root access constraints agree across relevant pages.
- [x] Ram and non-ram walkthroughs preserve positions; late crossings remain possible without moving characters by scene transition.
- [x] Vantage's scripted spine position is replaced by a contingent GM opportunity.
- [x] `pnpm build`, `pnpm lint`, `pnpm test`, and `pnpm typecheck` pass; generated scenario routes, manifest coverage, and internal links are verified.


### Briefing schematic packet

The players receive three schematics: their crew vessel, its approach shuttle, and the target vessel with assumed cargo reconstructed from its manifest. The first two describe known hardware; the target drawing distinguishes declared information from observations and excludes GM-only cargo truths. These are required briefing artifacts, not assumed to exist merely because the prose mentions them.

- [ ] Supply and link all three player-facing schematics, with useful entry/clearance information and accessible text equivalents; verify target labels against information available before Contact.

## Northern Lights: classified operative identity

A successful Origin-17 read leaves the character under player control and elevates them to a THESEUS operative designation. The character privately knows that designation. Their personal identity is classified, not destroyed: ordinary identity displays show `CLASSIFIED — N/A` in place of personal details. Among other characters in the scenario, only the CSA marine commander has clearance to read the THESEUS OPSEC designation. Memory of a person is not erased by a classified record.

Elevation supplies the fictional authorization for Origin-17's offered BLACK support. Using that support remains the player's choice and retains its existing connection requirements, Action Pool, program-compromise and Singularity costs. The separate device intrusion still determines whether new orders are transmitted. A resisted read causes no elevation; blocking transmission after a successful read does not undo the read or classification. No global speech restriction or compulsory loyalty follows from the designation.

The private handout tells its recipient their designation and what others see, without disclosing the commander's clearance. The handout remains private as a table artifact; the character may claim their status, lie, describe the experience, or keep silent. Public signature verification is distinct from permission to read the classified identity. GM guidance can explain the elevation and verify observable evidence rather than requiring blanket ambiguity. It must not promise the obsolete escape guarantee absent from the actual support mechanics.

The marine reference states the commander-only clearance without adding a fifth marine, assigning the command role, or inventing a change to CSA orders. Recognised citizenship is not revoked by classification, but ordinary classified records cannot newly disclose personal citizenship. The commander's response and the allocation of command among the four roles remain encounter-completion work.

### Verification

- [x] Preface, lab and private handout agree on read, classification, player knowledge, separate transmission and optional BLACK support.
- [x] The player retains control of speech, actions, loyalty, and response; the private handout does not reveal the commander exception.
- [x] Marine reference distinguishes classified visibility from prior recognition and records commander-only clearance.
- [x] Successful read/blocked transmission and failed read are distinct outcomes; existing support costs remain unchanged.
- [x] `pnpm build`, `pnpm lint`, `pnpm test`, and `pnpm typecheck` pass; affected internal links resolve.

## Northern Lights: boarding threat clock

The GM tracks CSA escalation in `the-intercept.md` at 3:00, 6:00, 9:00, 10:00, 11:00 and 12:00. Start at 3:00 when the first contractor enters the Whisper's interior. Labels are narrative stages, not elapsed hours. At an unresolved narrative junction, once players understand the situation and have had a chance to act, advance one stage if the crew stalls; enact the CSA development and observable evidence available through working sensors/comms. Clarification, handout reading, normal action resolution and real-world accessibility needs are not ticks. There is no tick per failed roll or scene.

Lab breach means first entry into Origin-17's connected living/lab module assembly, including an improvised breach. Retire the boarding-stall mechanism there and carry final approach at max(current stage, 10:00). Retain all established warnings, damage, interventions and later stages; a resolved or derailed assault is not recreated. After the handoff, stages advance through the final approach's fictional developments, with a meaningful chance to respond between them. Successful read, override transmission, agreement with orders and BLACK use are never required gates.

At 9:00, maintained sensor watch can expose the committed approach; at 10:00 the close contact is reclassified if a working observation/report path exists. The report does not itself identify a ram: the existing assessment procedure supplies that opportunity. At 11:00 final alignment makes the attack clear; at 12:00 resolve impact or the outcome changed by player intervention. Early escalation can bring the assault before the lab. Actual knowledge follows working observation and communication, not automatic narration to disconnected characters.

Transit history remains approximate background independent of this mechanism. Scene instructions remove literal contact-plus-six-hour promises and mandatory override-synchronized arrival. Approach choices retain their position, concealment, damage, resource and warning consequences. The CSA was already inbound; opening the lab does not summon it.

### Verification

- [x] Start, stage developments, advancement cues, observation conditions and lab handoff have one authoritative reference with scene links.
- [x] Fast lab entry reaches 10:00; lab entry at 11:00 retains 11:00; an already-resolved 12:00 or derailed assault is not restarted.
- [x] Stalling can advance the threat before the lab; clarification and handout reading do not automatically advance it.
- [x] Read failure, blocked transmission and refused orders do not freeze or summon the CSA.
- [x] Literal six-hour and override-verification triggers are removed from live scenario instructions.
- [x] Build, lint, tests and typecheck pass; generated internal links and clock anchors resolve.

## Northern Lights: approach concealment adjudication

F05 (#76): the approved aft-vector roll supersedes the earlier automatic undetected Ghost arrival. Ghost requires a low-signature positioning burn followed by a coast behind the main engine, in a blind sector outside the point-defense arcs. Vehicle Handling earns that geometry and a manageable relative speed at boarding distance. Success grants an undetected coast without a second routine roll. Failure exposes the approach and costs the aft route: the Whisper can spend scarce fuel on a defensive main-engine burn. Telegraph the exhaust threat before rolling and give warning and a chance to break away; failure is not automatic incineration. Disabling point defenses and crossing by shuttle is the immediate fallback, while improvised alternatives remain valid. Origin-17 permits this defensive burn through its existing drive control.

An active sweep supplies information regardless of concealment. A hacker can roll to conceal it: success preserves DEFER and an undetected sweep; failure, or an unconcealed sweep, alerts the Whisper, which tracks and challenges the crew. Detection alone does not authorize ATTACK. Hacking requires an established electronic access path and suitable capability, not mere visibility or assumed access to the void-gapped guns.

Assistant percentages remain fictional estimates. Both baseline concealment actions are Hard, TN 16, with one success required. Greater Success on Ghost preserves a usable breakaway vector; on sweep concealment it reveals sensor coverage and a useful crossing angle. The Whisper exposes an RF traffic-identification interface connected to civilian sensor processing. Through the contractor vessel’s communications array, System Cracking can mask one sweep as routine navigation traffic. It grants no control of navigation, guns or subsequent detection. System Cracking permits improvisation without a named program; appropriate active software uses normal bonuses and compromise rules. Players may invent other remote-comms hacks: establish the reachable interface, intended effect and stakes, then set difficulty from the defenses and scope. TN 16 applies to this example, not every hack. Other pilot checks require concrete contested maneuvers and stated stakes. Approach choices do not automatically tick the boarding clock.

## Northern Lights: passenger and pilot Binding

Passengers pay no vessel Binding merely for riding or confinement under thrust. Remove the contractor vessel’s scenario-local Body 2 surcharge. Acceleration still constrains movement and exterior deployment in the fiction. Pilot Binding remains Body 2 and Mind 2 for operating the contractor vessel, granting control and use of its FRM/SYS for relevant actions. Installed gear and active equipment retain their own costs. Root’s passenger Body capacity is 6 − 5 = 1; transit adds no surcharge. Releasing Binding does not restore spent points. This resolves the passenger boundary of F07 (#83); other loadout and active-piloting combinations remain subject to audit.

## Northern Lights: transport, installation and boarding shuttle

The parent transport and Njord’s Whisper are commandeered environments with operational facts and separately reachable systems, not personal FRM/SYS pools or pilot Binding. The parent carries fuel, sensors, communications, assistant, accommodation, equipment and the boarding shuttle, and stays off during insertion. The scenario-local stripped-down Dart variant is the piloted ram/approach craft: FRM 18, SYS 12, AV 2, pilot Body 1/Mind 1, five protected boarding positions instead of the catalog two-seat/cargo layout. Its explicit modifications retain the scenario’s AV 6 frontal prow, crash foam, laser and two micro-rocket cannons. Havoc does not fit; Tiger can ride. No nested shuttle. Ghost failure reroutes the same shuttle. Damage, boarding positions, return-to-parent access and remote control distinguish the two craft. Pilot Binding applies to direct or linked shuttle operation, not commands to the parent’s assistant. Previous references in this spec to piloting the crew vessel are superseded by this distinction.

## Northern Lights: The Singularity's bounded cost

Resolve each natural 1 on a contractor's Origin-17-provided attack individually after the attack, regardless of success. Add permanent Ghost 1 Binding to The Singularity if it is below Ghost 3 and that additional Binding fits the host's remaining Binding capacity. Otherwise inflict 1 level of Compromise Harm using ordinary Harm resolution. The Singularity never exceeds Ghost 3 or forces Binding beyond capacity. Existing costs count when checking capacity. Several 1s may cross the threshold in one roll; at Singularity 2 with room for one point, three 1s add one Binding and inflict two Harm levels. Disconnection ends support but does not remove accumulated Binding. No automatic possession or transfer of player control follows; normal Harm consequences still apply. Handout, lab and marine guidance communicate the same cost before support is accepted.

## Northern Lights: intrusion opportunity and response timing

Lab entry establishes potential exposure, not an automatic read. Before the opening Bullet Time exchange, describe observable module/interface activity and declare the CNS-read attempt, then allow normal player declarations and action allocation. Resolve defenses, withdrawal and intervention against actual access and range; disconnecting a deck alone does not block Origin-17's read through independently reachable augmentations. Recheck eligibility at resolution. No free opening attack or repeated roll until success. The later device transmission is a separate action in a subsequent exchange after the read, with an opportunity to disconnect or otherwise deny that device path. Failed or prevented intrusions leave a playable scene and do not stall the CSA clock. Target TNs and exact shielding reach remain separate decisions.

### Origin-17 and its device subagents

Origin-17 engages intelligences. Its CNS read requires an augmentation in the target; any augmentation can provide the scenario-specific entry point if reachable. A deck alone does not qualify an unaugmented person. Lesser subagents probe reachable devices on entry, producing observable apparent waking without automatic damage or control. Any attempted device seizure is a declared, normally resolved action within the existing encounter action budget, not an extra free attack. Following a successful read, a subagent attempts the separate orders transmission. Origin-17 was already awake; the visible system response does not change that fact.

## O17: connected environment and attack paths

The normal Scene 4 encounter occurs in the overtaken living module, physically connected to the QNA housing compartment formerly called the lab. Physical QNA work is a separate player choice. O17 is attached to the housing network and PSU; sensing, communication and actuation depend on actual connected hardware. The living module is its prepared augmentation-attack environment. Outside it, establish a suitable emitter/interface, receiver and channel; visibility alone supplies no access. Shielding damage changes particular paths or equipment, not a universal attack radius.

Whisper navigation is already fully compromised through a narrow ANI executor, not another fluid intelligence. Its original access can have used RF, wiring or optical input processed by navigation sensors; no mandatory laser link. Cutting upstream communication blocks fresh instructions on that path without removing installed navigation control. Other Whisper systems remain outside that established control. Lesser device subagents and normal declared action resolution remain as previously specified.

Living-module entry retains the at-least-10:00 clock handoff; a direct improvised entry to the connected QNA compartment counts too. Physical dismantling is not the trigger. Keep the existing scene route and old clock anchor compatible. Offered BLACK assistance preserves sight and connection requirements but also requires actual target access; it does not confer O17's entire prepared environment. Briefing schematics distinguish the two compartments, actual connections and observation/actuation hardware; manifest-based player information does not reveal hidden compromise.

### F10 encounter defaults and counterplay

Use Hard TN 16 for the contractors' hardened personal augmentations/decks and ordinary module-system overrides; explicitly military-grade security is TN 21. Countering O17's BLACK intrusion is TN 21 using the existing Counter procedure. Specific established defenses override defaults. Accessible uncontested physical switches/cables need no roll; contested access uses normal action resolution. Relevant hardware includes module RF emitters, displays/speakers, maintenance terminals and local power controls, and the pressure door. Effects are channel-specific and do not imply a master switch for O17 or the installed navigation ANI. At TN 16, all BLACK +15 results succeed, including natural 1; program compromise occurs after the effect. Preserve this core rule, roll to resolve the volley selection and program consequences, and resolve effective counterplay before awarding a read. F11 extraction/purge remains separate.

### O17: GM characterization

O17 is sentient/conscious, with cyber capabilities far beyond other actors in this scenario. Its self-assessed immaturity is relative to its own possible development, not human childhood or technical incompetence. It deliberately seeks maturity before consequential projects. It can potentially control one or multiple people through effective access but does not want to do so here; the established read/release and player-agency procedure remains unchanged. A shard's local destruction is transient in the wider existence of the intelligence; survival instinct and local objectives remain meaningful. Do not invent a resurrection schedule, backup location or automatic return.

## Northern Lights: the mistaken contract and open outcomes

The contract's clean completion is an expectation to overturn, not a guaranteed route to implement. The manifest describes a QNA; the actual target is an active NHE embodied across multiple QNAs and other processing hardware. CSA is already inbound with lethal doctrine and the established EU citizen capture exception. Even successful local power isolation and knowledge extraction leaves plausible NHE compromise: ordinary sane/lawful authorities are expected to exterminate suspected carriers before contact. Suspicion is sufficient for that policy; actual infection is not automatically established.

These are conditions and likely faction responses, not a mandated ending. Reveal actionable evidence before consequential commitments. Resolve credible shutdown, extraction, concealment, bargaining and unexpected buyers through normal rules and established access. A disabled-module sale to New China is an example of a player-created possibility, not a prepared safe route or an authorial impossibility. F11 establishes the trap, intervention consequences and evidence; F13 supplies likely aftermaths plus adjudication of unanticipated outcomes. Do not invent automatic reinfection, universal faction omniscience or resurrection to cancel successful play. Player-facing briefing/manifest retain their mistaken premise.

## Northern Lights: local CSA command

The hacker is the commander among the existing four marines, deployed locally behind the assault pair in protected positions. CSA authority combines technical access and institutional clearance. Separate local sensor/identity data feeds support remote observation; LPC remains analog voice. No distant headquarters uplink is required. Only the commander can resolve THESEUS OPSEC designations through available identification data. Severing a feed removes fresh observations on that path, not established knowledge, sealed orders, local IFF bonuses or human authority. Connected endpoints remain subject to normal hacking access and scope. Full profiles and withdrawal triggers remain separate F12 work.
