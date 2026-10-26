import { expect, test } from "@playwright/test";

test("harm draft commits, cancels, becomes permanent, and clears", async ({
  page,
}) => {
  await page.goto("/harm-slot/");
  const trigger = page.locator(".slot-trigger").first();
  const dialog = page.locator("dialog").first();
  const description = dialog.locator("textarea");
  const slotBounds = await page.locator(".slot").first().boundingBox();
  const headingBounds = await page.locator("h1").boundingBox();
  if (!slotBounds || !headingBounds)
    throw new Error("Missing slot or heading geometry");
  expect(Math.abs(slotBounds.x - headingBounds.x)).toBeLessThan(2);
  expect(slotBounds.y).toBeGreaterThan(headingBounds.y + headingBounds.height);
  await expect(page.locator("output strong")).toHaveText("3d20");
  await trigger.click();
  const dialogBounds = await dialog.boundingBox();
  const viewport = page.viewportSize();
  if (!dialogBounds || !viewport) throw new Error("Missing dialog geometry");
  expect(
    Math.abs(dialogBounds.x + dialogBounds.width / 2 - viewport.width / 2),
  ).toBeLessThan(2);
  expect(
    Math.abs(dialogBounds.y + dialogBounds.height / 2 - viewport.height / 2),
  ).toBeLessThan(2);
  await expect(description).toBeFocused();
  await expect(dialog.locator('[type="submit"]')).toBeDisabled();
  await description.fill("  Bruised ribs  ");
  await dialog.locator("select").selectOption("physical");
  await dialog.locator('[type="submit"]').click();
  await expect(page.locator(".slot .description").first()).toHaveText(
    "Bruised ribs",
  );
  await expect(page.locator("output strong")).toHaveText("2d20");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await description.fill("Discard this draft");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(description).toHaveValue("Bruised ribs");
  await dialog.locator('[type="checkbox"]').check();
  await dialog.locator('[type="submit"]').click();
  await expect(page.locator(".slot").first()).toHaveClass(/permanent/);
  await page.setViewportSize({ width: 320, height: 740 });
  await trigger.click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await page.emulateMedia({ media: "print" });
  await expect(trigger).toBeHidden();
  await expect(page.locator(".slot .description").first()).toBeVisible();
  await page.emulateMedia({ media: "screen" });
  await trigger.click();
  await dialog.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(page.locator(".slot").first()).not.toHaveClass(/permanent/);
  await trigger.click();
  await expect(description).toHaveValue("");
});
