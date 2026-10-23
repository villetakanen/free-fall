<script lang="ts">
  import AttributeCircle from "@free-fall/design-system/components/AttributeCircle.svelte";
  import BmgCircle from "@free-fall/design-system/components/BmgCircle.svelte";
  import { setAttributeValue, type BmgValues, type BmgChange } from "@free-fall/design-system/components/character-attributes";

  let { kind = "bmg", id = "primary" }: { kind?: "single" | "bmg"; id?: string } = $props();
  const initial = (): BmgValues => ({ ghost: { current: 8, base: 12 }, mind: { current: 8, base: 10 }, body: { current: 12, base: 12 } });
  let value = $state(initial());
  let fixture = $state("populated");
  let reject = $state(false);
  let proposals = $state(0);
  let cause = $state("");
  function change(next: BmgValues, event: BmgChange) {
    proposals += 1;
    cause = event.type === "convert" ? event.conversion : `${event.attribute} ${event.delta > 0 ? "+1" : "−1"}`;
    if (!reject) value = next;
  }
  function populate() {
    const next = initial();
    if (fixture === "blank") for (const pair of Object.values(next)) { pair.current = null; pair.base = null; }
    if (fixture === "zero") next.ghost.current = 0;
    if (fixture === "last-pair") next.ghost.current = 3;
    if (fixture === "large") for (const pair of Object.values(next)) { pair.current = Number.MAX_SAFE_INTEGER; pair.base = Number.MAX_SAFE_INTEGER; }
    if (fixture === "three-digit") for (const pair of Object.values(next)) { pair.current = 128; pair.base = 100; }
    value = next;
    proposals = 0;
    cause = "";
  }
  function baseUpdate() {
    const result = setAttributeValue(value, "ghost", "base", value.ghost.base === 6 ? null : 6);
    if (!result.ok) throw new TypeError(result.message);
    value = result.value;
  }
</script>

<div class="demo" data-demo={id}>
  {#if kind === "single"}
    <AttributeCircle type="ghost" current={value.ghost.current} base={value.ghost.base} interactive
      oncurrentchange={(next, delta) => {
        const result = setAttributeValue(value, "ghost", "current", next);
        if (!result.ok) throw new TypeError(result.message);
        change(result.value, { type: "adjust", attribute: "ghost", delta });
      }} />
  {:else}
    <BmgCircle {value} interactive onchange={change} />
  {/if}
  <div class="options">
    <label>Values
      <select bind:value={fixture} onchange={populate} data-fixture>
        <option value="populated">Populated</option><option value="blank">Unfilled</option>
        <option value="zero">Ghost at zero</option><option value="last-pair">Ghost at 3</option>
        <option value="three-digit">Three digits</option><option value="large">Largest safe integer</option>
      </select>
    </label>
    <label><input type="checkbox" bind:checked={reject} data-reject /> Decline changes</label>
    <button type="button" onclick={populate} data-reset>Reset values</button>
    <button type="button" onclick={baseUpdate} data-base-update>Change Ghost Base</button>
    <output data-proposals={proposals}>{proposals} proposals{cause ? ` · ${cause}` : ""}</output>
  </div>
</div>

<style>
  /* Astro islands use display:contents;
  the host participates in the page grid. */
  .demo {
    grid-column: main;
    min-inline-size: 0;
    margin-block: var(--freefall-space-4);
  }
  .options {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--freefall-space-2);
    margin-block-start: var(--freefall-space-4);
  }
  label {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--freefall-space-1);
  }
  select, button {
    min-block-size: calc(5.5 * var(--freefall-space-1));
    max-inline-size: 100%;
    padding: var(--freefall-space-1);
    background: var(--freefall-bg-surface-2);
    color: var(--freefall-text-display);
    border: calc(var(--freefall-space-1) / 8) solid var(--freefall-border-strong);
    border-radius: 0;
    font: inherit;
  }
  input {
    accent-color: var(--freefall-action-base);
  }
  output {
    flex-basis: 100%;
    font-family: var(--freefall-font-mono);
    font-size: var(--freefall-type-ui-small);
  }
  @media print {
    .options {
      display: none;
    }
  }
</style>
