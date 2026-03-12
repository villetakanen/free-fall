# Feature: Attribute Color Tokens

## Blueprint

### Context

FREE//FALL has three core character attributes — **Body**, **Mind**, and **Ghost** — that appear throughout the UI: binding cost circles on equipment cards, character sheets, dice roll results, and status indicators. Each attribute needs a dedicated color identity that is instantly recognizable across all contexts.

These colors also extend beyond character attributes to thematic domains that share the same conceptual space:

| Attribute | Thematic aliases | Color name |
|---|---|---|
| Body | Physical, Hull, Structural | Flare Orange |
| Mind | Cognitive, AI, Systems | Tritium Green |
| Ghost | Social, Psychic, Composure | Isotope Neon (existing accent) |

Parent spec: `specs/design-system/design-tokens/spec.md`

### Architecture

**New base palette scales** added to `tokens.css` alongside the existing `primary` and `accent` scales:

**Flare Orange** (`body`)

| Step | HSL | Role |
|---|---|---|
| 400 | `hsl(18, 90%, 55%)` | Body attribute — foreground, badges, circles |
| 900 | `hsl(18, 60%, 15%)` | Body attribute — dark background, tinted surface |

**Tritium Green** (`mind`)

| Step | HSL | Role |
|---|---|---|
| 400 | `hsl(158, 85%, 65%)` | Mind attribute — foreground, badges, circles |
| 900 | `hsl(158, 60%, 15%)` | Mind attribute — dark background, tinted surface |

**Ghost** reuses the existing **Isotope Neon** (`accent`) scale — no new base palette tokens needed:

| Step | Existing token | Role |
|---|---|---|
| 400 | `--freefall-color-accent-400` | Ghost attribute — foreground |
| 900 | `--freefall-color-accent-900` | Ghost attribute — dark background |

**Naming:**

```
--freefall-color-body-400: hsl(18, 90%, 55%);
--freefall-color-body-900: hsl(18, 60%, 15%);
--freefall-color-mind-400: hsl(158, 85%, 65%);
--freefall-color-mind-900: hsl(158, 60%, 15%);
```

**Semantic tokens** (new section in tokens.css):

| Token | References | Usage |
|---|---|---|
| `--freefall-attr-body` | `body-400` | Body attribute foreground (circles, badges, text) |
| `--freefall-attr-body-bg` | `body-900` | Body attribute background (tinted surfaces) |
| `--freefall-attr-mind` | `mind-400` | Mind attribute foreground |
| `--freefall-attr-mind-bg` | `mind-900` | Mind attribute background |
| `--freefall-attr-ghost` | `accent-400` | Ghost attribute foreground |
| `--freefall-attr-ghost-bg` | `accent-900` | Ghost attribute background |

**Consumer update:** `EquipmentCard.astro` binding circles should migrate from hardcoded palette references (`--freefall-color-primary-600`, `--freefall-color-accent-400`, `--freefall-color-primary-200`) to the new semantic tokens (`--freefall-attr-body`, `--freefall-attr-mind`, `--freefall-attr-ghost`). Text color on each circle should be chosen for contrast against the new backgrounds.

### Dependencies

- **Depends on:** Existing token architecture (`tokens.css`)
- **Depended on by:** EquipmentCard binding circles, future character sheet UI, dice roll displays

### Anti-Patterns

- **No semantic-to-semantic aliasing.** `--freefall-attr-ghost` references `--freefall-color-accent-400` (a base palette token), not `--freefall-alert-base` (a semantic token that happens to have the same value).
- **No new base palette for Ghost.** The existing accent scale already serves this role — adding a duplicate `ghost-400` alias of `accent-400` would violate DRY at the palette level.

## Contract

### Definition of Done

- [ ] `tokens.css` defines `--freefall-color-body-{400,900}` and `--freefall-color-mind-{400,900}` base palette tokens
- [ ] `tokens.css` defines all 6 `--freefall-attr-*` semantic tokens referencing the correct base palette values
- [ ] EquipmentCard binding circles use `--freefall-attr-body`, `--freefall-attr-mind`, `--freefall-attr-ghost` semantic tokens
- [ ] DS docs token page shows the new attribute color swatches
- [ ] `pnpm build`, `pnpm lint`, and `pnpm typecheck` pass

### Regression Guardrails

- Existing semantic tokens must not change values
- Ghost attribute color must remain visually identical (same hsl values as accent-400/900)
- Attribute semantic tokens must reference base palette tokens only, never other semantic tokens

### Scenarios

```
Scenario: Body binding circle uses Flare Orange
  Given: An EquipmentCard with binding { body: 2 }
  When: Rendered
  Then: The Body circle background resolves to hsl(18, 90%, 55%)

Scenario: Ghost attribute matches existing accent
  Given: An EquipmentCard with binding { ghost: 1 }
  When: Rendered
  Then: The Ghost circle background resolves to hsl(64, 80%, 54%) — same as accent-400

Scenario: Dark attribute backgrounds
  Given: A UI element using --freefall-attr-mind-bg
  When: Rendered
  Then: The background resolves to hsl(158, 60%, 15%)
```
