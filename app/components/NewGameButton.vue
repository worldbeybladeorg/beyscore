<script setup lang="ts">
import { RotateCcw } from "lucide-vue-next";

interface Props {
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  disabled: false,
});
</script>

<template>
  <button
    class="new-game-button"
    :disabled="disabled"
    :style="{
      backgroundColor: disabled ? '#F8FAFC' : '#1088C9',
      borderBottomColor: disabled ? '#E2E8F0' : '#0D6497',
    }"
  >
    <span
      class="new-game-text"
      :style="{ color: disabled ? '#CBD5E1' : '#FFFFFF' }"
      >Reset</span
    >
    <RotateCcw
      :size="20"
      :color="disabled ? '#CBD5E1' : '#FFFFFF'"
      :stroke-width="2"
    />
  </button>
</template>

<style scoped>
.new-game-button {
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

.new-game-button:hover:enabled {
  opacity: 0.9;
}

.new-game-button:disabled {
  cursor: not-allowed;
}

.new-game-text {
  font-family: "Titillium Web", sans-serif;
  font-size: 1rem; /* text-base */
  font-weight: bold;
}
</style>
