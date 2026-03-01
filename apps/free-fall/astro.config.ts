import { fileURLToPath } from "node:url";
import svelte from "@astrojs/svelte";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
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
