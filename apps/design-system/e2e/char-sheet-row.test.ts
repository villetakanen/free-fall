import { expect, type Locator, type Page, test } from "@playwright/test";

async function geometry(row: Locator) {
  return row.evaluate((element) => {
    const rect = (node: Element) => {
      const { x, y, width, height, right, bottom } =
        node.getBoundingClientRect();
      return { x, y, width, height, right, bottom };
    };
    return {
      row: rect(element),
      compact: rect(element.children[0]),
      primary: rect(element.children[1]),
    };
  });
}

async function open(page: Page) {
  await page.goto("/char-sheet-row-layout-1/");
  await page.evaluate(() => document.fonts.ready);
}

const overview = '[data-example="overview"] .char-sheet-row';
const narrow = '[data-example="narrow"] .char-sheet-row';

test("wide row reverses the prose tracks, while a narrow host stacks independently", async ({
  page,
}) => {
  await page.setViewportSize({ width: 2000, height: 1000 });
  await page.goto("/");
  await page
    .locator('#app-tray-nav a[href="/char-sheet-row-layout-1/"]')
    .click();
  await page.evaluate(() => document.fonts.ready);

  await expect
    .poll(async () => {
      const box = await geometry(page.locator(overview));
      return Math.abs(box.primary.y - box.compact.y) < 1;
    })
    .toBe(true);
  const prose = await page.locator(".content-grid").evaluate((grid) => {
    const tracks = getComputedStyle(grid)
      .gridTemplateColumns.match(/[\d.]+px/g)
      ?.map(Number.parseFloat);
    if (!tracks || tracks.length !== 5)
      throw new Error("Expected the wide prose grid.");
    return { primary: tracks[1], gap: tracks[2], compact: tracks[3] };
  });
  const wide = await geometry(page.locator(overview));
  expect(wide.compact.width).toBeCloseTo(prose.compact, 0);
  expect(wide.primary.width).toBeCloseTo(prose.primary, 0);
  expect(wide.primary.x - wide.compact.right).toBeCloseTo(prose.gap, 0);
  expect(wide.primary.y).toBeCloseTo(wide.compact.y, 0);
  expect(wide.primary.right).toBeLessThanOrEqual(wide.row.right + 1);

  const small = await geometry(page.locator(narrow));
  expect(small.primary.x).toBeCloseTo(small.compact.x, 0);
  expect(small.primary.y).toBeGreaterThan(small.compact.bottom);
  expect(small.primary.width).toBeCloseTo(small.compact.width, 0);
  await expect(page.locator(`${overview} [data-bmg]`)).toHaveCount(1);
});

test("the row switches at its own fit threshold and retains the same children", async ({
  page,
}) => {
  await page.setViewportSize({ width: 2000, height: 1000 });
  await open(page);
  const row = page.locator(overview);
  const host = page.locator('[data-example="overview"] .example-host');
  await expect
    .poll(async () => {
      const box = await geometry(row);
      return Math.abs(box.primary.y - box.compact.y) < 1;
    })
    .toBe(true);
  const wide = await geometry(row);
  const fit = wide.row.width;
  await row.locator(":scope > :first-child").evaluate((element) => {
    element.setAttribute("data-original", "true");
  });
  const values = await row.locator("[data-field]").allTextContents();
  await host.evaluate((element, width) => {
    (element as HTMLElement).style.inlineSize = `${width}px`;
  }, fit - 1);
  await expect
    .poll(async () => {
      const current = await geometry(row);
      return current.primary.y > current.compact.bottom;
    })
    .toBe(true);
  await host.evaluate((element) => {
    (element as HTMLElement).style.inlineSize = "100%";
  });
  await expect
    .poll(async () => {
      const current = await geometry(row);
      return Math.abs(current.primary.y - current.compact.y) < 1;
    })
    .toBe(true);
  await expect(row.locator(":scope > :first-child")).toHaveAttribute(
    "data-original",
    "true",
  );
  expect(await row.locator("[data-field]").allTextContents()).toEqual(values);
  expect(page.viewportSize()?.width).toBe(2000);
});

test("320px stacks each complete pair in source order without overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await open(page);
  for (const selector of [overview, narrow]) {
    const row = page.locator(selector);
    const box = await geometry(row);
    expect(box.primary.y).toBeGreaterThan(box.compact.bottom);
    expect(box.primary.x).toBeCloseTo(box.compact.x, 0);
    expect(
      await row.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
    const children = await row.locator(":scope > *").count();
    expect(children).toBe(2);
  }
  const first = await geometry(page.locator(overview));
  const next = await geometry(page.locator(narrow));
  expect(next.row.y).toBeGreaterThan(first.row.bottom);
  expect(
    await page
      .locator("main")
      .evaluate((element) => element.scrollWidth <= element.clientWidth),
  ).toBe(true);
});

test("static and print renderings retain all sheet values without hydration", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 2000, height: 1000 },
  });
  const page = await context.newPage();
  await open(page);
  const row = page.locator(overview);
  await expect(page.locator("astro-island")).toHaveCount(0);
  await expect(row.locator("[data-field]")).toHaveCount(6);
  await expect(row.locator("[data-convert], [data-adjust]")).toHaveCount(0);
  const before = await geometry(row);
  expect(before.primary.y).toBeCloseTo(before.compact.y, 0);
  const values = await row.locator("[data-field]").allTextContents();
  await page.emulateMedia({ media: "print" });
  expect(await row.locator("[data-field]").allTextContents()).toEqual(values);
  await expect(row.locator("[data-bmg]")).toBeVisible();
  expect(
    await row.evaluate((element) => element.scrollWidth <= element.clientWidth),
  ).toBe(true);
  await context.close();
});
