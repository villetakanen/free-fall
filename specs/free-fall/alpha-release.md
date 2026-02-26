# Feature: App Alpha Release

## Blueprint

### Context

The first iteration of the FREE//FALL application (`apps/free-fall`) is designed to serve as a lightweight, read-only proof of concept for the TTRPG mechanics. 

The primary requirement for this Alpha Release is to render the underlying core ruleset (supplied via the `packages/free-fall-core-rulebook` markdown content) using the Editorial Typography Hierarchy (`.freefall-prose`) developed in the `design-system` package. 

### Architecture

**Minimal Interface**:
The Alpha is a raw content reader. As such, the first iteration does not require the global navigation structures planned for later cycles.
- The `AppTray` and `Rail` components are hidden in this iteration.
- The `HamburgerButton` will be visually suspended or removed via local CSS overrides since there is only a single routed page (the primary rule document).

**Routing**:
- A single index page (`/`) or a singular wildcard route (`/rules/[...slug]`) will act as the consumption layer.
- Astro's built-in `getCollection` (if using content collections) or direct import paths via Vite aliases will be used to pull the `.md` files directly from `packages/free-fall-core-rulebook`.

**Rendering Chain**:
1. The App imports markdown rules from `free-fall-core-rulebook`.
2. Astro parses the markdown to raw HTML.
3. The App wraps the emitted HTML inside the `freefall-prose` scoped class to inject FREE//FALL's strict typeface sizes, weights, and layout measures (65ch).

### Anti-Patterns

- **No CMS or Fetch APIs**: Do not attempt to dynamically load the rules from an external server. The content is statically resolved from the local rulebook package at compile time.
- **Do not modify the Design System**: The Design System `AppShell` and `AppTray` components must remain intact. If they need to be hidden for the Alpha, perform the override *locally* within `apps/free-fall` (e.g., using `display: none` in a scoped style block). Do not pollute the generic primitives with app-specific states.

## Contract

### Definition of Done

- [ ] `apps/free-fall/src/pages/index.astro` successfully bridges to `packages/free-fall-core-rulebook`.
- [ ] The app renders the markdown content visually using `.freefall-prose`.
- [ ] The Application Shell is modified locally to disable irrelevant navigation elements (Tray/Rail) for the single-page alpha experience.
- [ ] The build produces a fully static `dist/` payload representing the localized Alpha experience.
