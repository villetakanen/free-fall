import { expect, test } from "@playwright/test";

test.describe("SRD Tactical HUD Dock", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("SRD page renders the Tactical HUD dock rail on desktop", async ({
    page,
  }) => {
    await page.goto("/srd/");

    const dock = page.locator(".tactical-dock");
    await expect(dock).toBeVisible();

    // Dock rail buttons 1-4
    const railBtns = dock.locator(".tactical-dock__rail-btn");
    await expect(railBtns).toHaveCount(4);

    await expect(railBtns.nth(0)).toHaveAttribute("title", /ADJUDICATE/);
    await expect(railBtns.nth(1)).toHaveAttribute("title", /COMBAT/);
    await expect(railBtns.nth(2)).toHaveAttribute("title", /DICE SIM/);
    await expect(railBtns.nth(3)).toHaveAttribute("title", /HARM/);
  });

  test("rail buttons toggle side-by-side panes on the SRD", async ({
    page,
  }) => {
    await page.goto("/srd/");

    const adjudicateBtn = page.locator('[data-toggle-pane="adjudicate"]');
    const diceBtn = page.locator('[data-toggle-pane="dice"]');

    const adjudicatePane = page.locator('[data-pane-id="adjudicate"]');
    const dicePane = page.locator('[data-pane-id="dice"]');

    // Initially panes are closed in dock mode
    await expect(adjudicatePane).toBeHidden();
    await expect(dicePane).toBeHidden();

    // Open Adjudicate pane
    await adjudicateBtn.click();
    await expect(adjudicatePane).toBeVisible();
    await expect(adjudicatePane).toContainText("RESOLUTION MATRIX");
    await expect(adjudicatePane).toContainText("TN 11+");

    // Open Dice Sim pane side-by-side
    await diceBtn.click();
    await expect(dicePane).toBeVisible();
    await expect(adjudicatePane).toBeVisible(); // both open side-by-side

    // Test dice rolling within the HUD
    const rollBtn = dicePane.locator("[data-roll-btn]");
    await rollBtn.click();
    const banner = dicePane.locator("[data-outcome-banner]");
    await expect(banner).not.toContainText("READY TO EXECUTE");

    // Close Adjudicate pane via its close button
    const closeAdjudicate = adjudicatePane.locator(
      "[data-close-pane='adjudicate']",
    );
    await closeAdjudicate.click();
    await expect(adjudicatePane).toBeHidden();
    await expect(dicePane).toBeVisible();
  });

  test("System Reference v7 is the bottom-most navigation item in the rail", async ({
    page,
  }) => {
    await page.goto("/srd/");
    const trayButtons = page.locator("#app-tray-nav .tray-button");
    await expect(trayButtons).toHaveCount(5);

    const lastButton = trayButtons.last();
    await expect(lastButton).toHaveAttribute("href", "/srd/");
    await expect(lastButton).toHaveAttribute("aria-current", "page");
    await expect(lastButton).toContainText("System Reference v7");
  });

  test("non-SRD pages do NOT render the Tactical HUD", async ({ page }) => {
    // Introduction page
    await page.goto("/core-rulebook/00-intro/");
    await expect(page.locator(".tactical-dock")).toHaveCount(0);

    // World lore page
    await page.goto("/core-rulebook/01-world/");
    await expect(page.locator(".tactical-dock")).toHaveCount(0);

    // Gear page
    await page.goto("/gear/weapons/");
    await expect(page.locator(".tactical-dock")).toHaveCount(0);

    // Landing page
    await page.goto("/");
    await expect(page.locator(".tactical-dock")).toHaveCount(0);
  });

  test("/core-rulebook/system-reference redirects to /srd", async ({
    page,
  }) => {
    await page.goto("/core-rulebook/system-reference");
    await expect(page).toHaveURL(/\/srd/);
    await expect(page.locator(".tactical-dock")).toBeVisible();
  });
});
