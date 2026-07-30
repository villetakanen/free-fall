# Feature: Navigation Model

## Blueprint

### Context

FREE//FALL is a static, content-heavy Astro application. Its navigation helps readers move between the app, rulebook, gear catalog, scenarios, and scenario-local pages without mixing global and local context. The design-system navigation model expresses the product concepts directly: global navigation, content-section navigation, scoped subsite navigation, uplinks, and non-link groups.

Parent spec: `specs/design-system/spec.md`

Related specs: `specs/design-system/app-shell/spec.md`, `specs/design-system/app-tray/spec.md`, `specs/free-fall/app-layout/spec.md`, `specs/content-scenarios/spec.md`

### Architecture

The navigation model is a plain TypeScript contract owned by the design system and consumed by Astro apps at build time. It separates navigation semantics from tray mechanics.

Astro route generation remains file-based and content-driven. App code queries local content collections with `getCollection()` and builds navigation data during static rendering. Collection-derived navigation is sorted explicitly by the app before it enters the model. The design system receives normalized navigation data and renders it as semantic HTML with standard `<a>` elements.

**Data model:**

```ts
export type NavModel = {
  scope: "global" | "subsite";
  label: string;
  items: NavNode[];
};

export type NavNode = NavLink | NavGroup | NavUplink;

export type NavLink = {
  kind: "link";
  icon: string;
  label: string;
  href: string;
  match?: "exact" | "prefix";
  matchPath?: string;
  children?: NavNode[];
};

export type NavGroup = {
  kind: "group";
  icon?: string;
  label: string;
  children: NavNode[];
};

export type NavUplink = {
  kind: "uplink";
  icon?: string;
  label: string;
  href: string;
};
```

`NavModel.scope` describes the navigation context:

| Scope | Meaning | Example |
|---|---|---|
| `global` | App-wide navigation. | Home, Core Rules, Gear, Scenarios |
| `subsite` | A self-contained section owns the tray contents for its routes. | One scenario under `/scenarios/{slug}/` |

`NavNode.kind` describes behavior:

| Kind | Behavior |
|---|---|
| `link` | Navigates to `href`. Active state is derived from `matchPath ?? href`, `match`, and descendant activity. |
| `group` | Provides a non-link heading for related child destinations. It may appear as a section label in the open tray. |
| `uplink` | Navigates out of a `subsite` scope to its parent/global location. Defaults to `arrow_back` when `icon` is omitted. |

**Normalization:**

`packages/design-system/src/navigation.ts` owns shared types and a route-neutral normalization helper. The helper accepts a `NavModel` and the request pathname and returns a render model with derived `active` flags. Consumers may precompute the model in app code, but the active-state rules are defined once by the design system.

Active-state rules:

| Node | Rule |
|---|---|
| Link with `match: "exact"` or no `match` | Active when `pathname === (matchPath ?? href)`. |
| Link with `match: "prefix"` | Active when `pathname === (matchPath ?? href)` or `pathname.startsWith(matchPath ?? href)` after both values are normalized to trailing-slash paths. |
| Group | Active when any descendant is active. |
| Uplink | Not active. |

**Rendering:**

`AppShell` receives a `navigation: NavModel` prop and passes the normalized render model to `AppTray`. `AppTray` renders nodes through tray primitives: `TrayButton` for actionable primary links and uplinks, `TrayLinkGroup` for descendants, `TrayLink` for secondary links, and a group-heading presentation for `NavGroup`.

| File | Responsibility |
|---|---|
| `packages/design-system/src/navigation.ts` | Public navigation model types, normalization, path matching. |
| `packages/design-system/src/components/AppShell.astro` | Receives `navigation`, owns AppTray composition. |
| `packages/design-system/src/components/AppTray.astro` | Renders links, groups, uplinks, and descendant link groups. |
| `packages/design-system/src/components/TrayButton.astro` | Renders actionable primary links and uplinks. |
| `packages/design-system/src/components/TrayLinkGroup.astro` | Renders descendant links and group content in the open tray. |
| `packages/design-system/src/components/TrayLink.astro` | Renders secondary links. |
| `apps/design-system/src/pages/navigation.astro` | Living reference for global, section, and subsite navigation models. |
| `apps/free-fall/src/lib/nav.ts` | App-owned content collection queries and FREE//FALL-specific model construction. |

**Documentation model:**

The design-system docs include a `/navigation/` page that explains navigation concepts as product design rules, not just component mechanics. The page demonstrates:

- Global app navigation.
- Content section with derived child links.
- Scoped scenario/subsite navigation with an uplink.
- Non-link groups for section headings.
- Active-state behavior for exact, prefix, and descendant matches.

