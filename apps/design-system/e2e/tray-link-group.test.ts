import { expect, test } from "@playwright/test";

test.describe("TrayLinkGroup Component", () => {
  test("Expanded Tray shows inner links and they are focusable", async ({
    page,
  }) => {
    await page.goto("/tray-link-group/");
    await page.waitForLoadState("networkidle");

    // The open state container
    const openContainer = page.locator(
      '.demo-container[data-tray-state="open"]',
    );
    const group = openContainer.locator(".tray-link-group");
    const links = group.locator(".tray-link");

    // The group should be visible since container is 320px wide
    await expect(group).toBeVisible();

    // Secondary links should be visible and accessible
    const linkCount = await links.count();
    expect(linkCount).toBe(4);

    for (let i = 0; i < linkCount; i++) {
      await expect(links.nth(i)).toBeVisible();
    }

    // Check keyboard navigation logic
    // Focus the document body first, then tab to reach the links
    await page.keyboard.press("Tab"); // Might hit something else first, let's tab through the links explicitly

    // Evaluate to verify focusability directly
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      await link.focus();
      const isFocused = await link.evaluate(
        (node) => document.activeElement === node,
      );
      expect(isFocused).toBe(true);
    }
  });

  test("Minimized Tray hides inner links", async ({ page }) => {
    await page.goto("/tray-link-group/");
    await page.waitForLoadState("networkidle");

    const minimizedContainer = page.locator(
      '.demo-container[data-tray-state="minimized"]',
    );
    const group = minimizedContainer.locator(".tray-link-group");
    const firstLink = group.locator(".tray-link").first();

    // Verify it is completely hidden via display: none, which takes it out of the layout
    await expect(group).toBeHidden();
    await expect(firstLink).toBeHidden();

    // Check that hidden links cannot be focused
    // Playwright locator.isVisible() checking handles `display: none` inherently correctly
    const isHidden = await firstLink.isHidden();
    expect(isHidden).toBe(true);

    // Press tab and verify focus does not land inside the hidden group
    await page.keyboard.press("Tab");
    const activeElementClass = await page.evaluate(
      () => document.activeElement?.className || "",
    );
    expect(activeElementClass).not.toContain("tray-link");
  });

  test("Long Title Handling", async ({ page }) => {
    await page.goto("/tray-link-group/");
    await page.waitForLoadState("networkidle");

    const openContainer = page.locator(
      '.demo-container[data-tray-state="open"]',
    );
    // The last link has a very long label
    const longLink = openContainer.locator(".tray-link").last();
    const label = longLink.locator(".tray-link__label");

    // Check that no wrapping occurs (white-space: nowrap)
    const cssWhiteSpace = await label.evaluate((el) => {
      return window.getComputedStyle(el).whiteSpace;
    });
    expect(cssWhiteSpace).toBe("nowrap");

    // Check that text-overflow is ellipsis
    const cssTextOverflow = await label.evaluate((el) => {
      return window.getComputedStyle(el).textOverflow;
    });
    expect(cssTextOverflow).toBe("ellipsis");

    // Check that overflow is hidden
    const cssOverflow = await label.evaluate((el) => {
      return window.getComputedStyle(el).overflow;
    });
    // In some browsers overflow computes to hidden for overflow-x and overflow-y
    expect(cssOverflow).toContain("hidden");
  });
});
