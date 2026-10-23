<script lang="ts">
  import { onMount, tick } from "svelte";
  import BmgCircle from "@free-fall/design-system/components/BmgCircle.svelte";
  import { ATTRIBUTES, ATTRIBUTE_LABELS, setAttributeValue, type Attribute, type AttributeValue, type BmgValues } from "@free-fall/design-system/components/character-attributes";
  import { decodeSheetFragment, emptySheet, encodeSheetFragment, loadPreset, NORTHERN_LIGHTS_PRESETS, parseAttributeDraft, type PlaygroundSheet } from "../lib/playground";

  type Field = keyof AttributeValue;
  type FieldKey = `${Attribute}-${Field}`;
  const attributeOrder = ["body", "mind", "ghost"] as const;
  const fields = ["current", "base"] as const;
  const fieldKey = (attribute: Attribute, field: Field): FieldKey => `${attribute}-${field}`;
  const keys = ATTRIBUTES.flatMap((attribute) => fields.map((field): FieldKey => `${attribute}-${field}`));
  let sheet = $state(emptySheet());
  let drafts = $state<Partial<Record<FieldKey, string>>>({});
  let errors = $state<Partial<Record<FieldKey, string>>>({});
  let ready = $state(false);
  let selected = $state("empty");
  let urlError = $state("");
  let actionError = $state("");
  let link = $state("");
  let copyFallback = $state(false);
  let status = $state("");
  let settingsOpen = $state(false);
  let narrowHost = $state(false);
  const uid = $props.id();
  const preset = $derived(NORTHERN_LIGHTS_PRESETS.find((item) => item.id === selected));

  function syncFields(changed: readonly FieldKey[] = keys) {
    for (const attribute of ATTRIBUTES) for (const field of fields) {
      const key: FieldKey = `${attribute}-${field}`;
      if (changed.includes(key)) {
        drafts[key] = String(sheet.bmg[attribute][field] ?? "");
        delete errors[key];
      }
    }
  }

  function restore() {
    const result = decodeSheetFragment(window.location.hash);
    link = window.location.href;
    status = "";
    actionError = "";
    copyFallback = false;
    if (!result.ok) { urlError = result.error; return; }
    sheet = result.value;
    urlError = "";
    syncFields();
  }

  onMount(() => {
    restore();
    ready = true;
    window.addEventListener("hashchange", restore);
    window.addEventListener("popstate", restore);
    return () => {
      window.removeEventListener("hashchange", restore);
      window.removeEventListener("popstate", restore);
    };
  });

  function commit(next: PlaygroundSheet, changed: readonly FieldKey[] = []): boolean {
    const encoded = encodeSheetFragment(next);
    if (!encoded.ok) { actionError = encoded.error; return false; }
    try {
      const url = new URL(window.location.href);
      url.hash = encoded.value;
      window.history.replaceState(window.history.state, "", url);
    } catch {
      actionError = "The sheet link could not be updated. Try again or reload this page.";
      return false;
    }
    sheet = next;
    link = window.location.href;
    actionError = "";
    status = "";
    syncFields(changed);
    return true;
  }

  function load(id = selected) {
    const result = loadPreset(id);
    if (!result.ok) { actionError = result.error; return; }
    if (commit(result.value, keys)) {
      urlError = "";
      selected = id;
      status = id === "empty" ? "Empty sheet loaded." : `${result.value.callsign} loaded.`;
    }
  }

  function editNumber(attribute: Attribute, field: Field, draft: string) {
    const key: FieldKey = `${attribute}-${field}`;
    drafts[key] = draft;
    const parsed = parseAttributeDraft(draft);
    if (!parsed.ok) { errors[key] = parsed.error; return; }
    const result = setAttributeValue(sheet.bmg, attribute, field, parsed.value);
    if (!result.ok) { errors[key] = result.message; return; }
    delete errors[key];
    commit({ ...sheet, bmg: result.value });
  }

  function changeBmg(next: BmgValues) {
    if (urlError) return;
    const changed = ATTRIBUTES.filter((attribute) => next[attribute].current !== sheet.bmg[attribute].current)
      .map((attribute): FieldKey => `${attribute}-current`);
    commit({ ...sheet, bmg: next }, changed);
  }

  async function copyLink() {
    if (!commit(sheet)) return;
    const copiedLink = link;
    try {
      await navigator.clipboard.writeText(copiedLink);
      if (link === copiedLink) { status = "Sheet link copied."; copyFallback = false; }
    } catch {
      if (link === copiedLink) {
        copyFallback = true;
        status = "Copy the sheet link from the field below.";
      }
    }
  }
  function focusSettings() {
    document.querySelector<HTMLElement>("[data-settings-form] :is(select, input, button):not(:disabled)")?.focus();
  }

  async function toggleSettings() {
    if (narrowHost) {
      settingsOpen = !settingsOpen;
      await tick();
      if (settingsOpen) focusSettings();
      else document.querySelector<HTMLElement>("[data-settings-toggle]")?.focus();
    } else {
      document.querySelector<HTMLButtonElement>('#playground-settings-hud [data-toggle-pane="custom"]')?.click();
    }
  }

  // Keep one Svelte-owned form across the Astro HUD slot and narrow-host fallback.
  function placeSettings(node: HTMLDivElement) {
    const inline = node.parentElement;
    const root = node.closest<HTMLElement>("[data-playground]");
    const dock = document.getElementById("playground-settings-hud");
    const destination = document.getElementById("playground-settings-host");
    const host = dock?.closest<HTMLElement>(".workspace");
    const rail = dock?.querySelector<HTMLButtonElement>('[data-toggle-pane="custom"]');
    const pane = dock?.querySelector<HTMLElement>('[data-pane-id="custom"]');
    const trigger = root?.querySelector<HTMLButtonElement>("[data-settings-toggle]");
    if (!inline || !root || !dock || !destination || !host || !rail || !pane || !trigger)
      throw new Error("Playground Settings requires its HUD slot and inline host.");

    // A container query can hide the focused pane before ResizeObserver runs.
    let focusedInput: HTMLElement | null = null;
    const rememberFocus = (event: FocusEvent) => {
      focusedInput = event.target instanceof HTMLElement && node.contains(event.target) ? event.target : null;
    };
    document.addEventListener("focusin", rememberFocus);
    const place = () => {
      const open = narrowHost ? settingsOpen : rail.getAttribute("aria-expanded") === "true";
      const focused = focusedInput;
      narrowHost = getComputedStyle(root).getPropertyValue("--settings-inline").trim() === "1";
      settingsOpen = open;
      const target = narrowHost ? inline : destination;
      const moved = node.parentElement !== target;
      if (moved) target.appendChild(node);
      if (!narrowHost && (rail.getAttribute("aria-expanded") === "true") !== open) rail.click();
      if (moved && focused && open) void tick().then(() => focused.focus());
    };
    const paneObserver = new MutationObserver(() => {
      if (narrowHost) return;
      settingsOpen = rail.getAttribute("aria-expanded") === "true";
      if (settingsOpen) focusSettings();
      else if (pane.contains(document.activeElement)) trigger.focus();
    });
    paneObserver.observe(rail, { attributes: true, attributeFilter: ["aria-expanded"] });
    const resizeObserver = new ResizeObserver(place);
    resizeObserver.observe(host);
    place();
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      void toggleSettings();
    };
    node.addEventListener("keydown", escape);
    return { destroy() {
      paneObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("focusin", rememberFocus);
      node.removeEventListener("keydown", escape);
      inline.appendChild(node);
    } };
  }
