import { describe, expect, it } from "vitest";
import {
  actionPool,
  CHARACTER_CLASSES,
  CHARACTER_SKILLS,
  decodeSheetFragment,
  emptySheet,
  encodeSheetFragment,
  loadPreset,
  NORTHERN_LIGHTS_PRESETS,
  parseAttributeDraft,
  takeDowntime,
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
    { ...emptySheet(), version: 99 },
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

describe("Downtime recovery", () => {
  it.each(
    NORTHERN_LIGHTS_PRESETS.map((preset) => preset.id),
  )("restores %s to its equipped pools without changing identity or Base", (id) => {
    const loaded = loadPreset(id);
    if (!loaded.ok) throw new Error(loaded.error);
    const sheet = loaded.value;
    sheet.name = "Preserved";
    const original = structuredClone(sheet);
    sheet.bmg.body.current = 0;
    sheet.bmg.mind.current = 99;
    sheet.bmg.ghost.current = null;
    const spent = structuredClone(sheet);
    const result = takeDowntime(sheet);
    expect(result).toEqual({ ok: true, value: original });
    expect(sheet).toEqual(spent);
    if (!result.ok) throw new Error(result.error);
    expect(takeDowntime(result.value)).toEqual(result);
    const encoded = encodeSheetFragment(sheet);
    if (!encoded.ok) throw new Error(encoded.error);
    const decoded = decodeSheetFragment(encoded.value);
    if (!decoded.ok) throw new Error(decoded.error);
    expect(takeDowntime(decoded.value)).toEqual(result);
  });

  it("migrates legacy links without guessing Binding from spent Current", () => {
    const loaded = loadPreset("vantage");
    if (!loaded.ok) throw new Error(loaded.error);
    const { binding: _binding, ...legacy } = loaded.value;
    legacy.bmg.body.current = 1;
    const result = decodeSheetFragment(
      `#sheet=${encodeURIComponent(JSON.stringify({ ...legacy, version: 1 }))}`,
    );
    if (!result.ok) throw new Error(result.error);
    expect(result.value.bmg).toEqual(legacy.bmg);
    expect(result.value.version).toBe(3);
    expect(result.value.binding).toEqual({
      body: null,
      mind: null,
      ghost: null,
    });
    expect(takeDowntime(result.value).ok).toBe(false);
  });

  it("preserves unknown recovery values and restores fully bound pools to zero", () => {
    const sheet = emptySheet();
    expect(takeDowntime(sheet).ok).toBe(false);
    for (const attribute of ["body", "mind", "ghost"] as const) {
      sheet.bmg[attribute] = { current: null, base: 12 };
      sheet.binding[attribute] = 12;
    }
    const result = takeDowntime(sheet);
    if (!result.ok) throw new Error(result.error);
    expect(
      Object.values(result.value.bmg).map((value) => value.current),
    ).toEqual([0, 0, 0]);
  });

  it.each([
    -1,
    0.5,
    13,
    Number.MAX_SAFE_INTEGER + 1,
    "2",
    undefined,
  ])("rejects invalid or excessive Binding %s atomically", (binding) => {
    const sheet = emptySheet();
    sheet.bmg.body.base = 12;
    const input = { ...sheet, binding: { ...sheet.binding, body: binding } };
    expect(validateSheet(input).ok).toBe(false);
    expect(takeDowntime(input).ok).toBe(false);
  });
});

describe("career and condition", () => {
  it("round-trips selected cross-class skills and typed Harm without aliases", () => {
    const sheet = emptySheet();
    sheet.characterClass = "operator";
    sheet.skills = ["deadeye", "human-systems"];
    sheet.harm[0] = {
      state: "transient",
      type: "psychic",
      description: "耳鳴り <script>",
    };
    sheet.harm[1] = {
      state: "permanent",
      type: "compromise",
      description: "Exposed",
    };
    const encoded = encodeSheetFragment(sheet);
    if (!encoded.ok) throw new Error(encoded.error);
    const decoded = decodeSheetFragment(encoded.value);
    expect(decoded).toEqual({ ok: true, value: sheet });
    if (!decoded.ok) throw new Error(decoded.error);
    decoded.value.skills.push("breaching");
    decoded.value.harm[0].description = "Changed";
    expect(sheet.skills).toHaveLength(2);
    expect(sheet.harm[0].description).not.toBe("Changed");
  });
  it.each([
    1, 2,
  ])("migrates version %s without guessing career or condition", (version) => {
    const loaded = loadPreset("vantage");
    if (!loaded.ok) throw new Error(loaded.error);
    const result = validateSheet({ ...loaded.value, version });
    if (!result.ok) throw new Error(result.error);
    expect(result.value.characterClass).toBeNull();
    expect(result.value.skills).toEqual([]);
    expect(result.value.harm).toEqual(emptySheet().harm);
    expect(result.value.bmg).toEqual(loaded.value.bmg);
    if (version === 2)
      expect(result.value.binding).toEqual(loaded.value.binding);
  });
  it.each([
    { characterClass: "unknown" },
    { characterClass: undefined },
    { skills: ["unknown"] },
    { skills: ["deadeye", "deadeye"] },
    { skills: null },
    { harm: [] },
    { harm: [null, null, null] },
    {
      harm: [
        { state: "empty", type: "physical", description: "" },
        ...emptySheet().harm.slice(1),
      ],
    },
    {
      harm: [
        { state: "transient", type: "unknown", description: "" },
        ...emptySheet().harm.slice(1),
      ],
    },
    {
      harm: [
        { state: "permanent", type: "physical", description: 42 },
        ...emptySheet().harm.slice(1),
      ],
    },
  ])("rejects malformed new state atomically", (patch) => {
    expect(validateSheet({ ...emptySheet(), ...patch }).ok).toBe(false);
  });
  it("counts occupied slots once and clears only Transient Harm during recovery", () => {
    const loaded = loadPreset("vantage");
    if (!loaded.ok) throw new Error(loaded.error);
    const sheet = loaded.value;
    expect(actionPool(sheet.harm)).toBe(5);
    sheet.harm[0] = {
      state: "transient",
      type: "physical",
      description: "Bruised",
    };
    expect(actionPool(sheet.harm)).toBe(4);
    sheet.harm[0].state = "permanent";
    expect(actionPool(sheet.harm)).toBe(4);
    sheet.harm[1] = {
      state: "transient",
      type: "psychic",
      description: "Ringing",
    };
    sheet.harm[2] = {
      state: "transient",
      type: "compromise",
      description: "Tracked",
    };
    expect(actionPool(sheet.harm)).toBe(2);
    const before = structuredClone(sheet);
    const recovered = takeDowntime(sheet);
    if (!recovered.ok) throw new Error(recovered.error);
    expect(sheet).toEqual(before);
    expect(recovered.value.harm[0]).toEqual(before.harm[0]);
    expect(recovered.value.harm.slice(1)).toEqual(emptySheet().harm.slice(1));
    expect(actionPool(recovered.value.harm)).toBe(4);
    expect(takeDowntime(recovered.value)).toEqual(recovered);
  });
  it("has unique skill identifiers and coherent preset selections", () => {
    expect(new Set(CHARACTER_SKILLS.map((item) => item.id)).size).toBe(
      CHARACTER_SKILLS.length,
    );
    for (const skill of CHARACTER_SKILLS)
      expect(
        CHARACTER_CLASSES.some((item) => item.id === skill.characterClass),
      ).toBe(true);
    for (const preset of NORTHERN_LIGHTS_PRESETS) {
      const loaded = loadPreset(preset.id);
      if (!loaded.ok) throw new Error(loaded.error);
      expect(loaded.value.skills).toHaveLength(1);
      expect(
        CHARACTER_SKILLS.find((item) => item.id === loaded.value.skills[0])
          ?.characterClass,
      ).toBe(loaded.value.characterClass);
    }
  });
});
