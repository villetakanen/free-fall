import { expect, type Page, test } from "@playwright/test";
import {
  emptySheet,
  encodeSheetFragment,
  loadPreset,
  type PlaygroundSheet,
} from "../src/lib/playground";

async function open(page: Page, fragment = "") {
  await page.goto(`/playground/${fragment}`);
  await expect(page.locator("[data-playground]")).toHaveAttribute(
    "data-ready",
    "true",
  );
}

function snapshot(page: Page): PlaygroundSheet {
  return JSON.parse(decodeURIComponent(new URL(page.url()).hash.slice(7)));
}

async function settings(page: Page, expanded = true) {
  const trigger = page.locator("[data-settings-toggle]");
  if ((await trigger.getAttribute("aria-expanded")) !== String(expanded))
    await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", String(expanded));
}

async function load(page: Page, id: string) {
  await settings(page);
  await page.getByLabel("Starting sheet", { exact: true }).selectOption(id);
  await page.locator("[data-load]").click();
}

function current(page: Page, attribute: string) {
  return page.locator(`[data-attribute="${attribute}"] [data-field="current"]`);
}

test("root navigation reaches the empty client sheet", async ({ page }) => {
  await page.goto("/");
  await page.locator('#app-tray-nav a[href="/playground/"]').first().click();
  await expect(page.locator("[data-playground]")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await expect(page.locator("[data-field].blank")).toHaveCount(6);
  await expect(page.locator("[data-playground-fallback]")).toHaveCount(0);
  expect(new URL(page.url()).hash).toBe("");
});

test("identity and values round-trip through a new page without storage or character requests", async ({
  page,
  context,
}) => {
  await open(page);
  const historyLength = await page.evaluate(() => history.length);
  const requests: string[] = [];
  page.on("request", (request) =>
    requests.push(request.url() + (request.postData() ?? "")),
  );
  await settings(page);
  const name = '李 Å # / % 🚀 <img src=x onerror="alert(1)">';
  await page.getByLabel("Name", { exact: true }).fill(name);
  await page.getByLabel("Callsign", { exact: true }).fill("Quiet & Bold");
  await page.getByLabel("Body Current", { exact: true }).fill("0");
  await page.getByLabel("Mind Current", { exact: true }).fill("13");
  await page.getByLabel("Mind Base", { exact: true }).fill("2");
  const saved = snapshot(page);
  expect(saved.name).toBe(name);
  expect(saved.bmg.body).toEqual({ current: 0, base: null });
  expect(saved.bmg.mind).toEqual({ current: 13, base: 2 });
  expect(saved.bmg.ghost).toEqual({ current: null, base: null });
  expect(await page.evaluate(() => history.length)).toBe(historyLength);
  expect(
    await page.evaluate(() => [
      localStorage.length,
      sessionStorage.length,
      document.cookie,
    ]),
  ).toEqual([0, 0, ""]);
  expect(
    requests.some(
      (request) => request.includes("Quiet") || request.includes("onerror"),
    ),
  ).toBe(false);
  await expect(page.locator("[data-playground] img")).toHaveCount(0);
  const other = await context.newPage();
  await other.goto(page.url());
  await expect(other.getByLabel("Name", { exact: true })).toHaveValue(name);
  expect(snapshot(other)).toEqual(saved);
  await expect(current(other, "body")).toHaveText("0");
  await other.close();
});

test("each preset loads its equipped pools and Empty clears the complete sheet", async ({
  page,
}) => {
  await open(page);
  for (const id of ["vector", "vantage", "root", "stitch", "sable"]) {
    await load(page, id);
    const preset = loadPreset(id);
    if (!preset.ok) throw new Error(preset.error);
    expect(snapshot(page)).toEqual(preset.value);
    for (const attribute of ["body", "mind", "ghost"] as const)
      await expect(current(page, attribute)).toHaveText(
        String(preset.value.bmg[attribute].current),
      );
  }
  await page.getByLabel("Name", { exact: true }).fill("Edited name");
  await load(page, "empty");
  expect(snapshot(page)).toEqual(emptySheet());
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue("");
});

test("numeric validation preserves URL and supports blank, zero and Base independence", async ({
  page,
}) => {
  await open(page);
  await load(page, "vector");
  const input = page.getByLabel("Body Current", { exact: true });
  const saved = page.url();
  for (const invalid of ["-1", "1.5", "text", "9007199254740992"]) {
    await input.fill(invalid);
    await expect(input).toHaveAttribute("aria-invalid", "true");
    const description = await input.getAttribute("aria-describedby");
    expect(description).toBeTruthy();
    await expect(page.locator(`[id="${description}"]`)).toBeVisible();
    expect(page.url()).toBe(saved);
    await expect(current(page, "body")).toHaveText("4");
  }
  await input.fill("13");
  await expect(input).toHaveAttribute("aria-invalid", "false");
  await page.getByLabel("Body Binding", { exact: true }).fill("0");
  await page.getByLabel("Body Base", { exact: true }).fill("1");
  expect(snapshot(page).bmg.body).toEqual({ current: 13, base: 1 });
  await input.fill("");
  expect(snapshot(page).bmg.body.current).toBeNull();
  await expect(
    page.locator('[data-attribute="body"] [data-adjust="-1"]'),
  ).toHaveAttribute("aria-disabled", "true");
  await input.fill("0");
  expect(snapshot(page).bmg.body.current).toBe(0);
  await expect(current(page, "body")).toHaveText("0");
});

test("keyboard adjustments and repeated conversions commit against the latest sheet", async ({
  page,
}) => {
  await open(page);
  await load(page, "vector");
  const bases = snapshot(page).bmg;
  await settings(page, false);
  const activate = page.locator('[data-attribute="ghost"] [data-adjust="-1"]');
  await activate.focus();
  await page.keyboard.press("Enter");
  expect(snapshot(page).bmg.ghost.current).toBe(4);
  const ghostMind = page.locator('[data-convert="ghost-to-mind"]');
  await ghostMind.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  expect(snapshot(page).bmg.ghost.current).toBe(0);
  expect(snapshot(page).bmg.mind.current).toBe(12);
  await expect(ghostMind).toHaveAttribute("aria-disabled", "true");
  await page.locator('[data-convert="mind-to-body"]').click();
  const after = snapshot(page);
  expect(after.bmg.ghost.current).toBe(0);
  expect(after.bmg.mind.current).toBe(10);
  expect(after.bmg.body.current).toBe(5);
  for (const attribute of ["body", "mind", "ghost"] as const)
    expect(after.bmg[attribute].base).toBe(bases[attribute].base);
  await page.reload();
  await expect(current(page, "ghost")).toHaveText("0");
  await expect(current(page, "mind")).toHaveText("10");
});

test("fragment and browser history navigation restore snapshots; damaged URLs suspend editing", async ({
  page,
}) => {
  await open(page);
  await load(page, "vector");
  const saved = page.url();
  await settings(page, false);
  const next = loadPreset("root");
  if (!next.ok) throw new Error(next.error);
  const fragment = encodeSheetFragment(next.value);
  if (!fragment.ok) throw new Error(fragment.error);
  await page.evaluate((hash) => {
    location.hash = hash;
  }, fragment.value);
  await expect(page.getByLabel("Callsign", { exact: true })).toHaveValue(
    "Root",
  );
  await page.goBack();
  await expect(page.getByLabel("Callsign", { exact: true })).toHaveValue(
    "Vector",
  );
  expect(page.url()).toBe(saved);
  await page.goForward();
  await expect(page.getByLabel("Callsign", { exact: true })).toHaveValue(
    "Root",
  );
  await page.evaluate(() => {
    location.hash = "sheet=%ZZ";
  });
  await expect(page.locator("[data-url-error]")).toBeVisible();
  await expect(page.getByLabel("Callsign", { exact: true })).toBeDisabled();
  await expect(page.getByLabel("Callsign", { exact: true })).toHaveValue(
    "Root",
  );
  await expect(page.locator("[data-convert]")).toHaveCount(0);
  expect(new URL(page.url()).hash).toBe("#sheet=%ZZ");
  await page.locator("[data-reset]").click();
  expect(snapshot(page)).toEqual(emptySheet());
  await expect(page.getByLabel("Name", { exact: true })).toBeEnabled();
});

test("unsupported version is recoverable on first load", async ({ page }) => {
  const fragment = `#sheet=${encodeURIComponent(JSON.stringify({ ...emptySheet(), version: 99 }))}`;
  await open(page, fragment);
  await expect(page.locator("[data-url-error]")).toBeVisible();
  expect(new URL(page.url()).hash).toBe(fragment);
  await expect(page.locator("[data-field].blank")).toHaveCount(6);
  await page.locator("[data-reset]").click();
  expect(snapshot(page)).toEqual(emptySheet());
});

test("Copy Link writes the full snapshot and falls back to a selectable current link", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          document.documentElement.dataset.copied = text;
        },
      },
    });
  });
  await open(page);
  await load(page, "sable");
  await settings(page, false);
  await page.locator("[data-copy]").click();
  await expect(page.locator("html")).toHaveAttribute("data-copied", page.url());
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw new Error("Clipboard unavailable");
    };
  });
  await page.locator("[data-copy]").click();
  const fallback = page.locator("[data-link-fallback]");
  await expect(fallback).toHaveValue(page.url());
  await fallback.focus();
  expect(
    await fallback.evaluate(
      (el: HTMLInputElement) =>
        (el.selectionEnd ?? 0) - (el.selectionStart ?? 0),
    ),
  ).toBe(page.url().length);
  await settings(page);
  await page.getByLabel("Name", { exact: true }).fill("New name");
  await expect(fallback).toHaveValue(page.url());
});

