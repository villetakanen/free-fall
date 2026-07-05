import { expect, test } from "@playwright/test";

test("index page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header .title").first()).toContainText(
    "FREE//FALL",
  );
});

test("markdown content page renders", async ({ page }) => {
  await page.goto("/core-rulebook/00-intro/");
  await expect(page.locator("header .title").first()).toContainText(
    "Introduction",
  );
  await expect(page.locator("body")).toContainText("FREE//FALL");
});

test("legacy /rules URL redirects to core rulebook", async ({ page }) => {
  await page.goto("/rules/getting-started/");
  await expect(page).toHaveURL(/\/core-rulebook\/00-intro/);
});

test("empty scenarios package shows no Scenarios rail item", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("body")).not.toContainText("Scenarios");
});
