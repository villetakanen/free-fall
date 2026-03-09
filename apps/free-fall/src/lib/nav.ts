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
