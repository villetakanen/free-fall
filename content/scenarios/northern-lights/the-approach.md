---
title: "Scene 2: The Approach"
---

# Scene 2: The Approach

The crew chose a plan in [Contact](/scenarios/northern-lights/contact/). Now make them fly it.

The *Njord's Whisper* is not helpless. Three leased point-defense lasers sit at equal points around her hull, their fields of fire overlapping across the ship's surface. Coast through their envelope and they cut the crew's vessel apart one patient layer at a time. Go outside to stop them and two mounts with a clean angle can cut a person apart much faster.

Run the approach in **Action Time** while the crew acts through their vessel: piloting, hacking, firing rockets, finding angles, and managing damage. Escalate to **Bullet Time** when operators and the Whisper's security personnel meet outside the hull. The scene ends when the crew has made and secured an entry, not merely when they reach the ship.

## What controls what (GM)

Keep the systems separate. The distinction is load-bearing.

- **Origin-17 controls navigation only:** the Whisper's committed trajectory, drive, and flight computer.
- **The six-person crew controls the ship:** sensors, communications, attitude commands, doors, airlocks, life support, cargo systems, and the authorization to use point defense.
- **The lasers control themselves:** the three leased mounts share a proprietary expert system, void-gapped from every other system aboard. The crew can tell it **ATTACK** or **DEFER**. It handles acquisition, aim, and fire.

Origin-17 permits the crew to rotate the Whisper for defense. A changed attitude does not threaten its destination. It does not fire the lasers, direct the defenders, or help the attackers. From its perspective, either crew can repair the damage later, and a freighter written off as piracy may disappear more cleanly than one merely missing. If an attacker reaches neural-interface range, origin-17 expects to take them over. Until then, it waits.

Compromising navigation does not stop the guns. Compromising the guns does not stop the ship.

## The defense network

The three laser mounts are identical and linked only to one another.

```yaml
POINT-DEFENSE NETWORK
Mounts: 3 leased laser units
Control: Independent expert system
Crew authorization: ATTACK / DEFER
Security: Hacking 2
Attack Pool: 5d20, divided between firing mounts in Bullet Time
Laser: DV 2 Physical
```

### Fields of fire

Hull geometry decides how many lasers can see a target. A careful line usually exposes the target to one mount. A bad line or a defensive rotation exposes it to two. Moving around the hull changes the answer.

Make that geometry legible. Tell the players when a second mount is coming around the curve before it fires. Let them break line of sight by moving, rotating their vessel, or putting the Whisper itself between them and a gun.

### ATTACK or DEFER

Before the crew identifies a threat, the network is on **DEFER**: tracking, solving, not firing. An unmistakably hostile act or an openly approaching boarding craft gives the Whisper's crew every reason to authorize **ATTACK**.

Once authorized, the expert system follows one doctrine:

1. If two lasers can reach an exposed crew member, both target that person.
2. Otherwise, the lasers concentrate on the crew vessel's rocket cannons and point defense.
3. With no better target, they hold one patch of hull and ablate it until something fails.

The lasers do not spread damage politely. One mount is pressure. Two are a kill solution.

At Action Time, resolve every active laser with line of sight at the end of the exchange. If a crew action contested that mount, the roll decides whether it fires cleanly. If nobody dealt with it, it hits. Apply its DV against the vessel normally: the crew chooses where the machine pays, but the expert system prefers rocket cannons and point defense before holding its beam on the hull. Two mounts on the same target produce two hits. Repeated exposure threatens the return trip, not just this approach.

At Bullet Time, the network is one actor with a 5d20 :term[Action Pool]. Divide its dice between the mounts that can fire. When two mounts can see one exposed person, declare that concentrated attack before the players declare their actions. They know what is about to happen and can reach cover, break the track, disable a mount, or accept the fire to buy someone else an opening.

### Stopping a mount

The players do not need one prescribed tool.

