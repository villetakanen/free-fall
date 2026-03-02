# Feature: Content URL Rewrite Plugin

## Blueprint

### Context

The FREE//FALL core rulebook content is authored in Markdown within the `content/core-rulebook/chapters/` directory. Authors use standard relative Markdown links (e.g., `[Action resolution](system-reference#action-resolution)`) to link between different sections and chapters.

However, when Astro renders these Markdown files via `src/pages/core-rulebook/[id].astro`, the resulting site URLs reflect the routing structure (e.g., `/core-rulebook/registry/` and `/core-rulebook/system-reference/`). Because the Astro dev server and production builds might use trailing slashes or different base paths, standard relative browser resolution for these Markdown links often fails, resulting in broken links or 404 errors (e.g., resolving to `/core-rulebook/registry/system-reference#action-resolution` instead of `/core-rulebook/system-reference/#action-resolution`).

### Architecture

To fix this, we will introduce a custom **Rehype plugin** (`rehype-content-url-rewrite`) that intercepts the HTML AST after Markdown conversion but before final rendering. This plugin will find all `<a>` tags and rewrite their `href` attributes to correctly map against the actual Astro site routing.

**1. Plugin Location:**
The plugin will logically reside in a utility folder. For example, `packages/utils/src/rehype-content-url-rewrite.ts` (if a utils package exists) or directly within the app at `apps/free-fall/src/lib/rehype-content-url-rewrite.ts`. Given the current structure, let's place it in `apps/free-fall/src/lib/rehype/rehype-content-url-rewrite.ts`.

**2. Plugin Implementation:**
The plugin will adhere to the unified/rehype ecosystem surface API.
It will utilize `unist-util-visit` to traverse the AST.

```typescript
import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Element } from 'hast';

export interface ContentUrlRewriteOptions {
  /**
   * The base path to prepend to the rewritten URLs.
   * e.g., '/core-rulebook/'
   */
  basePath: string;
}

export const rehypeContentUrlRewrite: Plugin<[ContentUrlRewriteOptions], Root> = (options) => {
  const { basePath } = options;

  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      // 1. Only process <a> tags
      if (node.tagName !== 'a') return;
      
      const href = node.properties?.href;
      
      // 2. Ignore non-string hrefs, absolute URLs (http://), absolute paths (/), and mailto/tel
      if (
        typeof href !== 'string' ||
        href.startsWith('http') ||
        href.startsWith('/') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')
      ) {
        return;
      }

      // 3. Process relative links.
      // E.g., href = 'system-reference#action-resolution'
      // We need to resolve this against the basePath.
      
      // If it's just a hash link (e.g., '#action-resolution'), leave it alone to jump within the same page
      if (href.startsWith('#')) return;

      // Ensure basePath ends with a slash for consistent joining
      const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`;
      
      // Clean up the href to remove leading '.\/' or '..\/' if authors used them, 
      // though typically in this specific content structure they just use the filename.
      // For simplicity in this v1, we assume the href is just the target markdown filename (without .md) + optional hash,
      // because that's how it's authored in the content/ folder.
      
      const newHref = `${normalizedBasePath}${href}`;
      
      // Update the property
      node.properties.href = newHref;
    });
  };
};
```

**3. Astro Configuration Integration:**
Update `apps/free-fall/astro.config.ts` to register the rehype plugin.

```typescript
// apps/free-fall/astro.config.ts
import { defineConfig } from "astro/config";
import { rehypeContentUrlRewrite } from "./src/lib/rehype/rehype-content-url-rewrite";

export default defineConfig({
  // ... existing config
  markdown: {
    // ... existing shikiConfig
    rehypePlugins: [
      [rehypeContentUrlRewrite, { basePath: '/core-rulebook' }]
    ],
  },
  // ...
});
```

### Edge Cases to Handle

*   **Same-page hash links:** Links like `[Top](#top)` should remain `#top` and not be prefixed, so they jump around the current page correctly.
*   **External links:** Links starting with `http://` or `https://` must be ignored.
*   **Root-absolute links:** Links authored as `/about` must be ignored as they are already absolute to the site root.
*   **Trailing slashes in Astro:** By default, Astro's `build.format: 'directory'` creates `[id]/index.html`. If the href is rewritten to `/core-rulebook/system-reference#action-resolution`, Astro's router / browser will still handle this correctly, eventually landing on `/core-rulebook/system-reference/#action-resolution`. The plugin doesn't strictly need to add the trailing slash before the hash, but it could be more robust to do so depending on Astro's exact trailingSlash config. For this spec, simply prefixing the `basePath` is sufficient.

### Anti-Patterns

*   **Requiring authors to write absolute paths:** The markdown files in `content/` should remain pure and unaware of the final site routing. Do not force authors to write `[Action resolution](/core-rulebook/system-reference#...)`.
*   **Using client-side JS to fix links:** This must be done at build-time / render-time in the Astro pipeline, not via a `<script>` tag running in the browser.

## Contract

### Definition of Done

- [ ] Reype plugin `rehypeContentUrlRewrite` is implemented in `apps/free-fall/src/lib/rehype/rehype-content-url-rewrite.ts`.
- [ ] Dependencies (e.g., `unist-util-visit`, `@types/hast`) are added to the workspace if not already present.
- [ ] Plugin ignores absolute URLs (`http://`, `https://`), mailto links, and absolute paths (`/`).
- [ ] Plugin ignores pure hash links (`#section`).
- [ ] Plugin successfully prepends the configured `basePath` to relative links.
- [ ] `apps/free-fall/astro.config.ts` is updated to include `rehypeContentUrlRewrite` in its `markdown.rehypePlugins` array, passing `{ basePath: '/core-rulebook' }`.
- [ ] The core rulebook pages build successfully.
- [ ] Clicking a relative link (like `system-reference#action-resolution`) from `/core-rulebook/registry` successfully navigates to the correct target page instead of a 404 path.

### Regression Guardrails

-   The plugin must not crash the build if an `<a>` tag lacks an `href` attribute.
-   The plugin must only run on Markdown content processed by Astro's standard pipeline.

### Scenarios

Scenario: Relative link to another chapter
  Given: A markdown file contains `[System Reference](system-reference)`
  When: Astro renders the page
  Then: The resulting HTML contains `<a href="/core-rulebook/system-reference">...</a>`

Scenario: Relative link to a specific section in another chapter
  Given: A markdown file contains `[Action resolution](system-reference#action-resolution)`
  When: Astro renders the page
  Then: The resulting HTML contains `<a href="/core-rulebook/system-reference#action-resolution">...</a>`

Scenario: Same-page anchor link
  Given: A markdown file contains `[Back to top](#intro)`
  When: Astro renders the page
  Then: The resulting HTML remains `<a href="#intro">...</a>`

Scenario: External link
  Given: A markdown file contains `[Wikipedia](https://wikipedia.org)`
  When: Astro renders the page
  Then: The HTML remains `<a href="https://wikipedia.org">...</a>`
