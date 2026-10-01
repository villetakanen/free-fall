import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import remarkDirective from "remark-directive";
import { rehypeContentUrlRewrite } from "./src/lib/rehype/rehype-content-url-rewrite";
import { remarkTermResolution } from "./src/lib/remark/remark-term-resolution";

// Unified merges registrations of the same function. Fresh wrappers preserve
// each package's options while forwarding the processor context.
function termResolutionInstance(): typeof remarkTermResolution {
  return function (options) {
    return remarkTermResolution.call(this, options);
  };
}

function contentUrlRewriteInstance(): typeof rehypeContentUrlRewrite {
  return function (options) {
    return rehypeContentUrlRewrite.call(this, options);
  };
}

export default defineConfig({
  output: "static",
  redirects: {
    "/core-rulebook/system-reference": "/srd",
    "/rules": "/core-rulebook/00-intro",
    "/rules/getting-started": "/core-rulebook/00-intro",
  },
  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
    remarkPlugins: [
      remarkDirective,
      [
        termResolutionInstance(),
        {
          registryPath: "../../content/core-rulebook/chapters/registry.md",
          contentPath: "/content/core-rulebook/",
        },
      ],
      // Scenarios are dependent content: terms resolve against the parent
      // variant's registry. Spec: specs/content-scenarios/spec.md#constraints
      [
        termResolutionInstance(),
        {
          registryPath: "../../content/core-rulebook/chapters/registry.md",
          contentPath: "/content/scenarios/",
        },
      ],
      [
        termResolutionInstance(),
        {
          registryPath: "../../content/core-rulebook/chapters/registry.md",
          contentPath: "/content/srd/",
        },
      ],
    ],
    rehypePlugins: [
      [
        contentUrlRewriteInstance(),
        { basePath: "/core-rulebook/", contentPath: "/content/core-rulebook/" },
      ],
      [
        contentUrlRewriteInstance(),
        { basePath: "/core-rulebook/", contentPath: "/content/scenarios/" },
      ],
      [
        contentUrlRewriteInstance(),
        { basePath: "/core-rulebook/", contentPath: "/content/srd/" },
      ],
    ],
  },
  integrations: [
    {
      name: "watch-content",
      hooks: {
        "astro:server:setup": ({ server }) => {
          server.watcher.add(
            fileURLToPath(
              new URL("../../content/core-rulebook/chapters", import.meta.url),
            ),
          );
          server.watcher.add(
            fileURLToPath(
              new URL("../../content/srd/chapters", import.meta.url),
            ),
          );
          server.watcher.add(
            fileURLToPath(new URL("../../content/gear/items", import.meta.url)),
          );
          server.watcher.add(
            fileURLToPath(new URL("../../content/scenarios", import.meta.url)),
          );
        },
      },
    },
  ],
  vite: {
    resolve: {
      alias: {
        "@free-fall/design-system": fileURLToPath(
          new URL("../../packages/design-system/src", import.meta.url),
        ),
      },
    },
  },
});
