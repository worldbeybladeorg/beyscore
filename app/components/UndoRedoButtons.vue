<script setup>
import UndoButton from "./UndoButton.vue";
import RedoButton from "./RedoButton.vue";

const props = defineProps({
  undoDisabled: {
    type: Boolean,
    default: false,
  },
  redoDisabled: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["undo", "redo"]);
</script>

<template>
  <div class="undo-redo-container">
    <UndoButton :disabled="undoDisabled" @click="$emit('undo')" />
    <RedoButton :disabled="redoDisabled" @click="$emit('redo')" />
  </div>
</template>

<style scoped>
.undo-redo-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px; /* 8px gap between undo and redo */
  flex: 1; /* Allow to grow and fill available space */
  min-width: 0; /* Allow shrinking if needed */
}
</style>
