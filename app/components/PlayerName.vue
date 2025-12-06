<script setup lang="ts">
import { computed } from "vue";
import ScoringStar from "./ScoringStar.vue";

type PlayerType = "p1" | "p2" | undefined;
type BestOfType = 3 | 5 | undefined;

interface Props {
  name?: string;
  player?: PlayerType;
  bestOf?: BestOfType;
  filledStars?: boolean[];
}

const props = withDefaults(defineProps<Props>(), {
  name: "Player",
  player: undefined,
  bestOf: undefined,
  filledStars: () => [],
});

const showDivider = computed(() => {
  return props.player && props.bestOf !== undefined;
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
