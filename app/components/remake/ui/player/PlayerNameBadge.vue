<script setup lang="ts">
import { computed } from "vue";

import { cn } from "@/lib/utils";
import type { BestOfOption, PlayerKey } from "@/stores/scoreboardStore";

import PlayerStars from "./PlayerStars.vue";

const props = withDefaults(
  defineProps<{
    name?: string;
    player?: PlayerKey | null;
    bestOf?: BestOfOption;
    filledStars?: boolean[];
    class?: string;
  }>(),
  {
    name: "Player",
    player: null,
    bestOf: null,
    filledStars: () => [] as boolean[],
    class: undefined,
  },
);

const showStars = computed(
  () =>
    props.player !== null &&
    props.bestOf !== null &&
    props.bestOf !== undefined,
);
</script>

<template>
  <div
    :class="cn(
      "inline-flex h-[38px] items-center gap-3 rounded-full bg-white px-4 text-sm font-bold text-[#334155] shadow-[0_2px_8px_rgba(3,7,18,0.05)] font-['Titillium_Web',sans-serif]",
      props.class,
    )"
  >

    <span class="truncate">{{ name }}</span>
    <template v-if="showStars">
      <span class="h-4 w-px bg-[#E5E7EB]" aria-hidden="true" />
      <PlayerStars
        :player="player ?? undefined"
        :count="bestOf ?? undefined"
        :filled-stars="filledStars"
      />
    </template>
  </div>
</template>
