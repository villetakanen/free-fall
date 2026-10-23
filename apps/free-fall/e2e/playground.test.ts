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
  await page.getByLabel("Body Base", { exact: true }).fill("1");
  expect(snapshot(page).bmg.body).toEqual({ current: 13, base: 1 });
  await input.fill("");
  expect(snapshot(page).bmg.body.current).toBeNull();
  await expect(
    page.locator('[data-attribute="body"] [data-adjust="1"]'),
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
  const increase = page.locator('[data-attribute="ghost"] [data-adjust="1"]');
  await increase.focus();
  await page.keyboard.press("Enter");
  expect(snapshot(page).bmg.ghost.current).toBe(6);
  const ghostMind = page.locator('[data-convert="ghost-to-mind"]');
  await ghostMind.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  expect(snapshot(page).bmg.ghost.current).toBe(2);
  expect(snapshot(page).bmg.mind.current).toBe(12);
  await page.locator('[data-convert="ghost-to-body"]').click();
  await expect(ghostMind).toHaveAttribute("aria-disabled", "true");
  await page.locator('[data-convert="mind-to-body"]').click();
  const after = snapshot(page);
  expect(after.bmg.ghost.current).toBe(0);
  expect(after.bmg.mind.current).toBe(10);
  expect(after.bmg.body.current).toBe(6);
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
  const fragment = `#sheet=${encodeURIComponent(JSON.stringify({ ...emptySheet(), version: 2 }))}`;
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

test("without JavaScript the route has a readable fallback and working site links", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:14321/playground/");
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
  await page.locator('[data-attribute="body"] [data-adjust="1"]').click();
  await settings(page);
  await expect(input).toHaveValue("124");
  await expect(input).toHaveAttribute("aria-invalid", "false");
  await expect(form).toHaveCount(1);
  await expect(form.locator("input")).toHaveCount(8);
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
