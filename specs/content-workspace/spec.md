# Feature: Content Workspace Architecture

## Blueprint

### Context

The FREE//FALL monorepo separates presentation (`apps/`), logic (`packages/`), and — with this feature — prose and game content (`content/`). Content packages contain static Markdown and visual assets; they have no compilation step, no TypeScript, and no framework dependencies. Treating them identically to code packages creates tooling overhead, semantic mismatch, and an over-engineered internal structure.

This spec establishes the `content/` workspace convention, migrates the core rulebook as its first content package, and documents the updated consumption architecture for `apps/free-fall`.

**Supersedes:** `specs/free-fall-core-rulebook/spec.md`
**Amends:** `specs/free-fall/core-rulebook-nav/spec.md` (route segments, loader paths, nav helper)
**Implements:** `docs/architecture/ADR-002-content-workspace-architecture.md`

### Architecture

**Workspace definition**

A new workspace root `content/*` is added to `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "content/*"
```

Each directory under `content/` is a pnpm workspace member with its own `package.json`. Package names remain scoped (e.g., `@free-fall/core-rulebook`) for consistent resolution, even though the physical directory has moved.

**Content package structure (book metaphor)**

Content packages use publishing-domain language. The internal hierarchy uses `chapters/` (not `src/content/rules/`) and `assets/` (not `public/` or `static/`):

```
content/core-rulebook/
├── package.json
├── chapters/
│   ├── system-reference.md
│   └── registry.md
└── assets/
```

| Directory | Purpose |
|---|---|
| `chapters/` | Markdown content files — one per chapter or section |
| `assets/` | Images, diagrams, and other media referenced by chapters |

**Filename convention:** Filenames are descriptive kebab-case without numeric prefixes (e.g., `system-reference.md`, not `02-system-reference.md`). Chapter ordering is controlled exclusively by the frontmatter `order` field. This keeps Astro content collection entry IDs clean and directly usable as URL segments.

**Content file standard:**

- Format: Plain Markdown (`.md`)
- Frontmatter is required: `title` (string), `description` (string, optional), `order` (number, optional)
- No inline HTML or CSS — formatting is purely semantic (standard markdown headings, blockquotes, lists)
- Content must render cleanly inside the `.freefall-prose` scope defined by the consuming app

**Simplified `package.json`:**

```json
{
  "name": "@free-fall/core-rulebook",
  "version": "0.7.1",
  "type": "module",
  "description": "The FREE//FALL core rules — game content package.",
  "scripts": {
    "lint": "biome check ."
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.4"
  }
}
```

Key differences from the current package:
- No `typescript` devDependency
- No `typecheck` script
- No `exports` field — content is consumed via filesystem paths, not module resolution
- No `index.ts` — there is nothing to export programmatically
- No `env.d.ts` — no TypeScript means no type declarations

**Version exposure:**

The version lives in `package.json`. Consumer apps read it directly via a file import:

```ts
// VersionInfo.astro
import { version as CORE_VERSION } from "../../../../../content/core-rulebook/package.json";
```

There is no `index.ts` re-export. The `package.json` version string is the single source of truth.

**Content collection configuration**

The Astro content collection loader is updated to reference the new path:

```ts
// apps/free-fall/src/content.config.ts
const coreRulebook = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "../../content/core-rulebook/chapters",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().optional(),
  }),
});
```

The collection name remains `"core-rulebook"`. The glob loader uses a relative filesystem path — not a Vite alias — because Astro's loader operates on the filesystem.

**Routing convention**

Route segments match the content package directory name under `content/`. The core rulebook directory is `content/core-rulebook`, so routes are at `/core-rulebook/[id]`.

| Collection entry ID | Generated route |
|---|---|
| `system-reference` | `/core-rulebook/system-reference/` |
| `registry` | `/core-rulebook/registry/` |

The dynamic page moves from `src/pages/free-fall-core-rulebook/[id].astro` to `src/pages/core-rulebook/[id].astro`. Its implementation is unchanged — it queries `getCollection("core-rulebook")` and renders each entry's Content within BaseLayout inside a `.freefall-prose` scope.

**Navigation helper update**

The nav helper in `apps/free-fall/src/lib/nav.ts` updates its URL generation:

```ts
export async function getCoreRulebookNavItems(pathname: string) {
  const entries = (await getCollection("core-rulebook"))
    .sort((a, b) => (a.data.order ?? Infinity) - (b.data.order ?? Infinity));

  return entries.map((entry) => ({
    label: entry.data.title,
    href: `/core-rulebook/${entry.id}/`,
    active: pathname === `/core-rulebook/${entry.id}/`,
  }));
}
```

BaseLayout updates its active-state check to match:

```ts
active: Astro.url.pathname === "/" ||
        Astro.url.pathname.startsWith("/core-rulebook/"),
```

**HMR watch integration**

The Astro dev server watcher updates its path:

```ts
// astro.config.ts — watch-rulebook integration
server.watcher.add(
  fileURLToPath(
    new URL("../../content/core-rulebook/chapters", import.meta.url),
  ),
);
```

**Removed configuration**

The following are removed entirely after migration:

| Artifact | Reason |
|---|---|
| Vite alias `@free-fall/core-rulebook` in `astro.config.ts` | No module to resolve — content is loaded via filesystem |
| tsconfig `paths` for `@free-fall/core-rulebook` | No TypeScript imports from content packages |
| `/// <reference path>` to rulebook `env.d.ts` in app's `env.d.ts` | Content package has no type declarations |
| `packages/free-fall-core-rulebook/` directory | Replaced by `content/core-rulebook/` |
| `packages/free-fall-core-rulebook/src/index.ts` | Content packages have no programmatic exports |
| `packages/free-fall-core-rulebook/env.d.ts` | No TypeScript in content packages |

