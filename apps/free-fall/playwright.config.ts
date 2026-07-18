import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  webServer: {
    command: "pnpm exec serve dist -l 14321",
    port: 14321,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:14321",
  },
});
