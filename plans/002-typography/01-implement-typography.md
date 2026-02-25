# 01 — Implement Typography

**Goal:** Font families, loading strategy, TypeScript tokens, and demo page. One commit.

All deliverables are independent and done in parallel.

## Deliverables

**FontLinks component** (`packages/design-system/src/components/FontLinks.astro`)
- Three `<link>` tags in order: preconnect to `fonts.googleapis.com`, preconnect to `fonts.gstatic.com` (with crossorigin), stylesheet loading Lato + IBM Plex Mono with `display=swap`

**Typography CSS** (`packages/design-system/src/styles/typography.css`)
- `--freefall-font-body`: `"Lato", system-ui, -apple-system, sans-serif`
- `--freefall-font-mono`: `"IBM Plex Mono", ui-monospace, "Cascadia Code", monospace`
- `html` sets `font-family: var(--freefall-font-body)`
- `code`, `pre`, `kbd`, `samp` set `font-family: var(--freefall-font-mono)`

**Base styles update** (`packages/design-system/src/styles/base.css`)
- Import `typography.css`
- Replace hardcoded `system-ui` font stack with `var(--freefall-font-body)`

**TypeScript constants** (`packages/design-system/src/tokens/typography.ts`)
- Font family and weight constants matching CSS values

**Barrel export update** (`packages/design-system/src/index.ts`)
- Export typography tokens alongside existing breakpoints and colors

**Unit tests** (`packages/design-system/src/tokens/typography.test.ts`)
- Verify font family strings and weight values

**App integration** (both apps)
- Add `<FontLinks />` to free-fall app layout (`apps/free-fall/src/pages/index.astro`)
- Add `<FontLinks />` to design-system app pages

**Demo page** (`apps/design-system/src/pages/typography.astro`)
- Show both fonts with sample text at all defined weights
- Link from index page

## Done When

- [ ] `FontLinks.astro` renders preconnect and stylesheet `<link>` tags for both fonts
- [ ] `typography.css` defines `--freefall-font-body` and `--freefall-font-mono` custom properties
- [ ] `typography.css` applies font families to `html` and code elements
- [ ] `base.css` imports `typography.css`
- [ ] `typography.ts` exports font family and weight constants
- [ ] Unit tests verify TypeScript token values
- [ ] Both apps use `FontLinks` in their layouts
- [ ] Demo app has a typography reference page showing both fonts with sample text
- [ ] `pnpm build`, `pnpm lint`, `pnpm test`, and `pnpm typecheck` pass
- [ ] Built HTML contains Google Fonts `<link>` tags and zero `<script>` tags
