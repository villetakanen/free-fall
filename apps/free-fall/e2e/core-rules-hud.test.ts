import { expect, test } from "@playwright/test";

test.describe("Core Rules Tactical HUD (Action Resolution Pane)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("Core Rules routes expose exactly one pane, titled Action Resolution", async ({
    page,
  }) => {
    await page.goto("/core-rulebook/03-core-rules/");

    const dock = page.locator(".tactical-dock");
    await expect(dock).toBeVisible();

    // Exactly one rail button
    const railBtns = dock.locator(".tactical-dock__rail-btn");
    await expect(railBtns).toHaveCount(1);
    await expect(railBtns.first()).toHaveAttribute(
      "title",
      /ACTION RESOLUTION/,
    );
    await expect(railBtns.first()).toHaveAttribute("data-toggle-pane", "rules");

    // Exactly one pane
    const panes = dock.locator(".tactical-dock__pane");
    await expect(panes).toHaveCount(1);
    await expect(panes.first()).toHaveAttribute("data-pane-id", "rules");
    await expect(
      panes.first().locator(".tactical-dock__pane-title"),
    ).toHaveText("ACTION RESOLUTION");
  });

  test("also renders on other Core Rules chapters (e.g. 00-intro)", async ({
    page,
  }) => {
    await page.goto("/core-rulebook/00-intro/");

    const dock = page.locator(".tactical-dock");
    await expect(dock).toBeVisible();

    const railBtns = dock.locator(".tactical-dock__rail-btn");
    await expect(railBtns).toHaveCount(1);
    await expect(railBtns.first()).toHaveAttribute(
      "title",
      /ACTION RESOLUTION/,
    );
  });

  test("pane can be opened/closed via rail button, close button, and keyboard hotkeys", async ({
    page,
  }) => {
    await page.goto("/core-rulebook/03-core-rules/");

    const railBtn = page.locator('[data-toggle-pane="rules"]');
    const pane = page.locator('[data-pane-id="rules"]');
    const closeBtn = page.locator('[data-close-pane="rules"]');

    // Initially closed
    await expect(pane).toBeHidden();

    // Open via rail click
    await railBtn.click();
    await expect(pane).toBeVisible();
    await expect(railBtn).toHaveAttribute("aria-expanded", "true");

    // Close via close button [×]
    await closeBtn.click();
    await expect(pane).toBeHidden();
    await expect(railBtn).toHaveAttribute("aria-expanded", "false");

    // Open via hotkey '1'
    await page.keyboard.press("1");
    await expect(pane).toBeVisible();

    // Close via 'Escape'
    await page.keyboard.press("Escape");
    await expect(pane).toBeHidden();
  });

  test("hierarchy: difficulty, exceptions, and action & pool appear in order", async ({
    page,
  }) => {
    await page.goto("/core-rulebook/03-core-rules/");

    const railBtn = page.locator('[data-toggle-pane="rules"]');
    await railBtn.click();

    const pane = page.locator('[data-pane-id="rules"]');
    const cardTitles = pane.locator(".hud-card__title");
    await expect(cardTitles).toHaveCount(3);

    await expect(cardTitles.nth(0)).toContainText("DIFFICULTY");
    await expect(cardTitles.nth(1)).toContainText("EXCEPTIONS");
    await expect(cardTitles.nth(2)).toContainText("ACTION & POOL");
  });

  test("pane contains no interactive inputs or dice rolling controls", async ({
    page,
  }) => {
    await page.goto("/core-rulebook/03-core-rules/");

    const railBtn = page.locator('[data-toggle-pane="rules"]');
    await railBtn.click();

    const pane = page.locator('[data-pane-id="rules"]');
    // No rolling buttons
    await expect(pane.locator("[data-roll-btn]")).toHaveCount(0);
    // No dice pills
    await expect(pane.locator("[data-dice]")).toHaveCount(0);
    // No text/number inputs
    await expect(pane.locator("input")).toHaveCount(0);
    // No details/summary collapse elements
    await expect(pane.locator("details")).toHaveCount(0);
  });

  test("deep links target corresponding full Core Rules sections and resolve", async ({
    page,
  }) => {
    await page.goto("/core-rulebook/03-core-rules/");

    const railBtn = page.locator('[data-toggle-pane="rules"]');
    await railBtn.click();

    const pane = page.locator('[data-pane-id="rules"]');
    const links = pane.locator("a");
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);

    for (let i = 0; i < linkCount; i++) {
      const href = await links.nth(i).getAttribute("href");
      expect(href).toMatch(/^\/core-rulebook\/03-core-rules\/#/);
    }

    // Verify navigating to a link resolves to a valid element
    const difficultyLink = pane
      .locator(
        'a[href="/core-rulebook/03-core-rules/#4-rolling--determining-success"]',
      )
      .first();
    await difficultyLink.click();
    await expect(
      page.locator('[id="4-rolling--determining-success"]'),
    ).toBeAttached();
  });

  test("pane fits 320px width without horizontal overflow", async ({
    page,
  }) => {
    await page.goto("/core-rulebook/03-core-rules/");

    const railBtn = page.locator('[data-toggle-pane="rules"]');
    await railBtn.click();

    const pane = page.locator('[data-pane-id="rules"]');
    const box = await pane.boundingBox();
    expect(box).not.toBeNull();
    // 320px wide (derives from calc(40 * 0.5rem))
    expect(box?.width).toBeCloseTo(320, 0);

    // Verify no horizontal overflow in pane body
    const hasHorizontalOverflow = await pane
      .locator(".tactical-dock__pane-body")
      .evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(hasHorizontalOverflow).toBe(false);
  });

  test("glanceability: entire pane fits vertically without scrolling on 800px desktop", async ({
    page,
  }) => {
    await page.goto("/core-rulebook/03-core-rules/");

    const railBtn = page.locator('[data-toggle-pane="rules"]');
    await railBtn.click();

    const pane = page.locator('[data-pane-id="rules"]');
    const hasVerticalOverflow = await pane
      .locator(".tactical-dock__pane-body")
      .evaluate((el) => el.scrollHeight > el.clientHeight);
    expect(hasVerticalOverflow).toBe(false);
  });

  test("host-size adaptation: dock is suppressed on narrow viewport (mobile)", async ({
    page,
  }) => {
    // 375px mobile viewport: workspace container <= 32rem -> dock suppressed
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/core-rulebook/03-core-rules/");

    const dock = page.locator(".tactical-dock");
    await expect(dock).toBeHidden();

    // Core Rules page remains readable and accessible
    const heading = page.locator("h1");
    await expect(heading).toContainText("Core Rules");
  });
});
