# Feature: Platform

## Blueprint

### Context

free-fall is a web-native tabletop RPG authoring platform. The core delivery is static — game content authored in Markdown, rendered as a statically generated Astro site. The platform must support future interactive elements (character sheets, dice rollers) via client-side Svelte 5 islands, but the default is zero JavaScript shipped to the browser.

### Architecture

**Monorepo layout** (pnpm workspaces):

```
apps/
  free-fall/          # Astro SSG site — the main product
  design-system/      # Astro site documenting the design system (living styleguide)
packages/
  design-system/      # Shared components, tokens, and styles consumed by both apps
```

Additional packages may appear under `packages/` as the project grows.

**Runtime stack:**

| Layer | Technology | Notes |
|---|---|---|
| Static site | Astro (SSG) | Zero JS by default |
| Content | Markdown files | Each Astro page links to one or more `.md` files |
| Interactivity | Svelte 5 (CSR islands) | Only when needed; opt-in per component |
| Language | TypeScript | No `.js` files; strict mode |

**Package linking:**

Packages are linked via **Vite aliases**, not pnpm workspace protocol. This means:
- `tsconfig.json` paths and Vite `resolve.alias` are the linking mechanism
- No `workspace:*` references in `package.json` dependencies
- Each app's Vite/Astro config owns its alias map

**Toolchain:**

| Tool | Purpose | Config |
|---|---|---|
| pnpm | Package manager, workspace orchestration | `pnpm-workspace.yaml` |
| Biome | Linting + formatting (single tool) | `biome.json` |
| Lefthook | Git hooks | `lefthook.yml` |
| Conventional Commits | Commit message format | Enforced via Lefthook |
| Vitest | Unit/component tests | Per-package config |
| Playwright | E2E tests against built `dist/` | `apps/free-fall` |

**Responsive design:**

Mobile-first approach with three breakpoints:

| Name | Min-width | Target |
|---|---|---|
| base | 0 | Mobile (default) |
| tablet | 620px | Tablet / small landscape |
| desktop | 780px | Desktop / wide screen |

Styles are authored mobile-first: base styles apply to all sizes, `@media (min-width: 620px)` and `@media (min-width: 780px)` layer on progressively.

### Anti-Patterns

- **No pnpm workspace linking** — Do not use `workspace:*` protocol for cross-package imports. Use Vite aliases.
- **No JS files** — TypeScript only. No `.js`, `.mjs`, or `.cjs` source files (config files excepted where tooling requires it).
- **No eager JS shipping** — Do not add client-side JavaScript to Astro pages unless there is a specific interactive requirement. The default is static HTML + CSS.
- **No CSS frameworks** — The design system package owns all styling primitives. Do not introduce Tailwind, Bootstrap, or similar.
- **No runtime content fetching** — Content is statically resolved at build time from Markdown. No CMS, no API calls for content.
- **No E2E against dev server** — Playwright runs against the static `dist/` build, not a live dev server. The test target is the production artifact.

## Contract

### Definition of Done

- [ ] `pnpm install` succeeds from repo root
- [ ] `pnpm build` produces static output for `apps/free-fall`
- [ ] `pnpm lint` runs Biome across all packages with zero errors
- [ ] `pnpm typecheck` passes strict TypeScript across all packages
- [ ] Lefthook runs lint and commit message checks on pre-commit/commit-msg hooks
- [ ] Vite aliases resolve cross-package imports in both apps
- [ ] A sample Markdown file renders as a page on the Astro site
- [ ] `pnpm test` runs Vitest across all packages with zero failures
- [ ] `pnpm test:e2e` runs Playwright against the built `dist/` output

### Regression Guardrails

- Zero JavaScript in production build unless an explicit Svelte island is present
- All commits follow Conventional Commits format (enforced by hook, not honor system)
- `packages/design-system` has no dependency on either app — dependency flows one way: apps → packages

### Scenarios

Scenario: Clean build from scratch
  Given: A fresh clone of the repository
  When: `pnpm install && pnpm build` is run
  Then: Static HTML is generated in `apps/free-fall/dist/` with zero errors

Scenario: Markdown content renders as page
  Given: A Markdown file exists in the content directory
  When: The Astro site builds
  Then: The Markdown content appears as a rendered HTML page

Scenario: Design system component used in app
  Given: A component is exported from `packages/design-system`
  When: `apps/free-fall` imports it via the Vite alias
  Then: The component resolves correctly and renders in the build output

Scenario: Commit with bad message is rejected
  Given: Lefthook is installed
  When: A commit is attempted with a non-conventional message
  Then: The commit is rejected by the commit-msg hook

Scenario: Component tests pass
  Given: A component in `packages/design-system` has a `.test.ts` file
  When: `pnpm test` is run
  Then: Vitest executes the test and reports pass/fail

Scenario: E2E test validates built site
  Given: `apps/free-fall` has been built to `dist/`
  When: `pnpm test:e2e` is run
  Then: Playwright serves the static `dist/` and runs tests against it

Scenario: Mobile-first responsive layout
  Given: A page with responsive styles
  When: Viewed at 320px width
  Then: Base (mobile) styles apply with no horizontal overflow
  When: Viewed at 620px width
  Then: Tablet breakpoint styles activate
  When: Viewed at 780px width
  Then: Desktop breakpoint styles activate
