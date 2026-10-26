import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page) => page.locator('[data-demo="primary"]');
const current = (root: Locator, attribute: string) =>
  root.locator(`[data-attribute="${attribute}"] [data-field="current"]`);
const base = (root: Locator, attribute: string) =>
  root.locator(`[data-attribute="${attribute}"] [data-field="base"]`);
const adjust = (root: Locator, attribute: string, delta: number) =>
  root.locator(`[data-attribute="${attribute}"] [data-adjust="${delta}"]`);
const convert = (root: Locator, route: string) =>
  root.locator(`[data-convert="${route}"]`);

test("single circle preserves ownership, Base, and focus at zero", async ({
  page,
}) => {
  await page.goto("/attribute-circle/");
  const root = demo(page);
  await expect(adjust(root, "ghost", 1)).toHaveCount(0);
  await expect(adjust(root, "ghost", -1)).toBeVisible();
  await root.locator("[data-base-update]").click();
  await expect(base(root, "ghost")).toHaveText("6");
  await expect(current(root, "ghost")).toHaveText("8");
  await adjust(root, "ghost", -1).focus();
  await page.keyboard.press("Enter");
  await expect(current(root, "ghost")).toHaveText("7");
  await expect(root.locator("[data-proposals]")).toHaveAttribute(
    "data-proposals",
    "1",
  );
  await expect(root.locator('[role="status"]')).not.toBeEmpty();
  await root.locator("[data-reject]").check();
  await adjust(root, "ghost", -1).click();
  await expect(current(root, "ghost")).toHaveText("7");
  await expect(root.locator('[role="status"]')).toBeEmpty();
  await root.locator("[data-reject]").uncheck();
  await root.locator("[data-fixture]").selectOption("one");
  await adjust(root, "ghost", -1).focus();
  await page.keyboard.press("Space");
  await expect(current(root, "ghost")).toHaveText("0");
  await expect(adjust(root, "ghost", -1)).toBeFocused();
  await expect(adjust(root, "ghost", -1)).toHaveAttribute(
    "aria-disabled",
    "true",
  );
  await expect(adjust(root, "ghost", -1)).toHaveAccessibleDescription(/\S/);
  await page.keyboard.press("Enter");
  await expect(root.locator("[data-proposals]")).toHaveAttribute(
    "data-proposals",
    "1",
  );
});

test("conversions and child controls share one state without duplicate proposals", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/bmg-circle/");
  const root = demo(page);
  const other = page.locator('[data-demo="client"]');
  await expect(other.locator("[data-convert]")).toHaveCount(3);
  await root.locator("[data-fixture]").selectOption("last-pair");
  await adjust(root, "ghost", -1).click();
  await expect(convert(root, "ghost-to-body")).toHaveAttribute(
    "aria-disabled",
    "false",
  );
  await adjust(root, "ghost", -1).click();
  await expect(convert(root, "ghost-to-mind")).toHaveAttribute(
    "aria-disabled",
    "true",
  );
  await expect(convert(root, "ghost-to-body")).toHaveAttribute(
    "aria-disabled",
    "true",
  );
  await root.locator("[data-fixture]").selectOption("last-pair");
  await adjust(root, "ghost", -1).click();
  const button = convert(root, "ghost-to-body");
  await button.focus();
  await expect(root.locator('[data-arc="ghost-to-body"]')).toHaveClass(
    /active/,
  );
  await expect(root.locator(".attribute.highlighted")).toHaveCount(2);
  await page.keyboard.press("Enter");
  await expect(current(root, "ghost")).toHaveText("0");
  await expect(current(root, "body")).toHaveText("13");
  await expect(base(root, "body")).toHaveText("12");
  await expect(adjust(root, "ghost", -1)).toHaveAttribute(
    "aria-disabled",
    "true",
  );
  await expect(button).toBeFocused();
  await expect(button).toHaveAccessibleDescription(/\S/);
  await expect(root.locator("[data-proposals]")).toHaveAttribute(
    "data-proposals",
    "2",
  );
  await expect(current(other, "ghost")).toHaveText("8");
  await expect(other.locator("[data-proposals]")).toHaveAttribute(
    "data-proposals",
    "0",
  );
  await convert(other, "ghost-to-body").click();
  await expect(current(other, "ghost")).toHaveText("6");
  await expect(current(other, "body")).toHaveText("13");
  await expect(current(root, "ghost")).toHaveText("0");
  await expect(root.locator('[data-bmg] > [role="status"]')).not.toBeEmpty();
  // Conversion prop updates do not announce through a child's adjustment status.
  await expect(
    root.locator('[data-attribute="body"] [role="status"]'),
  ).toBeEmpty();
  const ids = await page
    .locator("[id]")
    .evaluateAll((elements) => elements.map((element) => element.id));
  expect(new Set(ids).size).toBe(ids.length);
  expect(errors).toEqual([]);
});

