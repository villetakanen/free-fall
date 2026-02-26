import { expect, test } from "@playwright/test";

test.describe("AppTray Component interactions", () => {
  test("Mobile viewport (<620px): Hidden, opens as overlay, dismisses via scrim", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/app-tray/");

    const tray = page.locator(".app-tray__rail-column");
    const hamburger = page.locator(".hamburger-btn__label");
    const scrim = page.locator(".app-tray__scrim");

    // Wait for page to settle
    await page.waitForLoadState("networkidle");

    // Default closed state: Tray should be positioned completely off-screen
    // Because it has transform: translateX(-100%)
    expect(
      await tray.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        return rect.right <= 0;
      }),
    ).toBeTruthy();

    // Click Hamburger to Open
    await hamburger.click();

    // Verify overlay opened (Wait for transform to finish bringing it to x=0)
    await expect(tray).toBeInViewport();

    // Scrim should be visible on mobile
    await expect(scrim).toBeVisible();

    // Click Scrim to Close
    await scrim.click({ position: { x: 350, y: 350 } });

    // Verify it closed (Wait for it to leave the viewport)
    await page.waitForFunction(() => {
      const el = document.querySelector(".app-tray__rail-column");
      if (!el) return false;
      return el.getBoundingClientRect().right <= 0;
    });
  });

  test("Tablet viewport (620px - 779px): Rail visible, expands as overlay", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 700, height: 800 });
    await page.goto("/app-tray/");
    await page.waitForLoadState("networkidle");

    const tray = page.locator(".app-tray__rail-column");
    const hamburger = page.locator(".hamburger-btn__label");
    const testButtonLabel = page.locator(".tray-button__label").first();

    // Default: Rail visible, compact
    await expect(tray).toBeInViewport();

    const box = await tray.boundingBox();
    expect(box?.width).toBe(80); // 10 * 8px space-1 token

    // The label should be virtually invisible due to container queries
    let labelBox = await testButtonLabel.boundingBox();
    expect(labelBox?.width).toBeLessThanOrEqual(1);

    // Click Hamburger to Open
    await hamburger.click();

    // Verify tray expanded to 320px
    await page.waitForFunction(() => {
      const el = document.querySelector(".app-tray__rail-column");
      return el && el.getBoundingClientRect().width === 320;
    });

    // Label should now be full width
    labelBox = await testButtonLabel.boundingBox();
    expect(labelBox?.width).toBeGreaterThan(1);

    // Scrim should be present on tablet as an overlay
    await expect(page.locator(".app-tray__scrim")).toBeVisible();
  });

  test("Desktop viewport (>=780px): Rail visible, expands and pushes content", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto("/app-tray/");
    await page.waitForLoadState("networkidle");

    const tray = page.locator(".app-tray__rail-column");
    const hamburger = page.locator(".hamburger-btn__label");
    const main = page.locator("main");

    // Default: Rail visible
    const box = await tray.boundingBox();
    expect(box?.width).toBe(80);

    // Content should have left margin accounting for the rail (~80px + padding)
    const initialMainBox = await main.boundingBox();

    // Click Hamburger to Open
    await hamburger.click();

    // Verify tray expanded
    await page.waitForFunction(() => {
      const el = document.querySelector(".app-tray__rail-column");
      return el && el.getBoundingClientRect().width === 320;
    });

    // Scrim should NOT be visible on desktop
    await expect(page.locator(".app-tray__scrim")).toBeHidden();

    // The content width should have shrunk to accommodate the 320px tray
    const expandedMainBox = await main.boundingBox();
    expect(expandedMainBox?.width).toBeLessThan(initialMainBox?.width || 0);
  });

  test("Keyboard Access: Escape key closes the tray", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto("/app-tray/");
    await page.waitForLoadState("networkidle");

    const _tray = page.locator(".app-tray__rail-column");
    const hamburger = page.locator(".hamburger-btn__label");

    // Open tray
    await hamburger.click();

    await page.waitForFunction(() => {
      const el = document.querySelector(".app-tray__rail-column");
      return el && el.getBoundingClientRect().width === 320;
    });

    // Hit escape
    await page.keyboard.press("Escape");

    // Verify it closed back to rail mode
    await page.waitForFunction(() => {
      const el = document.querySelector(".app-tray__rail-column");
      return el && el.getBoundingClientRect().width === 80;
    });
  });
});
