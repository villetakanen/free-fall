# 04 — Validation

**Goal:** Playwright E2E tests and responsive foundation — proving the platform contract end-to-end.

## Deliverables

**Playwright E2E**
- Playwright config in `apps/free-fall`
- Tests run against built `dist/` (not dev server)
- At least one test: build the site, serve `dist/`, assert page renders
- Root `pnpm test:e2e` script

**Responsive foundation**
- Mobile-first base styles using the design system breakpoint tokens
- CSS custom properties or mixins for the three breakpoints (base, 620px, 780px)
- At least one page demonstrating responsive behavior
- Playwright viewport test: no horizontal overflow at 320px

## Done When

- `pnpm test:e2e` exits 0 against the production build
- All three breakpoints are exercised in at least one page
- Zero JS in production build (unless an explicit Svelte island is present)
- The full Definition of Done checklist from `spec.md` passes
