# Feature: App Layout & About Page

## Blueprint

### Context

The FREE//FALL app currently uses AppShell directly on each page, with navigation forcibly hidden via `display: none !important` overrides (an alpha-phase hack). Now that the design system's AppTray, AppBar, and DrawerBrand are stable, the app re-enables full navigation.

A `BaseLayout.astro` layout centralizes the AppShell configuration — navItems, brandHref, and title — so pages don't duplicate it. The DrawerBrand links to `/about`, which needs an actual page to land on.

### Architecture

**BaseLayout.astro** (`apps/free-fall/src/layouts/BaseLayout.astro`)

An Astro layout that wraps `AppShell` with the app's navigation configuration. All pages use this layout instead of importing AppShell directly.

```html
<AppShell title={title} navItems={navItems} brandHref="/about/">
  <slot name="head" slot="head" />
  <slot />
</AppShell>
```

**Props:**

| Prop | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | no | Page title — passed through to AppShell |
| `frontmatter` | `{ title?: string }` | no | Astro injects this for markdown pages using `layout` frontmatter |

Title is resolved as `Astro.props.title || Astro.props.frontmatter?.title || "FREE//FALL"`. This allows both `.astro` pages (passing `title` directly) and `.md` pages (using `layout` frontmatter) to use the same layout.

**Navigation items (hardcoded in BaseLayout):**

| Icon | Label | Href |
|---|---|---|
| `public` | Home | `/` |

Only one nav item. The globe icon (`public` from Material Symbols Sharp) represents the app's home.

**brandHref:** `/about/` — links the DrawerBrand logo to the about page.

**About page** (`apps/free-fall/src/pages/about.md`)

A markdown page at `/about/` using BaseLayout via frontmatter `layout` reference. Content will be updated later, but will ultimately include publisher (Myrrys) details, copyright information, and general app "about" info. For now, renders a minimal heading and placeholder text.

```markdown
---
layout: ../layouts/BaseLayout.astro
title: About — FREE//FALL
---
```

**Page type guidance:** Prefer `.md` files with frontmatter layout for content-focused pages (about, rules, legal). Use `.astro` files only when the page needs programmatic imports or dynamic data (e.g., `index.astro` importing VERSION and CoreMechanics).

**Migration from current state:**

- `index.astro` — Remove the `display: none !important` style block that hides navigation. Switch from importing AppShell directly to using BaseLayout. Remove the inline `navItems = []`.
- `rules/[...slug].astro` — Switch from importing AppShell directly to using BaseLayout. Remove the inline `navItems` array.

**Dependencies:**

- **Depends on:** design-system (AppShell, AppTray, AppBar, DrawerBrand)
- **Depended on by:** all pages in the free-fall app

### Anti-Patterns

- **No `display: none` hacks** — Navigation is fully enabled. Do not hide AppTray, hamburger, or rail with override styles.
- **No per-page navItems** — Navigation is defined once in BaseLayout. Pages do not pass navItems.
- **No layout logic in pages** — Pages provide title and content. BaseLayout owns the shell configuration.

## Contract

### Definition of Done

- [ ] `apps/free-fall/src/layouts/BaseLayout.astro` wraps AppShell with navItems and brandHref
- [ ] NavItems contains one entry: globe icon (`public`), label "Home", href `/`
- [ ] brandHref is `/about/`
- [ ] `about.md` page exists at `/about/` with placeholder content and frontmatter layout
- [ ] `index.astro` uses BaseLayout, no longer hides navigation, no inline navItems
- [ ] `rules/[...slug].astro` uses BaseLayout, no inline navItems
- [ ] Navigation (hamburger, rail, drawer) is fully functional on all app pages
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

- AppTray, hamburger button, and rail must never be hidden via CSS overrides
- All pages must use BaseLayout — no direct AppShell imports in page files
- DrawerBrand must link to `/about/` and the page must resolve

### Scenarios

Scenario: Navigation is visible on home page
  Given: A user visits the free-fall app home page
  When: The page loads at any viewport
  Then: The hamburger button is visible (small) or the rail is visible (medium+)

Scenario: Home nav item is active on index
  Given: A user is on the home page
  When: The rail or drawer is visible
  Then: The "Home" item with globe icon is marked active

Scenario: DrawerBrand links to about page
  Given: A user opens the navigation drawer
  When: They click the brand logo
  Then: They navigate to `/about/`

Scenario: About page renders
  Given: A user navigates to `/about/`
  When: The page loads
  Then: The page renders with BaseLayout, showing navigation and placeholder content

Scenario: Rules page uses BaseLayout
  Given: A user navigates to a rules page
  When: The page loads
  Then: Navigation is visible and functional (not hidden)
