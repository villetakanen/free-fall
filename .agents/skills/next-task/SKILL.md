---
name: next-task
description: "Select the next GitHub Issue to execute for FREE//FALL. Load this skill when the user asks for the next task, what to work on next, backlog triage, highest-value work, fastest value, or issue prioritization. Rank ready work by actual evidence: critical blockers first, then bugs, UX, content, and maintenance; within each class prefer the shortest path to validated user value. Use /plan to create or sequence missing work, not this skill."
---

# Next Task Skill

Choose one ready, bounded task that delivers the fastest validated value under the project's bug-over-UX-over-content priority.

## Symmetrical Boundaries

* **Active Range:** Begin when the user asks which existing issue or task should be executed next. Own backlog inspection, evidence-based classification, dependency checks, relative sizing, and one recommendation.
* **Handoff Target:** Stop after recommending exactly one ready issue with a concise rationale and named execution handoff. Send missing or ambiguous specifications to `/spec`, missing issue decomposition to `/plan`, catalog prose to `gear-content-creator`, scenario material to `scenario-content-creator`, and implementation to the general development agent. Use `/ship` only after implementation is complete and the user requests commit and push.

## Steps to Execute

1. [ ] **Inventory candidates:** Use `gh issue list` to load all open issues with number, title, labels, body, assignees, milestone, and URL. Include relevant work explicitly named by the user.
2. [ ] **Read candidate evidence:** Open plausible candidates with `gh issue view`. Read linked specs, current source, recent test or build evidence, and dependency issues needed to distinguish confirmed behavior from aspiration.
3. [ ] **Establish readiness:** Keep issues whose intended outcome is sufficiently specified, dependencies are complete, scope is bounded, and acceptance criteria can be validated. Mark an enabling prerequisite as ready only when it is the shortest route to a higher-priority blocked outcome.
4. [ ] **Classify by delivered outcome:** Assign each ready issue to the highest applicable class using evidence rather than its GitHub label: critical integrity or red-gate blocker; confirmed bug; UX or accessibility improvement; playable/rules content; maintenance or architecture.
5. [ ] **Rank lexicographically:** Rank critical blockers first, then bugs, UX, content, and maintenance. Within one class prefer the smallest complete issue, then greater user impact and reach, then stronger evidence and lower delivery risk. Treat a partial fix that cannot be validated as slower than a complete bounded fix.
6. [ ] **Check the winner:** Confirm the recommended issue is not duplicated, assigned to active work, blocked by another open issue, or stale relative to current code. Inspect the runner-up enough to explain why it loses.
7. [ ] **Recommend one task:** Return the exact issue number, title, URL, priority class, expected validated value, why it wins now, material dependency or risk, and the correct handoff. Keep the runner-up explanation to one sentence.

## Affirmative Target Architecture

* **Output Format:** A single recommendation headed `Next Task`, followed by `Why Now`, `Validation Target`, `Risk`, `Runner-Up`, and `Handoff`. Name concrete issue and file/spec references where they affected the decision.
* **Structural Anchors:** Use GitHub Issues as the backlog via `gh issue list` and `gh issue view`; use `specs/` for intent, repository source for current behavior, and tests/build output for verified state. Apply this precedence exactly: critical blocker > bug > UX > content > maintenance. Apply time-to-validated-value only within the same class, except for a prerequisite that directly unlocks otherwise blocked higher-class work.

## Quality & Affirmative Verification Gates

1. [ ] The recommendation names exactly one open, ready GitHub Issue.
2. [ ] Classification is supported by current code, spec, or test evidence rather than labels alone.
3. [ ] Dependencies, assignment, duplication, and stale assumptions were checked.
4. [ ] The selected task beats every ready candidate in a higher class and beats same-class candidates on time-to-validated-value.
5. [ ] The validation target describes observable completion rather than implementation activity.
6. [ ] The handoff names the skill or agent that owns the next action.

## Post-Execution State Update

At the end of this workflow, write the current execution state to `.agent-state.json` in the workspace root:

```json
{
  "last_active_skill": "next-task",
  "status": "completed",
  "handoff_required": true,
  "next_recommended_skill": ""
}
```
