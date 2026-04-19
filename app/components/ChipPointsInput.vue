<script setup lang="ts">
interface Props {
  label: string;
  value: number;
}

interface Emits {
  change: [value: number];
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const handleInput = (e: Event) => {
  const val = parseInt((e.target as HTMLInputElement).value, 10);
  if (!isNaN(val) && val >= 1) {
    emit("change", val);
  }
};
</script>

<template>
  <div class="flex items-center justify-between gap-3">
    <label
      class="font-titillium text-base leading-6 font-bold text-slate-400"
      >{{ label }}</label
    >
    <div
      class="relative flex h-9.5 min-w-17.5 items-center justify-center rounded-t-[10px] border border-b-0 border-slate-300 bg-white px-3 py-2 shadow-[0_2px_0_0_#cbd5e1]"
    >
      <input
        type="number"
        min="1"
        :value="value"
        class="h-full w-12.5 appearance-none border-0 bg-transparent p-0 text-center font-titillium text-base font-bold text-slate-400 outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        @input="handleInput"
      />
    </div>
  </div>
</template>
