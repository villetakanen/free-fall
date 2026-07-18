import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  webServer: {
    command: "pnpm exec serve dist -l 14322",
    port: 14322,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:14322",
  },
});