test("320px layout keeps inputs and BMG controls within the content width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await open(page);
  await load(page, "vantage");
  await page
    .getByLabel("Callsign", { exact: true })
    .fill("Unbroken".repeat(20));
  await settings(page, false);
  const row = page.locator("[data-playground] .char-sheet-row");
  const compact = await row.locator(":scope > :first-child").boundingBox();
  const primary = await row.locator(":scope > :last-child").boundingBox();
  if (!compact || !primary) throw new Error("Sheet columns are not rendered.");
  expect(primary.y).toBeGreaterThan(compact.y + compact.height);
  expect(primary.x).toBeCloseTo(compact.x, 0);
  expect(primary.width).toBeCloseTo(compact.width, 0);
  await expect(row.locator("[data-bmg]")).toHaveCount(1);
  await settings(page);
  const problems = await page.locator("[data-playground]").evaluate((root) => {
    const bounds = root.getBoundingClientRect();
    return [...root.querySelectorAll("input, select, button")].flatMap(
      (element) => {
        const rect = element.getBoundingClientRect();
        if (!rect.width && !rect.height) return [];
        return rect.left < bounds.left - 1 ||
          rect.right > bounds.right + 1 ||
          rect.height < 44
          ? [element.outerHTML.slice(0, 100)]
          : [];
      },
    );
  });
  expect(problems).toEqual([]);
  expect(
    await page
      .locator("main")
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
});

