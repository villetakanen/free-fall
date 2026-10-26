import {
  ATTRIBUTE_LABELS,
  ATTRIBUTES,
  type Attribute,
  type BmgValues,
  isAttributeNumber,
  validateBmg,
} from "../../../../packages/design-system/src/components/character-attributes";

// Class/Skill permissions from Characters & Crews; no numerical skill ratings.
export const CHARACTER_CLASSES = [
  {
    id: "vanguard",
    label: "The Vanguard",
  },
  {
    id: "spectre",
    label: "The Spectre",
  },
  {
    id: "wirehead",
    label: "The Wirehead",
  },
  {
    id: "fixer",
    label: "The Fixer",
  },
  {
    id: "operator",
    label: "The Operator",
  },
  {
    id: "broker",
    label: "The Broker",
  },
  {
    id: "pilot",
    label: "The Pilot",
  },
] as const;
export const CHARACTER_SKILLS = [
  {
    id: "breaching",
    characterClass: "vanguard",
    label: "Breaching",
    description:
      "Forcing entry through barriers, doors, and fortified positions",
  },
  {
    id: "close-combat-tactics",
    characterClass: "vanguard",
    label: "Close Combat Tactics",
    description: "Hand-to-hand fighting and melee weapon proficiency",
  },
  {
    id: "tactical-defense",
    characterClass: "vanguard",
    label: "Tactical Defense",
    description: "Holding ground, providing cover, and protecting allies",
  },
  {
    id: "infiltration",
    characterClass: "spectre",
    label: "Infiltration",
    description:
      "Bypassing security and moving undetected through hostile territory",
  },
  {
    id: "sabotage",
    characterClass: "spectre",
    label: "Sabotage",
    description:
      "Disabling systems, planting charges, and destroying infrastructure",
  },
  {
    id: "surveillance",
    characterClass: "spectre",
    label: "Surveillance",
    description:
      "Monitoring targets, gathering intel, and counter-surveillance",
  },
  {
    id: "system-cracking",
    characterClass: "wirehead",
    label: "System Cracking",
    description:
      "Breaking into secure networks and overriding digital defenses",
  },
  {
    id: "data-mining",
    characterClass: "wirehead",
    label: "Data Mining",
    description:
      "Extracting, decrypting, and analyzing information from systems",
  },
  {
    id: "cybernetics-intrusion",
    characterClass: "wirehead",
    label: "Cybernetics Intrusion",
    description: "Hacking augmentations and neural implants in hostile targets",
  },
  {
    id: "human-systems",
    characterClass: "fixer",
    label: "Human Systems",
    description: "Field medicine, trauma care, and biological repair",
  },
  {
    id: "field-systems-tech",
    characterClass: "fixer",
    label: "Field Systems Tech",
    description: "Repairing gear, jury-rigging equipment, and Bricolage",
  },
  {
    id: "clocksmith-ai",
    characterClass: "fixer",
    label: "Clocksmith (AI)",
    description:
      "Programming, maintaining, and negotiating with artificial intelligences",
  },
  {
    id: "deadeye",
    characterClass: "operator",
    label: "Deadeye",
    description: "Precision shooting at range, called shots, and overwatch",
  },
  {
    id: "target-acquisition",
    characterClass: "operator",
    label: "Target Acquisition",
    description:
      "Marking targets, calculating trajectories, and coordinating fire",
  },
  {
    id: "field-support",
    characterClass: "operator",
    label: "Field Support",
    description:
      "Providing suppressive fire, area denial, and tactical coordination",
  },
  {
    id: "negotiation",
    characterClass: "broker",
    label: "Negotiation",
    description:
      "Brokering deals, extracting concessions, and defusing standoffs",
  },
  {
    id: "impersonation",
    characterClass: "broker",
    label: "Impersonation",
    description:
      "Assuming false identities and blending into hostile social environments",
  },
  {
    id: "influence-peddling",
    characterClass: "broker",
    label: "Influence Peddling",
    description:
      "Leveraging contacts, favors, and blackmail to move the needle",
  },
  {
    id: "vehicle-handling",
    characterClass: "pilot",
    label: "Vehicle Handling",
    description:
      "Operating ground, air, and space vehicles under combat conditions",
  },
  {
    id: "logistics",
    characterClass: "pilot",
    label: "Logistics",
    description: "Managing supply chains, routes, and extraction plans",
  },
  {
    id: "sensors-countermeasures",
    characterClass: "pilot",
    label: "Sensors & Countermeasures",
    description: "Operating detection systems and deploying electronic warfare",
  },
] as const;
export {
  actionPool,
  emptyHarm,
  HARM_TYPES,
  type HarmSlot,
  type HarmType,
} from "../../../../packages/design-system/src/components/character-harm";

import {
  emptyHarm,
  HARM_TYPES,
  type HarmSlot,
} from "../../../../packages/design-system/src/components/character-harm";

