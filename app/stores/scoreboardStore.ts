import { defineStore } from "pinia";
import { ref, watch } from "vue";

export type GenerationOption = "x" | "burst" | "mfb-zero-g" | "plastics-hms";
export type MatchTypeOption = "3pts" | "4pts" | "5pts" | "7pts" | "nolimit";
export type BestOfOption = 3 | 5 | undefined;

type MatchHistoryEntry = Record<string, unknown>;

interface HistorySnapshot {
  player1: number;
  player2: number;
  p1SetWins: boolean[];
  p2SetWins: boolean[];
  p1ShowWarning: boolean;
  p2ShowWarning: boolean;
  matchHistory: MatchHistoryEntry[];
  currentGameNumber: number;
}

interface GameConfig {
  generation: GenerationOption;
  matchType: MatchTypeOption;
  bestOf: BestOfOption;
  ownFinishEnabled: boolean;
}

const createInitialHistorySnapshot = (): HistorySnapshot => ({
  player1: 0,
  player2: 0,
  p1SetWins: [],
  p2SetWins: [],
  p1ShowWarning: false,
  p2ShowWarning: false,
  matchHistory: [],
  currentGameNumber: 1,
});

const defaultMatchTypeForGeneration = (
  value: GenerationOption,
): MatchTypeOption => (value === "x" ? "4pts" : "3pts");

const DEFAULT_GENERATION: GenerationOption = "x";
const DEFAULT_MATCH_TYPE: MatchTypeOption =
  defaultMatchTypeForGeneration(DEFAULT_GENERATION);
const DEFAULT_BEST_OF: BestOfOption = undefined;
const DEFAULT_OWN_FINISH = false;

