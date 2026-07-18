import { expect, test } from "@playwright/test";

test.describe("mobile gear details", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/gear/weapons/");
  });

  test("keyboard operation manages state, focus, and Escape", async ({
    page,
  }) => {
    const triggers = page.getByRole("button", { name: /Show details for/ });
    const trigger = triggers.first();

    await trigger.focus();
    await page.keyboard.press("Enter");

    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(triggers.nth(1)).toHaveAttribute("aria-expanded", "false");

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");

    const close = dialog.getByRole("button", { name: "Close details" });
    await expect(close).toBeFocused();

    const focusable = dialog.locator(
      'a, button, [tabindex]:not([tabindex="-1"])',
    );
    await focusable.last().focus();
    await page.keyboard.press("Tab");
    await expect(focusable.first()).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  });

  test("scrim closes the dialog and restores focus", async ({ page }) => {
    const trigger = page
      .getByRole("button", {
        name: /Show details for/,
      })
      .first();
    await trigger.click();

    await page
      .locator(".modal-scrim")
      .first()
      .click({ position: { x: 5, y: 5 } });
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("pointer controls work without JavaScript", async ({ browser }) => {
    const page = await browser.newPage({
      javaScriptEnabled: false,
      viewport: { width: 375, height: 667 },
    });
    await page.goto("/gear/weapons/");

    await page
      .getByRole("button", { name: /Show details for/ })
      .first()
      .click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Close details" }).click();
    await expect(dialog).toBeHidden();

    await page.close();
  });
});
