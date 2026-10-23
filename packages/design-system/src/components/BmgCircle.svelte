<script lang="ts">
  import { flushSync, onMount } from "svelte";
  import AttributeCircle from "./AttributeCircle.svelte";
  import { ATTRIBUTES, ATTRIBUTE_LABELS, CONVERSIONS, convertBmg, setAttributeValue, validateBmg,
    type Attribute, type BmgChange, type BmgValues, type Conversion } from "./character-attributes";

  interface Props {
    value: BmgValues;
    label?: string;
    interactive?: boolean;
    onchange?: (next: BmgValues, cause: BmgChange) => void;
    appearance?: "screen" | "print";
  }
  let { value, label = "Body, Mind, and Ghost", interactive = false, onchange, appearance = "screen" }: Props = $props();
  const uid = $props.id();
  let mounted = $state(false);
  let hovered = $state<Conversion | null>(null);
  let focused = $state<Conversion | null>(null);
  let announcement = $state("");
  const ready = $derived(interactive && mounted && appearance !== "print");
  const active = $derived(CONVERSIONS.find((route) => route.id === (focused ?? hovered)));
  const checked = $derived.by(() => {
    const result = validateBmg(value);
    if (!result.ok) throw new TypeError(`BmgCircle: ${result.message}`);
    if (interactive && typeof onchange !== "function") throw new TypeError("Interactive BmgCircle requires onchange.");
    return result.value;
  });
  const long = $derived(ATTRIBUTES.some((attribute) =>
    String(checked[attribute].current ?? "").length > 3 || String(checked[attribute].base ?? "").length > 3));
  onMount(() => { mounted = true; });

  function adjust(attribute: Attribute, next: number, delta: 1 | -1) {
    const result = setAttributeValue(checked, attribute, "current", next);
    if (!result.ok) throw new TypeError(result.message);
    onchange?.(result.value, { type: "adjust", attribute, delta });
  }

  function convert(conversion: Conversion) {
    if (!ready) return;
    const result = convertBmg(checked, conversion);
    if (!result.ok) return;
    flushSync(() => { announcement = ""; onchange?.(result.value, { type: "convert", conversion }); });
    const accepted = ATTRIBUTES.every((attribute) => checked[attribute].current === result.value[attribute].current
      && checked[attribute].base === result.value[attribute].base);
    if (accepted) {
      const route = CONVERSIONS.find((item) => item.id === conversion)!;
      announcement = `${ATTRIBUTE_LABELS[route.source]} Current ${checked[route.source].current}; ${ATTRIBUTE_LABELS[route.destination]} Current ${checked[route.destination].current}.`;
    }
  }

  const paths: Record<Conversion, string> = {
    "ghost-to-mind": "M 224.28 17.86 A 268 268 0 0 0 37.11 393.26 L 29.86 396.64 L 51.37 412.00 L 51.61 386.50 L 44.36 389.88 A 260 260 0 0 1 225.94 25.68 Z",
    "ghost-to-body": "M 335.72 17.86 A 268 268 0 0 1 522.89 393.26 L 530.14 396.64 L 508.63 412.00 L 508.39 386.50 L 515.64 389.88 A 260 260 0 0 0 334.06 25.68 Z",
    "mind-to-body": "M 74.70 452.27 A 268 268 0 0 0 469.50 469.50 L 475.16 475.16 L 482.24 449.70 L 458.19 458.19 L 463.85 463.85 A 260 260 0 0 1 80.83 447.12 Z",
  };
</script>

