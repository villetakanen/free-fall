# Feature: Core Rulebook Navigation

## Blueprint

### Context

The FREE//FALL app renders core rulebook content (from `packages/free-fall-core-rulebook`) on hardcoded pages: `index.astro` imports `core-mechanics.md` directly and `registry.astro` imports `registry.md` directly. Neither page is collection-driven, and the routes (`/`, `/registry/`) bear no relationship to the source package.

This feature replaces that hardcoded approach with a collection-driven content routing convention and integrates the results as a submenu in the navigation tray.

**Routing convention:** Every content package maps to a route segment matching its package directory name. `packages/free-fall-core-rulebook` produces routes at `/free-fall-core-rulebook/[id]`. Future content packages (e.g., `packages/free-fall-expansion-x`) follow the same pattern: `/free-fall-expansion-x/[id]`.

Parent spec: `specs/free-fall/app-layout/spec.md`
Uses: `specs/design-system/tray-link-group/spec.md`

### Architecture

**Content collection**

A new Astro content collection `core-rulebook` is added to `apps/free-fall/src/content.config.ts`. It uses the `glob` loader pointed at the core rulebook package's content directory.

```ts
const coreRulebook = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "../../packages/free-fall-core-rulebook/src/content/rules",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().optional(),
  }),
});

export const collections = { rules, "core-rulebook": coreRulebook };
```

The collection name `core-rulebook` is used at query time. The base path uses a relative filesystem reference (not a Vite alias) because Astro's glob loader operates on the filesystem, not module resolution.

**Dynamic page**

A single-parameter page at `apps/free-fall/src/pages/free-fall-core-rulebook/[id].astro` generates one page per collection entry. Each entry ID maps to exactly one URL segment — there are no nested paths.

| Collection entry ID | Generated route |
|---|---|
| `core-mechanics` | `/free-fall-core-rulebook/core-mechanics/` |
| `registry` | `/free-fall-core-rulebook/registry/` |

The page queries the `core-rulebook` collection via `getCollection("core-rulebook")`, maps entries to static paths using `params: { id: entry.id }`, and renders each entry's Content within BaseLayout inside a `.freefall-prose` scope.

**Navigation submenu**

A helper function `getCoreRulebookNavItems()` in `apps/free-fall/src/lib/nav.ts` encapsulates the collection query and transforms it into the `subItems` shape expected by `NavItem`. BaseLayout calls this helper and merges the result into its `navItems` array.

```ts
// apps/free-fall/src/lib/nav.ts
import { getCollection } from "astro:content";

export async function getCoreRulebookNavItems(pathname: string) {
  const entries = (await getCollection("core-rulebook"))
    .sort((a, b) => (a.data.order ?? Infinity) - (b.data.order ?? Infinity));

  return entries.map((entry) => ({
    label: entry.data.title,
    href: `/free-fall-core-rulebook/${entry.id}/`,
    active: pathname === `/free-fall-core-rulebook/${entry.id}/`,
  }));
}
```

BaseLayout consumes it:

```ts
// BaseLayout.astro frontmatter
import { getCoreRulebookNavItems } from "../lib/nav.ts";

const coreRulebookSubItems = await getCoreRulebookNavItems(Astro.url.pathname);

const navItems = [
  {
    icon: "public",
    label: "Home",
    href: "/",
    active: Astro.url.pathname === "/" ||
            Astro.url.pathname.startsWith("/free-fall-core-rulebook/"),
    subItems: coreRulebookSubItems,
  },
];
```

The Home tray button is marked active when the user is on `/` or any `/free-fall-core-rulebook/*` page, since the submenu is conceptually nested under Home.

> **Technical debt:** BaseLayout currently owns the `navItems` array and calls the helper to build `subItems` as data. This works because AppTray accepts `subItems` as a data prop, not as slotted components. When multiple content packages exist, this should be revisited — ideally AppTray would accept slotted `TrayLinkGroup` children so each content domain can own its own query and rendering. Tracked as design-system tech debt.

**Migration from hardcoded pages**

