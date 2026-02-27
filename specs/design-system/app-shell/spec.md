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
      <AppTray items={navItems} />
      <div class="app-shell__body">
        <AppBar title={title} />
        <main class="app-shell__content">
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
| Small (< 620px) | Hidden (burger fixed top-left) | Full width, 80px left margin clears burger | Full width, padded |
| Medium (tablet) | Rail visible (flex column, left) | Fills remaining width, 80px left margin clears rail | Fills remaining width after rail |
| Large (desktop) | Rail visible, tray pushes | Fills remaining width, 80px left margin clears rail | Fills remaining width, max-width constrained |

The `.app-shell` is a flex row. The AppTray's rail participates in the flex flow. The `.app-shell__body` (bar + content) takes remaining space via `flex: 1`.

**Dimensions (grid-derived):**

| Dimension | Formula | Resolves to |
|---|---|---|
| Content padding (small) | `var(--freefall-space-2)` | 1rem |
| Content padding (medium+) | `var(--freefall-space-4)` | 2rem |
| Content max-width (large) | `calc(120 * var(--freefall-space-1))` | 60rem |

Top bar dimensions and styling are defined in the app-bar spec (`specs/design-system/app-bar/spec.md`).

**Props:**

| Prop | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | yes | Page `<title>` and top bar title |
| `navItems` | `NavItem[]` | yes | Passed through to AppTray |

**Component structure:**

| File | Contents |
|---|---|
| `src/components/AppShell.astro` | Astro layout — html, head, body, AppTray, AppBar, content slot |
| `src/styles/app-shell.css` | Flex layout, content area sizing, responsive padding |

The shell imports `base.css`. Pages using the shell do not need to import it.

**Relationship to base.css:**

The current body padding and max-width rules in `base.css` are shell concerns. They should move into `app-shell.css`. The `body` in `base.css` should only set `background`, `color`, and `overflow-x`. This avoids conflicts — the shell controls content spacing, not `body`.

### Anti-Patterns

- **No page-level document tags** — Pages using the shell must not declare `<html>`, `<head>`, or `<body>`. The shell owns the document.
- **No duplicate style imports** — The shell imports `base.css` once. Pages must not import it again.
- **No content-aware shell** — The shell does not know what page it renders. It provides structure and slots.
- **No fixed pixel dimensions** — All padding and sizing derive from spacing tokens.
- **No shell without navigation** — The shell always includes AppTray. Pages without navigation should not use the shell.
- **No layout logic in pages** — Padding, max-width, and content positioning are shell concerns. Pages provide content, not structure.

## Contract

### Definition of Done

- [ ] `AppShell.astro` provides full document skeleton with AppBar, AppTray, and content slot
- [ ] Both apps use the shell as their base layout on all pages
- [ ] Top app bar is rendered via the `AppBar` component (see app-bar spec)
- [ ] Content pane has responsive padding and max-width via spacing tokens
- [ ] Content area shifts when rail is visible (medium+) and when tray pushes (desktop)
- [ ] Named `head` slot allows page-specific `<head>` content
- [ ] Body padding/max-width moved from `base.css` to `app-shell.css`
- [ ] No duplicate `<html>`, `<head>`, or `base.css` imports across pages
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

- Shell must always render AppTray — navigation is not optional
- Content pane must never overlap with the rail on medium+ viewports
- Content pane must never be hidden behind the app bar or burger
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

Scenario: App bar clears navigation at all breakpoints
  Given: The shell renders with AppBar and AppTray
  When: Viewed at any viewport size
  Then: The app bar's 80px left margin clears the hamburger button (small) and rail (medium+)

Scenario: Page injects head content
  Given: A page passes styles via the `head` slot
  When: The page is rendered
  Then: The styles appear inside `<head>` alongside the shell defaults

Scenario: Both apps share the same shell
  Given: Both apps import AppShell from the design system
  When: Both are built
  Then: Both produce pages with identical scaffold structure, differing only in content and nav items
