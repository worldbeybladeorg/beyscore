<script setup lang="ts">
import { computed } from "vue";

type ButtonVariant = "blue" | "orange" | "secondary";

interface Props {
  className?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  className: "",
  variant: "blue",
  disabled: false,
});

const variantClass = computed(() => {
  switch (props.variant) {
    case "blue":
      return "text-white bg-[#1088C9] border-t-0 border-x-0 border-b-[#0D6497]";
    case "orange":
      return "text-white bg-[#FF7900] border-t-0 border-x-0 border-b-[#CC5802]";
    case "secondary":
      return "text-[#1088C9] bg-white border border-[#1088C9] border-b-[#1088C9]";
    default:
      return "";
  }
});

defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <button
    class="flex h-[46px] cursor-pointer items-center justify-center rounded-[10px] border-b-2 px-4 py-3 text-center font-titillium text-base leading-6 font-bold outline-none hover:enabled:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    :class="[className, variantClass, { disabled: disabled }]"
    :disabled="disabled"
    @click="!disabled && $emit('click', $event)"
  >
    <slot />
  </button>
</template>
