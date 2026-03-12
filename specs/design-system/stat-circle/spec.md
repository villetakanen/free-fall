# Feature: Stat Circle

## Blueprint

### Context

Character attributes in FREE//FALL map to three domains — Body, Mind, Ghost. Many game elements (gear binding costs, character stats, augmentation requirements) need a compact visual indicator for a single attribute value. The Stat Circle renders one attribute as a small colored circle with an optional label, designed for inline use in cards, stat blocks, and lists.

### Architecture

#### Component Location

`packages/design-system/src/components/StatCircle.astro`

Pure Astro component with scoped `<style>`. Zero JS runtime.

#### Props

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `type` | `"body" \| "mind" \| "ghost"` | Yes | — | Determines color palette |
| `attribute` | `string` | No | — | Label text rendered below the circle |
| `value` | `number \| null` | Yes | — | Numeric value displayed; `null` = disabled |
| `disabled` | `boolean` | No | `false` | Forces disabled state regardless of value |
| `bound` | `boolean` | No | `false` | Highlights the circle as actively bound |

#### Anatomy

```
     ┌─────┐
     │  2  │   ← .stat-circle (colored circle with value)
     └─────┘
      BODY     ← .stat-circle__label (optional, below circle)
```

The wrapper `.stat-circle-wrap` is an inline-flex column. When `attribute` is provided, the wrapper gets a `--labeled` modifier that adds a gap between circle and label.

#### Visual States

**Unbound (default):** Diagonal split gradient at 150deg. Background color (`--_sc-bg`) fills 75% from top-left; foreground color (`--_sc-fg`) fills the remaining 25% in the bottom-right corner. No border on any variant.

**Bound:** Solid `--_sc-fg` background. Text color switches to `--freefall-color-primary-950`. Subtle white glow via `box-shadow`.

**Disabled:** Triggered when `disabled` is true OR `value` is null. Uses default cobalt palette (`primary-700` / `primary-500`). Value displays as `∅` (U+2205). Text color is `primary-200`. A disabled circle cannot be bound — `isBound = !isDisabled && bound`.

#### Type Colors

Each type overrides the private `--_sc-bg` and `--_sc-fg` tokens:

| Type | `--_sc-bg` | `--_sc-fg` |
|---|---|---|
| body | `--freefall-attr-body-bg` (Flare Orange dark) | `--freefall-attr-body` (Flare Orange) |
| mind | `--freefall-attr-mind-bg` (Tritium Green dark) | `--freefall-attr-mind` (Tritium Green) |
| ghost | `--freefall-attr-ghost-bg` (Isotope Neon dark) | `--freefall-attr-ghost` (Isotope Neon) |

#### Sizing

Default size: 5 grid units (2.5 rem). Overridable via `--freefall-stat-circle-size` custom property set on any ancestor. The value is unitless — multiplied by `--freefall-space-1`.

Value text scales proportionally: `0.55 * size * --freefall-space-1`. Always bold (700), always `primary-50`, with a 3-layer text shadow in `primary-800` (2px, 4px, 8px blur). Maximum expected value is 36 (two digits).

#### Label Rules

- Rendered only when `attribute` prop is provided.
- Truncated to 5 characters max, forced uppercase: `attribute.slice(0, 5).toUpperCase()`.
- Uses DS typography class `.text-ui-small` — no custom font sizing.
- Color: `--freefall-text-muted`.
- The circle itself never contains letters — only the numeric value or `∅`.

#### CSS Token Architecture

The base `.stat-circle` class declares four private tokens with defaults:

```css
--_stat-circle-size: var(--freefall-stat-circle-size, 5);
--_sc-bg: var(--freefall-color-primary-700);
--_sc-fg: var(--freefall-color-primary-500);
--_sc-text: var(--freefall-color-primary-50);
--_sc-slice: 75%;
```

Type modifier classes (`.stat-circle--body`, etc.) override only `--_sc-bg` and `--_sc-fg`. The gradient declaration lives once in the base class, reading from these tokens. This keeps the gradient DRY — type classes never redeclare the `background` property.

### Dependencies

- **Depends on:** Design tokens (`tokens.css` — attribute color tokens, primary palette, spacing), typography classes (`typography.css` — `.text-ui-small`)
- **Depended on by:** `EquipmentCard.astro` (binding cost row), future character sheet components

### Anti-Patterns

- **No letters inside the circle.** The circle shows only numeric values or `∅`. Labels go below.
- **No border on any variant.** The gradient and solid fills provide sufficient visual weight.
- **No fixed pixel values.** All sizing via `calc(N * var(--freefall-space-1))`.
- **No framework island.** Pure Astro component with scoped CSS. Zero JS runtime.
- **No gradient duplication.** The gradient is declared once in the base class; type classes override tokens only.

## Contract

### Definition of Done

- [ ] StatCircle renders all three types (body, mind, ghost) with correct attribute colors
- [ ] Disabled state renders `∅` in cobalt colors when `disabled` is true or `value` is null
- [ ] Bound state shows solid foreground color with glow; disabled circles ignore `bound`
- [ ] Optional `attribute` label renders below the circle, uppercase, max 5 chars, `.text-ui-small`
- [ ] Custom sizing via `--freefall-stat-circle-size` scales circle and value text proportionally
- [ ] Component passes `pnpm typecheck`
- [ ] Design system demo page at `/stat-circle/` exercises all variants

### Regression Guardrails

- Circle must never contain letters — only numeric value or `∅`
- No borders on any variant
- Disabled always wins over bound: `isBound = !isDisabled && bound`
- `value === null` and `disabled === true` must produce identical visual output
- Gradient declared exactly once in base `.stat-circle` — type classes override tokens only

### Scenarios

```
Scenario: Body type with value
  Given: type="body", value=2
  When: Rendered as StatCircle
  Then: Circle shows "2" with Flare Orange gradient (body-bg → body), no label

Scenario: Null value equals disabled
  Given: type="mind", value=null
  When: Rendered as StatCircle
  Then: Circle shows "∅" in cobalt colors (primary-700/500), text in primary-200

Scenario: Explicit disabled with value
  Given: type="ghost", value=3, disabled=true
  When: Rendered as StatCircle
  Then: Circle shows "∅" in cobalt colors, value 3 is ignored

Scenario: Bound state
  Given: type="body", value=2, bound=true
  When: Rendered as StatCircle
  Then: Circle has solid --freefall-attr-body background, primary-950 text, white glow

Scenario: Disabled ignores bound
  Given: type="mind", value=null, bound=true
  When: Rendered as StatCircle
  Then: Circle shows "∅" in cobalt colors, bound is ignored

Scenario: Attribute label
  Given: type="body", attribute="Frame", value=24
  When: Rendered as StatCircle
  Then: Circle shows "24", label "FRAME" (5 chars, uppercase) appears below in text-ui-small

Scenario: Label truncation
  Given: type="mind", attribute="Systems", value=6
  When: Rendered as StatCircle
  Then: Label shows "SYSTE" (truncated to 5 chars)

Scenario: Custom sizing
  Given: type="ghost", value=3, ancestor has --freefall-stat-circle-size: 10
  When: Rendered as StatCircle
  Then: Circle diameter is 10 * --freefall-space-1, value text scales to 0.55 * 10 * space-1

Scenario: Value zero is not disabled
  Given: type="body", value=0
  When: Rendered as StatCircle
  Then: Circle shows "0" with Flare Orange gradient, not "∅"
```