### Constraints

- Navigation data is serializable plain data: strings, arrays, objects, and literal discriminants.
- The design system owns the shape, active-state derivation, and rendering semantics of navigation nodes.
- Consuming apps own content queries, route-specific scope selection, and labels/icons that come from product structure.
- The navigation model renders to static HTML with ordinary anchors. Progressive-enhancement scripts remain limited to tray open/close, keyboard, and focus behavior already owned by `AppTray`.
- `NavGroup` is a group heading, not a destination. It carries children and derived active state but no `href`.
- Content-derived navigation is explicitly sorted by the consuming app before it enters the design-system model.

## Contract

### Definition of Done

- [ ] `packages/design-system/src/navigation.ts` exports the public `NavModel`, `NavNode`, `NavLink`, `NavGroup`, and `NavUplink` types.
- [ ] `packages/design-system/src/navigation.ts` exports a normalization helper that derives active state from pathname, `matchPath`, match mode, and descendants.
- [ ] `AppShell.astro` accepts `navigation: NavModel` and passes normalized navigation data to `AppTray.astro`.
- [ ] `AppTray.astro` renders `link`, `group`, and `uplink` nodes; group nodes render as headings with child destinations.
- [ ] `TrayButton.astro` renders actionable primary links and uplinks with responsive tray behavior.
- [ ] `TrayLinkGroup.astro` can render descendant groups and links in the open tray while remaining hidden in rail mode.
- [ ] `apps/design-system/src/pages/navigation.astro` documents and demonstrates global, content-section, and subsite navigation.
- [ ] `apps/free-fall/src/layouts/BaseLayout.astro` passes a `NavModel` to `AppShell`.
- [ ] `apps/free-fall/src/lib/nav.ts` builds global and scenario-subsite navigation models from content collections with explicit sorting.
- [ ] App-tray responsive behavior, no-JS toggle behavior, focus management, and reduced-motion behavior are covered by Playwright tests.
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass.

### Regression Guardrails

- Navigation groups must never synthesize a destination from their first child.
- A `subsite` navigation model must always include an uplink as the first actionable route out of the scope.
- Global navigation items must never appear inside a scenario/subsite model unless explicitly represented as the uplink destination.
- Active state must never be hand-coded differently in individual app routes; path matching belongs to the shared normalization helper.
- Content collection order must never rely on `getCollection()` return order; app builders sort before constructing the model.
- The design system must never import from `apps/free-fall` or any content package.

### Scenarios

```gherkin
Scenario: Global navigation renders app-wide destinations
  Given a global NavModel with Home, Core Rules, Gear, and Scenarios links
  When AppShell renders the model at /
  Then AppTray shows the global destinations
  And Home is active
  And no subsite uplink is shown

Scenario: Prefix match activates a content section
  Given a global NavModel has a Core Rules link with href /core-rulebook/00-intro/, match prefix, and matchPath /core-rulebook/
  When the request pathname is /core-rulebook/03-combat/
  Then the Core Rules link is active
  And the matching descendant rulebook chapter is active

Scenario: Group headings are non-destinations
  Given a NavModel contains a group labeled GM Materials with child page links
  When AppTray renders the model
  Then GM Materials renders as a group heading without href
  And its child links keep their own href values

Scenario: Scenario route uses subsite navigation
  Given the request pathname is /scenarios/northern-lights/the-approach/
  When apps/free-fall/src/lib/nav.ts builds the navigation model
  Then the model scope is subsite
  And the first node is an uplink to /scenarios/
  And Home, Core Rules, Gear, and the global Scenarios listing are absent as ordinary nodes

Scenario: Uplink exits a subsite
  Given a subsite NavModel begins with an uplink labeled All Scenarios
  When AppTray renders the uplink
  Then it links to /scenarios/
  And it uses the uplink visual treatment from TrayButton
  And it is never marked active

Scenario: Descendant activity activates its group
  Given a group contains a child link to /scenarios/northern-lights/the-approach/
  When the request pathname is /scenarios/northern-lights/the-approach/
  Then the child link is active
  And the containing group is active

Scenario: Rail mode hides descendant detail
  Given the tray is in minimized rail mode
  When a navigation model contains groups and child links
  Then the descendant link groups are hidden from visual layout and tab order
  And the tray open state exposes them again

Scenario: Empty content collection keeps global navigation valid
  Given the scenarios collection has no scenario entries
  When apps/free-fall/src/lib/nav.ts builds the global navigation model
  Then the Scenarios link still points to /scenarios/
  And its children array is empty or omitted
  And the model validates
```
