import type { Element, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";

export interface ContentUrlRewriteOptions {
  basePath: string;
  contentPath?: string;
}

export const rehypeContentUrlRewrite: Plugin<
  [ContentUrlRewriteOptions],
  Root
> = (options) => {
  const { basePath, contentPath = "/content/" } = options;
  const normalizedBasePath = basePath.endsWith("/") ? basePath : `${basePath}/`;

  return (tree: Root, file: VFile) => {
    if (contentPath && (!file.path || !file.path.includes(contentPath))) {
      return;
    }

    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "a") return;

      const href = node.properties?.href;

      if (
        typeof href !== "string" ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("/") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      if (href.startsWith("#")) return;

      let cleanedHref = href.replace(/^\.\//, "");
      cleanedHref = cleanedHref.replace(/\.md(#.*)?$/, "$1");

      const hashIndex = cleanedHref.indexOf("#");
      let finalHref: string;

      if (hashIndex > -1) {
        let pathPart = cleanedHref.substring(0, hashIndex);
        if (pathPart && !pathPart.endsWith("/")) {
          pathPart += "/";
        }
        const hashPart = cleanedHref.substring(hashIndex);
        finalHref = `${normalizedBasePath}${pathPart}${hashPart}`;
      } else {
        finalHref = `${normalizedBasePath}${cleanedHref}${cleanedHref.endsWith("/") ? "" : "/"}`;
      }

      node.properties.href = finalHref;
    });
  };
};
