# Feature: App Shell

## Blueprint

### Context

Every page in FREE//FALL needs the same structural skeleton: document head, navigation, top app bar, and content pane. Currently each page duplicates this structure. The app shell is an Astro layout component that provides the M3-style scaffold once, so pages only supply their unique content and metadata.

The shell follows the [Material Design 3 scaffold pattern](https://m3.material.io/foundations/layout/understanding-layout/parts-of-layout) — a composition of navigation, app bar, and content pane that adapts across breakpoints.

Used by both `apps/design-system` and `apps/free-fall`.

Parent spec: `specs/design-system/spec.md`

### Architecture

**M3 scaffold regions:**

```
SMALL (< 620px)
+-------------------------------+
| [=] Top App Bar         title |
+-------------------------------+
|                               |
|        Content pane           |
|                               |
+-------------------------------+

MEDIUM (620–779px)
+---+---------------------------+
|   | Top App Bar         title |
| R +---------------------------+
| A |                           |
| I |      Content pane         |
| L |                           |
+---+---------------------------+

LARGE (≥ 780px)
+---+---------------------------+
|   | Top App Bar         title |
| R +---------------------------+
| A |                           |
| I |      Content pane         |
| L |                           |
+---+---------------------------+
```

The scaffold has four regions:

| Region | Description |
|---|---|
| **Navigation** | AppTray component — rail, drawer, burger, scrim (see app-tray spec) |
| **Top app bar** | `AppBar` component above the content pane (see `specs/design-system/app-bar/spec.md`). Receives `title` from the shell. |
| **Content pane** | The main scrollable area. Receives page content via default `<slot />`. |
| **Head** | Hidden region — `<head>` with meta, fonts, and a named slot for page-specific additions. |

**Layout structure (HTML):**

```html
<html lang="en">
  <head>
    <!-- charset, viewport, FontLinks, base.css -->
    <title>{title}</title>
    <slot name="head" />
  </head>
  <body>
    <div class="app-shell">
      <AppTray items={navItems} brandHref={brandHref} />
      <div class="app">
        <AppBar title={title} />
        <main>
          <slot />
        </main>
      </div>
    </div>
  </body>
</html>
```

**Responsive behavior:**

| Viewport | Navigation | Top bar | Content pane |
|---|---|---|---|
| Small (< 620px) | Hidden (burger fixed top-left) | Full width, 64px left margin clears burger | Fills remaining shell width |
| Medium (tablet) | Rail visible (flex column, left) | Fills remaining width, layout clears rail automatically | Fills remaining width after rail |
| Large (desktop) | Rail visible, tray pushes | Fills remaining width, layout clears rail automatically | Fills remaining width |

The `.app-shell` is a flex row. The AppTray's rail participates in the flex flow. The `.app` region is a bounded column: the app bar keeps its intrinsic height and `<main>` owns the remaining viewport height and vertical scrolling. The shell does not use compensating padding or fixed content heights.

AppShell owns the scaffold, viewport bounding, `<main>` scroll ownership, and
the named `content` inline-size query container. It intentionally does not add
content padding, gutters, columns, or readable measure. A consumer-provided
ContentGrid owns those content-layout concerns. Top bar dimensions and styling
are defined in the app-bar spec (`specs/design-system/app-bar/spec.md`).

**Props:**

| Prop | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | yes | Page `<title>` and top bar title |
| `navItems` | `NavItem[]` | yes | Passed through to AppTray |
| `brandHref` | `string` | no | Passed through to AppTray for brand logo link |

`NavItem` requires `icon`, `label`, and `href`; accepts optional `active`,
`variant: "nav" | "uplink"`, and `subItems`. Each sub-item requires `label` and
`href` and accepts optional `active`. AppShell currently passes the navigation
fields understood by AppTray; AppTray's full contract is documented in its spec.

**Slots:** the default slot is page content rendered directly in `<main>`. The
named `head` slot appends page-specific elements to `<head>` after the title.

**Component structure:**

| File | Contents |
|---|---|
| `src/components/AppShell.astro` | Astro layout — html, head, body, AppTray, AppBar, content slot. Scoped `<style>` owns flex layout, content area sizing, and container query setup. |

The shell imports `base.css`. Pages using the shell do not need to import it.

### Anti-Patterns

- **No page-level document tags** — Pages using the shell must not declare `<html>`, `<head>`, or `<body>`. The shell owns the document.
- **No duplicate style imports** — The shell imports `base.css` once. Pages must not import it again.
- **No content-aware shell** — The shell does not know what page it renders. It provides structure and slots.
- **No fixed pixel dimensions** — All padding and sizing derive from spacing tokens.
- **No shell without navigation** — The shell always includes AppTray. Pages without navigation should not use the shell.
- **No content layout in the shell** — Consumers provide ContentGrid or another content wrapper for gutters, measure, columns, and breakouts.

## Contract

### Definition of Done

- [x] `AppShell.astro` provides full document skeleton with AppBar, AppTray, and content slot
- [ ] Both apps use the shell as their base layout on all pages
- [x] Top app bar is rendered via the `AppBar` component (see app-bar spec)
- [x] Content pane (`<main>`) declares `container-type: inline-size` and `container-name: content` for consumer queries
- [x] Content pane fills the viewport below the app bar and is the shell's vertical scroll owner
- [x] Content area participates in the scaffold flex geometry when rail/tray width changes
- [x] Named `head` slot allows page-specific `<head>` content
- [x] AppShell leaves gutters and readable measure to a consumer ContentGrid
- [x] Design-system demo has a representative `/app-shell/` page
- [ ] No duplicate `<html>`, `<head>`, or `base.css` imports across pages
- [x] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

- Shell must always render AppTray — navigation is not optional
- Content pane must never overlap with the rail on medium+ viewports
- Content pane must never be hidden behind the app bar or burger
- The final content remains reachable without compensating or magic bottom padding
- Pages must not contain `<html>` or `<body>` tags when using the shell
- Top bar title must be visible at all breakpoints

### Scenarios

Scenario: Page uses shell layout
  Given: A page imports AppShell and uses it as its layout
  When: The page is rendered
  Then: The HTML has correct document structure, FontLinks, AppTray, top bar with title, and page content in the default slot

Scenario: Content responds to tray on desktop
  Given: Viewport is 780px or above
  When: The user opens the tray
  Then: The top bar and content pane shift right as the tray pushes into the flex row

Scenario: Medium overlay does not define push behavior
  Given: Viewport is between 620px and 779px
  When: The user opens the tray
  Then: The drawer and scrim establish an overlay contract
  And: The overlay contract makes no promise that content geometry remains fixed or is pushed

Scenario: Content owns remaining viewport height
  Given: A page contains more content than fits below the app bar
  When: The page is viewed at any supported viewport size
  Then: The content pane fills the remaining height, scrolls vertically, and exposes its final content

Scenario: App bar clears navigation at all breakpoints
  Given: The shell renders with AppBar and AppTray
  When: Viewed at any viewport size
  Then: The app bar's 64px left margin clears the hamburger button (small), and flex layout clears the rail (medium+)

Scenario: Page injects head content
  Given: A page passes styles via the `head` slot
  When: The page is rendered
  Then: The styles appear inside `<head>` alongside the shell defaults

Scenario: Both apps share the same shell
  Given: Both apps import AppShell from the design system
  When: Both are built
  Then: Both produce pages with identical scaffold structure, differing only in content and nav items
