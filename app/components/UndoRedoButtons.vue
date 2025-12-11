<script setup lang="ts">
import UndoButton from "./UndoButton.vue";
import RedoButton from "./RedoButton.vue";
import NewGameButton from "./NewGameButton.vue";

interface Props {
  undoDisabled?: boolean;
  redoDisabled?: boolean;
  gameOver?: boolean;
}

withDefaults(defineProps<Props>(), {
  undoDisabled: false,
  redoDisabled: false,
  gameOver: false,
});

defineEmits<{
  undo: [];
  redo: [];
  newGame: [];
}>();
</script>

<template>
  <div class="undo-redo-container">
    <UndoButton :disabled="undoDisabled" @click="$emit('undo')" />
    <RedoButton
      v-if="!gameOver"
      :disabled="redoDisabled"
      @click="$emit('redo')"
    />
    <NewGameButton v-else @click="$emit('newGame')" />
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
