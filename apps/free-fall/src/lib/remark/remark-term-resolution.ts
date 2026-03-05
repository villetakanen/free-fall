import { readFileSync } from "node:fs";
import type { Root } from "mdast";
import type { TextDirective } from "mdast-util-directive";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";

export interface TermResolutionOptions {
  /** Filesystem path to the content package's chapters directory */
  registryPath: string;
  /** Guard: only process files whose path contains this substring */
  contentPath: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

function buildTermIndex(registryPath: string): Set<string> {
  let content: string;
  try {
    content = readFileSync(registryPath, "utf-8");
  } catch {
    throw new Error(
      `[remark-term-resolution] Registry not found: ${registryPath}`,
    );
  }

  const index = new Set<string>();
  const dfnPattern = /<dfn\s+id="([^"]+)">/g;
  for (const match of content.matchAll(dfnPattern)) {
    index.add(match[1]);
  }
  return index;
}

export const remarkTermResolution: Plugin<[TermResolutionOptions], Root> = (
  options,
) => {
  const { registryPath, contentPath } = options;
  const termIndex = buildTermIndex(registryPath);

  return (tree: Root, file: VFile) => {
    if (!file.path || !file.path.includes(contentPath)) {
      return;
    }

    visit(tree, "textDirective", (node: TextDirective) => {
      if (node.name !== "term") return;

      const label =
        node.children
          .map((child) => ("value" in child ? child.value : ""))
          .join("") || "";

      if (!label) return;

      const slug = slugify(label);

      if (!termIndex.has(slug)) {
        const position = node.position
          ? ` (line ${node.position.start.line})`
          : "";
        throw new Error(
          `[remark-term-resolution] Unresolved term "${label}" (slug: "${slug}") in ${file.path}${position}. Add <dfn id="${slug}"> to the registry.`,
        );
      }

      if (!node.data) node.data = {};
      const data = node.data;
      data.hName = "a";
      data.hProperties = {
        href: `./registry#${slug}`,
        class: "game-term",
        "data-term-key": slug,
        rel: "glossary",
      };
    });
  };
};
