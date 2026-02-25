import { describe, expect, it } from "vitest";
import { typography } from "./typography.js";

describe("typography tokens", () => {
  describe("font families", () => {
    it("body font starts with Lato", () => {
      expect(typography.fonts.body).toMatch(/^"Lato"/);
    });

    it("mono font starts with IBM Plex Mono", () => {
      expect(typography.fonts.mono).toMatch(/^"IBM Plex Mono"/);
    });

    it("body font includes system fallbacks", () => {
      expect(typography.fonts.body).toContain("system-ui");
      expect(typography.fonts.body).toContain("sans-serif");
    });

    it("mono font includes monospace fallbacks", () => {
      expect(typography.fonts.mono).toContain("ui-monospace");
      expect(typography.fonts.mono).toContain("monospace");
    });
  });

  describe("font weights", () => {
    it("body has light, regular, and bold weights", () => {
      expect(typography.weights.body.light).toBe(300);
      expect(typography.weights.body.regular).toBe(400);
      expect(typography.weights.body.bold).toBe(700);
    });

    it("mono has regular and medium weights", () => {
      expect(typography.weights.mono.regular).toBe(400);
      expect(typography.weights.mono.medium).toBe(500);
    });
  });
});
