---
name: meta-skill-architect
description: Use this skill when designing, writing, or refactoring local Agent Skills (SKILL.md). It ensures new skills are architected to maintain sharp context focus, utilize affirmative target-matching, and establish clear boundary states.
---

# Meta-Skill Architect

Design high-performance, collision-free local Agent Skill packages with focused context, affirmative targets, and explicit workflow boundaries.

## Symmetrical Boundaries

* **Active Range:** Creating a custom skill for a specific workflow, project convention, or local tool integration; or refactoring an existing `SKILL.md` to resolve agent confusion, trigger collisions, unclear handoffs, or context bloat.
* **Handoff Target:** Complete when the skill package is structurally valid, its trigger and stopping states are explicit, and its instructions pass the verification gates below. Hand application coding, scripting, deployment, and other domain execution to the specialized skill named by the generated skill's `Handoff Target`, or to the general development agent when no specialized skill exists.

## Steps to Execute

1. [ ] **Map the Cognitive Profile:** Define the target workflow's exact starting state, completion state, and expected output before writing the skill.
2. [ ] **Establish Symmetrical Boundaries:** Inspect neighboring local skills, identify overlap, and write unmistakable activation and handoff thresholds that partition responsibility cleanly.
3. [ ] **Declare Affirmative Targets:** List the exact patterns, frameworks, libraries, CLI tools, file shapes, and APIs the executing agent must use.
4. [ ] **Externalize Heavy Assets:** Move boilerplate, schemas, long examples, static datasets, and structural templates into `./references/`; place reusable execution tools and test harnesses in `./scripts/`.
5. [ ] **Build the Package:** Create `<skill-name>/SKILL.md` and add `references/` or `scripts/` when the workflow has assets for them. Use kebab-case for both the directory and frontmatter `name`.
6. [ ] **Write Focused Metadata:** Keep `description` within 1024 characters, state what the skill does and precisely when it must load, and front-load literal trigger terms or filenames.
7. [ ] **Write the Skill:** Follow the required template in `Affirmative Target Architecture`; keep the core file limited to procedural routing, boundary states, links to supporting assets, and validation gates.
8. [ ] **Validate the Package:** Run every gate in `Quality & Affirmative Verification Gates`, resolve each failure, and verify every relative link and referenced local skill exists.
9. [ ] **Record Completion:** Write the post-execution state described below after the generated skill passes validation.

## Affirmative Target Architecture

* **Output Format:** A modular local Agent Skill package with this structure:

```text
<skill-name>/
|-- SKILL.md
|-- references/  # Large static datasets, schemas, examples, and templates
`-- scripts/     # Local execution scripts, test harnesses, and tools
```

Create `references/` and `scripts/` when identified assets belong in them; keep an asset-free package limited to `SKILL.md`.

* **Structural Anchors:** Generate `SKILL.md` with this exact section order and adapt the placeholders to the target workflow:

````markdown
---
name: <kebab-case-name>
description: <Descriptive phrase, limited to 1024 characters, stating precisely what triggers the task and when the agent must load it.>
---

# <Title Case Name Skill>

<A brief, single-sentence summary of the skill's objective.>

## Symmetrical Boundaries

* **Active Range:** <Specific, unmistakable trigger condition.>
* **Handoff Target:** <Exact completion state and the neighboring skill that assumes responsibility next.>

## Steps to Execute

1. [ ] **Step Title:** <Actionable instruction.>
2. [ ] **Step Title:** <Actionable instruction.>

## Affirmative Target Architecture

* **Output Format:** <Exact form of the completed output.>
* **Structural Anchors:** <Exact libraries, imports, APIs, commands, schemas, or file conventions to use.>

## Post-Execution State Update

At the end of this workflow, write the current execution state to `.agent-state.json` in the workspace root:

```json
{
  "last_active_skill": "<skill-name>",
  "status": "completed",
  "handoff_required": <true-or-false>,
  "next_recommended_skill": "<next-skill-name-or-empty-string>"
}
```
````

## Quality & Affirmative Verification Gates

1. [ ] **Affirmative Instruction Check:** Every instruction names a positive action, target, output format, or validation gate. Security and compliance boundaries state the safe required behavior directly.
2. [ ] **Token Footprint Audit:** Code templates, heavy Markdown tables, schemas, datasets, and long examples live in `./references/`; executable helpers and harnesses live in `./scripts/`; `SKILL.md` remains focused on routing and procedure.
3. [ ] **Boundary Handshake Verification:** `Symmetrical Boundaries` explicitly names the starting trigger, stopping state, and next owner so the executing agent can transition without guessing.
4. [ ] **Trigger Collision Check:** The description and active range distinguish this skill from every neighboring skill using concrete task terms and handoff thresholds.
5. [ ] **Package Integrity Check:** Frontmatter parses, the skill name matches its directory, every relative link resolves, and every referenced command or script has a defined execution contract.

## Post-Execution State Update

At the end of this workflow, write the current execution state to `.agent-state.json` in the workspace root:

```json
{
  "last_active_skill": "meta-skill-architect",
  "status": "completed",
  "handoff_required": false,
  "next_recommended_skill": ""
}
```
