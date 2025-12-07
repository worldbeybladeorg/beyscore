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
    class="relative box-border flex aspect-square w-[90vw] max-w-[390px] flex-col rounded-[20px] bg-size-[auto_100%] bg-position-[right_center] bg-no-repeat p-5"
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

    <!-- X Format: Chips bottom right (landscape layout) -->
    <div
      v-if="generation === 'x' && player === 'p2'"
      class="absolute right-5 bottom-5 flex flex-row items-end"
    >
      <!-- 4 chips stacked (XTR, OVR, BST, SPF) -->
      <div class="flex flex-col items-end gap-3">
        <ScoringChip
          label="XTR"
          :score="xtrScore"
          variant="red"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'XTR')"
        />
        <ScoringChip
          label="OVR"
          :score="ovrScore"
          variant="red"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'OVR')"
        />
        <ScoringChip
          label="BST"
          :score="bstScore"
          variant="red"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'BST')"
        />
        <ScoringChip
          label="SPF"
          :score="spfScore"
          variant="red"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'SPF')"
        />
      </div>
    </div>

    <!-- Burst: Stacked chips bottom right (same as X format, minus XTR) -->
    <div
      v-if="generation === 'burst' && player === 'p2'"
      class="absolute right-5 bottom-5 flex flex-row items-end"
    >
      <div class="flex flex-col items-end gap-3">
        <ScoringChip
          label="OVR"
          :score="ovrScore"
          variant="red"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'OVR')"
        />
        <ScoringChip
          label="BST"
          :score="bstScore"
          variant="red"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'BST')"
        />
        <ScoringChip
          label="SPF"
          :score="spfScore"
          variant="red"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'SPF')"
        />
      </div>
    </div>

    <!-- MFB/Zero-G and Plastics/HMS: Stacked chips bottom right (same as X format, minus XTR and BST) -->
    <div
      v-if="
        (generation === 'mfb-zero-g' || generation === 'plastics-hms') &&
        player === 'p2'
      "
      class="absolute right-5 bottom-5 flex flex-row items-end"
    >
      <div class="flex flex-col items-end gap-3">
        <ScoringChip
          label="OVR"
          :score="ovrScore"
          variant="red"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'OVR')"
        />
        <ScoringChip
          label="SPF"
          :score="spfScore"
          variant="red"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'SPF')"
        />
      </div>
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

    <!-- X Format: Chips bottom left (landscape layout) -->
    <div
      v-if="generation === 'x' && player === 'p1'"
      class="absolute bottom-5 left-5 flex flex-row items-end"
    >
      <!-- 4 chips stacked (XTR, OVR, BST, SPF) -->
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
          @chip-click="(points) => handleChipClick(points, 'SPF')"
        />
      </div>
    </div>

    <!-- Burst: Stacked chips bottom left (same as X format, minus XTR) -->
    <div
      v-if="generation === 'burst' && player === 'p1'"
      class="absolute bottom-5 left-5 flex flex-row items-end"
    >
      <div class="flex flex-col items-start gap-3">
        <ScoringChip
          label="OVR"
          :score="ovrScore"
          variant="blue"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'OVR')"
        />
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
          @chip-click="(points) => handleChipClick(points, 'SPF')"
        />
      </div>
    </div>

    <!-- MFB/Zero-G and Plastics/HMS: Stacked chips bottom left (same as X format, minus XTR and BST) -->
    <div
      v-if="
        (generation === 'mfb-zero-g' || generation === 'plastics-hms') &&
        player === 'p1'
      "
      class="absolute bottom-5 left-5 flex flex-row items-end"
    >
      <div class="flex flex-col items-start gap-3">
        <ScoringChip
          label="OVR"
          :score="ovrScore"
          variant="blue"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'OVR')"
        />
        <ScoringChip
          label="SPF"
          :score="spfScore"
          variant="blue"
          :disabled="disabled"
          class="w-[84px] flex-none"
          @chip-click="(points) => handleChipClick(points, 'SPF')"
        />
      </div>
    </div>

    <!-- PlayerName and ERR/PEN row for Player 2 -->
    <!-- X format: centered vertically (same position as chips) -->
    <div
      v-if="player === 'p2' && generation === 'x'"
      class="absolute top-0 right-0 left-0 box-border flex w-full flex-row items-start justify-between p-5"
    >
      <!-- ERR / OWF group for Player 2 (X format only, Own Finish enabled) -->
      <div v-if="ownFinishEnabled" class="flex flex-col items-end gap-3">
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
        v-else
        variant="warning"
        :label="showWarning ? 'PEN' : 'ERR'"
        :disabled="disabled"
        class="w-[84px] flex-none"
        @chip-click="handleErrClick"
      />
      <div class="relative flex flex-col items-start">
        <PlayerName
          :name="playerName"
          :player="player"
          :best-of="bestOf"
          :filled-stars="filledStars"
        />
        <!-- Warning ResponseChip - 12px below PlayerName, right aligned (absolute positioning, X format only) -->
        <ResponseChip
          v-if="showWarning"
          variant="warning"
          class="absolute top-full right-0 z-10 mt-3"
        />
      </div>
    </div>
    <!-- Non-X format: same layout as X format (top row with player name, centered) -->
    <div
      v-else-if="player === 'p2'"
      class="absolute top-0 right-0 left-0 box-border flex w-full flex-row items-start justify-center p-5"
    >
      <div class="relative flex flex-col items-center">
        <PlayerName
          :name="playerName"
          :player="player"
          :best-of="bestOf"
          :filled-stars="filledStars"
        />
      </div>
    </div>
  </div>
</template>