test("rapid actions and rejected conversions use committed props", async ({
  page,
}) => {
  await page.goto("/bmg-circle/");
  const root = demo(page);
  await root.locator("[data-fixture]").selectOption("last-pair");
  await root.locator("[data-reject]").check();
  await convert(root, "ghost-to-mind").click();
  await expect(current(root, "ghost")).toHaveText("3");
  await expect(root.locator('[data-bmg] > [role="status"]')).toBeEmpty();
  await root.locator("[data-reject]").uncheck();
  await convert(root, "ghost-to-body").evaluate((element) => {
    for (let i = 0; i < 10; i++) (element as HTMLButtonElement).click();
  });
  await expect(current(root, "ghost")).toHaveText("1");
  await expect(current(root, "body")).toHaveText("13");
  await expect(root.locator("[data-proposals]")).toHaveAttribute(
    "data-proposals",
    "2",
  );
  await adjust(root, "ghost", -1).evaluate((element) => {
    for (let i = 0; i < 10; i++) (element as HTMLButtonElement).click();
  });
  await expect(current(root, "ghost")).toHaveText("0");
  await expect(root.locator("[data-proposals]")).toHaveAttribute(
    "data-proposals",
    "3",
  );
});

test("unfilled and safe-integer boundaries disable only eligible actions", async ({
  page,
}) => {
  await page.goto("/bmg-circle/");
  const root = demo(page);
  await root.locator("[data-fixture]").selectOption("blank");
  await expect(
    root.locator('[data-bmg] button[aria-disabled="true"]'),
  ).toHaveCount(6);
  await expect(root.locator('[data-field="current"].blank')).toHaveCount(3);
  await root.locator("[data-fixture]").selectOption("large");
  await expect(adjust(root, "ghost", 1)).toHaveCount(0);
  await expect(adjust(root, "ghost", -1)).toHaveAttribute(
    "aria-disabled",
    "false",
  );
  await expect(convert(root, "ghost-to-body")).toHaveAttribute(
    "aria-disabled",
    "true",
  );
  await adjust(root, "body", -1).click();
  await expect(convert(root, "ghost-to-body")).toHaveAttribute(
    "aria-disabled",
    "false",
  );
  await convert(root, "ghost-to-body").click();
  await expect(current(root, "body")).toHaveText(
    String(Number.MAX_SAFE_INTEGER),
  );
  await root.locator("[data-fixture]").selectOption("populated");
  await root.locator("[data-base-update]").click();
  await root.locator("[data-base-update]").click();
  await expect(base(root, "ghost")).toHaveClass(/blank/);
  await expect(convert(root, "ghost-to-body")).toHaveAttribute(
    "aria-disabled",
    "false",
  );
});

test("circle actions use the shared DS button appearance in every stat", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/bmg-circle/");
  const root = demo(page);
  const reference = root.locator("[data-reset]");
  const appearance = (button: Locator) =>
    button.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        color: style.color,
        background: style.backgroundColor,
        border: style.borderColor,
        borderWidth: style.borderWidth,
        font: style.font,
        radius: style.borderRadius,
      };
    });
  await page.mouse.move(0, 0);
  const normal = await appearance(reference);
  const controls = root.locator("[data-bmg] button");
  await expect(controls).toHaveCount(6);
  for (const button of await controls.all()) {
    expect(await appearance(button)).toEqual(normal);
    await expect(button).toHaveCSS("width", "44px");
    await expect(button).toHaveCSS("height", "44px");
    await expect(button).toHaveAccessibleName(/\S/);
  }
  await reference.hover();
  const hovered = await appearance(reference);
  expect(hovered.border).not.toBe(normal.border);
  for (const button of await controls.all()) {
    await button.hover();
    expect(await appearance(button)).toEqual(hovered);
  }
});

async function assertGeometry(root: Locator) {
  const problems = await root.locator("[data-bmg]").evaluate((group) => {
    const issues: string[] = [];
    const bounds = group.getBoundingClientRect();
    const controls = [...group.querySelectorAll("button")].map((button) =>
      button.getBoundingClientRect(),
    );
    for (let i = 0; i < controls.length; i++) {
      const a = controls[i];
      if (a.width < 43.9 || a.height < 43.9) issues.push(`small target ${i}`);
      if (a.left < bounds.left - 1 || a.right > bounds.right + 1)
        issues.push(`target outside ${i}`);
      for (let j = i + 1; j < controls.length; j++) {
        const b = controls[j];
        if (
          a.left < b.right &&
          a.right > b.left &&
          a.top < b.bottom &&
          a.bottom > b.top
        )
          issues.push(`overlap ${i},${j}`);
      }
    }
    for (const field of group.querySelectorAll<HTMLElement>("dd, dt")) {
      if (field.scrollWidth > field.clientWidth + 1)
        issues.push(`clipped field ${field.dataset.field}`);
      const rect = field.getBoundingClientRect();
      if (rect.left < bounds.left - 1 || rect.right > bounds.right + 1)
        issues.push("field outside");
      if (field.tagName === "DD") {
        for (const control of controls) {
          if (
            rect.left < control.right &&
            rect.right > control.left &&
            rect.top < control.bottom &&
            rect.bottom > control.top
          )
            issues.push("value covered by control");
        }
      }
    }
    return issues;
  });
  expect(problems).toEqual([]);
}

