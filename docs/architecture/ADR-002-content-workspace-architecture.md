# ADR-002: Monorepo Content Workspace and Rulebook Architecture

**Status:** Proposed

**Date:** 2026-03-01

## Context

The FREE//FALL project is structured as a monorepo. Currently, the rules text and game content are housed within a standard package directory (`packages/free-fall-core-rulebook`). This package is configured similarly to a logic library (containing `package.json` with build scripts, an `src/` directory, and TypeScript dependencies), despite its primary function being the storage of static Markdown (`.md`) files and visual assets.

As the FREE//FALL universe expands, treating content packages identically to code packages introduces unnecessary complexity:
1.  **Tooling Overhead:** Content packages do not require compilation (`tsc`), complex bundling, or logic-focused CI/CD pipelines.
2.  **Semantic Mismatch:** A rulebook is not software logic. Placing it in `packages/` alongside UI components or shared utilities creates cognitive dissonance regarding the package's purpose.
3.  **Internal Structure:** The current internal structure (`src/content/rules/`) is over-engineered and redundant for a package whose sole purpose is to serve a book's content.

Furthermore, our vision aims to explore the future of digital publishing. To align with this, the architecture representing published content must reflect publishing semantics rather than software engineering semantics.

## Decision

We will restructure the monorepo to explicitly separate content from logic and presentation by introducing a dedicated `content/` workspace at the repository root.

Specifically:

1.  **New Workspace:** We will add `content/*` to the `pnpm-workspace.yaml` configuration.
2.  **Migration:** We will move the existing core rules from `packages/free-fall-core-rulebook` to `content/core-rulebook`.
3.  **The Book Metaphor Structure:** We will flatten and rename the internal structure of the rulebook to reflect traditional publishing paradigms. The `src/content/rules/` hierarchy will be replaced with a `chapters/` directory.
    -   *Example Structure:*
        ```text
        content/core-rulebook/
        ├── package.json
        ├── chapters/
        │   ├── 01-introduction.md
        │   ├── 02-system-reference.md
        │   └── 03-registry.md
        └── assets/
        ```
4.  **Simplified Configuration:** The `package.json` for the rulebook will be stripped of TypeScript compilation steps, type definitions, and complex module exports. It will function as a pure data/content package exporting static files.

## Consequences

**Positive:**
-   **Clear Separation of Concerns:** The monorepo structure firmly defines Presentation (`apps/`), Logic (`packages/`), and Data/Prose (`content/`).
-   **Publishing Alignment:** The "book metaphor" (`chapters/`) establishes a clear, domain-driven language that aligns with the project's vision for digital publishing. It is immediately intuitive to writers, editors, and developers.
-   **Simplified CI/CD:** Content workspaces can bypass expensive build steps (like `tsc`) and focus purely on linting (formatting, spellchecking, markdown validation).
-   **Scalability:** Future books, campaign settings, or modules can simply be added as new directories under `content/` (e.g., `content/campaign-setting`).

**Negative:**
-   **Refactoring Cost:** Moving the package and changing its export structure will break existing import paths in the consuming applications (specifically `apps/free-fall`). A significant refactor of the web app will be required to update these import paths.

**Neutral:**
-   The package identifier inside `package.json` will remain scoped (e.g., `@free-fall/core-rulebook`) to ensure consistent resolution via `pnpm`, even though the physical directory has moved.