- **Hack the network:** Root can attack the proprietary mount network with System Cracking. Useful effects include forcing **DEFER**, spoofing a non-hostile classification, delaying an **ATTACK** authorization, or breaking coordination so two mounts cannot concentrate fire. The network is separate from every other ship system; this access goes nowhere else.
- **Take the shot:** A long-range precision weapon can disable an exposed mount. Vantage's Light Lance or Rail Gun is built for this work. The shooter needs a stable line and becomes the network's first personal target if the shot reveals them.
- **Fire the rockets:** The crew vessel's two micro-rocket cannons can destroy mounts quickly. Rockets are overt. The first launch ends any pretense that this is traffic.
- **Reach the hardware:** An operator on the hull can sabotage a mount or use its service access. This avoids shooting through the ship they intend to board, but puts a body inside overlapping fields of fire.
- **Mask it:** A pilot can keep the Whisper's hull between the crew and a mount. Masking buys an exchange; rotation or movement can bring the gun back.

Physical damage is local. Destroying one laser does nothing to the other two. A network intrusion can affect all three, but the human crew can recognize an impossible **DEFER** and try to regain control.

## The Whisper's crew

All six are civilian spacers. All six can fight.

- **Two pilots** handle sensors, attitude changes, communications, and point-defense authorization. Once the attack begins, they rotate the Whisper to bring a second laser into arc and keep the expert system fed with a clean picture.
- **Two security personnel** suit up and deploy to the hull when they identify an open approach. They protect mounts, flush attackers out of cover, mark targets for the expert system, and occupy the projected breach point.
- **Two stevedores** perform damage control, isolate compromised systems, move cargo across likely approaches, and prepare the interior against boarding. If the crew reaches them, they fight with the tools and weapons at hand.

The defenders act through human hands and human-scale tactics, whatever "compromised" ultimately means aboard. Origin-17 has no system path into their weapons, and it does not care which side wins.

```yaml
HULL SECURITY (2)
Action Pool: 5d20 each
Armor: AV 2, sealed EVA
Weapon: DV 2 Physical, Long range
Movement: Magnetic boots and maneuver pack
Role: Mark targets, protect mounts, deny the breach
```

Use :term[Challenging] TN 11 for a professional action under pressure. Raise it to :term[Hard] TN 16 when two lasers hold the target, damaged equipment matters, or the character attempts the action from a genuinely bad position. Position changes the problem before it changes the number: masking a laser removes its attack rather than merely granting a bonus against it.

## Path A: High-velocity ram

The crew foams up and commits the whole vessel. The Whisper authorizes **ATTACK**; security deploys to the hull, but the closing velocity gives them little time to do more than identify the projected impact and get clear of it.

Run the ram as three Action Time exchanges. Vector makes one Vehicle Handling roll in each. Between those rolls, every other player gets one consequential action through the vessel: hack the network, fire a rocket cannon, take a precision shot, operate point defense, manage damage, refine the impact solution, or invent something better.

### 1. Choose the line

The Whisper begins rotating. Vector puts the titanium prow toward the target and chooses which part of the laser envelope to cross.

- **Success:** One mount has a clean opening shot. The crew chooses the intended impact area.
- **Greater success:** One mount can see them, and it acquires late. Give the crew the first action before it fires.
- **Failure:** The rotation catches them between arcs. Two mounts can fire, and the crew must disable one, break the geometry, or take concentrated attrition.

Ask everyone else what they do with the seconds Vector bought. The rockets can remove a mount. Root can force a brief **DEFER**. Vantage can brace a long gun against the hull and shoot. Stitch can keep damaged systems alive. Sable can read where the security pair is moving and call a breach they cannot cover in time.

### 2. Hold the run

The range collapses. The assistant can still calculate; only Vector can keep the prow between the crew and the beams while the Whisper rolls under them.

- **Success:** The prow holds. Apply any laser damage to the ram shield or a declared external system.
- **Greater success:** Vector breaks one mount's track or presents a firing solution to an ally. The next action against that mount has the advantage of surprise and position.
- **Failure:** A beam walks off the prow. Break or damage a weapon, sensor, thruster, or another system that matters. If the same hull section has already been hit, the damage reaches the crew compartment.

Do not make a failed roll end the ram. It makes arrival worse.

### 3. Place the impact

The Whisper fills the forward view. Crash foam fires. Everyone disappears into white.

