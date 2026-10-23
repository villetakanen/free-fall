---
title: "Scene 2: The Approach"
---

# Scene 2: The Approach

The crew chose a plan in [Contact](/scenarios/northern-lights/contact/). Now make them fly it.

The *Njord's Whisper* is not helpless. Three leased point-defense lasers sit at equal points around her hull, their fields of fire overlapping across the ship's surface. Directly aft, the main engine masks a narrow approach from the lasers. That blind sector lies in the exhaust path. Coast through their envelope and they cut the crew's vessel apart one patient layer at a time. Go outside to stop them and two mounts with a clean angle can cut a person apart much faster.

Run the approach in **Action Time** while the crew acts through their vessel: piloting, hacking, firing rockets, finding angles, and managing damage. Escalate to **Bullet Time** when operators and the Whisper's security personnel meet outside the hull. The scene ends when the crew has made and secured an entry, not merely when they reach the ship.

## Carry the deployment into action

Use the positions and equipment confirmed in [Contact](/scenarios/northern-lights/contact/). Establish who is aboard the crew vessel, who has deployed outside it, who is crossing, and who has reached the target. Name their route, sightline, and working communication or hacking access. Suggested positions from the [briefing](/scenarios/northern-lights/briefing/) grant no free movement or automatic entry.

Vector can pilot from either deployment through an optical or RF link. Check line of sight for optical contact and shielding/interference for RF. A lost link prevents new remote commands; the assistant can continue the agreed flight plan. To change it through Vector, restore the link or reach local controls. Normal pilot Binding and action costs still apply.

Stitch can remain aboard in the Havoc and cross later, or accompany the first insertion under its own thrust. The Havoc does not fit the shuttle. A later crossing still takes time and a viable path through the defenses; record which opening admits the frame. The Tiger needs a line, shuttle, connected breach, or other transport. Root needs an actual electronic access path for remote work and a physical crossing for local work; The Wrench’s 5 cm reach does not grow because the target is visible.

Sable can scout separately or take point with the group. Resolve her approach before granting a perch or entry, and let her regroup if the route fails. Vantage’s cover follows his actual weapon sightline. Repositioning any operator requires movement through the current situation, not a cut to their proposed destination.

## What controls what (GM)

Keep the systems separate. The distinction is load-bearing.

- **Origin-17 controls navigation only:** the Whisper's committed trajectory, drive, and flight computer.
- **The six-person crew controls the ship:** sensors, communications, attitude commands, doors, airlocks, life support, cargo systems, and the authorization to use point defense.
- **The lasers control themselves:** the three leased mounts share a proprietary expert system, void-gapped from every other system aboard. The crew can tell it **ATTACK** or **DEFER**. It handles acquisition, aim, and fire.

Origin-17 permits the crew to rotate the Whisper for defense and permits a defensive main-engine burn against a detected aft approach. The burn spends scarce fuel; it is a real threat, not a free maneuver. A changed attitude does not threaten its destination. It does not fire the lasers, direct the defenders, or help the attackers. From its perspective, either crew can repair the damage later, and a freighter written off as piracy may disappear more cleanly than one merely missing. If an attacker reaches neural-interface range, origin-17 expects to take them over. Apart from permitting these defensive maneuvers, it waits.

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

