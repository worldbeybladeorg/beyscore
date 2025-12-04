<template>
  <button 
    class="custom-button"
    :class="[className, variantClass, { 'disabled': disabled }]"
    :disabled="disabled"
    @click="!disabled && $emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  className: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'blue', // 'blue', 'orange', or 'secondary'
    validator: (value) => ['blue', 'orange', 'secondary'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const variantClass = computed(() => {
  return `button-${props.variant}`
})

defineEmits(['click'])
</script>

<style scoped>
.custom-button {
  font-family: 'Titillium Web', sans-serif;
  font-weight: bold;
  font-size: 1rem; /* text-base */
  line-height: 1.5rem; /* Default line height for text-base */
  color: white;
  padding: 0.75rem 1rem; /* px-3 py-3 */
  border: none; /* Base border - will be overridden by variants if needed */
  border-bottom: 2px solid; /* Bottom border will be colored by variant */
  outline: none;
  cursor: pointer;
  height: 46px;
  border-radius: 10px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-button:hover:not(:disabled) {
  opacity: 0.9;
}

.custom-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.button-blue {
  background-color: #1088C9;
  border-bottom-color: #0D6497;
}

.button-orange {
  background-color: #FF7900;
  border-bottom-color: #CC5802;
}

.button-secondary {
  background-color: white;
  color: #1088C9;
  border: 1px solid #1088C9;
  border-bottom: 2px solid #1088C9;
}

</style>
