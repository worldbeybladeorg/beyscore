<script setup lang="ts">
import { computed } from "vue";
import { Redo2 } from "lucide-vue-next";

import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    class?: string;
  }>(),
  {
    disabled: false,
    class: undefined,
  },
);

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
      "inline-flex h-12 min-w-[7.5rem] items-center justify-center gap-2 rounded-tr-[10px] rounded-br-[10px] rounded-tl-none rounded-bl-none border-b-2 border-transparent px-4 text-base font-['Titillium_Web',sans-serif] font-bold transition hover:opacity-90 disabled:cursor-not-allowed",
      class,
    )"
  >
    <Redo2 class="size-5" />
    <span>Redo</span>
  </button>
</template>
