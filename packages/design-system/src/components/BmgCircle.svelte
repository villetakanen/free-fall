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

  // One 12-unit line: the ~28-unit inward barb folds back 30° from the arc’s tangent.
  // Closed silhouettes let feedback trace the line’s edges without filling it.
  // Coordinates share the ring’s 560-unit design canvas.
  const paths: Record<Conversion, string> = {
    "ghost-to-mind": "M 223.86 15.90 A 270 270 0 0 0 71.53 451.58 L 67.31 403.35 L 55.36 404.39 L 55.61 407.34 A 258 258 0 0 1 226.36 27.64 Z",
    "ghost-to-body": "M 336.14 15.90 A 270 270 0 0 1 488.47 451.58 L 492.69 403.35 L 504.64 404.39 L 504.39 407.34 A 258 258 0 0 0 333.64 27.64 Z",
    "mind-to-body": "M 73.17 453.55 A 270 270 0 0 0 485.18 455.51 L 438.41 468.04 L 441.51 479.63 L 444.37 478.87 A 258 258 0 0 1 82.36 445.84 Z",
  };

  // CSS conic gradients run clockwise from twelve o'clock. Reverse the two
  // counterclockwise routes, and pad the seam clear of their pointed ends.
  const gradients: Record<Conversion, { from: number; span: number; reverse: boolean }> = {
    "ghost-to-mind": { from: 225, span: 113, reverse: true },
    "ghost-to-body": { from: 2, span: 113, reverse: false },
    "mind-to-body": { from: 125, span: 95, reverse: true },
  };

</script>

<div class="bmg" class:paper={appearance === "print"} class:long role="group" aria-label={label} data-bmg>
  <div class="stage">
    <svg class="ring" viewBox="0 0 560 560" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        {#each CONVERSIONS as route}
          <clipPath id={`${uid}-${route.id}-fill`}><path d={paths[route.id]} /></clipPath>
        {/each}
      </defs>
      {#each CONVERSIONS as route}
        {@const gradient = gradients[route.id]}
        <path role="presentation" d={paths[route.id]} data-arc={route.id} class:active={active?.id === route.id}
          onpointerenter={() => { if (ready) hovered = route.id; }} onpointerleave={() => { hovered = null; }} />
        <foreignObject class="gradient" data-arc-fill={route.id} class:active={active?.id === route.id}
          x="0" y="0" width="560" height="560" clip-path={`url(#${uid}-${route.id}-fill)`}>
          <div class="gradient-paint"
            style:--gradient-from={`${gradient.from}deg`}
            style:--gradient-end-angle={`${gradient.span + 10}deg`}
            style:--gradient-start={`var(--freefall-attr-${gradient.reverse ? route.destination : route.source})`}
            style:--gradient-end={`var(--freefall-attr-${gradient.reverse ? route.source : route.destination})`}></div>
        </foreignObject>
        <path class="outline" d={paths[route.id]} data-arc-outline={route.id} class:active={active?.id === route.id} />
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
          <button class="freefall-button freefall-button--square" type="button" data-convert={route.id} aria-label={name} aria-disabled={!result.ok}
            aria-describedby={!result.ok ? `${uid}-${route.id}-reason` : undefined}
            title={result.ok ? name : result.message} onclick={() => convert(route.id)}
            onpointerenter={() => { hovered = route.id; }} onpointerleave={() => { hovered = null; }}
            onfocus={() => { focused = route.id; }} onblur={() => { focused = null; }}>
            <span class="material-symbols-sharp" aria-hidden="true">sync_alt</span>
          </button>
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
    --ring-inset: 0%;
    --side-route-offset: 9.55%;
    --side-route-top: 31.98%;
    --bottom-route-top: 94.3%;
    position: relative;
    aspect-ratio: 1;
  }
  .ring {
    position: absolute;
    inset: var(--ring-inset);
    inline-size: calc(100% - 2 * var(--ring-inset));
    block-size: calc(100% - 2 * var(--ring-inset));
  }
  .ring path {
    fill: var(--freefall-border-strong);
  }
  .ring .outline {
    fill: none;
    stroke: var(--freefall-action-base);
    stroke-width: calc(var(--freefall-space-1) / 8);
    stroke-linejoin: miter;
    vector-effect: non-scaling-stroke;
  }
  .ring .outline, .ring .gradient {
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.33s ease-in-out;
  }
  .ring .outline.active, .ring .gradient.active {
    opacity: 1;
  }
  .gradient-paint {
    inline-size: 100%;
    block-size: 100%;
    background: var(--gradient-start);
    background: conic-gradient(from var(--gradient-from) in lch shorter hue,
      var(--gradient-start) 10deg, var(--gradient-end) var(--gradient-end-angle));
  }
  .position {
    --freefall-attribute-circle-width: 100%;
    position: absolute;
    inline-size: calc(28% + 2.75 * var(--freefall-space-1));
    /* Anchor the face center, excluding the label area on its selected side. */
    transform: translate(calc(-50% - 1.375 * var(--freefall-space-1)), calc(-50% + 1.75 * var(--freefall-space-1)));
  }
  [data-position="ghost"] {
    left: 50%;
    top: 28%;
    transform: translate(calc(-50% - 1.375 * var(--freefall-space-1)), calc(-50% - 1.75 * var(--freefall-space-1)));
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
  .conversion button {
    position: relative;
  }
  .conversion button::after {
    content: "2:1";
    position: absolute;
    top: calc(100% + var(--freefall-space-1) / 2);
    left: 50%;
    transform: translateX(-50%);
    color: var(--freefall-text-muted);
    font: 500 var(--freefall-type-ui-small) / 1 var(--freefall-font-mono);
    white-space: nowrap;
    pointer-events: none;
  }
  [data-route="ghost-to-mind"] {
    left: var(--side-route-offset);
    top: var(--side-route-top);
  }
  [data-route="ghost-to-body"] {
    left: calc(100% - var(--side-route-offset));
    top: var(--side-route-top);
  }
  [data-route="mind-to-body"] {
    left: 50%;
    top: var(--bottom-route-top);
  }
  .ratio {
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
    top: calc(100% + var(--freefall-type-ui-small) + 1.5 * var(--freefall-space-1));
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
  @container (width > 26rem) {
    .bmg:not(.long) .stage {
      --ring-inset: 6.25%;
      /* Scale route anchors with the ring, keeping button targets full size. */
      --side-route-offset: 14.60625%;
      --side-route-top: 34.2325%;
      --bottom-route-top: 88.7625%;
    }
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
  .paper .ring .outline, .paper .ring .gradient {
    display: none;
  }
  .paper .ratio {
    color: black;
    background: white;
  }
  .paper.long {
    max-inline-size: calc(40 * var(--freefall-space-1));
  }
  @media (prefers-reduced-motion: reduce) {
    .ring .outline, .ring .gradient { transition: none; }
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
    .ring .outline, .ring .gradient, .conversion button, .reason, .status {
      display: none;
    }
    .ratio, .screen-hidden {
      display: grid;
      color: black;
      background: white;
    }
  }
</style>
