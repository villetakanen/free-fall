<script lang="ts">
  import { flushSync, onMount } from "svelte";
  import { ATTRIBUTES, ATTRIBUTE_LABELS, adjustCurrent, isAttributeNumber, type Attribute } from "./character-attributes";

  interface Props {
    type: Attribute;
    label?: string;
    current: number | null;
    base: number | null;
    interactive?: boolean;
    oncurrentchange?: (next: number, delta: 1 | -1) => void;
    appearance?: "screen" | "print";
    labelPosition?: "above" | "below";
    highlighted?: boolean;
  }
  let { type, label, current, base, interactive = false, oncurrentchange,
    appearance = "screen", labelPosition = "above", highlighted = false }: Props = $props();
  const uid = $props.id();
  let mounted = $state(false);
  let announcement = $state("");
  const name = $derived(label ?? ATTRIBUTE_LABELS[type]);
  const ready = $derived(interactive && mounted && appearance !== "print");
  const long = $derived(String(current ?? "").length > 3 || String(base ?? "").length > 3);
  const wideCurrent = $derived(String(current ?? "").length === 3);
  const wideBase = $derived(String(base ?? "").length === 3);
  const valid = $derived.by(() => {
    if (!ATTRIBUTES.includes(type) || !isAttributeNumber(current) || !isAttributeNumber(base)) {
      throw new TypeError("AttributeCircle expects a known attribute and nonnegative safe integers or null.");
    }
    if (interactive && typeof oncurrentchange !== "function") {
      throw new TypeError("Interactive AttributeCircle requires oncurrentchange.");
    }
    return true;
  });
  onMount(() => { mounted = true; });

  function adjust(delta: 1 | -1) {
    if (!ready) return;
    const result = adjustCurrent(current, delta);
    if (!result.ok) return;
    flushSync(() => { announcement = ""; oncurrentchange?.(result.value, delta); });
    if (current === result.value) announcement = `${name} Current ${current}.`;
  }
</script>

