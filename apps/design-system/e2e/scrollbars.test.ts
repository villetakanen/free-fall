import { expect, test } from "@playwright/test";

test.describe("Custom Scrollbars Showcase", () => {
  test("demo page renders documented sections and token table", async ({
    page,
  }) => {
    await page.goto("/scrollbars/");

    await expect(page.locator("h1")).toContainText("Custom Scrollbars");
    await expect(page.locator("body")).toContainText(
      "--freefall-scrollbar-thumb",
    );

    // Check live demo containers
    const canvasDemo = page.locator(".demo-card--canvas .scroll-box");
    await expect(canvasDemo).toBeVisible();

    const surface1Demo = page
      .locator(".demo-card--surface-1 .scroll-box")
      .first();
    await expect(surface1Demo).toBeVisible();

    const surface2Demo = page.locator(".demo-card--surface-2 .scroll-box");
    await expect(surface2Demo).toBeVisible();

    // Verify thin scrollbar style
    const scrollbarWidth = await canvasDemo.evaluate((el) => {
      return window.getComputedStyle(el).scrollbarWidth;
    });
    expect(scrollbarWidth).toBe("thin");
  });

  test("Design Tokens nav contains Custom Scrollbars link", async ({
    page,
  }) => {
    await page.goto("/tokens/");
    const scrollbarsLink = page.locator('a[href="/scrollbars/"]');
    await expect(scrollbarsLink).toBeVisible();
    await expect(scrollbarsLink).toContainText("Custom Scrollbars");
  });
});
