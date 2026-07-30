---
name: githits-research
description: "Use GitHits for dependency, framework, package-docs, changelog, or prior-art research in FREE//FALL. Load when the user asks to use GitHits, research Astro/Svelte/package behavior, inspect open-source implementations, compare library patterns, or ground a design decision in external package evidence. Stop before application implementation unless the user explicitly asks to code."
---

# GitHits Research Skill

Ground framework and package decisions in version-aware open-source evidence before changing FREE//FALL code.

## Symmetrical Boundaries

* **Active Range:** Begin when a task asks to use GitHits or requires external evidence about Astro, Svelte, browser APIs, package behavior, open-source examples, package metadata, changelogs, or implementation prior art.
* **Handoff Target:** Stop after producing an evidence-backed recommendation, spec input, or implementation constraint list. Hand feature specification to `/spec`, issue decomposition to `/plan`, content authoring to the matching content skill, and code changes to the general development workflow.

## Steps to Execute

1. [ ] **Identify Local Versions:** Read this repo's `package.json`, package-specific manifests, lockfile evidence, and existing imports to identify the exact packages, versions, and APIs involved.
2. [ ] **Choose GitHits Path:** Prefer connected GitHits MCP tools when available. If MCP tools are unavailable, use the pinned root dev dependency through `pnpm exec githits`. Use the floating `githits@latest`, `pnpm dlx`, or `npx` path only for intentionally refreshing/installing GitHits itself after the user approves that toolchain change.
3. [ ] **Check Authentication:** Run `pnpm exec githits auth status` before CLI-backed research. If authentication or setup is required, state the blocker and use public documentation or web research as a fallback.
4. [ ] **Query Exact Targets:** Search package docs and source for the exact package/version/ref where possible. For Astro work, target the installed Astro major/minor version first, then current docs only when version-specific evidence is unavailable.
5. [ ] **Search Prior Art:** Use GitHits examples for implementation patterns from permissively licensed public repositories when architecture choices depend on how similar projects structure code.
6. [ ] **Verify Against Local Constraints:** Compare external evidence against FREE//FALL's constraints: Astro SSG, source-distributed design system, no framework runtime by default, CSS-first interactions, specs-before-code, and design-system docs as living reference.
7. [ ] **Return Decision Evidence:** Summarize the recommended approach, rejected alternatives, cited package/docs/source evidence, local files affected, and the handoff owner.

## Affirmative Target Architecture

* **Output Format:** A concise research note with `Recommendation`, `Evidence`, `Local Fit`, `Rejected Options`, and `Handoff` sections.
* **Structural Anchors:** Use GitHits documentation from `https://docs.githits.com/llms.txt` to discover tool docs. Use GitHits MCP tools such as `search`, `code_read`, `docs_list`, `docs_read`, `pkg_info`, and `get_example` when connected. Use the pinned root `githits` dev dependency (`package.json`) through `pnpm exec githits` when MCP is unavailable. Cite local repo paths alongside external evidence.

## Quality & Affirmative Verification Gates

1. [ ] The recommendation identifies the local package versions or states why exact versions could not be queried.
2. [ ] External evidence is separated from project-specific judgment.
3. [ ] Prior-art examples are treated as patterns, not copy sources, unless license and fit are explicitly acceptable.
4. [ ] The final output names the next owner: `/spec`, `/plan`, content skill, or general development workflow.

## Post-Execution State Update

At the end of this workflow, write the current execution state to `.agent-state.json` in the workspace root:

```json
{
  "last_active_skill": "githits-research",
  "status": "completed",
  "handoff_required": true,
  "next_recommended_skill": "spec"
}
```
