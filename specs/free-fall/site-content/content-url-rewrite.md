# Feature: Content URL Rewrite Plugin

## Blueprint

### Context

The FREE//FALL core rulebook content is authored in Markdown within the `content/core-rulebook/chapters/` directory. Authors use standard relative Markdown links (e.g., `[Action resolution](system-reference#action-resolution)`) to link between different sections and chapters.

However, when Astro renders these Markdown files via `src/pages/core-rulebook/[id].astro`, the resulting site URLs reflect the routing structure. Astro's default behavior generates cleanly nested URLs (e.g. `/core-rulebook/system-reference/`). If standard HTML anchor tags are emitted identically to the markdown relative paths, the browser's relative link resolution often constructs broken paths (like appending `system-reference` to the current folder). 

To ensure authors can write intuitive relative markdown paths without coupling content to the SSG routing layer, we need an interception layer.

### Architecture

We will introduce a custom **Rehype plugin** (`rehype-content-url-rewrite`) that intercepts the HTML AST after Markdown conversion but before final rendering. The plugin finds all `<a>` tags and normalizes their `href` attributes against the Astro site routing architecture.

**Plugin Location:** `apps/free-fall/src/lib/rehype/rehype-content-url-rewrite.ts`

**Plugin Configuration Options:**
*   `basePath`: The routing prefix to prepend to rewritten URLs (e.g., `/core-rulebook/`).
*   `contentPath`: A guard path ensuring only documents originating from this real filesystem path are processed (e.g., `/content/core-rulebook/`). This prevents rewriting links on standard UI pages (like `src/pages/about.md`).

**Desired Behavior & Edge Cases:**
- **URL Normalization:** Relative links pointing to peer markdown files must be prefixed with the `basePath` (e.g., `registry` -> `/core-rulebook/registry/`).
- **File Extension Stripping:** Authors often write links containing the `.md` extension out of habit (e.g., `registry.md`). The plugin must strip this extension before generating the ultimate site URL.
- **Current Directory Stripping:** Authors sometimes explicitly declare relative current paths (e.g., `./registry`). The plugin must strip `./` before prefixing the `basePath`.
- **Intra-page Anchors:** Anchors referencing the current page (e.g., `#top`) must be left entirely untouched.
- **Cross-page Anchors:** Anchors attaching to a different page (e.g., `registry#tables`) must be normalized, retaining the hash but ensuring the base path ends in a trailing slash immediately preceding the hash (`/core-rulebook/registry/#tables`) to behave consistently with Astro's routing.
- **External/Absolute Ignoral:** The plugin must ignore absolute URLs (`http://`, `https://`), absolute paths (`/`), and protocol references (`mailto:`, `tel:`). Only pure relative paths are processed.

### Anti-Patterns

*   **Requiring authors to write absolute paths:** The markdown files in `content/` should remain pure and unaware of the final site routing.
*   **Assuming file paths are always present:** If the Unified processor fails to pass a file path to the transformer (which can happen natively in the pipeline), the plugin must fail safely (by opting *out* of processing), rather than rewriting potentially invalid content.

## Contract

### Definition of Done

- [ ] Rehype plugin `rehypeContentUrlRewrite` is implemented in `apps/free-fall/src/lib/rehype/rehype-content-url-rewrite.ts`.
- [ ] Dependencies (e.g., `unist-util-visit`, `@types/hast`, `vfile`) are added to the workspace.
- [ ] Plugin ignores documents that do not securely match the `contentPath` option, or documents where the path is undefined.
- [ ] Plugin ignores absolute URLs, absolute paths, and standard protocols.
- [ ] Plugin ignores pure hash links (`#section`).
- [ ] Plugin correctly strips `.md` extensions and `./` prefixes.
- [ ] Plugin guarantees a trailing slash before any appended hashes.
- [ ] Comprehensive unit tests cover all behavioral edge cases.
- [ ] `apps/free-fall/astro.config.ts` is updated to include `rehypeContentUrlRewrite` in its `markdown.rehypePlugins` array.

### Regression Guardrails

-   The plugin must not crash the build if an `<a>` tag lacks an `href` attribute.
-   The plugin must only run on Markdown content matching the `contentPath` parameter.

### Scenarios

Scenario: Relative link to another chapter
  Given: A markdown file contains `[System Reference](system-reference)`
  When: Astro renders the page
  Then: The resulting HTML contains `<a href="/core-rulebook/system-reference/">...</a>`

Scenario: Relative link referencing explicit file extensions
  Given: A markdown file contains `[System Reference](system-reference.md)`
  When: Astro renders the page
  Then: The resulting HTML contains `<a href="/core-rulebook/system-reference/">...</a>`

Scenario: Relative link defining explicit current directory
  Given: A markdown file contains `[System Reference](./system-reference)`
  When: Astro renders the page
  Then: The resulting HTML contains `<a href="/core-rulebook/system-reference/">...</a>`

Scenario: Relative link to a specific section in another chapter
  Given: A markdown file contains `[Action resolution](system-reference#action-resolution)`
  When: Astro renders the page
  Then: The HTML contains `<a href="/core-rulebook/system-reference/#action-resolution">...</a>`

Scenario: Same-page anchor link
  Given: A markdown file contains `[Back to top](#intro)`
  When: Astro renders the page
  Then: The resulting HTML remains `<a href="#intro">...</a>`

Scenario: Link attempting to name a chapter "https-rules"
  Given: A markdown file contains `[HTTPS details](https-rules)`
  When: Astro renders the page
  Then: URL correctly resolves to `<a href="/core-rulebook/https-rules/">...</a>` (not skipped as external)

Scenario: External link
  Given: A markdown file contains `[Wikipedia](https://wikipedia.org)`
  When: Astro renders the page
  Then: The HTML remains `<a href="https://wikipedia.org">...</a>`

Scenario: Markdown page from outside the content path
  Given: A markdown file in `src/pages/about.md` contains `[Home](../)`
  When: Astro renders the page
  Then: The plugin skips the file completely and the HTML remains `<a href="../">...</a>`
