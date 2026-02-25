import { fileURLToPath } from "node:url";
import svelte from "@astrojs/svelte";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  integrations: [svelte()],
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
