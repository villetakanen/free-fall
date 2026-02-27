# Feature: [Name]

<!--
  Spec template — ASDLC "The Spec" pattern
  https://asdlc.io/patterns/the-spec

  A spec is the permanent source of truth for a feature. It defines
  *how* the system works (Blueprint) and *how* we know it works (Contract).

  Same-commit rule: if code behavior changes, the spec MUST be updated
  in the same commit.

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

     Be prescriptive — this is a contract, not a suggestion. -->

### Anti-Patterns

<!-- What must an implementer NOT do? List concrete prohibitions with
     brief rationale. Examples:
     - No framework islands for toggle UI — use CSS checkbox pattern
     - No raw px values — derive from grid tokens
     - No wrapping page content in navigation components -->

## Contract

### Definition of Done

<!-- Observable, verifiable success criteria as a checkbox list.
     Each item should be testable — no subjective language.
     Always end with: `pnpm build`, `pnpm lint`, and `pnpm test` pass. -->

- [ ] ...
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

<!-- Invariants that must NEVER break, even as the feature evolves.
     These protect against regressions during future changes.
     State them as imperatives: "X must never Y". -->

### Scenarios

<!-- Behavioral specs in Gherkin-style Given/When/Then format.
     Cover the critical paths, edge cases, and progressive enhancement.
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