test("sheet row uses reversed prose tracks and adapts to its host without replacing state", async ({
  page,
}) => {
  await page.setViewportSize({ width: 2000, height: 1000 });
  await open(page);
  await load(page, "vector");
  await settings(page, false);
  await page.evaluate(() => document.fonts.ready);
  const row = page.locator("[data-playground] .char-sheet-row");
  const bmg = row.locator("[data-bmg]");
  const savedUrl = page.url();
  await bmg.evaluate((element) => {
    element.setAttribute("data-original", "true");
  });
  const geometry = () =>
    row.evaluate((element) => {
      const rect = (node: Element) => {
        const { x, y, width, right, bottom } = node.getBoundingClientRect();
        return { x, y, width, right, bottom };
      };
      return {
        row: rect(element),
        compact: rect(element.children[0]),
        primary: rect(element.children[1]),
      };
    });
  await expect
    .poll(async () => {
      const box = await geometry();
      return Math.abs(box.compact.y - box.primary.y) < 1;
    })
    .toBe(true);
  const tracks = await page.locator(".content-grid").evaluate((grid) => {
    const widths = getComputedStyle(grid)
      .gridTemplateColumns.match(/[\d.]+px/g)
      ?.map(Number.parseFloat);
    if (!widths || widths.length !== 5)
      throw new Error("Expected the wide prose grid.");
    return { primary: widths[1], gap: widths[2], compact: widths[3] };
  });
  const wide = await geometry();
  expect(wide.compact.width).toBeCloseTo(tracks.compact, 0);
  expect(wide.primary.width).toBeCloseTo(tracks.primary, 0);
  expect(wide.primary.x - wide.compact.right).toBeCloseTo(tracks.gap, 0);
  await expect(row.locator(":scope > *")).toHaveCount(2);
  await expect(page.locator("[data-settings-toggle]")).toBeVisible();
  await expect(row.locator(":scope > :last-child [data-bmg]")).toHaveCount(1);

  const host = page.locator("[data-playground]");
  await host.evaluate((element, width) => {
    (element as HTMLElement).style.inlineSize = `${width}px`;
  }, wide.row.width - 1);
  await expect
    .poll(async () => {
      const box = await geometry();
      return box.primary.y > box.compact.bottom;
    })
    .toBe(true);
  await host.evaluate((element) => {
    (element as HTMLElement).style.removeProperty("inline-size");
  });
  await expect
    .poll(async () => {
      const box = await geometry();
      return Math.abs(box.compact.y - box.primary.y) < 1;
    })
    .toBe(true);
  expect(page.url()).toBe(savedUrl);
  await expect(bmg).toHaveAttribute("data-original", "true");
  await page.locator('[data-convert="ghost-to-mind"]').click();
  expect(snapshot(page).bmg.ghost.current).toBe(3);
  await page.locator("[data-downtime]").click();
  expect(page.url()).toBe(savedUrl);
});

