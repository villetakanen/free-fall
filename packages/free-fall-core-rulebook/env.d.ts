/// <reference types="astro/client" />

declare module "*.md" {
  import type { MarkdownInstance } from "astro";
  const content: MarkdownInstance<Record<string, unknown>>["Content"];
  export const Content: typeof content;
  export const frontmatter: Record<string, unknown>;
}
