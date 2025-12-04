<template>
  <button 
    :class="[isOn ? 'toggle-button-on' : 'toggle-button-off', sizeClass]" 
    @click="toggleState"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  initialState: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'default', // 'default' (40px) or 'large' (48px - matches Button height)
    validator: (value) => ['default', 'large'].includes(value)
  }
})

const isOn = ref(props.initialState)
const sizeClass = computed(() => {
  return props.size === 'large' ? 'toggle-button-large' : ''
})
const emit = defineEmits(['update:state', 'toggle'])

// Sync internal state with initialState prop (important for controlled components)
// This ensures the button respects the parent's state even after internal toggles
watch(() => props.initialState, (newValue) => {
  isOn.value = newValue
}, { immediate: true })

function toggleState() {
  const newState = !isOn.value
  isOn.value = newState
  emit('update:state', newState)
  emit('toggle', newState)
}
</script>

<style scoped>
/* Base styles shared by both states */
.toggle-button-on,
.toggle-button-off {
  position: relative; /* For absolute positioning of pseudo-elements */
  font-family: 'Titillium Web', sans-serif;
  font-weight: bold;
  font-size: 1rem; /* text-base */
  line-height: 1.5rem; /* Default line height for text-base */
  border-radius: 10px;
  height: 38px; /* Fixed height */
  cursor: pointer;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box; /* Ensure border is included in element size */
}

/* ON state - same as SmallOrangeButton */
.toggle-button-on {
  color: white;
  background-color: #FF7900;
  border: none;
  padding: 0.5rem calc(0.75rem + 1px); /* Add 1px to left/right padding to compensate for missing borders */
  box-sizing: border-box; /* Ensure border is included in element size */
  /* Add a box-shadow for the bottom stroke effect */
  box-shadow: 0 2px 0 0 #CC5802;
}

/* OFF state - slate-300 colors with white background */
.toggle-button-off {
  color: #94a3b8; /* slate-400 for text */
  background-color: white;
  padding: 0.5rem 0.75rem; /* Normal padding */
  border: 1px solid #cbd5e1; /* slate-300 */
  border-bottom: none; /* Remove default bottom border */
  box-sizing: border-box; /* Ensure border is included in element size */
  /* Add a box-shadow for the bottom stroke effect */
  box-shadow: 0 2px 0 0 #cbd5e1;
}

/* Large variant - matches Button height (48px) */
.toggle-button-large {
  height: 46px;
}

.toggle-button-large.toggle-button-off {
  padding: 0.75rem 1rem; /* Match Button padding - 1rem horizontal = 16px */
}

.toggle-button-large.toggle-button-on {
  padding: 0.75rem calc(1rem + 1px); /* Add 1px to compensate for missing 1px border (like default variant) */
}

.toggle-button-on:hover,
.toggle-button-off:hover {
  opacity: 0.9;
}
</style>
