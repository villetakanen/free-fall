import { describe, expect, it } from "vitest";
import { breakpoints } from "./breakpoints.ts";

describe("breakpoints", () => {
  it("defines tablet at 620px", () => {
    expect(breakpoints.tablet).toBe("620px");
  });

  it("defines desktop at 780px", () => {
    expect(breakpoints.desktop).toBe("780px");
  });
});
