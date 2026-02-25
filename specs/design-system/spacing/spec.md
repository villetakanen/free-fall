# Feature: Spacing

## Blueprint

### Context

Spacing tokens establish a consistent spatial rhythm across FREE//FALL. A single base unit (0.5rem) is multiplied by powers of two to produce five spacing steps. All layout gaps, padding, and margins reference these tokens — no magic numbers.

Parent spec: `specs/design-system/spec.md`

### Architecture

**Base unit:** `0.5rem` (8px at default browser font size)

**Spacing scale:**

| Token | Multiplier | Value | Typical use |
|---|---|---|---|
| `--freefall-space-1` | ×1 | `0.5rem` | Tight inline gaps, icon padding |
| `--freefall-space-2` | ×2 | `1rem` | Default element spacing |
| `--freefall-space-4` | ×4 | `2rem` | Section padding, card insets |
| `--freefall-space-8` | ×8 | `4rem` | Major section breaks |
| `--freefall-space-16` | ×16 | `8rem` | Page-level vertical rhythm |

Token names use the multiplier, not the computed value — `space-4` means "4 base units", not "4rem".

**File locations:**

| File | Contents |
|---|---|
| `src/styles/tokens.css` | Spacing CSS custom properties (added to existing token file) |
| `src/tokens/spacing.ts` | TypeScript constants for spacing values |

**Token duality:**

CSS and TypeScript values must stay in sync, following the same pattern as colors and breakpoints.

### Anti-Patterns

- **No raw rem/px in component CSS** — Use `var(--freefall-space-*)`. If a needed size doesn't exist, use a combination of existing tokens, not a magic number.
- **No fractional or intermediate steps** — The scale is intentionally constrained. Five steps are enough. Adding `space-3` or `space-6` defeats the purpose of a consistent rhythm.
- **No layout-specific spacing tokens at this level** — This spec defines the raw scale. Semantic aliases (e.g., "card padding") are a component concern.

## Contract

### Definition of Done

- [ ] `src/styles/tokens.css` defines `--freefall-space-1` through `--freefall-space-16`
- [ ] `src/tokens/spacing.ts` exports spacing values as TypeScript constants
- [ ] Rem values in CSS and TypeScript match exactly
- [ ] `src/index.ts` barrel exports the spacing tokens
- [ ] Unit tests verify all TypeScript spacing values
- [ ] Demo app has a spacing reference page showing all steps with visual rulers
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

- Spacing CSS and TypeScript values must stay in sync
- Token names use the multiplier (1, 2, 4, 8, 16), not the computed rem value
- No spacing value may appear in a component or style file that isn't a `var(--freefall-space-*)` reference

### Scenarios

Scenario: Spacing tokens resolve correctly
  Given: `tokens.css` is imported via `base.css`
  When: An element uses `padding: var(--freefall-space-4)`
  Then: The computed padding is `2rem`

Scenario: Token duality holds
  Given: `spacing.ts` defines `space4` as `"2rem"`
  When: `tokens.css` defines `--freefall-space-4`
  Then: Both values are identical rem strings

Scenario: Demo page shows spacing scale
  Given: The demo app is built
  When: A developer navigates to the spacing page
  Then: All five spacing steps are rendered as labeled visual rulers showing relative size
