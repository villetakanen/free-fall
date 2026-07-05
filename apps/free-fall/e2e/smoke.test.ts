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

test("scenarios listing is reachable from the rail and lists scenarios", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("body")).toContainText("Scenarios");
  await page.goto("/scenarios/");
  await expect(page.locator("main h1")).toContainText("Scenarios");
  await expect(page.locator("main")).toContainText("Northern Lights");
});

test("scenario overview renders classification metadata", async ({ page }) => {
  await page.goto("/scenarios/northern-lights/");
  await expect(page.locator("main")).toContainText("NORTHERN LIGHTS");
  await expect(page.locator(".scenario-meta")).toContainText("FREE//FALL");
  await expect(page.locator(".scenario-meta")).toContainText("3–5");
});
