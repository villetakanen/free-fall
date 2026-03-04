---
title: "Core Rules"
description: "Operating on the Edge: The fundamental mechanics of survival, resource management, and consequence in FREE//FALL."
order: 3
---

# Core Rules

<span class="text-caption">Operating on the Edge</span>

Welcome back to the fractured future of 2048. In FREE//FALL, survival isn't just about luck or innate talent; it's about the gear you carry, the augmentations fused to your flesh, and your willingness to pay the price for every edge you gain. This chapter lays out the fundamental mechanics you'll use to navigate high-stakes operations where capability comes at a cost, and consequences are brutal and lasting. Master these rules, manage your resources, and maybe you'll live to see the next payday.

## The Attributes: Body, Mind & Ghost

Three [Attributes](registry#attribute) represent your character's fundamental capacity and resilience:

*   **Body:** Physical resilience, endurance, tolerance for physical strain, and the capacity to handle demanding physical gear or biological augmentations. It serves as the resource pool for physical actions and resisting or negating Physical [Harm](registry#harm).
*   **Mind:** Mental acuity, processing power, focus, technical aptitude, and the capacity for complex interfaces or cybernetics. It is the resource pool for mental/technical actions and resisting or negating Psychic [Harm](registry#harm).
*   **Ghost:** Social adaptability, composure, willpower, the ability to manage intrusive social or stealth technology, and the mental fortitude to handle deep neural interfaces. It is the resource pool for social/stealth actions and resisting or negating Compromise [Harm](registry#harm).

Each Attribute possesses two values:

*   **Initial:** Your character's maximum potential or cap for that Attribute, determined during character creation. This rarely changes.
*   **Current:** The points you currently have available to spend or lose. This value fluctuates due to exertion (spending points to act or negate Harm) and the constant drain of Attribute [Binding](registry#binding) from your gear and augmentations. Your Current value cannot exceed your Maximum Current Attribute value (Initial minus Binding Costs). Replenishing Current Attribute points typically requires downtime.

Think of your Current Attributes as critical resources – fuel for pushing your limits and buffers against trauma.

## Gear, Augmentations & Binding: The Cost of Capability

In FREE//FALL, Gear is Capability. The weapons, armor, tools, and augmentations you choose are the primary source of your specialized skills and abilities. *“Having the right tool is the skill”*. Technology defines what you can achieve.

However, this power comes at a significant price: Attribute [Binding](registry#binding).
Significant gear and augmentations impose a Binding Cost on one or more specific Attributes (e.g., Body 2, Mind 1, Ghost 3). This reflects the constant physical strain, power draw, neurological load, or cognitive effort the item demands.

*   **Body Binding:** Physical weight, bulk, power requirements, and biological strain.
*   **Mind Binding:** Cognitive load, system processing demands, attention required.
*   **Ghost Binding:** Social processing strain, stealth system management, deep neural interface stress.

This Binding Cost is subtracted from your Initial Attribute value to determine your Maximum Current Attribute points available while the gear is equipped or the augmentation is installed.

> **Example:** If you have Initial Body 12 and wear armor with Body Binding 3, your Maximum Current Body becomes 9. You start with 9 Current Body points and can never recover more until the armor is removed.

Binding Costs from multiple items are cumulative. Crucially, Attribute Binding Costs remain even if the gear becomes Broken. The strain persists until the item is unequipped or uninstalled.

## Action Resolution: Making Your Move

Resolving actions follow these steps when the pressure is on.

### 1. The Action Pool

You begin each turn with a base **[Action Pool](registry#action-pool)** of 5d20. This pool represents your focus, potential actions, and overall effectiveness for the turn. Each die in the pool can be assigned to a declared action.

*   **Harm Penalty:** Each filled Harm Slot (Transient or Permanent) reduces your available Action Pool by 1d20.
*   **Minimum Pool:** Your Action Pool can never drop below 2d20, no matter how much Harm you've suffered. Even on the brink, you can still act.

### 2. Declaration Phase & Assigning Dice

During the Declaration Phase, you state what you intend to do and assign dice from your available pool to each action.

*   Every action you attempt requires at least one die to be assigned to it.
*   Assigning multiple dice to a single action increases your chance of achieving a Greater Success.
*   The total number of dice assigned cannot exceed your current available Action Pool for the turn.

### 3. Prerequisites for Specialized Actions

Most actions beyond simple movement or basic interaction require you to meet at least one prerequisite before you can roll:

1.  **Relevant Skill:** Possess the relevant Character [Skill](registry#skill) (an innate talent chosen during character creation based on your [Class](registry#class)).
2.  **Functional Gear/Augmentation:** Have appropriate, functional Gear or Augmentation that enables the action.
3.  **Spend Attribute Point:** Spend 1 Current point from the Attribute pool most relevant to the action (Body, Mind, or Ghost). This represents pushing your inherent limits through sheer effort.
4.  **Take Harm:** Take 1 level of Harm relevant to the action type. This Harm is suffered before the roll and must be resolved immediately. This represents pushing yourself dangerously beyond safe limits.

You cannot attempt the specialized action if you cannot meet at least one prerequisite.

### 4. Rolling & Determining Success

Once prerequisites are met, roll the specific dice assigned to that action.

*   **Bonuses:** Certain advantageous situations might grant a numerical bonus (e.g., +2). Add this directly to the result shown on each die rolled.
*   **Penalties:** Penalties instead increase the [Target Number (TN)](registry#target-number-tn) required for success (e.g., making a Challenging TN 11 become TN 16 for that roll).

Compare each die's final result to the [Target Number (TN)](registry#target-number-tn) set by the GM.

| Base Difficulty | Target Number |
| :--- | :--- |
| **Normal** | -none- |
| **Challenging** | TN 11+ |
| **Hard** | TN 16+ |
| **Near Impossible** | TN 21+ |

*   **[Successes](registry#successes):** Each die roll that meets or exceeds the TN counts as one Success.
*   **Natural 20:** A roll of 20 always counts as at least one Success, regardless of the TN.

### 5. Interpreting the Outcome

*   **0 Successes:** Failure. The action does not achieve its intended effect. The GM may introduce a complication.
*   **1 Success:** Basic Success. You achieve your intended goal at a baseline level.
*   **2+ Successes:** Greater Success. You achieve your goal with increased magnitude, speed, efficiency, or additional beneficial effects.

#### Critical Hits (Natural 20 on Attack)
If any die rolled as part of an attack action shows a natural 20:
*   **Within Optimal Range:** The hit is critical. It inflicts double the weapon's [Damage Value (DV)](#damage-value-dv) in Levels of Harm (before [Armor Value](#armor-value-av) reduction; minimum Harm rules still apply).
*   **Outside Optimal Range:** A natural 20 results in a normal hit, inflicting the standard DV.

## Time and Granularity: The 4 Modes

FREE//FALL does not force you to play every moment in grueling mechanical detail. The system provides 4 Modes of play as pacing tools for the Game Master. Using any Mode past 1x is optional. Moving between these levels of abstraction allows the GM to effortlessly dial the mechanical granularity up or down depending on the scene's tension.

The core philosophy is simple: **In slower modes, avoid using granular tech and mechanics.** Save the deep resolution systems, full Action Pools, and formal Harm allocation for when bullets start flying.

### Narrative Time (1x)
*Free form play, intended for color and drama scenes.*
*   **Resolution:** "Say yes, or Escalate." Use standard conversational roleplay. No dice are needed unless a consequence is dramatically interesting.
*   **Consequences:** Play flows conversationally. Minor setbacks happen purely in the narrative.

### Montage Time (2x)
*Abstract sequences like extended travel, investigations, or prolonged tracking.*
*   **Resolution:** The players can summarize their approach. The GM might ask for a single, abstracted roll using their full **Action Pool** (5d20) to gauge overall success vs. risk. 
*   **Consequences:** Success means the montage succeeds. Failures lead to narrative impediments or can be "Harmed away" (players choose to take Harm to force a success). Opposition success leads to Escalation. Harm taken is loosely handled at the player's discretion, rather than formally mapped to specific gear or slots unless desired.

### Action Time (4x)
*Time-boxed scenes like stealth infiltrations, complex hacks, or desperate escapes.*
*   **Resolution:** Players roll their **Action Pool** to overcome specific obstacles. Successes often contribute to a GM "clock" or "ticker" representing progress.
*   **Consequences:** Failures slow the ticker's completion or introduce immediate complications. Opposition success leads to immediate Escalation. Harm is still often handled loosely or narratively, to keep the pace fast.

### Bullet Time (16x)
*Combat, standoffs, and immediate tactical threats.*
*   **Resolution:** This is where the full FREE//FALL tactical engine engages. Actions are resolved atomically using the formal Declaration and Resolution phases outlined in the Action Resolution steps. Every die matters.
*   **Consequences:** Failures lead to no-ops (the action completely fails). Opposing actions have dire, immediate results. Harm is handled precisely by the formal system (AV, Attribute spending, breaking Bound Gear, and filling Harm Slots).

#### Complications (Natural 1)
If any die rolled during a conflict situation shows a natural 1, the GM may introduce an unexpected problem or environmental hazard, even if other dice resulted in successes.

## The Harm System: Paying the Price

Damage and trauma are represented by [Harm](registry#harm). This isn't just hit points; it's physical injury, psychic strain, or social fallout that degrades your ability to function.

*   **Physical Harm:** Injury, trauma, exhaustion (Associated with Body).
*   **Psychic Harm:** Mental stress, cognitive damage, sensory overload (Associated with Mind).
*   **Compromise Harm:** Damage to social standing, security breaches, loss of composure (Associated with Ghost).

### Suffering Harm

Attacks and hazards inflict a number of Levels of Harm indicated by their **Damage Value (DV)** (e.g., DV 1 is Minor, DV 3 is Heavy).

*   **Armor Value (AV):** Gear can provide AV against specific Harm types. AV reduces the number of incoming Harm levels suffered.
*   **Minimum Harm:** AV never reduces Harm below 1 level, unless specified. High Impact weapons inflict at least 2 levels regardless of AV.

### Mitigating Harm Before Resolution

You can spend 1 Current point from the Attribute corresponding to the Harm type (Body for Physical, Mind for Psychic, Ghost for Compromise) to negate 1 level of incoming Harm. You can do this multiple times if you have points available.

### Resolving Harm Levels

After applying AV and spending Attribute points, you must resolve each remaining Level of Harm by choosing one of the following:

#### Option A: Mark Transient Harm
Fill one of your 3 empty [Harm Slots](registry#harm-slot).
*   **Effect:** This [Transient Harm](registry#temporary-harm) reduces your available Action Pool by 1d20 for as long as the slot is filled.
*   **Recovery:** Cleared during [Downtime](registry#downtime).

#### Option B: Make Transient Harm Permanent
Choose one Harm Slot already filled with Transient Harm. It now becomes [Permanent Harm](registry#permanent-harm).
*   **Effect:** The slot remains filled (-1d20 to Action Pool) and carries lasting narrative consequences.
*   **Recovery:** Significant downtime, resources, therapy, or surgery.

#### Option C: Break Bound Gear
Choose a piece of Gear or Augmentation bound to the Attribute corresponding to the Harm type. It immediately becomes Broken.
*   **Effect:** The item ceases to function, but its Binding Cost remains until repaired or uninstalled.

#### Forced Choice
If all three Harm Slots are filled with Transient Harm and you suffer another level, you face a Forced Choice: Make Transient Harm Permanent (Option B) or Break Bound Gear (Option C).

### Ousted: The Final Toll
If a character accumulates **3 Permanent Harms** filling all three of their Harm Slots, they are **[Ousted](registry#ousted)**. The character is either dead, forced into permanent retirement, or physically/mentally broken beyond the point of ever working as a mercenary again. Their story ends here.

## Vehicles & Exoskeletons (Brief Overview)

Operating vehicles or exoskeletons substitutes the machine's capabilities for your own.
*   **Frame (FRM):** Physical integrity and movement. Substitutes for the pilot's Body.
*   **Systems (SYS):** Onboard computers and sensors. Substitutes for the pilot's Mind.
*   **Binding Cost:** Piloting imposes a Binding Cost on the pilot's Attributes.

When the machine takes Harm, the pilot allocates it:
*   **Allocate to Machine:** Spend 1 Current point from the machine's attribute (FRM or SYS). This damages the machine.
*   **Allocate to Pilot:** The pilot suffers the Harm level themselves, resolving it with their own Harm Slots or personal Bound Gear.

Complete rules for vehicles will be detailed in later chapters.