test("all six targets fit narrow layouts, large numbers, text enlargement and font fallback", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) =>
    route.abort(),
  );
  await page.goto("/bmg-circle/");
  const root = demo(page);
  await expect(root.locator("[data-bmg] button")).toHaveCount(6);
  for (const width of [320, 360, 400, 480, 768, 1100]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.keyboard.press("Escape");
    await expect(page.locator(".app-tray")).toHaveCSS(
      "width",
      width < 620 ? "0px" : "80px",
    );
    if (width < 620) {
      await expect
        .poll(() =>
          page
            .locator(".app-tray .drawer")
            .evaluate((element) => element.getBoundingClientRect().right),
        )
        .toBeLessThanOrEqual(0);
    }
    await assertGeometry(root);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    if (width === 320 || width === 1100) {
      await root
        .locator("[data-bmg]")
        .screenshot({ path: test.info().outputPath(`bmg-${width}.png`) });
    }
  }
  await page.setViewportSize({ width: 320, height: 1000 });
  await page.keyboard.press("Escape");
  await expect(page.locator(".app-tray")).toHaveCSS("width", "0px");
  for (const fixture of ["three-digit", "large"]) {
    await root.locator("[data-fixture]").selectOption(fixture);
    await assertGeometry(root);
    await root
      .locator("[data-bmg]")
      .screenshot({ path: test.info().outputPath(`bmg-${fixture}.png`) });
  }
  await root.locator("[data-fixture]").selectOption("populated");
  await page.setViewportSize({ width: 640, height: 1200 });
  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  await assertGeometry(root);
});

test("static HTML is complete without JavaScript or a Svelte client runtime", async ({
  browser,
  request,
}) => {
  const response = await request.get("/character-sheet-static/");
  expect(await response.text()).not.toMatch(
    /<astro-island|component-url=|renderer-url=/,
  );
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:14322/character-sheet-static/");
  const groups = page.locator("[data-bmg]");
  await expect(groups).toHaveCount(2);
  await expect(current(groups.first(), "mind")).toHaveText("0");
  await expect(current(groups.first(), "body")).toHaveText("13");
  await expect(groups.locator("button")).toHaveCount(0);
  await expect(groups.locator("[data-arc]")).toHaveCount(6);
  await expect(groups.last().locator("dd.blank")).toHaveCount(6);
  await context.close();
});

test("print keeps committed values and monochrome directions while hiding controls", async ({
  page,
}) => {
  await page.goto("/bmg-circle/");
  const root = demo(page);
  await convert(root, "ghost-to-body").click();
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".app-tray")).toBeHidden();
  await expect(page.locator(".app-bar")).toBeHidden();
  await expect(page.locator("main")).toHaveCSS("overflow-y", "visible");
  await expect(current(root, "body")).toHaveText("13");
  await expect(base(root, "body")).toHaveText("12");
  await expect(root.locator("[data-bmg] button:visible")).toHaveCount(0);
  await expect(root.locator("[data-bmg] .ratio:visible")).toHaveCount(3);
  await expect(
    root.locator("[data-arc-fill]:visible, [data-arc-outline]:visible"),
  ).toHaveCount(0);
  const colors = await root
    .locator("dd, dt, [data-arc]")
    .evaluateAll((elements) =>
      elements.map((element) => {
        const style = getComputedStyle(element);
        return element.tagName.toLowerCase() === "path"
          ? style.fill
          : style.color;
      }),
    );
  expect(new Set(colors)).toEqual(new Set(["rgb(0, 0, 0)"]));
  await root
    .locator("[data-bmg]")
    .screenshot({ path: test.info().outputPath("bmg-print.png") });
  await page.pdf({
    path: test.info().outputPath("bmg-print.pdf"),
    printBackground: false,
  });
});

test("touch activates a conversion once", async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 360, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("http://localhost:14322/bmg-circle/");
  const root = demo(page);
  await convert(root, "mind-to-body").tap();
  await expect(current(root, "mind")).toHaveText("6");
  await expect(current(root, "body")).toHaveText("13");
  await expect(root.locator("[data-proposals]")).toHaveAttribute(
    "data-proposals",
    "1",
  );
  await context.close();
});
