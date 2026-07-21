# FREE//FALL — Design Language

> The brand document. Read this before designing any new component or page.
> Component specs capture *intent*; this file defines *taste*. When a new
> piece of UI could belong to any generic docs site, it fails this document —
> even if it satisfies its spec.

## What this is for

FREE//FALL is an experiment in publishing tabletop RPGs in a web-native
format. The UI is an artifact of **how games could be delivered in the
future** — not of the game's fictional world. This is not an art project:
components are modern, functional delivery machinery first. What makes them
FREE//FALL is that they **convey the game's theme and concepts** — through
palette, typography, and tone, and by treating rules and material as data
and hypertext instead of imitating a book.

Two layers, kept deliberately distinct:

- **Content may be diegetic.** The mission brief, a ship AI's dialogue, a
  transmission — that is the *game's material*, and it can speak in-world.
- **The UI is not.** Chrome, navigation, components, and system text are a
  product surface. They carry the theme's mood; they never pretend to be
  props from 2048.

## The theme supplies the palette

The look derives from the game's mood, not from web fashion. The token names
say it plainly:

- **The Void** — near-black cobalt canvas (`--freefall-bg-canvas`, hsl 220 43% 3%). The game is about hard vacuum and dark ships; the interface is dark and calm by default.
- **Ceramic** — highlights and display text are off-white, not pure white: legible, slightly warm, unhurried.
- **Isotope Neon** — one acid-yellow accent (hsl 64). It is scarce on purpose: in a dark interface, the bright color *is* information.
- **Attribute glows** — Flare Orange (Body), Tritium Green (Mind), Isotope (Ghost). These three belong to *game stats only*. They are not a semantic UI palette.
- **The terminal vernacular** — mono type, ALL-CAPS field labels, `$$REDACTED$$` — belongs to *diegetic content* (briefs, transmissions). The UI may echo its discipline (terseness, fielded data); it does not wear its costume.

## The two voices (typography)

Typography carries a semantic split that everything else builds on:

| Voice | Face | Speaks for |
|---|---|---|
| **Editorial** | Lato — big confident chapter heads, readable body | The *product and the book*: rules prose, scenario narration, UI copy |
| **Data** | IBM Plex Mono | Structured and systemic text: stat labels, dt captions, version readouts, code, and diegetic machine speech in content |

This is a rule, not a habit: **prose is Lato; data is mono.** A stat label,
a `P(detection) = 0.03%`, a version string — mono. Explanation, narration,
navigation — Lato. A component that sets data in the editorial face (or
prose in mono) is speaking in the wrong voice.

The type scale runs on the augmented fourth (`--freefall-type-ratio: 1.414`)
— the tritone. Headings jump aggressively; there is no polite 1.2 gradient
here. Keep it that way.

## Color discipline

- **Two hues, plus the stat trio.** Cobalt and isotope. There is deliberately no red/green/blue semantic rainbow — no "danger red", no "success green". Emphasis is created by *contrast and scarcity*, not by adding hues. If a design "needs" a new color, it almost certainly needs a different device instead (the data voice, weight, isolation, elevation).
- **Acid is a highlighter, not a paint.** Its canonical uses: links (marker-highlight over text), alert emphasis, the ALPHA scrawl. Every additional use dilutes all of them.
- **Depth by elevation, not outline.** Surfaces step 950 → 900 → 800. Prefer a slightly raised surface to a stroked box; borders are hairline and reserved for real edges (the tray's right edge, a table rule).

## Structure and hardware

- **The grid is 0.5rem and non-negotiable.** Production dimensions derive from spacing tokens. The narrow literal-length exceptions are the ones documented in the design-token contract: CSS query conditions, deliberately circular or pill-shaped radii, and standard visually-hidden one-pixel geometry.
- **Sharp, not soft.** Icons are Material Symbols *Sharp*. Corners are square or barely eased; the one deliberate exception is the pill-shaped tray button (M3 heritage). Do not introduce friendly rounded cards.
- **Structure encodes the concept.** The best existing components work because their structure *is* their meaning — and the meaning is a *delivery* idea, not a prop: the gear card works because gear is **queryable data** with its bindings and qualities exposed as fields; the term registry works because rules are **hypertext**; the scenario rail works because navigation is a **play aid**. When designing something new, ask: *what game concept does this deliver, and what does the web let it be that paper couldn't?* Design that — not a book feature, and not a movie prop.

## Copy register

Second person, present tense, clipped. Dark humor allowed in content, filler
allowed nowhere. "Check your seals." beats "Please review the safety
information below." UI copy is plainer still: name what the control does,
in the product's voice — clear first, themed second. Diegetic fielded text
(`TARGET:`, `RoE:`) stays in diegetic content.

## The anti-checklist

Signs a design is drifting into generic-docs-site territory — or
overcorrecting into an art project. Both fail:

- ❌ **The admonition box** — tinted background + colored left rule + icon = Notion/GitBook, not FREE//FALL. (First callout draft died of this.)
- ❌ **Costume UI** — chrome dressed up as in-world hardware: fake terminals for navigation, HUD frames around content, scanline overlays. Theme is conveyed by palette, type, and tone — not by pretending the reader is in the fiction.
- ❌ **Semantic color rainbow** — adding red for errors, green for success, blue for info.
- ❌ **Icon garnish** — icons sprinkled for decoration. An icon earns its place by labeling something (rail buttons) or by carrying data.
- ❌ **Rounded friendly cards** with drop shadows.
- ❌ **Neutral corporate copy** — "Note that…", "Important:", "Learn more".
- ❌ **Numbered decoration** — 01/02/03 markers on content that isn't a sequence.
- ❌ **Book skeuomorphism** — page numbers, spreads, appendix letters, anything that exists only because paper worked that way.

## How to use this document

Designing something new? Before writing CSS:

1. Name the **game concept or delivery job** the component serves (a rule as hypertext, gear as data, a warning the reader must not miss, a play aid at the table).
2. Ask **what the web lets it be that paper couldn't** — that answer is usually the design.
3. Pick its **voice** (editorial or data) — that decides the face.
4. Spend color only where it carries information.
5. Sketch it against the anti-checklist — both failure modes: generic SaaS docs *and* movie prop.

Calibration: a new component should sit comfortably between the home page's
"Year 2048" editorial spread and the gear catalog's data cards — themed,
disciplined, and unmistakably a product for playing games, not a book scan
and not a prop.