<div class="bmg" class:paper={appearance === "print"} class:long role="group" aria-label={label} data-bmg>
  <div class="stage">
    <svg class="ring" viewBox="0 0 560 560" preserveAspectRatio="none" aria-hidden="true">
      {#each CONVERSIONS as route}
        <path d={paths[route.id]} data-arc={route.id} class:active={active?.id === route.id} />
      {/each}
    </svg>
    {#each ATTRIBUTES as attribute}
      <div class="position" data-position={attribute}>
        <AttributeCircle type={attribute} current={checked[attribute].current} base={checked[attribute].base}
          {interactive} {appearance} labelPosition={attribute === "ghost" ? "above" : "below"}
          highlighted={active?.source === attribute || active?.destination === attribute}
          oncurrentchange={(next, delta) => adjust(attribute, next, delta)} />
      </div>
    {/each}
    {#each CONVERSIONS as route}
      {@const result = convertBmg(checked, route.id)}
      {@const name = `Spend 2 ${ATTRIBUTE_LABELS[route.source]} Current for 1 ${ATTRIBUTE_LABELS[route.destination]} Current`}
      <div class="conversion" data-route={route.id}>
        {#if ready}
          <button type="button" data-convert={route.id} aria-label={name} aria-disabled={!result.ok}
            aria-describedby={!result.ok ? `${uid}-${route.id}-reason` : undefined}
            title={result.ok ? name : result.message} onclick={() => convert(route.id)}
            onpointerenter={() => { hovered = route.id; }} onpointerleave={() => { hovered = null; }}
            onfocus={() => { focused = route.id; }} onblur={() => { focused = null; }}>2:1</button>
          {#if !result.ok}<span class="reason" id={`${uid}-${route.id}-reason`}>{result.message}</span>{/if}
        {/if}
        <span class="ratio" class:screen-hidden={ready} aria-label={name}>2:1</span>
      </div>
    {/each}
  </div>
  <ul class="legend">
    {#each CONVERSIONS as route}<li>2 {ATTRIBUTE_LABELS[route.source]} → 1 {ATTRIBUTE_LABELS[route.destination]}</li>{/each}
  </ul>
  <span class="sr-only status" role="status" aria-atomic="true">{announcement}</span>
</div>

<style>
  .bmg {
    container-type: inline-size;
    inline-size: 100%;
    max-inline-size: calc(70 * var(--freefall-space-1));
    color: var(--freefall-text-muted);
  }
  .stage {
    position: relative;
    aspect-ratio: 1;
  }
  .ring {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
  }
  .ring path {
    fill: var(--freefall-border-strong);
  }
  .ring path.active {
    fill: var(--freefall-action-base);
  }
  .position {
    --freefall-attribute-circle-width: 100%;
    position: absolute;
    inline-size: calc(28% + 2.75 * var(--freefall-space-1));
    transform: translate(calc(-50% - 1.375 * var(--freefall-space-1)), -50%);
  }
  [data-position="ghost"] {
    left: 50%;
    top: 28%;
  }
  [data-position="mind"] {
    left: 32%;
    top: 62%;
  }
  [data-position="body"] {
    left: 72%;
    top: 62%;
  }
  .conversion {
    position: absolute;
    transform: translate(-50%, -50%);
  }
  [data-route="ghost-to-mind"] {
    left: 9.55%;
    top: 31.98%;
  }
  [data-route="ghost-to-body"] {
    left: 90.45%;
    top: 31.98%;
  }
  [data-route="mind-to-body"] {
    left: 50%;
    top: 94.3%;
  }
  button, .ratio {
    box-sizing: border-box;
    display: grid;
    place-items: center;
    inline-size: calc(6 * var(--freefall-space-1));
    block-size: calc(5.5 * var(--freefall-space-1));
    padding: 0;
    color: var(--freefall-text-display);
    background: var(--freefall-bg-canvas);
    font: 500 calc(1.75 * var(--freefall-space-1)) / 1 var(--freefall-font-mono);
  }
  button {
    border: calc(var(--freefall-space-1) / 8) solid var(--freefall-border-strong);
    border-radius: 0;
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
  .screen-hidden {
    display: none;
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
    width: calc(18 * var(--freefall-space-1));
    height: auto;
    padding: var(--freefall-space-1);
    top: calc(100% + var(--freefall-space-1));
    z-index: 10;
    white-space: normal;
    background: var(--freefall-bg-surface-2);
    color: var(--freefall-text-display);
    font: calc(1.5 * var(--freefall-space-1)) / 1.5 var(--freefall-font-body);
  }
  [data-route="ghost-to-body"] .reason {
    right: 0;
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--freefall-space-1) calc(2 * var(--freefall-space-1));
    list-style: none;
    padding: 0;
    margin: calc(2 * var(--freefall-space-1)) 0 0;
    font: calc(1.5 * var(--freefall-space-1)) / 1.5 var(--freefall-font-mono);
    color: inherit;
  }
  .legend li {
    margin: 0;
  }
  @container (max-width: 26rem) {
    .stage {
      aspect-ratio: 0.6;
    }
    .position {
      inline-size: calc(34% + 2.75 * var(--freefall-space-1));
    }
    [data-position="ghost"] {
      inline-size: calc(38% + 2.75 * var(--freefall-space-1));
      left: 55%;
      top: 28%;
    }
    [data-position="mind"] {
      left: 36%;
      top: 58%;
    }
    [data-position="body"] {
      left: 78.5%;
      top: 58%;
    }
  }
  .long .stage {
    aspect-ratio: 0.45;
  }
  .long .position {
    inline-size: calc(46% + 2.75 * var(--freefall-space-1));
  }
  .long [data-position="ghost"] {
    left: 53%;
    top: 24%;
  }
  .long [data-position="mind"] {
    left: 36%;
    top: 52%;
  }
  .long [data-position="body"] {
    left: 70%;
    top: 77%;
  }
  .paper {
    color: black;
    background: white;
  }
  .paper .ring path {
    fill: black;
  }
  .paper .ratio {
    color: black;
    background: white;
  }
  .paper.long {
    max-inline-size: calc(40 * var(--freefall-space-1));
  }
  @media print {
    .bmg.long {
      max-inline-size: calc(40 * var(--freefall-space-1));
    }
    .bmg {
      color: black;
      background: white;
      break-inside: avoid;
    }
    .ring path, .ring path.active {
      fill: black;
    }
    .conversion button, .reason, .status {
      display: none;
    }
    .ratio, .screen-hidden {
      display: grid;
      color: black;
      background: white;
    }
  }
</style>
