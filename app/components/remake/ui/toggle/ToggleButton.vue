<script setup lang="ts">
import { computed } from "vue";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-[10px] border border-transparent font-['Titillium_Web',sans-serif] font-bold leading-[1.5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed",
  {
    variants: {
      size: {
        default: "text-base",
        large: "text-base",
      },
      state: {
        on: "text-white",
        off: "text-slate-400",
      },
    },
    defaultVariants: {
      size: "default",
      state: "off",
    },
  },
);

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    size?: "default" | "large";
    disabled?: boolean;
  }>(),
  {
    modelValue: false,
    size: "default",
    disabled: false,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  toggle: [value: boolean];
}>();

const isOn = computed(() => props.modelValue);

const toggle = () => {
  if (props.disabled) return;
  const next = !props.modelValue;
  emit("update:modelValue", next);
  emit("toggle", next);
};

const sizeMap = {
  default: { height: 38, paddingY: 8, paddingX: 12 },
  large: { height: 46, paddingY: 12, paddingX: 16 },
} as const;

const buttonStyle = computed(() => {
  const dims = sizeMap[props.size ?? "default"];
  const paddingX = isOn.value ? dims.paddingX + 1 : dims.paddingX;

  if (isOn.value) {
    return {
      height: `${dims.height}px`,
      padding: `${dims.paddingY}px ${paddingX}px`,
      backgroundColor: "#FF7900",
      boxShadow: "0px 2px 0px 0px #CC5802",
      border: "none",
      color: "#FFFFFF",
    } as const;
  }

  return {
    height: `${dims.height}px`,
    padding: `${dims.paddingY}px ${paddingX}px`,
    backgroundColor: "#FFFFFF",
    boxShadow: "0px 2px 0px 0px #CBD5E1",
    border: "1px solid #CBD5E1",
    borderBottom: "0",
    color: "#94A3B8",
  } as const;
});
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :style="buttonStyle"
    :class="cn(
      toggleVariants({
        size,
        state: isOn ? "on" : "off",
      }),
    )"
    @click="toggle"
  >
    <slot />
  </button>
</template>
