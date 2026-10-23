import {
  ATTRIBUTES,
  type BmgValues,
  isAttributeNumber,
  validateBmg,
} from "../../../../packages/design-system/src/components/character-attributes";

export type PlaygroundSheet = {
  version: 1;
  name: string;
  callsign: string;
  bmg: BmgValues;
};

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export function emptySheet(): PlaygroundSheet {
  return {
    version: 1,
    name: "",
    callsign: "",
    bmg: {
      body: { current: null, base: null },
      mind: { current: null, base: null },
      ghost: { current: null, base: null },
    },
  };
}

/** Copy only the supported fields; URL data never supplies component props directly. */
export function validateSheet(input: unknown): Result<PlaygroundSheet> {
  if (!input || typeof input !== "object" || Array.isArray(input))
    return {
      ok: false,
      error: "This link does not contain a character sheet.",
    };
  const candidate = input as Record<string, unknown>;
  if (candidate.version !== 1)
    return { ok: false, error: "This sheet link uses an unsupported version." };
  if (
    typeof candidate.name !== "string" ||
    typeof candidate.callsign !== "string"
  )
    return { ok: false, error: "Name and callsign must be text." };
  const checked = validateBmg(candidate.bmg);
  if (!checked.ok) return { ok: false, error: checked.message };
  const sheet = emptySheet();
  sheet.name = candidate.name;
  sheet.callsign = candidate.callsign;
  for (const attribute of ATTRIBUTES) {
    const { current, base } = checked.value[attribute];
    sheet.bmg[attribute] = { current, base };
  }
  return { ok: true, value: sheet };
}

export function encodeSheetFragment(input: unknown): Result<string> {
  const checked = validateSheet(input);
  if (!checked.ok) return checked;
  return {
    ok: true,
    value: `#sheet=${encodeURIComponent(JSON.stringify(checked.value))}`,
  };
}

export function decodeSheetFragment(fragment: string): Result<PlaygroundSheet> {
  if (fragment === "" || fragment === "#")
    return { ok: true, value: emptySheet() };
  if (!fragment.startsWith("#sheet="))
    return {
      ok: false,
      error: "This link does not contain a supported sheet.",
    };
  let input: unknown;
  try {
    input = JSON.parse(decodeURIComponent(fragment.slice(7)));
  } catch {
    return { ok: false, error: "This sheet link is incomplete or damaged." };
  }
  return validateSheet(input);
}

export function parseAttributeDraft(draft: string): Result<number | null> {
  const text = draft.trim();
  if (text === "") return { ok: true, value: null };
  const value = Number(text);
  if (!/^\d+$/.test(text) || !isAttributeNumber(value))
    return {
      ok: false,
      error: "Enter a whole number from 0 to 9007199254740991, or leave blank.",
    };
  return { ok: true, value };
}

type Preset = {
  id: string;
  callsign: string;
  role: string;
  configuration: string;
  source: string;
  base: readonly [number, number, number];
  current: readonly [number, number, number];
};

// Body / Mind / Ghost. Keep snapshots aligned with these five source sheets.
export const NORTHERN_LIGHTS_PRESETS: readonly Preset[] = [
  {
    id: "vector",
    callsign: "Vector",
    role: "Pilot",
    configuration: "Outside Tiger",
    source: "/scenarios/northern-lights/c-01-the-pilot/",
    base: [6, 12, 8],
    current: [4, 10, 5],
  },
  {
    id: "vantage",
    callsign: "Vantage",
    role: "Operator",
    configuration: "Heavy overwatch: Wraith and railgun",
    source: "/scenarios/northern-lights/c-02-the-operator/",
    base: [12, 6, 8],
    current: [7, 6, 1],
  },
  {
    id: "root",
    callsign: "Root",
    role: "Wirehead",
    configuration: "Listed loadout, before additional software",
    source: "/scenarios/northern-lights/c-03-the-wirehead/",
    base: [6, 8, 12],
    current: [1, 8, 7],
  },
  {
    id: "stitch",
    callsign: "Stitch",
    role: "Fixer",
    configuration: "Havoc, Threat-Assessment inactive",
    source: "/scenarios/northern-lights/c-04-the-fixer/",
    base: [8, 12, 6],
    current: [8, 11, 3],
  },
  {
    id: "sable",
    callsign: "Sable",
    role: "Spectre",
    configuration: "Void Marine and assault rifle",
    source: "/scenarios/northern-lights/c-05-the-spectre/",
    base: [12, 6, 8],
    current: [5, 6, 7],
  },
];

export function loadPreset(id: string): Result<PlaygroundSheet> {
  const sheet = emptySheet();
  if (id === "empty") return { ok: true, value: sheet };
  const preset = NORTHERN_LIGHTS_PRESETS.find((item) => item.id === id);
  if (!preset)
    return { ok: false, error: "Choose an available starting sheet." };
  sheet.callsign = preset.callsign;
  for (const [index, attribute] of (
    ["body", "mind", "ghost"] as const
  ).entries())
    sheet.bmg[attribute] = {
      current: preset.current[index],
      base: preset.base[index],
    };
  return { ok: true, value: sheet };
}
