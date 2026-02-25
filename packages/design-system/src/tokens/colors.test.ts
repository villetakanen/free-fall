import { describe, expect, it } from "vitest";
import { colors } from "./colors.ts";

describe("colors", () => {
  describe("primary palette", () => {
    it("defines 11 steps", () => {
      expect(Object.keys(colors.primary)).toHaveLength(11);
    });

    it.each([
      [50, "hsl(210, 36%, 96%)"],
      [100, "hsl(210, 37%, 88%)"],
      [200, "hsl(210, 32%, 78%)"],
      [300, "hsl(211, 23%, 44%)"],
      [400, "hsl(212, 26%, 36%)"],
      [500, "hsl(213, 29%, 28%)"],
      [600, "hsl(213, 32%, 22%)"],
      [700, "hsl(214, 34%, 16%)"],
      [800, "hsl(216, 36%, 11%)"],
      [900, "hsl(219, 41%, 7%)"],
      [950, "hsl(220, 43%, 3%)"],
    ] as const)("primary-%i is %s", (step, expected) => {
      expect(colors.primary[step]).toBe(expected);
    });
  });

  describe("accent palette", () => {
    it("defines 3 steps", () => {
      expect(Object.keys(colors.accent)).toHaveLength(3);
    });

    it.each([
      [400, "hsl(64, 80%, 54%)"],
      [500, "hsl(64, 90%, 45%)"],
      [900, "hsl(64, 70%, 15%)"],
    ] as const)("accent-%i is %s", (step, expected) => {
      expect(colors.accent[step]).toBe(expected);
    });
  });
});
