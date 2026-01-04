<script setup lang="ts">
import { computed } from "vue";
import GameSummary from "./GameSummary.vue";
import Button from "./Button.vue";
import { X } from "lucide-vue-next";
import { useScoreboardStore } from "~/stores/scoreboardStore";
import type { GenerationOption } from "~/stores/scoreboardStore";
import { storeToRefs } from "pinia";
import { getMaxPoints } from "~/lib/gameUtils";
import type { GameSummaryItem } from "~/types/scoreCard";

interface Props {
  winnerName?: string;
  /**
   * Format controls which win conditions are shown in the summary
   * 'x' (default): XTR, BST, OVR, SPF
   * 'burst':       BST, OVR, SPF
   * 'mfb-zero-g':  OVR, SPF
   * 'plastics-hms': OVR, SPF
   */
  format?: GenerationOption;
  /**
   * Optional edge-case line shown only for X format:
   * "Opponent: X OWF, Y PEN"
   */
  showOpponentSummary?: boolean;
  opponentOwnFinishCount?: number;
  opponentPenaltyCount?: number;
  /**
   * Optional explicit summary items. If provided, overrides the format-based defaults.
   */
  summaryItems?: GameSummaryItem[] | null;
}

const props = withDefaults(defineProps<Props>(), {
  winnerName: "PlayerName",
  format: "x",
  showOpponentSummary: false,
  opponentOwnFinishCount: 0,
  opponentPenaltyCount: 0,
  summaryItems: null,
});

const store = useScoreboardStore();
const {
  player1Score,
  player2Score,
  player1Name,
  player2Name,
  matchType,
  customPoints,
  bestOf,
  p1SetWins,
  p2SetWins,
} = storeToRefs(store);

const summaryItemsComputed = computed((): GameSummaryItem[] => {
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

interface FinalScores {
  player1: number;
  player2: number;
  player1Color: string;
  player2Color: string;
  isSets: boolean;
}

const finalScores = computed((): FinalScores => {
  const isBestOfMatch = bestOf.value !== undefined;

  if (isBestOfMatch) {
    // Show sets won for best of matches
    const p1SetsWon = p1SetWins.value.filter(Boolean).length;
    const p2SetsWon = p2SetWins.value.filter(Boolean).length;

    const isPlayer1Winner = props.winnerName === player1Name.value;
    const isPlayer2Winner = props.winnerName === player2Name.value;

    return {
      player1: p1SetsWon,
      player2: p2SetsWon,
      player1Color: isPlayer1Winner ? "#10b981" : "#ef4444",
      player2Color: isPlayer2Winner ? "#10b981" : "#ef4444",
      isSets: true,
    };
  } else {
    // Show points for regular matches
    const p1Score = player1Score.value;
    const p2Score = player2Score.value;

    const maxScore = getMaxPoints(matchType.value, customPoints.value);

    const isPlayer1Winner = props.winnerName === player1Name.value;
    const isPlayer2Winner = props.winnerName === player2Name.value;

    const p1FinalScore =
      isPlayer1Winner && maxScore !== null
        ? Math.min(p1Score, maxScore)
        : p1Score;
    const p2FinalScore =
      isPlayer2Winner && maxScore !== null
        ? Math.min(p2Score, maxScore)
        : p2Score;

    return {
      player1: p1FinalScore,
      player2: p2FinalScore,
      player1Color: isPlayer1Winner ? "#10b981" : "#ef4444",
      player2Color: isPlayer2Winner ? "#10b981" : "#ef4444",
      isSets: false,
    };
  }
});

defineEmits<{
  newGame: [];
  viewHistory: [];
  close: [];
}>();
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
        class="mt-0.5 text-center font-titillium text-lg font-bold text-slate-700"
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