test("without JavaScript the route has a readable fallback and working site links", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/playground/`);
  await expect(page.locator("[data-playground-fallback]")).toBeVisible();
  await expect(page.locator("#playground-settings-hud")).toBeHidden();
  await expect(
    page.locator("[data-playground] input, [data-playground] button"),
  ).toHaveCount(0);
  await expect(
    page.locator('#app-tray-nav a[href="/"]').first(),
  ).toHaveAttribute("href", "/");
  await context.close();
});

test("Settings docks one form and preserves drafts, URL and keyboard focus", async ({
  page,
}) => {
  await open(page);
  const trigger = page.locator("[data-settings-toggle]");
  const form = page.locator("[data-settings-form]");
  const input = page.getByLabel("Body Current", { exact: true });
  const picker = page.getByLabel("Starting sheet", { exact: true });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(form).toBeHidden();
  const initialUrl = page.url();
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(picker).toBeFocused();
  await expect(
    page.locator("#playground-settings-host [data-settings-form]"),
  ).toHaveCount(1);
  expect(page.url()).toBe(initialUrl);
  await input.pressSequentially("123");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const savedUrl = page.url();
  await input.fill("unfinished");
  await input.press("Escape");
  await expect(form).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(page.url()).toBe(savedUrl);
  await settings(page);
  await expect(input).toHaveValue("unfinished");
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await page
    .locator('#playground-settings-hud [data-close-pane="custom"]')
    .click();
  await expect(trigger).toBeFocused();
  await page.locator('[data-attribute="body"] [data-adjust="-1"]').click();
  await settings(page);
  await expect(input).toHaveValue("122");
  await expect(input).toHaveAttribute("aria-invalid", "false");
  await expect(form).toHaveCount(1);
  await expect(form.locator("input")).toHaveCount(11);
});

test("Settings preserves the same form and drafts when moving between HUD and narrow layout", async ({
  page,
}) => {
  await page.setViewportSize({ width: 800, height: 1000 });
  await open(page);
  await load(page, "vector");
  const input = page.getByLabel("Mind Base", { exact: true });
  await input.fill("unfinished");
  const savedUrl = page.url();
  await input.evaluate((element) => {
    element.dataset.original = "true";
  });
  await page.setViewportSize({ width: 320, height: 740 });
  await expect(
    page.locator(".inline-settings [data-settings-form]"),
  ).toBeVisible();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue("unfinished");
  await expect(input).toHaveAttribute("data-original", "true");
  await page.locator("[data-settings-close]").click();
  await expect(page.locator("[data-settings-form]")).toBeHidden();
  await expect(page.locator("[data-settings-toggle]")).toBeFocused();
  await settings(page);
  await page.setViewportSize({ width: 1800, height: 1000 });
  await expect(
    page.locator("#playground-settings-host [data-settings-form]"),
  ).toBeVisible();
  await expect(input).toHaveValue("unfinished");
  await expect(input).toHaveAttribute("data-original", "true");
  await expect(page.locator("[data-settings-form]")).toHaveCount(1);
  expect(page.url()).toBe(savedUrl);
  await settings(page, false);
  await page.setViewportSize({ width: 320, height: 740 });
  await expect(page.locator("[data-settings-form]")).toBeHidden();
  await settings(page);
  await expect(input).toHaveValue("unfinished");
});

test("Downtime restores saved unbound pools after spending and reload", async ({
  page,
}) => {
  await open(page);
  await load(page, "vantage");
  await page.getByLabel("Name", { exact: true }).fill("A kept identity");
  const original = snapshot(page);
  await settings(page, false);
  await page.locator('[data-attribute="body"] [data-adjust="-1"]').click();
  await page.locator('[data-convert="mind-to-body"]').click();
  expect(snapshot(page).binding).toEqual(original.binding);
  await page.reload();
  await expect(page.locator("[data-downtime]")).toBeEnabled();
  await page.locator("[data-downtime]").click();
  expect(snapshot(page)).toEqual(original);
  await page.locator("[data-downtime]").click();
  expect(snapshot(page)).toEqual(original);
  await settings(page);
  await expect(page.getByLabel("Body Current", { exact: true })).toHaveValue(
    "7",
  );
  await page.getByLabel("Body Binding", { exact: true }).fill("13");
  await expect(
    page.getByLabel("Body Binding", { exact: true }),
  ).toHaveAttribute("aria-invalid", "true");
  expect(snapshot(page)).toEqual(original);
  await page.getByLabel("Body Binding", { exact: true }).fill("12");
  await settings(page, false);
  await page.locator("[data-downtime]").click();
  expect(snapshot(page).bmg.body.current).toBe(0);
  expect(snapshot(page).bmg.body.base).toBe(12);
  await page.reload();
  await expect(current(page, "body")).toHaveText("0");
});

test("legacy links preserve spent values and require explicit Binding before Downtime", async ({
  page,
}) => {
  const preset = loadPreset("vector");
  if (!preset.ok) throw new Error(preset.error);
  const { binding: _binding, ...legacy } = preset.value;
  legacy.bmg.ghost.current = 1;
  const fragment = `#sheet=${encodeURIComponent(JSON.stringify({ ...legacy, version: 1 }))}`;
  await open(page, fragment);
  await expect(current(page, "ghost")).toHaveText("1");
  await expect(page.locator("[data-downtime]")).toBeDisabled();
  expect(new URL(page.url()).hash).toBe(fragment);
  await settings(page);
  for (const [attribute, value] of [
    ["Body", "2"],
    ["Mind", "2"],
    ["Ghost", "3"],
  ])
    await page.getByLabel(`${attribute} Binding`, { exact: true }).fill(value);
  await settings(page, false);
  await page.locator("[data-downtime]").click();
  expect(snapshot(page).version).toBe(3);
  expect(snapshot(page).bmg.ghost.current).toBe(5);
});

