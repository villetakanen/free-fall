---
title: "Hacking & Cyber Warfare"
description: "Programs, intrusion, countermeasures, and the cost of controlling connected systems."
order: 6
---

# Hacking & Cyber Warfare

A locked hatch, a leased turret, the implants behind someone's eyes. If you can reach the interface, you can try to change what it does. The system can answer with a trace, a lockdown, or neural feedback.

Hacking uses the same [action rules](/core-rulebook/03-core-rules/#action-resolution-making-your-move) as everything else. You allocate dice, meet a prerequisite, and roll against a :term[Target Number]. Active software supplies capability and binds :term[Mind]. Every intrusion risks exposing the tool that made it possible.

## Making a hacking action

**Declare the target and effect.** Name the device, network, or augmentation you intend to affect and what you want it to do. Establish how you can reach it: a network connection, a wireless interface, physical access, or an improvised method that makes sense in the situation. A prerequisite enables an attempt; it does not make an unreachable target accessible.

> **Targeting hacks**
>
> **Name the device, the function you want to change, and how your equipment reaches it.**
>
> Seeing a target isn’t enough. Radio needs a receiver. Blinking lights need a sensor that processes them. An implant inside someone’s body needs a channel that reaches its electronics.
>
> A suit camera and its wearer’s implant are separate targets unless a connection joins them. Reaching one does not automatically expose the other.
>
> Establish access first, then set the TN. Powerful software can defeat defenses; it doesn’t supply missing transmitters. Invent clever paths—the target must actually be able to receive them.

**Assign dice.** Allocate at least one die from your :term[Action Pool]. More dice improve your chance of success and greater effects. Activation and hacking actions share the same pool as movement, shooting, and everything else you do that turn.

**Meet a prerequisite.** Before rolling, meet at least one:

- Use an appropriate, active :term[Program] through a functional interface.
- Use a relevant :term[Skill], such as System Cracking, Data Mining, or Cybernetics Intrusion. Skills allow situational improvisation with available means, as described in [Using Class Skills](/core-rulebook/02-characters-and-crews/#using-class-skills).
- Spend 1 Current Mind point to push through the technical problem.
- Take 1 level of Psychic or Compromise :term[Harm], appropriate to the method. Resolve that Harm before rolling, including any reduction to your Action Pool.

A Skill or an Attribute expenditure enables a feasible improvised attempt without a specialized program. It does not supply a software tier bonus. When you do use an active program, its bonus and compromise risk apply regardless of which prerequisite enabled the action.

**Set the difficulty and roll.** The GM sets the TN from the target's defenses and the attempted effect.

| Difficulty | TN | Typical security |
|---|---|---|
| Normal | No roll | Routine access you already have |
| Challenging | 11+ | Consumer systems or poorly secured networks |
| Hard | 16+ | Corporate security or hardened personal devices |
| Near Impossible | 21+ | Military systems, black sites, or exceptionally strong defenses |

Add the active program's tier bonus to **each die** assigned to the hack. Situational penalties raise the TN: an alerted system might impose +5 TN, for example. A modified result meeting the TN is a success; a natural 20 always contributes at least one success. Read natural 1s from the dice before adding bonuses.

Use the game's [time modes](/core-rulebook/03-core-rules/#time-and-granularity-the-4-modes) to set the level of detail. Summarize routine work; use the full action economy when an intrusion, counterattack, or escape needs to be resolved under immediate pressure.

## Programs as gear

A Program is software with a defined function, type, tier, and Mind :term[Binding] cost. Acquire programs through purchases, theft, mission support, or development with suitable Skills and Downtime. The interface carries the software; the active programs determine what it can do.

### Storage and activation

**Stored programs** impose no Binding. Keep them on a slate, datapad, or cybernetic memory. Installation normally happens during Regroup or Downtime.

**Activation takes an action**, with at least one allocated die. Ready the program before using it for a hacking action. Ordinary activation needs no success roll unless the situation makes loading it uncertain. Its Mind Binding applies as soon as it becomes active.

**Active programs bind Mind cumulatively.** Subtract their total Binding, after applicable Load Bearing, from your Initial Mind to determine your maximum Current Mind alongside your other bound gear. Programs do not have a separate universal slot limit.

**Deactivation releases that program's Binding.** With access to your interface, this is normally a negligible action on your turn. Releasing Binding immediately returns the Mind points actually held aside by that program. Mind points you have spent remain spent. Activating the program again commits its Binding cost again; any costs offset by a Neural Link or other allowance return no points.

### Program compromise

Programs used for hacking carry a risk similar to [Limited Use](/core-rulebook/04-tools-of-the-trade/#limited-use). If **any die assigned to the hacking action shows a natural 1**, the program used becomes **Compromised after the action resolves**, whether the hack succeeds or fails.

Its signature may have been blacklisted, its exploit quarantined, or its code corrupted. A Compromised program automatically deactivates and cannot be used again for the rest of the mission. Reloading it does not remove the compromise. Restore it during post-mission :term[Downtime] by recompiling, scrubbing its signature, or obtaining a replacement.

This software condition is distinct from **Compromise Harm**, which affects a character. A natural 1 can also introduce a conflict complication under the core rules; neither result erases successes already rolled.

## Program types

### Spike

A precise, single-target effect: disable a camera, unlock a door, jam a sensor briefly, force a reboot, corrupt a small piece of data, or extract a file.

One success achieves the focused effect. Greater Success can extend its duration, bypass a minor countermeasure, or leave less trace. Spike programs use their tier's base Mind Binding.

### Blast

A broad disruption affecting several targets or part of a network: overload nearby sensors, disrupt local communications, crash a node, spread false alarms, or corrupt a data cluster.

One success affects the declared group or system area. Greater Success can increase the reach, severity, or duration. Blast programs use their tier's base Mind Binding.

### Counter

A defensive or bypass function: defeat a trace, neutralize a hostile program, spoof credentials, bypass a firewall rule, decrypt a live stream, or obscure an intrusion.

One success negates the targeted hostile action or bypasses the specified defense. Greater Success can yield intelligence, a temporary defensive advantage, or an opening for a counterattack. Use Counter proactively or as a declared defense against an incoming threat. Counter programs bind **twice** their tier's base Mind cost.

### Pwn

Temporary control over specific functions of a device, drone, vehicle, or connected augmentation. Declare the functions you are trying to seize: move a drone to a point, fire a turret once at a coordinate, engage emergency brakes, cycle a door, or trigger an industrial actuator.

One success grants limited control over one or two predefined functions. Greater Success can extend the duration, add a minor function, or conceal the interference. Set the baseline scope and duration with the GM before rolling. Pwn programs bind **twice** their tier's base Mind cost.

Pwn does not grant unrestricted control of a complex system or the person wearing an affected augmentation. Firing a turret at a coordinate does not also give it new autonomous tracking orders. Broader control requires further intrusions, different programs, or developments in the fiction; one successful hack is not blanket ownership.

## Program tiers

A program's tier determines its bonus to each assigned die and its base Mind Binding. Spike and Blast use the base cost. Counter and Pwn double it.

| Tier | Description | Bonus per die | Spike / Blast Binding | Counter / Pwn Binding |
|---|---|---|---|---|
| RED | Basic / street level | +0 | Mind 1 | Mind 2 |
| STEEL | Corporate / professional | +5 | Mind 2 | Mind 4 |
| CHROME | Military / high security | +10 | Mind 3 | Mind 6 |
| BLACK | Cutting edge / THESEUS special | +15 | Mind 4 | Mind 8 |

Higher tiers demand more attention to operate. BLACK software can also have unusual capabilities, but those belong in the individual program's description: its color alone does not grant an unspecified effect.

### Naming programs

Use **[TIER] [Name] [Type]**: RED Ghost Spike, STEEL Override Blast, CHROME Null-Vector Counter, or BLACK Chimera Pwn. Each program's description specifies its intended effect within that type.

For corporate or system software, the name can identify its maker or faction: RED OmniCorp Spike, STEEL Cygnus Blast, or CHROME Ares Counter. The type still identifies what the program does.

## Resolving an intrusion

**No successes:** the intended effect fails. Depending on the situation, a complication can raise an alert, start a trace, escalate security, or inflict Psychic or Compromise Harm, typically DV 1–2.

**One success:** achieve the declared effect at its baseline scope. A lock opens, a camera glitches, a small file is extracted, or a device performs the limited function you targeted.

**Two or more successes:** increase magnitude, speed, efficiency, or gain an additional benefit within the program's function. You might leave less evidence, retrieve more data, affect more devices with a broad disruption, or sustain a limited effect longer.

A natural 1 compromises the program after any of these outcomes. A natural 20 guarantees at least one success; the core critical-hit rule doubles DV for an applicable attack, not the scope of a door command or data extraction.

### Harm from cyber warfare

Resolve Harm through the [standard Harm system](/core-rulebook/03-core-rules/#the-harm-system-paying-the-price). Neural feedback and sensory overload cause **Psychic Harm**, associated with Mind. Exposed credentials, traced identities, and security breaches can cause **Compromise Harm**, associated with Ghost.

Apply AV that protects against the relevant Harm type. The target can spend the corresponding Current Attribute to negate levels, then resolve the remainder through Harm Slots, matching Transient-to-Permanent conversions, or eligible bound gear. A program being Compromised does not itself fill a Harm Slot.

## Defenses and countermeasures

**Passive security** is represented by the TN: encryption, architecture, access controls, and the difficulty of the intended change.

**ICE — Intrusion Countermeasures Electronics —** is active defensive software. Its defined triggers can respond to detected intrusions, whether those intrusions succeed or fail. ICE can start a trace, lock down a network segment, alert security, or launch a hostile program. Neural-feedback ICE can inflict Psychic Harm at DV 1–3; exposure or tracing can inflict Compromise Harm at DV 1–2. Establish the relevant trigger and effect when preparing the system.

**Security operators and rival hackers** act through the same action economy. They can reinforce defenses, trace or eject an intruder, counter a hostile program, or attack connected gear and augmentations. A Counter program provides a defensive action, not an extra pool of free reactions: allocate dice and resolve it through the current time mode. Use the standard TN and success model for the declared defense.

Every further intrusion attempt is another action with its own allocation, prerequisites, and software risk. Carry alerts, traces, compromised programs, and changed access forward into the next attempt.

## Interface example: Ghost Link

The **Ghost Link**, an operator's slate in the [utility catalog](/gear/utility/), binds **Ghost 2** and provides **Load Bearing (6 Mind — Software Only)**. It stores and runs programs and provides access to an AI assistant. Its allowance offsets up to 6 total Mind Binding from software running through the slate; the slate's own Ghost Binding remains.

| Active software through the slate | Software Binding | After Load Bearing | Total Binding, including slate |
|---|---|---|---|
| STEEL Decryptor Spike + RED Overwatch Counter | 2 + 2 = 4 Mind | 0 Mind | Ghost 2 |
| CHROME Intruder Pwn + STEEL Bypass Spike | 6 + 2 = 8 Mind | 2 Mind | Ghost 2 + Mind 2 |

The allowance applies to the combined software load, not separately to each program. Other equipment and augmentations still contribute their own Binding. Roll the assigned dice with the program's tier bonus; Mind is a resource and Binding capacity, not an Attribute score added to the roll.
