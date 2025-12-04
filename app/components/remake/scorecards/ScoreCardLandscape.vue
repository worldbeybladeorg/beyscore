<script setup lang="ts">
import { computed } from "vue";

import PlayerNameBadge from "../ui/player/PlayerNameBadge.vue";
import ResponseChip from "../ui/chip/ResponseChip.vue";
import ScoreChip from "../ui/chip/ScoreChip.vue";

const props = withDefaults(
  defineProps<{
    player?: "p1" | "p2";
    playerName?: string;
    generation?: "x" | "burst" | "mfb-zero-g" | "plastics-hms";
    bestOf?: 3 | 5 | null;
    disabled?: boolean;
    filledStars?: boolean[];
    showWarning?: boolean;
    ownFinishEnabled?: boolean;
    isFadingIn?: boolean;
    isShrinking?: boolean;
    score?: string;
    xtrScore?: number;
    ovrScore?: number;
    bstScore?: number;
    spfScore?: number;
  }>(),
  {
    player: "p1",
    playerName: "Player 1",
    generation: "x",
    bestOf: null,
    disabled: false,
    filledStars: () => [] as boolean[],
    showWarning: false,
    ownFinishEnabled: false,
    isFadingIn: false,
    isShrinking: false,
    score: "0",
    xtrScore: 3,
    ovrScore: 2,
    bstScore: 2,
    spfScore: 1,
  },
);

const emit = defineEmits<{
  (e: "scoreIncrease", points: number | null, chipLabel: string): void;
  (e: "penalty"): void;
  (e: "warningToggle"): void;
  (e: "ownFinish"): void;
}>();

const cardStyle = computed(() => ({
  backgroundColor:
    props.player === "p2"
      ? "rgba(255, 85, 85, 0.05)"
      : "rgba(16, 136, 201, 0.05)",
  backgroundImage:
    props.player === "p2"
      ? "url(/score-card-p2-bg.svg)"
      : "url(/score-card-p1-bg.svg)",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right center",
  backgroundSize: "auto 100%",
}));

const scoreColor = computed(() =>
  props.player === "p2" ? "#FF5555" : "#1088C9",
);

const warningLabel = computed(() => (props.showWarning ? "PEN" : "ERR"));

const showXFormat = computed(() => props.generation === "x");
const showBurst = computed(() => props.generation === "burst");
const showClassic = computed(
  () =>
    props.generation === "mfb-zero-g" || props.generation === "plastics-hms",
);

const handleChipClick = (points: number | null, label: string) => {
  emit("scoreIncrease", points, label);
};

const handleErrClick = () => {
  if (!props.showWarning) {
    emit("warningToggle");
  } else {
    emit("penalty");
  }
};

const handleOwnFinishClick = () => {
  emit("ownFinish");
};

const chipColumnClasses = "flex flex-col gap-3";
</script>

