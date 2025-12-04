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

const isPlayerOne = computed(() => props.player === "p1");

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
  backgroundPosition: "left center",
  backgroundSize: "auto 100%",
}));

const scoreColor = computed(() =>
  props.player === "p2" ? "#FF5555" : "#1088C9",
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

const showTopChipStack = computed(
  () => props.generation === "x" && !isPlayerOne.value,
);
const showBottomChipStack = computed(
  () => props.generation === "x" && isPlayerOne.value,
);

const showClassicChipsTop = computed(
  () =>
    (props.generation === "mfb-zero-g" ||
      props.generation === "plastics-hms") &&
    !isPlayerOne.value,
);
const showClassicChipsBottom = computed(
  () =>
    (props.generation === "mfb-zero-g" ||
      props.generation === "plastics-hms") &&
    isPlayerOne.value,
);

const showBurstTop = computed(
  () => props.generation === "burst" && !isPlayerOne.value,
);
const showBurstBottom = computed(
  () => props.generation === "burst" && isPlayerOne.value,
);

const showOwnFinishGroup = computed(
  () => props.generation === "x" && props.ownFinishEnabled,
);
const showErrChipOnly = computed(
  () => props.generation === "x" && !props.ownFinishEnabled,
);

const warningLabel = computed(() => (props.showWarning ? "PEN" : "ERR"));
</script>

<template>
  <div
    class="relative flex aspect-square w-[90vw] max-w-[390px] flex-col rounded-[20px] p-5"
    :style="cardStyle"
  >
    <div
      v-if="isPlayerOne"
      class="flex w-full items-start"
      :class="[generation !== 'x' ? 'justify-center' : 'justify-between']"
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
          <div v-if="showOwnFinishGroup" class="flex flex-col items-end gap-3">
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
            v-else-if="showErrChipOnly"
            variant="warning"
            :label="warningLabel"
            :disabled="disabled"
            @chip-click="handleErrClick"
          />
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex w-full items-end"
      :class="generation !== 'x' ? 'justify-center' : 'justify-between'"
    >
      <div
        class="flex flex-1 items-end gap-4"
        :class="generation !== 'x' ? 'justify-center' : 'justify-between'"
      >
        <div v-if="generation === 'x'" class="flex flex-col items-start gap-3">
          <div
            v-if="showOwnFinishGroup"
            class="flex flex-col items-start gap-3"
          >
            <ScoreChip
              variant="warning"
              label="OWF"
              :score="1"
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
            v-else-if="showErrChipOnly"
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
    </div>

    <div
      v-if="showTopChipStack"
      class="mt-5 flex w-full items-start justify-between"
    >
      <div class="flex flex-col gap-3">
        <ScoreChip
          label="OVR"
          :score="ovrScore"
          variant="red"
          :disabled="disabled"
          @chip-click="(points) => handleChipClick(points, 'OVR')"
        />
        <ScoreChip
          label="XTR"
          :score="xtrScore"
          variant="red"
          :disabled="disabled"
          @chip-click="(points) => handleChipClick(points, 'XTR')"
        />
      </div>
      <div class="flex flex-col gap-3">
        <ScoreChip
          label="SPF"
          :score="spfScore"
          variant="red"
          :disabled="disabled"
          @chip-click="(points) => handleChipClick(points, 'SPF')"
        />
        <ScoreChip
          label="BST"
          :score="bstScore"
          variant="red"
          :disabled="disabled"
          @chip-click="(points) => handleChipClick(points, 'BST')"
        />
      </div>
    </div>

    <div
      v-if="showClassicChipsTop"
      class="mt-5 flex w-full items-start justify-between"
    >
      <ScoreChip
        label="OVR"
        :score="1"
        variant="red"
        :disabled="disabled"
        @chip-click="(points) => handleChipClick(points, 'OVR')"
      />
      <ScoreChip
        label="SPF"
        :score="1"
        variant="red"
        :disabled="disabled"
        @chip-click="(points) => handleChipClick(points, 'SPF')"
      />
    </div>

    <div
      v-if="showBurstTop"
      class="mt-5 flex w-full items-start justify-between"
    >
      <ScoreChip
        label="OVR"
        :score="2"
        variant="red"
        :disabled="disabled"
        @chip-click="(points) => handleChipClick(points, 'OVR')"
      />
      <ScoreChip
        label="BST"
        :score="2"
        variant="red"
        :disabled="disabled"
        @chip-click="(points) => handleChipClick(points, 'BST')"
      />
      <ScoreChip
        label="SPF"
        :score="1"
        variant="red"
        :disabled="disabled"
        @chip-click="(points) => handleChipClick(points, 'SPF')"
      />
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

    <div
      v-if="showBottomChipStack"
      class="mt-auto flex w-full items-end justify-between"
    >
      <div class="flex flex-col gap-3">
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
      <div class="flex flex-col gap-3">
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
    </div>

    <div
      v-if="showClassicChipsBottom"
      class="mt-auto flex w-full items-end justify-between"
    >
      <ScoreChip
        label="OVR"
        :score="1"
        variant="blue"
        :disabled="disabled"
        @chip-click="(points) => handleChipClick(points, 'OVR')"
      />
      <ScoreChip
        label="SPF"
        :score="1"
        variant="blue"
        :disabled="disabled"
        @chip-click="(points) => handleChipClick(points, 'SPF')"
      />
    </div>

    <div
      v-if="showBurstBottom"
      class="mt-auto flex w-full items-end justify-between"
    >
      <ScoreChip
        label="OVR"
        :score="2"
        variant="blue"
        :disabled="disabled"
        @chip-click="(points) => handleChipClick(points, 'OVR')"
      />
      <ScoreChip
        label="BST"
        :score="2"
        variant="blue"
        :disabled="disabled"
        @chip-click="(points) => handleChipClick(points, 'BST')"
      />
      <ScoreChip
        label="SPF"
        :score="1"
        variant="blue"
        :disabled="disabled"
        @chip-click="(points) => handleChipClick(points, 'SPF')"
      />
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
