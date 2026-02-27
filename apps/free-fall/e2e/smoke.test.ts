import { expect, test } from "@playwright/test";

test("index page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".app-shell__title").first()).toContainText(
    "FREE//FALL",
  );
});

test("markdown content page renders", async ({ page }) => {
  await page.goto("/rules/getting-started/");
  await expect(page.locator(".app-shell__title").first()).toContainText(
    "Getting Started",
  );
  await expect(page.locator("body")).toContainText("tabletop RPG");
});
