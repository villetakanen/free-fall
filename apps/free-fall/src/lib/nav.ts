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
  { category: "exo", slug: "exos", label: "Exoskeletons" },
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

export type ScenarioSection = {
  section: string;
  icon?: string;
  pages: { file: string; label: string; href: string }[];
};

/**
 * A scenario's navigation structure, resolved from the optional `contents`
 * manifest in its index.md frontmatter: sections and page order exactly as
 * declared. Pages on disk not listed in the manifest collect into a trailing
 * "Assorted" section, alphabetical by filename — a scenario without a
 * manifest is just the degenerate case where every page is unlisted.
 * A manifest entry naming a page that does not exist fails the build.
 * Single source for both the scoped rail and the overview's table of
 * contents so the two cannot diverge.
 * Spec: specs/content-scenarios/spec.md#navigation
 */
export async function getScenarioContents(
  slug: string,
): Promise<ScenarioSection[]> {
  const scenario = (await getCollection("scenarios")).find(
    (e) => e.id.split("/")[0] === slug,
  );

  const pages = (await getCollection("scenario-pages"))
    .filter((p) => p.id.split("/")[0] === slug)
    .map((p) => {
      const file = p.id.split("/")[1];
      return {
        file,
        label: p.data.title,
        href: `/scenarios/${slug}/${file}/`,
      };
    });

  const byFile = new Map(pages.map((p) => [p.file, p]));
  const placed = new Set<string>();

  const sections: ScenarioSection[] = (scenario?.data.contents ?? []).map(
    (decl) => ({
      section: decl.section,
      icon: decl.icon,
      pages: decl.pages.map((file) => {
        const page = byFile.get(file);
        if (!page) {
          throw new Error(
            `Scenario "${slug}": contents section "${decl.section}" lists unknown page "${file}"`,
          );
        }
        placed.add(file);
        return page;
      }),
    }),
  );

  const unplaced = pages
    .filter((p) => !placed.has(p.file))
    .sort((a, b) => a.file.localeCompare(b.file));
  if (unplaced.length > 0) {
    sections.push({ section: "Assorted", pages: unplaced });
  }

  return sections;
}

/**
 * Scenario subsite rail: uplink + the scenario's own pages, scoped to one
 * scenario. Used by BaseLayout when the route is inside a scenario.
 * Spec: specs/content-scenarios/spec.md#navigation
 */
export async function getScenarioSubsiteNav(slug: string, pathname: string) {
  const scenario = (await getCollection("scenarios")).find(
    (e) => e.id.split("/")[0] === slug,
  );
  const overviewHref = `/scenarios/${slug}/`;

  const sections = await getScenarioContents(slug);

  type SubItem = { label: string; href: string; active: boolean };
  type NavItem = {
    icon: string;
    label: string;
    href: string;
    active: boolean;
    variant?: "nav" | "uplink";
    subItems?: SubItem[];
  };

  return [
    {
      icon: "arrow_back",
      label: "All Scenarios",
      href: "/scenarios/",
      active: false,
      variant: "uplink",
    },
    {
      icon: "map",
      label: scenario?.data.title ?? "Overview",
      href: overviewHref,
      active: pathname === overviewHref,
    },
    // One group per section: anchored on its first page (top-level tray
    // items must be links — issue #42), pages as sub-links.
    ...sections.map(
      (s): NavItem => ({
        icon: s.icon ?? "menu_book",
        label: s.section,
        href: s.pages[0].href,
        active: s.pages.some((p) => pathname === p.href),
        subItems: s.pages.map((p) => ({
          label: p.label,
          href: p.href,
          active: pathname === p.href,
        })),
      }),
    ),
  ];
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
