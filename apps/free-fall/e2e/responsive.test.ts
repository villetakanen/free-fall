import { expect, test } from "@playwright/test";

test("no horizontal overflow at 320px (mobile)", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  const body = page.locator("body");
  const scrollWidth = await body.evaluate((el) => el.scrollWidth);
  const clientWidth = await body.evaluate((el) => el.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});

test("tablet breakpoint activates at 620px", async ({ page }) => {
  await page.setViewportSize({ width: 620, height: 800 });
  await page.goto("/");
  const padding = await page
    .locator("body")
    .evaluate((el) => getComputedStyle(el).paddingLeft);
  // At tablet, padding should be 2rem = 32px
  expect(Number.parseFloat(padding)).toBeGreaterThanOrEqual(32);
});

test("desktop breakpoint activates at 780px", async ({ page }) => {
  await page.setViewportSize({ width: 780, height: 900 });
  await page.goto("/");
  const maxWidth = await page
    .locator("body")
    .evaluate((el) => getComputedStyle(el).maxWidth);
  // At desktop, max-width should be 60rem = 960px
  expect(maxWidth).toBe("960px");
});
