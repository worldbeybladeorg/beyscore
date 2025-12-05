<script setup>
import MenuButton from "./MenuButton.vue";
import UndoRedoButtons from "./UndoRedoButtons.vue";

defineProps({
  undoDisabled: {
    type: Boolean,
    default: false,
  },
  redoDisabled: {
    type: Boolean,
    default: false,
  },
  historyDisabled: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["history", "undo", "redo", "settings"]);
</script>

<template>
  <div
    class="landscape-navigation box-border flex flex-row items-center gap-6 rounded-full bg-white p-2 shadow-[0_2px_8px_rgba(3,7,18,0.05)]"
  >
    <MenuButton
      variant="matchHistory"
      :disabled="historyDisabled"
      @click="$emit('history')"
    />
    <UndoRedoButtons
      :undo-disabled="undoDisabled"
      :redo-disabled="redoDisabled"
      @undo="$emit('undo')"
      @redo="$emit('redo')"
    />
    <MenuButton variant="settings" @click="$emit('settings')" />
  </div>
</template>
