<script setup>
import { computed } from "vue";
import ScoringStar from "./ScoringStar.vue";

const props = defineProps({
  name: {
    type: String,
    default: "Player",
  },
  player: {
    type: String,
    default: null,
    validator: (value) => value === null || ["p1", "p2"].includes(value),
  },
  bestOf: {
    type: Number,
    default: null,
    validator: (value) => value === null || [3, 5].includes(value),
  },
  filledStars: {
    type: Array,
    default: () => [],
    validator: (value) => {
      return (
        Array.isArray(value) && value.every((item) => typeof item === "boolean")
      );
    },
  },
});

const showDivider = computed(() => {
  return props.player !== null && props.bestOf !== null;
});
</script>

<template>
  <div
    class="box-border flex h-[38px] items-center justify-start gap-3 rounded-full bg-white px-4 font-titillium text-sm font-bold text-slate-700 shadow-[0_2px_8px_rgba(3,7,18,0.05)]"
  >
    <span class="shrink-0">{{ name }}</span>
    <div v-if="showDivider" class="h-4 w-px shrink-0 bg-gray-200" />
    <ScoringStar
      v-if="showDivider"
      :player="player"
      :count="bestOf"
      :filled-stars="filledStars"
      class="shrink-0"
    />
  </div>
</template>
