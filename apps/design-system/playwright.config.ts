import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  webServer: {
    command: "npx serve dist -l 4322",
    port: 4322,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:4322",
  },
});
