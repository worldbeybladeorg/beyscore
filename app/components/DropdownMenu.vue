<script setup lang="ts">
import { Check } from "lucide-vue-next";

interface DropdownItem {
  label: string;
  value: string | number;
}

interface Props {
  items: DropdownItem[];
  selectedValue?: string | number | null;
}

withDefaults(defineProps<Props>(), {
  selectedValue: null,
});

const emit = defineEmits<{
  select: [value: string | number];
}>();

const handleItemClick = (item: DropdownItem) => {
  emit("select", item.value);
};
</script>

<template>
  <div
    class="box-border flex w-full flex-col rounded-[10px] border border-slate-200 bg-white p-1.5 shadow-[0_0_8px_rgba(15,23,42,0.10)]"
  >
    <div
      v-for="(item, index) in items"
      :key="index"
      class="box-border flex w-full cursor-pointer flex-row items-center justify-between rounded-sm px-3 py-1.5"
      :class="{ 'bg-slate-50': item.value === selectedValue }"
      @click="handleItemClick(item)"
    >
      <span class="font-titillium text-base font-normal text-slate-600">{{
        item.label
      }}</span>
      <Check
        v-if="item.value === selectedValue"
        :size="20"
        color="#64748b"
        stroke-width="2"
      />
    </div>
  </div>
</template>
