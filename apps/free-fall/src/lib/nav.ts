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
