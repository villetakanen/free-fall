import { expect, test } from "@playwright/test";

test.describe("Navigation model", () => {
  test("renders global groups as headings and derives descendant activity", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto("/navigation/");

    const nav = page.getByRole("navigation", {
      name: "Design system navigation",
    });
    // Desktop defaults to the expanded tray, so groups are visible without
    // toggling.

    await expect(
      nav.getByRole("heading", { name: "Patterns", exact: true }),
    ).toBeVisible();
    await expect(
      nav.getByRole("link", { name: "Patterns", exact: true }),
    ).toHaveCount(0);
    await expect(
      nav.getByRole("link", { name: "Navigation Model", exact: true }),
    ).toHaveAttribute("aria-current", "page");
  });

  test("renders a scoped uplink without global destinations", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto("/app-tray-subsite/");

    const nav = page.getByRole("navigation", {
      name: "Demo subsite navigation",
    });
    // Desktop defaults to the expanded tray, so the scoped set is visible
    // without toggling.

    const uplink = nav.getByRole("link", { name: "Design System" });
    await expect(uplink).toHaveAttribute("href", "/navigation/");
    await expect(uplink).not.toHaveAttribute("aria-current", "page");
    await expect(uplink.locator(".icon")).toHaveText("arrow_back");
    await expect(
      nav.getByRole("link", { name: "Demo Subsite" }),
    ).toHaveAttribute("aria-current", "page");
    await expect(nav.getByRole("link", { name: "Home" })).toHaveCount(0);
    await expect(
      nav.getByRole("heading", { name: "Body Pages", exact: true }),
    ).toBeVisible();
    await expect(
      nav.getByRole("link", { name: "Body Pages", exact: true }),
    ).toHaveCount(0);
  });

  test("keeps grouped detail out of the collapsed rail", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto("/navigation/");

    const navigationLink = page.getByRole("link", {
      name: "Navigation Model",
      exact: true,
    });
    // Desktop starts expanded: grouped detail is visible.
    await expect(navigationLink).toBeVisible();

    // Toggling collapses to the rail, dropping grouped detail from layout.
    await page.getByRole("button", { name: "Toggle navigation" }).click();
    await expect(navigationLink).toBeHidden();
  });
});
