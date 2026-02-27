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

The component reuses the same container-query pattern as `TrayButton`. The `app-tray__rail-column` already declares `container-type: inline-size`. When the container is narrow (rail), the caption text is hidden; when the container is wide (tray open), the caption is revealed.

```
@container (max-width: 160px) → hide caption, center logo
@container (min-width: 161px) → show caption beside logo
```

No media queries — all layout shifts are driven by the parent container width.

**Placement inside AppTray:**

The component renders as the last child inside `.app-tray__rail-column`, below the `<nav>`. It is pushed to the bottom via `margin-top: auto` on the component's root element (the `.app-tray__rail-column` is already `display: flex; flex-direction: column`).

**Component structure:**

| File | Contents |
|---|---|
| `src/components/DrawerBrand.astro` | Astro component — `<a>` wrapper, inline SVG logo, caption text |
| `src/styles/drawer-brand.css` | Layout, container-query rules, spacing, link reset |

**Props:**

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `href` | `string` | `"/about"` | Link destination for the branding strip |

**Dimensions (grid-derived):**

| Dimension | Formula | Resolves to |
|---|---|---|
| Logo size | `calc(6 * var(--freefall-space-1))` | 3rem (48px) |
| Strip padding | `var(--freefall-space-2)` | 1rem (16px) |
| Gap (logo ↔ text) | `var(--freefall-space-2)` | 1rem (16px) |
| Bottom margin | `var(--freefall-space-2)` | 1rem (16px) |

**Logo rendering:**

The Myrrys logo SVG (`src/assets/myrrys-logo.svg`) is imported with `?raw` and rendered inline via `set:html`. The SVG contains two `<path>` elements with gradient fills (yellow-to-orange, `#ccda0b` → `#eda01b`) that define the brand identity. CSS must not override these fills — the logo renders with its native gradients at all times.

**Caption text:**

Two lines inside a `<span>`, styled with the `.text-caption` editorial class:

```
© Kustannusosakeyhtiö Myrrys
MIT / CC-BY
```

The text uses `var(--freefall-text-muted)` colour and `letter-spacing: 0.05em` (inherited from `.text-caption`). The line break is a `<br>` — no dynamic layout.

**Link styling:**

The `<a>` wrapper resets text-decoration and inherits colour. On `:hover` / `:focus-visible`, the caption text shifts to `var(--freefall-text-body)` for a subtle highlight. Focus outline follows the standard `--freefall-action-base` accent ring.

**No JavaScript required.** Pure HTML + CSS.

### Anti-Patterns

- **No separate rail/tray DOM** — One set of elements adapts via container query. Do not duplicate the logo or conditionally render different markup for rail vs tray.
- **No raw px/rem values** — All dimensions derive from `--freefall-space-1`.
- **No framework island** — Astro component, server-rendered. No client-side JS.
- **No CSS fill overrides on the logo** — The Myrrys logo uses intentional brand gradients. Do not override `fill` with `currentColor` or any other value.
- **No content duplication** — The licence text lives only in this component. The about page explains the terms; the component merely links to it.

## Contract

### Definition of Done

- [ ] `DrawerBrand.astro` renders inside `AppTray` as the last child of `.app-tray__rail-column`
- [ ] `href` prop defaults to `"/about"` and is configurable by consuming apps
- [ ] Rail mode (container ≤ 160px): only the nine-tail logo is visible, centered
- [ ] Open mode (container > 160px): logo and caption text appear side-by-side
- [ ] Caption reads "© Kustannusosakeyhtiö Myrrys" / "MIT / CC-BY" with `.text-caption` styling
- [ ] The entire strip is a single `<a>` element — accessible click target
- [ ] Logo renders with its native gradient fills (yellow-to-orange brand colours preserved)
- [ ] All dimensions use `calc()` with `--freefall-space-1` — no raw px/rem
- [ ] Container-query driven — no media queries in `drawer-brand.css`
- [ ] Hover/focus states provide visible feedback with accent outline
- [ ] `drawer-brand.css` is imported via `base.css`
- [ ] Design-system demo app has a `/drawer-brand` reference page
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

- The branding strip must never overlap or push nav items out of view — it sits below them with `margin-top: auto`
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
  Then: The caption text "© Kustannusosakeyhtiö Myrrys" / "MIT / CC-BY" appears to the right of the logo

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
