# Feature: Term Resolution Engine

## Blueprint

### Context

FREE//FALL content uses domain-specific game terms (Action Pool, Harm Slot, Target Number, etc.) that need consistent linking to their definitions. Content authors — including the LLM Content Agent — write `:term[Term Name]` directives in markdown. The term resolution engine transforms these into semantic links pointing to the local `registry.md` within the same content package.

This keeps content packages self-contained and portable: every term resolves within its own package, and orphaned terms cause a build failure.

Parent spec: `specs/content-workspace/spec.md`

### Architecture

**Directive syntax:**

Content authors write inline term references using the [generic directive syntax](https://talk.commonmark.org/t/generic-directives-plugins-syntax/444):

```markdown
The GM sets the :term[Target Number] based on difficulty.
```

This requires `remark-directive` in the remark pipeline to parse `:term[...]` into a `textDirective` AST node.

**Registry structure:**

Each content package contains a `registry.md` in its `chapters/` directory. Terms are defined using the `<dfn>` element with an explicit `id` attribute:

```markdown
---
title: "Registry"
order: 91
---

# Registry

<dfn id="action-pool">Action Pool</dfn>

A pool of 2 to 5 twenty-sided dice (d20). Allocated each turn to actions the character wants to take.

<dfn id="target-number">Target Number</dfn>

The difficulty threshold for a roll, set by the GM. Abbreviated TN.
```

Structure rules:

| Rule | Detail |
|---|---|
| Term anchor | `<dfn id="slug">Display Name</dfn>` |
| ID format | Lowercase kebab-case, manually authored |
| One `<dfn>` per term | Each term gets its own `<dfn>` element |
| Prose follows | Definition text follows the `<dfn>` in the same or subsequent paragraph |

The `<dfn>` element is semantic HTML specifically designated for term definitions. This is a deliberate exception to the content workspace's "no inline HTML" guideline — `<dfn>` carries meaning, not presentation.

**Transformation pipeline:**

```
markdown source
  │
  ├─ remark-directive        ← parses :term[X] into textDirective node
  ├─ remark-term-resolution  ← transforms directive → <a> with term attributes
  ├─ remark → rehype
  ├─ rehype-content-url-rewrite  ← normalizes ./registry#slug → /core-rulebook/registry/#slug
  │
  HTML output
```

Pipeline ordering is critical: the term resolution plugin outputs relative hrefs (`./registry#slug`), and the existing URL rewrite plugin normalizes them to absolute site paths. The term resolution plugin must run **before** remark-to-rehype conversion. The URL rewrite plugin runs **after**.

**Identifier mapping (slugification):**

The `:term` value is slugified to produce a URL fragment:

| Step | Rule |
|---|---|
| Lowercase | `Action Pool` → `action pool` |
| Spaces → hyphens | `action pool` → `action-pool` |
| Strip non-alphanumeric | Keep `[a-z0-9-]` only |
| Collapse hyphens | `some--term` → `some-term` |
| Trim hyphens | `-term-` → `term` |

The resulting slug must match a `<dfn id="...">` in the package's `registry.md`.

**HTML output schema:**

`:term[Strength Check]` produces:

```html
<a href="./registry#strength-check"
   class="game-term"
   data-term-key="strength-check"
   rel="glossary">Strength Check</a>
```

| Attribute | Value | Purpose |
|---|---|---|
| `href` | `./registry#slug` | Relative path — portable across packages, normalized by URL rewrite plugin |
| `class` | `game-term` | Styling hook for the design system |
| `data-term-key` | Raw slug | Frontend hook for tooltips, sidebars, or in-page term resolution without navigation |
| `rel` | `glossary` | Semantic relationship — identifies the link as a glossary reference |

The display text is the original content from within the brackets: `:term[Action Pool]` renders as "Action Pool".

**Plugin implementation:**

| File | Contents |
|---|---|
| `apps/free-fall/src/lib/remark/remark-term-resolution.ts` | Remark plugin — directive transformation + registry indexing |
| `apps/free-fall/src/lib/remark/remark-term-resolution.test.ts` | Unit tests |

**Plugin configuration:**

```typescript
interface TermResolutionOptions {
  /** Filesystem path to the content package's chapters directory */
  registryPath: string;
  /** Guard: only process files whose path contains this substring */
  contentPath: string;
}
```

**Astro config integration:**

```typescript
// astro.config.ts
import remarkDirective from "remark-directive";
import { remarkTermResolution } from "./src/lib/remark/remark-term-resolution";

export default defineConfig({
  markdown: {
    remarkPlugins: [
      remarkDirective,
      [remarkTermResolution, {
        registryPath: "../../content/core-rulebook/chapters/registry.md",
        contentPath: "/content/core-rulebook/",
      }],
    ],
    rehypePlugins: [
      [rehypeContentUrlRewrite, { /* existing config */ }],
    ],
  },
});
```

**Registry indexing:**

At plugin initialization (not per-file), the plugin:

1. Reads the `registry.md` file from `registryPath`
2. Parses it as HTML (the `<dfn>` elements survive markdown processing)
3. Extracts all `<dfn id="...">` elements
4. Builds a `Set<string>` of valid term slugs

This index is built once and reused across all files in the build.

**Validation:**

| Check | Trigger | Result |
|---|---|---|
| Orphaned term | `:term[Foo]` slug not in registry index | Build error with file path, line, and term name |
| Missing registry | `registryPath` file not found | Build error at plugin initialization |
| Content path mismatch | File path doesn't contain `contentPath` | File skipped (no processing, no validation) |

Validation is per-file: when a `:term` directive is encountered and its slug is not in the registry, the build fails immediately with a clear error message identifying the file, the term, and the expected registry entry.

**Dependencies:**

| Package | Purpose |
|---|---|
| `remark-directive` | Parses `:term[...]` syntax into AST nodes |
| `unist-util-visit` | Tree traversal (already a dependency) |

**Scalability:**

When a second content package is added (e.g., `content/campaign-primer/`), a second `remarkTermResolution` instance is registered in the Astro config with that package's `registryPath` and `contentPath`. Each instance indexes its own registry. Term resolution never crosses package boundaries.

### Anti-Patterns

- **No cross-package term resolution** — A `:term` in `core-rulebook` must resolve to `core-rulebook/chapters/registry.md`, never to another package's registry. Package isolation is absolute.
- **No auto-generated IDs in registry** — Term IDs are explicitly authored via `<dfn id="...">`. This prevents silent breakage from heading text changes.
- **No fallback for missing terms** — An unresolved term is a build error, not a degraded link. Content integrity is enforced at build time.
- **No rehype-stage term processing** — The directive must be resolved in the remark stage (before remark-to-rehype conversion). This ensures the URL rewrite plugin receives a standard `<a>` tag to normalize.
- **No runtime term resolution** — All terms are resolved at build time. The `data-term-key` attribute enables optional client-side enhancement (tooltips, etc.) but the link itself is fully functional without JavaScript.

## Contract

### Definition of Done

- [ ] `remark-directive` added as a dependency to `apps/free-fall`
- [ ] `remark-term-resolution.ts` implemented in `apps/free-fall/src/lib/remark/`
- [ ] Plugin parses `registry.md` at initialization and builds a term index from `<dfn id="...">` elements
- [ ] `:term[Term Name]` directives produce `<a>` tags with `href`, `class`, `data-term-key`, and `rel` attributes as specified
- [ ] Build fails with a clear error when a `:term` slug has no match in the registry
- [ ] Build fails with a clear error when `registryPath` does not exist
- [ ] Files outside `contentPath` are skipped entirely
- [ ] `astro.config.ts` registers `remarkDirective` and `remarkTermResolution` in the remark pipeline
- [ ] URL rewrite plugin correctly normalizes `./registry#slug` hrefs produced by term resolution
- [ ] Unit tests cover: basic transformation, slugification edge cases, orphaned term error, missing registry error, content path guard, multiple terms in one file
- [ ] `registry.md` migrated to `<dfn id="...">` format
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

- Term links must always include `data-term-key` — the frontend depends on it for progressive enhancement
- The URL rewrite plugin must continue to process term-generated `<a>` tags (they use relative `./registry#slug` hrefs, same pattern as author-written links)
- Registry `<dfn>` IDs must be lowercase kebab-case — the slugification algorithm assumes this
- Plugin must not process files outside its `contentPath` — this prevents false positives in app-owned markdown
- Adding a new `:term` without a registry entry must break the build — silent pass-through is not acceptable

### Scenarios

```gherkin
Scenario: Basic term resolution
  Given registry.md contains <dfn id="action-pool">Action Pool</dfn>
  And a content file contains :term[Action Pool]
  When the build runs
  Then the HTML contains <a href="./registry#action-pool" class="game-term" data-term-key="action-pool" rel="glossary">Action Pool</a>

Scenario: URL rewrite normalizes term href
  Given the term resolution plugin outputs href="./registry#action-pool"
  And rehype-content-url-rewrite is configured with basePath="/core-rulebook/"
  When the rehype pipeline runs
  Then the final href is "/core-rulebook/registry/#action-pool"

Scenario: Orphaned term fails the build
  Given registry.md does not contain <dfn id="plasma-rifle">
  And a content file contains :term[Plasma Rifle]
  When the build runs
  Then the build fails with an error identifying the file, line, and unresolved term "Plasma Rifle"

Scenario: Missing registry fails the build
  Given registryPath points to a nonexistent file
  When the plugin initializes
  Then the build fails with a clear error about the missing registry

Scenario: Content path guard
  Given a markdown file at src/content/landing/hero.md contains :term[Action Pool]
  And the plugin's contentPath is "/content/core-rulebook/"
  When the build runs
  Then the directive is not processed (left as-is or rendered as plain text)

Scenario: Multiple terms in one paragraph
  Given registry.md contains <dfn id="target-number"> and <dfn id="action-pool">
  And a content file contains "Roll your :term[Action Pool] against the :term[Target Number]."
  When the build runs
  Then both terms are resolved to separate <a> tags within the same paragraph

Scenario: Case-insensitive slugification
  Given registry.md contains <dfn id="harm-slot">Harm Slot</dfn>
  And a content file contains :term[Harm Slot] (mixed case)
  When the slug is computed
  Then it matches "harm-slot" in the registry
```
