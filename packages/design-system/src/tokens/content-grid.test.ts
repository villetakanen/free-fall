import { describe, expect, it } from "vitest";
import { contentGrid } from "./content-grid.js";

describe("content grid tokens", () => {
  it("defines main column width matching CSS token", () => {
    expect(contentGrid.main).toBe("67ch");
  });

  it("defines narrow side column width matching CSS token", () => {
    expect(contentGrid.sideNarrow).toBe("25.6ch");
  });

  it("defines wide side column width matching CSS token", () => {
    expect(contentGrid.sideWide).toBe("42.5ch");
  });

  it("has exactly three properties", () => {
    expect(Object.keys(contentGrid)).toHaveLength(3);
  });
});
