<template>
  <button 
    class="menu-button"
    :disabled="disabled"
    :style="{
      backgroundColor: disabled ? '#F8FAFC' : '#F1F5F9',
      borderBottomColor: disabled ? '#E2E8F0' : '#CBD5E1'
    }"
  >
    <History v-if="variant === 'matchHistory'" :size="20" :color="disabled ? '#CBD5E1' : '#475569'" :stroke-width="2" />
    <Settings v-if="variant === 'settings'" :size="20" :color="disabled ? '#CBD5E1' : '#475569'" :stroke-width="2" />
  </button>
</template>

<script setup>
import { History, Settings } from 'lucide-vue-next'

const props = defineProps({
  variant: {
    type: String,
    default: 'matchHistory',
    validator: (value) => ['matchHistory', 'settings'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.menu-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px 16px; /* Match UndoButton padding */
  border: none;
  border-bottom: 2px solid;
  border-radius: 9999px;
  cursor: pointer;
  box-sizing: border-box;
  height: 48px; /* Match UndoButton height (12px top + ~24px content + 12px bottom) */
  width: 48px; /* Match the height to keep it square */
}

.menu-button:disabled {
  cursor: not-allowed;
}

.menu-button:hover:not(:disabled) {
  opacity: 0.9;
}

.menu-button :deep(svg) {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
</style>

