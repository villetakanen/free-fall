import { describe, expect, it } from "vitest";
import {
  ATTRIBUTES,
  adjustCurrent,
  type BmgValues,
  CONVERSIONS,
  convertBmg,
  setAttributeValue,
  validateBmg,
} from "./character-attributes";

const snapshot = (): BmgValues => ({
  body: { current: 12, base: 12 },
  mind: { current: 6, base: null },
  ghost: { current: 8, base: 4 },
});

describe("character attribute operations", () => {
  it.each(
    CONVERSIONS,
  )("converts $id atomically without mutation or a Base cap", (route) => {
    const value = snapshot();
    for (const pair of Object.values(value)) Object.freeze(pair);
    Object.freeze(value);
    const result = convertBmg(value, route.id);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.message);
    for (const attribute of ATTRIBUTES) {
      const delta =
        attribute === route.source
          ? -2
          : attribute === route.destination
            ? 1
            : 0;
      expect(result.value[attribute].current).toBe(
        (value[attribute].current as number) + delta,
      );
      expect(result.value[attribute].base).toBe(value[attribute].base);
    }
    expect(value).toEqual(snapshot());
  });

  it("uses the latest committed snapshot for repeated transfers", () => {
    let value = snapshot();
    value.ghost.current = 3;
    for (let i = 0; i < 20; i++) {
      const result = convertBmg(value, "ghost-to-body");
      if (result.ok) value = result.value;
      else expect(result.reason).toBe("insufficient-source");
    }
    expect(value.ghost.current).toBe(1);
    expect(value.body.current).toBe(13);
  });

  it.each([
    "body-to-ghost",
    "body-to-mind",
    "mind-to-ghost",
    "toString",
    "",
  ])("rejects unsupported direction %s", (direction) => {
    expect(convertBmg(snapshot(), direction)).toMatchObject({
      ok: false,
      reason: "unsupported-direction",
    });
  });

  it.each([
    null,
    0,
    1,
    Number.MAX_SAFE_INTEGER,
  ])("handles the conversion boundary %s", (boundary) => {
    const value = snapshot();
    if (boundary === Number.MAX_SAFE_INTEGER) value.body.current = boundary;
    else value.ghost.current = boundary;
    const before = structuredClone(value);
    expect(convertBmg(value, "ghost-to-body")).toMatchObject({
      ok: false,
      reason:
        boundary === null
          ? "unfilled-current"
          : boundary === Number.MAX_SAFE_INTEGER
            ? "overflow"
            : "insufficient-source",
    });
    expect(value).toEqual(before);
  });

  it("rejects unfilled destination but permits an unfilled Base", () => {
    const value = snapshot();
    expect(convertBmg(value, "ghost-to-mind").ok).toBe(true);
    value.mind.current = null;
    expect(convertBmg(value, "ghost-to-mind")).toMatchObject({
      ok: false,
      reason: "unfilled-current",
    });
  });

  it.each([
    -1,
    0.5,
    NaN,
    Infinity,
    Number.MAX_SAFE_INTEGER + 1,
    "8",
    undefined,
  ])("rejects invalid numeric input %s without changing the snapshot", (invalid) => {
    const value = snapshot();
    expect(setAttributeValue(value, "ghost", "current", invalid)).toMatchObject(
      { ok: false, reason: "invalid-input" },
    );
    expect(setAttributeValue(value, "ghost", "base", invalid)).toMatchObject({
      ok: false,
      reason: "invalid-input",
    });
    expect(
      validateBmg({ ...value, ghost: { current: invalid, base: 12 } }),
    ).toMatchObject({ ok: false, reason: "invalid-input" });
    expect(
      convertBmg(
        { ...value, ghost: { current: 12, base: invalid } },
        "ghost-to-body",
      ),
    ).toMatchObject({ ok: false, reason: "invalid-input" });
    expect(value).toEqual(snapshot());
  });

  it.each([
    null,
    {},
    [],
    { body: null },
  ])("rejects malformed snapshots", (value) => {
    expect(validateBmg(value).ok).toBe(false);
  });

  it("changes Base independently and preserves null and zero", () => {
    const value = snapshot();
    const base = setAttributeValue(value, "body", "base", 0);
    expect(base).toEqual({
      ok: true,
      value: { ...value, body: { current: 12, base: 0 } },
    });
    const current = setAttributeValue(value, "ghost", "current", null);
    expect(current).toEqual({
      ok: true,
      value: { ...value, ghost: { current: null, base: 4 } },
    });
    expect(value).toEqual(snapshot());
  });

  it("adjusts only by one within safe integer boundaries", () => {
    expect(adjustCurrent(12, 1)).toEqual({ ok: true, value: 13 });
    expect(adjustCurrent(1, -1)).toEqual({ ok: true, value: 0 });
    expect(adjustCurrent(0, -1)).toMatchObject({
      ok: false,
      reason: "insufficient-source",
    });
    expect(adjustCurrent(null, 1)).toMatchObject({
      ok: false,
      reason: "unfilled-current",
    });
    expect(adjustCurrent(Number.MAX_SAFE_INTEGER, 1)).toMatchObject({
      ok: false,
      reason: "overflow",
    });
    expect(adjustCurrent(Number.MAX_SAFE_INTEGER, -1)).toEqual({
      ok: true,
      value: Number.MAX_SAFE_INTEGER - 1,
    });
  });
});
