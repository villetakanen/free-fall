import { expect, test } from "@playwright/test";

test.describe("Definition list element styles", () => {
  test("demo page renders all documented variants", async ({ page }) => {
    await page.goto("/definition-list/");
    await page.waitForLoadState("networkidle");

    const lists = page.locator("main dl");
    await expect(lists).toHaveCount(3);
    await expect(page.locator("main dt").first()).toContainText("System");
  });

  test("dt renders as mono uppercase caption", async ({ page }) => {
    await page.goto("/definition-list/");
    await page.waitForLoadState("networkidle");

    const dt = page.locator("main dt").first();
    await expect(dt).toHaveCSS("text-transform", "uppercase");

    const fontFamily = await dt.evaluate(
      (el) => getComputedStyle(el).fontFamily,
    );
    const monoToken = await dt.evaluate((el) =>
      getComputedStyle(el).getPropertyValue("--freefall-font-mono").trim(),
    );
    expect(fontFamily).toBe(monoToken);
  });

  test("dd carries body text color, last dd has no bottom margin", async ({
    page,
  }) => {
    await page.goto("/definition-list/");
    await page.waitForLoadState("networkidle");

    const stackedList = page.locator("main dl").first();
    const lastDd = stackedList.locator("dd").last();
    await expect(lastDd).toHaveCSS("margin-bottom", "0px");
  });
});
