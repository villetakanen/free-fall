# Feature: Gear Catalog UI

## Blueprint

### Context

The gear content package (`content/gear/`) stores 34 equipment items with structured frontmatter validated by a discriminated union schema. The data layer is complete, but there is no way for users to browse or read gear items in the app. This feature adds gear category pages and navigation, following the same drawer pattern established by the core rulebook.

The gear collection maps to one rail-level `TrayButton` ("Gear") with 5 category sub-links (Weapons, Armor, Augmentations, Utility, Vehicles). Each sub-link leads to a category page that renders **all items of that category** on a single page. This mirrors the core rulebook pattern: one rail icon, chapter sub-links.

Parent spec: `specs/content-gear/spec.md`

### Prerequisites

This spec depends on two design-system fixes that must land first:

**1. Scrollable nav region**

The AppTray nav area (currently the element with class `.app-tray__nav` in `AppTray.astro`) does not handle overflow. With gear categories added, nav content can exceed the viewport. The nav region must gain `overflow-y: auto` so it scrolls independently of the brand footer.

**2. Scoped styles in AppTray**

The `.app-tray__nav` class follows BEM naming, but `AppTray.astro` is a component that owns its own `<style>` block. The nav element's style should use a component-scoped class (e.g., just `.nav` or a bare element selector within the component's scoped `<style>`), not a BEM-namespaced global class. This is a cleanup prerequisite — the scrollable overflow fix should land on the corrected selector.

### Architecture

**Routing**

A single dynamic page at `src/pages/gear/[category].astro` renders one page per gear category:

```
src/pages/gear/[category].astro
```

`getStaticPaths()` returns 5 static paths, one per category:

| `category` param | Route |
|---|---|
| `weapons` | `/gear/weapons/` |
| `armor` | `/gear/armor/` |
| `augmentations` | `/gear/augmentations/` |
| `utility` | `/gear/utility/` |
| `vehicles` | `/gear/vehicles/` |

Each path receives the full array of gear entries for that category as props.

**Category page rendering**

Each category page renders **all items of that category** sequentially within `BaseLayout`, inside the `.freefall-prose` scope. For each item:

1. Render the item's `title` as a heading (enabling anchor links)
2. Render the item's Markdown `Content`

Items are sorted alphabetically by title within the page. The page title follows: `{Category Label} — FREE//FALL` (e.g., "Weapons — FREE//FALL").

Frontmatter data (binding costs, qualities, DV, AV, etc.) is **not** rendered as structured UI by this spec — the prose body is sufficient for an initial catalog. Stat-block components from frontmatter are future work.

**Navigation**

The nav helper in `src/lib/nav.ts` gains a new function `getGearNavItems(pathname)` that:

1. Fetches `getCollection("gear")`
2. Extracts the distinct categories
3. Returns a single `NavItem` for the gear rail button, with categories as `subItems`

Category display order and labels:

| `category` value | Sub-item label | Order |
|---|---|---|
| `weapon` | Weapons | 1 |
| `armor` | Armor | 2 |
| `augmentation` | Augmentations | 3 |
| `utility` | Utility | 4 |
| `vehicle` | Vehicles | 5 |

The rail-level button:
- **Icon:** `handyman` (Material Symbols)
- **Label:** "Gear"
- **href:** `/gear/weapons/` (first category)
- **Active:** `pathname.startsWith("/gear/")`

Sub-items link to `/gear/{category plural}/` (e.g., `/gear/weapons/`, `/gear/augmentations/`). Active when `pathname === /gear/{category plural}/`.

**BaseLayout integration**

`BaseLayout.astro` calls `getGearNavItems(pathname)` and appends the result to the `navItems` array, after the core rulebook entry:

```
Home                    (icon: public)
Core Rules v7           (icon: book_5)
  ├─ Introduction
  ├─ The World of 2048
  └─ ...
Gear                    (icon: handyman)
  ├─ Weapons
  ├─ Armor
  ├─ Augmentations
  ├─ Utility
  └─ Vehicles
```

**Category-to-route mapping**

The `category` frontmatter values are singular (`weapon`, `armor`, etc.) but route segments use plurals for readability. The mapping is:

