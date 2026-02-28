# ADR-001: Main Site Content Management

**Status:** Accepted

**Date:** 2026-02-28

## Context

The FREE//FALL web application (`apps/free-fall`) serves multiple purposes: it renders the official game rules (imported from `@free-fall/core-rulebook`), but it also acts as a top-level product landing page.

Historically, the index page (`src/pages/index.astro`) rendered game content directly. As the project evolves towards a more robust marketing and product identity presence, the index page must transition to a dedicated landing page designed for SEO, clear Calls To Action (CTAs), and strong product messaging.

This requires a new architectural pattern for managing "site-specific" content—copy, taglines, and messaging that belongs exclusively to the web interface and has no place in the universal game rulebook packages.

The constraints are:
- Writers and non-developers must be able to edit this copy easily without navigating complex Astro or JSX syntax.
- The web app itself must maintain strict control over layout, structural metadata, and visual assets (like SVGs).
- This site-specific content is heavily localized to single pages or page-groups and is never reused outside of this application.

## Decision

We will adopt a modular Markdown pattern for site-specific content management, where structural `.astro` pages import discrete `.md` files as named content blocks.

Specifically:
1. **Plain Markdown Ownership:** All site copy will live as plain `.md` files under `apps/free-fall/src/content/{page-group}/` (e.g., `src/content/landing/hero.md`). These files contain only prose. They must not contain frontmatter, imported components, or MDX logic.
2. **Structural Ownership:** The consuming `.astro` pages (e.g., `src/pages/index.astro`) retain complete ownership of layout (semantic HTML sections), metadata (title, SEO), and visual assets (SVGs, styling).
3. **The Import Pattern:** `.astro` files will import the Markdown content functionally using Astro's built-in support: `import { Content as Hero } from "../content/landing/hero.md";` and render them in place.
4. **No Content Collections:** We will not use Astro Content Collections for this site-specific prose.

## Consequences

**Positive:**
- **Clear Separation of Concerns:** Developers work in `.astro` files to build layouts; writers work in `.md` files to craft copy.
- **High Editability:** Plain markdown files without frontmatter or JSX are trivial for non-technical contributors to edit.
- **Simplicity:** Bypassing Content Collections for singleton blocks avoids unnecessary schema definitions and abstraction overhead for content that is statically imported.
- **SEO Control:** The `.astro` pages can maintain exact control over document head structure and semantic wrappers (`<section>`, `<article>`) around the content blocks.

**Negative:**
- **File Proliferation:** This pattern requires creating a new `.md` file for every logical section of copy on a page, slightly increasing the raw number of files on disk.
- **No Type/Schema Safety:** Because we are not using Content Collections, there is no built-in schema validation or type-checking ensuring that required sections of copy exist before build time (beyond standard module resolution).

**Neutral:**
- Layout adjustments require developers to edit `.astro` files, while copy changes only require modifying `.md` files.

## Alternatives Considered

### 1. Astro Content Collections
**Rejected:** Content Collections are powerful but require defining Zod schemas and writing query logic (`getCollection()`). For singleton, structural page content (like a specific page's hero tagline), statically importing a specific file is substantially simpler and carries less overhead than maintaining a collection schema.

### 2. MDX (`.mdx` files)
**Rejected:** While MDX allows embedding components (like the alpha badge SVG) directly into the markdown, it blurs the line between layout and content. If a content block requires functional components, it should be authored directly in the `.astro` page. Keeping the files as plain `.md` ensures they remain strictly prose.

### 3. Frontmatter in Markdown Pages
**Rejected:** We considered having the Markdown files dictate the page layout heavily via extensive frontmatter (e.g., `seoTitle: "FREE//FALL"`, `layout: "../layouts/Base.astro"`). This was rejected because the `.astro` page is already statically importing the content; putting metadata in the markdown requires the `.astro` page to parse and act on that frontmatter, duplicating knowledge the routing system already possesses.

### 4. Shared Content Package
**Rejected:** We considered putting this marketing copy into a shared package like the core rulebook. This was rejected because landing page copy is inherently tied to the `apps/free-fall` application and has exactly zero external consumers. Extracting it creates unnecessary indirection.
