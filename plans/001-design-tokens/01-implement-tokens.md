# 01 — Implement Design Tokens

**Goal:** Full token layer — CSS custom properties, TypeScript constants, tests, and demo page. One commit.

All deliverables are independent and done in parallel.

## Deliverables

**CSS tokens** (`packages/design-system/src/styles/tokens.css`)
- Base palette: 11 primary steps + 3 accent steps as `--freefall-color-{scale}-{step}`
- Semantic tokens: 12 role-based aliases using `var()` references to base palette
- Breakpoint custom properties (moved from `breakpoints.css`)

**TypeScript constants** (`packages/design-system/src/tokens/colors.ts`)
- Primary and accent palette values as typed constants
- HSL values must match CSS exactly

**Barrel export update** (`packages/design-system/src/index.ts`)
- Export colors alongside existing breakpoints

**Unit tests** (`packages/design-system/src/tokens/colors.test.ts`)
- Verify every palette value

**Base styles update** (`packages/design-system/src/styles/base.css`)
- Import `tokens.css` instead of (or in addition to) `breakpoints.css`
- Apply semantic tokens to existing base styles (body bg, text color, etc.)

**Cleanup**
- Remove `breakpoints.css` — its custom properties move into `tokens.css`

**Demo page** (`apps/design-system/src/pages/tokens.astro`)
- Render all base palette colors as labeled swatches
- Render all semantic tokens with their role names
- Show breakpoint values

## Done When

- [ ] `src/styles/tokens.css` defines all base palette and semantic custom properties per spec
- [ ] `src/tokens/colors.ts` exports base palette values as TypeScript constants
- [ ] HSL values in CSS and TypeScript match exactly for every base palette token
- [ ] Semantic tokens reference base palette tokens via `var()` — no hardcoded values
- [ ] `src/styles/base.css` imports `tokens.css`
- [ ] Unit tests verify all TypeScript token values
- [ ] Demo app has a token reference page showing all colors with their names and values
- [ ] `pnpm build`, `pnpm lint`, `pnpm test`, and `pnpm typecheck` pass
- [ ] Zero `<script>` tags in demo app build output
