import { describe, expect, it } from "vitest";
import type { NavModel } from "./navigation";
import { normalizeNavigation } from "./navigation";

const model = (items: NavModel["items"]): NavModel => ({
  scope: "global",
  label: "Test navigation",
  items,
});

describe("normalizeNavigation", () => {
  it("uses exact matching by default", () => {
    const navigation = model([
      { kind: "link", icon: "home", label: "Home", href: "/" },
    ]);

    expect(normalizeNavigation(navigation, "/").items[0]).toMatchObject({
      active: true,
      current: true,
    });
    expect(normalizeNavigation(navigation, "/rules/").items[0]).toMatchObject({
      active: false,
      current: false,
    });
  });

  it("uses matchPath without changing the destination", () => {
    const navigation = model([
      {
        kind: "link",
        icon: "book",
        label: "Rules",
        href: "/rules/introduction/",
        matchPath: "/rules/",
        match: "prefix",
      },
    ]);

    const [link] = normalizeNavigation(navigation, "/rules/combat/").items;
    expect(link).toMatchObject({
      href: "/rules/introduction/",
      active: true,
      current: true,
    });
  });

  it("normalizes trailing slashes for boundary-safe prefix matching", () => {
    const navigation = model([
      {
        kind: "link",
        icon: "category",
        label: "Gear",
        href: "/gear",
        match: "prefix",
      },
    ]);

    expect(normalizeNavigation(navigation, "/gear").items[0].active).toBe(true);
    expect(
      normalizeNavigation(navigation, "/gear/weapons/").items[0].active,
    ).toBe(true);
    expect(normalizeNavigation(navigation, "/gearbox/").items[0].active).toBe(
      false,
    );
  });

  it("propagates descendant activity without marking the parent current", () => {
    const navigation = model([
      {
        kind: "link",
        icon: "book",
        label: "Rules",
        href: "/rules/",
        children: [
          {
            kind: "group",
            label: "Conflict",
            children: [
              {
                kind: "link",
                icon: "article",
                label: "Combat",
                href: "/rules/combat/",
              },
            ],
          },
        ],
      },
    ]);

    const [rules] = normalizeNavigation(navigation, "/rules/combat/").items;
    expect(rules).toMatchObject({ active: true, current: false });
    expect(rules.kind === "link" && rules.children?.[0]).toMatchObject({
      active: true,
    });
  });

  it("never marks uplinks active", () => {
    const navigation = model([
      { kind: "uplink", label: "All scenarios", href: "/scenarios/" },
    ]);

    expect(
      normalizeNavigation(navigation, "/scenarios/").items[0],
    ).toMatchObject({
      active: false,
      current: false,
    });
  });

  it("requires an uplink as the first actionable subsite node", () => {
    const navigation: NavModel = {
      scope: "subsite",
      label: "Scenario navigation",
      items: [
        {
          kind: "link",
          icon: "map",
          label: "Overview",
          href: "/scenarios/example/",
        },
      ],
    };

    expect(() =>
      normalizeNavigation(navigation, "/scenarios/example/"),
    ).toThrow("Subsite navigation must begin with an uplink");
  });

  it("rejects uplinks nested below another node", () => {
    const navigation = model([
      {
        kind: "group",
        label: "Scenario",
        children: [
          { kind: "uplink", label: "All scenarios", href: "/scenarios/" },
        ],
      },
    ]);

    expect(() =>
      normalizeNavigation(navigation, "/scenarios/example/"),
    ).toThrow("Navigation uplinks must be top-level nodes");
  });

  it("returns a new tree without mutating the input", () => {
    const navigation = model([
      {
        kind: "group",
        label: "Rules",
        children: [
          {
            kind: "link",
            icon: "article",
            label: "Combat",
            href: "/rules/combat/",
          },
        ],
      },
    ]);

    const normalized = normalizeNavigation(navigation, "/rules/combat/");
    expect(normalized).not.toBe(navigation);
    expect(normalized.items[0]).not.toBe(navigation.items[0]);
    expect(navigation.items[0]).not.toHaveProperty("active");
  });
});
