<script setup>
import { computed } from "vue";

const props = defineProps({
  player: {
    type: String,
    default: "p1",
    validator: (value) => ["p1", "p2"].includes(value),
  },
  count: {
    type: Number,
    default: 3,
    validator: (value) => [3, 5].includes(value),
  },
  filledStars: {
    type: Array,
    default: () => [],
    // Array of booleans indicating which stars are filled (left to right)
    // Example: [true, false, true] means first and third stars are filled
    validator: (value) => {
      return (
        Array.isArray(value) && value.every((item) => typeof item === "boolean")
      );
    },
  },
});

const starStates = computed(() => {
  // Create array of booleans for each star position
  const states = [];
  for (let i = 0; i < props.count; i++) {
    states.push(props.filledStars[i] === true);
  }
  return states;
});

const getStarImageSrc = (isFilled) => {
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
