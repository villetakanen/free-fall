<script lang="ts">
  import HarmSlots from "@free-fall/design-system/components/HarmSlots.svelte";
  import { emptyHarm, type HarmSlot } from "@free-fall/design-system/components/character-harm";
  let value = $state<HarmSlot[]>([
    emptyHarm(),
    { state: "transient", description: "Bruised ribs", type: "physical" },
    { state: "permanent", description: "Nerve damage", type: "compromise" },
  ]);
</script>
<HarmSlots {value} interactive onchange={(next) => { value = next; }} />
