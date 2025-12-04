<script setup lang="ts">
import { computed } from "vue";

import type { BestOfOption, PlayerKey } from "@/stores/scoreboardStore";

const props = withDefaults(
  defineProps<{
    player?: PlayerKey;
    count?: BestOfOption;
    filledStars?: boolean[];
  }>(),
  {
    player: "p1",
    count: 3,
    filledStars: () => [] as boolean[],
  },
);

const starStates = computed(() => {
  const total = props.count ?? 0;
  return Array.from(
    { length: total },
    (_, index) => props.filledStars[index] ?? false,
  );
});

const starSrc = (filled: boolean) =>
  `/${props.player}-star-${filled ? "fill" : "stroke"}.svg`;
</script>

<template>
  <div class="flex items-center gap-1">
    <img
      v-for="(filled, index) in starStates"
      :key="index"
      :src="starSrc(filled)"
      alt="Set star"
      class="size-3"
    />
  </div>
</template>
