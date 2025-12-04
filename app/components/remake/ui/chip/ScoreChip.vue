<script setup lang="ts">
import { computed } from "vue";

import { cn } from "@/lib/utils";

type ChipVariant = "blue" | "red" | "warning";

const props = withDefaults(
  defineProps<{
    label?: string;
    score?: number;
    variant?: ChipVariant;
    disabled?: boolean;
    hideScore?: boolean;
    static?: boolean;
  }>(),
  {
    label: "XTR",
    score: 3,
    variant: "blue",
    disabled: false,
    hideScore: false,
    static: false,
  },
);

const emit = defineEmits<{
  (e: "chipClick", value: number | null): void;
}>();

const palette: Record<
  ChipVariant,
  { background: string; border: string; text: string; score: string }
> = {
  blue: {
    background: "#1088C9",
    border: "#0D6497",
    text: "#FFFFFF",
    score: "#1088C9",
  },
  red: {
    background: "#FF5555",
    border: "#E51d1d",
    text: "#FFFFFF",
    score: "#FF5555",
  },
  warning: {
    background: "#F59E0B",
    border: "#D97706",
    text: "#FFFFFF",
    score: "#F59E0B",
  },
};

const token = computed(() => palette[props.variant]);

const wrapperStyle = computed(() => ({
  backgroundColor: token.value.background,
  color: token.value.text,
  borderBottomColor: props.static ? "transparent" : token.value.border,
  boxShadow: props.static ? "none" : `0px 2px 0px 0px ${token.value.border}`,
}));

const showScore = computed(
  () =>
    !props.hideScore &&
    props.variant !== "warning" &&
    props.score !== null &&
    props.score !== undefined,
);

const handleClick = () => {
  if (props.disabled || props.static) return;
  emit("chipClick", props.variant === "warning" ? null : (props.score ?? null));
};
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :style="wrapperStyle"
    :class="
      cn(
        "group flex items-center gap-2 rounded-full border-b-2 border-t-0 pl-3 pr-2 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 font-['Titillium_Web',sans-serif] focus-visible:outline-none focus-visible:ring-0 border-l-0 border-r-0",
        static ? "h-8 pl-2.5 pr-1.5" : "h-[38px]",
        !disabled && !static ? "cursor-pointer hover:opacity-90" : "cursor-default",
      )
    "
    @click="handleClick"
  >
    <span class="leading-none">{{ variant === 'warning' ? label || 'ERR' : label }}</span>
    <span class="ml-auto flex h-5 min-h-[20px] w-6 items-center justify-center rounded-full bg-white px-1 text-xs font-bold leading-none">
      <img
        v-if="variant === 'warning' && label !== 'PEN' && label !== 'OWF' && label !== 'Own' && label !== 'Penalty'"
        src="/alert-triangle.svg"
        alt="Alert"
        class="h-3 w-3"
      />
      <span
        v-else-if="variant === 'warning'"
        class="font-['Titillium_Web',sans-serif] text-[0.75rem] font-bold leading-none"
        :style="{ color: '#F59E0B' }"
      >
        +{{ label === 'OWF' ? score ?? 1 : 1 }}
      </span>
      <span
        v-else-if="showScore"
        class="font-['Titillium_Web',sans-serif] text-[0.75rem] font-bold leading-none"
        :style="{ color: token.score }"
      >
        +{{ score }}
      </span>
    </span>
  </button>
</template>

