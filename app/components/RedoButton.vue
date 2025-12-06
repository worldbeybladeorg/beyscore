<script setup lang="ts">
import { Redo2 } from "lucide-vue-next";

interface Props {
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  disabled: false,
});
</script>

<template>
  <button
    class="redo-button"
    :disabled="disabled"
    :style="{
      backgroundColor: disabled ? '#F8FAFC' : '#F1F5F9',
      borderBottomColor: disabled ? '#E2E8F0' : '#CBD5E1',
    }"
  >
    <span class="redo-text" :style="{ color: disabled ? '#CBD5E1' : '#475569' }"
      >Redo</span
    >
    <Redo2
      :size="20"
      :color="disabled ? '#CBD5E1' : '#475569'"
      :stroke-width="2"
    />
  </button>
</template>

<style scoped>
.redo-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  height: 48px;
  border: none;
  border-bottom: 2px solid;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  cursor: pointer;
  box-sizing: border-box;
  flex: 1; /* Grow to fill available space */
  min-width: 0; /* Allow shrinking if needed */
}

.redo-button:hover:enabled {
  opacity: 0.9;
}

.redo-button:disabled {
  cursor: not-allowed;
}

.redo-text {
  font-family: "Titillium Web", sans-serif;
  font-size: 1rem; /* text-base */
  font-weight: bold;
}
</style>
