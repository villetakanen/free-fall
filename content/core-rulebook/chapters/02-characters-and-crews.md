---
title: "Characters & Crews"
description: "Creating a mercenary in the fractured future of 2048, defined by their Gear, Augmentations, and willingness to bleed."
order: 2
---

# Characters & Crews

<span class="text-caption">Building your deniable asset in 2048</span>

## 1. The Core Concept: Defined by Chrome

In the fractured future of 2048, you are not defined by a hero’s journey or an arbitrary level. You are defined by your Gear, your Augmentations, and your willingness to bleed.

In FREE//FALL, capability is bought, spliced, or installed. A character is a deniable asset shaped by three design pillars:

### I. Gear & Augmentations (The Chrome)

This is the primary source of capability. Tools, weapons, armor, and cybernetics grant specific skills, but they extract a toll called **[Binding](registry#binding)**.

**The Rule:** "Having the right tool IS the skill."

**The Cost:** You don't just equip heavy armor; you support its weight with your spine (Binding Body). You don't just run a Black Ice breaker; you dedicate neural bandwidth to controlling it (Binding Mind).

### II. Attributes (The Resource)

Body, Mind, and Ghost represent your innate capacity. These are finite resources with an Initial rating and a Current rating. They are used to:

*   **Power your Gear:** The higher your Initial Attribute, the more tech you can Bind.
*   **Resist Harm:** You can replace Transient [Harm](registry#harm) with [Permanent Harm](registry#permanent-harm) in an Attribute to stay in the fight.
*   **Operational Capacity:** Once your Current pool is empty, you are exhausted, vulnerable, and unable to attempt actions outside your Skills or reduce incoming Harm through effort.
*   **Push the Limits:** Spend a point of an Attribute to attempt an action as though you had a [Skill](registry#skill) for it.

### III. Class & Skills (The Edge)

A lingering spark of inherent knack tied to your [Class](registry#class). It grants you a specific [Skill](registry#skill).

**Effect:** A Skill enables a character to attempt an action governed by the skill, without needing specific gear, spending an Attribute point, or taking Harm just to make the attempt. It represents years of muscle memory or intuition that tech cannot replicate.

## 2. Character Creation Pipeline

Follow these steps to build a mercenary ready for the Ecopunk slums or the Cyberpunk void.

### Step 1: Concept & Origin

Define your mercenary's nature. Where did they learn to survive?

*   **The Gravity Well (Earth/Al Presa):** Born in the heat and biological decay. Familiar with Bricolage (repurposing trash), toxic weather, and the crowded vertical slums.
    *   *Vibe:* Sweat, rust, duct tape, organic desperation.
*   **The Void (Space/Belt):** Born in the cold, sterile vacuum. Familiar with corporate rigidity, radiation, zero-G combat, and the silence of the black.
    *   *Vibe:* Cold, silence, magnetic seals, corporate sterility.

### Step 2: Choose a Class & Details

Choose a Class that defines your approach to the job. Select one Skill from that Class.

| Class | Role & Description | Skills (Choose One) |
| :--- | :--- | :--- |
| **The Vanguard** | Frontline combatant and breaching expert. They carry the heaviest armor and break the hardest targets. | Breaching, Close Combat Tactics, Tactical Defense |
| **The Spectre** | Master of stealth and sabotage. They operate in the blind spots of sensors and society. | Infiltration, Sabotage, Surveillance |
| **The Wirehead** | Digital ghost. They manage the Mind Binding load of dangerous software to breach systems. | System Cracking, Data Mining, Cybernetics Intrusion |
| **The Fixer** | Tech guru and medic. Masters of Bricolage, keeping people and gear running with duct tape and bypasses. | Human Systems, Field Systems Tech, Clocksmith (AI) |
| **The Operator** | Sharpshooter and tactical observer. They provide overwatch and coordinate fire. | Deadeye, Target Acquisition, Field Support |
| **The Broker** | Social chameleon. They navigate the corporate boardroom and the black market alike. | Negotiation, Impersonation, Influence Peddling |
| **The Pilot** | Vehicle expert. They bind their nervous systems to engines and thrusters. | Vehicle Handling, Logistics, Sensors & Countermeasures |

### Step 3: Assign Attributes

Assign the Standard Array `[12, 8, 6]` to your three Attributes. These are your **Initial** values (your maximum potential).

*   **BODY:** Physical resilience, brute force, biological tolerance. Used for Heavy Weapons, Armor, and resisting Physical Harm.
*   **MIND:** Focus, technical acuity, cognitive processing. Used for Hacking, Med-Tech, and resisting Psychic Harm.
*   **GHOST:** Social composure, stealth, existential stability. Used for Stealth suits, Social maneuvering, and resisting Compromise.

### Step 4: Select Gear & Calculate Binding

Select your equipment. This is a critical step.
Every significant piece of gear has an Attribute **[Binding](registry#binding)** Cost.

**Calculate Current Attributes:** Subtract the Total Binding Cost from your Initial Attribute.

> `Initial Attribute` - `Total Binding` = `Current Attribute Pool`

**Note:** If you Bind too much, you leave yourself with fewer resources to push limits or resist Harm.

### Step 5: Derived Stats

*   **Action Pool:** Standard 5d20.
*   **Harm Slots:** Standard is 3 Slots. *(Penalty: -1d20 to the Action Pool per filled slot).*

## 3. Example Characters

### Example 1: "Rhino" - The Vanguard
A walking tank built for the breach.

*   **[Class](registry#class):** Vanguard (Skill: Breaching)
*   **Initial Attributes:** Body 12, Ghost 8, Mind 6.
*   **Gear Loadout:**
    *   "Rhino Hide" Heavy Armor: AV 3 (Physical). *[Binds 3 Body]*
    *   Kinetic Carbine: DV 2, Auto-Fire. *[Binds 1 Body]*
    *   Pneumatic Ram: DV 3, High Impact. *[Binds 2 Body]*
    *   Mule Harness: Load Bearing. *[Binds 1 Body]* (Negates weight of Ram/Rifle for movement, but Binding remains for usage).
*   **Calculations:**
    *   Total Body Binding: 3 (Armor) + 1 (Rifle) + 2 (Ram) + 1 (Harness) = 7 Body Bound.
*   **Current Pool:**
    *   **Body:** 12 (Initial) - 7 (Bound) = **5 Current Points** (Risky, but powerful).
    *   **Mind:** 6 (Initial) - 0 = **6**.
    *   **Ghost:** 8 (Initial) - 0 = **8**.

### Example 2: "Whisper" - The Spectre (Hacker)
A ghost in the machine using Hacking gear.

*   **[Class](registry#class):** Wirehead/Spectre Hybrid (Skill: System Cracking)
*   **Initial Attributes:** Mind 12, Ghost 8, Body 6.
*   **Gear Loadout:**
    *   Operator’s Slate ("Ghost Link"): The deck itself. *[Binds 1 Mind]*
    *   Program: "Banshee" (Tier: STEEL): Blast type software. *[Binds 2 Mind]*
    *   Program: "Needle" (Tier: CHROME): Spike type software. *[Binds 3 Mind]*
    *   Chameleon Suit: Stealth tech. *[Binds 2 Ghost]*
    *   Micro-Pistol: Backup. *[Binds 0 - Light Gear]*
*   **Calculations:**
    *   Total Mind Binding: 1 (Slate) + 2 (Banshee) + 3 (Needle) = 6 Mind Bound.
    *   Total Ghost Binding: 2 (Suit) = 2 Ghost Bound.
*   **Current Pool:**
    *   **Body:** 6 - 0 = **6**.
    *   **Mind:** 12 - 6 = **6 Current Points** (High cognitive load).
    *   **Ghost:** 8 - 2 = **6 Current Points**.

### Example 3: "Patch" - The Fixer
Bricolage expert who keeps the team alive.

*   **[Class](registry#class):** Fixer (Skill: Human Systems)
*   **Initial Attributes:** Mind 12, Body 8, Ghost 6.
*   **Gear Loadout:**
    *   Trauma Kit ("Patch-Up"): Enables Medical Actions. *[Binds 2 Mind]*
    *   Personal Sensor Array: Tactical awareness. *[Binds 1 Mind]*
    *   Light Ballistic Vest: AV 1. *[Binds 1 Body]*
    *   Neuro-Stunner: DV 1 (Psychic). *[Binds 0]*
*   **Calculations:**
    *   Total Mind Binding: 2 (Kit) + 1 (Sensors) = 3 Mind Bound.
*   **Current Pool:**
    *   **Body:** 8 - 1 = **7**.
    *   **Mind:** 12 - 3 = **9 Current Points** (Huge reserve for medical checks).
    *   **Ghost:** 6 - 0 = **6**.

## 4. Crews

Mercenaries rarely operate alone. Your **[Crew](registry#crew)** is your life support system.

### 1. The Niche
*   **Extraction:** Getting people out of Al Presa or corporate holding.
*   **Acquisition:** Stealing data shards or prototypes from the Belt.
*   **Sanitation:** "Cleaning" up messes for Theseus (Wetwork).

### 2. Shared Assets 
Crews often pool resources for one major asset:
*   **The Van/Shuttle:** A beat-up transport (e.g., "The Ugly Duckling").
*   **The Safehouse:** An off-grid container in the Al Presa Sump.
*   **The Fabricator:** An illegal 3D printer for repairing armor.

### 3. Dynamics
*   **Professional:** Just here for the credits.
*   **Ideological:** Fighting against the heat or the corps.
*   **Compromised:** Working off a debt to a Syndicate or Theseus.
