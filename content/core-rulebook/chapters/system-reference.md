---
title: "System Reference Document"
description: "The foundational resolution system, attributes, and resource economy of FREE//FALL v6."
order: 1
---

# System Reference

<span class="text-caption"> A System Reference Document (SRD)for FREE//FALL "v7" (0.7.0)</span>

## Introduction

FREE//FALL v7 is a fast and tactical RPG system based on the exiting action resolution mechanics of Jukka Sorsa's [Hood](https://myrrys.com/hood/) and Harm tech form the Quick. This system reference defines core concepts, rules, techniques and mechanism in a game-agnostic manner.

## Principles

The rules of FREE//FALL are based on 3 core principles, that will help the Players and the Game Master to navigate the game:

1. <span class="underline">The rule of optionality</span>: The rules are there to support the players and the game master in making decisions about the game. In the vein of the Quicks _Say yes, or_ principle, loaned from improv theatre - taking the rules to play is optional, but mandatory if any of the players or the GM asks for them.
2. <span class="underline">The rule of equality</span>: When the game results in a situation, where two things are equal - like a draw in a contested dice roll – the players decide the order of resolution. GM only arbites, if the players disagree. 
3. <span class="underline">The rule of specificity</span>: The rules are built modular, and extensible. When two or more rules conflict eacht other, the more specific wins. Core rules lose to scenario specific rules, and scenario specific rules lose to rules presented in character specific rules (like augmentations, gear etc).

## Action resolution

Every roll begins with an **Action Pool** of 2 to 5 twenty-sided dice (d20). These are divided between one or more axes, allowing the character to spread their focus to multiple aspects of the situation at once.

> **Example**
>
> The GM declares an NPC will use 2 dice to swiftly move to grapple distance, and then 3 dice to grapple. <br/>
> A Player responds, declaring their PC will use all 5 dice to hack the NPC's sensory suite, so they become unable to move to them.

Actions are declared in order: NPCs, characters, then bosses. If an actor has at least 2 dice remaining, they may spend one die to delay their declaration, allowing them to wait until others have declared their actions first.

For each declared goal or action, roll the reserved dice against a **Target Number (TN)** set by the GM. Each die that meets or exceeds the **TN** counts as a success. Typically, one success is enough for the action to proceed as planned. If there is no **TN** and the action is uncontested, no roll is necessary.

All actions are resolved simultaneously: first the first actions of each actor, then the second, and so forth. When two actions are contested, the bigger dice (in any of the dice rolled) happens first. 

> **Continuing the example**
>
> As the NPC's first action, moving, is now contested, the GM rolls 2 dice to see if they get to grappling distance fast enough - resulting in 20, and 4.
>
> The player rolls all the 5 dice with results of  19, 19, 10, 18, and 17.
> 
> Now the NPC is in grappling distance but unable to hear or see anything, and can try their second action. As it's now "near impossible" due to sensory malfunction, and the GM rolls: 8, 5, and 14: the grappling fails.
>
> (The player only declared an action; we return to the declarations for the next "round" of actions.)

As with most **d20**-based games, roll of 20 is considered always a success, regardless of the challenge rating or any other modifiers to the situation.

| Challenge           | Target Number |
| ------------------- | :-----------: |
| **Normal**          | -none-        |
| **Challenging**     | TN 11+        |
| **Hard**            | TN 16+        |
| **Near Impossible** | TN 21+        |

Depending on a game theme, the aspects dice are spit to might be called axes, vectors etc.

## Attributes

Characters posses a set resources called Attributes. An attribute has two ratings: initial and current. Attribute points can be used to:
1. Attempting an Action the characted does not have a **Skill** for
2. Reducing a level of incoming **Harm**
3. Binding gear etc. the character can utilize
4. Restoring points in another Attribute (by default 2 attribute points buy 1 of another attribute).

## Skills

A skill enables a character to attempt an action governed by the skill. 

If the action requires a skill, which the character does not have, attempting the action requires either:
1. Spend a point of an **Attribute**.
2. Taking a **Harm**.

_N.B. Taking a **Harm** or spending a point of a relevant Attribute only allows the character to attempt an action, like they had the skill in the first place._

## Harm & Consequences

When not fatal or ousting, all negative and harmfull consequences to a character are recorded as **Harm**. A harm can be transient, or permanent, it has a short narrative description, and it can be _typed_.

A character has 3 **Harm** slots. Each filled slot, removes a Die from the **Action Pool**.

When a character suffers harm from any source, the player has to decide how the **Harm** is resolved. 

For each level of **Harm** suffered the player has 3 options:
1. Fill in an empty harm slot with the Harm suffered, and mark it **Transient**
2. Replace a transient **Harm** in a slot, and mark it **Permanent**. If a transient **Harm** has a _type_, it can only be replaced with a **Harm** of the same _type_
3. Mark a bound asset, such as a gear or augmentation, **Broken**

If the player is not able to do any of the above, the character becomes ousted from the game.

> **Example**
>
> The character has 2 **Harm** slots filled with transient harm:
> 1. "Mild concussion" (physical)
> 2. "Wanted criminal" (social)
>
> When they recieve 2 levels of _physical_ **Harm** from a brawl, they have to either: replace "mild concussion" with a permanent **Harm**, and record another transient _physical_ **Harm**; or to take a third **Harm** and make it permanent outright.

All transient harm is removed with _downtime_ (think short rest).

Any broken gear or items can be fixed with time and actions, given the required skill and so foth.
