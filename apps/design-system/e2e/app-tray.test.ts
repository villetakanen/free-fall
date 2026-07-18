import { expect, test } from "@playwright/test";

test.describe("AppTray Component interactions", () => {
  test("Mobile viewport (<620px): Hidden, opens as overlay, dismisses via scrim", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/app-tray/");

    const tray = page.locator(".app-tray .drawer");
    const hamburger = page.getByRole("button", { name: "Toggle navigation" });
    const scrim = page.locator(".app-tray .scrim");

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
      const el = document.querySelector(".app-tray .drawer");
      if (!el) return false;
      return el.getBoundingClientRect().right <= 0;
    });
  });

  test("Tablet viewport (620px - 779px): Rail visible, expands as overlay", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 620, height: 800 });
    await page.goto("/app-tray/");
    await page.waitForLoadState("networkidle");

    const tray = page.locator(".app-tray .drawer");
    const hamburger = page.getByRole("button", { name: "Toggle navigation" });
    const testButtonLabel = page.locator(".tray-button .label").first();

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
      const el = document.querySelector(".app-tray .drawer");
      return el && el.getBoundingClientRect().width === 320;
    });

    // Label should now be full width
    labelBox = await testButtonLabel.boundingBox();
    expect(labelBox?.width).toBeGreaterThan(1);

    // Scrim should be present on tablet as an overlay
    await expect(page.locator(".app-tray .scrim")).toBeVisible();
  });

  test("Desktop viewport (>=780px): Rail visible, expands and pushes content", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto("/app-tray/");
    await page.waitForLoadState("networkidle");

    const tray = page.locator(".app-tray .drawer");
    const hamburger = page.getByRole("button", { name: "Toggle navigation" });
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
      const el = document.querySelector(".app-tray .drawer");
      return el && el.getBoundingClientRect().width === 320;
    });

    // Scrim should NOT be visible on desktop
    await expect(page.locator(".app-tray .scrim")).toBeHidden();

    // The content width should have shrunk to accommodate the 320px tray
    const expandedMainBox = await main.boundingBox();
    expect(expandedMainBox?.width).toBeLessThan(initialMainBox?.width || 0);
  });

  test("keyboard state, focus trap, and restoration work in overlay mode", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/app-tray/");
    await page.waitForLoadState("networkidle");

    const drawer = page.locator("#app-tray-drawer");
    const hamburger = page.getByRole("button", { name: "Toggle navigation" });
    const focusable = drawer.locator(
      'a, button, [tabindex]:not([tabindex="-1"])',
    );

    await hamburger.focus();
    await page.keyboard.press("Enter");
    await expect(hamburger).toHaveAttribute("aria-expanded", "true");
    await expect(focusable.first()).toBeFocused();

    await focusable.last().focus();
    await page.keyboard.press("Tab");
    await expect(focusable.first()).toBeFocused();

    await focusable.first().focus();
    await page.keyboard.press("Shift+Tab");
    await expect(focusable.last()).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(hamburger).toHaveAttribute("aria-expanded", "false");
    await expect(hamburger).toBeFocused();
  });

  test("reduced motion suppresses tray transitions", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/app-tray/");

    const duration = await page
      .locator("#app-tray-drawer")
      .evaluate((element) => getComputedStyle(element).transitionDuration);
    expect(Number.parseFloat(duration)).toBeLessThan(0.001);
  });

  test("pointer toggle and scrim dismissal work without JavaScript", async ({
    browser,
  }) => {
    const page = await browser.newPage({
      javaScriptEnabled: false,
      viewport: { width: 375, height: 667 },
    });
    await page.goto("/app-tray/");

    const drawer = page.locator("#app-tray-drawer");
    await page.getByRole("button", { name: "Toggle navigation" }).click();
    await expect(drawer).toBeInViewport();
    await page.locator(".app-tray .scrim").click({
      position: { x: 350, y: 350 },
    });
    await expect(page.locator("#app-tray-toggle")).not.toBeChecked();
    await expect(drawer).not.toBeInViewport();
    await page.close();
  });
});
