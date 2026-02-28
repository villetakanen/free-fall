# Feature: Landing Page

## Blueprint

### Context

The app index page (`/`) transitions from an alpha-phase content reader (rendering core-rulebook Markdown directly) to a purpose-built landing page. Its goals are distinct from game content pages:

- **SEO:** Discoverable, crawlable front page with appropriate meta and semantic structure
- **CTA:** Guide visitors toward the game content (core rules, character creation, etc.)
- **Product identity:** Communicate what FREE//FALL is and why it exists

Core rulebook content moves to its own routes (accessible via the navigation tray). The index page no longer imports from `@free-fall/core-rulebook` for content rendering.

Parent spec: `specs/free-fall/site-content/spec.md`

### Architecture

**File structure:**

| File | Responsibility |
|---|---|
| `src/pages/index.astro` | Structural skeleton — sections, layout, scoped styles, meta tags |
| `src/content/landing/hero.md` | Hero section prose — tagline, one-liner description |
| `src/content/landing/features.md` | Feature highlights / value proposition prose |
| `src/content/landing/alpha-status.md` | Current project status, expectations, alpha disclaimer |

The set of content blocks may evolve. The pattern is stable: one `.md` file per logical section, imported into `index.astro` by name.

**Page structure:**

`index.astro` is an Astro component page using `BaseLayout`. It imports content blocks and places them in semantic sections:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import { Content as Hero } from "../content/landing/hero.md";
import { Content as Features } from "../content/landing/features.md";
import { Content as AlphaStatus } from "../content/landing/alpha-status.md";
---
<BaseLayout title="FREE//FALL">
  <section class="landing-hero">
    <Hero />
  </section>
  <section class="landing-features">
    <Features />
  </section>
  <section class="landing-status">
    <AlphaStatus />
  </section>
</BaseLayout>
```

Scoped `<style>` in `index.astro` owns all layout and visual treatment of the sections. Content blocks render into `freefall-prose` context via the layout.

**What stays in `.astro`:**

- The alpha badge SVG (`@free-fall/design-system/assets/v7-alpha.svg?raw`) — this is a visual asset, not prose. It is imported and rendered with `set:html` in the page, not in a Markdown file.
- Version display (`VERSION` from `@free-fall/core-rulebook`) — programmatic data, not content.
- Section structure, ordering, and styling.

**What moves to Markdown:**

- All prose: headings, descriptions, value propositions, status messaging.
- Content that a non-developer could meaningfully edit without touching `.astro` syntax.

**What is removed:**

- `CoreMechanics` import — core rules are no longer rendered on the index page.
- The `freefall-prose` wrapper around core-rulebook content on this page.

### Anti-Patterns

- **No game content on the landing page** — The index page is a site page, not a rules page. Do not import content from `@free-fall/core-rulebook` for rendering here.
- **No assets in Markdown** — SVGs, images, and badges are visual concerns owned by the `.astro` page. Markdown files contain only prose.
- **No layout logic in content blocks** — Content blocks must not assume anything about their container. No CSS classes, no wrapper divs, no HTML beyond what Markdown naturally produces.

## Contract

### Definition of Done

- [ ] `src/content/landing/` directory exists with content block `.md` files
- [ ] `src/pages/index.astro` imports content blocks from `src/content/landing/`
- [ ] `index.astro` no longer imports `CoreMechanics` from `@free-fall/core-rulebook`
- [ ] `index.astro` uses `BaseLayout`
- [ ] Content blocks are plain Markdown with no frontmatter
- [ ] Page renders semantic `<section>` elements for each content block
- [ ] Alpha badge SVG and VERSION remain in `.astro` (not in Markdown)
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

- The landing page must never import game content for inline rendering
- Content blocks must remain plain Markdown with no frontmatter
- The alpha badge must be rendered via `set:html` in `.astro`, not embedded in Markdown

### Scenarios

```gherkin
Scenario: Landing page renders content blocks
  Given the app is built
  When a user visits /
  Then they see the hero, features, and alpha-status content
  And the page uses semantic <section> elements

Scenario: Editing landing page copy
  Given a content block at src/content/landing/hero.md
  When the prose is updated
  Then the change appears on / after rebuild
  And no .astro files were modified

Scenario: Core rules are not on the landing page
  Given a user visits /
  When the page renders
  Then no core-rulebook content (rules, mechanics) is displayed inline
  And core rules are accessible via navigation tray routes

Scenario: Landing page renders without JavaScript
  Given a user visits / with JavaScript disabled
  When the page loads
  Then all content blocks are visible as static HTML
  And the alpha badge SVG is rendered inline
```
