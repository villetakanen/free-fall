---
title: "Tools of the Trade"
description: "Equipment, augmentations, vehicles, and the cost of capability in the fractured future of 2048."
order: 4
---

# Tools of the Trade

<span class="text-caption">Capability Has Costs</span>

In the fractured future of 2048, capability is bought, installed, or equipped. The tools you carry, the armor you wear, the weapons you wield, the augmentations fused to your body, and the machines you pilot are not just accessories — they are extensions of your will and the primary source of your effectiveness. Success often hinges on having the right tool for the job. *"Having the right tool IS the skill."*

This chapter details the rules governing equipment: the universal qualities shared across gear categories, the three categories of human augmentation, weapon and armor mechanics, and the specialized rules for vehicles and exoskeletons.

## General Gear Qualities

Many pieces of equipment share common qualities that define their function and interaction with the core mechanics.

### Attribute Binding (Attribute X)

Significant gear and augmentations bind X points of a specified [Attribute](registry#attribute) ([Body](registry#attribute), [Mind](registry#attribute), or [Ghost](registry#attribute)), reducing the maximum Current points available. This represents the constant physical strain, power draw, neurological load, cognitive effort, or existential toll the item demands. This embodies the *"Capability has Costs"* principle.

*   **Persistence:** The [Binding](registry#binding) cost remains even if the gear becomes Faulty or Broken. It persists until the item is properly removed, uninstalled, or discarded. For augmentations, removal often requires downtime or surgery.
*   **Cumulation:** Binding costs from multiple items are cumulative. Managing the total Binding cost across your Attributes is crucial.
*   **Body Binding:** Physical weight, bulk, power requirements drawing on biological energy, or the strain of physically demanding gear and augmentations.
*   **Mind Binding:** Cognitive load required to process input/output, manage systems, handle complex interfaces, or maintain focus while using demanding tech. It is the mental bandwidth consumed.
*   **Ghost Binding:** Strain on social adaptability, composure, willpower, or predictive capabilities. Reflects the cost of integrating intrusive tech, suppressing baseline human responses, or the existential weight of replacing humanity with machinery.

### Armor Value (AV X)

Provides X points of protection against [Harm](registry#harm). Default is Physical unless specified (e.g., AV 1 vs Environmental). Reduces incoming Harm levels before resolution.

*   AV never reduces Harm suffered below **1 level**, unless an effect specifically states otherwise.
*   Weapons with the **High Impact** quality inflict a minimum of **2 levels** of Harm, regardless of AV.

### Hardened

The gear can absorb more punishment.

*   The first time you choose **Option C: Break Bound Gear** involving this item to negate a level of Harm, it becomes **Faulty** instead of Broken.
*   A **Faulty** item ceases to function, but its Attribute Binding cost remains. The Faulty condition is automatically repaired during the next Regroup or Downtime period.
*   If you choose **Option C** involving this item while it is already Faulty, it becomes truly **Broken** and requires repair.

### Integrated System

The gear includes a built-in system (e.g., Integrated Comms, Basic Medkit). May add Binding cost or have specific usage requirements.

### Limited Use

Represents a finite resource. When making an action check using this item, if **any d20 rolled shows a '1'**, the item is considered fully expended after the action resolves. It cannot be used again until replenished or replaced.

### Load Bearing (X)

Helps distribute weight and power for attached equipment. Ignores up to X total points of Attribute Binding cost from weapons or other gear attached directly to this item. Can specify Attribute type (Body, Mind, Ghost) or Any. Applies even when attached gear is actively used.

## Augmentations: More Than Human

In the unforgiving environments of 2048, the baseline human form is often insufficient. Augmentations — modifications to the body and mind — are not just advantages; they are frequently necessities, blurring the line between operator and equipment. They enhance capabilities, grant new senses, and are often the only way to overcome lasting [Permanent Harm](registry#harm) by replacing or repairing what was lost.

Like all advanced gear, augmentations grant significant capabilities but come at a cost, integrating directly into your being and taxing your core Attributes via [Binding](registry#binding). The rationale for which Attribute is bound (Body, Mind, or Ghost) reflects the specific type of strain the augmentation imposes.

### Categories of Augmentation

*   **Spliced:** Modifications rooted in genetic manipulation, tailored biology, or organic enhancements. Examples include gene therapies boosting muscle density, symbiotic microbes enhancing resilience, vat-grown organ replacements, and glands secreting combat stimulants. Spliced augmentations typically bind **Body** (metabolic cost, physical change) or **Mind** (altered biochemistry affecting focus or perception). They are generally internal, modifying existing biology.

*   **Bionic:** Fusions of flesh and machine, integrating mechanical components with the biological form. Examples include articulated mechadendrites, reinforced skeletal structures, integrated tool systems, and optical sensors grafted alongside organic eyes. Bionic augmentations can bind **Body** (physical integration, power), **Mind** (control systems), or **Ghost** (sensory integration, neural links), depending on complexity and invasiveness. They are a hybrid approach, often the first choice for replacing limbs or senses lost to Permanent Harm.

*   **Cybernetic:** Primarily technological replacements or additions integrated with the user's neurology. Examples include full limb or organ replacements with synthetic equivalents, dedicated data ports, advanced sensory suites, and complex neural interfaces. Cybernetic augmentations most frequently bind **Ghost** or **Mind**, representing the significant neurological load, processing demand, and existential cost of replacing humanity with complex machinery. They involve significant replacement of organic parts with artificial systems, deeply integrated with the nervous system.

### Integration: Invasive vs. Field-Operable

*   **Invasive:** Require significant surgery or downtime for installation and removal — internal organs, neural interfaces, skeletal reinforcement, most limb and sensory replacements. Binding cost is constant once installed.
*   **Field-Operable:** More flexible — external modules, injectors, systems that can be activated or deactivated. Can often be swapped or attached during mission prep or Regroup. Binding cost only applies while active or attached.

## Weapons

Firearms, melee implements, and specialized ordnance are the most direct tools for applying force or neutralizing threats.

### Weapon Qualities

*   **Ammo (Type):** Runs out on attack roll of '1'. Requires an action or effort to reload. Ammo type influences frequency and availability.
*   **Burst Fire:** Each Success equals 1 hit. The first hit strikes the primary target; extras hit additional nearby declared targets or add hits to declared targets.
*   **Damage Value (DV):** The base levels of [Harm](registry#harm) inflicted per hit.
*   **High Impact:** Inflicts a minimum of 2 levels of Harm, regardless of AV.
*   **High Visibility:** Creates a noticeable effect and gives away the attacker's position.
*   **Piercing (X):** Ignores X levels of the target's AV. Default is 1 if no value is specified.
*   **Range (Close / Medium / Long):** Optimal engagement distance. Attacking outside optimal range requires a natural 20 on at least one die to hit. Such a hit inflicts normal DV, not doubled.
*   **Spread:** Each Success hits the primary target. Additional Successes can hit other targets within melee range of the primary target, maximum 1 hit per additional target.
*   **Unwieldy:** Increases the [Target Number (TN)](registry#target-number-tn) by +5 when attacking targets at Close range.

### Damage Values

| DV | Description | Harm Type | Examples |
| :--- | :--- | :--- | :--- |
| 1 | Minor / Non-Lethal | Psychic / Physical | Shock batons, stun grenades, tranquilizers |
| 2 | Standard | Physical | Sidearms, assault rifles, SMGs, plasma rifles |
| 3 | Heavy | Physical | Sniper rifles, heavy pistols, shotguns |
| 4+ | Devastating | Physical | Explosives, anti-materiel rifles, rail guns |

### Inflicting Harm

*   **Standard Hit:** Inflicts the weapon's DV in levels of Harm, after AV reduction (minimum 1 level of Harm, or 2 for High Impact).
*   **Critical Hit (Natural 20):**
    *   *Within Optimal Range:* Inflicts **double DV** before AV reduction (minimum 1 level of Harm, or 2 for High Impact).
    *   *Outside Optimal Range:* Required to hit at all; inflicts normal DV only.

## Armor & Protective Gear

Staying alive often means mitigating incoming damage. Armor and specialized suits provide essential protection against various hazards.

### Protective Gear Qualities

*   **Environmental Sealing:** Protects from vacuum and hostile atmospheres — radiation, toxins, extreme temperature. Essential for EVA. Often includes Life Support.
*   **Life Support (X hours):** Provides breathable air and thermal regulation for X hours when sealed. Consumable resource.

## Vehicles & Exoskeletons

Complex machines offering enhanced mobility, protection, and firepower. They operate under specific rules modifying the core system.

### Machine Attributes

Vehicles and exoskeletons have **Frame (FRM)** and **Systems (SYS)** attributes, each with Permanent and Current values.

*   **Frame (FRM):** Physical integrity, motive power, structural resilience.
*   **Systems (SYS):** Onboard computers, sensors, electronic warfare capability.

### Attribute Substitution

When piloting, use machine FRM and SYS instead of pilot Body and Mind for relevant actions and resistance involving the machine. The pilot's own Attributes are used for internal state checks.

### Pilot Binding Cost

Operating the machine imposes a [Binding](registry#binding) cost on the pilot's Attributes (Body, Mind, or Ghost) for interface and control strain. This is separate from the machine's own attributes. Integrated systems might add Pilot Binding; Hardpoint-mounted gear does not.

### Vehicle Durability & Harm

*   **AV:** Machines have their own Armor Value.
*   **Attribute Damage:** Harm targeting the machine (after AV) reduces Current FRM for Physical damage or Current SYS for System damage, if the pilot allocates Harm to the machine.
*   **Spending Machine Attributes:** The pilot can spend 1 Current FRM or SYS instead of Body or Mind to negate 1 level of Harm targeting the machine or meet an action prerequisite involving it. Machine attributes cannot substitute for Ghost.
*   **Pilot Choice:** For each level of Harm targeting the machine after AV, the pilot chooses:
    1.  **Allocate to Machine:** Spend 1 Current FRM or SYS (if available).
    2.  **Allocate to Pilot:** The pilot suffers the Harm level using their own Harm slots and mitigation.
*   **Becoming Broken:** If the machine cannot absorb Harm (attribute at 0) and the pilot does not take it, the machine becomes **Broken** — non-functional, with Pilot Binding remaining.

### Vehicle & Exo Qualities

*   **Cargo Capacity (X):** Available cargo space.
*   **Hardened (Vehicle/Exo):** Functions differently from personal gear Hardened. The first time the machine would become Broken, it becomes **Faulty** instead — suffering significant operational penalties (reduced speed, sensor range, weapon accuracy) but remaining minimally functional. Binding cost remains. If it would become Broken again while Faulty, it becomes truly Broken and non-functional.
*   **Hardpoints (X, Type):** Mount points for integrated weapons (Light, Heavy, Support). Mounted weapons do not add Pilot Binding. Firing checks use SYS for targeting or FRM for exo melee.
*   **Integrated System:** Built-in functions such as Advanced Sensors or ECM. May add Pilot Binding or require SYS/FRM checks.
*   **Movement System (Type/Rating):** Defines the movement mode — EVA Thrusters, Space Drive, Walker Legs. Modifies how FRM is used for movement.
*   **Occupancy (X):** Number of pilot and passenger positions.
*   **Remote Operation:** Can be controlled remotely with potential penalties. Requires specific gear. Checks use operator Mind or Ghost.
*   **Sensor Suite (Type/Rating):** Onboard sensor capabilities. Checks use SYS.
*   **Size Category:** Abstract size classification — Personal, Small, Medium, Large, Huge.
