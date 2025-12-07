<script setup lang="ts">
import { ref, watch } from "vue";

type ToggleButtonSize = "default" | "large";

interface Props {
  initialState?: boolean;
  size?: ToggleButtonSize;
}

const props = withDefaults(defineProps<Props>(), {
  initialState: false,
  size: "default",
});

const isOn = ref(props.initialState);
const emit = defineEmits<{
  "update:state": [state: boolean];
  toggle: [state: boolean];
}>();

// Sync internal state with initialState prop (important for controlled components)
// This ensures the button respects the parent's state even after internal toggles
watch(
  () => props.initialState,
  (newValue: boolean) => {
    isOn.value = newValue;
  },
  { immediate: true },
);

function toggleState() {
  const newState = !isOn.value;
  isOn.value = newState;
  emit("update:state", newState);
  emit("toggle", newState);
}
</script>

<template>
  <button
    class="relative box-border flex h-[38px] cursor-pointer items-center justify-center rounded-[10px] text-center font-titillium text-base leading-6 font-bold hover:opacity-90"
    :class="[
      isOn
        ? 'border-none bg-[#FF7900] px-[calc(0.75rem+1px)] py-2 text-white shadow-[0_2px_0_0_#CC5802]'
        : 'border border-b-0 border-slate-300 bg-white px-3 py-2 text-slate-400 shadow-[0_2px_0_0_#cbd5e1]',
      size === 'large' ? 'h-[46px]!' : '',
      size === 'large' && !isOn ? 'px-4! py-3!' : '',
      size === 'large' && isOn ? 'px-[calc(1rem+1px)]! py-3!' : '',
    ]"
    @click="toggleState"
  >
    <slot />
  </button>
</template>
