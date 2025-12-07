<script setup lang="ts">
import type { GameSummaryItem } from "~/types/scoreCard";

interface Props {
  items?: GameSummaryItem[];
}

withDefaults(defineProps<Props>(), {
  items: () => [
    { id: "xtreme", label: "XTR", value: 0 },
    { id: "burst", label: "BST", value: 0 },
    { id: "over", label: "OVR", value: 0 },
    { id: "spin", label: "SPF", value: 0 },
  ],
});
</script>

<template>
  <div
    class="box-border flex h-12 w-full items-stretch justify-between overflow-visible rounded-none border-none bg-transparent shadow-none"
  >
    <div
      v-for="(item, index) in items"
      :key="item.id || index"
      class="flex flex-1 flex-col items-center justify-center border-l border-slate-200 px-2 first:border-l-0"
    >
      <div class="font-titillium text-sm leading-5 font-normal text-slate-500">
        {{ item.value }}
      </div>
      <div
        class="mt-0.5 font-titillium text-lg leading-6 font-bold text-slate-700"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>
