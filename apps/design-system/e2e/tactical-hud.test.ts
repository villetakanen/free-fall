import { expect, test } from "@playwright/test";

test.describe("Tactical HUD Component (Multi-Pane Inspector Dock)", () => {
  test("demo page renders documented sections and host-scoped multi-pane dock", async ({
    page,
  }) => {
    await page.goto("/tactical-hud/");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("h1")).toContainText("Tactical HUD");
    const dock = page.locator(".tactical-dock");
    await expect(dock).toBeVisible();

    // Default open panes are rules and dice
    await expect(dock.locator('[data-pane-id="rules"]')).toBeVisible();
    await expect(dock.locator('[data-pane-id="dice"]')).toBeVisible();

    // Harm pane is closed by default
    await expect(dock.locator('[data-pane-id="harm"]')).toBeHidden();
  });

  test("HUD visibility responds to host size without a viewport resize", async ({
    page,
  }) => {
    await page.goto("/tactical-hud/");
    const host = page.locator(".hud-stage-frame");
    const dock = page.locator(".tactical-dock");

    await host.evaluate((element) => {
      (element as HTMLElement).style.width = "31rem";
    });
    await expect(dock).toBeHidden();

    await host.evaluate((element) => {
      (element as HTMLElement).style.width = "42rem";
    });
    await expect(dock).toBeVisible();
  });

  test("multi-pane toggle opens and closes side-by-side panes", async ({
    page,
  }) => {
    await page.goto("/tactical-hud/");
    await page.waitForLoadState("networkidle");

    const dock = page.locator(".tactical-dock");

    // Initially 2 panes open (Rules and Dice)
    const openPanesInitial = dock.locator(".tactical-dock__pane--open");
    await expect(openPanesInitial).toHaveCount(2);

    // Toggle Harm pane open via rail button [3]
    const harmRailBtn = dock.locator('[data-toggle-pane="harm"]');
    await harmRailBtn.click();

    // Now 3 panes are open side-by-side
    await expect(dock.locator('[data-pane-id="harm"]')).toBeVisible();
    await expect(dock.locator(".tactical-dock__pane--open")).toHaveCount(3);

    // Close the Rules pane via its header close button
    const closeRulesBtn = dock.locator('[data-close-pane="rules"]');
    await closeRulesBtn.click();

    // Rules is now hidden, Harm and Dice remain open (2 open panes)
    await expect(dock.locator('[data-pane-id="rules"]')).toBeHidden();
    await expect(dock.locator('[data-pane-id="harm"]')).toBeVisible();
    await expect(dock.locator('[data-pane-id="dice"]')).toBeVisible();
    await expect(dock.locator(".tactical-dock__pane--open")).toHaveCount(2);
  });

  test("pluggable scenario pane (Crew Roster) renders via slot", async ({
    page,
  }) => {
    await page.goto("/tactical-hud/");
    await page.waitForLoadState("networkidle");

    const dock = page.locator(".tactical-dock");

    // Open Crew Roster pane (slot-injected 5th pane) via rail button
    const crewRailBtn = dock.locator('[data-toggle-pane="crew"]');
    await crewRailBtn.click();

    const crewPane = dock.locator('[data-pane-id="crew"]');
    await expect(crewPane).toBeVisible();
    await expect(crewPane).toContainText("SCENARIO CREW ROSTER");
    await expect(crewPane).toContainText("KOROLEV");
    await expect(crewPane).toContainText("EVA-SUIT (AV 4)");
  });

  test("dice simulator executes rolls within its pane", async ({ page }) => {
    await page.goto("/tactical-hud/");
    await page.waitForLoadState("networkidle");

    const dock = page.locator(".tactical-dock");
    const dicePane = dock.locator('[data-pane-id="dice"]');
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
