import { getCollection } from "astro:content";

export async function getCoreRulebookNavItems(pathname: string) {
  const entries = (await getCollection("core-rulebook")).sort(
    (a, b) =>
      (a.data.order ?? Number.POSITIVE_INFINITY) -
      (b.data.order ?? Number.POSITIVE_INFINITY),
  );

  return entries.map((entry) => ({
    label: entry.data.title,
    href: `/core-rulebook/${entry.id}/`,
    active: pathname === `/core-rulebook/${entry.id}/`,
  }));
}

/** Maps frontmatter category values to route segments and display labels. */
export const gearCategories = [
  { category: "weapon", slug: "weapons", label: "Weapons" },
  { category: "armor", slug: "armor", label: "Armor" },
  { category: "augmentation", slug: "augmentations", label: "Augmentations" },
  { category: "utility", slug: "utility", label: "Utility" },
  { category: "vehicle", slug: "vehicles", label: "Vehicles" },
] as const;

/**
 * Rail item for the scenarios collection: always present, linking to the
 * /scenarios/ listing, with one subItem per scenario.
 * Spec: specs/content-scenarios/spec.md#navigation
 */
export async function getScenarioNavItems(pathname: string) {
  const entries = (await getCollection("scenarios")).sort(
    (a, b) =>
      (a.data.order ?? Number.POSITIVE_INFINITY) -
        (b.data.order ?? Number.POSITIVE_INFINITY) ||
      a.data.title.localeCompare(b.data.title),
  );

  const subItems = entries.map((entry) => {
    const slug = entry.id.split("/")[0];
    return {
      label: entry.data.title,
      href: `/scenarios/${slug}/`,
      active: pathname.startsWith(`/scenarios/${slug}/`),
    };
  });

  return {
    icon: "map",
    label: "Scenarios",
    href: "/scenarios/",
    active: pathname.startsWith("/scenarios/"),
    subItems,
  };
}

/**
 * Scenario subsite rail: uplink + the scenario's own pages, scoped to one
 * scenario. Used by BaseLayout when the route is inside a scenario.
 * Page classification is by filename prefix: index = overview, leading
 * digit = body page (scenes), leading letter = appendix.
 * Spec: specs/content-scenarios/spec.md#navigation
 */
export async function getScenarioSubsiteNav(slug: string, pathname: string) {
  const scenario = (await getCollection("scenarios")).find(
    (e) => e.id.split("/")[0] === slug,
  );
  const overviewHref = `/scenarios/${slug}/`;

  const pages = (await getCollection("scenario-pages"))
    .filter((p) => p.id.split("/")[0] === slug)
    .sort(
      (a, b) =>
        (a.data.order ?? Number.POSITIVE_INFINITY) -
          (b.data.order ?? Number.POSITIVE_INFINITY) ||
        a.id.localeCompare(b.id),
    )
    .map((p) => {
      const file = p.id.split("/")[1];
      const href = `/scenarios/${slug}/${file}/`;
      return {
        file,
        label: p.data.title,
        href,
        active: pathname === href,
        isAppendix: /^[a-z]/i.test(file),
      };
    });

  const bodyItems = pages
    .filter((p) => !p.isAppendix)
    .map((p) => ({
      icon: "article",
      label: p.label,
      href: p.href,
      active: p.active,
    }));

  const appendices = pages.filter((p) => p.isAppendix);

  type SubItem = { label: string; href: string; active: boolean };
  type NavItem = {
    icon: string;
    label: string;
    href: string;
    active: boolean;
    subItems?: SubItem[];
  };

  const nav: NavItem[] = [
    {
      icon: "arrow_back",
      label: "All Scenarios",
      href: "/scenarios/",
      active: false,
    },
    {
      icon: "map",
      label: scenario?.data.title ?? "Overview",
      href: overviewHref,
      active: pathname === overviewHref,
    },
    ...bodyItems,
  ];

  if (appendices.length > 0) {
    nav.push({
      icon: "menu_book",
      label: "Appendices",
      href: appendices[0].href,
      active: appendices.some((p) => p.active),
      subItems: appendices.map((p) => ({
        label: p.label,
        href: p.href,
        active: p.active,
      })),
    });
  }

  return nav;
}

export async function getGearNavItems(pathname: string) {
  const entries = await getCollection("gear");
  const categorySet = new Set(entries.map((e) => e.data.category));

  const subItems = gearCategories
    .filter((c) => categorySet.has(c.category))
    .map((c) => ({
      label: c.label,
      href: `/gear/${c.slug}/`,
      active: pathname === `/gear/${c.slug}/`,
    }));

  return {
    icon: "handyman",
    label: "Gear",
    href: `/gear/${gearCategories[0].slug}/`,
    active: pathname.startsWith("/gear/"),
    subItems,
  };
}
