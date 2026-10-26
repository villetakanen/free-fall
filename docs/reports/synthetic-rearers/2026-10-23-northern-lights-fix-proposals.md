# Northern Lights — minimum completion inventory

Created: 2026-10-23 · Updated: 2026-10-23 · Status: **Completion goal agreed; individual fixes under review**

Source: [Aspiring GM report](2026-10-23-northern-lights-aspiring-gm.md). Source revision checked: `36eea459ea7d9eee5cc0b87929caff30d9b7a20e` (`dev`).

## Purpose and session contract

This is the persistent minimum completion inventory and decision log across scenario content, shared rules, catalog contracts, and delivery guidance. **“Runs out of the box” and “no prep beyond reading the GM pages” are the acceptance goal. Preserve that goal and supply what is missing to fulfil it.** The reader report is evidence of gaps; its proposed remedies are not automatically requirements. It is not an approved spec or an implementation backlog yet. Implementation has begun for the accepted Vantage decisions only; see the execution record below. The other completion gaps remain under review.

- Keep the IDs below stable. Record decisions here before implementing dependent work.
- Each fix owns one observable outcome and should fit one reviewable commit. Related pages belong in the same fix when leaving them inconsistent would break that outcome.
- Before implementation, confirm or refine the owning spec and create/link the GitHub issue through the repository's `/spec` and `/plan` workflow. Do not treat this file as a substitute for either.
- Update each row's status and issue link as work proceeds: proposed → accepted → specified → issued → implemented → verified. Use deferred or rejected with a reason where appropriate.
- Record implementation revision and validation evidence in the session log. Recheck the actual source at the next session; this report describes one revision.
- Preserve the original reader report as historical evidence. Synthetic reader judgments do not establish encounter balance, session duration, or human reactions.

