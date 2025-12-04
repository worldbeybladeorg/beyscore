<script setup lang="ts">
import { computed } from "vue";
import { AlertTriangle, Trophy } from "lucide-vue-next";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const responseChipVariants = cva(
  "inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 font-['Titillium_Web',sans-serif] text-sm font-bold text-slate-600 shadow-[0_2px_8px_rgba(3,7,18,0.05)]",
  {
    variants: {
      variant: {
        warning: "",
        p1Winner: "",
        p2Winner: "",
      },
      size: {
        default: "min-h-[34px]",
        sm: "text-xs",
      },
    },
    defaultVariants: {
      variant: "warning",
      size: "default",
    },
  },
);

const props = withDefaults(
  defineProps<VariantProps<typeof responseChipVariants>>(),
  {
    variant: "warning",
    size: "default",
  },
);

const iconColor = computed(() => {
  if (props.variant === "p1Winner") return "#1088C9";
  if (props.variant === "p2Winner") return "#FF5555";
  return "#F59E0B";
});

const label = computed(() => {
  if (props.variant === "warning") return "Warning";
  return "Winner";
});
</script>

<template>
  <div :class="cn(responseChipVariants({ variant, size }))">
    <component
      :is="variant === 'warning' ? AlertTriangle : Trophy"
      class="size-4"
      :color="iconColor"
      :stroke-width="2"
    />
    <span class="leading-none">{{ label }}</span>
  </div>
</template>
