<script setup lang="ts">
import { History, Settings } from "lucide-vue-next";

type MenuButtonVariant = "matchHistory" | "settings";

interface Props {
  variant?: MenuButtonVariant;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: "matchHistory",
  disabled: false,
});
</script>

<template>
  <button
    class="menu-button"
    :disabled="disabled"
    :style="{
      backgroundColor: disabled ? '#F8FAFC' : '#F1F5F9',
      borderBottomColor: disabled ? '#E2E8F0' : '#CBD5E1',
    }"
  >
    <History
      v-if="variant === 'matchHistory'"
      :size="20"
      :color="disabled ? '#CBD5E1' : '#475569'"
      :stroke-width="2"
    />
    <Settings
      v-if="variant === 'settings'"
      :size="20"
      :color="disabled ? '#CBD5E1' : '#475569'"
      :stroke-width="2"
    />
  </button>
</template>

<style scoped>
.menu-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px;
  height: 48px;
  width: 48px;
  border: none;
  border-bottom: 2px solid;
  border-radius: 9999px;
  cursor: pointer;
  box-sizing: border-box;
}

.menu-button:hover:enabled {
  opacity: 0.9;
}

.menu-button:disabled {
  cursor: not-allowed;
}

.menu-button svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
</style>
