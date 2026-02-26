# High-End TTRPG Typography Overhaul

## Goal Description
The current design system typography is basic (Lato/IBM Plex with simple `h1`-`h4` and generic `p` styles). To successfully publish a TTRPG as a web app, the typography must reach high-end editorial standards. TTRPGs involve massive walls of rules text, distinct flavor text, and complex data structures (tables, stat blocks).

This plan outlines a complete typographic overhaul to introduce robust semantic scales, reading-optimized constraints (measure/leading), and rich text primitives necessary for a premium TTRPG rulebook experience.

### Design System Tokens (`packages/design-system/src/tokens`)

#### [MODIFY] [typography.ts](file:///Users/ville.takanen/dev/free-fall/packages/design-system/src/tokens/typography.ts)
- Maintain `Lato` (Body/Display) and `IBM Plex Mono` (Mono) as the designated brand fonts.
- Restructure the scale configuration away from M3 (Display/Headline) and towards a traditional **editorial/book hierarchy**. This entails explicitly defining sizes for: `Chapter Title` (H1), `Section Heading` (H2), `Subsection Heading` (H3), `Body Copy` (Lead, Regular, Small), `Caption`, and `Callout Thematic Text`.

### Design System Styles (`packages/design-system/src/styles`)

#### [MODIFY] [typography.css](file:///Users/ville.takanen/dev/free-fall/packages/design-system/src/styles/typography.css)
- Implement CSS variables for the editorial scale (e.g., `--freefall-text-chapter`, `--freefall-text-body-lead`, etc.) mapping directly to Lato.
- Enforce strict baseline rhythm: ensuring `line-height` explicitly maps to multiples of the `--freefall-space-1` (4px/8px) grid.
- Integrate tighter `letter-spacing` (tracking) for massive Chapter headers, and looser tracking for small captions, simulating high-end print typography.

### Design System Components (`packages/design-system`)

#### [DELETE] [Heading.astro](file:///Users/ville.takanen/dev/free-fall/packages/design-system/src/components/Heading.astro)
- Remove this component completely. We will rely purely on native HTML (`<h1>`, `<h2>`) combined with CSS utility classes, rather than abstracting text nodes into component wrappers, adhering to the pure HTML/CSS philosophy.

### Pure HTML/CSS Usage Guidelines

#### Semantic Typography & Element Modifiers
- Introduce CSS utility classes in `typography.css` to decouple visual hierarchy from semantic HTML tags when strictly necessary (e.g., `<h1 class="text-section">`).
- Define exact classes mapping to the editorial scale:
  - `.text-chapter` (H1 visual equivalent)
  - `.text-section` (H2 visual equivalent)
  - `.text-subsection` (H3 visual equivalent)
  - `.text-body-lead`
  - `.text-caption`
  - `.table-stats` (High-density rendering for TTRPG stat blocks)

#### Prose / Rich Text Scoping
- Define a robust CSS scope class: `.freefall-prose`.
- Applying `<div class="freefall-prose">` to any container containing raw markdown output will automatically:
  - Enforce the `max-width: 65ch` reading measure for body paragraphs.
  - Apply the correct typographic scale, margins, and baseline rhythms to inner `<h1>`-`<h3>` elements.
  - **Lists**: Strictly indent `<ul>` and `<ol>` tags with distinct bullet and numbering styles, controlling nested vertical rhythm.
  - **Tables**: Provide a default robust styling for nested `<table>` tags, including alternating row colors (zebra striping) and clear header boundary borders crucial for reading roll tables.
  - **Blockquotes**: Add distinct visual styling (e.g., left borders, italics, or indented margins) to `<blockquote>` elements specifically formulated for narrative flavor text.

### Specifications (`specs/design-system`)

#### [MODIFY] [typography/spec.md](file:///Users/ville.takanen/dev/free-fall/specs/design-system/typography/spec.md)
- Retain the existing documentation regarding font loading (`FontLinks.astro`, preconnects) and the base `Lato` / `IBM Plex Mono` token structures.
- Expand the document to outline the new editorial typography hierarchy (`Chapter Title`, `Section Heading`, etc.).
- Document the pure HTML/CSS constraint, detailing the available utility classes (`.text-chapter`, etc.) and the behavior of the `.freefall-prose` rich text scope.
- Define the exact scaling token values and line-height rhythms newly introduced.

## Verification Plan

### Automated Tests
- Run `pnpm lint`, `pnpm build`, and `pnpm test` successfully across the workspace.
- **Update Vitest Specs**: Modify `packages/design-system/src/tokens/typography.test.ts` to assert the new explicitly defined editorial scale objects (e.g., verifying `typography.scale.chapter` exists and has the correct ratio mapping).

### Manual Verification
- View the `/typography/` page in the `design-system` app to visually confirm the new scaling cascade.
- Test the new `Prose.astro` wrapper against a mock Markdown page (e.g., `/rules/getting-started/`) to verify that the 65ch reading measure and heading hierarchy feel premium and legible on both mobile and widescreen desktop layouts.
