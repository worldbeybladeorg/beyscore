<template>
  <div class="landscape-navigation">
    <MenuButton variant="matchHistory" :disabled="historyDisabled" @click="$emit('history')" />
    <UndoRedoButtons 
      :undoDisabled="undoDisabled"
      :redoDisabled="redoDisabled"
      @undo="$emit('undo')"
      @redo="$emit('redo')"
    />
    <MenuButton variant="settings" @click="$emit('settings')" />
  </div>
</template>

<script setup>
import MenuButton from './MenuButton.vue'
import UndoRedoButtons from './UndoRedoButtons.vue'

defineProps({
  undoDisabled: {
    type: Boolean,
    default: false
  },
  redoDisabled: {
    type: Boolean,
    default: false
  },
  historyDisabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['history', 'undo', 'redo', 'settings'])
</script>

<style scoped>
.landscape-navigation {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  padding: 8px;
  border-radius: 9999px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(3, 7, 18, 0.05); /* y2, blur 8, gray-950 at 5% opacity - matches player name */
  box-sizing: border-box;
}
</style>

