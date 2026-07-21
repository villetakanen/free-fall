# Feature: Callout Primitive

## Blueprint

### Context

A callout block is a structural typographic primitive used to highlight critical meta-information in the text (such as GM instructions, play-aids, warnings, or boundaries). It must strictly follow the taste rules outlined in `DESIGN.md`: no rounded/soft cards, no semantic warning rainbow, and no decorative icons.

Parent spec: `specs/design-system/spec.md`

### Architecture

**File locations:**

| File | Contents |
|---|---|
| `packages/design-system/src/styles/callout.css` | Class-based styles for `.callout`, `.callout-header`, and `.callout-body` |

**Styling & Token Intent:**

The callout visualizes structural separation using surface depth elevation, typography voice splits, and a background watermark:
- **Container (`.callout`):** Step up depth elevation using the primary elevated surface (`--freefall-bg-surface-1`) with sharp edges (`border-radius: 0`) and no border outlines.
- **Header (`.callout-header`):** Convey status/warning metadata using uppercase monospace and `--freefall-alert-base`.
- **Body (`.callout-body`):** Render explanations and rules prose in the standard clean sans-serif typeface to optimize readability.
- **Background Watermark (`.callout::after`):** Render `priority_high` by default or the optional `data-icon` Material Symbols ligature as a large top-left watermark using `--freefall-border-strong` at `0.35` opacity.

This is a class-based HTML primitive, not a prop-driven Astro component. Its
full author contract is `.callout` on the root, optional `data-icon`, optional
`.callout-header`, and required content in `.callout-body`. The root supplies
token-derived padding and vertical margins; header and body are layered above
the non-interactive watermark.


### Markdown Integration

To write callouts within standard Markdown files (`.md`), authors write raw HTML blocks with an optional `data-icon` attribute to set the background watermark icon:

```html
<div class="callout" data-icon="visibility">
  <div class="callout-header">GM EYES ONLY</div>
  <div class="callout-body">
    If you're playing in this one, close the tab. The ship is better when it surprises you.
  </div>
</div>
```

---

## Contract

### Definition of Done

- [x] `packages/design-system/src/styles/callout.css` implements callout styling.
- [x] `packages/design-system/src/styles/base.css` imports the callout stylesheet.
- [x] Demo app lists and documents Callouts at `/callout/`.
- [ ] Preface page uses the callout HTML structure.
- [x] `pnpm build`, `pnpm lint`, and `pnpm test` pass.

### Usage Guidelines

#### When to Use
- **GM Instructions & Secrets:** Isolate context, advice, or plot details meant only for the Game Master.
- **Reference Play Aids:** Group tables, checklists, or reference formulas that need to be parsed rapidly during play.
- **Rules Variations:** Highlight optional rules or module campaign tweaks.

#### Design Intent
- **Systemic Typographic Identity:** Monospace headers represent status and categorization; rules body prose remains in the clean sans-serif typeface to optimize readability.
- **Borderless Elevation Structure:** Containers rely entirely on sharp corners (`border-radius: 0`), padding, and surface fill (`var(--freefall-bg-surface-1)`) for card boundary contrast—avoiding rounded borders, outlines, or admonition left-stripes.
- **Flat Contrast Over Color Coding:** Emphasis is created through font voice splits and visual depth elevation—avoiding state-colored alert boxes (red, blue, green).
- **Background Classification Watermarks:** Faint background icons in the top-left corner serve as category markers—keeping the rules flow free of small decorative inline icon decorations.
