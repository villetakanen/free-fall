import { describe, expect, it } from "vitest";
import { spacing } from "./spacing.js";

describe("spacing tokens", () => {
  it("defines five steps based on 0.5rem base unit", () => {
    expect(spacing[1]).toBe("0.5rem");
    expect(spacing[2]).toBe("1rem");
    expect(spacing[4]).toBe("2rem");
    expect(spacing[8]).toBe("4rem");
    expect(spacing[16]).toBe("8rem");
  });

  it("has exactly five steps", () => {
    expect(Object.keys(spacing)).toHaveLength(5);
  });
});