<template>
  <div
    class="relative flex aspect-square w-[90vw] max-w-[390px] flex-col rounded-[20px] p-5"
    :style="cardStyle"
  >
    <div
      v-if="player === 'p1'"
      class="flex w-full items-start"
      :class="generation !== 'x' ? 'justify-center' : 'justify-between'"
    >
      <div
        class="flex flex-1 items-start gap-4"
        :class="generation !== 'x' ? 'justify-center' : 'justify-between'"
      >
        <div class="flex flex-col items-start gap-3">
          <PlayerNameBadge
            :name="playerName"
            :player="player"
            :best-of="bestOf"
            :filled-stars="filledStars"
          />
          <ResponseChip
            v-if="generation === 'x' && showWarning"
            variant="warning"
            class="mt-3"
          />
        </div>
        <div v-if="generation === 'x'" class="flex flex-col items-end gap-3">
          <div v-if="ownFinishEnabled" class="flex flex-col items-end gap-3">
            <ScoreChip
              variant="warning"
              :label="warningLabel"
              :disabled="disabled"
              @chip-click="handleErrClick"
            />
            <ScoreChip
              variant="warning"
              label="OWF"
              :score="1"
              :disabled="disabled"
              @chip-click="handleOwnFinishClick"
            />
          </div>
          <ScoreChip
            v-else-if="generation === 'x'"
            variant="warning"
            :label="warningLabel"
            :disabled="disabled"
            @chip-click="handleErrClick"
          />
        </div>
      </div>
    </div>

    <div
      v-if="player === 'p2'"
      class="absolute top-5 right-5 left-5 flex items-start justify-between gap-4"
      :class="generation !== 'x' ? 'justify-center' : 'justify-between'"
    >
      <div v-if="generation === 'x'" class="flex items-start gap-3">
        <div v-if="ownFinishEnabled" class="flex flex-col items-start gap-3">
          <ScoreChip
            label="OWF"
            :score="1"
            variant="warning"
            :disabled="disabled"
            @chip-click="handleOwnFinishClick"
          />
          <ScoreChip
            variant="warning"
            :label="warningLabel"
            :disabled="disabled"
            @chip-click="handleErrClick"
          />
        </div>
        <ScoreChip
          v-else
          variant="warning"
          :label="warningLabel"
          :disabled="disabled"
          @chip-click="handleErrClick"
        />
      </div>
      <div class="flex flex-col items-start gap-3">
        <ResponseChip
          v-if="generation === 'x' && showWarning"
          variant="warning"
          class="-mb-3"
        />
        <PlayerNameBadge
          :name="playerName"
          :player="player"
          :best-of="bestOf"
          :filled-stars="filledStars"
        />
      </div>
    </div>

    <div
      class="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center font-['Titillium_Web',sans-serif] text-[96px] leading-none font-bold"
      :style="{ color: scoreColor }"
      :class="{
        'score-fade-in': isFadingIn,
        'score-shrink': isShrinking,
      }"
    >
      {{ score }}
    </div>

    <div v-if="player === 'p2'" class="absolute right-5 bottom-5 flex gap-4">
      <template v-if="showXFormat">
        <div :class="chipColumnClasses">
          <ScoreChip
            label="XTR"
            :score="xtrScore"
            variant="red"
            :disabled="disabled"
            @chip-click="(points) => handleChipClick(points, 'XTR')"
          />
          <ScoreChip
            label="OVR"
            :score="ovrScore"
            variant="red"
            :disabled="disabled"
            @chip-click="(points) => handleChipClick(points, 'OVR')"
          />
        </div>
        <div :class="chipColumnClasses">
          <ScoreChip
            label="BST"
            :score="bstScore"
            variant="red"
            :disabled="disabled"
            @chip-click="(points) => handleChipClick(points, 'BST')"
          />
          <ScoreChip
            label="SPF"
            :score="spfScore"
            variant="red"
            :disabled="disabled"
            @chip-click="(points) => handleChipClick(points, 'SPF')"
          />
        </div>
      </template>
      <template v-else-if="showBurst">
        <div :class="chipColumnClasses">
          <ScoreChip
            label="OVR"
            :score="ovrScore"
            variant="red"
            :disabled="disabled"
            @chip-click="(points) => handleChipClick(points, 'OVR')"
          />
          <ScoreChip
            label="BST"
            :score="bstScore"
            variant="red"
            :disabled="disabled"
            @chip-click="(points) => handleChipClick(points, 'BST')"
          />
          <ScoreChip
            label="SPF"
            :score="spfScore"
            variant="red"
            :disabled="disabled"
            @chip-click="(points) => handleChipClick(points, 'SPF')"
          />
        </div>
      </template>
      <template v-else-if="showClassic">
        <div :class="chipColumnClasses">
          <ScoreChip
            label="OVR"
            :score="ovrScore"
            variant="red"
            :disabled="disabled"
            @chip-click="(points) => handleChipClick(points, 'OVR')"
          />
          <ScoreChip
            label="SPF"
            :score="spfScore"
            variant="red"
            :disabled="disabled"
            @chip-click="(points) => handleChipClick(points, 'SPF')"
          />
        </div>
      </template>
    </div>

    <div v-if="player === 'p1'" class="absolute bottom-5 left-5 flex gap-4">
      <template v-if="showXFormat">
        <div :class="chipColumnClasses">
          <ScoreChip
            label="XTR"
            :score="xtrScore"
            variant="blue"
            :disabled="disabled"
            @chip-click="(points) => handleChipClick(points, 'XTR')"
          />
          <ScoreChip
            label="OVR"
            :score="ovrScore"
            variant="blue"
            :disabled="disabled"
            @chip-click="(points) => handleChipClick(points, 'OVR')"
          />
        </div>
        <div :class="chipColumnClasses">
          <ScoreChip
            label="BST"
            :score="bstScore"
            variant="blue"
            :disabled="disabled"
            @chip-click="(points) => handleChipClick(points, 'BST')"
          />
          <ScoreChip
            label="SPF"
            :score="spfScore"
            variant="blue"
            :disabled="disabled"
            @chip-click="(points) => handleChipClick(points, 'SPF')"
          />
        </div>
      </template>
      <template v-else-if="showBurst">
        <div :class="chipColumnClasses">
          <ScoreChip
            label="OVR"
            :score="ovrScore"
            variant="blue"
            :disabled="disabled"
            @chip-click="(points) => handleChipClick(points, 'OVR')"
          />
          <ScoreChip
            label="BST"
            :score="bstScore"
            variant="blue"
            :disabled="disabled"
            @chip-click="(points) => handleChipClick(points, 'BST')"
          />
          <ScoreChip
            label="SPF"
            :score="spfScore"
            variant="blue"
            :disabled="disabled"
            @chip-click="(points) => handleChipClick(points, 'SPF')"
          />
        </div>
      </template>
      <template v-else-if="showClassic">
        <div :class="chipColumnClasses">
          <ScoreChip
            label="OVR"
            :score="ovrScore"
            variant="blue"
            :disabled="disabled"
            @chip-click="(points) => handleChipClick(points, 'OVR')"
          />
          <ScoreChip
            label="SPF"
            :score="spfScore"
            variant="blue"
            :disabled="disabled"
            @chip-click="(points) => handleChipClick(points, 'SPF')"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.score-fade-in {
  animation: fadeInScore 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.score-shrink {
  animation: shrinkScore 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes shrinkScore {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
}

@keyframes fadeInScore {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
