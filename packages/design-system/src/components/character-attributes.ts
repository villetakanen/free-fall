/** Serializable sheet values. Base is a reference, never a Current ceiling. */
export const ATTRIBUTES = ["ghost", "mind", "body"] as const;
export type Attribute = (typeof ATTRIBUTES)[number];
export type AttributeValue = { current: number | null; base: number | null };
export type BmgValues = Record<Attribute, AttributeValue>;
export type Conversion = "ghost-to-mind" | "ghost-to-body" | "mind-to-body";
export type BmgChange =
  | { type: "adjust"; attribute: Attribute; delta: 1 | -1 }
  | { type: "convert"; conversion: Conversion };
export type FailureReason =
  | "invalid-input"
  | "unsupported-direction"
  | "unfilled-current"
  | "insufficient-source"
  | "overflow";
export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; reason: FailureReason; message: string };

export const ATTRIBUTE_LABELS: Record<Attribute, string> = {
  body: "Body",
  mind: "Mind",
  ghost: "Ghost",
};
export const CONVERSIONS: ReadonlyArray<{
  id: Conversion;
  source: Attribute;
  destination: Attribute;
}> = [
  { id: "ghost-to-mind", source: "ghost", destination: "mind" },
  { id: "ghost-to-body", source: "ghost", destination: "body" },
  { id: "mind-to-body", source: "mind", destination: "body" },
];

function failure(reason: FailureReason, message: string): Result<never> {
  return { ok: false, reason, message };
}

export function isAttributeNumber(value: unknown): value is number | null {
  return (
    value === null || (Number.isSafeInteger(value) && (value as number) >= 0)
  );
}

export function validateBmg(value: unknown): Result<BmgValues> {
  if (typeof value !== "object" || value === null) {
    return failure(
      "invalid-input",
      "Expected a Body, Mind, and Ghost snapshot.",
    );
  }
  for (const attribute of ATTRIBUTES) {
    const pair = (value as Record<string, unknown>)[attribute];
    if (typeof pair !== "object" || pair === null) {
      return failure(
        "invalid-input",
        `${ATTRIBUTE_LABELS[attribute]} is missing.`,
      );
    }
    for (const field of ["current", "base"] as const) {
      if (!isAttributeNumber((pair as Record<string, unknown>)[field])) {
        return failure(
          "invalid-input",
          `${ATTRIBUTE_LABELS[attribute]} ${field} must be a nonnegative safe integer or null.`,
        );
      }
    }
  }
  return { ok: true, value: value as BmgValues };
}

export function adjustCurrent(current: unknown, delta: 1 | -1): Result<number> {
  if (!isAttributeNumber(current) || (delta !== 1 && delta !== -1)) {
    return failure(
      "invalid-input",
      "Current must be a nonnegative safe integer or null; adjustment must be +1 or −1.",
    );
  }
  if (current === null)
    return failure("unfilled-current", "Fill Current before adjusting it.");
  if (current === 0 && delta === -1)
    return failure("insufficient-source", "Current is already zero.");
  if (current === Number.MAX_SAFE_INTEGER && delta === 1)
    return failure("overflow", "Current is at the largest safe integer.");
  return { ok: true, value: current + delta };
}

function copyValues(value: BmgValues): BmgValues {
  return {
    body: { ...value.body },
    mind: { ...value.mind },
    ghost: { ...value.ghost },
  };
}

/** Use for external editors, imports, or scripts; rejects an invalid update atomically. */
export function setAttributeValue(
  input: unknown,
  attribute: Attribute,
  field: keyof AttributeValue,
  next: unknown,
): Result<BmgValues> {
  const checked = validateBmg(input);
  if (!checked.ok) return checked;
  if (
    !ATTRIBUTES.includes(attribute) ||
    (field !== "current" && field !== "base") ||
    !isAttributeNumber(next)
  ) {
    return failure(
      "invalid-input",
      "Expected a known attribute, Current or Base, and a nonnegative safe integer or null.",
    );
  }
  const value = copyValues(checked.value);
  value[attribute][field] = next;
  return { ok: true, value };
}

/** A conversion spends two and grants one, without consulting or changing Base. */
export function convertBmg(
  input: unknown,
  direction: string,
): Result<BmgValues> {
  const checked = validateBmg(input);
  if (!checked.ok) return checked;
  const route = CONVERSIONS.find((item) => item.id === direction);
  if (!route)
    return failure(
      "unsupported-direction",
      "This conversion direction is not supported.",
    );
  const source = checked.value[route.source].current;
  const destination = checked.value[route.destination].current;
  if (source === null || destination === null) {
    return failure(
      "unfilled-current",
      `Fill ${ATTRIBUTE_LABELS[route.source]} and ${ATTRIBUTE_LABELS[route.destination]} Current first.`,
    );
  }
  if (source < 2)
    return failure(
      "insufficient-source",
      `${ATTRIBUTE_LABELS[route.source]} needs at least 2 Current.`,
    );
  if (destination === Number.MAX_SAFE_INTEGER)
    return failure(
      "overflow",
      `${ATTRIBUTE_LABELS[route.destination]} Current is at the largest safe integer.`,
    );
  const value = copyValues(checked.value);
  value[route.source].current = source - 2;
  value[route.destination].current = destination + 1;
  return { ok: true, value };
}
