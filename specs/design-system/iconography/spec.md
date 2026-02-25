# Feature: Iconography

## Blueprint

### Context

Icons provide visual affordances for actions, navigation, and status across FREE//FALL. Google Material Symbols is the icon set — ligature-based, loaded from Google Fonts alongside the typography fonts. The Sharp variant matches the hard-edged deep space aesthetic.

Parent spec: `specs/design-system/spec.md`

### Architecture

**Icon set:** [Google Material Symbols](https://fonts.google.com/icons) — Sharp variant

**Loading:** Google Fonts stylesheet, loaded via the existing `FontLinks` component (no separate component needed):

```
https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp&display=block
```

The `display=block` parameter prevents Flash of Unstyled Content — without it, the ligature text (e.g. "arrow_forward") is briefly visible before the font loads.

**Subsetting:** The Google Fonts URL supports an `&icon_names=` parameter to load only the icons used. Start without subsetting; add it as an optimization when the icon set stabilizes.

**Usage:** Ligature-based — the icon name is the text content of a `<span>`:

```html
<span class="material-symbols-sharp">arrow_forward</span>
```

The text content is readable by screen readers, so standalone icons are accessible by default. When an icon is purely decorative (adjacent to visible text), hide it:

```html
<span class="material-symbols-sharp" aria-hidden="true">arrow_forward</span> Next
```

Icons inherit `color` and scale with `font-size` from their parent.

**Base CSS class** (in `typography.css`):

```css
.material-symbols-sharp {
  font-family: "Material Symbols Sharp";
  font-weight: normal;
  font-style: normal;
  font-size: 1.25em;
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
}
```

**File locations:**

| File | Contents |
|---|---|
| `src/components/FontLinks.astro` | Updated — adds Material Symbols Sharp stylesheet alongside existing font links |
| `src/styles/typography.css` | Updated — adds `.material-symbols-sharp` base class |

No separate `IconLinks` component — icons load through the same `FontLinks` component since both are Google Fonts resources.

### Anti-Patterns

- **No inline SVG icons** — All icons come from Material Symbols. Do not import SVG files or embed `<svg>` markup for icons available in the set.
- **No other icon libraries** — Material Symbols Sharp is the single source. Do not mix with Phosphor, Font Awesome, Lucide, etc.
- **No direct Google Fonts icon URLs in app code** — The URL lives in `FontLinks` only.
- **No class-based icon fonts** — Material Symbols uses ligatures. Do not introduce `:before` pseudo-element icon systems.
- **No other Material Symbols variants** — Sharp only. Do not add Outlined or Rounded stylesheets.

## Contract

### Definition of Done

- [ ] `FontLinks.astro` includes the Material Symbols Sharp stylesheet `<link>` tag with `display=block`
- [ ] `typography.css` defines the `.material-symbols-sharp` base class
- [ ] Demo app has an iconography reference page showing sample icons at various sizes
- [ ] Icons are accessible — ligature text is readable by screen readers
- [ ] Icons inherit color and scale with font-size
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass
- [ ] Built HTML contains the Material Symbols stylesheet `<link>` tag and zero `<script>` tags

### Regression Guardrails

- Material Symbols Sharp font URL in `FontLinks.astro` must include `display=block`
- No icon markup may use a class other than `material-symbols-sharp`
- Decorative icons adjacent to text must have `aria-hidden="true"`

### Scenarios

Scenario: Icons render in production build
  Given: An app uses `FontLinks` in its base layout
  When: The site is built and served
  Then: The HTML `<head>` contains a stylesheet link to Material Symbols Sharp on Google Fonts

Scenario: Icons are accessible by default
  Given: A standalone icon `<span class="material-symbols-sharp">search</span>`
  When: A screen reader encounters it
  Then: The text "search" is announced

Scenario: Decorative icons are hidden from assistive tech
  Given: An icon is adjacent to visible text conveying the same meaning
  When: The icon has `aria-hidden="true"`
  Then: The screen reader skips the icon and reads only the visible text

Scenario: Icons inherit text color
  Given: An icon is placed inside an element with `color: var(--freefall-alert-base)`
  When: The page renders
  Then: The icon displays in the same color

Scenario: Icons scale with font-size
  Given: An icon is placed in a container with `font-size: 2rem`
  When: The page renders
  Then: The icon renders at 2rem size

Scenario: Iconography demo page
  Given: The demo app is built
  When: A developer navigates to the iconography page
  Then: Sample icons are rendered at multiple sizes with their names labeled
