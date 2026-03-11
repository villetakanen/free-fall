import { expect, test } from "@playwright/test";

test("no horizontal overflow at 320px (mobile)", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  const body = page.locator("body");
  const scrollWidth = await body.evaluate((el) => el.scrollWidth);
  const clientWidth = await body.evaluate((el) => el.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});

test("content pane is a size container for container queries", async ({
  page,
}) => {
  await page.setViewportSize({ width: 620, height: 800 });
  await page.goto("/");
  const containerType = await page
    .locator("main")
    .evaluate((el) => getComputedStyle(el).containerType);
  expect(containerType).toBe("inline-size");
});

test("content pane scrolls vertically", async ({ page }) => {
  await page.setViewportSize({ width: 780, height: 900 });
  await page.goto("/");
  const overflowY = await page
    .locator("main")
    .evaluate((el) => getComputedStyle(el).overflowY);
  expect(overflowY).toBe("auto");
});
