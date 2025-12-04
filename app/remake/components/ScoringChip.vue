<template>
  <div 
    class="scoring-chip"
    :class="{ 
      'chip-clickable': !disabled && !static,
      'chip-disabled': disabled,
      'chip-static': static
    }"
    :style="{
      backgroundColor: variant === 'warning' ? '#F59E0B' : (variant === 'red' ? '#FF5555' : '#1088C9'),
      borderBottomColor: static ? 'transparent' : (variant === 'warning' ? '#D97706' : (variant === 'red' ? '#E51d1d' : '#0D6497'))
    }"
    @click="handleClick"
  >
    <span class="chip-text">{{ variant === 'warning' ? (label || 'ERR') : label }}</span>
    <div class="chip-inner">
      <img 
        v-if="variant === 'warning' && label !== 'PEN' && label !== 'OWF' && label !== 'Own' && label !== 'Penalty'"
        src="/alert-triangle.svg"
        alt="Alert"
        class="alert-icon"
      />
      <span 
        v-else-if="variant === 'warning' && (label === 'PEN' || label === 'OWF' || label === 'Own' || label === 'Penalty')"
        class="chip-score"
        :style="{ color: '#F59E0B' }"
      >+{{ label === 'OWF' ? score : 1 }}</span>
      <span 
        v-else-if="!hideScore"
        class="chip-score"
        :style="{ color: variant === 'red' ? '#FF5555' : '#1088C9' }"
      >+{{ score }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: 'XTR'
  },
  score: {
    type: Number,
    default: 3
  },
  variant: {
    type: String,
    default: 'blue', // 'blue' for player 1, 'red' for player 2, 'warning' for error state
    validator: (value) => ['blue', 'red', 'warning'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  hideScore: {
    type: Boolean,
    default: false
  },
  static: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['chipClick'])

const handleClick = () => {
  // Emit if not disabled and not static (warning variant now also emits, but with null score)
  if (!props.disabled && !props.static) {
    emit('chipClick', props.variant === 'warning' ? null : props.score)
  }
}
</script>

<style scoped>
.scoring-chip {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  border-radius: 9999px;
  height: 38px;
  padding-left: 12px;
  padding-right: 8px;
  border-top: 0px;
  border-bottom: 2px solid;
  box-sizing: border-box;
}

.chip-static {
  border-bottom: none !important;
  cursor: default;
  height: 32px; /* Adjust this value to change static variant height */
  padding-left: 10px;
  padding-right: 6px;
  gap: 8px;
}

.chip-clickable {
  cursor: pointer;
}

.chip-clickable:hover {
  opacity: 0.9;
}

.chip-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.chip-text {
  font-family: 'Titillium Web', sans-serif;
  font-size: 0.875rem; /* text-sm */
  font-weight: bold;
  color: white;
}

.chip-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 9999px;
  padding: 4px;
  margin-left: auto;
  width: 24px;
  min-height: 20px;
  height: 20px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.chip-clickable .chip-inner {
  cursor: pointer;
}

.chip-static .chip-inner {
  cursor: default;
}

.alert-icon {
  width: 12px;
  height: 12px;
  display: block;
}

.chip-score {
  font-family: 'Titillium Web', sans-serif;
  font-size: 0.75rem; /* text-xs */
  font-weight: bold;
  line-height: 1;
}
</style>
