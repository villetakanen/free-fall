import { describe, expect, it } from "vitest";

/**
 * StatCircle is an Astro component — we can't render it in vitest.
 * These tests verify the prop→state derivation logic that lives in
 * the component's frontmatter. The logic is duplicated here to keep
 * it testable; if the component logic changes, these tests must too.
 *
 * Rendered output is verified by the Playwright e2e suite in
 * apps/design-system/e2e/stat-circle.test.ts.
 */

// ── Replicated component logic ────────────────────────────────────

interface Props {
  type: "body" | "mind" | "ghost";
  attribute?: string;
  value: number | null;
  disabled?: boolean;
  bound?: boolean;
}

function deriveState(props: Props) {
  const { type, attribute, value, disabled, bound } = props;
  const isDisabled = disabled || value === null;
  const isBound = !isDisabled && bound;
  const displayLabel = attribute
    ? attribute.slice(0, 5).toUpperCase()
    : undefined;
  const displayValue = isDisabled ? "\u2205" : value;

  const circleClass = [
    "stat-circle",
    isDisabled ? "stat-circle--disabled" : `stat-circle--${type}`,
    isBound ? "stat-circle--bound" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const wrapClass = [
    "stat-circle-wrap",
    attribute ? "stat-circle-wrap--labeled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    isDisabled,
    isBound,
    displayLabel,
    displayValue,
    circleClass,
    wrapClass,
    title: attribute ?? type,
  };
}

// ── Tests ─────────────────────────────────────────────────────────

describe("StatCircle state derivation", () => {
  describe("disabled resolution", () => {
    it("value=null implies disabled", () => {
      const s = deriveState({ type: "body", value: null });
      expect(s.isDisabled).toBe(true);
      expect(s.displayValue).toBe("\u2205");
    });

    it("explicit disabled=true implies disabled", () => {
      const s = deriveState({ type: "mind", value: 3, disabled: true });
      expect(s.isDisabled).toBe(true);
      expect(s.displayValue).toBe("\u2205");
    });

    it("value=null and disabled=true are equivalent", () => {
      const a = deriveState({ type: "body", value: null });
      const b = deriveState({ type: "body", value: 2, disabled: true });
      expect(a.isDisabled).toBe(b.isDisabled);
      expect(a.displayValue).toBe(b.displayValue);
      expect(a.circleClass).toBe(b.circleClass);
    });

    it("value=0 is NOT disabled", () => {
      const s = deriveState({ type: "ghost", value: 0 });
      expect(s.isDisabled).toBe(false);
      expect(s.displayValue).toBe(0);
    });

    it("positive value without disabled flag is active", () => {
      const s = deriveState({ type: "body", value: 2 });
      expect(s.isDisabled).toBe(false);
      expect(s.displayValue).toBe(2);
    });
  });

  describe("bound resolution", () => {
    it("bound=true on active circle sets isBound", () => {
      const s = deriveState({ type: "body", value: 2, bound: true });
      expect(s.isBound).toBe(true);
    });

    it("disabled ignores bound (value=null)", () => {
      const s = deriveState({ type: "mind", value: null, bound: true });
      expect(s.isBound).toBe(false);
    });

    it("disabled ignores bound (explicit disabled)", () => {
      const s = deriveState({
        type: "ghost",
        value: 3,
        disabled: true,
        bound: true,
      });
      expect(s.isBound).toBe(false);
    });

    it("bound defaults to falsy when omitted", () => {
      const s = deriveState({ type: "body", value: 1 });
      expect(s.isBound).toBeFalsy();
    });
  });

  describe("label derivation", () => {
    it("no attribute means no label", () => {
      const s = deriveState({ type: "body", value: 1 });
      expect(s.displayLabel).toBeUndefined();
    });

    it("attribute is uppercased", () => {
      const s = deriveState({ type: "body", attribute: "Body", value: 1 });
      expect(s.displayLabel).toBe("BODY");
    });

    it("attribute is truncated to 5 chars", () => {
      const s = deriveState({ type: "mind", attribute: "Systems", value: 6 });
      expect(s.displayLabel).toBe("SYSTE");
    });

    it("short attribute is not padded", () => {
      const s = deriveState({ type: "body", attribute: "Frm", value: 24 });
      expect(s.displayLabel).toBe("FRM");
    });

    it("exactly 5 chars passes through", () => {
      const s = deriveState({ type: "ghost", attribute: "Ghost", value: 3 });
      expect(s.displayLabel).toBe("GHOST");
    });

    it("label renders even when disabled", () => {
      const s = deriveState({
        type: "body",
        attribute: "Body",
        value: null,
      });
      expect(s.displayLabel).toBe("BODY");
    });
  });

  describe("CSS class composition", () => {
    it("active body circle gets type class", () => {
      const s = deriveState({ type: "body", value: 2 });
      expect(s.circleClass).toBe("stat-circle stat-circle--body");
    });

    it("active mind circle gets type class", () => {
      const s = deriveState({ type: "mind", value: 1 });
      expect(s.circleClass).toBe("stat-circle stat-circle--mind");
    });

    it("active ghost circle gets type class", () => {
      const s = deriveState({ type: "ghost", value: 3 });
      expect(s.circleClass).toBe("stat-circle stat-circle--ghost");
    });

    it("disabled circle gets disabled class regardless of type", () => {
      const s = deriveState({ type: "body", value: null });
      expect(s.circleClass).toBe("stat-circle stat-circle--disabled");
    });

    it("bound circle gets both type and bound classes", () => {
      const s = deriveState({ type: "body", value: 2, bound: true });
      expect(s.circleClass).toBe(
        "stat-circle stat-circle--body stat-circle--bound",
      );
    });

    it("disabled+bound circle gets only disabled class", () => {
      const s = deriveState({
        type: "mind",
        value: null,
        bound: true,
      });
      expect(s.circleClass).toBe("stat-circle stat-circle--disabled");
    });

    it("wrap has labeled modifier when attribute is set", () => {
      const s = deriveState({ type: "body", attribute: "Body", value: 2 });
      expect(s.wrapClass).toBe("stat-circle-wrap stat-circle-wrap--labeled");
    });

    it("wrap has no labeled modifier without attribute", () => {
      const s = deriveState({ type: "body", value: 2 });
      expect(s.wrapClass).toBe("stat-circle-wrap");
    });
  });

  describe("title attribute", () => {
    it("uses attribute when provided", () => {
      const s = deriveState({ type: "body", attribute: "Frame", value: 24 });
      expect(s.title).toBe("Frame");
    });

    it("falls back to type when no attribute", () => {
      const s = deriveState({ type: "ghost", value: 3 });
      expect(s.title).toBe("ghost");
    });
  });

  describe("display value edge cases", () => {
    it("renders 0 as 0", () => {
      const s = deriveState({ type: "body", value: 0 });
      expect(s.displayValue).toBe(0);
    });

    it("renders large value (36)", () => {
      const s = deriveState({ type: "body", value: 36 });
      expect(s.displayValue).toBe(36);
    });

    it("renders 1 as 1", () => {
      const s = deriveState({ type: "mind", value: 1 });
      expect(s.displayValue).toBe(1);
    });
  });
});
