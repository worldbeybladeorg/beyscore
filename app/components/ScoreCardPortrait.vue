<script setup lang="ts">
import PlayerName from "./PlayerName.vue";
import ScoringChip from "./ScoringChip.vue";
import ResponseChip from "./ResponseChip.vue";
import type { ScoreCardProps, ScoreCardEmits } from "~/types/scoreCard";

const props = withDefaults(defineProps<ScoreCardProps>(), {
  player: "p1",
  playerName: "Player 1",
  generation: "x",
  bestOf: undefined,
  disabled: false,
  filledStars: () => [],
  showWarning: false,
  ownFinishEnabled: false,
  isFadingIn: false,
  isShrinking: false,
  score: "0",
  xtrScore: 3,
  ovrScore: 2,
  bstScore: 2,
  spfScore: 1,
});

const emit = defineEmits<ScoreCardEmits>();

const handleChipClick = (points: number | undefined, chipLabel: string) => {
  // Emit event with player, points to add, and chip label
  emit("scoreIncrease", points, chipLabel);
};

const handleErrClick = () => {
  if (!props.showWarning) {
    // First click: Show warning chip (ERR -> PEN) - emit toggle event
    emit("warningToggle");
  } else {
    // Second click (PEN): Issue penalty point to opposing player
    emit("penalty");
    // Warning state will be reset by parent after penalty is issued
  }
};

const handleOwnFinishClick = () => {
  emit("ownFinish");
};
</script>

