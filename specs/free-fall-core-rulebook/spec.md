# Feature: Core Rulebook

## Blueprint

### Context

The FREE//FALL core ruleset is the foundational rules engine for the TTRPG. To adhere to the project's static delivery and decoupled data architecture, the core rules must be entirely abstracted from the display layer (`apps/free-fall`). By treating the rules themselves as a distinct package, we can ensure that content creation scales independently from the web platform engineering.

### Architecture

**Package Layout**:
The rulebook will reside as a package inside the monorepo, entirely devoid of logic or display components.

```
packages/
  free-fall-core-rulebook/
    package.json       # Minimal package config exporting the markdown assets
    src/
      content/         # The core markdown rules definitions
        chapter-1/
          index.md     # e.g., Introduction and The Void
        chapter-2/
          index.md     # e.g., Mechanics and Resolution
```

**Content Standard**:
- **Format**: Pure Markdown (`.md`).
- **Typography Integration**: The markdown content must be written cleanly so that when it is injected into the `.freefall-prose` scope by a consumer application, it automatically adheres to the Editorial Typography Scale.

**Consumption Architecture**:
Applications (such as the `free-fall` Astro website) will link to this package via **Vite aliases**, standard to the project's monorepo architecture. 

**Dual Reporting Structure**:
Because the rulebook is isolated:
1. **The Rules Version**: The raw markdown files can be read, version-controlled, or compiled into purely textual rule exports.
2. **The App Version**: `apps/free-fall` will import the markdown files during its static build step to render the stylized, interactive digital rulebook.

**Versioning Protocol**:
The core mechanics are strictly versioned.
- The initial `package.json` version must be set to `7.0.0-alpha.1`.
- The package must export this version string programmatically (e.g., via an `index.ts` file reading it or exporting a hardcoded constant) so that consumer apps like `apps/free-fall` can read the strict semantic versioning and render it natively without duplicating the string.

### Anti-Patterns

- **No React/Svelte/Astro in the Rulebook**: The rulebook package must contain zero presentation components. It is strictly a data layer.
- **No Hardcoded Styles**: Do not include inline HTML or CSS within the markdown. Formatting must be purely semantic (using standard markdown `#`, `##`, `>`).
- **No `workspace:*` Protocol**: Like the `design-system` package, applications must consume the rulebook via Vite aliases, not eager pnpm workspace symbolic links.

## Contract

### Definition of Done

- [ ] `packages/free-fall-core-rulebook` exists with a minimal `package.json`.
- [ ] A sample markdown rule document is hosted within the package.
- [ ] The core rulebook package exports its markdown paths cleanly for downstream consumption.
- [ ] The `platform` spec is respected (no JS runtime, strict TS/Markdown standard).
