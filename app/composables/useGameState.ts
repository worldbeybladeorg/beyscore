import { computed, watch, type Ref } from "vue";
import {
  getMaxPoints,
  computeNameTruncationLimit,
  formatDisplayName,
} from "~/lib/gameUtils";
import type {
  GenerationOption,
  MatchTypeOption,
  BestOfOption,
} from "~/stores/scoreboardStore";

interface UseGameStateOptions {
  generation: Ref<GenerationOption>;
  matchType: Ref<MatchTypeOption>;
  customPoints: Ref<number>;
  bestOf: Ref<BestOfOption>;
  player1Score: Ref<number>;
  player2Score: Ref<number>;
  player1NameSetting: Ref<string>;
  player2NameSetting: Ref<string>;
  matchHistory: Ref<any[]>;
  p1SetWins: Ref<boolean[]>;
  p2SetWins: Ref<boolean[]>;
  displayedSetNumber: Ref<number>;
  showGameResultsOverlay: Ref<boolean>;
  gameResultsOverlayHasBeenShown: Ref<boolean>;
}

export function useGameState(options: UseGameStateOptions) {
  const {
    generation,
    matchType,
    customPoints,
    bestOf,
    player1Score,
    player2Score,
    player1NameSetting,
    player2NameSetting,
    matchHistory,
    p1SetWins,
    p2SetWins,
    displayedSetNumber,
    showGameResultsOverlay,
    gameResultsOverlayHasBeenShown,
  } = options;

  const maxPoints = computed(() =>
    getMaxPoints(matchType.value, customPoints.value),
  );

  const nameTruncationLimit = computed(() =>
    computeNameTruncationLimit(bestOf.value),
  );

  const player1DisplayName = computed(() =>
    formatDisplayName(player1NameSetting.value, nameTruncationLimit.value),
  );

  const player2DisplayName = computed(() =>
    formatDisplayName(player2NameSetting.value, nameTruncationLimit.value),
  );

  const gameHasStarted = computed(() => {
    return (
      player1Score.value > 0 ||
      player2Score.value > 0 ||
      matchHistory.value.length > 0 ||
      p1SetWins.value.length > 0 ||
      p2SetWins.value.length > 0
    );
  });

  const matchOver = computed(() => {
    if (bestOf.value === undefined) {
      return false;
    }
    const setsNeeded = Math.floor(bestOf.value / 2) + 1;
    const p1Wins = p1SetWins.value.filter((won) => won).length;
    const p2Wins = p2SetWins.value.filter((won) => won).length;
    return p1Wins >= setsNeeded || p2Wins >= setsNeeded;
  });

  const currentSetNumber = computed(() => {
    if (bestOf.value === undefined) return null;
    const completedSets = p1SetWins.value.length;
    return matchOver.value ? completedSets : completedSets + 1;
  });

  const currentSetText = computed(() => {
    if (bestOf.value === undefined) return "";
    return `Set ${displayedSetNumber.value}`;
  });

  const gameEnded = computed(() => {
    if (maxPoints.value === null) {
      return false;
    }
    return (
      player1Score.value >= (maxPoints.value || 0) ||
      player2Score.value >= (maxPoints.value || 0)
    );
  });

  const matchWinner = computed(() => {
    if (matchOver.value && bestOf.value !== undefined) {
      const setsNeeded = Math.floor(bestOf.value / 2) + 1;
      const p1Wins = p1SetWins.value.filter((won) => won).length;
      const p2Wins = p2SetWins.value.filter((won) => won).length;
      if (p1Wins >= setsNeeded) {
        return "p1";
      }
      if (p2Wins >= setsNeeded) {
        return "p2";
      }
    }

    if (gameEnded.value && bestOf.value === undefined) {
      if (player1Score.value >= (maxPoints.value || 0)) {
        return "p1";
      }
      if (player2Score.value >= (maxPoints.value || 0)) {
        return "p2";
      }
    }

    return null;
  });

  const p1FilledStars = computed(() => {
    if (bestOf.value === undefined) return [];
    return Array.from(
      { length: bestOf.value },
      (_, index) => p1SetWins.value[index] === true,
    );
  });

  const p2FilledStars = computed(() => {
    if (bestOf.value === undefined) return [];
    return Array.from(
      { length: bestOf.value },
      (_, index) => p2SetWins.value[index] === true,
    );
  });

  watch(showGameResultsOverlay, (isVisible) => {
    if (isVisible && !gameResultsOverlayHasBeenShown.value) {
      gameResultsOverlayHasBeenShown.value = true;
    }
  });

  const handleGameResultsClose = () => {
    showGameResultsOverlay.value = false;
    gameResultsOverlayHasBeenShown.value = false;
  };

  const handleGameResultsNewGame = (resetFunction: () => void) => {
    resetFunction();
    showGameResultsOverlay.value = false;
    gameResultsOverlayHasBeenShown.value = false;
  };

  const handleGameResultsViewHistory = (openMatchHistoryModal: () => void) => {
    showGameResultsOverlay.value = false;
    gameResultsOverlayHasBeenShown.value = false;
    openMatchHistoryModal();
  };

  return {
    maxPoints,
    nameTruncationLimit,
    player1DisplayName,
    player2DisplayName,
    gameHasStarted,
    matchOver,
    currentSetNumber,
    currentSetText,
    gameEnded,
    matchWinner,
    p1FilledStars,
    p2FilledStars,
    handleGameResultsClose,
    handleGameResultsNewGame,
    handleGameResultsViewHistory,
  };
}
