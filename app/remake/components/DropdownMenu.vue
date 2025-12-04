<template>
  <div class="dropdown-menu">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="dropdown-menu-item"
      :class="{ 'selected': item.value === selectedValue }"
      @click="handleItemClick(item)"
    >
      <span class="item-text">{{ item.label }}</span>
      <Check v-if="item.value === selectedValue" :size="20" color="#64748b" stroke-width="2" />
    </div>
  </div>
</template>

<script setup>
import { Check } from 'lucide-vue-next'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    validator: (value) => {
      return Array.isArray(value) && value.every(item => 
        typeof item === 'object' && 
        item.hasOwnProperty('label') && 
        item.hasOwnProperty('value')
      )
    }
  },
  selectedValue: {
    type: [String, Number, null],
    default: null
  }
})

const emit = defineEmits(['select'])

const handleItemClick = (item) => {
  emit('select', item.value)
}
</script>

<style scoped>
.dropdown-menu {
  background-color: #ffffff;
  border: 1px solid #e2e8f0; /* slate-200 */
  border-radius: 10px;
  padding: 6px;
  box-shadow: 0 0 8px rgba(15, 23, 42, 0.10); /* slate-900 @10% blur 8px */
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}

.dropdown-menu-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 6px 12px;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 4px;
}

.dropdown-menu-item.selected {
  background-color: #f8fafc; /* slate-50 */
}

.item-text {
  font-family: 'Titillium Web', sans-serif;
  font-size: 1rem; /* text-base */
  font-weight: 400; /* regular */
  color: #475569; /* slate-600 - matches dropdown field text */
}
</style>
