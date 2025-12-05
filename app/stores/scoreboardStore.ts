import { defineStore } from "pinia";
import { ref } from "vue";

type GenerationOption = "x" | "burst" | "mfb-zero-g" | "plastics-hms";
type MatchTypeOption = "3pts" | "4pts" | "5pts" | "7pts" | "nolimit";
type BestOfOption = 3 | 5 | null;

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
const DEFAULT_BEST_OF: BestOfOption = null;
const DEFAULT_OWN_FINISH = false;

export const useScoreboardStore = defineStore("scoreboard", () => {
  // Core scoreboard state shared across viewports
  const player1Score = ref<number>(0);
  const player2Score = ref<number>(0);
  const player1NameSetting = ref<string>("Player 1");
  const player2NameSetting = ref<string>("Player 2");
  const player1Name = player1NameSetting;
  const player2Name = player2NameSetting;
  const matchHistory = ref<MatchHistoryEntry[]>([]);
  const p1SetWins = ref<boolean[]>([]);
  const p2SetWins = ref<boolean[]>([]);
  const p1ShowWarning = ref<boolean>(false);
  const p2ShowWarning = ref<boolean>(false);
  const currentGameNumber = ref<number>(1);
  const displayedSetNumber = ref<number>(1);
  const winningChipLabel = ref<string | null>(null);
  const isScoreFadingIn = ref<boolean>(false);
  const isScoreShrinking = ref<boolean>(false);
  const pendingGameReset = ref<boolean>(false);
  const history = ref<HistorySnapshot[]>([createInitialHistorySnapshot()]);
  const historyIndex = ref<number>(0);
  const showGameResultsOverlay = ref<boolean>(false);
  const gameResultsOverlayHasBeenShown = ref<boolean>(false);

  // Additional metadata retained from legacy store (used by future features)
  const judgeMode = ref<boolean>(true);
  const pointsToWin = ref<number>(4);
  const scoreReason = ref<string>("");
  const player1Error = ref<number>(0);
  const player2Error = ref<number>(0);

  // Global game configuration shared between setup + screens
  const generation = ref<GenerationOption>(DEFAULT_GENERATION);
  const matchType = ref<MatchTypeOption>(DEFAULT_MATCH_TYPE);
  const bestOf = ref<BestOfOption>(DEFAULT_BEST_OF);
  const ownFinishEnabled = ref<boolean>(DEFAULT_OWN_FINISH);

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
      bestOf.value = null;
    }
  };

  const setBestOf = (value: number | null) => {
    if (value === 3 || value === 5) {
      bestOf.value = value;
    } else {
      bestOf.value = null;
    }
  };

  const setOwnFinishEnabled = (value: boolean) => {
    ownFinishEnabled.value = generation.value === "x" ? value : false;
  };

  const setGameConfig = (config: Partial<GameConfig>) => {
    if (config.generation) {
      setGeneration(config.generation);
    }
    if (config.matchType) {
      setMatchType(config.matchType);
    }
    if (typeof config.bestOf !== "undefined") {
      setBestOf(config.bestOf);
    }
    if (typeof config.ownFinishEnabled !== "undefined") {
      setOwnFinishEnabled(config.ownFinishEnabled);
    }
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
    judgeMode.value = true;
    pointsToWin.value = 4;
    scoreReason.value = "";
    player1Error.value = 0;
    player2Error.value = 0;

    if (options.resetConfig) {
      resetConfigToDefaults();
    }
  };

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
    judgeMode,
    pointsToWin,
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
    setGameConfig,
    resetConfigToDefaults,
    reset,
  };
});
