<script setup>
import { computed } from "vue";
import GameSummary from "./GameSummary.vue";
import Button from "./Button.vue";
import { X } from "lucide-vue-next";
import { useScoreboardStore } from "~/stores/scoreboardStore";
import { storeToRefs } from "pinia";

const store = useScoreboardStore();
const {
  player1Score,
  player2Score,
  player1Name,
  player2Name,
  pointsToWin,
  bestOf,
  p1SetWins,
  p2SetWins,
} = storeToRefs(store);

// Reset game using store

const props = defineProps({
  winnerName: {
    type: String,
    default: "PlayerName",
  },
  /**
   * Format controls which win conditions are shown in the summary
   * 'x' (default): XTR, BST, OVR, SPF
   * 'burst':       BST, OVR, SPF
   * 'mfb-zero-g':  OVR, SPF
   * 'plastics-hms': OVR, SPF
   */
  format: {
    type: String,
    default: "x",
    validator: (value) =>
      ["x", "burst", "mfb-zero-g", "plastics-hms"].includes(value),
  },
  /**
   * Optional edge-case line shown only for X format:
   * "Opponent: X OWF, Y PEN"
   */
  showOpponentSummary: {
    type: Boolean,
    default: false,
  },
  opponentOwnFinishCount: {
    type: Number,
    default: 0,
  },
  opponentPenaltyCount: {
    type: Number,
    default: 0,
  },
  /**
   * Optional explicit summary items. If provided, overrides the format-based defaults.
   */
  summaryItems: {
    type: Array,
    default: null,
  },
});

const summaryItemsComputed = computed(() => {
  if (Array.isArray(props.summaryItems) && props.summaryItems.length > 0) {
    return props.summaryItems;
  }

  if (props.format === "burst") {
    // Burst: no XTR
    return [
      { id: "burst", label: "BST", value: 0 },
      { id: "over", label: "OVR", value: 0 },
      { id: "spin", label: "SPF", value: 0 },
    ];
  }

  if (props.format === "mfb-zero-g" || props.format === "plastics-hms") {
    // Metal / Plastics / HMS: no XTR and no BST
    return [
      { id: "over", label: "OVR", value: 0 },
      { id: "spin", label: "SPF", value: 0 },
    ];
  }

  // X format (default): XTR, BST, OVR, SPF
  return [
    { id: "xtreme", label: "XTR", value: 0 },
    { id: "burst", label: "BST", value: 0 },
    { id: "over", label: "OVR", value: 0 },
    { id: "spin", label: "SPF", value: 0 },
  ];
});

const opponentSummaryText = computed(() => {
  const hasOWF = props.opponentOwnFinishCount > 0;
  const hasPEN = props.opponentPenaltyCount > 0;

  if (hasOWF && hasPEN) {
    return `Opponent: ${props.opponentOwnFinishCount} OWF, ${props.opponentPenaltyCount} PEN`;
  } else if (hasOWF) {
    return `Opponent: ${props.opponentOwnFinishCount} OWF`;
  } else if (hasPEN) {
    return `Opponent: ${props.opponentPenaltyCount} PEN`;
  }
  return "";
});

const finalScores = computed(() => {
  const isBestOfMatch = bestOf.value !== undefined;

  if (isBestOfMatch) {
    // Show sets won for best of matches
    const p1SetsWon = p1SetWins.value.filter(Boolean).length;
    const p2SetsWon = p2SetWins.value.filter(Boolean).length;

    return {
      player1: p1SetsWon,
      player2: p2SetsWon,
      isSets: true,
    };
  } else {
    // Show points for regular matches
    const p1Score = player1Score.value;
    const p2Score = player2Score.value;
    const maxScore = pointsToWin.value;

    const isPlayer1Winner = props.winnerName === player1Name.value;
    const isPlayer2Winner = props.winnerName === player2Name.value;

    const p1FinalScore = isPlayer1Winner
      ? Math.min(p1Score, maxScore)
      : p1Score;
    const p2FinalScore = isPlayer2Winner
      ? Math.min(p2Score, maxScore)
      : p2Score;

    return {
      player1: p1FinalScore,
      player2: p2FinalScore,
      isSets: false,
    };
  }
});

defineEmits(["newGame", "viewHistory", "close"]);
</script>

<template>
  <div
    class="relative box-border flex w-full flex-col items-center rounded-[20px] bg-white p-5"
  >
    <button
      class="absolute top-5 right-5 flex h-6 w-6 cursor-pointer items-center justify-center border-none bg-transparent p-0"
      @click="$emit('close')"
    >
      <X :size="24" color="#64748b" :stroke-width="2" />
    </button>

    <div class="flex w-full flex-col items-center">
      <div
        class="text-center font-titillium text-base font-normal text-slate-500"
      >
        Winner
      </div>
      <div
        class="mt-[2px] text-center font-titillium text-lg font-bold text-slate-700"
      >
        {{ winnerName }}
      </div>
    </div>

    <div class="mt-6 w-full">
      <div class="mb-4 flex justify-center gap-8">
        <div class="text-center">
          <div class="mb-1 font-titillium text-sm text-slate-500">
            {{ player1Name }}
          </div>
          <div
            class="font-titillium text-2xl font-bold"
            :style="{ color: '#1088C9' }"
          >
            {{ finalScores.player1 }}{{ finalScores.isSets ? " sets" : " pts" }}
          </div>
        </div>
        <div class="text-center">
          <div class="mb-1 font-titillium text-sm text-slate-500">
            {{ player2Name }}
          </div>
          <div
            class="font-titillium text-2xl font-bold"
            :style="{ color: '#FF5555' }"
          >
            {{ finalScores.player2 }}{{ finalScores.isSets ? " sets" : " pts" }}
          </div>
        </div>
      </div>
      <GameSummary :items="summaryItemsComputed" />
    </div>

    <div
      v-if="format === 'x' && showOpponentSummary"
      class="mt-5 w-full text-center font-titillium text-sm font-normal text-slate-400"
    >
      {{ opponentSummaryText }}
    </div>

    <div class="mt-6 flex w-full flex-row gap-5">
      <Button
        variant="blue"
        class-name="flex-1 w-full font-bold"
        @click="$emit('newGame')"
        >New Game</Button
      >
      <Button
        variant="secondary"
        class-name="flex-1 w-full font-bold"
        @click="$emit('viewHistory')"
        >View History</Button
      >
    </div>
  </div>
</template>