export const useScoreboardStore = defineStore("scoreboard", () => {
  // Load persisted state from localStorage
  const loadPersistedState = () => {
    if (typeof window !== "undefined") {
      const persisted = localStorage.getItem("beyscore-store");
      if (persisted) {
        try {
          return JSON.parse(persisted);
        } catch {
          return {};
        }
      }
    }
    return {};
  };

  const persistedState = loadPersistedState();

  // Core scoreboard state shared across viewports
  const player1Score = ref<number>(persistedState.player1Score || 0);
  const player2Score = ref<number>(persistedState.player2Score || 0);
  const player1NameSetting = ref<string>(
    persistedState.player1NameSetting || "Player 1",
  );
  const player2NameSetting = ref<string>(
    persistedState.player2NameSetting || "Player 2",
  );
  const player1Name = player1NameSetting;
  const player2Name = player2NameSetting;
  const matchHistory = ref<MatchHistoryEntry[]>(
    persistedState.matchHistory || [],
  );
  const p1SetWins = ref<boolean[]>(persistedState.p1SetWins || []);
  const p2SetWins = ref<boolean[]>(persistedState.p2SetWins || []);
  const p1ShowWarning = ref<boolean>(persistedState.p1ShowWarning || false);
  const p2ShowWarning = ref<boolean>(persistedState.p2ShowWarning || false);
  const currentGameNumber = ref<number>(persistedState.currentGameNumber || 1);
  const displayedSetNumber = ref<number>(
    persistedState.displayedSetNumber || 1,
  );
  const winningChipLabel = ref<string | null>(
    persistedState.winningChipLabel || null,
  );
  const isScoreFadingIn = ref<boolean>(persistedState.isScoreFadingIn || false);
  const isScoreShrinking = ref<boolean>(
    persistedState.isScoreShrinking || false,
  );
  const pendingGameReset = ref<boolean>(
    persistedState.pendingGameReset || false,
  );
  const history = ref<HistorySnapshot[]>(
    persistedState.history || [createInitialHistorySnapshot()],
  );
  const historyIndex = ref<number>(persistedState.historyIndex || 0);
  const showGameResultsOverlay = ref<boolean>(
    persistedState.showGameResultsOverlay || false,
  );
  const gameResultsOverlayHasBeenShown = ref<boolean>(
    persistedState.gameResultsOverlayHasBeenShown || false,
  );

  // Additional metadata retained from legacy store (used by future features)

  const scoreReason = ref<string>(persistedState.scoreReason || "");
  const player1Error = ref<number>(persistedState.player1Error || 0);
  const player2Error = ref<number>(persistedState.player2Error || 0);

  // Global game configuration shared between setup + screens
  const generation = ref<GenerationOption>(
    persistedState.generation || DEFAULT_GENERATION,
  );
  const matchType = ref<MatchTypeOption>(
    persistedState.matchType || DEFAULT_MATCH_TYPE,
  );
  const bestOf = ref<BestOfOption>(persistedState.bestOf || DEFAULT_BEST_OF);
  const ownFinishEnabled = ref<boolean>(
    persistedState.ownFinishEnabled !== undefined
      ? persistedState.ownFinishEnabled
      : DEFAULT_OWN_FINISH,
  );

  const setGeneration = (value: GenerationOption) => {
    generation.value = value;
    matchType.value = defaultMatchTypeForGeneration(value);
    if (value !== "x") {
      ownFinishEnabled.value = false;
    }
  };

  const setMatchType = (value: MatchTypeOption) => {
    matchType.value = value;
    if (value === "nolimit") {
      bestOf.value = undefined;
    }
  };

  const setBestOf = (value: BestOfOption) => {
    if (value === 3 || value === 5) {
      bestOf.value = value;
    } else {
      bestOf.value = undefined;
    }
  };

  const setOwnFinishEnabled = (value: boolean) => {
    ownFinishEnabled.value = generation.value === "x" ? value : false;
  };

  const resetConfigToDefaults = () => {
    generation.value = DEFAULT_GENERATION;
    matchType.value = DEFAULT_MATCH_TYPE;
    bestOf.value = DEFAULT_BEST_OF;
    ownFinishEnabled.value = DEFAULT_OWN_FINISH;
  };

  const reset = (options: { resetConfig?: boolean } = {}) => {
    player1Score.value = 0;
    player2Score.value = 0;
    player1NameSetting.value = "Player 1";
    player2NameSetting.value = "Player 2";
    matchHistory.value = [];
    p1SetWins.value = [];
    p2SetWins.value = [];
    p1ShowWarning.value = false;
    p2ShowWarning.value = false;
    currentGameNumber.value = 1;
    displayedSetNumber.value = 1;
    winningChipLabel.value = null;
    isScoreFadingIn.value = false;
    isScoreShrinking.value = false;
    pendingGameReset.value = false;
    history.value = [createInitialHistorySnapshot()];
    historyIndex.value = 0;
    showGameResultsOverlay.value = false;
    gameResultsOverlayHasBeenShown.value = false;
    scoreReason.value = "";
    player1Error.value = 0;
    player2Error.value = 0;

    if (options.resetConfig) {
      resetConfigToDefaults();
    }
  };

  // Persist state to localStorage whenever any state changes
  const persistState = () => {
    if (typeof window !== "undefined") {
      const stateToPersist = {
        player1Score: player1Score.value,
        player2Score: player2Score.value,
        player1NameSetting: player1NameSetting.value,
        player2NameSetting: player2NameSetting.value,
        matchHistory: matchHistory.value,
        p1SetWins: p1SetWins.value,
        p2SetWins: p2SetWins.value,
        p1ShowWarning: p1ShowWarning.value,
        p2ShowWarning: p2ShowWarning.value,
        currentGameNumber: currentGameNumber.value,
        displayedSetNumber: displayedSetNumber.value,
        winningChipLabel: winningChipLabel.value,
        isScoreFadingIn: isScoreFadingIn.value,
        isScoreShrinking: isScoreShrinking.value,
        pendingGameReset: pendingGameReset.value,
        history: history.value,
        historyIndex: historyIndex.value,
        showGameResultsOverlay: showGameResultsOverlay.value,
        gameResultsOverlayHasBeenShown: gameResultsOverlayHasBeenShown.value,
        scoreReason: scoreReason.value,
        player1Error: player1Error.value,
        player2Error: player2Error.value,
        generation: generation.value,
        matchType: matchType.value,
        bestOf: bestOf.value,
        ownFinishEnabled: ownFinishEnabled.value,
      };
      localStorage.setItem("beyscore-store", JSON.stringify(stateToPersist));
    }
  };

  // Watch all state changes and persist them
  const stateRefs = [
    player1Score,
    player2Score,
    player1NameSetting,
    player2NameSetting,
    matchHistory,
    p1SetWins,
    p2SetWins,
    p1ShowWarning,
    p2ShowWarning,
    currentGameNumber,
    displayedSetNumber,
    winningChipLabel,
    isScoreFadingIn,
    isScoreShrinking,
    pendingGameReset,
    history,
    historyIndex,
    showGameResultsOverlay,
    gameResultsOverlayHasBeenShown,
    scoreReason,
    player1Error,
    player2Error,
    generation,
    matchType,
    bestOf,
    ownFinishEnabled,
  ];

  stateRefs.forEach((stateRef) => {
    watch(stateRef, persistState, { deep: true });
  });

  return {
    player1Name,
    player2Name,
    player1NameSetting,
    player2NameSetting,
    player1Score,
    player2Score,
    matchHistory,
    p1SetWins,
    p2SetWins,
    p1ShowWarning,
    p2ShowWarning,
    currentGameNumber,
    displayedSetNumber,
    winningChipLabel,
    isScoreFadingIn,
    isScoreShrinking,
    pendingGameReset,
    history,
    historyIndex,
    showGameResultsOverlay,
    gameResultsOverlayHasBeenShown,
    scoreReason,
    player1Error,
    player2Error,
    generation,
    matchType,
    bestOf,
    ownFinishEnabled,
    setGeneration,
    setMatchType,
    setBestOf,
    setOwnFinishEnabled,
    resetConfigToDefaults,
    reset,
  };
});
