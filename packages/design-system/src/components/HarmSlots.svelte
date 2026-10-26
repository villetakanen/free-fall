<script lang="ts">
  import HarmSlot from "./HarmSlot.svelte";
  import { actionPool, type HarmSlot as HarmValue } from "./character-harm";
  let { value, interactive = false, onchange, poolHref }: {
    value: readonly HarmValue[];
    interactive?: boolean;
    onchange?: (value: HarmValue[]) => void;
    poolHref?: string;
  } = $props();
  const dice = $derived(actionPool(value));
  $effect(() => {
    if (value.length !== 3) throw new TypeError("HarmSlots requires exactly three slots.");
    if (interactive && typeof onchange !== "function") throw new TypeError("Interactive HarmSlots requires onchange.");
  });
</script>
<div class="harm-row">
  {#each value as slot, index}
    <HarmSlot value={slot} {index} {interactive} onchange={(next) => onchange?.(value.map((current, i) => i === index ? next : current))} />
  {/each}
  <output class="action-pool" aria-label="Available Action Pool" aria-live="polite"><span class="caption">{#if poolHref}<a href={poolHref}>Action Pool</a>{:else}Action Pool{/if}</span><strong data-action-pool>{dice}<span>d20</span></strong></output>
</div>
<style>
  .harm-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: stretch; gap: var(--freefall-space-1); margin-block: var(--freefall-space-2); }
  output { grid-column: 1 / -1; display: flex; flex-direction: row; justify-content: space-between; align-items: flex-start; gap: var(--freefall-space-2); margin-top: 0; padding-top: var(--freefall-space-1); border-top: calc(var(--freefall-space-1) / 8) solid var(--freefall-border-strong); font-family: var(--freefall-font-mono); }
  .caption { font-size: var(--freefall-type-ui-small); text-transform: uppercase; }
  strong { color: var(--freefall-text-link); font-size: calc(8 * var(--freefall-space-1)); line-height: 1; white-space: nowrap; font-weight: 500; }
  strong span { font-size: .5em; color: var(--freefall-text-high); }
  @media print { strong, strong span { color: black; } .harm-row { break-inside: avoid; } output { color: black; border-color: black; } }
</style>
