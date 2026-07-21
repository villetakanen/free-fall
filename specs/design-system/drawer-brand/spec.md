# Feature: Drawer Brand

## Blueprint

### Context

The drawer brand is a compact branding strip anchored to the bottom of the navigation drawer (AppTray). It attributes the publication to its publisher (Kustannusosakeyhtiö Myrrys) and declares the dual licence. In rail mode only the Myrrys logo mark (nine-tail) is shown; when the drawer opens to full width the copyright notice and licence identifier appear beside it, both linking to a configurable destination.

The link target differs by consuming app:

| App | Link destination |
|---|---|
| `@free-fall/app` | `/about` — publication details and licence explanation |
| `@free-fall/design-system-docs` | `/drawer-brand` — component reference page |

Parent spec: `specs/design-system/app-tray/spec.md`

### Architecture

**Anatomy:**

```
Rail mode (80 px)          Open mode (320 px)
+----------+               +----------+----------------------------+
|          |               |          | © Kustannusosakeyhtiö      |
| nine-tail|               | nine-tail|   Myrrys                   |
|   logo   |               |   logo   | MIT / CC-BY                |
|          |               |          |                            |
+----------+               +----------+----------------------------+
```

The entire strip is a single `<a>` element wrapping the logo and caption. This keeps the click target large and accessible.

**Responsive behaviour — CSS Container Query:**

The component reuses the same container-query pattern as `TrayButton`. The
AppTray `.drawer` declares `container-type: inline-size`. When its query box is
narrow, the caption is visually hidden; when it is wider, the caption appears.

```
@container (max-width: 64px) → hide caption, center logo
@container (min-width: 64.01px) → show caption beside logo
```

No media queries — all layout shifts are driven by the parent container width.

**Placement inside AppTray:**

The component renders as the last child of AppTray's flex-column `.drawer`.
The preceding `.nav` uses `flex: 1`, so the brand occupies the drawer's bottom
position while navigation owns and scrolls the remaining space.

**Component structure:**

| File | Contents |
|---|---|
| `src/components/DrawerBrand.astro` | Astro component — `<a>` wrapper, inline SVG logo, caption text |
Styles are co-located in `DrawerBrand.astro`.

**Props:**

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `href` | `string` | `"/about"` | Link destination for the branding strip |

**Dimensions (grid-derived):**

| Dimension | Formula | Resolves to |
|---|---|---|
| Logo size | `calc(4 * var(--freefall-space-1))` | 2rem (32px) |
| Strip padding | `var(--freefall-space-2)` | 1rem (16px) |
| Gap (logo ↔ text) | `var(--freefall-space-2)` | 1rem (16px) |

**Logo rendering:**

The Myrrys logo SVG (`src/assets/myrrys-logo.svg`) is imported with `?raw` and
rendered inline via `set:html`. Its two paths use the same solid `#EDA01B` fill.
CSS does not override that native fill. The mark has a thin link-colored border
and token-derived inset padding.

**Caption text:**

Two lines inside a `<span>`, styled with the `.text-caption` editorial class:

```
© Myrrys 2026
MIT / CC-BY
```

The text uses `var(--freefall-text-muted)` colour and `letter-spacing: 0.05em` (inherited from `.text-caption`). The line break is a `<br>` — no dynamic layout.
The fixed accessible name is `Kustannusosakeyhtiö Myrrys`, preserving
the full publisher name independently of the compact visible copy.

**Link styling:**

The `<a>` wrapper resets text-decoration and inherits colour. On `:hover` / `:focus-visible`, the caption text shifts to `var(--freefall-text-body)` for a subtle highlight. Focus outline follows the standard `--freefall-action-base` accent ring.

**No JavaScript required.** Pure HTML + CSS.

### Anti-Patterns

- **No separate rail/tray DOM** — One set of elements adapts via container query. Do not duplicate the logo or conditionally render different markup for rail vs tray.
- **No raw px/rem values** — All dimensions derive from `--freefall-space-1`.
- **No framework island** — Astro component, server-rendered. No client-side JS.
- **No CSS fill overrides on the logo** — Preserve the source SVG's solid fill.
- **No content duplication** — The licence text lives only in this component. The about page explains the terms; the component merely links to it.

## Contract

### Definition of Done

- [x] `DrawerBrand.astro` renders inside `AppTray` as the final child after the flexible nav
- [x] `href` prop defaults to `"/about"` and is configurable by consuming apps
- [x] Rail mode (query box ≤ 64px): only the logo is visible and centered
- [x] Open mode (query box > 64px): logo and caption text appear side-by-side
- [x] Caption reads "© Myrrys 2026" / "MIT / CC-BY" with `.text-caption` styling
- [x] The entire strip is a single `<a>` element
- [x] Logo renders with its native solid fill
- [x] Dimensions derive from spacing tokens
- [x] Container-query driven with no component media query
- [x] Hover and keyboard focus provide visible feedback; focus has an accent outline
- [x] Styles are co-located in `DrawerBrand.astro`
- [x] Design-system demo app has a `/drawer-brand/` reference page with real query containers
- [x] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

- The branding strip must never overlap nav items; the flexible, scrollable nav precedes it
- Logo must remain visible in rail mode — do not hide the entire component when the tray is collapsed
- Link must be keyboard-focusable and have a visible focus indicator
- Caption must not wrap to a third line at tray width (320px) — verify the Finnish publisher name fits
- Do not introduce JavaScript — this is a static branding element

### Scenarios

Scenario: Rail mode — logo only
  Given: The AppTray is in rail mode (closed, medium or large viewport)
  When: The page renders
  Then: Only the nine-tail logo is visible inside the branding strip, vertically centered at the bottom of the rail

Scenario: Open mode — logo and caption
  Given: The AppTray is open (full tray width)
  When: The drawer expands
  Then: The caption text "© Myrrys 2026" / "MIT / CC-BY" appears to the right of the logo

Scenario: Link navigates to about page (app)
  Given: The DrawerBrand is rendered in `@free-fall/app` with default `href`
  When: The user clicks the branding strip
  Then: Navigation goes to `/about`

Scenario: Link navigates to component page (design system docs)
  Given: The DrawerBrand is rendered in `@free-fall/design-system-docs` with `href="/drawer-brand"`
  When: The user clicks the branding strip
  Then: Navigation goes to `/drawer-brand`

Scenario: Hover feedback
  Given: The branding strip is visible
  When: The user hovers over it
  Then: The caption text colour shifts from muted to body colour

Scenario: Keyboard accessibility
  Given: The branding strip is rendered
  When: The user tabs to the `<a>` element
  Then: A visible focus ring appears using the accent outline token

Scenario: No-JS baseline
  Given: JavaScript is disabled
  When: The page renders
  Then: The branding strip renders correctly — layout, container-query adaptation, and link all work without JS
