export type NavModel = {
  scope: "global" | "subsite";
  label: string;
  items: NavNode[];
};

export type NavNode = NavLink | NavGroup | NavUplink;

export type NavLink = {
  kind: "link";
  icon: string;
  label: string;
  href: string;
  match?: "exact" | "prefix";
  matchPath?: string;
  children?: NavNode[];
};

export type NavGroup = {
  kind: "group";
  icon?: string;
  label: string;
  children: NavNode[];
};

export type NavUplink = {
  kind: "uplink";
  icon?: string;
  label: string;
  href: string;
};

export type RenderNavModel = Omit<NavModel, "items"> & {
  items: RenderNavNode[];
};

export type RenderNavNode = RenderNavLink | RenderNavGroup | RenderNavUplink;

export type RenderNavLink = Omit<NavLink, "children"> & {
  active: boolean;
  current: boolean;
  children?: RenderNavNode[];
};

export type RenderNavGroup = Omit<NavGroup, "children"> & {
  active: boolean;
  children: RenderNavNode[];
};

export type RenderNavUplink = NavUplink & {
  active: false;
  current: false;
};

const asPrefixPath = (path: string) => (path.endsWith("/") ? path : `${path}/`);

const matchesPath = (link: NavLink, pathname: string) => {
  const matchPath = link.matchPath ?? link.href;

  if (link.match !== "prefix") {
    return pathname === matchPath;
  }

  const normalizedPathname = asPrefixPath(pathname);
  const normalizedMatchPath = asPrefixPath(matchPath);
  return normalizedPathname.startsWith(normalizedMatchPath);
};

const normalizeNode = (node: NavNode, pathname: string): RenderNavNode => {
  if (node.kind === "uplink") {
    return { ...node, active: false, current: false };
  }

  const children = node.children?.map((child) =>
    normalizeNode(child, pathname),
  );
  const descendantActive = children?.some((child) => child.active) ?? false;

  if (node.kind === "group") {
    return { ...node, active: descendantActive, children: children ?? [] };
  }

  const current = matchesPath(node, pathname);
  const { children: _children, ...link } = node;
  return {
    ...link,
    active: current || descendantActive,
    current,
    ...(children ? { children } : {}),
  };
};

const assertNoNestedUplinks = (nodes: NavNode[], nested = false): void => {
  for (const node of nodes) {
    if (nested && node.kind === "uplink") {
      throw new Error("Navigation uplinks must be top-level nodes");
    }
    if (node.kind !== "uplink" && node.children) {
      assertNoNestedUplinks(node.children, true);
    }
  }
};

export const normalizeNavigation = (
  model: NavModel,
  pathname: string,
): RenderNavModel => {
  assertNoNestedUplinks(model.items);
  const firstActionable = model.items.find((node) => node.kind !== "group");
  if (model.scope === "subsite" && firstActionable?.kind !== "uplink") {
    throw new Error("Subsite navigation must begin with an uplink");
  }

  return {
    ...model,
    items: model.items.map((node) => normalizeNode(node, pathname)),
  };
};
