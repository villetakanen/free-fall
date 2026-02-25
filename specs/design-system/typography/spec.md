# Feature: Typography

## Blueprint

### Context

Typography defines the font families, sizing, and weight rules for FREE//FALL. Two typefaces establish the visual hierarchy: a humanist sans-serif for body content and a monospace for UI/contrast elements. Fonts are loaded from Google Fonts via preconnected `<link>` tags.

Parent spec: `specs/design-system/spec.md`

### Architecture

**Font families:**

| Role | Family | Google Fonts ID | CSS custom property |
|---|---|---|---|
| Body / display | Lato | `Lato:wght@300;400;700` | `--freefall-font-body` |
| UI / contrast | IBM Plex Mono | `IBM+Plex+Mono:wght@400;500` | `--freefall-font-mono` |

**Font stack fallbacks:**

| Token | Value |
|---|---|
| `--freefall-font-body` | `"Lato", system-ui, -apple-system, sans-serif` |
| `--freefall-font-mono` | `"IBM Plex Mono", ui-monospace, "Cascadia Code", monospace` |

**File locations:**

| File | Contents |
|---|---|
| `src/styles/typography.css` | Font-family custom properties and typographic base styles |
| `src/tokens/typography.ts` | TypeScript constants for font families and weights |
| `src/components/FontLinks.astro` | `<link>` tags for Google Fonts preconnect + stylesheet |

**FontLinks component:**

An Astro component that renders the Google Fonts `<link>` tags. Consumed in the `<head>` of every app's base layout. This is an Astro component (not raw HTML) because:

- It encapsulates multiple `<link>` tags that must stay in sync with the font tokens
- Duplicating these across apps is error-prone
- Changing fonts means updating one component, not hunting across layouts

```astro
---
import FontLinks from "@free-fall/design-system/components/FontLinks.astro";
---
<html>
  <head>
    <FontLinks />
  </head>
  ...
</html>
```

**Font loading strategy:**

The `FontLinks` component emits three `<link>` tags in this order:

1. `<link rel="preconnect" href="https://fonts.googleapis.com">` — early connection to API
2. `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` — early connection to font files
3. `<link rel="stylesheet" href="...&display=swap">` — the font stylesheet

The `display=swap` parameter ensures text is immediately visible in the fallback font stack while web fonts load. This prevents Flash of Invisible Text (FOIT) and limits Cumulative Layout Shift (CLS) to a brief swap. No additional `font-display` overrides are needed in CSS — Google Fonts embeds the `font-display: swap` rule in the served `@font-face` declarations.

**Typographic base styles** (in `typography.css`, imported via `base.css`):

- `html` sets `font-family: var(--freefall-font-body)`
- `code`, `pre`, `kbd`, `samp` set `font-family: var(--freefall-font-mono)`
- No font sizes defined at this level — sizing is left to component styles

### Anti-Patterns

- **No direct Google Fonts URLs in app code** — Always use the `FontLinks` component. The URLs live in one place.
- **No font-family strings in component CSS** — Use `var(--freefall-font-body)` or `var(--freefall-font-mono)`. Never hardcode `"Lato"` or `"IBM Plex Mono"` outside the token definitions.
- **No self-hosted fonts** — Google Fonts CDN handles delivery and caching. Do not download and bundle font files.
- **No font-size tokens at this level** — Typography spec defines families and weights only. Component-level sizing is a separate concern.

## Contract

### Definition of Done

- [ ] `src/components/FontLinks.astro` renders preconnect and stylesheet `<link>` tags for both fonts
- [ ] `src/styles/typography.css` defines `--freefall-font-body` and `--freefall-font-mono` custom properties
- [ ] `src/styles/typography.css` applies font families to `html` and code elements
- [ ] `src/styles/base.css` imports `typography.css`
- [ ] `src/tokens/typography.ts` exports font family and weight constants
- [ ] Unit tests verify TypeScript token values
- [ ] Both apps use `FontLinks` in their layouts
- [ ] Demo app has a typography reference page showing both fonts with sample text
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass
- [ ] Built HTML contains Google Fonts `<link>` tags and zero `<script>` tags

### Regression Guardrails

- Font family values in CSS and TypeScript must match
- Google Fonts URLs in `FontLinks.astro` must load the same families defined in the tokens
- Google Fonts stylesheet URL must include `&display=swap`
- No `font-family` declaration anywhere outside `typography.css` may use a raw string — always `var()`

### Scenarios

Scenario: Fonts load in production build with swap
  Given: An app uses `FontLinks` in its base layout
  When: The site is built and served
  Then: The HTML `<head>` contains preconnect links to `fonts.googleapis.com` and `fonts.gstatic.com`, and a stylesheet link loading Lato and IBM Plex Mono with `display=swap`

Scenario: Body text uses Lato
  Given: `typography.css` is imported via `base.css`
  When: A page renders body text
  Then: The computed `font-family` starts with `"Lato"`

Scenario: Code elements use IBM Plex Mono
  Given: `typography.css` is imported via `base.css`
  When: A `<code>` element renders
  Then: The computed `font-family` starts with `"IBM Plex Mono"`

Scenario: Typography demo page
  Given: The demo app is built
  When: A developer navigates to the typography page
  Then: Both fonts are rendered with sample text at all defined weights
