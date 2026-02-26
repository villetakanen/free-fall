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
              new URL(
                "../../packages/free-fall-core-rulebook/src",
                import.meta.url,
              ),
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
        "@free-fall/core-rulebook": fileURLToPath(
          new URL(
            "../../packages/free-fall-core-rulebook/src",
            import.meta.url,
          ),
        ),
      },
    },
  },
});
