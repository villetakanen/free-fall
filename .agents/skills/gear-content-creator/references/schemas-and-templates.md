# Gear Schemas And Templates

Confirm every field against `apps/free-fall/src/content.config.ts` before editing. The directory is organizational; the `category` discriminator controls validation, routing, and rendering.

## Shared Fields

Every current entry explicitly declares `binding` and `qualities`, including empty values. Preserve that convention even though the schema supplies defaults.

```yaml
title: "Exact Public Name"
nickname: "Short functional label"
category: "weapon"
binding:
  body: 0
  mind: 0
  ghost: 0
qualities: []
source: "v7-playtest"
```

- Use a descriptive kebab-case filename without a numeric prefix.
- Keep `title`, `nickname`, and qualities compact enough for the fixed-size card.
- Use non-negative integers for mechanical values and bindings unless the approved rules explicitly require another value.
- Use `v5-tools-of-the-trade` for faithful migrations from `docs/sources/FREE_FALL V5 - Chapter_ Tools of the Trade.md`.
- Use `v7-playtest` for current additions or meaningful v7 revisions.
- Keep zero cost explicit as `binding: {}` or a fully written zero-valued object, matching the neighboring category convention.

## Weapon

```markdown
---
title: "Item Name"
nickname: "Short functional label"
category: "weapon"
binding:
  body: 1
qualities:
  - "Range (Medium)"
  - "Ammo (Standard)"
dv: 2
harm_type: "Physical"
source: "v7-playtest"
---

*One clipped line that makes the object concrete.*

Describe what it is, who uses it, and the practical compromise it makes.

**Effect:** Explain interactions, exceptions, or item-local mechanics not already clear from the card.

**Binding rationale:** Body - explain the physical cost without repeating the number.
```

`harm_type` accepts `Physical` or `Psychic`.

## Armor

```yaml
---
title: "Armor Name"
nickname: "Short functional label"
category: "armor"
binding:
  body: 1
qualities:
  - "AV 1 (Physical)"
av: 1
av_type: "Physical"
source: "v7-playtest"
---
```

Current armor duplicates its AV as a quality for card display. Keep the quality and structured `av`/`av_type` aligned.

## Augmentation

```yaml
---
title: "Augmentation Name"
nickname: "Short functional label"
category: "augmentation"
binding:
  ghost: 1
qualities: []
augmentation_category: "Cybernetic"
integration: "Invasive"
source: "v7-playtest"
---
```

`augmentation_category` accepts `Spliced`, `Bionic`, or `Cybernetic`. `integration` accepts `Invasive` or `Field-Operable`. Explain mixed or conditional installation behavior in prose using the closest honest structured value.

## Utility

```yaml
---
title: "Utility Item"
nickname: "Short functional label"
category: "utility"
binding:
  mind: 1
qualities:
  - "Limited Use"
source: "v7-playtest"
---
```

Utility has no category-specific stat fields. Put stable, compact capabilities in qualities and explain their operation in the body.

## Exoskeleton

```yaml
---
title: "EXO Name"
nickname: "Short functional label"
category: "exo"
binding: {}
qualities:
  - "Movement System (EVA Thrusters - Standard)"
  - "Hardpoints (2 Assault, 1 Support)"
  - "Environmental Sealing"
frame: 12
systems: 8
pilot_binding:
  ghost: 2
vehicle_av: 2
size_category: "Medium"
source: "v7-playtest"
---
```

## Vehicle

Vehicles use the same machine fields as exoskeletons with `category: "vehicle"`.

```yaml
frame: 18
systems: 12
pilot_binding:
  body: 1
  mind: 1
vehicle_av: 2
size_category: "Large"
```

`size_category` accepts `Personal`, `Small`, `Medium`, `Large`, or `Huge`. `binding` is the item's ordinary equipped cost; `pilot_binding` is imposed while piloting. Hardpoint-mounted gear does not add its ordinary binding to the pilot unless current rules state otherwise.

## Body Pattern

Gear bodies have no authored H1. `apps/free-fall/src/pages/gear/[category].astro` renders the `title` as the item heading.

Use this order when each part adds value:

1. Italic flavor sentence.
2. Concrete description.
3. `**Effect:**` for interactions and exceptions.
4. `**Binding rationale:**` for why Body, Mind, or Ghost bears the cost.

Frontmatter is the queryable mechanical source. Keep the body focused on use, implications, exceptions, and rationale rather than repeating DV, AV, bindings, and the complete quality list.

## Unsupported Shapes

The current schema has no structured field for conditional binding, environmental AV, prerequisites, augmentation-mounted DV, quality definitions, item images, rarity, price, manufacturer, individual item routes, or cross-item IDs. Represent an approved item-local mechanic through existing qualities and prose, and route requests for queryable support to `/spec`.

Gear content does not currently run through the registry term resolver. Use ordinary rules language rather than `:term[...]`. Gear also has no per-item route; link to an absolute category route such as `/gear/augmentations/` when a link is useful.
