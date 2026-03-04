import { fileURLToPath } from "node:url";
import svelte from "@astrojs/svelte";
import { defineConfig } from "astro/config";
import { rehypeContentUrlRewrite } from "./src/lib/rehype/rehype-content-url-rewrite";

export default defineConfig({
  output: "static",
  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
    rehypePlugins: [
      [
        rehypeContentUrlRewrite,
        { basePath: "/core-rulebook/", contentPath: "/content/core-rulebook/" },
      ],
    ],
  },
  integrations: [
    svelte(),
    {
      name: "watch-rulebook",
      hooks: {
        "astro:server:setup": ({ server }) => {
          server.watcher.add(
            fileURLToPath(
              new URL("../../content/core-rulebook/chapters", import.meta.url),
            ),
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
