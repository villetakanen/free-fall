import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  image: { service: { entrypoint: "astro/assets/services/noop" } },
  // Dev server binds to the network and trusts any Host header, so the docs
  // can be previewed from another device (LAN/Tailscale). Dev-only; the
  // static build is unaffected.
  server: { host: true },
  vite: {
    server: { allowedHosts: [".ts.net"] },
    resolve: {
      alias: {
        "@free-fall/design-system": fileURLToPath(
          new URL("../../packages/design-system/src", import.meta.url),
        ),
      },
    },
  },
});
