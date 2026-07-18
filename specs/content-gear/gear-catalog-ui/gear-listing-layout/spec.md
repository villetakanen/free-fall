# Feature: Gear Listing Layout

## Blueprint

### Context

The gear category pages (`/gear/weapons/`, `/gear/armor/`, etc.) currently render each item as a heading + markdown prose in a linear list. With the `GearCard` component now available, each listing should pair the card with the item's markdown description side-by-side on desktop, and provide a compact card-only view with expandable description on mobile.

This gives players two complementary views of the same item: the card for at-a-glance stats during play, and the prose for context and flavor when they want to read more.

Parent spec: `specs/content-gear/gear-catalog-ui/spec.md`

### Architecture

#### Desktop layout (≥ 780px)

Each gear item renders as a horizontal row:

```
┌─────────────┐  ┌──────────────────────────────────────┐
│             │  │ Markdown description                  │
│  Equipment  │  │ (flavor text, effect, binding         │
│    Card     │  │  rationale — the full .md body)       │
│             │  │                                       │
│             │  │                                       │
└─────────────┘  └──────────────────────────────────────┘
```

- Card and description pane sit side by side using CSS flexbox
- Card is fixed-size (per gear-card spec: 32 × 44.5 space-1 units)
- Description pane fills remaining width, with prose-scoped styling
- Gap between card and pane: `calc(3 * var(--freefall-space-1))`
- Items separated by `calc(4 * var(--freefall-space-1))` vertical gap

#### Mobile layout (< 780px)

Each gear item renders as the card alone. A **(+)** expand button in the top-left corner of the card opens the markdown description in a modal overlay.

```
┌──────────────────┐
│ [+]              │
│                  │
│  Gear Card       │
│                  │
│                  │
└──────────────────┘
```

**Expand control and modal:**
- Each card has its own visible, labeled detail trigger and controlled dialog.
- Pointer opening, close control, and scrim dismissal remain functional without JavaScript.
- Progressive enhancement adds Enter/Space activation, synchronized expanded state, modal semantics, focus entry and containment, Escape dismissal, and focus restoration.
- The dialog remains within the viewport and scrolls internally when its prose is taller than the available space.

#### Responsive breakpoint

Uses `@media (min-width: 780px)` — the existing `--breakpoint-desktop` value. Below this: card + modal pattern. At and above: card + side pane.

#### Component structure

This is **not** a new design-system component. The layout is implemented directly in the gear category page (`src/pages/gear/[category].astro`) using scoped styles or a page-level `<style>` block. The page imports `GearCard` from the design system and composes the layout around it.

**Rationale:** The card/description pairing is specific to gear catalog pages. It doesn't belong in the design system as a generic component — it's page-level composition.

#### Data flow

The existing `getStaticPaths()` already provides the full item array with `data` and renderable `Content`. The page now additionally passes `item.data` to `GearCard` alongside the rendered `Content`.

### Dependencies

- **Depends on:** `GearCard.astro` (design system), gear content collection, existing category page routing
- **Depended on by:** Nothing — this is a leaf UI feature

### Anti-Patterns

- **HTML/CSS baseline.** Pointer open/close behavior remains available without a framework island. JavaScript enhances semantics and focus behavior.
- **No separate detail routes.** The description lives inline (desktop) or in a modal (mobile) — not on a new page.
- **No layout component in design-system.** This layout is page-specific composition, not a reusable pattern.
- **No hiding the card on desktop.** Both card and description are always visible on desktop — the card is not collapsed or replaced by the prose.

## Contract

### Definition of Done

- [ ] Desktop (≥ 780px): each gear item shows GearCard + markdown description side by side
- [ ] Mobile (< 780px): each gear item shows GearCard only, with (+) button
- [ ] Mobile (+) button opens a modal containing the item's markdown description
- [ ] Modal closes via close button, Escape key, and scrim click
- [ ] Pointer open/close controls work without JavaScript or a framework island
- [ ] Trigger exposes its controlled dialog and synchronized expanded state
- [ ] Dialog exposes modal semantics and an accessible title
- [ ] Opening moves focus into the dialog; Tab remains contained; closing restores focus to the trigger
- [ ] Each item's modal operates independently (opening one does not affect others)
- [ ] Card receives correct `data` prop with category-specific fields
- [ ] All 5 category pages render correctly with the new layout
- [ ] `pnpm build`, `pnpm lint`, and `pnpm typecheck` pass

### Regression Guardrails

- Gear content (titles, markdown bodies, frontmatter data) must render identically to before — only the layout changes
- Navigation active states must still work on gear category pages
- Pointer opening, close control, and scrim dismissal remain functional with JavaScript disabled.

### Scenarios

```
Scenario: Desktop side-by-side layout
  Given: A user views /gear/weapons/ on a ≥ 780px viewport
  When: The page renders
  Then: Each weapon shows an GearCard on the left and markdown description on the right
  And: The card displays binding costs, DV, harm type, and qualities from frontmatter
  And: The description pane shows the full markdown body

Scenario: Mobile card-only with expand
  Given: A user views /gear/weapons/ on a < 780px viewport
  When: The page renders
  Then: Each weapon shows only the GearCard
  And: A (+) button appears in the top-left corner of each card

Scenario: Mobile modal opens
  Given: A user is on mobile viewing /gear/armor/
  When: They tap the (+) button on the Ballistic Vest card
  Then: A modal overlay appears with the Ballistic Vest's markdown description
  And: A close button is visible in the modal

Scenario: Modal closes via Escape
  Given: A modal is open showing a gear item's description
  When: The user presses Escape
  Then: The modal closes and focus returns to the (+) button

Scenario: Modal contains keyboard focus
  Given: A gear detail modal is open
  When: The user tabs beyond its first or final control
  Then: Focus wraps within the modal

Scenario: Assistive technology receives dialog state
  Given: JavaScript is enabled
  When: A user opens a gear detail modal
  Then: The trigger reports expanded state and the modal exposes its title and modal semantics

Scenario: Multiple items independent
  Given: The weapons page shows 10 items
  When: The user opens the modal for "Kinetic Carbine"
  Then: Only the Kinetic Carbine modal is open
  And: All other items remain in their default (closed) state
```
