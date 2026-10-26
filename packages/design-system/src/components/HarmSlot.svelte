<script lang="ts">
  import { onMount } from "svelte";

  import { HARM_TYPES, emptyHarm, type HarmSlot, type HarmType } from "./character-harm";
  let { value, interactive = false, onchange, index = 0 }: {
    value: HarmSlot;
    interactive?: boolean;
    onchange?: (value: HarmSlot) => void;
    index?: number;
  } = $props();
  const harm = $derived(value.state === "empty" ? null : {
    description: value.description, type: value.type, permanent: value.state === "permanent",
  });
  let description = $state("");
  let type = $state<HarmType>("physical");
  let permanent = $state(false);
  let ready = $state(false);
  let dialog: HTMLDialogElement;
  const id = $props.id();
  $effect(() => {
    if (interactive && typeof onchange !== "function") throw new TypeError("Interactive HarmSlot requires onchange.");
  });

  onMount(() => { ready = true; });

  function edit() {
    description = harm?.description ?? "";
    type = harm?.type ?? "physical";
    permanent = harm?.permanent ?? false;
    dialog.showModal();
  }

  function save(event: SubmitEvent) {
    event.preventDefault();
    if (!description.trim()) return;
    onchange?.({ state: permanent ? "permanent" : "transient", description: description.trim(), type });
    dialog.close();
  }
</script>

