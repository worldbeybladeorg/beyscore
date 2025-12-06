import { computed, type Ref } from "vue";
import type { BestOfOption } from "~/stores/scoreboardStore";

interface HistoryState {
  player1: number;
  player2: number;
  p1SetWins: boolean[];
  p2SetWins: boolean[];
  p1ShowWarning: boolean;
  p2ShowWarning: boolean;
  matchHistory: any[];
  currentGameNumber: number;
}

export function useHistoryUndoRedo(options: {
  player1Score: Ref<number>;
  player2Score: Ref<number>;
  p1SetWins: Ref<boolean[]>;
  p2SetWins: Ref<boolean[]>;
  p1ShowWarning: Ref<boolean>;
  p2ShowWarning: Ref<boolean>;
  matchHistory: Ref<any[]>;
  currentGameNumber: Ref<number>;
  displayedSetNumber: Ref<number>;
  bestOf: Ref<BestOfOption>;
  history: Ref<HistoryState[]>;
  historyIndex: Ref<number>;
  pendingGameReset: Ref<boolean>;
  gameResetTimeout: Ref<ReturnType<typeof setTimeout> | null>;
}) {
  const {
    player1Score,
    player2Score,
    p1SetWins,
    p2SetWins,
    p1ShowWarning,
    p2ShowWarning,
    matchHistory,
    currentGameNumber,
    displayedSetNumber,
    bestOf,
    history,
    historyIndex,
    pendingGameReset,
    gameResetTimeout,
  } = options;

  if (history.value.length === 0) {
    history.value = [
      {
        player1: 0,
        player2: 0,
        p1SetWins: [],
        p2SetWins: [],
        p1ShowWarning: false,
        p2ShowWarning: false,
        matchHistory: [],
        currentGameNumber: 1,
      },
    ];
  }

  function saveState() {
    const currentState: HistoryState = {
      player1: player1Score.value,
      player2: player2Score.value,
      p1SetWins: [...p1SetWins.value],
      p2SetWins: [...p2SetWins.value],
      p1ShowWarning: p1ShowWarning.value,
      p2ShowWarning: p2ShowWarning.value,
      matchHistory: [...matchHistory.value],
      currentGameNumber: currentGameNumber.value,
    };

    history.value = history.value.slice(0, historyIndex.value + 1);
    history.value.push(currentState);
    historyIndex.value = history.value.length - 1;
  }

  function restoreState(state: HistoryState) {
    if (bestOf.value !== undefined) {
      const completedSets = (state.p1SetWins || []).length;
      const setsNeeded = Math.floor(bestOf.value / 2) + 1;
      const p1Wins = (state.p1SetWins || []).filter((won) => won).length;
      const p2Wins = (state.p2SetWins || []).filter((won) => won).length;
      const isMatchOver = p1Wins >= setsNeeded || p2Wins >= setsNeeded;
      displayedSetNumber.value = isMatchOver
        ? completedSets
        : completedSets + 1;
    }

    player1Score.value = state.player1;
    player2Score.value = state.player2;
    p1SetWins.value = [...(state.p1SetWins || [])];
    p2SetWins.value = [...(state.p2SetWins || [])];
    p1ShowWarning.value = state.p1ShowWarning || false;
    p2ShowWarning.value = state.p2ShowWarning || false;
    matchHistory.value = [...(state.matchHistory || [])];
    currentGameNumber.value = state.currentGameNumber || 1;
  }

  function handleUndo() {
    if (historyIndex.value <= 0) {
      return;
    }

    if (pendingGameReset.value && gameResetTimeout.value) {
      clearTimeout(gameResetTimeout.value);
      gameResetTimeout.value = null;
      pendingGameReset.value = false;
    }

    const currentState = history.value[historyIndex.value];
    if (!currentState) {
      return;
    }
    const previousState =
      historyIndex.value > 0 ? history.value[historyIndex.value - 1] : null;

    const isResetState =
      currentState.player1 === 0 &&
      currentState.player2 === 0 &&
      (currentState.p1SetWins?.length > 0 ||
        currentState.p2SetWins?.length > 0);

    const isMatchConclusionState =
      previousState &&
      currentState.player1 === previousState.player1 &&
      currentState.player2 === previousState.player2 &&
      ((currentState.p1SetWins?.length || 0) !==
        (previousState.p1SetWins?.length || 0) ||
        (currentState.p2SetWins?.length || 0) !==
          (previousState.p2SetWins?.length || 0));

    const isDuplicateGameEndState =
      previousState &&
      currentState.player1 === previousState.player1 &&
      currentState.player2 === previousState.player2 &&
      (currentState.p1SetWins?.length || 0) ===
        (previousState.p1SetWins?.length || 0) &&
      (currentState.p2SetWins?.length || 0) ===
        (previousState.p2SetWins?.length || 0);

    if (isResetState && historyIndex.value > 1) {
      historyIndex.value -= 2;
    } else if (isMatchConclusionState && historyIndex.value > 1) {
      historyIndex.value -= 2;
    } else if (isDuplicateGameEndState && historyIndex.value > 1) {
      historyIndex.value -= 2;
    } else {
      historyIndex.value--;
    }

    const targetState = history.value[historyIndex.value];
    if (!targetState) {
      return;
    }
    restoreState(targetState);
  }

  function handleRedo() {
    if (historyIndex.value >= history.value.length - 1) {
      return;
    }
    historyIndex.value++;
    const targetState = history.value[historyIndex.value];
    if (!targetState) {
      return;
    }
    restoreState(targetState);
  }

  const undoDisabled = computed(() => historyIndex.value === 0);
  const redoDisabled = computed(
    () => historyIndex.value >= history.value.length - 1,
  );

  return {
    history,
    historyIndex,
    saveState,
    restoreState,
    handleUndo,
    handleRedo,
    undoDisabled,
    redoDisabled,
  };
}
