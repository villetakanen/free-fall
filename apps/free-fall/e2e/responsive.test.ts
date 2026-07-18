import { expect, test } from "@playwright/test";

test("no horizontal overflow at 320px (mobile)", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  const body = page.locator("body");
  const scrollWidth = await body.evaluate((el) => el.scrollWidth);
  const clientWidth = await body.evaluate((el) => el.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});

test("content pane is a size container for container queries", async ({
  page,
}) => {
  await page.setViewportSize({ width: 620, height: 800 });
  await page.goto("/");
  const containerType = await page
    .locator("main")
    .evaluate((el) => getComputedStyle(el).containerType);
  expect(containerType).toBe("inline-size");
});

test("content pane scrolls vertically", async ({ page }) => {
  await page.setViewportSize({ width: 780, height: 900 });
  await page.goto("/");
  const overflowY = await page
    .locator("main")
    .evaluate((el) => getComputedStyle(el).overflowY);
  expect(overflowY).toBe("auto");
});

test("content pane fills the viewport below the app bar", async ({ page }) => {
  await page.setViewportSize({ width: 780, height: 900 });
  await page.goto("/core-rulebook/02-characters-and-crews/");

  const appBar = await page.locator("header").boundingBox();
  const main = await page.locator("main").boundingBox();

  expect(main?.y).toBeCloseTo(appBar?.height ?? 0, 0);
  expect((main?.y ?? 0) + (main?.height ?? 0)).toBeCloseTo(900, 0);

  await page.locator("main").evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  const reachedBottom = await page
    .locator("main")
    .evaluate(
      (element) =>
        Math.abs(
          element.scrollHeight - element.clientHeight - element.scrollTop,
        ) < 1,
    );
  expect(reachedBottom).toBeTruthy();
});

test("content-grid surfaces, links, and muted text resolve accessibly", async ({
  page,
}) => {
  await page.goto("/core-rulebook/02-characters-and-crews/");

  const result = await page
    .locator(".surface")
    .first()
    .evaluate((surface) => {
      const link = document.createElement("a");
      link.href = "#foundation-test";
      link.textContent = "Foundation test";
      surface.append(link);

      const probe = document.createElement("span");
      probe.style.color = "var(--freefall-text-muted)";
      surface.append(probe);

      const parseRgb = (value: string) =>
        (value.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
      const luminance = (value: string) => {
        const channels = parseRgb(value).map((channel) => {
          const normalized = channel / 255;
          return normalized <= 0.04045
            ? normalized / 12.92
            : ((normalized + 0.055) / 1.055) ** 2.4;
        });
        return (
          0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
        );
      };
      const contrast = (foreground: string, background: string) => {
        const lighter = Math.max(luminance(foreground), luminance(background));
        const darker = Math.min(luminance(foreground), luminance(background));
        return (lighter + 0.05) / (darker + 0.05);
      };

      const surfaceStyle = getComputedStyle(surface);
      const linkStyle = getComputedStyle(link);
      const mutedColor = getComputedStyle(probe).color;
      const canvas = document.createElement("span");
      canvas.style.backgroundColor = "var(--freefall-bg-canvas)";
      document.body.append(canvas);
      const canvasColor = getComputedStyle(canvas).backgroundColor;

      return {
        surfaceBackground: surfaceStyle.backgroundColor,
        surfacePadding: Number.parseFloat(surfaceStyle.paddingLeft),
        linkBackground: linkStyle.backgroundColor,
        canvasContrast: contrast(mutedColor, canvasColor),
        surfaceContrast: contrast(mutedColor, surfaceStyle.backgroundColor),
      };
    });

  expect(result.surfaceBackground).not.toBe("rgba(0, 0, 0, 0)");
  expect(result.surfacePadding).toBeGreaterThan(0);
  expect(result.linkBackground).not.toBe("rgba(0, 0, 0, 0)");
  expect(result.canvasContrast).toBeGreaterThanOrEqual(4.5);
  expect(result.surfaceContrast).toBeGreaterThanOrEqual(4.5);
});
