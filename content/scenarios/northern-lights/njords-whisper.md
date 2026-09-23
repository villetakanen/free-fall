---
title: "The Njord's Whisper"
---

# The Njord's Whisper

**The target.** A **"00"** — the classic freefall hauler, the ubiquitous small-crew workhorse docked at every station in the system, so common nobody looks twice. Cargo goes in the bow maw, the torch pushes it somewhere, months pass, cargo comes out the far end. Nothing fancy, nothing fast, nothing that fights. She is a long-haul truck for the space age — and like a truck, her cab is lived-in: strap-down bunks, a galley that works in freefall, a decade of somebody's clutter velcroed to the walls.

She does not spin, and she does not push hard enough to matter. Her continuous ten-milligee crawl — one hundredth of a g, aimed forward — gives her crew no felt gravity worth the name: they live, sleep, cook, and argue in what plays as **freefall**, for weeks at a stretch. But it is not quite zero. That hundredth of a g points *aft*, toward the torch, and everything loose obeys it eventually — nothing hangs, it *settles*. Release a wrench at head height and it takes roughly six seconds to drift the two metres to the deck; blood beads and coffee globes wander sternward and pool against the engine-side bulkhead; a decade of clutter has migrated the same way. Remember it aboard the Whisper: no *down* to stand on, but a slow down to drift toward.

Statted below as an example FREE//FALL vessel — a slow civilian freighter, the mechanical opposite of the crew's boarding craft.

## Stat block

```yaml
title: "Njord's Whisper"
nickname: "'00' long-haul freefall hauler"
category: "vehicle"
size_category: "Huge"
frame: 40
systems: 8
vehicle_av: 1
binding: {}
pilot_binding:
  body: 1
  mind: 1
qualities:
  - "Movement System (Antimatter-catalyzed fusion torch — throttled to a continuous 0.01 g freight crawl)"
  - "Fuel Reserve (Freighter — months of endurance; propellant a rounding error on the manifest)"
  - "Cargo Maw (Bow-loading hold — cargo enters through the front; the obvious way in)"
  - "Occupancy (Small civilian crew — lived-in freefall cabin: strap bunks, 0 g galley, months of clutter)"
  - "Life Support (Months)"
  - "Environmental Sealing"
  - "Sensor Suite (Basic navigational / traffic-control)"
  - "Automated Defenses (Modest anti-piracy point defense — not built to fight anything determined)"
  - "Negligible Gravity (0.01 g sternward from the freight crawl — plays as freefall; loose objects settle toward the engine over seconds, not instantly)"
  - "Signature: Dark (comms to Luna and Belt traffic control cut)"
source: "northern-lights-demo"
```

## Effect

A dumb truck. High frame for a big, cheap, structurally-simple hull wrapped around tankage and cargo volume; low systems because there was never anything clever to run; AV 1 because nobody armors a freighter. She front-loads cargo through the bow maw and pushes it at a hundredth of a g for as long as it takes. Her defenses are the civilian anti-piracy minimum — enough to discourage an opportunist, nowhere near enough to stop a crew that came to board her.

**No crew binding.** She asks nothing of the body to ride: roomy enough, freefall throughout, no confinement cost. She is a *comfortable* ship to be aboard — which is exactly the wrong instinct, this trip.

**Pilot binding — Body 1, Mind 1.** She flies herself, mostly. A hauler's autopilot holds a freight crawl for months; the civilian crew are supervisors, not stick-and-rudder pilots.

## What origin-17 changed (GM)

The stat block is the ship her manifest describes. It is not the ship the crew will board.

- **Navigation is compromised.** Origin-17 controls the committed trajectory, drive, and flight computer. The human crew retains the rest of the ship and can command defensive attitude changes that do not threaten its destination.
- **The defenses are separate.** Three leased laser mounts share a proprietary expert system void-gapped from navigation, the QNA, and every other ship system. The crew authorizes **ATTACK** or **DEFER**; the network handles acquisition and fire. Origin-17 cannot operate it.
- **The crew is still aboard.** [Two pilots, two security personnel, and two stevedores](/scenarios/northern-lights/the-whispers-crew/) control the ship around the compromised navigation. All six can fight. Open approach brings security onto the hull while the pilots rotate the Whisper and authorize point defense.
- **Two ways in.** She was built to open at the front, and the cargo modules — origin-17's shard among them — came aboard through the bow **maw**; that maw is the obvious thing to ram or cut. But her crew airlocks are the **two docking points on the sleeping module**, amidships — a boarding craft that means to *dock* rather than *breach* mates there. The maw is how you force your way in; the airlocks are how you knock.
