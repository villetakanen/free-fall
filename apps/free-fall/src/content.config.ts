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

// ── Gear collection (discriminated union on `category`) ─────────────

const bindingSchema = z.object({
  body: z.number().default(0),
  mind: z.number().default(0),
  ghost: z.number().default(0),
});

const gearBase = z.object({
  title: z.string(),
  nickname: z.string().optional(),
  binding: bindingSchema.default({ body: 0, mind: 0, ghost: 0 }),
  qualities: z.array(z.string()).default([]),
  source: z.string().optional(),
});

const weaponSchema = gearBase.extend({
  category: z.literal("weapon"),
  dv: z.number(),
  harm_type: z.enum(["Physical", "Psychic"]),
});

const armorSchema = gearBase.extend({
  category: z.literal("armor"),
  av: z.number(),
  av_type: z.string().default("Physical"),
});

const augmentationSchema = gearBase.extend({
  category: z.literal("augmentation"),
  augmentation_category: z.enum(["Spliced", "Bionic", "Cybernetic"]),
  integration: z.enum(["Invasive", "Field-Operable"]),
});

const utilitySchema = gearBase.extend({
  category: z.literal("utility"),
});

const vehicleSchema = gearBase.extend({
  category: z.literal("vehicle"),
  frame: z.number(),
  systems: z.number(),
  pilot_binding: bindingSchema,
  vehicle_av: z.number(),
  size_category: z.enum(["Personal", "Small", "Medium", "Large", "Huge"]),
});

const gearSchema = z.discriminatedUnion("category", [
  weaponSchema,
  armorSchema,
  augmentationSchema,
  utilitySchema,
  vehicleSchema,
]);

const gear = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "../../content/gear/items",
  }),
  schema: gearSchema,
});

export const collections = { rules, "core-rulebook": coreRulebook, gear };
