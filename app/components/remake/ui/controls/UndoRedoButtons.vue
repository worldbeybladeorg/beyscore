<script setup lang="ts">
import UndoButton from "./UndoButton.vue";
import RedoButton from "./RedoButton.vue";

const props = defineProps<{
  undoDisabled?: boolean;
  redoDisabled?: boolean;
}>();
</script>

<template>
  <div class="inline-flex items-center gap-2">
    <UndoButton :disabled="props.undoDisabled" />
    <RedoButton :disabled="props.redoDisabled" />
  </div>
</template>