| Frontmatter `category` | Route segment | Nav label |
|---|---|---|
| `weapon` | `weapons` | Weapons |
| `armor` | `armor` | Armor |
| `augmentation` | `augmentations` | Augmentations |
| `utility` | `utility` | Utility |
| `vehicle` | `vehicles` | Vehicles |

This mapping is defined once in `nav.ts` and reused by the page's `getStaticPaths()`.

**Files changed**

| File | Change |
|---|---|
| `apps/free-fall/src/pages/gear/[category].astro` | New — dynamic route for gear category pages |
| `apps/free-fall/src/lib/nav.ts` | Add `getGearNavItems()` and category mapping |
| `apps/free-fall/src/layouts/BaseLayout.astro` | Import and append gear nav items |
| `packages/design-system/src/components/AppTray.astro` | Prerequisite: fix scoped styles, add nav overflow scroll |

### Anti-Patterns

- **No per-item routes** — Individual gear items do not get their own pages. All items render on their category page. Per-item detail pages are future work if needed.
- **No stat-block components** — Frontmatter data rendering (binding cost badges, quality tags, DV indicators) is future work. This spec renders the Markdown body only.
- **No new design-system components** — The existing `TrayButton`, `TrayLink`, and `TrayLinkGroup` handle the nav.
- **No hardcoded categories in nav** — Categories are derived from `getCollection("gear")` at build time. If a category has no items, it does not appear.
- **No BEM in component-scoped styles** — AppTray owns its styles via Astro's scoped `<style>`. Use simple class names or bare selectors, not `.app-tray__*`.

## Contract

### Definition of Done

- [ ] AppTray nav region scrolls when content exceeds viewport height
- [ ] AppTray scoped styles use component-local class names, not BEM `.app-tray__*`
- [ ] `/gear/weapons/` renders all weapon items with titles and Markdown content
- [ ] All 5 category routes are valid: `/gear/weapons/`, `/gear/armor/`, `/gear/augmentations/`, `/gear/utility/`, `/gear/vehicles/`
- [ ] The navigation drawer shows a "Gear" rail button with `handyman` icon
- [ ] The "Gear" button expands to show 5 category sub-links in the defined order
- [ ] Active states work: visiting `/gear/weapons/` highlights the Gear button and the Weapons sub-link
- [ ] Items within each category page are sorted alphabetically by title
- [ ] Adding a new `.md` file to `content/gear/items/weapons/` causes it to appear on the `/gear/weapons/` page without code changes
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

- Core rulebook routes and navigation must not break
- Home page must render without errors
- The drawer must not break on pages outside `/gear/`
- Gear nav entries must never appear in the core-rulebook sub-items or vice versa
- The drawer must remain fully functional without JavaScript (CSS checkbox pattern)

### Scenarios

```gherkin
Scenario: Category page renders all items
  Given the weapons category contains 10 gear entries
  When a user navigates to /gear/weapons/
  Then the page renders all 10 items with headings and Markdown content
  And items are sorted alphabetically by title
  And the page title is "Weapons — FREE//FALL"

Scenario: Gear rail button appears in drawer
  Given the gear collection contains items in 5 categories
  When the drawer is expanded
  Then a "Gear" button with handyman icon appears after "Core Rules v7"
  And 5 category sub-links appear beneath it

Scenario: Active state on gear category page
  Given a user is on /gear/armor/
  When the drawer renders
  Then the Gear button has aria-current="page"
  And the "Armor" sub-link has aria-current="page"
  And no core-rulebook buttons or links have aria-current="page"

Scenario: Nav scrolls with many items
  Given the drawer contains core-rulebook chapters and 5 gear categories
  When the nav content exceeds viewport height
  Then the nav region scrolls independently
  And the brand footer remains visible at the bottom

Scenario: Empty category omitted from nav
  Given the gear collection contains no items with category "vehicle"
  When the drawer renders
  Then no "Vehicles" sub-link appears under Gear

Scenario: Non-gear pages unaffected
  Given a user is on /core-rulebook/03-core-rules/
  When the drawer renders
  Then the Gear button does not have aria-current="page"
  And the Core Rules v7 button has aria-current="page"
```
