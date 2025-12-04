<script setup lang="ts">
import { computed } from "vue";
import { History, Settings } from "lucide-vue-next";

import { cn } from "@/lib/utils";

type Variant = "history" | "settings";

const iconMap = {
  history: History,
  settings: Settings,
};

const props = withDefaults(
  defineProps<{
    variant?: Variant;
    disabled?: boolean;
    class?: string;
  }>(),
  {
    variant: "history",
    disabled: false,
    class: undefined,
  },
);

const iconComponent = computed(() => iconMap[props.variant] ?? History);

const buttonStyle = computed(() => ({
  backgroundColor: props.disabled ? "#F8FAFC" : "#F1F5F9",
  borderBottomColor: props.disabled ? "#E2E8F0" : "#CBD5E1",
  color: props.disabled ? "#CBD5E1" : "#475569",
}));
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :style="buttonStyle"
    :class="cn(
      'inline-flex size-12 items-center justify-center rounded-full border-b-2 border-transparent transition hover:opacity-90 disabled:cursor-not-allowed',
      class,
    )"
  >
    <component :is="iconComponent" class="size-5" />
  </button>
</template>
