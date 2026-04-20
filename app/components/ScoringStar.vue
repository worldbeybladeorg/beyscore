<script setup lang="ts">
import type { PlayerType, StarCount } from "~/types/scoreCard";

interface Props {
  player?: PlayerType;
  count?: StarCount;
  filledStars?: boolean[];
}

const props = withDefaults(defineProps<Props>(), {
  player: "p1",
  count: 3,
  filledStars: () => [],
});

const starStates = computed(() => {
  // Create array of booleans for each star position
  const states: boolean[] = [];
  for (let i = 0; i < props.count; i++) {
    states.push(props.filledStars[i] === true);
  }
  return states;
});

const getStarImageSrc = (isFilled: boolean) => {
  const variant = isFilled ? "fill" : "stroke";
  return `/${props.player}-star-${variant}.svg`;
};
</script>

<template>
  <div class="flex flex-row items-center gap-1">
    <img
      v-for="(isFilled, index) in starStates"
      :key="index"
      :src="getStarImageSrc(isFilled)"
      alt="Star"
      class="block h-3 w-3"
    />
  </div>
</template>