| Current | After |
|---|---|
| `/` renders `core-mechanics.md` directly | `/` remains the home page (unchanged for now) |
| `/registry/` renders `registry.md` directly | `/registry/` is removed; content moves to `/free-fall-core-rulebook/registry/` |
| `menu_book` Registry top-level nav item | Removed — Registry becomes a sub-item under Home |

The homepage (`index.astro`) continues to render core-mechanics content directly with its version badge and alpha badge. It is not affected by this change. The collection-driven route at `/free-fall-core-rulebook/core-mechanics/` provides a clean, standalone page for the same content.

**Dependencies**

- **Depends on:** `@free-fall/core-rulebook` (content source), design-system `TrayLinkGroup` + `TrayLink` (submenu rendering)
- **Depended on by:** BaseLayout (navigation), all pages using BaseLayout

### Anti-Patterns

- **No hardcoded sub-items in BaseLayout** — The submenu must be generated from the collection query. Adding a new markdown file to the core rulebook package must automatically produce a new nav entry and route without touching BaseLayout or page files.
- **No Vite aliases in content collection loaders** — The glob loader resolves filesystem paths, not module imports. Use relative paths from the app root.
- **No duplicate content rendering** — Do not import core rulebook markdown files directly on collection-driven pages. Use `render(entry)` from the collection API.
- **No route segments that diverge from package directory names** — The URL path segment must exactly match the package directory name under `packages/`. This is the convention for all content packages.

## Contract

### Definition of Done

- [ ] `core-rulebook` content collection is defined in `content.config.ts`, loading from the core rulebook package
- [ ] `apps/free-fall/src/pages/free-fall-core-rulebook/[id].astro` generates pages from the collection
- [ ] Each core rulebook entry is reachable at `/free-fall-core-rulebook/{id}/`
- [ ] `apps/free-fall/src/lib/nav.ts` exports `getCoreRulebookNavItems()` that queries the collection and returns sorted `subItems`
- [ ] BaseLayout calls the helper and passes the result as Home's `subItems`
- [ ] Home tray button is active on `/` and all `/free-fall-core-rulebook/*` routes
- [ ] Each sub-item is active when its route matches the current pathname
- [ ] The separate `/registry/` page and its top-level nav item are removed
- [ ] TrayLinkGroup and TrayLink render the submenu in the expanded tray and hide it in the minimized rail (per `specs/design-system/tray-link-group/spec.md`)
- [ ] Adding a new `.md` file to `packages/free-fall-core-rulebook/src/content/rules/` automatically produces a new route and nav entry without code changes
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

- The homepage at `/` must continue to render without errors
- All existing routes except `/registry/` must remain functional
- The navigation tray must not break on pages that are not under `/free-fall-core-rulebook/`
- Content rendered on collection-driven pages must use `.freefall-prose` scope for typography

### Scenarios

```gherkin
Scenario: Core rulebook entry is routable
  Given: a markdown file `core-mechanics.md` exists in the core rulebook package with frontmatter title "System Reference Document"
  When: a user navigates to `/free-fall-core-rulebook/core-mechanics/`
  Then: the page renders the markdown content within BaseLayout with title "System Reference Document — FREE//FALL"

Scenario: Submenu appears in expanded tray
  Given: the core-rulebook collection contains entries "System Reference Document" (order 1) and "Registry" (order 2)
  When: the tray is in the expanded state
  Then: both entries appear as sub-links under the Home tray button, in order

Scenario: Submenu hidden in minimized rail
  Given: the tray is in the collapsed rail state
  When: the user views the navigation
  Then: the sub-links are hidden from layout and keyboard focus

Scenario: Sub-item active state
  Given: a user is on `/free-fall-core-rulebook/registry/`
  When: the tray is expanded
  Then: the "Registry" sub-link has `aria-current="page"` and the Home tray button is also marked active

Scenario: New content auto-discovered
  Given: a new file `weapons.md` is added to `packages/free-fall-core-rulebook/src/content/rules/` with frontmatter title "Weapons" and order 3
  When: the app is rebuilt
  Then: `/free-fall-core-rulebook/weapons/` is a valid route and "Weapons" appears as the third sub-link under Home

Scenario: Registry page removed
  Given: the `/registry/` route previously existed
  When: a user navigates to `/registry/`
  Then: the route returns a 404 (no redirect)
```
