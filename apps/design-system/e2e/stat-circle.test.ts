import { expect, test } from "@playwright/test";

test.describe("StatCircle demo page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/stat-circle/");
  });

  test("page loads with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/Stat Circle/);
  });

  // ── Showcase examples ──────────────────────────────────────────

  test.describe("showcase examples", () => {
    test("renders 5 examples", async ({ page }) => {
      const showcase = page.locator(".showcase");
      const circles = showcase.locator(".stat-circle-wrap");
      await expect(circles).toHaveCount(5);
    });

    test("first three show Body(2), Mind(1), Ghost(3)", async ({ page }) => {
      const showcase = page.locator(".showcase");
      const values = showcase.locator(".stat-circle__value");
      await expect(values.nth(0)).toHaveText("2");
      await expect(values.nth(1)).toHaveText("1");
      await expect(values.nth(2)).toHaveText("3");
    });

    test("fourth example is disabled (shows empty-set)", async ({ page }) => {
      const showcase = page.locator(".showcase");
      const values = showcase.locator(".stat-circle__value");
      await expect(values.nth(3)).toHaveText("\u2205");
    });

    test("fifth example shows value 36 with FRM label", async ({ page }) => {
      const showcase = page.locator(".showcase");
      const values = showcase.locator(".stat-circle__value");
      await expect(values.nth(4)).toHaveText("36");

      const labels = showcase.locator(".stat-circle__label");
      // Labels: BODY, MIND, GHOST, BODY, FRM
      await expect(labels.nth(4)).toHaveText("FRM");
    });
  });

  // ── Type colors ────────────────────────────────────────────────

  test.describe("type colors", () => {
    test("body circles use body type class", async ({ page }) => {
      const section = page
        .locator(".demo-section")
        .filter({ hasText: "Types" });
      const bodyRow = section.locator(".circle-row").first();
      const circles = bodyRow.locator(".stat-circle--body");
      await expect(circles).toHaveCount(3);
    });

    test("mind circles use mind type class", async ({ page }) => {
      const section = page
        .locator(".demo-section")
        .filter({ hasText: "Types" });
      const mindRow = section.locator(".circle-row").nth(1);
      const circles = mindRow.locator(".stat-circle--mind");
      await expect(circles).toHaveCount(3);
    });

    test("ghost circles use ghost type class", async ({ page }) => {
      const section = page
        .locator(".demo-section")
        .filter({ hasText: "Types" });
      const ghostRow = section.locator(".circle-row").nth(2);
      const circles = ghostRow.locator(".stat-circle--ghost");
      await expect(circles).toHaveCount(3);
    });
  });

  // ── Disabled / Null ────────────────────────────────────────────

  test.describe("disabled and null states", () => {
    test("value=null renders empty-set symbol", async ({ page }) => {
      const section = page
        .locator(".demo-section")
        .filter({ hasText: "Disabled / Null" });
      const nullRow = section
        .locator(".circle-row")
        .filter({ hasText: "value=null" });
      const values = nullRow.locator(".stat-circle__value");
      await expect(values).toHaveCount(3);
      for (let i = 0; i < 3; i++) {
        await expect(values.nth(i)).toHaveText("\u2205");
      }
    });

    test("value=null uses disabled class", async ({ page }) => {
      const section = page
        .locator(".demo-section")
        .filter({ hasText: "Disabled / Null" });
      const nullRow = section
        .locator(".circle-row")
        .filter({ hasText: "value=null" });
      const disabled = nullRow.locator(".stat-circle--disabled");
      await expect(disabled).toHaveCount(3);
    });

    test("explicit disabled renders empty-set symbol", async ({ page }) => {
      const section = page
        .locator(".demo-section")
        .filter({ hasText: "Disabled / Null" });
      const disabledRow = section
        .locator(".circle-row")
        .filter({
          has: page
            .locator(".circle-row-label", { hasText: "disabled" })
            .first(),
        })
        .first();
      const values = disabledRow.locator(".stat-circle__value");
      for (let i = 0; i < 3; i++) {
        await expect(values.nth(i)).toHaveText("\u2205");
      }
    });

    test("value=0 is NOT disabled", async ({ page }) => {
      const section = page
        .locator(".demo-section")
        .filter({ hasText: "Disabled / Null" });
      const zeroRow = section
        .locator(".circle-row")
        .filter({ hasText: "value=0" });
      const values = zeroRow.locator(".stat-circle__value");
      for (let i = 0; i < 3; i++) {
        await expect(values.nth(i)).toHaveText("0");
      }
    });

    test("value=0 uses type class, not disabled", async ({ page }) => {
      const section = page
        .locator(".demo-section")
        .filter({ hasText: "Disabled / Null" });
      const zeroRow = section
        .locator(".circle-row")
        .filter({ hasText: "value=0" });
      await expect(zeroRow.locator(".stat-circle--disabled")).toHaveCount(0);
      await expect(zeroRow.locator(".stat-circle--body")).toHaveCount(1);
      await expect(zeroRow.locator(".stat-circle--mind")).toHaveCount(1);
      await expect(zeroRow.locator(".stat-circle--ghost")).toHaveCount(1);
    });
  });

  // ── Bound state ────────────────────────────────────────────────

  test.describe("bound state", () => {
    test("bound circles have bound class", async ({ page }) => {
      const section = page
        .locator(".demo-section")
        .filter({ hasText: "Bound State" });
      const boundRow = section
        .locator(".circle-row")
        .filter({
          has: page.locator(".circle-row-label", { hasText: "bound" }).first(),
        })
        .first();
      const bound = boundRow.locator(".stat-circle--bound");
      await expect(bound).toHaveCount(3);
    });

    test("disabled circle ignores bound", async ({ page }) => {
      const section = page
        .locator(".demo-section")
        .filter({ hasText: "Bound State" });
      const ignoreRow = section
        .locator(".circle-row")
        .filter({ hasText: "disabled ignores bound" });
      const bound = ignoreRow.locator(".stat-circle--bound");
      await expect(bound).toHaveCount(0);

      const disabled = ignoreRow.locator(".stat-circle--disabled");
      await expect(disabled).toHaveCount(2);
    });
  });

  // ── Labels ─────────────────────────────────────────────────────

  test.describe("attribute labels", () => {
    test("labels render below circles when attribute is set", async ({
      page,
    }) => {
      const section = page
        .locator(".demo-section")
        .filter({ hasText: "Custom Attribute Labels" });
      const defaultRow = section
        .locator(".circle-row")
        .filter({ hasText: "Default labels" });
      const labels = defaultRow.locator(".stat-circle__label");
      await expect(labels).toHaveCount(3);
      await expect(labels.nth(0)).toHaveText("BODY");
      await expect(labels.nth(1)).toHaveText("MIND");
      await expect(labels.nth(2)).toHaveText("GHOST");
    });

    test("labels are always uppercase", async ({ page }) => {
      const section = page
        .locator(".demo-section")
        .filter({ hasText: "Custom Attribute Labels" });
      const labels = section.locator(".stat-circle__label");
      const count = await labels.count();
      for (let i = 0; i < count; i++) {
        const text = await labels.nth(i).textContent();
        expect(text).toBe(text?.toUpperCase());
      }
    });

    test("domain alias labels render correctly", async ({ page }) => {
      const section = page
        .locator(".demo-section")
        .filter({ hasText: "Custom Attribute Labels" });
      const aliasRow = section
        .locator(".circle-row")
        .filter({ hasText: "Domain aliases" });
      const labels = aliasRow.locator(".stat-circle__label");
      await expect(labels.nth(0)).toHaveText("SYS");
      await expect(labels.nth(1)).toHaveText("FRM");
    });

    test("no label without attribute prop (mixed binding section)", async ({
      page,
    }) => {
      const section = page
        .locator(".demo-section")
        .filter({ hasText: "Mixed Binding Costs" });
      const labels = section.locator(".stat-circle__label");
      await expect(labels).toHaveCount(0);
    });
  });

  // ── Custom sizing ──────────────────────────────────────────────

  test.describe("custom sizing", () => {
    test("circles are rendered in all four size rows", async ({ page }) => {
      const section = page
        .locator(".demo-section")
        .filter({ hasText: "Custom Sizing" });
      const rows = section.locator(".circle-row");
      await expect(rows).toHaveCount(4);
      for (let i = 0; i < 4; i++) {
        const circles = rows.nth(i).locator(".stat-circle");
        await expect(circles).toHaveCount(3);
      }
    });
  });

  // ── Surfaces ───────────────────────────────────────────────────

  test.describe("on different surfaces", () => {
    test("circles render on all three surface backgrounds", async ({
      page,
    }) => {
      const section = page
        .locator(".demo-section")
        .filter({ hasText: "On Different Surfaces" });
      const surfaces = section.locator(".demo-surface");
      await expect(surfaces).toHaveCount(3);
      for (let i = 0; i < 3; i++) {
        const circles = surfaces.nth(i).locator(".stat-circle");
        await expect(circles).toHaveCount(3);
      }
    });
  });

  // ── Visual invariants ──────────────────────────────────────────

  test.describe("visual invariants", () => {
    test("circles are round (equal width and height)", async ({ page }) => {
      const circle = page.locator(".stat-circle").first();
      const box = await circle.boundingBox();
      if (!box) throw new Error("circle has no bounding box");
      expect(Math.abs(box.width - box.height)).toBeLessThan(1);
    });

    test("circle never contains letters — only digits or empty-set", async ({
      page,
    }) => {
      const values = page.locator(".stat-circle__value");
      const count = await values.count();
      for (let i = 0; i < count; i++) {
        const text = (await values.nth(i).textContent()) ?? "";
        expect(text).toMatch(/^(\d+|\u2205)$/);
      }
    });

    test("no circles have visible borders", async ({ page }) => {
      const circles = page.locator(".stat-circle");
      const count = await circles.count();
      // Spot-check first 5 circles
      const checkCount = Math.min(count, 5);
      for (let i = 0; i < checkCount; i++) {
        const borderStyle = await circles
          .nth(i)
          .evaluate((el) => getComputedStyle(el).borderStyle);
        expect(borderStyle).toBe("none");
      }
    });
  });
});
