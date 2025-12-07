<script setup lang="ts">
import { computed } from "vue";

type ScoringChipVariant = "blue" | "red" | "warning";

interface Props {
  label?: string;
  score?: number;
  variant?: ScoringChipVariant;
  disabled?: boolean;
  hideScore?: boolean;
  static?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: "XTR",
  score: 3,
  variant: "blue",
  disabled: false,
  hideScore: false,
  static: false,
});

const emit = defineEmits<{
  chipClick: [score: number | undefined];
}>();

const colorClasses = computed(() => {
  if (props.static) {
    if (props.variant === "warning") return "bg-[#F59E0B] border-transparent";
    if (props.variant === "red") return "bg-[#FF5555] border-transparent";
    return "bg-[#1088C9] border-transparent";
  }
  if (props.variant === "warning") return "bg-[#F59E0B] border-b-[#D97706]";
  if (props.variant === "red") return "bg-[#FF5555] border-b-[#E51d1d]";
  return "bg-[#1088C9] border-b-[#0D6497]";
});

const handleClick = () => {
  // Emit if not disabled and not static (warning variant now also emits, but with null score)
  if (!props.disabled && !props.static) {
    emit("chipClick", props.variant === "warning" ? undefined : props.score);
  }
};
</script>

<template>
  <div
    class="box-border flex items-center justify-start rounded-full border-t-0 border-b-2"
    :class="[
      static
        ? 'h-8 cursor-default gap-2 border-b-0! pr-1.5 pl-2.5'
        : 'h-[38px] gap-2 pr-2 pl-3',
      !disabled && !static ? 'cursor-pointer hover:opacity-90' : '',
      disabled ? 'cursor-not-allowed opacity-60' : '',
      colorClasses,
    ]"
    @click="handleClick"
  >
    <span class="font-titillium text-sm font-bold text-white">{{
      variant === "warning" ? label || "ERR" : label
    }}</span>
    <div
      class="ml-auto box-border flex h-5 min-h-5 w-6 shrink-0 items-center justify-center rounded-full bg-white p-1"
      :class="static ? 'cursor-default' : 'cursor-pointer'"
    >
      <img
        v-if="
          variant === 'warning' &&
          label !== 'PEN' &&
          label !== 'OWF' &&
          label !== 'Own' &&
          label !== 'Penalty'
        "
        src="/alert-triangle.svg"
        alt="Alert"
        class="block h-3 w-3"
      />
      <span
        v-else-if="
          variant === 'warning' &&
          (label === 'PEN' ||
            label === 'OWF' ||
            label === 'Own' ||
            label === 'Penalty')
        "
        class="font-titillium text-xs leading-none font-bold text-[#F59E0B]"
        >+{{ label === "OWF" ? score : 1 }}</span
      >
      <span
        v-else-if="!hideScore"
        class="font-titillium text-xs leading-none font-bold"
        :class="variant === 'red' ? 'text-[#FF5555]' : 'text-[#1088C9]'"
        >+{{ score }}</span
      >
    </div>
  </div>
</template>
