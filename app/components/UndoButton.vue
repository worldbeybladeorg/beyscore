<script setup lang="ts">
import { Undo2 } from "lucide-vue-next";

interface Props {
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  disabled: false,
});
</script>

<template>
  <button
    class="undo-button"
    :disabled="disabled"
    :style="{
      backgroundColor: disabled ? '#F8FAFC' : '#F1F5F9',
      borderBottomColor: disabled ? '#E2E8F0' : '#CBD5E1',
    }"
  >
    <Undo2
      :size="20"
      :color="disabled ? '#CBD5E1' : '#475569'"
      :stroke-width="2"
    />
    <span class="undo-text" :style="{ color: disabled ? '#CBD5E1' : '#475569' }"
      >Undo</span
    >
  </button>
</template>

<style scoped>
.undo-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  height: 48px;
  border: none;
  border-bottom: 2px solid;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  cursor: pointer;
  box-sizing: border-box;
  flex: 1; /* Grow to fill available space */
  min-width: 0; /* Allow shrinking if needed */
}

.undo-button:disabled {
  cursor: not-allowed;
}

.undo-text {
  font-family: "Titillium Web", sans-serif;
  font-size: 1rem; /* text-base */
  font-weight: bold;
}
</style>
