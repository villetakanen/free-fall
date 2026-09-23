import { expect, test } from "@playwright/test";

test.describe("Tactical HUD Component (Multi-Pane Inspector Dock)", () => {
  test("demo page renders documented sections and embedded multi-pane dock", async ({
    page,
  }) => {
    await page.goto("/tactical-hud/");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("h1")).toContainText("Tactical HUD");
    const embeddedDock = page.locator(".tactical-dock--embedded");
    await expect(embeddedDock).toBeVisible();

    // Default open panes are adjudicate and dice
    await expect(
      embeddedDock.locator('[data-pane-id="adjudicate"]'),
    ).toBeVisible();
    await expect(embeddedDock.locator('[data-pane-id="dice"]')).toBeVisible();

    // Combat pane is closed by default
    await expect(embeddedDock.locator('[data-pane-id="combat"]')).toBeHidden();
  });

  test("multi-pane toggle opens and closes side-by-side panes", async ({
    page,
  }) => {
    await page.goto("/tactical-hud/");
    await page.waitForLoadState("networkidle");

    const embeddedDock = page.locator(".tactical-dock--embedded");

    // Initially 2 panes open (Adjudicate and Dice)
    const openPanesInitial = embeddedDock.locator(".tactical-dock__pane--open");
    await expect(openPanesInitial).toHaveCount(2);

    // Toggle Combat pane open via rail button [2]
    const combatRailBtn = embeddedDock.locator('[data-toggle-pane="combat"]');
    await combatRailBtn.click();

    // Now 3 panes are open side-by-side
    await expect(embeddedDock.locator('[data-pane-id="combat"]')).toBeVisible();
    await expect(
      embeddedDock.locator(".tactical-dock__pane--open"),
    ).toHaveCount(3);

    // Close the Adjudicate pane via its header close button
    const closeAdjudicateBtn = embeddedDock.locator(
      '[data-close-pane="adjudicate"]',
    );
    await closeAdjudicateBtn.click();

    // Adjudicate is now hidden, Combat and Dice remain open (2 open panes)
    await expect(
      embeddedDock.locator('[data-pane-id="adjudicate"]'),
    ).toBeHidden();
    await expect(embeddedDock.locator('[data-pane-id="combat"]')).toBeVisible();
    await expect(embeddedDock.locator('[data-pane-id="dice"]')).toBeVisible();
    await expect(
      embeddedDock.locator(".tactical-dock__pane--open"),
    ).toHaveCount(2);
  });

  test("pluggable scenario pane (Crew Roster) renders via slot", async ({
    page,
  }) => {
    await page.goto("/tactical-hud/");
    await page.waitForLoadState("networkidle");

    const embeddedDock = page.locator(".tactical-dock--embedded");

    // Open Crew Roster pane (slot-injected 5th pane) via rail button
    const crewRailBtn = embeddedDock.locator('[data-toggle-pane="crew"]');
    await crewRailBtn.click();

    const crewPane = embeddedDock.locator('[data-pane-id="crew"]');
    await expect(crewPane).toBeVisible();
    await expect(crewPane).toContainText("SCENARIO CREW ROSTER");
    await expect(crewPane).toContainText("KOROLEV");
    await expect(crewPane).toContainText("EVA-SUIT (AV 4)");
  });

  test("dice simulator executes rolls within its pane", async ({ page }) => {
    await page.goto("/tactical-hud/");
    await page.waitForLoadState("networkidle");

    const embeddedDock = page.locator(".tactical-dock--embedded");
    const dicePane = embeddedDock.locator('[data-pane-id="dice"]');
    await expect(dicePane).toBeVisible();

    // Select 3d20
    const dicePill = dicePane.locator('[data-dice="3"]');
    await dicePill.click();
    await expect(dicePill).toHaveClass(/hud-pill--active/);

    // Select TN 16
    const tnPill = dicePane.locator('[data-tn="16"]');
    await tnPill.click();
    await expect(tnPill).toHaveClass(/hud-pill--active/);

    // Execute roll
    const rollBtn = dicePane.locator("[data-roll-btn]");
    await rollBtn.click();

    // Verify 3 dice rendered
    const dice = dicePane.locator("[data-dice-row] .hud-die");
    await expect(dice).toHaveCount(3);

    // Verify outcome banner updated
    const banner = dicePane.locator("[data-outcome-banner]");
    await expect(banner).not.toContainText("READY TO EXECUTE");
    await expect(banner).toContainText(/SUCCESS/);
  });
});