<div class="specimen compact" data-harm-slot={index} data-state={value.state}>
  <div class="slot" class:filled={harm !== null} class:permanent={harm?.permanent}>
    <div class="slot-heading">
      {#if harm}
        {#if harm.permanent}
          <span class="state"><span class="marker" aria-hidden="true">■</span></span>
          <span class="available permanent-label">Permanent</span>
        {:else}
          <span class="state"><span class="marker" aria-hidden="true">■</span></span>
          <span class="available transient-label">Transient</span>
        {/if}
      {:else}
        <span class="state"><span class="marker" aria-hidden="true">□</span></span>
        <span class="available">Available</span>
      {/if}
    </div>
    <p class="description">{harm?.description ?? '–'}</p>
    <div class="metadata">
      {#if harm}
        <span>{harm.type ? `${harm.type} harm` : 'Untyped harm'}</span>
      {:else}
        <span>Harm slot</span>
      {/if}
    </div>
    {#if ready && interactive}
      <button class="slot-trigger" type="button" onclick={edit} aria-haspopup="dialog"
        aria-label={`Harm slot ${index + 1}: ${harm ? harm.description || harm.type : 'record harm'}`}></button>
    {/if}
  </div>
  <span class="sr-only" role="status">{harm ? `${harm.description}, ${harm.type || 'untyped'}, ${harm.permanent ? 'permanent' : 'transient'}, minus one die` : 'Harm slot empty'}</span>
</div>

<dialog bind:this={dialog} aria-labelledby={`${id}-title`}>
  <form onsubmit={save}>
    <h2 id={`${id}-title`}>{harm ? 'Edit harm' : 'Record harm'}</h2>
    <label for={`${id}-description`}>Description</label>
    <textarea id={`${id}-description`} bind:value={description} required rows="3"></textarea>
    <label for={`${id}-type`}>Harm type</label>
    <select id={`${id}-type`} bind:value={type}>
      {#each HARM_TYPES as harmType}<option value={harmType}>{harmType[0].toUpperCase()}{harmType.slice(1)}</option>{/each}
    </select>
    {#if harm}
      <label class="check"><input type="checkbox" bind:checked={permanent} /> Permanent harm</label>
    {:else}
      <p>New harm is transient. Each filled slot removes one Action Pool die.</p>
    {/if}
    <p class="recovery">{permanent ? 'Permanent harm needs significant recovery.' : 'Transient harm clears during downtime.'} Clear only when recovery allows it.</p>
    <div class="actions">
      {#if harm}
        <button type="button" onclick={() => { onchange?.(emptyHarm()); dialog.close(); }}>Clear</button>
      {/if}
      <button type="button" onclick={() => dialog.close()}>Cancel</button>
      <button type="submit" disabled={!description.trim()}>Save</button>
    </div>
  </form>
</dialog>

<style>
  .specimen { margin-block: var(--freefall-space-4); }
  .specimen.compact { margin: 0; min-width: 0; }
  .compact .slot { width: 100%; }
  .compact .slot-heading { flex-wrap: wrap; gap: var(--freefall-space-1); }
  .slot { position: relative; display: grid; gap: var(--freefall-space-1); padding: var(--freefall-space-1); width: min(100%, calc(32 * var(--freefall-space-1))); box-sizing: border-box; min-height: calc(12 * var(--freefall-space-1)); background: var(--freefall-bg-surface-1); border-inline-start: var(--freefall-space-1) solid var(--freefall-border-strong); }
  .slot.filled { border-inline-start-color: var(--freefall-border-strong); background: var(--freefall-bg-surface-1); }
  .slot.permanent { background: var(--freefall-bg-surface-2); border-inline-start-style: solid; border-inline-start-color: var(--freefall-text-link); }
  .state { display: inline-flex; align-items: center; gap: var(--freefall-space-1); }
  .marker { font-size: var(--freefall-type-base); line-height: 1; }
  .filled .state { color: var(--freefall-text-high); font-weight: 700; }
  .permanent-label { font-weight: 700; background: var(--freefall-text-link); color: var(--freefall-bg-canvas); padding-inline: var(--freefall-space-1); }
  .slot-heading, .metadata { font-family: var(--freefall-font-mono); font-size: var(--freefall-type-ui-small); text-transform: uppercase; color: var(--freefall-text-muted); }
  .transient-label { font-weight: 700; color: var(--freefall-text-high); }
  .available { position: absolute; top: var(--freefall-space-1); right: var(--freefall-space-1); }
  .slot-heading { min-height: var(--freefall-space-2); display: flex; justify-content: space-between; gap: var(--freefall-space-2); }
  .description { margin: 0; font-size: var(--freefall-type-ui-small); overflow-wrap: anywhere; }
  .slot-trigger { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; background: transparent; cursor: pointer; }
  .slot:not(.permanent) { transition: border-color 0.22s ease-in-out, background-color 0.22s ease-in-out; }
  .slot:not(.permanent):has(.slot-trigger:hover) { border-inline-start-color: var(--freefall-text-link); background: var(--freefall-bg-surface-2); }
  @media (prefers-reduced-motion: reduce) { .slot:not(.permanent) { transition: none; } }
  .slot-trigger:focus-visible { outline: calc(var(--freefall-space-1) / 4) solid var(--freefall-text-link); outline-offset: calc(var(--freefall-space-1) / 2); }
  .recovery { color: var(--freefall-text-muted); font-size: var(--freefall-type-ui-small); }
  dialog { position: fixed; inset: 0; margin: auto; box-sizing: border-box; width: min(calc(100% - var(--freefall-space-4)), calc(52 * var(--freefall-space-1))); max-height: calc(100dvh - var(--freefall-space-4)); overflow: auto; padding: var(--freefall-space-2); border: 0; background: var(--freefall-bg-surface-2); color: var(--freefall-text-body); }
  dialog::backdrop { background: var(--freefall-bg-canvas); opacity: .8; }
  form { display: grid; gap: var(--freefall-space-2); }
  h2, form p { margin: 0; }
  h2 { font-size: calc(3 * var(--freefall-space-1)); }
  label { font-family: var(--freefall-font-mono); font-size: var(--freefall-type-ui-small); }
  textarea, select { box-sizing: border-box; width: 100%; min-width: 0; padding: var(--freefall-space-1); background: var(--freefall-bg-canvas); color: var(--freefall-text-body); border: calc(var(--freefall-space-1) / 8) solid var(--freefall-border-strong); font: inherit; }
  textarea { resize: vertical; }
  select, .actions button { min-height: var(--freefall-button-height); }
  .check { display: flex; align-items: center; gap: var(--freefall-space-1); min-height: var(--freefall-button-height); }
  .actions { display: flex; flex-wrap: wrap; justify-content: end; gap: var(--freefall-space-1); }
  .actions button { padding-inline: var(--freefall-space-2); background: var(--freefall-action-base); color: var(--freefall-text-high); border: 0; font: inherit; cursor: pointer; }
  .actions button:hover { background: var(--freefall-action-hover); }
  .actions button:disabled { opacity: .5; cursor: default; }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  @media print {
    .slot { background: white; color: black; border-color: black; break-inside: avoid; }
    .slot-heading, .metadata, .filled .state { color: black; }
    .slot.filled { background: white; border-color: black; }
    .permanent-label { background: white; color: black; }
    .slot-trigger, dialog { display: none; }
  }
</style>
