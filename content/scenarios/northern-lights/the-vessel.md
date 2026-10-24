---
title: "The Vessel"
---

# The Vessel

**The thing that holds the crew together is a working transport carrying a stripped-down boarding shuttle.** Five operators have run her together for the better part of a year — same five, same ship, no churn. That is rare; crews rotate constantly, people burn out, cash out, or don't come back, because deaths happen even to professionals. This crew hasn't lost anyone. They know the ship and each other the way a hand knows a glove, and that cohesion is their real asset, more than the shuttle’s titanium prow, more than the AI. It is also what the scenario spends the evening pulling apart.

## Naming her

She carries only a hull code on the registry. Crews name their own ships, and this crew has earned the right. Offer the players one of these, or let them coin their own — the name tells you who they think they are:

- **Due Diligence** — dry, corporate, faintly menacing. The name of a ship that reads your contract before it reads your rights.
- **Pay Day** — blunt and cheerful about the only thing that matters. No pretense; they came for the money and they'll say so.
- **Special Circumstances** — the polite phrase on the incident report, for the jobs nobody admits to. A crew that names her this thinks they're the deniable option, and rather likes it.
- **Warhog** — unsubtle, ugly, and proud of it. A ship named for exactly what a titanium prow at ramming speed does to a hull.

Whatever they pick, write it into the scene: the assistant should address them by the ship's name from the first line, and the ship should feel like the sixth member of the crew — right up until the scenario starts teaching them what a ship's mind can actually be.

## Parent transport

The transport gets the crew across interplanetary space and carries their equipment and boarding shuttle. Command it through its assistant, navigation system and working stations. It is an environment to commandeer, not a personal vehicle: no FRM/SYS pool and no pilot Binding for giving it orders.

- **Transit:** antimatter-catalyzed fusion torch, sustained 3 g intercept; the remaining fuel buys a slow ride home. See [The Intercept](/scenarios/northern-lights/the-intercept/).
- **Support:** passive sensors, active radar/lidar, optical and RF communications, and the specialist assistant. It supplies observations and relays commands while working links permit.
- **Accommodation:** five operators, acceleration berths, environmental sealing and weeks of life support. Under thrust, movement and exterior deployment are constrained; passengers pay no Binding.
- **Mission bay:** boarding shuttle, the crew’s frames and a Cutter Light EVA Frame for hauling or repair. Whoever operates the Cutter pays its own pilot Binding.

During insertion the transport stays off, outside the close point-defense engagement. Record its position and communications, not a substitute Attribute pool. If it is threatened, resolve access, orders, damaged systems and crew responses through the core rules. Boarding or damaging it does not drain one whole-ship health pool.

## Boarding shuttle — modified Dart

A stripped-down, utilitarian Dart derivative. This is the craft Vector pilots behind the Whisper’s engine or drives through its hull. It uses the [vehicle subsystem](/core-rulebook/vehicles-and-exoskeletons/).

```yaml
title: "Boarding Shuttle"
nickname: "Modified Dart"
category: "vehicle"
size_category: "Large"
frame: 18
systems: 12
vehicle_av: 2
binding: {}
pilot_binding:
  body: 1
  mind: 1
qualities:
  - "Movement System (High-G space drive — local approach and crossing)"
  - "Ramming Prow (Reinforced titanium bow; front-facing AV 6)"
  - "Crash Foam (Cabin impact protection)"
  - "Armament (1 laser + 2 micro-rocket cannons)"
  - "Occupancy (5 protected boarding positions; stripped cargo interior)"
  - "Sensor Suite (Basic navigation)"
  - "Optical and RF control link"
  - "Environmental Sealing"
  - "Life Support (48 hours)"
source: "northern-lights-demo"
```

**Scenario modifications:** the catalog Dart’s two seats, cargo space and single Light hardpoint are replaced by this boarding fit-out: five protected positions, prow, crash foam and the listed weapons. Its FRM 18, SYS 12, AV 2 and pilot Body 1/Mind 1 remain the Dart baseline. The prow’s AV 6 applies only when it faces the attack. These are this shuttle’s modifications, not free upgrades to every Dart.

Passengers pay no vehicle Binding. The pilot binds Body 1 and Mind 1 for control and access to the shuttle’s machine Attributes. Personal equipment keeps its own costs. The shuttle has no carried shuttle of its own.

## Remote piloting and deployment

Vector can pilot the shuttle through a usable optical or RF link from the parent transport or another actual position; she does not need its helm. Optical contact needs a clear path; shielding and interference can block RF. Remote piloting retains Body 1/Mind 1. Commands to the parent’s assistant are not shuttle piloting.

Agree the continuing flight plan before contact fails. Loss of the link ends fresh remote commands; the shuttle’s flight computer continues that plan. Restore the link or reach local controls for a new maneuver. The parent’s assistant cannot transmit through a broken channel.

The Tiger fits the boarding fit-out but has no EVA thrusters; it needs a shuttle ride, line or another viable crossing. Havoc does not fit. Stitch travels on the parent transport and crosses independently under the Havoc’s own thrust, initially or later. Check range, exposure, life support and entry clearance.

Anyone riding a ram takes a protected shuttle position before impact. Operators staying on the parent or crossing separately do not ride the collision. A failed Ghost approach breaks off the aft coast; clearing the guns allows the **same shuttle** to approach from another vector. Record the crossing and return route in the [briefing](/scenarios/northern-lights/briefing/).