export type PlaygroundSheet = {
  version: 3;
  characterClass: string | null;
  skills: string[];
  harm: HarmSlot[];
  name: string;
  callsign: string;
  bmg: BmgValues;
  binding: Record<Attribute, number | null>;
};

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export function emptySheet(): PlaygroundSheet {
  return {
    version: 3,
    characterClass: null,
    skills: [],
    harm: [emptyHarm(), emptyHarm(), emptyHarm()],
    name: "",
    callsign: "",
    binding: { body: 0, mind: 0, ghost: 0 },
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
  if (
    candidate.version !== 1 &&
    candidate.version !== 2 &&
    candidate.version !== 3
  )
    return { ok: false, error: "This sheet link uses an unsupported version." };
  if (
    typeof candidate.name !== "string" ||
    typeof candidate.callsign !== "string"
  )
    return { ok: false, error: "Name and callsign must be text." };
  const checked = validateBmg(candidate.bmg);
  if (!checked.ok) return { ok: false, error: checked.message };
  const sheet = emptySheet();
  if (candidate.version === 3) {
    if (
      candidate.characterClass !== null &&
      !CHARACTER_CLASSES.some((item) => item.id === candidate.characterClass)
    )
      return {
        ok: false,
        error: "Choose a supported Class or leave it blank.",
      };
    if (
      !Array.isArray(candidate.skills) ||
      candidate.skills.some(
        (skill) => !CHARACTER_SKILLS.some((item) => item.id === skill),
      ) ||
      new Set(candidate.skills).size !== candidate.skills.length
    )
      return {
        ok: false,
        error: "Skills must be unique choices from the Class lists.",
      };
    if (!Array.isArray(candidate.harm) || candidate.harm.length !== 3)
      return {
        ok: false,
        error: "A sheet must contain exactly three Harm slots.",
      };
    const harm: HarmSlot[] = [];
    for (const slot of candidate.harm) {
      if (!slot || typeof slot !== "object" || Array.isArray(slot))
        return {
          ok: false,
          error: "This sheet contains an invalid Harm slot.",
        };
      if (
        slot.state === "empty" &&
        slot.type === null &&
        slot.description === ""
      )
        harm.push(emptyHarm());
      else if (
        (slot.state === "transient" || slot.state === "permanent") &&
        HARM_TYPES.includes(slot.type) &&
        typeof slot.description === "string"
      )
        harm.push({
          state: slot.state,
          type: slot.type,
          description: slot.description,
        });
      else
        return {
          ok: false,
          error: "Each Harm slot needs a valid state, type and description.",
        };
    }
    sheet.characterClass = candidate.characterClass as string | null;
    sheet.skills = [...candidate.skills];
    sheet.harm = harm;
  }
  sheet.name = candidate.name;
  sheet.callsign = candidate.callsign;
  const binding = candidate.binding;
  if (
    candidate.version !== 1 &&
    (!binding || typeof binding !== "object" || Array.isArray(binding))
  )
    return { ok: false, error: "This sheet is missing its Binding values." };
  for (const attribute of ATTRIBUTES) {
    const { current, base } = checked.value[attribute];
    sheet.bmg[attribute] = { current, base };
    // Spent Current cannot tell us the loadout's Binding in an older link.
    const bound =
      candidate.version === 1
        ? null
        : (binding as Record<string, unknown>)[attribute];
    if (!isAttributeNumber(bound))
      return {
        ok: false,
        error: `${ATTRIBUTE_LABELS[attribute]} Binding must be a nonnegative safe integer or blank.`,
      };
    if (base !== null && bound !== null && bound > base)
      return {
        ok: false,
        error: `${ATTRIBUTE_LABELS[attribute]} Binding cannot exceed Base.`,
      };
    sheet.binding[attribute] = bound;
  }
  return { ok: true, value: sheet };
}

/** Restore the unbound pools without changing identity, Base, or loadout. */
export function takeDowntime(input: unknown): Result<PlaygroundSheet> {
  const checked = validateSheet(input);
  if (!checked.ok) return checked;
  const sheet = checked.value;
  for (const attribute of ATTRIBUTES) {
    const base = sheet.bmg[attribute].base;
    const binding = sheet.binding[attribute];
    if (base === null || binding === null)
      return {
        ok: false,
        error:
          "Set Base and Binding for all three attributes in Settings before taking Downtime.",
      };
    sheet.bmg[attribute].current = base - binding;
  }
  sheet.harm = sheet.harm.map((slot) =>
    slot.state === "transient" ? emptyHarm() : slot,
  );
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
  skill: string;
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
    skill: "vehicle-handling",
    configuration: "Outside Tiger",
    source: "/scenarios/northern-lights/c-01-the-pilot/",
    base: [6, 12, 8],
    current: [4, 10, 5],
  },
  {
    id: "vantage",
    callsign: "Vantage",
    role: "Operator",
    skill: "deadeye",
    configuration: "Heavy overwatch: Wraith and railgun",
    source: "/scenarios/northern-lights/c-02-the-operator/",
    base: [12, 6, 8],
    current: [7, 6, 1],
  },
  {
    id: "root",
    callsign: "Root",
    role: "Wirehead",
    skill: "system-cracking",
    configuration: "Listed loadout, before additional software",
    source: "/scenarios/northern-lights/c-03-the-wirehead/",
    base: [6, 8, 12],
    current: [1, 8, 7],
  },
  {
    id: "stitch",
    callsign: "Stitch",
    role: "Fixer",
    skill: "human-systems",
    configuration: "Havoc, Threat-Assessment inactive",
    source: "/scenarios/northern-lights/c-04-the-fixer/",
    base: [8, 12, 6],
    current: [8, 11, 3],
  },
  {
    id: "sable",
    callsign: "Sable",
    role: "Spectre",
    skill: "infiltration",
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
  sheet.characterClass = preset.role.toLowerCase();
  sheet.skills = [preset.skill];
  for (const [index, attribute] of (
    ["body", "mind", "ghost"] as const
  ).entries()) {
    sheet.bmg[attribute] = {
      current: preset.current[index],
      base: preset.base[index],
    };
    sheet.binding[attribute] = preset.base[index] - preset.current[index];
  }
  return { ok: true, value: sheet };
}
