# Feature: Action Button

**Status:** Implemented and verified locally, 2026-10-26;
[#92](https://github.com/villetakanen/free-fall/issues/92).

## Blueprint

### Context

Parent: [Design System](../spec.md). Attribute spending, BMG conversion, and
Playground actions share one button treatment independent of stat colors.

### Architecture

- Native buttons use `.freefall-button` from
  `packages/design-system/src/styles/button.css`, loaded through `base.css`.
- `--freefall-button-height` is 5.5 spacing units (2.75rem, 44px at the default
  root size). Text buttons have that minimum height; `.freefall-button--square`
  provides an equally wide target for icons and compact ratios.
- The shared style owns surface, border, type, focus, hover, disabled states,
  and Material Symbols Sharp icon sizing. Typography uses the shared UI scale
  and body face; icon-only actions have an accessible action name.
- Defaults use `--freefall-bg-surface-2`, a 1px `--freefall-border-strong`
  outline, `--freefall-text-display`, square corners, and
  `--freefall-type-ui-small` in `--freefall-font-body`. The icon token
  `--freefall-button-icon-size` is 1.5rem (three spacing units).
- Hover, active, and keyboard-visible focus use `--freefall-action-base` for
  the border. Keyboard focus also has a separate visible outline. Disabled
  text uses `--freefall-text-muted`. Border transitions use 0.2s ease;
  reduced motion and print suppress them. Circle-specific timings are separate.
- Consumers own placement and action logic. Attribute circles do not override
  button colors, fonts, sizes, or interaction states. The existing circle
  highlight remains independent of button styling.
- Conversion buttons use `sync_alt` with a fixed small mono `2:1` caption below
  the target. The BMG consumer owns that caption and keeps it outside the
  shared button's 2.75rem footprint.
- Native disabled buttons and `aria-disabled` buttons show unavailability.
  Consumers of `aria-disabled` guard the action and provide a reason while
  retaining keyboard focus.

### Constraints

Navigation and HUD rail controls retain their specialized component contracts.
The action style adds no JavaScript or dependency and works in Astro and Svelte.

## Contract

### Definition of Done

- [x] Stat actions, conversion actions, DS demo actions, and Playground actions
  use the shared style, without local visual button overrides.
- [x] Square actions measure 2.75rem by 2.75rem; text actions meet that height.
- [x] Hover/focus colors stay identical across Body, Mind, and Ghost buttons.
- [x] Keyboard focus, disabled guards, and accessible icon names remain usable.
- [x] `pnpm build`, `pnpm lint`, and `pnpm test` pass.

### Regression Guardrails

- Attribute ink must never recolor shared action buttons.
- Buttons must never reduce their minimum target to fit a narrower circle.

### Verification references

The [circle demo](../../../apps/design-system/src/components/CharacterCircleDemo.svelte)
shows square stat/conversion actions and text actions together.
[Browser checks](../../../apps/design-system/e2e/character-circles.spec.ts)
compare computed button appearance across all three stats, conversions, and a
plain DS action, and verify square dimensions and accessible names.

### Scenarios

```gherkin
Scenario: Consistent stat controls
  Given Body, Mind, and Ghost each display an action button
  When a user hovers or focuses each action
  Then each uses the same shared button appearance and target dimensions
  And the surrounding circle may highlight in its own attribute color
```