All six are civilian spacers. All six can fight. Use [The Whisper's Crew](/scenarios/northern-lights/the-whispers-crew/) for their canonical profiles, knowledge, and morale.

- **Two pilots** handle sensors, attitude changes, communications, and point-defense authorization. Once the attack begins, they rotate the Whisper to bring a second laser into arc and keep the expert system fed with a clean picture.
- **Two security personnel** are the ship's door, not a hull picket. At most one suits up and goes onto the hull — to fire on an exposed attacker, or cover a stevedore working a mount — while the other holds the airlock or cargo door. When one is outside they protect mounts, flush attackers from cover, and mark targets for the expert system; otherwise they wait at the threshold and let the breach come to them.
- **Two stevedores** perform damage control, isolate compromised systems, move cargo across likely approaches, and prepare the interior against boarding. If the crew reaches them, they fight with the tools and weapons at hand.

The defenders act through human hands and human-scale tactics. The contract calls them compromised; in truth, they remain autonomous. Origin-17 has no system path into their weapons, and it does not care which side wins.

Use :term[Challenging] TN 11 for a professional action under pressure. Raise it to :term[Hard] TN 16 when two lasers hold the target, damaged equipment matters, or the character attempts the action from a genuinely bad position. Position changes the problem before it changes the number: masking a laser removes its attack rather than merely granting a bonus against it.

## Path A: High-velocity ram

The crew foams up and commits the whole vessel. The Whisper authorizes **ATTACK**, but a ram gives the defenders no reason to be on the hull and no time to get there — security stays inside, braces, and waits at the compartments to meet whoever survives the impact. The closing velocity leaves them only long enough to guess where the prow lands and pull people clear of it.

The assistant has already chosen a target, and offers it with the same cheerful precision it brings to everything:

> **"If we're ramming, ram people. Schematic puts the whole crew in the pressurized cab — take the sleeping compartment or the control deck. Either one caves and dumps to vacuum on impact; whoever's inside stops being a problem before you're unbuckled. The modules up front are cargo and don't shoot back — hitting those just spends the prow."**

It is not wrong, and that is the trouble with it. Let the crew take the recommendation or override it; whatever impact area they commit to is where [Scene 3](/scenarios/northern-lights/onboarding/) opens. The one cost the assistant cannot price is the one thing it does not know is aboard — and the "inert cargo" it dismisses up front is exactly where that thing has been waiting.

Before committing, bring everyone riding the ram into the cabin’s crash protection. Exterior deployments aboard this vessel wait until after impact. Record anyone already detached, crossing, or aboard the Whisper separately; they do not ride the collision.

Run the ram as three Action Time exchanges. Vector makes one Vehicle Handling roll in each through her working link from a protected position; the helm is optional. If she is elsewhere and loses that link, pause her remote commands and establish what the assistant’s existing course does while the crew restores contact or reaches local controls. An absent Vector supplies no Vehicle Handling rolls: use the actual operator’s prerequisites and available assistance under the normal rules. Between those rolls, every other player gets one consequential action from their actual position: hack a reachable network, fire a controlled rocket cannon, operate point defense, manage damage, refine the impact solution, or invent something better.

### 1. Choose the line

The Whisper begins rotating. Vector puts the titanium prow toward the target and chooses which part of the laser envelope to cross.

- **Success:** One mount has a clean opening shot. The crew chooses the intended impact area.
- **Greater success:** One mount can see them, and it acquires late. Give the crew the first action before it fires.
- **Failure:** The rotation catches them between arcs. Two mounts can fire, and the crew must disable one, break the geometry, or take concentrated attrition.

Ask everyone else what they do with the seconds the pilot bought. A controlled rocket cannon can remove a mount. Root can attempt a brief **DEFER** through a reachable interface. Vantage can work available ship weapons from protection; a detached Vantage with a clear line can use his long gun. Stitch can keep systems alive if she is there to reach them. Sable can report a breach route from whatever position and observations she actually has.

### 2. Hold the run

The range collapses. The assistant keeps calculating; the operator must keep the prow between the crew and the beams while the Whisper rolls under them. Vector can do that remotely while her link holds.

- **Success:** The prow holds. Apply any laser damage to the ram shield or a declared external system.
- **Greater success:** Vector breaks one mount's track or presents a firing solution to an ally. The next action against that mount has the advantage of surprise and position.
- **Failure:** A beam walks off the prow. Break or damage a weapon, sensor, thruster, or another system that matters. If the same hull section has already been hit, the damage reaches the crew compartment.

Do not make a failed roll end the ram. It makes arrival worse.

### 3. Place the impact

The Whisper fills the forward view. Crash foam fires. Everyone riding inside disappears into white. Detached operators remain where their own movement took them.

- **Success:** The prow enters the chosen compartment. Those riding the ram arrive together, protected by the shield, with the breach where they wanted it.
- **Greater success:** As above, and the wrecked prow leaves a defensible route back into their vessel.
- **Failure:** They still breach. Put them somewhere costly: the wrong compartment, a partially collapsed access, a venting cargo space, or directly beside the security pair. Inflict appropriate :term[Harm] for any protection the lasers already stripped away.

The ram always costs stealth and a clean separation. Their vessel is now lodged in the Whisper. What the players decide is how much of it still works, where it lands, and how many defenders are waiting at the hole.

## Path B: Infiltrate, then strike

Ghost, active sweep, a cold shuttle, suited operators on lines, a false transponder: these are variations of one plan. Earn a path past the lasers or neutralize the mounts covering the crossing.

### 1. Establish position

Carry forward what Scene 1 bought. The assistant’s percentages are fictional estimates, not dice procedures. Reserve Vehicle Handling checks for concrete contested maneuvers with stated stakes; see [When the pilot rolls](/scenarios/northern-lights/contact/#when-the-pilot-rolls).

- **Ghost, successful positioning:** One success on **Vehicle Handling, Hard (TN 16)** establishes a hidden vector behind the main engine and a manageable relative speed at boarding distance. Greater Success also preserves a usable breakaway vector. Coast in without another routine roll. Carry the passive observations forward; the network remains on **DEFER**, and the engine masks the laser arcs. They can attempt entry from this position without first destroying the guns. This does not grant an open hatch or a free breach.
- **Ghost, failed positioning:** The Whisper detects the aft approach and prepares a defensive engine burn. Telegraph drive activity and give the crew a chance to break away before ignition. The concealed coast is lost; do not turn failure into automatic incineration. The immediate alternative is to destroy or disable the point defenses covering a shuttle crossing, then send the shuttle. Resolve that fight below. The burn costs the Whisper scarce fuel, but the crew cannot count on fuel shortage to save them. Other workable responses remain possible; keep each operator’s actual transport constraints.
- **Active sweep, concealed by the hacker:** The crew knows all three mount positions and likely breach points. The network remains on **DEFER**. Concealing the sweep does not conceal every subsequent action.
- **Active sweep, detected:** A failed concealment hack—or a sweep without concealment—still yields the information. The Whisper tracks and challenges the crew; the network remains on **DEFER** until hostile action or an openly approaching boarding craft prompts **ATTACK**. Let the crew answer, bluff, withdraw or commit.

For sweep concealment, use **System Cracking, Hard (TN 16)** through the crew vessel’s communications array to the Whisper’s RF traffic-identification interface, connected to civilian sensor processing. One success masks this sweep as routine navigation traffic; Greater Success also reveals sensor coverage and a useful crossing angle. Apply normal software bonuses and compromise when using a program; the Skill also permits improvisation without one. Players can invent other remote-comms hacks. Establish reachable systems, effects and stakes, then set an appropriate TN; see [Concealing the sweep](/scenarios/northern-lights/contact/#concealing-the-sweep). This interface does not connect to the void-gapped guns or grant navigation control.

For another plan, state the same bargain: what does it reveal, what does it conceal, and what causes the Whisper to choose **ATTACK**?

### 2. Assign the first strike

Show the players the three mounts and ask how they divide the work. They can hack the shared network, shoot individual lasers, launch rockets, move physically to the hardware, or combine methods.

Resolve the first strike simultaneously. Reward coordination honestly:

- Every disabled mount changes the hull geometry for the rest of the scene.
- A successful network intrusion can hold all three on **DEFER**, but only while the crew maintains the lie or lockout.
- A missed shot, failed intrusion, rocket launch, or clearly hostile crossing triggers **ATTACK**.

Do not turn partial success into no success. If they disable one mount and wake the ship, one mount is still gone.

### 3. The hull fight

Once the approach is open, the defenders answer it — but sparingly. At most one security officer comes onto the hull, and a stevedore may follow to service a knocked-out mount; the second security officer holds the airlock or cargo door and does not leave it. If the players stay inside their craft and continue solving the problem with piloting, hacking, and vehicle weapons, remain in Action Time.

If players leave the craft in EVA gear or exos with long-range weapons, and security moves to oppose them, escalate to Bullet Time.

Name an operator who is actually exposed and visible to the defender, then report the threat:

> **"One figure just came over the curve. Suited, mag-locked, carbine up — and marking your position. Both lasers are rotating with the mark."**

The security officer on the hull uses the ship, not empty space:

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

## Start the boarding clock

When the first contractor gets inside the Whisper, start the [boarding threat clock](/scenarios/northern-lights/the-intercept/#boarding-threat-clock) at **3:00**. A scout reaching the hull alone has not entered. If someone entered earlier in the approach, keep the clock already running; a later group does not restart it. Advance at unresolved narrative junctions as described in the clock reference, not for every crossing or action.

## Carry the approach forward

Before moving on, record what the players changed:

- Which of the three lasers still works?
- Is the defense network on **ATTACK**, **DEFER**, or compromised?
- What is broken or damaged on the crew's vessel?
- Can their vessel still separate, maneuver, and make the slow trip home?
- Where is each operator, what route have they secured, and who still needs to cross?
- Which optical/RF links and hacking access paths work from those positions?
- Where is the entry, can it admit the deployed frames, and can it be used as an exit?
- Where are the two security personnel?
- What do the pilots and stevedores know about the attackers?
- Did the approach cost minutes or hours for travel and resource purposes?
- Has anyone entered and started the story clock? What stage and warnings are already established?

Those facts are the opening situation aboard. Do not reset them because the scene changed.

The first boarders cross the skin; operators covering outside or waiting aboard remain there until they move. Their assistant loses the interior picture. Origin-17, patient through all the shooting, finally has something close enough to touch.

Check your seals.
