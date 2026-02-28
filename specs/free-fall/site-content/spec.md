# Feature: Site Content Management

## Blueprint

### Context

The FREE//FALL app serves two distinct kinds of content:

1. **Game content** — rules, lore, character creation — owned by packages (e.g., `@free-fall/core-rulebook`) and consumed by the app via package imports.
2. **Site content** — landing page copy, product descriptions, CTAs, alpha-status messaging — owned exclusively by the app itself, with no external consumers.

This spec defines the architectural pattern for category 2: content that belongs to the site, is authored as plain Markdown, and is imported into structural `.astro` pages as named content blocks.

Parent spec: `specs/free-fall/app-layout/spec.md`

### Architecture

**Content location:**

All site-owned content lives under `apps/free-fall/src/content/` in directories named for the page or page-group they serve:

```
apps/free-fall/src/content/
├── landing/          # content blocks for index.astro
├── rules/            # (existing) app-specific rules content
└── {page-name}/      # future pages follow the same pattern
```

Each directory maps to one page (or tightly related page-group) in `src/pages/`. The directory name matches the page's purpose, not a marketing term or content type.

**Content files are plain Markdown:**

- No frontmatter. The consuming `.astro` page owns all metadata (titles, descriptions, layout).
- No Content Collections config. Files are imported directly via Astro's built-in markdown import.
- No MDX. Plain `.md` — prose only, no embedded components or expressions.
- Files are named for their subject matter (e.g., `alpha-status.md`), not their presentation role (e.g., not `cta.md`).

**Import pattern:**

`.astro` pages import content blocks by name and place them into structural slots:

```astro
---
import { Content as Hero } from "../content/landing/hero.md";
import { Content as Features } from "../content/landing/features.md";
---
<section class="hero"><Hero /></section>
<section class="features"><Features /></section>
```

The page owns structure, layout, and styling. The Markdown file owns the words.

**Ownership rule:**

Site content is owned by and scoped to `apps/free-fall`. It must never be extracted into a shared package. No other app or package imports from `apps/free-fall/src/content/`.

### Anti-Patterns

- **No Content Collections for site content** — Collections add schema validation, querying, and filtering. Site content blocks are statically imported by name. The overhead is not justified.
- **No frontmatter in site content files** — The page already knows what it's importing and where it goes. Metadata in the Markdown would duplicate what the page defines.
- **No MDX for site content** — If a content block needs embedded components, it has outgrown the "prose block" pattern and should be authored directly in the `.astro` page.
- **No shared package for site content** — This content has exactly one consumer. Extracting it creates indirection with zero reuse benefit.
- **No marketing jargon in file names** — Name files for their subject (`alpha-status.md`), not their presentation function (`cta.md`, `hero-banner.md`). Subject names survive redesigns; role names don't.

## Contract

### Definition of Done

- [ ] `apps/free-fall/src/content/` directory exists with at least one page-scoped subdirectory
- [ ] Content files are plain `.md` with no frontmatter
- [ ] Consuming `.astro` pages import content via `{ Content as Name }` pattern
- [ ] No `src/content/config.ts` or Content Collections configuration for site content
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

- Site content files must never contain frontmatter
- Site content must never be imported from outside `apps/free-fall`
- No Content Collections config may be added for site content directories
- Content directory names must correspond to a page or page-group in `src/pages/`

### Scenarios

```gherkin
Scenario: Adding content for a new page
  Given a new .astro page is being created at src/pages/roadmap.astro
  When site-specific prose is needed
  Then a new directory src/content/roadmap/ is created
  And plain .md files are added for each content block
  And the page imports them via { Content as Name } pattern

Scenario: Content block grows beyond prose
  Given a content block in src/content/landing/features.md
  When it needs embedded interactive components or dynamic data
  Then the content is moved inline into the .astro page
  And the .md file is removed

Scenario: Editing site copy
  Given a content block at src/content/landing/hero.md
  When a copywriter updates the Markdown
  Then no .astro files need to change
  And the build produces updated HTML
```
