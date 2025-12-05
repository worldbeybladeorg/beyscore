<template>
  <div
    class="box-border flex w-full flex-col rounded-[10px] border border-slate-200 bg-white p-[6px] shadow-[0_0_8px_rgba(15,23,42,0.10)]"
  >
    <div
      v-for="(item, index) in items"
      :key="index"
      class="box-border flex w-full cursor-pointer flex-row items-center justify-between rounded-[4px] px-3 py-[6px]"
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

<script setup>
import { Check } from "lucide-vue-next";

const props = defineProps({
  items: {
    type: Array,
    required: true,
    validator: (value) => {
      return (
        Array.isArray(value) &&
        value.every(
          (item) =>
            typeof item === "object" &&
            item.hasOwnProperty("label") &&
            item.hasOwnProperty("value"),
        )
      );
    },
  },
  selectedValue: {
    type: [String, Number, null],
    default: null,
  },
});

const emit = defineEmits(["select"]);

const handleItemClick = (item) => {
  emit("select", item.value);
};
</script>