**Scalability**

Future content packages follow the same pattern. Adding `content/campaign-primer/` with a `package.json` and `chapters/` directory automatically makes it a workspace member. A new content collection and dynamic page route (`/campaign-primer/[id]`) can be added independently.

**Dependencies**

- **Depends on:** Biome (markdown linting), Astro content collections API
- **Depended on by:** `apps/free-fall` (content rendering, navigation, version display)

### Anti-Patterns

- **No TypeScript in content packages** — Content packages are pure data. Adding TypeScript creates build steps that content authors should never encounter.
- **No `index.ts` or programmatic exports** — Content is consumed via Astro's content collection loader (filesystem) and `package.json` imports. Module resolution is not involved.
- **No Vite aliases for content packages** — Aliases exist to map module specifiers. Content packages have no modules. The glob loader and direct file imports use filesystem paths.
- **No `workspace:*` protocol** — Content packages are resolved via filesystem paths, not pnpm workspace symbolic links.
- **No numeric prefixes in filenames** — Ordering is controlled by frontmatter `order`, not filename. Numeric prefixes would leak into entry IDs and URLs.
- **No inline HTML or CSS in markdown** — Content must be format-agnostic. The `.freefall-prose` scope handles all presentation.
- **No framework components in content packages** — Zero React, Svelte, or Astro components. Content packages are strictly a data layer.
- **No route segments that diverge from the content directory name** — `/core-rulebook/` matches `content/core-rulebook/`. This convention is enforced for all content packages.

## Contract

### Definition of Done

- [ ] `pnpm-workspace.yaml` includes `"content/*"` as a workspace glob
- [ ] `content/core-rulebook/` exists with `package.json`, `chapters/`, and `assets/` directories
- [ ] `content/core-rulebook/package.json` has no TypeScript dependency, no `typecheck` script, no `exports`, and no `index.ts`
- [ ] All existing markdown files are moved from `packages/free-fall-core-rulebook/src/content/rules/` to `content/core-rulebook/chapters/` with content and frontmatter intact
- [ ] `packages/free-fall-core-rulebook/` is deleted
- [ ] `apps/free-fall/src/content.config.ts` loader base path points to `../../content/core-rulebook/chapters`
- [ ] Dynamic page is at `src/pages/core-rulebook/[id].astro` (old `free-fall-core-rulebook/` directory removed)
- [ ] Nav helper generates hrefs as `/core-rulebook/{id}/`
- [ ] BaseLayout active check uses `/core-rulebook/` prefix
- [ ] HMR watcher path updated to `../../content/core-rulebook/chapters`
- [ ] Vite alias for `@free-fall/core-rulebook` removed from `astro.config.ts`
- [ ] tsconfig `paths` for `@free-fall/core-rulebook` removed
- [ ] `env.d.ts` reference to rulebook `env.d.ts` removed
- [ ] `VersionInfo.astro` imports version from `content/core-rulebook/package.json`
- [ ] Content links in `apps/free-fall/src/content/landing/intro.md` updated to `/core-rulebook/` paths
- [ ] Adding a new `.md` file to `content/core-rulebook/chapters/` automatically produces a new route and nav entry without code changes
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass

### Regression Guardrails

- The homepage at `/` must continue to render without errors
- All existing rulebook content must be accessible at the new `/core-rulebook/` routes
- Typography rendering within `.freefall-prose` scope must be visually unchanged
- Version display in VersionInfo must continue to show the core rulebook version
- The navigation tray must not break on pages outside `/core-rulebook/`
- Content files must never contain framework imports, inline HTML, or inline CSS

### Scenarios

```gherkin
Scenario: Core rulebook entry is routable at new path
  Given a markdown file `system-reference.md` exists in `content/core-rulebook/chapters/` with frontmatter title "System Reference Document"
  When a user navigates to `/core-rulebook/system-reference/`
  Then the page renders the markdown content within BaseLayout with title "System Reference Document — FREE//FALL"

Scenario: Old route no longer exists
  Given the route `/free-fall-core-rulebook/system-reference/` previously existed
  When a user navigates to `/free-fall-core-rulebook/system-reference/`
  Then the route returns a 404

Scenario: Submenu uses new route segments
  Given the core-rulebook collection contains entries "System Reference Document" (order 1) and "Registry" (order 2)
  When the tray is in the expanded state
  Then "System Reference Document" links to `/core-rulebook/system-reference/`
  And "Registry" links to `/core-rulebook/registry/`

Scenario: Home button active on content pages
  Given a user is on `/core-rulebook/registry/`
  When the tray renders
  Then the Home tray button is marked active
  And the "Registry" sub-link has `aria-current="page"`

Scenario: New chapter auto-discovered
  Given a new file `weapons.md` is added to `content/core-rulebook/chapters/` with frontmatter title "Weapons" and order 3
  When the app is rebuilt
  Then `/core-rulebook/weapons/` is a valid route
  And "Weapons" appears as the third sub-link under Home

Scenario: New content package follows convention
  Given a new directory `content/campaign-primer/` is created with a valid `package.json` and `chapters/` directory
  When `pnpm install` is run
  Then the package is recognized as a workspace member
  And a new content collection and `/campaign-primer/[id]` route can be added by the app

Scenario: Version display reads from content package
  Given `content/core-rulebook/package.json` has version "0.7.1"
  When the landing page renders VersionInfo
  Then the rules version displays "0.7.1"
```
