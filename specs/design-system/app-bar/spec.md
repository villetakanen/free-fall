# Feature: App Bar

## Blueprint

### Context

The app bar is the horizontal bar at the top of every page. It displays the page title and provides a slot for trailing actions (e.g., avatar, settings icon, dice roller trigger). It follows the Material Design 3 top app bar pattern — a simple, transparent bar that sits above the content pane.

Currently the app-shell owns the top bar inline (a `<header>` with a `<span>` for the title). Extracting it into a standalone component enables reuse across both apps, supports slotted trailing actions, and gives the design system a dedicated demo page.

Parent spec: `specs/design-system/spec.md`

### Architecture

**Anatomy:**

```
+--[80px margin]--+--Title-----------[  slot  ]--+
|   (rail/burger  |                   (actions)   |
|    clearance)   |                               |
+-----------------+-------------------------------+
```

The bar is a flex row. The left margin clears the fixed hamburger button / navigation rail. The title sits at the left edge of the bar's content area. The default slot is a flex container that pushes its children to the right end.

**Dimensions (grid-derived):**

| Dimension | Formula | Resolves to |
|---|---|---|
| Bar height | `calc(8 * var(--freefall-space-1))` | 4rem (64px) |
| Left margin | `calc(10 * var(--freefall-space-1))` | 5rem (80px) |
| Horizontal padding | `var(--freefall-space-2)` | 1rem (16px) |

The left margin of `calc(10 * var(--freefall-space-1))` matches the rail width from the app-tray spec. On small viewports (< 620px) where the rail is hidden, the same margin clears the fixed hamburger button (48px button + 16px left offset = 64px, within the 80px margin).

**Surface styling:**

| Property | Value |
|---|---|
| Background | `transparent` (no background color) |
| Title color | `--freefall-text-display` |
| Title font size | h4 scale: `calc(var(--freefall-type-ratio) * 2 * var(--freefall-space-1))` |

**Props:**

| Prop | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | yes | Text displayed as the bar title |

**Slot:**

The default `<slot />` renders inside a flex container with `margin-left: auto`, pushing all slotted children to the right end of the bar. The slot container is itself a flex row with `align-items: center` and `gap: var(--freefall-space-1)` for consistent spacing between action items.

**Component structure:**

| File | Contents |
|---|---|
| `src/components/AppBar.astro` | Astro component — `<header>` with title and trailing action slot |
| `src/styles/app-bar.css` | Flex layout, dimensions, transparent background, slot alignment |

**Integration with AppShell:**

The AppShell replaces its inline `<header class="app-shell__bar">` with `<AppBar title={title}>`. The top bar styles move from `app-shell.css` to `app-bar.css`. The `app-shell__bar` and `app-shell__title` CSS rules are removed.

**Dependencies:**

- **Depends on:** design-tokens (colors, spacing), typography (type ratio)
- **Depended on by:** app-shell (renders the bar), design-system demo app (demo page)

### Anti-Patterns

- **No background color** — The bar is transparent. Do not add `--freefall-bg-surface-1` or any background. The content pane's scroll area provides visual separation.
- **No border** — Do not add a bottom border. The bar is a clean, floating element.
- **No fixed pixel dimensions** — All sizing derives from spacing tokens via `calc()`.
- **No content-awareness** — The bar does not know what page it is on. It receives a title prop and renders a slot.
- **No responsive margin changes** — The 80px left margin is constant across all breakpoints. It clears the rail on medium+ and the burger on small.
- **No wrapping slot items** — The trailing slot is `flex-wrap: nowrap`. If too many items are added, they overflow — that's a consumer concern, not the bar's.

## Contract

### Definition of Done

- [ ] `AppBar.astro` renders a `<header>` with title prop and default slot for trailing actions
- [ ] Bar has transparent background, no border
- [ ] Left margin is `calc(10 * var(--freefall-space-1))` (80px) at all breakpoints
- [ ] Bar height is `calc(8 * var(--freefall-space-1))` (64px)
- [ ] Default slot content is pushed to the right end of the bar via `margin-left: auto` on the slot container
- [ ] Slot container is a flex row with `align-items: center` and `gap: var(--freefall-space-1)`
- [ ] All dimensions use `calc()` with `--freefall-space-1` — no raw px/rem
- [ ] `AppShell.astro` uses `AppBar` instead of inline header markup
- [ ] `app-shell.css` no longer contains top bar styles (moved to `app-bar.css`)
- [ ] Design system demo app has an `/app-bar/` page demonstrating the title prop and slotted actions
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

- Bar must never have a visible background — `transparent` only
- Left margin must be constant (80px equivalent) across all viewport sizes
- Slotted content must always align to the right end of the bar
- Title must remain visible and not overlap with the left margin area
- The bar must not introduce any JavaScript — it is a pure Astro/CSS component

### Scenarios

Scenario: Bar renders with title
  Given: A page renders `<AppBar title="Design Tokens" />`
  When: The page loads
  Then: A `<header>` is visible with "Design Tokens" displayed as the title text, left-aligned after the 80px margin

Scenario: Slotted actions align right
  Given: A page renders `<AppBar title="Home"><button>Settings</button></AppBar>`
  When: The page loads
  Then: The "Settings" button appears at the right end of the bar, vertically centered

Scenario: Multiple slotted items have consistent spacing
  Given: A page renders `<AppBar title="Home"><span>A</span><span>B</span></AppBar>`
  When: The page loads
  Then: Items A and B appear at the right end with `--freefall-space-1` gap between them

Scenario: Bar clears navigation at all breakpoints
  Given: The app renders with AppTray and AppBar
  When: Viewed at small (< 620px), medium (620–779px), and large (>= 780px) viewports
  Then: The bar title never overlaps with the hamburger button or navigation rail

Scenario: Bar is transparent
  Given: The app bar renders
  When: The page has scrollable content behind it
  Then: The bar has no visible background — content behind it (if any) shows through

Scenario: Demo page showcases component
  Given: The design system demo app is built
  When: A developer navigates to `/app-bar/`
  Then: The page shows the AppBar with a title and example slotted action items
