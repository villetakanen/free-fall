import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const rules = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/rules" }),
  schema: z.object({
    title: z.string(),
    order: z.number().optional(),
  }),
});

const coreRulebook = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "../../content/core-rulebook/chapters",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().optional(),
  }),
});

export const collections = { rules, "core-rulebook": coreRulebook };
