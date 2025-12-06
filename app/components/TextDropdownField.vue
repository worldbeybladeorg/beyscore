<script setup lang="ts">
import { ref, computed } from "vue";
import { ChevronDown, ChevronUp } from "lucide-vue-next";

type TextDropdownVariant = "input" | "dropdown";

interface Props {
  title?: string;
  modelValue?: string;
  variant?: TextDropdownVariant;
  showChevron?: boolean;
  maxLength?: number | undefined;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Title",
  modelValue: "Text",
  variant: "input",
  showChevron: true,
  maxLength: undefined,
});

const emit = defineEmits<{
  toggle: [];
  "update:modelValue": [value: string];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value = target.value;
  // Enforce maxLength if provided
  if (props.maxLength && value.length > props.maxLength) {
    value = value.slice(0, props.maxLength);
  }
  emit("update:modelValue", value);
};

const isDropdown = computed(() => props.variant === "dropdown");
const isDropdownOpen = ref(false);

const handleFieldClick = () => {
  if (isDropdown.value) {
    isDropdownOpen.value = !isDropdownOpen.value;
  }
  emit("toggle");
};
</script>

<template>
  <div class="flex w-full cursor-pointer flex-col" @click="handleFieldClick">
    <div class="font-titillium text-sm font-semibold text-slate-500">
      {{ title }}
    </div>
    <div
      class="relative mt-2 flex items-center justify-between rounded-[10px] border border-slate-300 bg-white px-3 py-2 shadow-[0_0_4px_rgba(15,23,42,0.05)] transition-colors duration-200 hover:opacity-90 active:opacity-90"
      :class="{ dropdown: isDropdown }"
    >
      <template v-if="isDropdown">
        <span
          class="font-titillium text-base font-normal text-slate-600"
          @click.stop
          >{{ modelValue }}</span
        >
      </template>
      <template v-else>
        <input
          class="w-full border-none bg-transparent p-0 font-titillium text-base font-normal text-slate-600 outline-none"
          type="text"
          :value="modelValue"
          :maxlength="maxLength"
          @input="handleInput"
          @click.stop
        />
      </template>
      <div
        v-if="isDropdown && showChevron"
        class="ml-2 flex items-center justify-center"
      >
        <ChevronUp
          v-if="isDropdownOpen"
          :size="20"
          color="#64748b"
          stroke-width="2"
        />
        <ChevronDown v-else :size="20" color="#64748b" stroke-width="2" />
      </div>
    </div>
  </div>
</template>
