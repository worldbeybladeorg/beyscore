<template>
  <div class="player-name">
    <span class="name-text">{{ name }}</span>
    <div 
      v-if="showDivider"
      class="divider"
    ></div>
    <ScoringStar 
      v-if="showDivider"
      :player="player"
      :count="bestOf"
      :filledStars="filledStars"
      class="star-component"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ScoringStar from './ScoringStar.vue'

const props = defineProps({
  name: {
    type: String,
    default: 'Player'
  },
  player: {
    type: String,
    default: null,
    validator: (value) => value === null || ['p1', 'p2'].includes(value)
  },
  bestOf: {
    type: Number,
    default: null,
    validator: (value) => value === null || [3, 5].includes(value)
  },
  filledStars: {
    type: Array,
    default: () => [],
    validator: (value) => {
      return Array.isArray(value) && value.every(item => typeof item === 'boolean')
    }
  }
})

const showDivider = computed(() => {
  return props.player !== null && props.bestOf !== null
})
</script>

<style scoped>
.player-name {
  font-family: 'Titillium Web', sans-serif;
  font-size: 0.875rem; /* text-sm */
  font-weight: bold;
  color: #334155;
  padding: 0 1rem; /* horizontal padding only, height is fixed */
  background-color: white;
  border-radius: 9999px; /* full corner radius */
  box-shadow: 0 2px 8px rgba(3, 7, 18, 0.05); /* y2, blur 8, gray-950 at 5% opacity */
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  height: 38px; /* Same height as ScoringChip */
  gap: 12px;
}

.name-text {
  flex-shrink: 0;
}

.divider {
  width: 1px;
  height: 16px;
  background-color: #e5e7eb; /* tailwind gray-200 */
  flex-shrink: 0;
}

.star-component {
  flex-shrink: 0;
}
</style>