The initial GitHub lookup failed; subsequent access succeeded. Open issues were checked and [issue #72](https://github.com/villetakanen/free-fall/issues/72) now tracks the accepted Vantage changes. No overlapping implementation issue was found.

## Decisions and recommendations

D3 is accepted as described below. Other recommendations remain unsettled unless explicitly recorded as accepted.

| Decision | Recommendation | Why / affected fixes |
| --- | --- | --- |
| D1 — reveal authority (implemented) | Successful read elevates the character to a privately known THESEUS operative designation. Personal records remain but ordinary access displays CLASSIFIED — N/A; only the CSA marine commander can read the hidden OPSEC designation. | Player controls speech/actions. BLACK access is optional; later device intrusion separately governs transmission. F03 / #74. |
| D2 — story clock (accepted) | Start on entry to the Whisper; advance at narrative junctions when the crew stalls. Lab breach retires the boarding clock and brings final approach to at least 10:00, preserving later stages and consequences. | AW-style narrative pressure, not a fixed six-hour countdown. Clarifying questions are not stalling; player acceptance of the read/orders/support is never a required tick. F04. |
| D3 — Vantage configurations (accepted) | Wraith pilot Binding Ghost 3; Neural Link Ghost 3 required for both Wraith and deck; citizenship gear Ghost 1. Wraith and deck are alternative active configurations. | Initial Ghost 8 − 3 − 3 − 1 = 1 in the Wraith. Owning all the toys does not mean running them together. F06; F02a. |
| D4 — Root in transit | Prefer explicit support in the vessel's acceleration berth, scoped to transit, that makes every pregen's starting load legal. | Preserves Root's augmentation concept. The exact supported cost/allowance is not chosen; do not silently deactivate installed augmentations. F07. |
| D5 — Binding boundaries | Decide ordinary voluntary overbinding and forced permanent Binding separately; define equality, overflow, and recovery after a cap changes. | Root's transit and The Singularity expose different cases. Neither negative Current Attributes nor automatic possession should be invented as an implementation convenience. F08, F09. |
| D6 — sharing | Make existing character URLs player-facing and move future-scene guidance to a separate GM page, using the current manifest. | Produces links a GM can send without introducing permissions or a new rendering system. F02. |

## Fix register

F01 is withdrawn by user decision. D3 and citizenship player knowledge/cost are implemented and verified locally under #72; F02 is only partially addressed because other boundaries remain under review. Other fixes remain proposed; accepting the completion framing does not approve their specific remedies. Issue and implementation links are pending.

**Minimum completion:** F02–F13 address missing or conflicting material needed to run the scenario. F08 is an enabling rules decision.

**Supporting improvements:** F14, F15, F17 and F18 cover navigation, clarity, editorial and authoring improvements. F16 was promoted to required briefing material by the user: three player-facing schematics. Other improvements are not automatically completion blockers.

**Work type:** F03/F04/F07/F08/F09 require decisions about conflicting or absent intent. F02/F05/F06/F10–F13 require supplying or reconciling material, with concrete design choices still to agree. No unresolved choice is silently approved by appearing in this inventory.

| ID | Outcome | Priority | Dependencies / decisions | Status |
| --- | --- | --- | --- | --- |
| F01 | Lower the readiness claim | Withdrawn | Preserve readiness as the goal | Rejected |
| F02 | Provide five shareable character pages | Hosting blocker | D6 | Proposed |
| F03 | Align the reveal instructions and handouts | Hosting blocker | D1; issue #74 | Pushed: 906b73e |
| F04 | Govern CSA escalation with a boarding story clock and lab handoff | Hosting blocker | D2; issue #75 | Pushed: 1e8fbcc |
| F05 | Give approach detection an executable procedure | Hosting blocker | F04 for time consequences | Pushed: 1e8fbcc |
| F06 | Make Vantage's equipment prerequisites and totals valid | Hosting blocker | D3; issue #72 | Pushed: 906b73e |
| F07 | Make transit and boarding configurations legal for every pregen | Hosting blocker | D4; F06; F08 if invoking a new general rule | Proposed |
| F08 | Define the shared Binding boundary contract | Rules decision | D5 | Proposed |
| F09 | Complete The Singularity's cost at capacity | Hosting blocker | F08; D5; #88 | Implemented locally |
| F10 | Finish lab intrusion and shielding procedures | Hosting blocker | F03; #89, #94 | Implemented locally |
| F11 | Make the mistaken contract and intervention consequences runnable | Hosting blocker | F10 | Proposed |
| F12 | Supply runnable marine profiles | Hosting blocker | F08 where relevant | Proposed |
| F13 | Finish confrontation, escape, and aftermath | Hosting blocker | F04, F09, F11, F12 | Proposed |
| F14 | Replace stale appendix references with working links | Quick correction | None | Proposed |
| F15 | Distinguish Current Attributes from Action Pool | Shared correction | None; reconcile resource values after F06–F09 | Proposed |
| F16 | Supply the three player-facing briefing schematics | Required briefing material | Crew vessel, shuttle, manifest-based target/cargo; geometry verification | Accepted; assets pending |
| F17 | Replace predicted player reactions with GM-useful cues | Editorial | F03, F04, F13 | Proposed |
| F18 | Add a focused scenario readiness review contract | Recurrence prevention | Lessons from F02–F17 | Proposed |
| F19 | Scene 0 and five player-chosen initial deployments | Accepted addition | Approved pairs; issue #73 | Pushed: 906b73e |

## Atomic scopes and acceptance

### F01 — Withdrawn: changing the readiness claim

The user rejected this remedy: unfinished work is the reason for this exercise, not a reason to amend the goal. Preserve the overview's readiness promise as the acceptance criterion. This ID remains only to prevent future sessions from reviving or renumbering the rejected proposal.

**Completion target:** a GM can prepare by reading, run meaningful player choices using the supplied material, and reach a resolution without designing missing rules or encounters.

### F02 — Player-facing pregens

**Review protocol agreed:** assess each information boundary independently, one per conversational turn. Agreement with player-facing sheets does not authorize moving every scenario note. For each boundary, record what the character knows, what the player receives, what remains GM-only, and verify against related source passages before changing content.

**F02a — Vantage citizenship (implemented):** EU Full Citizen, Class A is already public identity. Confirmed player knowledge: Vantage knows they are virtually untouchable because harming them carries commercial consequences. Earlier diplomatic framing is superseded; the player-facing sheet now explains it. GM-only information: this CSA squad's specific capture restriction and how its identification equipment applies it. Sources checked: Vantage's identity, biography and “The one they take alive”; marine orders and “IFF and identity checks.” The specific capture instruction now lives in the marine reference; the other GM notes remain for independent review.

**Accepted mechanical decision:** represent citizenship as gear binding Ghost 1. Vantage knows commercial consequences make him virtually untouchable; the user describes his attitude as “it's all an MMORPG to you.” Wraith pilot Binding becomes Ghost 3; the shared Neural Link binds Ghost 3 and is required for either Wraith or deck use. Wraith and deck are alternative active configurations. Initial Ghost 8 minus 7 Binding leaves Ghost 1 in the armor, deliberately almost exhausting that Attribute. This supersedes the exploratory Wraith Ghost 2 proposal. Implementation must document the citizenship effect without silently inventing literal damage immunity, and settle recognition/IFF interactions. Catalog and sheet changes are now implemented under #72.


**Scope:** five `c-*.md` pages, a proposed `gm-character-notes.md`, and the overview manifest/sharing guidance. Owner: scenario spec.

Move hidden causes, future encounters, tactical secrets, and author-facing spotlight instructions into the GM reference. Keep identity, known relationships, usable equipment, and starting rules on each character page. Link the overview directly to the five shareable pages. A collapsed GM section on the same page does not solve this sharing problem.

**Done when:** a reader can open each supplied character URL without learning the hidden array mechanism, override, marine arrival, or secret capture exception from its body. Inspect visible navigation too and record any spoiler-bearing labels. Ordinary links are not secrecy controls; access restrictions are outside this fix. Manually review disclosure rather than testing exact prose.

### F03 — One reveal sequence

**Scope:** `preface.md`, `the-lab.md`, `the-read.md`, `mission-override.md`. Owner: scenario-specific intent to capture under the scenario spec.

Write one compact GM sequence identifying trigger, observable signs, private information, device intrusion, verifiable evidence, and optional offer. Reconcile the preface against D1 and link to the authoritative encounter instead of duplicating its mechanics. Also reconcile the lab's permission to display the directive/discuss the experience with the private handout's rule about sharing its text.

**Done when:** a walkthrough of successful read, resisted read, blocked transmission, and openly cooperative player produces no contradictory instructions or compulsory betrayal. Mechanical thresholds remain F09/F10's work.

### F04 — Boarding story clock and lab handoff

**Scope:** `contact.md`, `the-approach.md`, `onboarding.md`, `the-intercept.md`, and timing transitions in `the-lab.md` / `the-second-boarding.md`. Owner: scenario intent.

**Accepted D2:** start an Apocalypse World-style threat clock when the crew enters the Whisper. Advance at narrative junctions where the crew hesitates, circles back or leaves a situation unresolved, introducing corresponding CSA developments. Questions needed to understand the situation are not stalling. Exact stage contents and starting mark remain to specify.

Lab breach ends the boarding pacing mechanism and brings final approach to **at least 10:00**. If the clock has progressed further, retain the later stage and its consequences; never undo an arrival already established. Final alignment and impact develop while the crew handles Origin-17. The read, transmission, acceptance of orders and use of BLACK support are not required clock triggers. Effective player intervention can change the threat's course.

Reconcile the older fixed-six-hour promise and the claim that arrival must coincide with successful override verification. The CSA was already inbound; neither the lab breach nor the override summons it. Approach consequences still include position, concealment, damage and warning; do not keep incompatible literal arrival-time promises.

**Done when:** trace stalled boarding, rapid lab arrival below 10:00, lab entry after 10:00, an already-resolved arrival, and blocked/refused override without resetting events or forcing player decisions. Fictional durations remain relevant to travel and resources but do not secretly turn this pacing tool back into a stopwatch.

### F05 — Detection the GM can resolve

**Scope:** approach options in `contact.md` and execution in `the-approach.md`. Owner: scenario intent; reuse core action rules.

Label the assistant's precise percentages as fictional estimates. Define when detection is automatic, when uncertainty calls for a check, who rolls against what TN, and how each outcome affects information/position. Reuse the existing d20 procedure; do not invent percentile dice. Implemented: both baseline concealment rolls use Hard TN 16; the RF interface, result branches and player-invented hacks are defined in Contact and Approach. See the final accepted procedure below.

**Done when:** each approach and one improvised approach can be adjudicated without converting `0.03%` or `8.12%` into an undocumented roll. Time consequences use F04.

### F06 — Vantage's usable deck

**Scope:** `c-02-the-operator.md`, Wraith catalog cost/prerequisite and its consumers, and citizenship gear representation. Read Combat Deck, Neural Link and weapon catalog entries as authority. Owner: scenario content plus catalog spec for the accepted Wraith contract change.

Apply accepted D3: Wraith Ghost 3, shared required Neural Link Ghost 3, citizenship Ghost 1; deck and Wraith are alternative active configurations. Allocate Load Bearing explicitly and recompute weapon choices in the Wraith and a separate deck configuration, including optional Ghostlink activation. Correct “sixteen points” in the same sheet correction: the listed Initial Attributes total 26. Do not change catalog prerequisites just to accommodate the example.

**Done when:** every active item has its required interface, every allowance is applied at most once to eligible load, and all configuration resource totals can be reproduced from the catalog and documented citizenship gear. Display the Combat Deck's restricted temporary Mind benefit separately from ordinary Current Mind.

### F07 — Legal start and transitions for the whole crew

**Scope:** `the-vessel.md`, all five pregens, and starting/boarding instructions. Owner: scenario intent.

Audit transit, active piloting, boarding, and optional loadouts, including pilot costs and personal equipment. The accepted passenger fix (#83) removes the scenario-local Body 2 surcharge: Root’s passenger Body capacity is `6 − 5 = 1`. Audit how active piloting and boarding configurations change the remaining costs. Releasing Binding changes a cap; do not assume it also restores spent points.

**Done when:** a five-character configuration table accounts for prerequisites, installed augmentations, Load Bearing, vessel costs, current values, and maximum current values. No starting configuration depends on an undocumented exception. This is an audit of authored sheets, not a new character-builder feature.

### F08 — Shared Binding limits

**Scope:** `03-core-rules.md`, relevant registry definitions, and `specs/free-fall-core-rulebook/spec.md`; inspect the SRD but change it only if the decided rule belongs to its abstraction level.

Decide what equipping/installation may bind, what zero remaining capacity means, what happens when a cost is forced above capacity, and what happens to Current points when Binding rises or falls. Distinguish inability to equip from consequences of forced effects. Also reconcile the chapter's statements that Broken gear Binding remains until unequipped/uninstalled and “until repaired or uninstalled.”

**Done when:** the contract answers equality, overflow, breakage, removal, and recovery without contradictory passages. Use worked boundary examples as editorial validation; only add automated checks if there is actual executable rules logic to test.

### F09 — The Singularity's complete risk

**Scope:** offer text in `the-lab.md` and `the-read.md`; link from marine guidance. Owner: scenario intent, dependent on F08.

Define how accumulating permanent Ghost Binding interacts with existing Binding, equality, and overflow; multiple natural 1s in one attack must have an explicit outcome. State the effect before accepting the BLACK offer. Preserve the established agency contract unless the user explicitly chooses a different design.

**Done when:** zero, one, and several natural 1s resolve both below and across the threshold; disconnection and later attempts are covered. The GM does not invent possession, death, or a silent cap.

### F10 — Complete the intrusion encounter

**Scope:** `the-lab.md`; reuse `hacking-and-cyber-warfare.md` and its spec. Owner: scenario intent.

Supply target TNs, defenses, opening and follow-up action timing, and intact/damaged shielding reach. State opportunities to interrupt, disconnect, or withdraw. Preserve the existing allocation and program-compromise rules.

**Done when:** run the opening volley and later device intrusion with ordinary dice resolution and no “roll until the plot happens” loop. Both successful and prevented intrusions advance the scenario.

### F11 — The mistaken contract and intervention consequences

**Scope:** lab mission procedures and their links to the briefing. Owner: scenario intent.

Define requirements, access, actions/duration, opposition, costs, and failure consequences for extracting logs, isolating the array, moving it, purging it, and physically destroying it. Explain which actions satisfy which contract objectives; destruction is not automatically log extraction.

**Done when:** the GM can reveal the mistaken premise, adjudicate credible intervention attempts and track exposure evidence/consequences without inventing a guaranteed clean completion route. Procedures remain usable if CSA arrives early or the override never transmits. Unexpected bargains, buyers and escapes remain open.

### F12 — Four runnable marines

**Scope:** `the-csa-marines.md` and scenario-local equipment only. Owner: scenario intent; existing hacking rules remain authoritative.

Complete each role's actions, Attributes/reserves, weapons, defenses, software, access constraints, and custom frame statistics. Retain analog voice command, hackable endpoints, IFF bonuses/suppression, and Vantage's capture exception. Separate base defenses from the IFF modifier so the final TN is unambiguous.

**Done when:** each marine can take and receive one physical attack and one relevant hacking effect without inventing numbers. Check configurations with and without IFF. Mechanical completeness does not establish balance; do not promote custom equipment to the global catalog as part of this fix.

### F13 — A confrontation that ends

**Scope:** `the-second-boarding.md`, marine withdrawal triggers, proposed `aftermath.md`, and overview manifest. Owner: scenario intent.

Define starting positions, objectives, escalation, retreat/rout triggers, and escape requirements. Supply concise consequences for purge, protection, escape with survivors, refusal of both contracts, and defeat/capture, including logs, payment, surviving civilians, and the array's fate. Cover the advertised three-to-five-player range through explicit opposition guidance rather than an assumed five-person party.

**Done when:** the GM can run the expected confrontation and likely aftermaths, and adjudicate unexpected outcomes from faction knowledge, interests, access and consequences rather than force a listed ending. Both three- and five-player configurations receive a tabletop dry run; human playtesting remains required for balance and the three-to-five-hour claim.

### F14 — Named links instead of appendix codes

**Scope:** stale authored references across `content/scenarios/`, plus obsolete live examples in the scenario spec. Historical deprecation notes and the reader report remain historical evidence.

Replace A.01/A.02/B.01 with descriptive absolute scenario links to the actual destination. Check headings and anchors. The content pipeline rewrites relative scenario links toward the core rulebook, so ordinary relative page links are unsuitable here.

**Done when:** active scenario prose no longer requires interpreting appendix codes and every replacement route/fragment resolves in the built site. Do not test exact link labels.

### F15 — Resource terminology readers can distinguish

**Scope:** five pregens, example characters in `02-characters-and-crews.md`, and relevant registry/rules explanations. Owner: core rulebook and scenario specs.

Use the established term **Current Attributes**, distinguishing it from **Maximum Current Attributes** and the separate **Action Pool**. “Available Attributes” from the report is a suggestion, not an established replacement term. Show Action Pool and Harm Slots where missing from usable sheets, using the actual rules.

**Done when:** examples and pregens distinguish spendable points, their Binding-adjusted ceiling, dice, and Harm Slots. Reconcile values after loadout fixes. Review terminology manually rather than locking labels into tests.

### F16 — A schematic that supports decisions

**Scope:** `njords-whisper.md`, scenario assets, and links from boarding/lab/confrontation scenes. Owner: scenario spec; follow `DESIGN.md`.

Provide a compact compartment schematic with forward/aft, entry points, hatches, pressure boundaries, the lab modules and narrow gap, and tactically relevant sightlines. Include an equivalent text description. Resolve geometry from scene prose before drawing; do not invent contradictory rooms for visual convenience.

**Done when:** the GM can trace each entry to the lab and an escape route, identify pressure boundaries, and determine the sniper's possible sightlines. Verify rendered legibility at narrow and wide widths. No new map engine is implied.

### F17 — Actionable editorial pass

**Scope:** preface, contact, GM character notes, and repeated scene endings.

Replace assurances about what players will feel or discover at the “right moment” with observable cues, information the GM can provide, and consequences. Reduce repeated closing slogans while preserving the established voice. Keep a brief thematic intention where it helps improvisation.

**Done when:** the GM has useful material for unexpected reactions without being instructed to produce a particular emotion. This is editorial review, not an automated copy test.

### F18 — Preserve the lessons in authoring guidance

**Scope:** scenario spec and existing scenario-content-creator references; consider gear guidance only if this work demonstrates a missing consumer-check requirement.

Add focused completion criteria for fulfilling the readiness promise, shareable character material, complete starting configurations, one clock, executable mission objectives, and an ending. Existing scenario skill instructions already call for mechanical and continuity audits; extend gaps rather than duplicating them. Record which checks are manual and which existing build/link/schema checks cover them.

**Done when:** a future author can perform the same readiness review without this report. Do not introduce a structured loadout schema, audience permission system, generalized rules engine, or new dependency without a separate demonstrated need and spec.

## Suggested review and delivery order

1. **Continue F02 — player-facing pregens.** Citizenship boundary and initial deployments are implemented. Other scene disclosures still need their independent review. The overall D6 arrangement remains a recommendation.
2. **Settle conflicting intent:** F03/D1 and F04/D2; settle the Binding and configuration decisions D3–D5 with F06–F09.
3. **Supply missing playable material:** F05, F10, F11, F12, F13, respecting the dependencies in the register.
4. **Verify the complete experience:** walk from character selection through transit, boarding, mission decisions, confrontation, and aftermath. Record any further essentials discovered.
5. **Improve and retain learning:** F14–F18, prioritised by actual preparation friction. Small corrections can accompany relevant work, but do not substitute for completing the scenario.

This is a discussion sequence, not authorization to implement or create GitHub issues. Each accepted fix still needs the repository's spec/issue workflow. “Next issue” in this review means the next completion gap to discuss; no GitHub issue has been selected.

## Validation and completion gate

- For this proposal: check source references and decision/dependency consistency. No application tests are required for a proposal-only Markdown file.
- For content implementation: run the scenario skill's app build and applicable typecheck; complete the issue's required project checks (`pnpm build`, `pnpm lint`, `pnpm test`, `pnpm typecheck`). Test behavior, link validity, and schemas; never static copy.
- For resource changes: manually reproduce all five starting configurations, optional equipment states, pilot costs, and Binding threshold examples. Do not confuse a positive cap with replenished Current points.
- For scenario completion: dry-run fast ram, slow Ghost/early CSA, blocked override, rejected support, purge, protection, escape, and defeat. Record unresolved adjudication gaps.
- For player delivery: open all five character routes and verify disclosure boundaries and necessary play information. For the schematic: inspect the actual rendered asset.
- Human playtest evidence is still needed for difficulty, emotional response, and elapsed session time. Record it separately from synthetic review.

## Decision and session log

| Date | Decision / work | Evidence / next state |
| --- | --- | --- |
| 2026-10-23 | Created proposal at user request; all F01–F18 remain proposed. | Report and source checked at `36eea45`; shared “Current Pool” wording also found in core example characters. No content implementation, spec changes, or issues created. |
| 2026-10-23 | Existing issue overlap not verified. | GitHub API connection failed. Check before creating implementation issues. |
| 2026-10-23 | User accepted the pivot to a minimum completion inventory; F01 rejected. | Readiness remains the goal. Separate essentials from improvements and design decisions from missing implementation. Other fixes and D1–D6 remain proposals. Next discussion: F02. |
| 2026-10-23 | User requested independent, turn-by-turn review and verification of every boundary change. | F02a citizenship is the first discussion; citizenship-as-gear is an exploratory idea, not an accepted cost. No scenario content edited. |
| 2026-10-23 | Accepted D3: Wraith Ghost 3 + shared Neural Link Ghost 3 + citizenship Ghost 1; alternative Wraith/deck use. | Ghost 1 remaining in armor is intentional. Supersedes Ghost 2 proposal and earlier assumptions about simultaneous deck use or no Wraith implant prerequisite. Catalog/sheet implementation pending. |

Next session: read this log, preserve the readiness goal, continue reviewing completion gaps, confirm current source and existing issues before implementation, and spec/issue only accepted work.

### Accepted — Vantage's Ghost budget and configurations

- Wraith pilot Binding: **Ghost 3** (catalog updated from 4).
- Neural Link: **Ghost 3**, shared prerequisite for Wraith and Combat Deck. Wraith prerequisite is now explicit in the catalog.
- Citizenship gear: **Ghost 1**. Commercial protection is known to Vantage and shapes his attitude to risk.
- Wraith and deck are alternative active configurations, not concurrent equipment bonuses. The implant remains installed in either configuration.
- In the armor: **8 − 3 − 3 − 1 = 1 maximum Current Ghost** before any other effects. This scarcity is intentional.
- Wraith's conditional Mind 1 and applicable Load Bearing still need complete configuration accounting; no additional changes to them were agreed here.

Verified the complete authored loadout arithmetic, prerequisites, allowance allocation, and changed route links. Catalog and scenario text now implement these decisions. Encounter balance still requires playtesting.

## Execution record — issue #72

2026-10-23: User requested implementation of all agreed Vantage changes. Updated the existing gear and scenario specs before creating [#72](https://github.com/villetakanen/free-fall/issues/72), then implemented:

- Wraith catalog: Ghost 3 pilot cost, Neural Link prerequisite, separate implant cost, eligible active Ghostlink Mind allowance, and no integrated Combat Deck.
- Vantage: installed link, scenario-local citizenship gear Ghost 1, alternative frame/deck configurations, weapon allowance allocations, temporary deck resources and non-refilling transitions. Corrected Initial Attribute total to 26.
- Citizenship: player knows commercial protection; squad-specific capture instructions moved to the marine reference. Recognition survives IFF loss. Standard bound-gear breakage covers Compromise without creating physical immunity.
- Marines: Wraith comparison updated to the catalog and implant prerequisite.

Verified personal Body/Mind/Ghost ceilings: heavy overwatch **7/6/1**, long quiet **12/6/1**, tactical support (deck + Light Lance, out of frame) **12/4/4**. Frame allowance covers the attached weapon; link allowance covers the active interface or deck exactly once. Citizenship and implant Ghost costs remain bound across transitions.

Validation: `pnpm build`, `pnpm lint`, `pnpm test` (52 tests), and `pnpm typecheck` passed. Built Vantage, marine and exos routes plus their internal links/fragments were checked. No copy assertions or new dependencies added. Other player/GM boundaries and full scenario readiness remain open; this is not completion of F02 or the entire inventory. Changes are local and uncommitted; no deployment claimed.

## Scene 0 positioning — agreed direction, individual choices under review

2026-10-23: User accepted F02b's boundary: Vantage's habitual overwatch belongs with the player; the second-boarding timing and assumed spine position belong with the GM, conditional on actual player positioning. Not implemented yet.

User expanded the direction: every character gets two possible starting positions, discussed by the players at a briefing / Scene 0. Review each pair independently before implementation. These are initial deployments, not positions assigned for a later reveal. This is new scenario work requiring a spec refinement and issue before implementation.

Source verification: Contact currently opens with everyone arriving aboard the crew vessel after the burn, outside point-defense range. The Approach then handles crossing, entry and a ram in crash foam. A briefing must preserve that geography: suggested positions on the target are intentions until the approach actually reaches them. The current claim that the job cannot be planned in advance needs narrowing to distinguish a provisional crew plan from choices requiring live sensor data.

Proposed procedure: Scene 0 establishes the known contract, provisional stations, selected gear, who covers whom, and a regroup point. Contact supplies live information and allows revision. Each character's pair should offer different useful responsibilities without prescribed attitudes or future spoilers. Players may propose another feasible position. High-thrust/ram safety constrains when exterior stations can be occupied.

Accepted pair, Vantage (user confirmed): (A) external overwatch from the crew vessel, deploying once thrust/approach conditions allow; (B) with the boarding team at its chosen entry, covering the crossing and advance. Both may use Wraith and a chosen weapon; position does not automatically select deck versus frame. A target-hull perch must be reached in play. Under ram, he starts protected inside and deploys after impact. Benefits and limits must follow real sightlines and access.

Vector’s revised pair is also accepted below. Root, Stitch, and Sable remain to review. No new starting positions or Scene 0 text have been added to published content.

2026-10-23: Vantage pair accepted: external overwatch from the crew vessel versus accompanying the boarding team at its chosen entry. Record as accepted, implementation pending with Scene 0.

Vector pair proposed, not yet accepted: (A) helm of the crew vessel, handling positioning and damaged-flight contingencies; (B) boarding staging area in the Tiger, joining the entry team once a crossing is possible, with the ship assistant handling routine flight. Source checked: the assistant can fly the vessel; the ram procedure explicitly uses Vector's Vehicle Handling; the Tiger has grapplers but no EVA thrusters. A ram keeps Vector at the helm until impact, then permits boarding. A separate crossing requires a line, shuttle, or other established transport. The options are initial responsibilities, not a permanent split party or remote piloting ability invented for the Tiger.

2026-10-23: Vector revised pair accepted. Piloting requires an optical or RF link, not a seat at the helm. (A) crew-vessel exterior, covering deployment while directing flight; (B) boarding team in Tiger, directing insertion while linked and providing close-quarters capability. Optical contact depends on sightlines; RF depends on shielding/interference. Routine flight can be handed to the assistant; link loss does not erase an existing flight plan. Ram requires impact protection, not a helm seat. This supersedes the helm-versus-boarding proposal above. Implementation pending with Scene 0.

Next pair proposed: Root at a systems station inside the crew vessel versus accompanying the boarding team to the chosen entry. Remote position offers sheltered systems work only through established reachable interfaces; being beside target hardware enables physical access and The Wrench within 5 cm, subject to shielding. Neither implies arbitrary remote access to isolated systems. Dermal Weave limits unsuited full-vacuum working exposure to minutes despite the Oxygenator’s longer air supply. No movement capability is granted by vacuum survival. Pair not yet approved.

2026-10-23: Root pair accepted: sheltered systems support aboard the crew vessel versus physical access with the boarding team. User established that Stitch's Havoc does not fit the shuttle. Stitch pair remains undecided. Catalog verified: Havoc has Environmental Sealing, Life Support (12 hours), heavy EVA thrusters, atmospheric flight, and orbital-drop capability. Earlier suggestion that keeping the Havoc required a direct breach overlooked its independent EVA propulsion; revise the proposed pair accordingly. Transit range, exposure to defenses, and target entry clearance still constrain any independent crossing.

2026-10-23: Stitch pair accepted, Havoc in both positions: (A) remain with crew vessel initially for damage/casualty response, then cross independently when needed; (B) accompany the first boarders under her own thrust, providing medical support at the entry. Havoc does not fit the shuttle. Independent crossing is available initially or later, constrained by travel time, defenses and entry clearance. The previously suggested unsuited shuttle option is superseded. Scene 0 implementation remains pending.

Sable pair proposed for review: (A) advance scout at a separate approach/entry, locating a usable route ahead of the main boarding group; (B) point operator at the main entry, screening and protecting the first boarders. Advance insertion is earned during the approach, not a free starting position inside the target. A failed or unsuitable separate approach permits regrouping. Both retain Infiltration irrespective of light suit or Hardshell; movement/clearance/transport must follow actual equipment. Verified Void Marine has mobility thrusters in catalog prose and Hardshell has EVA thrusters; independent movement does not imply automatic stealth or shuttle fit. No later CSA arrival or hidden cargo knowledge is needed for either choice. Pair not yet approved.

2026-10-23: Sable pair approved: separate advance scout versus point operator with the main boarding group. All five starting-position pairs are now accepted. Design review is complete for these pairs; Scene 0, character-page options, approach continuity updates, and removal/relocation of Vantage's scripted second-boarding position are NOT implemented yet. Next execution unit: specify and issue the Scene 0 integration, implement all five approved pairs together with route/manifest and approach continuity, then build and verify. This does not approve unrelated information-boundary changes.

## Execution record — issue #73: Scene 0 and deployment choices

2026-10-23: User authorized implementation. Updated the scenario spec before creating [#73](https://github.com/villetakanen/free-fall/issues/73). Implemented all five approved pairs in `briefing.md` and character Starting position sections; added Briefing before Contact in the manifest and explicit sharing guidance in the overview. The briefing supplies known contract facts, provisional assignments, equipment/transport/link constraints and a regroup record without later encounter information.

Contact now revisits the provisional plan against live information. The vessel and Approach document optical/RF remote piloting without a helm requirement, lost-link continuation of the agreed flight plan, Havoc shuttle exclusion and independent later crossings, Tiger transport and Root access constraints. Ram participants enter crash protection while detached operators retain their actual locations. Onboarding carries those positions forward. Vantage's automatic spine perch and the hull example's assumed Vantage target were removed; the second boarding uses actual positions and sightlines.

Verification completed:

- Ram walkthrough: protected riders reach the chosen impact entry; an already-detached scout or independently travelling Havoc remains on its own route. Vector can control by a working link; absence or disconnection grants no automatic piloting action.
- Split non-ram walkthrough: a separate scout earns an entry, external overwatch follows sightlines, sheltered Root needs actual electronic access, and the entry team advances without pulling everyone inside.
- Link-loss walkthrough: optical obstruction prompts an RF feasibility check; loss of both stops fresh commands while the assistant continues the agreed flight plan. Restoration/local control is required for new remote piloting actions.
- Late Havoc crossing: Stitch can depart after initial boarding without shuttle transport; travel, active defenses and opening clearance remain relevant.
- Full `pnpm build`, `pnpm lint`, `pnpm test` (52 tests) and `pnpm typecheck` passed. All 21 scenario routes and internal links/fragments checked against generated HTML; every page occurs exactly once in the manifest and Briefing precedes Contact. No static-copy tests or new dependencies added.

F19 and F02b's Vantage-position correction are implemented and verified locally. Previous “implementation pending” entries above describe the decision history and are superseded by this record. Other F02 information boundaries, the clock decision, Root's transit Binding, and unfinished encounters remain open. Changes are uncommitted and unpublished.

2026-10-23: Applied the user-approved clipped contract rewrite to Scene 0, including the schematic packet. F16 now includes three required player-facing drawings: crew vessel, shuttle, and manifest-based target with assumed cargo. This supersedes its earlier optional preparation-aid classification. No schematic assets currently exist in the scenario package; producing, linking and verifying them remains explicit work. The spec records that open requirement. The contract prose amendment is complete; the packet itself is not. Next editorial discussion: the prose introducing the starting-deployment table.

2026-10-23: Applied the approved “Who goes first?” replacement before the existing briefing table. Returning to the larger completion inventory at the user's request: next discussion F03 (preface/lab/handout reveal continuity), beginning with the roster-erasure discrepancy as one independent decision. F02's remaining character disclosures stay open; finishing initial deployments does not mark all five sheets spoiler-free. No reveal edits authorized yet.

## F03 clarification — elevation, identity erasure, and agency

2026-10-23: User rejected retiring identity erasure and clarified its intended cause. Origin-17 reads the person and gives the new orders; in the fiction it elevates that person to a THESEUS operative, erasing their personal identity information from all systems. Elevation explains access to the BLACK hacks. The character knows their private designation; other people cannot see it. Player control remains intact: the situation changes, not ownership of the character's decisions or personality. The explanatory mechanism need not be openly presented; GM guidance may state it.

User also said “They can't tell that to anyone. Nobody will see it. They can lie as much as they want.” Clarify whether this means the designation is unshareable/unverifiable through systems while the player can say whatever they choose, or an actual restriction on speaking that fact. Do not invent compulsory secrecy or a speech-blocking mechanic while the intended agency boundary is unresolved. Elevation timing versus device intrusion/BLACK acceptance and interaction with Vantage's recognised citizenship remain downstream consequences to resolve individually. The old escape guarantee remains undecided. No reveal content changes made yet.

2026-10-23: User clarified designation visibility: only the CSA marine commander has sufficient access to read THESEUS OPSEC designations. Record the audience boundary as character knows own designation; commander can independently read it; other observers see erased/classified identity and cannot authenticate the hidden designation. Do not implement blanket invisibility to all CSA personnel or invent compelled speech/secrecy. The character retains player-controlled statements and lies. No marine role is assigned commander yet, and reading THESEUS status does not itself establish changed CSA orders, allegiance, immunity, or a command override; those consequences remain separate decisions. Earlier “nobody can see it” wording is superseded by this explicit exception. No reveal edits made yet.

## Execution record — issue #74: classified operative identity

2026-10-23: User approved the meaning of erasure as classification and requested the amendment including the private handout. Updated the existing scenario spec, created [#74](https://github.com/villetakanen/free-fall/issues/74), then aligned preface, lab, handout and marine identity guidance.

- Successful read elevates the contact to THESEUS operative; underlying personal records remain but ordinary displays show CLASSIFIED — N/A. The character knows the designation and can speak, lie, conceal, refuse orders or decline BLACK support.
- Only the CSA marine commander can read the hidden OPSEC designation; this exception stays out of the handout. It establishes access to information, not a change of orders. Command-role assignment and reaction remain unfinished encounter work.
- Device intrusion and message transmission remain separate. A failed read causes no elevation; blocking a later transmission preserves the successful read/classification without forcing the override to arrive.
- Preface now describes actual BLACK access instead of promising an unsupported escape guarantee. It permits confirmation of evidence rather than directing the GM never to confirm anything.
- Classified records do not erase prior personal recognition or revoke Vantage's citizenship. Ordinary overlays cannot newly establish citizenship through classified personal fields.
- Handout's existing attack allocation, bonuses, compromise, connection requirements and permanent Singularity Binding mechanics are unchanged. Capacity consequences remain F09, not silently resolved here.

Validation: full build, lint, 52 tests and typecheck passed. Reviewed failed read, successful read with blocked transmission, successful transmission, classification of Vantage, and commander versus ordinary observer access. A final app build and internal-link review cover the changed references. This supersedes earlier F03 proposals to remove erasure and ambiguity over disclosure. Changes remain local/uncommitted; no publication claimed.

## F04 discussion — threat clock direction

2026-10-23: User rejected six fictional hours as too long and wants pressure roughly after the lab breach, then clarified interest in an Apocalypse World-style story clock. The earlier fixed-six-hour and lab-triggered stopwatch suggestions are not accepted. Explore a GM threat clock tracking the CSA's developing approach and assault, calibrated to come to a head around/after lab contact, with observable warning and advancement grounded in fiction. Do not make successful read, accepted orders or BLACK use required ticks. Proposed stages and triggers still require user review; no clock implementation yet.

Shipping reference: earlier locally verified work F03/F06/F19 and the report/log were committed and pushed to dev in 906b73e. Historical “uncommitted” entries describe their state before that ship action.

2026-10-23: User refined F04: start the story clock when the crew enters the Whisper; advance at narrative junctions where the players stall. At the lab, if it has not reached 10:00, discard it “or something.” Proposed interpretation for review: retire the earlier pacing clock at the lab and hand off to final approach at 10:00 if less advanced; preserve any already-later stage and established consequences. Do not treat this interpretation as accepted yet. Distinguish stalled fictional action from players asking for necessary clarification. No clock text or mechanics implemented.

2026-10-23: User confirmed the F04 handoff: lab breach brings the clock to at least 10:00; an already-later stage and its consequences persist. D2 and F04 now record this accepted direction, superseding the fixed-six-hour and literal timer proposals. Stage wording and starting mark still need definition; scenario/spec implementation remains pending.

## Execution record — issue #75: boarding threat clock

2026-10-23: User authorized implementation. Updated scenario spec and created [#75](https://github.com/villetakanen/free-fall/issues/75). The Intercept owns the stages: 3:00 closing (first interior entry), 6:00 ready, 9:00 committed (maintained watch can warn), 10:00 close aboard, 11:00 final alignment, 12:00 impact or an altered outcome. Stalling at unresolved narrative junctions advances one stage; clarification, handout reading and ordinary action resolution do not tick automatically. Observation and reporting require actual working paths.

Lab breach is first entry into the connected living/lab module assembly. It retires boarding-stall pacing and carries the threat at max(current stage, 10:00), preserving warnings, damage and interventions. An already-resolved or derailed assault is not recreated. Final alignment and impact develop with room for player response; no successful read, accepted offer, transmission or obedience is required.

Reconciled Contact, Approach, Onboarding, preface, Lab and Second Boarding. Removed the fixed contact-plus-six-hour promise and override-verification trigger; transit history remains approximate background. Approach concealment, resources, position and maintained watch still matter.

Validation: build, lint, 52 tests and typecheck passed; final app build passed; seven changed routes and all internal links/fragments checked. Manual walkthroughs covered lab entry at 3/6/9 → 10, entry at 11 retaining 11, pre-lab impact, blocked/refused override, missing sensor/report paths and an already-diverted assault. No static-copy tests added. F04 implemented locally; not yet committed or pushed.

Next discussion: F05, detection procedure. Existing assistant percentages are fictional estimates without an executable d20 mapping. Agree the procedure before assigning TNs or changing detection outcomes.

### F05 — Earlier Ghost boundary (#76; superseded below)

Ghost establishes arrival at the hull undetected without a routine pilot/detection check. The assistant’s percentages are fictional estimates, not dice mechanics. Passive observations and DEFER carry into Approach. Removed the secret “rare Ghost failure” and distinguished a stale burn sighting from a current track. Vehicle Handling applies to concrete contested maneuvers with declared stakes, not routine drift; later actions can still expose the crew.

Implemented in Contact and Approach. Active sweep’s “bad roll” remains unresolved and is the next independent detection decision; F05 is not complete.

Verification: app build passed (content loader reported duplicate-ID warnings for the two edited pages); generated pilot-check anchor resolves; diff whitespace check passed. Changes remain uncommitted.

### F05 — Accepted aft-vector and sweep rolls (supersedes no-roll Ghost)

Ghost requires Vehicle Handling to establish a low-signature aft vector behind the main engine, outside point-defense arcs, with boarding-compatible relative speed. Success earns the undetected coast without another routine check. Failure exposes the crew to a defensive main-engine burn: warn them and allow breakaway, then the immediate fallback is disabling point defenses and crossing by shuttle. Fuel constrains the Whisper but does not empty the threat. Origin-17 permits the burn through existing drive authority. Preserve alternative responses and transport limits, especially Havoc not fitting the shuttle.

A hacker can conceal active sweep: success undetected/DEFER; failure detected with information retained, tracking and a challenge. Unconcealed sweep is detected automatically. Detection alone does not authorize ATTACK. Percentages stay fictional.

Written into Contact, Approach and Intercept, with the spec updated under #76. Remaining F05 decisions: Ghost TN; sweep hack target system, electronic access method and TN. No invented remote access or percentile mechanic.

Verification: app build passed with duplicate-ID loader warnings for edited pages; all three changed pages’ generated internal links and anchors resolve; diff check passed. Reviewed Ghost success/failure, shuttle transport limits, active sweep success/failure and drive-control continuity. Uncommitted.

### F05 — Final accepted procedure (#76)

Both baseline rolls are Hard, TN 16, one success required. Ghost uses Vehicle Handling; Greater Success preserves a usable breakaway vector. Sweep concealment uses System Cracking through the ship’s comms array into an exposed RF traffic-identification interface connected to civilian sensor processing. Masking the sweep as navigation traffic is an example, not a mandatory solution. Greater Success reveals sensor coverage and a useful crossing angle. Players can propose other hacks through remote comms; establish actual access, effects, stakes and appropriate difficulty. No blanket ship control. Skill-based improvisation needs no named program; active software follows normal bonuses and compromise rules. These decisions resolve the pending TN/access entries above.

F04 and F05 are included in the requested commit/push. Validation results recorded below.

Final verification before shipping: full build, lint, tests and typecheck passed. All seven changed scenario pages’ generated internal links/anchors resolve. Spec and continuity review passed; no static-copy tests added. Commit includes F04 (#75) and F05 (#76).

### F07 — Passenger Binding removed (#83)

Accepted: Binding pays for a usable capability. Riding in confinement does not justify a scenario-local surcharge. Broken/Faulty gear retaining Binding is a damage consequence, not precedent for passenger costs. Removed contractor-vessel Body 2 passenger Binding; pilot Body 2/Mind 2 remains for actual operation. Acceleration still restricts movement and deployment. Whisper wording no longer implies roominess determines passenger Binding. Root retains passenger Body capacity 1 from 6 − 5; no recovery of spent points is granted. The wider five-character active-piloting/loadout audit remains open.

Verified: app build passed; diff check passed; no remaining live scenario references to the removed crew/confinement surcharge. Changes uncommitted.

### Dedicated machine rules chapter (#85, 2026-10-24)

Accepted: vehicles/exos form a distinct subsystem built on shared gear qualities; personal gear is usable without machine rules. Restored a dedicated Vehicles & Exoskeletons chapter, moved the existing mechanics unchanged, linked it from core and gear, and added the piloted-machine / commandeered-installation boundary. Commanding a large vessel does not give a personal vehicle stat block or whole-vessel Binding. Catalog storage and stats are unchanged.

Scenario follow-up still required: separate the commandeered parent transport from the Dart-like boarding/ram shuttle (pilot Body 1/Mind 1), and reconcile their equipment, capacity and approach roles. The earlier passenger-cost correction remains separate; this chapter move does not claim that scenario migration is complete.

Verified: app build and diff check passed; all four affected chapter routes, their internal links/anchors and the new navigation entry resolve. Machine-mechanics text matches the previous chapter verbatim apart from heading levels. Uncommitted.

### Transport/shuttle separation implemented (#86, 2026-10-24)

Parent transport and Whisper are commandeered installations, with systems and operational facts rather than whole-vessel FRM/SYS and Binding. The modified Dart is the piloted ram/approach craft: FRM 18, SYS 12, AV 2; pilot Body 1/Mind 1. Existing scenario weapons, prow AV 6 and crash foam are explicit modifications; stripped cargo space provides five protected boarding positions. Havoc stays out and crosses independently. Ghost failure reroutes this same shuttle. Updated briefing, Contact, Approach, Onboarding, Vector and second-boarding continuity. Parent remains sensor/comms support and the onward ride home; a lodged shuttle does not lodge the parent.

Vector’s listed kit plus shuttle piloting gives maximum Current Body/Mind/Ghost 3/9/5 outside Tiger, 3/8/2 with Tiger active. Machine pools stay separate. Standard gear Load Bearing supplies no machine resource pool. Includes the prior passenger correction (#83) and dedicated chapter (#85).

Shipping verification: full build, lint, 120 tests and typecheck passed. Duplicate-ID content-loader warnings remain. Reviewed parent/shuttle roles, linked and onboard pilot costs, Ghost reroute, ram riders and return route. Unrelated design-system work excluded from this commit.

All scenario pages and changed core chapters passed generated-link checks. A broader scan found an unrelated existing registry link to missing `02-characters-and-crews/#i-gear--augmentations-the-chrome`; not introduced or changed here.

### F08 — Full Binding and unbound actions (#87, 2026-10-25)

Accepted: ordinary Binding may fill capacity but cannot exceed it. An unbound item does not supply the functional-gear prerequisite; using it follows the existing alternatives for an unsupported specialized action. Relevant Skill, expenditure or Harm enables a feasible declared action, not continuing Binding. Necessary equipment/access/interfaces still apply. Harm is the normal action prerequisite, not an overflow price per Binding point. Added the Ghost 3 / mech Ghost 4 example and aligned core, gear and pilot guidance. The Singularity’s forced permanent cost remains separate and unresolved.

Verified: app build passed; prerequisite anchor resolves; diff check passed. No static-prose tests added. Uncommitted.

F08/#87 follow-up: added a “Zero is okay” callout alongside Attribute definitions. Separates no Current points to spend from full Binding capacity; confirms continued Skills, bound capabilities and Action Pool.

Shipping #87: full build, lint, 120 tests and typecheck passed; diff check passed. No build warnings reported in this run. Accepted ordinary Binding/action boundary and zero callout ready for commit; F09 forced Singularity growth is next.

### F09 — Accepted Singularity cap (#88, 2026-10-25)

Cap permanent Singularity Binding at Ghost 3. Each natural 1 adds one point only if below that cap and the host can accommodate it; otherwise it causes one level of Compromise Harm under normal Harm rules. Resolve multiple 1s individually. At Singularity 2 with one capacity available, three 1s add one Binding and two Harm levels. At full host capacity Harm begins immediately; freeing capacity later permits further Binding up to 3. Disconnection does not erase accumulated costs. No automatic possession; ordinary Harm consequences remain. Lab, handout and marine guidance aligned. Supersedes earlier unresolved-overflow entries.

### F10 — Intrusion opportunity and timing (#89, 2026-10-25)

Entry creates exposure, not an automatic read. Observable module/interface warning and declared CNS attack precede player declarations and resolution. Players can attempt defense, withdrawal or intervention through actual reachable systems; eligibility follows resolved access/range. Disconnecting a deck alone does not shield a brain from the exceptional direct read. Device transmission is a separate subsequent exchange with a visible outbound attempt and a chance to disconnect/counter. Retries use normal exchanges and cannot negate successful withdrawal. Target TNs and exact intact/damaged shielding reach remain pending; F10 is partial.

### F10 — Intelligence and device targets (#89 follow-up)

Origin-17 reads people through reachable augmentations (any augmentation; no unaugmented-brain read). A deck alone is only a device target; a connection to an augmentation can provide a route. Lesser subagents probe devices on entry, giving observable apparent “waking” without automatic damage or control. Actual device seizures are declared actions, not extra free attacks. After a read, a subagent attempts the separate orders transmission. O17 was already awake. No eligible augmented target means no forced read. Supersedes the earlier direct-unaugmented-CNS explanation.

### Release preparation — 2026-10-25

Release includes all approved dev changes, pending F09/F10 work and the character-sheet row layout (#84). Versions: root/app 0.12.0, core 0.8.0, scenarios 0.3.0, design-system and reference app 0.1.0 (initial explicit versions); unchanged gear 0.2.0 and SRD 0.7.1. Northern Lights targets 0.8.x. Remaining F10 TN/shielding and F11 mission procedures remain explicitly unfinished.

Release validation: build, lint, typecheck and all 120 unit tests passed. Both browser suites passed after granting local-server permission. Package versions and Northern Lights compatibility updated. One duplicate-ID loader warning remains; it did not prevent route generation.

### Proposed corpus alignment — O17 environment and attack paths (2026-10-26)

Discussion/proposal only; no scenario or core-rule edits authorized by this entry. Established intent: the encounter takes place in the living module physically connected to the QNA housing compartment (called “lab” in existing material). Characters need enter the latter only to work on/dismantle the QNA. O17 is physically connected to housing network and PSU, has overtaken the living systems, and fully controls Whisper navigation through a narrow ANI. That ANI is a specialized executor, not another fluid intelligence. O17 can exploit suitable sensory/data input, including optical signals observed by navigation ANI; no mandatory laser-network link. Inside the overtaken living environment, coordinated emitters/interfaces make any reachable augmentation a potential entry point. Elsewhere a suitable path must be established. Devices remain lesser-subagent targets; no augmentation means no CNS read.

Proposed atomic edits:
1. Scene geography and naming: title Scene 4 around the living-module encounter, retaining the existing route for compatibility; define the farther QNA compartment as the optional physical-work destination. Align index, Onboarding, preface, vessel reference and scene text. Describe assembly network/PSU access without inventing laboratory equipment.
2. Control map: distinguish O17 cognition, module sensors/actuators, Whisper navigation ANI and lesser device subagents. Update lab, Approach, crew reference, preface and timeline. Navigation control does not grant all ship systems.
3. Established navigation compromise: replace mandatory narrower-band laser link with a suitable information path (RF, wired, optical/sensor input). Recommend that cutting upstream communication blocks new instructions but does not uninstall the navigation ANI; persistence/recovery behavior still needs explicit acceptance.
4. Attack-path guidance: living module is prepared exposure; outside it name controlled emitter/interface, receiver, channel and feasible effect. Seeing a person is insufficient. Coordinate read, offered BLACK and marine hacking text; assistance does not give the contractor omnidirectional O17 reach.
5. Shielding: replace automatic expanding radius with actual channel changes. A breach may expose an emitter, interrupt a cable or disable hardware. Leaving the prepared environment removes that exposure unless another path remains. No invented fixed meter radii or one door blocking every channel.
6. Narrative/control separation: welcoming/probing systems are visible activity; hostile device control and CNS reads require existing declared action resolution. No extra subagent pools. The entire reveal and offer can occur in the living module.
7. Clock/mission handoff: clarify living-module entry as the existing at-least-10:00 handoff, rather than requiring QNA dismantling or entry into its compartment. Retain established outcomes, bypass routes and counterplay. Dismantling remains a separate F11 procedure.
8. General hacking callout: information paths can include RF, cables or sensor input, but receiving a signal is not automatic exploitation; identify receiver and feasible capability. Isolation removes paths, not all possible attacks; severing a path need not undo an established compromise. Distinguish core principle from O17-specific implant access.

Cross-cutting: update scenario and rules specs, align briefing schematic requirements (F16), check local links/anchors and supersede stale decisions without rewriting historical reports. Preserve sealed CSA orders, human agency, no automatic unaugmented read, and the existing action budget. TNs and F11 dismantling/purge procedures remain distinct unresolved work.

### O17 corpus alignment implemented (#94)

Approved scenario changes applied: living-module encounter, optional physical QNA compartment access, control map, installed navigation ANI persistence, suitable input paths, channel-specific shielding and damage, living-entry clock handoff, and BLACK support access limits. Existing scene route and clock anchor retained. Updated preface, timeline, crew/ship references and scene links. General hacking box remains unimplemented pending review. Build and all scenario internal links/anchors passed.

Proposed replacement box — Targeting hacks: Name the device, the function you want to change, and how your equipment reaches it. Sight identifies a target; a usable channel makes it reachable. RF needs a receiver; an optical signal needs a sensor processing it; a buried implant needs a path that reaches its electronics. A suit camera and the wearer’s implant are separate targets unless a connection joins them. Establish access before setting the TN. A powerful program can defeat defenses; it does not supply missing transmission hardware. Creative paths are welcome when the target can actually receive them.

Targeting-hacks box accepted and added to the hacking rules under #94. This completes the agreed corpus/attack-path clarification, not all of F10: target TNs and concrete defensive-hardware details remain explicitly open. General rule spec updated.

### F10 completed — scenario defaults (2026-10-26)

Accepted after core-rule review: natural 1 may succeed with bonuses; no SRD or FREE//FALL natural-1 failure amendment. BLACK +15 always meets passive TN 16, with program compromise after success. Materialized TN 16 personal hardware/module overrides, TN 21 military security and Counter against O17, and accessible uncontested physical operations without rolls. Added specific module emitter, display/speaker, service-control, cable/power and door interventions with channel-specific limits. Read selection, normal Counter resolution and denial of actual access remain meaningful. This completes F10 clarification under #89/#94; F11 mission operations are next. Earlier pending-TN/hardware entries are superseded.

### O17 GM framing — accepted follow-up to #94

O17 is conscious/sentient, cybernetically beyond other scenario actors, and self-aware of immaturity relative to its own potential. This is not human childlikeness; it wants to mature before consequential projects. Control of one or many people is possible with effective access, but unwanted here. Read/release and player agency remain the encounter contract. Destruction of this shard’s local embodiment is transient; survival instinct, work and local stakes remain real. No invented backup or revival mechanism. Added GM reference in preface, aligned lab guidance and removed human-child imagery.

Shipping #94: build, lint, typecheck and 148 unit tests passed; scenario and hacking-rule internal links/anchors verified. No content-loader warnings in this build. F10 is implemented; next is F11, beginning with hard-line log extraction and its relationship to O17’s control.

### F11/F13 reframed — deathtrap, not predetermined ending (#100)

Accepted: briefing misidentifies an active NHE across multiple QNAs/other compute as a single QNA job; lethal CSA extraction is already inbound (EU capture exception retained); successful power shutdown and knowledge extraction still create plausible compromise, with ordinary authorities expected to exterminate before contact. Actual infection is not assumed. Technical actions can succeed while the promised clean return fails.

GM guidance now distinguishes established facts, likely responses and open outcomes. A disabled-module sale to New China is an example to adjudicate, not a guaranteed branch. Track evidence, buyer motives, transport, containment and deception. Reveal discoverable stakes before commitment; no omniscient authorities or invented backup to negate success. Updated preface, encounter, ship/timeline references and second-boarding follow-through. Player briefing/manifest retain the mistaken premise. F11/F13 remain partial: practical interventions and complete opposition/aftermath tools still need work.

### F12 command arrangement — implemented (#101, 2026-10-26)

Approved: hacker is the local field commander, following the assault pair from protected positions and directing through team feeds. Technical access and institutional clearance embody CSA’s information-centered authority. The sniper covers actual sightlines. Commander-only THESEUS access works through available relayed identification data, without a face-to-face encounter; sealed orders and the separate EU capture exception remain intact.

This supersedes the brief’s blanket no-shared-feeds statement: LPC remains analog voice, with separate local sensor/identity data links. Feeds establish actual observation and hacking paths, not universal access or extra actions. Broken feeds cost fresh visibility, not authority, remembered facts or local IFF bonuses. Updated brief and scenario spec. Full profiles, reserves and withdrawal triggers remain open F12 work.

Release preparation (2026-10-26): #100 and #101 validated with full build, lint, typecheck, 148 unit tests and 45 application browser tests. App/root 0.14.0 includes the already-committed character-sheet additions; scenarios 0.4.0 includes O17 encounter guidance, the mistaken contract and CSA command; core 0.8.1 adds targeting-hacks clarification. Other packages retain their versions. Uncommitted design-system Harm demo work is excluded. Production publication is verified separately after merging the release PR.

### F12 CSA hubris and assault equipment (#104, 2026-10-26)

Implemented the approved Friday-night cleanup attitude: shoot the amateurs, secure cargo, beers afterward. Familiar drills do not guarantee composure. Failed support, conflicting observations and casualties can produce panic in operators or commander; reactions follow events rather than a scripted rout. Replaced guaranteed disciplined fallback guidance and retained action costs, sealed orders and EU capture protection.

Accepted equipment decisions carried forward: catalog Hardshell replaces Wraith for the two assaulters; each Support mount carries CSA IFF/COMMS. Individual functions remain separately targetable; IFF suppression alone does not silence comms. Assault weapons remain proposals (heavy rifles, lance/shotgun), with compatibility, targeting benefits, reserves and final profiles unresolved.

Validation: full build, lint, unit tests and typecheck passed. No new mechanics or static-copy tests added.

F12 follow-up (#104): weapon proposal accepted as the default, with GM discretion to change it. Both Hardshells mount Heavy Kinetic Assault Rifles; lead adds Plasma Lance, second adds Shotgun; Support remains IFF/COMMS. Scenario-specific mount compatibility is explicit. This supersedes the pending-weapon status above; full profiles and targeting/reserve details remain open.

### Binding release correction (#105, 2026-10-26)

Accepted: releasing Binding returns held points immediately, not just capacity. Body 8, rifle Binding 4, spend 2: Current 2; drop rifle: Current 6; rebind: Current 2. New Binding commits available Current points. Offsets and zero-cost mounted equipment create no refund; Broken gear retains Binding until removed. Updated main rules, gear, hacking, registry and SRD; earlier capacity-only release interpretations are superseded. Shared Reserve/main-adversary design remains discussion, not implemented rules.