<template>
  <div
    class="score-card relative box-border flex w-full max-w-full flex-col rounded-[20px] bg-size-[auto_100%] bg-position-[left_center] bg-no-repeat p-5"
    :class="{
      'generation-burst': generation === 'burst',
      'generation-mfb-plastics':
        generation === 'mfb-zero-g' || generation === 'plastics-hms',
    }"
    :style="{
      backgroundColor:
        player === 'p2'
          ? 'rgba(255, 85, 85, 0.05)'
          : 'rgba(16, 136, 201, 0.05)',
      backgroundImage:
        player === 'p2'
          ? 'url(/score-card-p2-bg.svg)'
          : 'url(/score-card-p1-bg.svg)',
    }"
  >
    <!-- Player 1: Top row has PlayerName and ERR chip, Bottom has stacked chips -->
    <!-- Player 2: Top row has stacked chips, Bottom has PlayerName and ERR chip -->

    <!-- X Format: Chips stacks (top for p2, bottom for p1) -->
    <div
      v-if="generation === 'x' && player === 'p2'"
      class="mt-0 mb-auto flex w-full flex-row items-start justify-between"
    >
      <!-- Left stack: OVR on top of XTR -->
      <div class="flex flex-col items-start gap-3">
        <ScoringChip
          label="OVR"
          :score="ovrScore"
          variant="red"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'OVR')"
        />
        <ScoringChip
          label="XTR"
          :score="xtrScore"
          variant="red"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'XTR')"
        />
      </div>
      <!-- Right stack: SPF on top of BST -->
      <div class="flex flex-col items-end gap-3">
        <ScoringChip
          label="SPF"
          :score="spfScore"
          variant="red"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'SPF')"
        />
        <ScoringChip
          label="BST"
          :score="bstScore"
          variant="red"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'BST')"
        />
      </div>
    </div>

    <!-- MFB/Zero-G and Plastics/HMS: Only SPF and OVR (top for p2) -->
    <div
      v-if="
        (generation === 'mfb-zero-g' || generation === 'plastics-hms') &&
        player === 'p2'
      "
      class="mt-0 mb-auto flex w-full flex-row items-start justify-between"
    >
      <div class="flex flex-col items-start gap-3">
        <ScoringChip
          label="OVR"
          :score="1"
          variant="red"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'OVR')"
        />
      </div>
      <div class="flex flex-col items-end gap-3">
        <ScoringChip
          label="SPF"
          :score="1"
          variant="red"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'SPF')"
        />
      </div>
    </div>

    <!-- Burst: Horizontal row (top for p2) -->
    <div
      v-if="generation === 'burst' && player === 'p2'"
      class="mt-0 mb-auto flex w-full flex-row items-center justify-between gap-3"
    >
      <ScoringChip
        label="OVR"
        :score="2"
        variant="red"
        :disabled="disabled"
        class="w-auto min-w-0 flex-1"
        @chip-click="(points) => handleChipClick(points, 'OVR')"
      />
      <ScoringChip
        label="BST"
        :score="2"
        variant="red"
        :disabled="disabled"
        class="w-auto min-w-0 flex-1"
        @chip-click="(points) => handleChipClick(points, 'BST')"
      />
      <ScoringChip
        label="SPF"
        :score="1"
        variant="red"
        :disabled="disabled"
        class="w-auto min-w-0 flex-1"
        @chip-click="(points) => handleChipClick(points, 'SPF')"
      />
    </div>

    <!-- PlayerName and ERR/PEN row (top for p1) -->
    <div
      v-if="player === 'p1'"
      class="mb-auto flex w-full flex-row items-start justify-between"
      :class="{ 'justify-center': generation !== 'x' }"
    >
      <div
        class="relative flex flex-col items-start"
        :class="generation !== 'x' ? 'items-center' : ''"
      >
        <PlayerName
          :name="playerName"
          :player="player"
          :best-of="bestOf"
          :filled-stars="filledStars"
        />
        <!-- Warning ResponseChip - 12px below PlayerName, left aligned (X format only) -->
        <ResponseChip
          v-if="generation === 'x' && showWarning"
          variant="warning"
          class="z-10 mt-3"
        />
      </div>
      <!-- ERR / OWF group for Player 1 (X format only, Own Finish enabled) -->
      <div
        v-if="generation === 'x' && ownFinishEnabled"
        class="flex flex-col items-end gap-3"
      >
        <ScoringChip
          variant="warning"
          :label="showWarning ? 'PEN' : 'ERR'"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="handleErrClick"
        />
        <ScoringChip
          label="OWF"
          :score="1"
          variant="warning"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="handleOwnFinishClick"
        />
      </div>
      <!-- Default ERR button when Own Finish is off (X format only) -->
      <ScoringChip
        v-else-if="generation === 'x'"
        variant="warning"
        :label="showWarning ? 'PEN' : 'ERR'"
        :disabled="disabled"
        class="w-[84px] flex-none"
        @chip-click="handleErrClick"
      />
    </div>

    <!-- Middle: Large score number -->
    <div
      class="absolute top-1/2 left-1/2 origin-center -translate-x-1/2 -translate-y-1/2 font-titillium text-[96px] leading-none font-bold"
      :class="{
        'score-fade-in': isFadingIn,
        'score-shrink': isShrinking,
      }"
      :style="{ color: player === 'p2' ? '#FF5555' : '#1088C9' }"
    >
      {{ score }}
    </div>

    <!-- X Format: Chips stacks (bottom for p1) -->
    <div
      v-if="generation === 'x' && player === 'p1'"
      class="mt-auto flex w-full flex-row items-end justify-between"
    >
      <!-- Left stack: XTR on top of OVR -->
      <div class="flex flex-col items-start gap-3">
        <ScoringChip
          label="XTR"
          :score="xtrScore"
          variant="blue"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'XTR')"
        />
        <ScoringChip
          label="OVR"
          :score="ovrScore"
          variant="blue"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'OVR')"
        />
      </div>
      <!-- Right stack: BST on top of SPF -->
      <div class="flex flex-col items-end gap-3">
        <ScoringChip
          label="BST"
          :score="bstScore"
          variant="blue"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'BST')"
        />
        <ScoringChip
          label="SPF"
          :score="spfScore"
          variant="blue"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points: number) => handleChipClick(points, 'SPF')"
        />
      </div>
    </div>

    <!-- MFB/Zero-G and Plastics/HMS: Only SPF and OVR (bottom for p1) -->
    <div
      v-if="
        (generation === 'mfb-zero-g' || generation === 'plastics-hms') &&
        player === 'p1'
      "
      class="mt-auto flex w-full flex-row items-end justify-between"
    >
      <div class="flex flex-col items-start gap-3">
        <ScoringChip
          label="OVR"
          :score="1"
          variant="blue"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'OVR')"
        />
      </div>
      <div class="flex flex-col items-end gap-3">
        <ScoringChip
          label="SPF"
          :score="1"
          variant="blue"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'SPF')"
        />
      </div>
    </div>

    <!-- Burst: Horizontal row (bottom for p1) -->
    <div
      v-if="generation === 'burst' && player === 'p1'"
      class="mt-auto flex w-full flex-row items-center justify-between gap-3"
    >
      <ScoringChip
        label="OVR"
        :score="2"
        variant="blue"
        :disabled="disabled"
        class="w-auto min-w-0 flex-1"
        @chip-click="(points) => handleChipClick(points, 'OVR')"
      />
      <ScoringChip
        label="BST"
        :score="2"
        variant="blue"
        :disabled="disabled"
        class="w-auto min-w-0 flex-1"
        @chip-click="(points) => handleChipClick(points, 'BST')"
      />
      <ScoringChip
        label="SPF"
        :score="1"
        variant="blue"
        :disabled="disabled"
        class="w-auto min-w-0 flex-1"
        @chip-click="(points) => handleChipClick(points, 'SPF')"
      />
    </div>

    <!-- PlayerName and ERR/PEN row (bottom for p2) -->
    <div
      v-if="player === 'p2'"
      class="mt-auto mb-0 flex w-full flex-row items-end justify-between"
      :class="{ 'justify-center': generation !== 'x' }"
    >
      <div
        class="relative flex flex-col items-start"
        :class="generation !== 'x' ? 'items-center' : ''"
      >
        <PlayerName
          :name="playerName"
          :player="player"
          :best-of="bestOf"
          :filled-stars="filledStars"
        />
        <!-- Warning ResponseChip - 12px above PlayerName, left aligned (absolute positioning, X format only) -->
        <ResponseChip
          v-if="generation === 'x' && showWarning"
          variant="warning"
          class="absolute bottom-full left-0 z-10 mb-3"
        />
      </div>
      <!-- ERR / OWF group for Player 2 (X format only, Own Finish enabled) -->
      <div
        v-if="generation === 'x' && ownFinishEnabled"
        class="flex flex-col items-end gap-3"
      >
        <ScoringChip
          label="OWF"
          :score="1"
          variant="warning"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="handleOwnFinishClick"
        />
        <ScoringChip
          variant="warning"
          :label="showWarning ? 'PEN' : 'ERR'"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="handleErrClick"
        />
      </div>
      <!-- Default ERR button when Own Finish is off (X format only) -->
      <ScoringChip
        v-else-if="generation === 'x'"
        variant="warning"
        :label="showWarning ? 'PEN' : 'ERR'"
        :disabled="disabled"
        class="w-[84px] flex-none"
        @chip-click="handleErrClick"
      />
    </div>
  </div>
</template>
