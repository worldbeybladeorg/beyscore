<template>
  <div class="text-dropdown-field" @click="handleFieldClick">
    <div class="field-title">{{ title }}</div>
    <div class="field-display" :class="{ 'dropdown': isDropdown }">
      <template v-if="isDropdown">
        <span class="field-value" @click.stop>{{ modelValue }}</span>
      </template>
      <template v-else>
        <input
          class="field-input"
          type="text"
          :value="modelValue"
          @input="handleInput"
          @click.stop
          :maxlength="maxLength"
        />
      </template>
      <div v-if="isDropdown && showChevron" class="dropdown-icon">
        <ChevronUp v-if="isDropdownOpen" :size="20" color="#64748b" stroke-width="2" />
        <ChevronDown v-else :size="20" color="#64748b" stroke-width="2" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'

const props = defineProps({
  title: {
    type: String,
    default: 'Title'
  },
  modelValue: {
    type: String,
    default: 'Text'
  },
  variant: {
    type: String,
    default: 'input',
    validator: (value) => ['input', 'dropdown'].includes(value)
  },
  showChevron: {
    type: Boolean,
    default: true
  },
  maxLength: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['toggle', 'update:modelValue'])

const handleInput = (event) => {
  let value = event.target.value
  // Enforce maxLength if provided
  if (props.maxLength !== null && value.length > props.maxLength) {
    value = value.slice(0, props.maxLength)
  }
  emit('update:modelValue', value)
}

const isDropdown = computed(() => props.variant === 'dropdown')
const isDropdownOpen = ref(false)

const handleFieldClick = () => {
  if (isDropdown.value) {
    isDropdownOpen.value = !isDropdownOpen.value
  }
  emit('toggle')
}
</script>

<style scoped>
.text-dropdown-field {
  display: flex;
  flex-direction: column;
  width: 100%;
  cursor: pointer;
}

.field-title {
  font-family: 'Titillium Web', sans-serif;
  font-size: 0.875rem; /* text-sm */
  font-weight: 600;
  color: #64748b; /* slate-500 */
}

.field-display {
  margin-top: 8px;
  padding: 8px 12px;
  border: 1px solid #cbd5e1; /* slate-300 */
  border-radius: 10px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0 4px rgba(15, 23, 42, 0.05); /* slate-900 @5% blur 4px */
  transition: border-color 0.2s ease;
}

.field-display {
  position: relative;
}

.field-display:hover,
.field-display:active {
  opacity: 0.9;
}

.field-input {
  font-family: 'Titillium Web', sans-serif;
  font-size: 1rem; /* text-base */
  font-weight: 400;
  color: #475569; /* slate-600 */
  border: none;
  background: transparent;
  width: 100%;
  outline: none;
  padding: 0;
}

.field-value {
  font-family: 'Titillium Web', sans-serif;
  font-size: 1rem; /* text-base */
  font-weight: 400;
  color: #475569; /* slate-600 */
}

.dropdown-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
}
</style>

