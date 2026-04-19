<script setup lang="ts">
import { ref } from "vue";
import ChipPointsInput from "./ChipPointsInput.vue";
import type { GenerationOption } from "~/stores/scoreboardStore";

interface Props {
  generation: GenerationOption;
  xtrPoints: number;
  ovrPoints: number;
  bstPoints: number;
  spfPoints: number;
}

interface Emits {
  "update:xtrPoints": [value: number];
  "update:ovrPoints": [value: number];
  "update:bstPoints": [value: number];
  "update:spfPoints": [value: number];
  reset: [];
}

defineProps<Props>();
defineEmits<Emits>();

const isOpen = ref(false);
</script>

<template>
  <div class="mt-4">
    <button
      class="flex w-full cursor-pointer items-center justify-between border-0 bg-transparent p-0 font-titillium text-base leading-6 font-bold text-slate-600"
      @click="isOpen = !isOpen"
    >
      <span>Advanced Settings</span>
      <svg
        class="transition-transform duration-200 ease-out"
        :class="{ 'rotate-180': isOpen }"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M4 6L8 10L12 6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    <div v-if="isOpen" class="flex flex-col gap-3 pt-3">
      <ChipPointsInput
        v-if="generation === 'x'"
        label="Xtreme Finish Points"
        :value="xtrPoints"
        @change="$emit('update:xtrPoints', $event)"
      />
      <ChipPointsInput
        v-if="generation === 'x' || generation === 'burst'"
        label="Burst Finish Points"
        :value="bstPoints"
        @change="$emit('update:bstPoints', $event)"
      />
      <ChipPointsInput
        label="Over Finish Points"
        :value="ovrPoints"
        @change="$emit('update:ovrPoints', $event)"
      />
      <ChipPointsInput
        label="Spin Finish Points"
        :value="spfPoints"
        @change="$emit('update:spfPoints', $event)"
      />
      <button
        class="mt-2 cursor-pointer self-start rounded-[10px] border border-b-2 border-slate-300 bg-white px-4 py-2 font-titillium text-sm font-semibold text-slate-500 transition-colors duration-150 ease-out hover:bg-slate-100"
        @click="$emit('reset')"
      >
        Reset to Default
      </button>
    </div>
  </div>
</template>