test("class choices and Harm persist, derive dice and recover selectively", async ({
  page,
}) => {
  await open(page);
  await load(page, "vantage");
  await page
    .getByLabel("Chosen Skills", { exact: true })
    .selectOption(["deadeye", "human-systems"]);
  await page.getByLabel("Class", { exact: true }).selectOption("fixer");
  expect(snapshot(page).skills).toEqual(["human-systems", "deadeye"]);
  await settings(page, false);
  const slot = page.locator('[data-harm-slot="0"]');
  const dialog = page.locator("dialog[open]");
  await slot.locator("button").focus();
  await page.keyboard.press("Enter");
  const beforeDraft = page.url();
  await dialog.locator("select").selectOption("psychic");
  await dialog.locator("textarea").fill("Ringing <img src=x>");
  expect(page.url()).toBe(beforeDraft);
  await dialog.locator('[type="submit"]').click();
  await expect(page.locator("[data-action-pool]")).toHaveText("4d20");
  await slot.locator("button").click();
  await dialog.locator('[type="checkbox"]').check();
  await dialog.locator('[type="submit"]').click();
  await expect(page.locator("[data-action-pool]")).toHaveText("4d20");
  await page.locator('[data-harm-slot="1"] button').click();
  await dialog.locator("textarea").fill("Bruised ribs");
  await dialog.locator('[type="submit"]').click();
  await expect(page.locator("[data-action-pool]")).toHaveText("3d20");
  const saved = snapshot(page);
  await page.reload();
  await expect(page.locator("[data-action-pool]")).toHaveText("3d20");
  expect(snapshot(page)).toEqual(saved);
  await expect(page.locator("[data-harm-slot] img")).toHaveCount(0);
  await page.locator("[data-downtime]").click();
  expect(snapshot(page).harm[0]).toEqual(saved.harm[0]);
  expect(snapshot(page).harm[1].state).toBe("empty");
  await expect(page.locator("[data-action-pool]")).toHaveText("4d20");
  await page.locator('[data-harm-slot="0"] button').click();
  await dialog.getByRole("button", { name: "Clear", exact: true }).click();
  expect(snapshot(page).harm[0]).toEqual(emptySheet().harm[0]);
  await expect(page.locator("[data-action-pool]")).toHaveText("5d20");
});

test("Harm dialogs fit a narrow host and rule links resolve", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await open(page);
  await load(page, "vantage");
  await settings(page, false);
  await page.locator('[data-harm-slot="0"] button').click();
  const dialog = page.locator("dialog[open]");
  await dialog.locator("textarea").fill("Long".repeat(40));
  await dialog.locator('[type="submit"]').click();
  expect(
    await page
      .locator("main")
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
  const links = await page
    .locator(".skill-summary a, .action-pool a")
    .evaluateAll((items) =>
      items.map((item) => (item as HTMLAnchorElement).href),
    );
  for (const href of links) {
    const target = new URL(href);
    const response = await page.goto(href);
    expect(response?.ok()).toBe(true);
    await expect(page.locator(`[id="${target.hash.slice(1)}"]`)).toHaveCount(1);
  }
});
