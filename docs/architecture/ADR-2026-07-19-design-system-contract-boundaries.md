# ADR-2026-07-19: Design System Contract Boundaries

**Status:** Accepted

**Date:** 2026-07-19

**Supersedes:** [ADR-2026-03-11](./ADR-2026-03-11-design-system-component-model.md)

## Context

The March 2026 component-model ADR established source distribution, layered
CSS, co-located component styles, CSS custom properties as tokens, and
Astro-first components. Implementing and operating that model exposed several
places where its prescribed boundaries did not match the system that proved
useful in production:

- `AppShell` became the shared document root and naturally owns foundation
  loading for both applications.
- Rich-text element styles are applied to the shell's `main` content region;
  the content grid, not a prose wrapper, owns readable measure.
- Callouts and a small set of utilities are global opt-in primitives, but are
  neither foundation nor self-contained Astro components.
- Scoped component styles retain some readable BEM-like class names. Those
  names remain implementation details and do not require wrapper-only markup.
- The surface primitive must target the direct placement contract used by the
  content grid.
- Accessible navigation uses small inline scripts for progressive enhancement
  while retaining an HTML/CSS baseline. Avoiding a framework client runtime,
  not avoiding all JavaScript, is the relevant constraint.

The living contracts and current inventory belong in `specs/design-system/`
and package source. This ADR records only the architectural decisions.

## Decision

### Retained Decisions

The design system remains source-distributed with no independent package build
step. Astro remains the default component format, component styles remain
co-located, and typed props remain the public component API. CSS class names
inside components remain implementation details. CSS custom properties remain
the sole token source.

### Foundation Ownership

`AppShell` is the document root for consuming applications. It imports
`base.css` once and renders `FontLinks` in the document head. Consumers using
`AppShell` do not import or render those dependencies separately.

Foundation consists of the reset, CSS custom-property tokens, typography, and
document-level defaults. CSS custom properties are the sole token source; no
parallel TypeScript token layer or barrel is maintained.

### Global Primitives

Global CSS may provide opt-in primitives when plain HTML and a documented class
contract are more appropriate than an Astro component. This layer includes
layout primitives such as `.content-grid` and `.surface`, structural content
patterns such as `.callout`, and a deliberately small utility set.

The surface placement contract is:

```css
main > .content-grid > .surface
```

This targets direct grid items without broad descendant leakage.

### Rich Text And Measure

`main` is the rich-text element scope. Naked headings, paragraphs, lists,
tables, definition lists, blockquotes, `pre`, and `em` inside the content pane
receive editorial defaults without a required prose wrapper class.

`.content-grid` independently owns readable measure and responsive placement.
Its main column is the sole prose-width constraint.

### Component Encapsulation

Astro components keep their styles co-located and expose behavior through
typed props. Component class names are implementation details.

Scoped styles may use readable BEM-like names when useful. Authors must not add
DOM solely to satisfy a naming convention, couple parent layouts to a child's
internal classes, or expose those classes as consumer API. Structural selectors
remain preferred when they express the relationship without extra markup.

### Progressive Enhancement

Components prefer native HTML and CSS. Inline scripts may add keyboard
semantics, focus management, and other progressive enhancements when the core
interaction remains available without JavaScript. Framework islands require a
separate demonstrated need; the default build contains no framework client
runtime.

### Dimensional Exceptions

Ordinary production dimensions derive from design tokens. Literal lengths are
permitted only where CSS cannot consume custom properties in query conditions,
where a large radius encodes a circle or pill, or where a standard
visually-hidden technique requires one-pixel geometry.

## Consequences

**Positive:**

- Foundation dependencies have one owner across both applications.
- Rich-text styling and page measure have separate, explicit responsibilities.
- Global CSS patterns have an architectural home without forcing components.
- Scoped class naming can optimize readability without becoming public API.
- Progressive enhancement is evaluated by baseline capability and runtime
  cost rather than a blanket script prohibition.

**Negative:**

- `AppShell` is intentionally coupled to the shared foundation entrypoint.
- `main` scopes rich-text styles broadly within the content pane, so UI placed
  there must use component styles to establish its own presentation.
- The global primitive layer requires discipline to remain small and
  documented.

## Alternatives Considered

### Continue Amending The March ADR

Rejected. Rewriting an implemented ADR obscures the context and tradeoffs that
produced the original decision. A superseding record preserves that history.

### Restore A Required Prose Wrapper

Rejected. Both applications already share a bounded `main` content region, and
the content grid owns measure. A second wrapper would duplicate structure
without adding a distinct runtime boundary.

### Require Flat Class Names In Scoped Components

Rejected. Astro already provides collision isolation. Naming shape does not
create encapsulation; public contracts and consumer coupling do.
