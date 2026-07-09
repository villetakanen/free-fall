# Feature: [Name]

<!--
  Spec template — ASDLC "The Spec" pattern
  https://asdlc.io/patterns/the-spec

  A spec captures the durable *intent* of a feature — a living hypothesis
  of how it works (Blueprint) and how we know it works (Contract). Code
  remains the source of truth for runtime behavior; tests verify the
  contracts. Implementation doesn't invalidate a spec, it completes it —
  update the spec with what implementation teaches.

  Same-commit rule: if code behavior changes, the spec MUST be updated
  in the same commit.

  Deprecation over deletion: when updating, mark stale sections as
  [DEPRECATED yyyy-mm-dd] with a one-line rationale instead of rewriting
  them away. History explains *why* the system evolved.

  One spec per independently evolvable feature. Place at:
    specs/{domain}/{feature}/spec.md

  Delete this comment block before publishing.
-->

## Blueprint

### Context

<!-- What is this feature? Why does it exist? What problem does it solve?
     Include domain-specific background an implementer would need. -->

Parent spec: `specs/{domain}/spec.md`

### Architecture

<!-- How is this feature built? Cover:
     - Key design decisions and patterns
     - File structure (table of file → responsibility)
     - Data models, API contracts, schemas
     - Dimensions, tokens, or formulas (if design-system)
     - What works without JavaScript (progressive enhancement)
     - What JavaScript adds
     - Diagrams (ASCII or Mermaid) where they clarify structure

     Be precise enough to verify — this captures intent, not implementation.
     Reference real file paths; agents work with files, not concepts. -->

### Constraints

<!-- Architectural boundaries stated positively, as facts about the system.
     Describe the one correct path, not the forbidden ones — negative
     phrasing anchors the wrong approach in an agent's context.

     "State toggles (open/close, show/hide) are implemented with the HTML
      checkbox + CSS :has() pattern; framework islands are reserved for
      multi-state reactive UI."
     not
     "Don't use framework islands for toggles."

     Failure modes belong in Scenarios below as verifiable behavior, not
     here as warnings. Only include constraints the architecture section
     doesn't already express. -->

## Contract

### Definition of Done

<!-- Observable, verifiable success criteria as a checkbox list.
     Each item should be testable — no subjective language.
     Always end with: `pnpm build`, `pnpm lint`, and `pnpm test` pass. -->

- [ ] ...
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

<!-- Invariants that must never break, even as the feature evolves.
     These protect against regressions during future changes.
     State them as imperatives: "X must never Y". -->

### Scenarios

<!-- Behavioral specs in Gherkin-style Given/When/Then format.
     Cover the critical paths, edge cases, and progressive enhancement.
     Scenarios absorb failure modes: instead of warning "don't require JS",
     write "Given JavaScript is disabled ... Then the content renders".
     Delete this comment block before publishing. -->

```gherkin
Scenario: [Descriptive name]
  Given [initial state]
  When [action or event]
  Then [observable outcome]

Scenario: [Descriptive name]
  Given [initial state]
  When [action or event]
  Then [observable outcome]
```
