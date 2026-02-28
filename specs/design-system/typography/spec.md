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

**Text emphasis classes & Editorial Typography:**

Instead of generic abstract headings, FREE//FALL uses a strict editorial scale tailored for complex TTRPG information architecture. Semantic HTML structure (`<h1>`, `<h2>`) is decoupled from visual size using these specific modifier classes:

| Class | Visual Weight | Usage |
|---|---|---|
| `.text-chapter` | Massive, tight tracking | `<h1>` equivalents, cover titles |
| `.text-section` | Large, distinct | `<h2>` equivalents, major rules sections |
| `.text-subsection` | Medium, structural | `<h3>` equivalents, granular rules blocks |
| `.text-body-lead` | Slightly enlarged body | Intro paragraphs, chapter summaries |
| `.text-copy` | Base body size (1rem) | Standard paragraphs (`<p>`) |
| `.text-caption` | Small, loose tracking | Figure captions, subtle notes |
| `.text-callout` | Thematic, visually distinct | Flavor text, in-universe quotes |
| `.text-ui` | Standard UI size (1rem) | Primary buttons, app bars, tabs |
| `.text-ui-small` | Small UI size (0.875rem) | Secondary navigation, badges, metadata |

*Note: `p` elements receive standard body styling by default. The `.text-copy` class is only needed to apply paragraph typography to non-`p` nodes.*

**Emphasis & Color Classes:**

Three levels of text emphasis mapped to the ceramic highlight colors:

| Class | Color token | Palette step |
|---|---|---|
| `.text-high` | `--freefall-text-display` | primary-50 |
| `.text-low` | `--freefall-text-muted` | primary-300 |

Use `.text-high` or `.text-low` on any element to override its default color.

**Prose Scoping for Markdown (`.freefall-prose`):**

When rendering raw Markdown bodies (like long-form rulebooks), do not attempt to map utility classes to every single generated HTML node. Instead, wrap the output in a `<div class="freefall-prose">` scope container.

The `.freefall-prose` scope automatically:
- Enforces an ergonomic `max-width: 65ch` measure to prevent unreadable widescreen text walls.
- Applies the correct vertical rhythm (margins that map to the `8px` base grid) between paragraphs and headings.
- Automatically styles all naked `<h1>`, `<h2>`, and `<h3>` tags to the `.text-chapter`, `.text-section`, and `.text-subsection` scales respectively.
- Deep-styles TTRPG-specific nested structures natively:
  - **Lists**: Strictly indented padding for `<ul>` and `<ol>`, with unified vertical spacing for complex nested rules exceptions.
  - **Tables**: Robust zebra striping, distinct header bottom-borders, and cell padding for readability in data-dense stat blocks and roll tables.
  - **Blockquotes**: Left-indented, italicized rendering for narrative flavor text, visually distinct from mechanical rules text.

### Anti-Patterns

- **No direct Google Fonts URLs in app code** — Always use the `FontLinks` component. The URLs live in one place.
- **No font-family strings in component CSS** — Use `var(--freefall-font-body)` or `var(--freefall-font-mono)`. Never hardcode `"Lato"` or `"IBM Plex Mono"` outside the token definitions.
- **No self-hosted fonts** — Google Fonts CDN handles delivery and caching. Do not download and bundle font files.
- **No JS Typography Wrappers** — Do not build abstract `<Heading>` or `<Text>` components in Svelte or Astro. Rely exclusively on Semantic HTML augmented by the defined `.text-*` utility classes to uphold the pure HTML/CSS engineering philosophy.

## Contract

### Definition of Done

- [ ] `src/components/FontLinks.astro` renders preconnect and stylesheet `<link>` tags for both fonts
- [ ] `src/styles/typography.css` defines `--freefall-font-body` and `--freefall-font-mono` custom properties
- [ ] `src/styles/typography.css` implements the detailed editorial scale utility classes (`.text-chapter`, `.text-section`, etc.) and the `.freefall-prose` comprehensive scope styles.
- [ ] `src/styles/typography.css` adheres strictly to baseline rhythm (`line-height` evaluates to multiples of `var(--freefall-space-1)`).
- [ ] `src/styles/base.css` imports `typography.css`
- [ ] `src/tokens/typography.ts` exports font family constants and the mapped editorial scale values.
- [ ] Unit tests verify TypeScript token values mapped to the editorial hierarchy.
- [ ] Both apps use `FontLinks` in their layouts
- [ ] Demo app has a typography reference page showing both fonts, the editorial scales, and a mock `.freefall-prose` Markdown output.
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass
- [ ] Built HTML contains Google Fonts `<link>` tags and zero `<script>` tags

### Regression Guardrails

- Font family values in CSS and TypeScript must match
- CSS utility modifier token sizes must strictly map back to TypeScript typography size constants.
- Line heights across all typographic nodes must always mathematically equate to a multiple of `8px` (`--freefall-space-1`).

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
