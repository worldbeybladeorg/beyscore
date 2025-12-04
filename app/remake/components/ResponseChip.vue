<template>
  <div class="response-chip">
    <AlertTriangle 
      v-if="variant === 'warning'" 
      :size="16" 
      color="#F59E0B" 
      :stroke-width="2"
    />
    <Trophy 
      v-if="variant === 'p1Winner' || variant === 'p2Winner'" 
      :size="16" 
      :color="variant === 'p1Winner' ? '#1088C9' : '#FF5555'"
      :stroke-width="2"
    />
    <span class="chip-text">
      {{ variant === 'warning' ? 'Warning' : 'Winner' }}
    </span>
  </div>
</template>

<script setup>
import { AlertTriangle, Trophy } from 'lucide-vue-next'

const props = defineProps({
  variant: {
    type: String,
    default: 'warning',
    validator: (value) => ['warning', 'p1Winner', 'p2Winner'].includes(value)
  }
})
</script>

<style scoped>
.response-chip {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 6px 12px; /* 6px top/bottom, 10px left/right */
  background-color: white;
  border-radius: 9999px; /* full corner radius */
  box-shadow: 0 2px 8px rgba(3, 7, 18, 0.05); /* same as PlayerName */
  box-sizing: border-box;
}

.chip-text {
  font-family: 'Titillium Web', sans-serif;
  font-size: 0.875rem; /* text-sm */
  font-weight: bold;
  color: #475569; /* slate-600 */
  flex-shrink: 0;
}

.response-chip :deep(svg) {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
</style>