<div class="attribute" class:long class:wideCurrent class:wideBase class:highlighted class:paper={appearance === "print"}
  data-attribute={type} data-valid={valid} data-label-position={labelPosition}
  role="group" aria-labelledby={`${uid}-name`}>
  <div class="face">
    <span class="name" id={`${uid}-name`}>{name}</span>
    <svg class="division" viewBox="0 0 100 100" aria-hidden="true">
      <path d="M 7 75 L 93 25" />
    </svg>
    <dl>
      <div class="current-field">
        <dt>Current</dt>
        <dd data-field="current" class:blank={current === null}>
          {#if current === null}<span class="sr-only">Unfilled</span>{:else}{current}{/if}
        </dd>
      </div>
      <div class="base-field">
        <dt>Base</dt>
        <dd data-field="base" class:blank={base === null}>
          {#if base === null}<span class="sr-only">Unfilled</span>{:else}{base}{/if}
        </dd>
      </div>
    </dl>
    {#if ready}
      <div class="adjustments">
        {#each [1, -1] as delta}
          {@const result = adjustCurrent(current, delta as 1 | -1)}
          <button type="button" data-adjust={delta} aria-label={`${delta === 1 ? "Increase" : "Decrease"} ${name} Current by 1`}
            aria-disabled={!result.ok} aria-describedby={!result.ok ? `${uid}-reason-${delta}` : undefined}
            title={!result.ok ? result.message : undefined} onclick={() => adjust(delta as 1 | -1)}>
            {delta === 1 ? "+" : "−"}
          </button>
          {#if !result.ok}<span class="reason" id={`${uid}-reason-${delta}`}>{result.message}</span>{/if}
        {/each}
      </div>
    {/if}
  </div>
  <span class="sr-only status" role="status" aria-atomic="true">{announcement}</span>
</div>

<style>
  .attribute {
    --attribute-ink: var(--freefall-attr-ghost);
    --circle-rule: var(--freefall-text-muted);
    --control-size: calc(5.5 * var(--freefall-space-1));
    --overhang: calc(var(--control-size) / 2);
    box-sizing: border-box;
    inline-size: var(--freefall-attribute-circle-width, calc(35 * var(--freefall-space-1)));
    max-inline-size: 100%;
    padding: calc(3.5 * var(--freefall-space-1)) 0 calc(3.5 * var(--freefall-space-1)) var(--overhang);
    color: var(--attribute-ink);
    font-family: var(--freefall-font-mono);
  }
  .attribute[data-attribute="body"] {
    --attribute-ink: var(--freefall-attr-body);
  }
  .attribute[data-attribute="mind"] {
    --attribute-ink: var(--freefall-attr-mind);
  }
  .highlighted {
    --circle-rule: var(--freefall-action-base);
  }
  .face {
    position: relative;
    container-type: inline-size;
    aspect-ratio: 1;
    border: calc(var(--freefall-space-1) / 4) solid var(--circle-rule);
    border-radius: 50%;
    background: var(--freefall-bg-canvas);
  }
  .name {
    position: absolute;
    bottom: calc(100% + var(--freefall-space-1));
    left: 50%;
    transform: translateX(-50%);
    color: var(--freefall-text-display);
    font-size: calc(1.5 * var(--freefall-space-1));
    line-height: 1.25;
    font-weight: 600;
    white-space: nowrap;
  }
  [data-label-position="below"] .name {
    top: calc(100% + var(--freefall-space-1));
    bottom: auto;
  }
  .division {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    overflow: visible;
  }
  .division path {
    fill: none;
    stroke: var(--circle-rule);
    stroke-width: 1;
  }
  dl {
    margin: 0;
  }
  dt, dd {
    position: absolute;
    margin: 0;
    font-family: inherit;
    font-weight: 500;
    line-height: 1;
  }
  dt {
    color: var(--freefall-text-muted);
    font-size: max(calc(1.375 * var(--freefall-space-1)), 6cqw);
    letter-spacing: 0;
    text-transform: uppercase;
    transform: translate(-50%, -50%) rotate(-30deg);
  }
  dd {
    color: var(--attribute-ink);
    transform: translate(-50%, -50%);
  }
  .current-field dt {
    left: 60%;
    top: 53%;
  }
  .current-field dd {
    left: 50%;
    top: 29%;
    font-size: 36cqw;
  }
  .base-field dt {
    left: 39%;
    top: 80%;
  }
  .base-field dd {
    left: 72%;
    top: 76%;
    font-size: 18cqw;
  }
  .wideCurrent .current-field dd {
    left: 54%;
    top: 25%;
    font-size: 28cqw;
  }
  .wideBase .base-field dd {
    left: 68%;
    font-size: 15cqw;
  }
  .blank {
    inline-size: 26%;
    block-size: 16%;
    border-bottom: calc(var(--freefall-space-1) / 8) solid currentColor;
  }
  .adjustments {
    position: absolute;
    left: calc(-1 * var(--overhang));
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: var(--freefall-space-1);
  }
  button {
    display: grid;
    place-items: center;
    inline-size: var(--control-size);
    block-size: var(--control-size);
    padding: 0;
    border: calc(var(--freefall-space-1) / 8) solid var(--circle-rule);
    border-radius: 0;
    background: var(--freefall-bg-surface-2);
    color: var(--freefall-text-display);
    font: 500 calc(3 * var(--freefall-space-1)) / 1 var(--freefall-font-mono);
    cursor: pointer;
    touch-action: manipulation;
  }
  button:hover, button:focus-visible {
    border-color: var(--freefall-action-base);
  }
  button:focus-visible {
    outline: calc(var(--freefall-space-1) / 4) solid var(--freefall-action-base);
    outline-offset: calc(var(--freefall-space-1) / 2);
  }
  button[aria-disabled="true"] {
    color: var(--freefall-text-muted);
    cursor: not-allowed;
  }
  .reason, .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }
  button:focus-visible + .reason {
    clip-path: none;
    width: max-content;
    max-width: calc(22 * var(--freefall-space-1));
    height: auto;
    margin: 0;
    padding: var(--freefall-space-1);
    left: 0;
    top: calc(100% + var(--freefall-space-1));
    z-index: 10;
    white-space: normal;
    background: var(--freefall-bg-surface-2);
    color: var(--freefall-text-display);
    font: calc(1.5 * var(--freefall-space-1)) / 1.5 var(--freefall-font-body);
  }
  .long .division {
    display: none;
  }
  .long dl {
    position: absolute;
    inset: 16% 12% 16% max(12%, calc(var(--overhang) + var(--freefall-space-1) / 2));
    display: grid;
    align-content: center;
    gap: var(--freefall-space-1);
    text-align: center;
  }
  .long dt, .long dd {
    position: static;
    transform: none;
  }
  .long dt {
    font-size: calc(1.375 * var(--freefall-space-1));
    margin-bottom: calc(var(--freefall-space-1) / 2);
  }
  .attribute.long dd {
    font-size: calc(1.5 * var(--freefall-space-1));
    overflow-wrap: anywhere;
    line-height: 1.2;
  }
  .long .blank {
    margin-inline: auto;
    min-block-size: calc(2 * var(--freefall-space-1));
  }
  .attribute.paper {
    --attribute-ink: black;
    --circle-rule: black;
    background: white;
  }
  .paper .face {
    background: white;
  }
  .paper .name, .paper dt {
    color: black;
  }
  @media print {
    .attribute[data-attribute] {
      --attribute-ink: black;
      --circle-rule: black;
      background: white;
      break-inside: avoid;
    }
    .face {
      background: white;
    }
    .name, dt {
      color: black;
    }
    .adjustments, .status {
      display: none;
    }
  }
</style>
