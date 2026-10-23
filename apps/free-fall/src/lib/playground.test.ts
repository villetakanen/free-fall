import { describe, expect, it } from "vitest";
import {
  decodeSheetFragment,
  emptySheet,
  encodeSheetFragment,
  loadPreset,
  NORTHERN_LIGHTS_PRESETS,
  parseAttributeDraft,
  validateSheet,
} from "./playground";

describe("sheet URL contract", () => {
  it("round-trips complete snapshots without changing Unicode, zero, blank or above-Base values", () => {
    const sheet = emptySheet();
    sheet.name = "李 Å / ? # & + % 🚀";
    sheet.callsign = '<script>"Vector"</script>';
    sheet.bmg.body = { current: 0, base: null };
    sheet.bmg.mind = { current: 13, base: 2 };
    sheet.bmg.ghost = { current: Number.MAX_SAFE_INTEGER, base: 12 };
    const encoded = encodeSheetFragment(sheet);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) throw new Error(encoded.error);
    expect(decodeSheetFragment(encoded.value)).toEqual({
      ok: true,
      value: sheet,
    });
  });

  it("creates independent empty snapshots", () => {
    const first = emptySheet();
    first.bmg.ghost.current = 4;
    expect(decodeSheetFragment("")).toEqual({ ok: true, value: emptySheet() });
    expect(decodeSheetFragment("#")).toEqual({ ok: true, value: emptySheet() });
    expect(emptySheet().bmg.ghost.current).toBeNull();
  });

  it.each([
    "#other=123",
    "#sheet=",
    "#sheet=%ZZ",
    "#sheet=%E0%A4",
    "#sheet={",
    "#sheet=null",
    "#sheet=[]",
  ])("rejects damaged payload %s", (fragment) => {
    expect(decodeSheetFragment(fragment).ok).toBe(false);
  });

  it.each([
    null,
    {},
    { ...emptySheet(), version: 2 },
    { ...emptySheet(), name: 1 },
    { ...emptySheet(), callsign: null },
    { ...emptySheet(), bmg: {} },
  ])("rejects unsupported or incomplete sheet data", (value) => {
    expect(validateSheet(value).ok).toBe(false);
    expect(encodeSheetFragment(value).ok).toBe(false);
    expect(
      decodeSheetFragment(`#sheet=${encodeURIComponent(JSON.stringify(value))}`)
        .ok,
    ).toBe(false);
  });

  it.each([
    -1,
    0.5,
    Number.MAX_SAFE_INTEGER + 1,
    Infinity,
    NaN,
    "6",
    undefined,
  ])("rejects an invalid stat atomically", (value) => {
    const input = {
      ...emptySheet(),
      bmg: { ...emptySheet().bmg, mind: { current: value, base: 8 } },
    };
    expect(validateSheet(input).ok).toBe(false);
  });

  it("copies only supported data, without sharing mutable pairs", () => {
    const input = { ...emptySheet(), extra: "discard" };
    const parsed = validateSheet(input);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) throw new Error(parsed.error);
    expect(parsed.value).not.toHaveProperty("extra");
    parsed.value.bmg.body.current = 5;
    expect(input.bmg.body.current).toBeNull();
  });
});

describe("numeric drafts", () => {
  it.each([
    ["", null],
    [" ", null],
    ["0", 0],
    ["012", 12],
    ["9007199254740991", Number.MAX_SAFE_INTEGER],
  ] as const)("parses %s", (draft, value) => {
    expect(parseAttributeDraft(draft)).toEqual({ ok: true, value });
  });
  it.each([
    "-1",
    "0.5",
    "1e3",
    "0x10",
    "Infinity",
    "abc",
    "9007199254740992",
  ])("rejects %s", (draft) => {
    expect(parseAttributeDraft(draft).ok).toBe(false);
  });
});

describe("Northern Lights preset data", () => {
  it.each([
    ["vector", [6, 12, 8], [4, 10, 5]],
    ["vantage", [12, 6, 8], [7, 6, 1]],
    ["root", [6, 8, 12], [1, 8, 7]],
    ["stitch", [8, 12, 6], [8, 11, 3]],
    ["sable", [12, 6, 8], [5, 6, 7]],
  ] as const)("loads %s as an independent, complete snapshot", (id, base, current) => {
    const result = loadPreset(id);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.value.name).toBe("");
    expect(validateSheet(result.value).ok).toBe(true);
    expect(
      ["body", "mind", "ghost"].map(
        (attribute) =>
          result.value.bmg[attribute as keyof typeof result.value.bmg].base,
      ),
    ).toEqual(base);
    expect(
      ["body", "mind", "ghost"].map(
        (attribute) =>
          result.value.bmg[attribute as keyof typeof result.value.bmg].current,
      ),
    ).toEqual(current);
    const initial = structuredClone(result.value);
    result.value.bmg.body.current = 999;
    expect(loadPreset(id)).toEqual({ ok: true, value: initial });
  });
  it("supports Empty and rejects unknown presets", () => {
    expect(loadPreset("empty")).toEqual({ ok: true, value: emptySheet() });
    expect(loadPreset("unknown").ok).toBe(false);
    expect(
      new Set(NORTHERN_LIGHTS_PRESETS.map((preset) => preset.id)).size,
    ).toBe(5);
  });
});