- **Success:** The prow enters the chosen compartment. The crew arrives together, protected by the shield, with the breach where they wanted it.
- **Greater success:** As above, and the wrecked prow leaves a defensible route back into their vessel.
- **Failure:** They still breach. Put them somewhere costly: the wrong compartment, a partially collapsed access, a venting cargo space, or directly beside the security pair. Inflict appropriate :term[Harm] for any protection the lasers already stripped away.

The ram always costs stealth and a clean separation. Their vessel is now lodged in the Whisper. What the players decide is how much of it still works, where it lands, and how many defenders are waiting at the hole.

## Path B: Infiltrate, then strike

Ghost, active sweep, a cold shuttle, suited operators on lines, a false transponder: these are variations of one plan. Get close enough to neutralize the lasers before the lasers can dismantle the approach.

### 1. Establish position

Carry forward what Scene 1 bought.

- **Ghost approach:** The defense network remains on **DEFER**. The crew chooses its first angle and acts before the Whisper understands what has arrived. They have less detail about the mounts and defenders.
- **Active sweep, undetected:** The crew knows all three mount positions and the likely breach points. The network remains on **DEFER**, but any overt move will resolve the contact immediately.
- **Active sweep, detected:** The Whisper has authorized **ATTACK**. Security is already moving onto the hull. Start in an active firing arc.

For another plan, state the same bargain: what does it reveal, what does it conceal, and what causes the Whisper to choose **ATTACK**?

### 2. Assign the first strike

Show the players the three mounts and ask how they divide the work. They can hack the shared network, shoot individual lasers, launch rockets, move physically to the hardware, or combine methods.

Resolve the first strike simultaneously. Reward coordination honestly:

- Every disabled mount changes the hull geometry for the rest of the scene.
- A successful network intrusion can hold all three on **DEFER**, but only while the crew maintains the lie or lockout.
- A missed shot, failed intrusion, rocket launch, or clearly hostile crossing triggers **ATTACK**.

Do not turn partial success into no success. If they disable one mount and wake the ship, one mount is still gone.

### 3. The hull fight

Once the approach is open, the security pair deploys. If the players stay inside their craft and continue solving the problem with piloting, hacking, and vehicle weapons, remain in Action Time.

If players leave the craft in EVA gear or exos with long-range weapons, and security moves to oppose them, escalate to Bullet Time.

> **"Two figures just came over the curve. Suited. Mag-locked. One is marking Vantage. Both lasers are rotating with the mark."**

The security pair uses the ship, not empty space:

- Move below the hull's curve to break sight, then reappear somewhere useful.
- Force a sniper to move so the expert system can reacquire them.
- Protect a damaged laser until the pilots restore control.
- Mark one exposed operator so two mounts concentrate on them.
- Fall back toward the breach rather than die for a replaceable leased unit.

Let players use the same geometry. A mount blocks its own line of fire. The hull is cover. A disabled laser is a position. An airlock, antenna root, cargo ridge, or maintenance recess can keep one beam off them while leaving another in play.

Return to Action Time when the exposed tactical fight is decided and the remaining problem is reaching or opening the ship.

### 4. Make the entry

With a route through the lasers, the crew still needs a door.

- **Airlock:** Root cracks a system controlled by the human crew, not origin-17. Quiet if the defenders have lost the picture; defensible and reusable if taken intact.
- **Hull cut:** Slow and visible, but the crew chooses the compartment. The plasma lance opens one decisive hole and is then spent.
- **Cargo maw:** Built to open, built to move large loads, and obvious to both sides. The stevedores have had time to make it hostile.

The defenders can seal doors, vent compartments, and move through their own ship. Origin-17 does not interfere. Getting through the skin wins Scene 2; it does not make the interior safe.

## Carry the approach forward

Before moving on, record what the players changed:

- Which of the three lasers still works?
- Is the defense network on **ATTACK**, **DEFER**, or compromised?
- What is broken or damaged on the crew's vessel?
- Can their vessel still separate, maneuver, and make the slow trip home?
- Where is the entry, and can it be used as an exit?
- Where are the two security personnel?
- What do the pilots and stevedores know about the attackers?
- Did the approach cost minutes or hours?

Those facts are the opening situation aboard. Do not reset them because the scene changed.

The crew crosses the skin. Their assistant loses the interior picture. Origin-17, patient through all the shooting, finally has something close enough to touch.

Check your seals.