</script>

<section class="playground" aria-label="Character sheet" data-playground data-ready={ready}>
  <div class="play-bar">
    <dl class="identity-summary">
      <div><dt>Callsign</dt><dd>{sheet.callsign || "—"}</dd></div>
      <div><dt>Name</dt><dd>{sheet.name || "—"}</dd></div>
    </dl>
    <div class="actions">
      <button type="button" onclick={toggleSettings} disabled={!ready} data-settings-toggle
        aria-expanded={settingsOpen} aria-controls={narrowHost ? `${uid}-inline-settings` : "playground-settings-hud-pane-custom"}>Settings</button>
      <button type="button" onclick={copyLink} disabled={!ready || !!urlError} data-copy>Copy link</button>
    </div>
  </div>

  {#if urlError}
    <div class="error" role="alert" data-url-error>
      <p>{urlError} Your last valid sheet is unchanged.</p>
      <button type="button" onclick={() => load("empty")} data-reset>Reset to empty</button>
    </div>
  {/if}
  {#if actionError}<p class="error" role="alert">{actionError}</p>{/if}

  <div class="inline-settings" id={`${uid}-inline-settings`} hidden={!narrowHost || !settingsOpen}>
    <header><h2>Settings</h2><button type="button" onclick={toggleSettings} data-settings-close>Close settings</button></header>
    <div class="inline-settings-body">
      <div class="settings-form" data-settings-form use:placeSettings>
        <div class="toolbar">
          <div class="preset-picker">
            <label for={`${uid}-preset`}>Starting sheet</label>
            <select id={`${uid}-preset`} bind:value={selected} disabled={!ready || !!urlError} aria-describedby={`${uid}-configuration`}>
              <option value="empty">Empty</option>
              <optgroup label="Northern Lights">
                {#each NORTHERN_LIGHTS_PRESETS as item}<option value={item.id}>{item.callsign} — {item.role}</option>{/each}
              </optgroup>
            </select>
          </div>
          <button type="button" onclick={() => load()} disabled={!ready || !!urlError} data-load>Load sheet</button>
        </div>
        <p class="configuration" id={`${uid}-configuration`}>
          {#if preset}<a href={preset.source}>{preset.callsign}</a> · {preset.configuration}. Loading replaces your sheet.
          {:else}Start with blank values. Loading replaces your sheet.{/if}
        </p>

        <fieldset class="identity" disabled={!ready || !!urlError}>
          <legend class="sr-only">Character identity</legend>
          <label for={`${uid}-name`}>Name
            <input id={`${uid}-name`} type="text" autocomplete="off" value={sheet.name}
              oninput={(event) => commit({ ...sheet, name: event.currentTarget.value })} />
          </label>
          <label for={`${uid}-callsign`}>Callsign
            <input id={`${uid}-callsign`} type="text" autocomplete="off" value={sheet.callsign}
              oninput={(event) => commit({ ...sheet, callsign: event.currentTarget.value })} />
          </label>
        </fieldset>
        <div class="numbers">
          <h2>Attributes</h2>
          <p class="hint">Set your values here. Use +/− to adjust Current, or the arrows to convert 2 points into 1. Base is your initial capacity, not a limit.</p>
          {#each attributeOrder as attribute}
            <fieldset class="attribute" disabled={!ready || !!urlError}>
              <legend>{ATTRIBUTE_LABELS[attribute]}</legend>
              <div class="pair">
                {#each fields as field}
                  {@const key = fieldKey(attribute, field)}
                  <div class="number-field">
                    <label for={`${uid}-${key}`}>{field === "current" ? "Current" : "Base"}</label>
                    <input id={`${uid}-${key}`} type="text" inputmode="numeric" autocomplete="off" spellcheck="false"
                      aria-label={`${ATTRIBUTE_LABELS[attribute]} ${field === "current" ? "Current" : "Base"}`}
                      value={drafts[key] ?? ""} aria-invalid={!!errors[key]}
                      aria-describedby={errors[key] ? `${uid}-${key}-error` : undefined}
                      oninput={(event) => editNumber(attribute, field, event.currentTarget.value)} />
                    {#if errors[key]}<span class="field-error" id={`${uid}-${key}-error`}>{errors[key]}</span>{/if}
                  </div>
                {/each}
              </div>
            </fieldset>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <div class="diagram"><BmgCircle value={sheet.bmg} interactive={ready && !urlError} onchange={changeBmg} /></div>
  <div class="sharing">
    <p class="hint">Your sheet lives in this link. Copy or bookmark it to keep it.</p>
    <p class="status" role="status" aria-atomic="true">{status}</p>
    {#if copyFallback && !urlError}
      <label for={`${uid}-link`}>Sheet link
        <input id={`${uid}-link`} type="text" readonly value={link} onfocus={(event) => event.currentTarget.select()} data-link-fallback />
      </label>
    {/if}
  </div>
</section>

<style>
  .playground { --settings-inline: 0; grid-column: main; min-inline-size: 0; padding-block-end: calc(6 * var(--freefall-space-1)); }
  .toolbar { display: flex; align-items: end; flex-wrap: wrap; gap: var(--freefall-space-2); }
  label { display: grid; gap: var(--freefall-space-1); min-inline-size: 0; }
  .preset-picker { flex: 1 1 calc(28 * var(--freefall-space-1)); display: grid; gap: var(--freefall-space-1); }
  input, select, button {
    box-sizing: border-box; min-inline-size: 0; max-inline-size: 100%;
    min-block-size: calc(5.5 * var(--freefall-space-1)); padding: var(--freefall-space-1) var(--freefall-space-2);
    background: var(--freefall-bg-surface-2); color: var(--freefall-text-display);
    border: calc(var(--freefall-space-1) / 8) solid var(--freefall-border-strong); border-radius: 0; font: inherit;
  }
  input, select { inline-size: 100%; }
  button { cursor: pointer; }
  button:hover { border-color: var(--freefall-action-base); }
  :is(input, select, button):focus-visible { outline: calc(var(--freefall-space-1) / 4) solid var(--freefall-action-base); outline-offset: calc(var(--freefall-space-1) / 2); }
  :disabled { opacity: 0.6; cursor: not-allowed; }
  fieldset { border: 0; padding: 0; margin: 0; min-inline-size: 0; }
  .configuration, .hint { color: var(--freefall-text-muted); font-size: var(--freefall-type-ui-small); }
  .identity { display: grid; gap: var(--freefall-space-2); margin-block: var(--freefall-space-4); }
  .diagram { display: flex; justify-content: center; min-inline-size: 0; }
  .numbers { min-inline-size: 0; }
  h2 { margin: 0; font-size: calc(var(--freefall-type-base) * var(--freefall-type-ratio)); }
  .attribute { margin-block-start: calc(3 * var(--freefall-space-1)); }
  .attribute legend { font: 600 var(--freefall-type-ui-small) var(--freefall-font-mono); padding: 0; margin-block-end: var(--freefall-space-1); }
  .pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--freefall-space-2); }
  .number-field { min-inline-size: 0; }
  .number-field label { margin-block-end: var(--freefall-space-1); font: var(--freefall-type-ui-small) var(--freefall-font-mono); }
  .number-field input { font-family: var(--freefall-font-mono); padding-inline: var(--freefall-space-1); }
  .field-error { display: block; margin-block-start: var(--freefall-space-1); font-size: var(--freefall-type-ui-small); overflow-wrap: anywhere; }
  .error { padding: var(--freefall-space-2); background: var(--freefall-bg-surface-2); }
  [aria-invalid="true"] { border-color: var(--freefall-action-base); }
  .sharing { margin-block-start: var(--freefall-space-4); }
  .status:empty { display: none; }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
  @container content (inline-size >= calc(92.6ch + 6rem)) {
    .playground { grid-column: main-start / side-end; }
  }
  .play-bar, .actions { display: flex; align-items: center; flex-wrap: wrap; gap: var(--freefall-space-2); }
  .play-bar { justify-content: space-between; margin-block-end: var(--freefall-space-4); }
  .identity-summary { display: flex; flex-wrap: wrap; gap: var(--freefall-space-4); margin: 0; min-inline-size: 0; }
  .identity-summary dt { font: var(--freefall-type-ui-small) var(--freefall-font-mono); color: var(--freefall-text-muted); }
  .identity-summary dd { margin: var(--freefall-space-1) 0 0; overflow-wrap: anywhere; }
  .inline-settings { padding: var(--freefall-space-2); margin-block-end: var(--freefall-space-4); background: var(--freefall-bg-surface-2); }
  .inline-settings[hidden] { display: none; }
  .inline-settings header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--freefall-space-1); margin-block-end: var(--freefall-space-2); }
  @container hud-host (max-width: 32rem) { .playground { --settings-inline: 1; } }
</style>
