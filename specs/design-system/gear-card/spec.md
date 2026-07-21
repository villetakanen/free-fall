# Feature: Gear Card

## Blueprint

### Context

Gear items in FREE//FALL have structured mechanical data (binding costs, qualities, DV/AV, harm type, etc.) that is currently rendered as prose Markdown. A compact card component presents this data at a glance — optimized for scanning during play, not reading. The card intentionally omits flavor text and markdown body content; it shows only the mechanical "stat block."

The card matches **standard poker card proportions** (5:7 ratio). Players instinctively understand cards — sizing, information density, and grid tiling all benefit from this physical-object familiarity, even in a fully digital product.

### Architecture

#### Dimensions

Poker card proportions (5:7) expressed in grid units:

- Width: `calc(32 * var(--freefall-space-1))` (16 rem)
- Height: `calc(44.5 * var(--freefall-space-1))` (22.25 rem — 5:7 ratio)
- Border radius: `calc(2 * var(--freefall-space-1))`

All internal spacing derives from `--freefall-space-1`.

#### Card Anatomy (top to bottom)

```
┌──────────────────────────┐
│  Title                   │  ← .text-ui, overlaid top-left, color-primary-50
│  Subtitle (nickname)     │  ← .text-ui-small, overlaid, optional
│  [Image / Gear Icon]     │  ← 16:9 aspect ratio, shader overlay
├──────────────────────────┤
│  Category-specific stats │  ← DV, Harm Type, AV, etc.
│  ● Quality 1             │  ← Compact list (scrolls on overflow)
│  ● Quality 2             │
│  ● ...                   │
├──────────────────────────┤
│  ◉ Body  ◉ Mind  ◉ Ghost │  ← Binding row, straddles card bottom border
│  BODY    MIND    GHOST   │  ← Labels (hidden when void)
└──────────────────────────┘
```

#### Zones

1. **Image zone** — Top portion with `aspect-ratio: 16 / 9`. Displays an Astro-optimized `<Image>` (when `image` is `ImageMetadata`), a plain `<img>` (when `image` is a string URL), or falls back to a centered Material Symbol icon (category-specific). Background: `--freefall-bg-surface-2`. Images use `object-fit: cover`.

   **Shader overlay** — A `::after` pseudo-element covers the entire image zone with a semi-transparent gradient (`140deg`). The gradient runs from a start color at 55% opacity to `--freefall-color-primary-900` at 75% opacity. The start color is attribute-tinted when exactly one binding attribute is set: `--freefall-attr-body-bg` (body), `--freefall-attr-mind-bg` (mind), or `--freefall-attr-ghost-bg` (ghost). When zero or multiple attributes are bound, the start color falls back to `--freefall-color-primary-500`. The shader ensures text legibility over any image or icon background.

2. **Title overlay** — Positioned at the top of the image zone via `position: absolute` (`z-index: 1`, above shader). Title in `.text-ui` (bold) and optional nickname in `.text-ui-small`. Both use `--freefall-color-primary-50` with `--freefall-text-shadow-overlay` for legibility over any background. Both truncate with ellipsis on overflow.

3. **Binding cost row** — Row of 3 labeled `StatCircle` components (Body, Mind, Ghost) positioned at the **bottom border of the card** via a wrapper element (`.gear-card-wrap`) with `position: relative`. The row uses `position: absolute; bottom: 0; transform: translateY(50%)` so circles straddle the card's outer border — half inside, half outside. Each circle receives its `attribute` label ("Body", "Mind", "Ghost"). **All three circles are always rendered.** Binding values come from the top-level `body`, `mind`, `ghost` props. Omitted or zero-value props render the circle in void state (∅, no label). Arranged left-to-right: Body → Mind → Ghost, centered horizontally. See `specs/design-system/stat-circle/spec.md` for circle rendering details.

4. **Stats zone** — Remaining space, scrolls if overflow.
   - **Category stats row** (conditional per category):
     - Weapon: `DV {n}` + `{harm_type}`
     - Armor: `AV {n}` + `{av_type}`
     - Augmentation: `{augmentation_category}` + `{integration}`
      - Exo: `Frame {n}` / `Sys {n}` / `AV {n}` / `{size_category}`
      - Vehicle: `Frame {n}` / `Sys {n}` / `AV {n}` / `{size_category}`
     - Utility: (no category stats row)
   - **Qualities list** — Each quality as a single line, preceded by a bullet. `.text-ui-small`.

#### Data Contract

The component takes category-specific data via `data` and binding costs as separate top-level props. The `data` prop is a discriminated union on `data.category` matching the Zod schema in `apps/free-fall/src/content.config.ts`. Binding costs are **not** read from `data` — they are passed as independent props so the card can be used without a content collection entry.

Props:

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `data` | `GearData` | Yes | — | Discriminated union — component narrows on `data.category` |
| `body` | `number` | No | `undefined` | Body binding cost. Omitted or `0` → disabled (∅) |
| `mind` | `number` | No | `undefined` | Mind binding cost. Omitted or `0` → disabled (∅) |
| `ghost` | `number` | No | `undefined` | Ghost binding cost. Omitted or `0` → disabled (∅) |
| `image` | `ImageMetadata \| string` | No | `undefined` | Astro `ImageMetadata` for optimized images, or string URL for passthrough. Falls back to category icon. |

`GearData` always requires `title`, `qualities: string[]`, and a category;
`nickname` is optional. Category-specific fields are:

| Category | Required fields |
|---|---|
| `weapon` | `dv`, `harm_type: "Physical" \| "Psychic"` |
| `armor` | `av`, `av_type` |
| `augmentation` | `augmentation_category: "Spliced" \| "Bionic" \| "Cybernetic"`, `integration: "Invasive" \| "Field-Operable"` |
| `utility` | no additional fields |
| `exo` | `frame`, `systems`, `pilot_binding`, `vehicle_av`, `size_category` |
| `vehicle` | `frame`, `systems`, `pilot_binding`, `vehicle_av`, `size_category` |

`pilot_binding` contains numeric `body`, `mind`, and `ghost` values.
`size_category` is `"Personal" | "Small" | "Medium" | "Large" | "Huge"`.
Fallback icons are `swords`, `shield`, `biotech`, `handyman`, and
`rocket_launch`; exo intentionally shares `rocket_launch` with vehicle until a
distinct approved symbol exists.

#### Component Location

`packages/design-system/src/components/GearCard.astro`

Scoped `<style>` block — no new CSS file in `styles/`. The card is self-contained.

### Dependencies

- **Depends on:** Design tokens (`tokens.css`), typography classes (`typography.css`), `StatCircle.astro` (binding cost display), Astro `<Image>` component (`astro:assets`), gear Zod schema
- **Depended on by:** Gear catalog pages (future card-grid view)

### Anti-Patterns

- **No markdown rendering inside the card.** The card is a structured data view. Flavor text, binding rationale, and prose descriptions belong on the full gear detail page, not here.
- **No interactive state.** The card is a static presentation component. Click-to-expand or tooltips belong in a wrapper, not in the card itself.
- **No fixed pixel values.** All sizing via `calc(N * var(--freefall-space-1))` per design system convention.
- **No framework island.** Pure Astro component with scoped CSS. Zero JS runtime.

## Contract

### Definition of Done

- [x] `GearCard.astro` renders all 6 categories (weapon, armor, augmentation, utility, exo, vehicle)
- [x] All three binding StatCircles always render; omitted or zero-value props appear as void (∅)
- [x] Card uses fixed 32 by 44.5 spacing-unit dimensions
- [x] Image zone uses `aspect-ratio: 16 / 9`; accepts `ImageMetadata` or string URL
- [x] Every category has an intentional fallback icon, with exo sharing vehicle's icon
- [x] Shader overlay covers the image zone with a single-binding tint or action-base fallback
- [x] Qualities live in the scrolling stats zone
- [x] Component passes `pnpm typecheck` with strict category narrowing (no `any` casts)
- [ ] Visual regression: card renders identically in Chromium and Firefox

### Regression Guardrails

- Card must never render markdown body content — only structured `data` fields
- All three binding circles (Body, Mind, Ghost) must always be present in that order
- Card width/height ratio must stay within 5:7 ± 1%
- Title must overlay the image zone, never be a separate section below it
- Shader overlay must always be present on the image zone (both image and icon fallback)
- Title overlay and icon must have `z-index` above the shader
- Binding row must straddle the card's bottom border (not the image zone border)

### Scenarios

```
Scenario: Weapon card with body binding
  Given: <GearCard data={weapon} body={1} /> where weapon has DV 2, harm_type "Physical", qualities ["Range (Medium)", "Burst Fire"]
  When: Rendered
  Then: Three StatCircles straddle the card's bottom border
  And: Body (1) is active with "BODY" label; Mind and Ghost show ∅ with no labels (void)
  And: Title and nickname overlay the image zone with --freefall-text-shadow-overlay
  And: Stats zone shows "DV 2 · Physical"
  And: Two quality bullets are listed

Scenario: No image fallback
  Given: <GearCard data={utility} /> with no image prop
  When: Rendered
  Then: Image zone shows a centered category icon on --freefall-bg-surface-2
  And: Shader overlay covers the icon area with the same gradient

Scenario: Optimized image via ImageMetadata
  Given: <GearCard data={weapon} body={1} image={importedImage} /> where importedImage is Astro ImageMetadata
  When: Rendered
  Then: Image zone renders an Astro <Image> component with object-fit: cover
  And: Shader overlay is visible over the image

Scenario: All three binding costs
  Given: <GearCard data={weapon} body={2} mind={1} ghost={1} />
  When: Rendered
  Then: Three circles straddle card bottom: Body (2), Mind (1), Ghost (1), all with labels

Scenario: Omitted binding props render as void
  Given: <GearCard data={weapon} body={1} />
  When: Rendered
  Then: Body circle shows 1 with "BODY" label; Mind and Ghost show ∅ with no labels

Scenario: Vehicle card stats
  Given: <GearCard data={vehicle} /> where vehicle has frame 3, systems 2, vehicle_av 1, size_category "Medium"
  When: Rendered
  Then: Stats zone shows "Frame 3 · Sys 2 · AV 1 · Medium"

Scenario: Exo card and fallback
  Given: <GearCard data={exo} /> where exo has category "exo" and no image
  When: Rendered
  Then: Stats zone renders the exo FRM/SYS/AV/size data
  And: Image zone renders the intentional rocket_launch fallback icon

Scenario: Single-attribute shader tint
  Given: <GearCard data={augmentation} ghost={3} />
  When: Rendered
  Then: Shader gradient starts from --freefall-attr-ghost-bg (accent-900) at 55% opacity

Scenario: Multi-attribute shader fallback
  Given: <GearCard data={weapon} body={1} mind={1} ghost={1} />
  When: Rendered
  Then: Shader gradient starts from --freefall-color-primary-500 at 55% opacity

Scenario: No-binding shader fallback
  Given: <GearCard data={utility} />
  When: Rendered
  Then: Shader gradient starts from --freefall-color-primary-500 at 55% opacity

```
