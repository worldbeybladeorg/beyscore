import { defineStore } from "pinia";
import type { EarnPointArgs } from "../types/earnPointArgs";
import type { GenerationType } from "../types/generations";
import { Generation } from "../types/generations";

export type PlayerKey = "p1" | "p2";
export type MatchType = "3pts" | "4pts" | "5pts" | "7pts" | "nolimit";
export type BestOfOption = 3 | 5 | null;

export interface MatchHistoryDividerEntry {
  type: "divider";
  gameNumber: number;
  isMatchConclusion?: boolean;
  winner?: PlayerKey;
  winnerName?: string;
}

export interface MatchHistoryEventEntry {
  type: "event";
  player: PlayerKey;
  score1: number;
  score2: number;
  chipLabel: string;
  isWarning?: boolean;
  isPenalty?: boolean;
  isGameWin?: boolean;
  isPenaltyWin?: boolean;
  setWins?: number;
  winner?: PlayerKey;
  isAfterDivider?: boolean;
}

export type MatchHistoryEntry =
  | MatchHistoryDividerEntry
  | MatchHistoryEventEntry;

export interface MatchSnapshot {
  player1: number;
  player2: number;
  p1SetWins: boolean[];
  p2SetWins: boolean[];
  p1Warning: boolean;
  p2Warning: boolean;
  matchHistory: MatchHistoryEntry[];
  currentGameNumber: number;
}

export type MatchOrientation = "portrait" | "landscape";

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useScoreboardStore = defineStore("scoreboard", () => {
  const player1Name = ref<string>("Player 1");
  const player2Name = ref<string>("Player 2");
  const judgeMode = ref<boolean>(true);
  const pointsToWin = ref<number | "Infinity">(4);
  const player1Score = ref<number>(0);
  const player2Score = ref<number>(0);
  const scoreReason = ref<string>("");
  const history = ref<ScoreHistory[]>([]);
  const player1Error = ref<number>(0);
  const player2Error = ref<number>(0);
  const generation = ref<GenerationType>(Generation.X);
  const ownFinishEnabled = ref<boolean>(false);

  const matchType = ref<MatchType>("4pts");
  const bestOf = ref<BestOfOption>(null);
  const player1SetWins = ref<boolean[]>([]);
  const player2SetWins = ref<boolean[]>([]);
  const player1WarningActive = ref(false);
  const player2WarningActive = ref(false);
  const currentGameNumber = ref(1);
  const matchHistoryLog = ref<MatchHistoryEntry[]>([]);
  const matchSnapshots = ref<MatchSnapshot[]>([
    {
      player1: 0,
      player2: 0,
      p1SetWins: [],
      p2SetWins: [],
      p1Warning: false,
      p2Warning: false,
      matchHistory: [],
      currentGameNumber: 1,
    },
  ]);
  const matchSnapshotIndex = ref(0);
  const isMatchHistoryModalOpen = ref(false);
  const isSettingsModalOpen = ref(false);
  const isResultsOverlayOpen = ref(false);
  const orientation = ref<MatchOrientation>("portrait");
  const pendingGameReset = ref(false);
  const winningChipLabel = ref<string | null>(null);

  const maxPoints = computed(() => {
    if (matchType.value === "nolimit" || pointsToWin.value === "Infinity") {
      return null;
    }
    if (typeof pointsToWin.value === "number") {
      return pointsToWin.value;
    }
    switch (matchType.value) {
      case "3pts":
        return 3;
      case "4pts":
        return 4;
      case "5pts":
        return 5;
      case "7pts":
        return 7;
      default:
        return null;
    }
  });

  const matchHasSets = computed(() => bestOf.value !== null);

  const setsNeededToWin = computed(() => {
    if (!bestOf.value) return null;
    return Math.floor(bestOf.value / 2) + 1;
  });

  const matchOver = computed(() => {
    if (!setsNeededToWin.value) return false;
    const p1Wins = player1SetWins.value.filter(Boolean).length;
    const p2Wins = player2SetWins.value.filter(Boolean).length;
    return p1Wins >= setsNeededToWin.value || p2Wins >= setsNeededToWin.value;
  });

  const gameEnded = computed(() => {
    if (maxPoints.value === null) return false;
    return (
      player1Score.value >= maxPoints.value ||
      player2Score.value >= maxPoints.value
    );
  });

  const matchWinner = computed<PlayerKey | null>(() => {
    if (matchOver.value && setsNeededToWin.value) {
      const p1Wins = player1SetWins.value.filter(Boolean).length;
      const p2Wins = player2SetWins.value.filter(Boolean).length;
      if (p1Wins >= (setsNeededToWin.value ?? 0)) return "p1";
      if (p2Wins >= (setsNeededToWin.value ?? 0)) return "p2";
    }

    if (!matchHasSets.value && gameEnded.value && maxPoints.value !== null) {
      if (player1Score.value >= maxPoints.value) return "p1";
      if (player2Score.value >= maxPoints.value) return "p2";
    }

    return null;
  });

  const matchSummary = computed(() => ({
    winner: matchWinner.value,
    matchOver: matchOver.value,
    bestOf: bestOf.value,
    matchType: matchType.value,
    maxPoints: maxPoints.value,
    setWins: {
      p1: player1SetWins.value.filter(Boolean).length,
      p2: player2SetWins.value.filter(Boolean).length,
    },
  }));

  function configureMatchSettings(payload: {
    generation?: GenerationType;
    matchType?: MatchType;
    bestOf?: BestOfOption;
    ownFinishEnabled?: boolean;
  }) {
    if (payload.generation) {
      generation.value = payload.generation;
    }
    if (payload.matchType) {
      matchType.value = payload.matchType;
      if (payload.matchType === "nolimit") {
        pointsToWin.value = "Infinity";
      } else {
        const lookup: Record<Exclude<MatchType, "nolimit">, number> = {
          "3pts": 3,
          "4pts": 4,
          "5pts": 5,
          "7pts": 7,
        };
        pointsToWin.value = lookup[payload.matchType];
      }
    }
    if (payload.bestOf !== undefined) {
      bestOf.value = payload.bestOf;
    }
    if (payload.ownFinishEnabled !== undefined) {
      ownFinishEnabled.value = payload.ownFinishEnabled;
    }
  }

  function recordPlayerName(player: PlayerKey, name: string) {
    if (player === "p1") {
      player1Name.value = name;
    } else {
      player2Name.value = name;
    }
  }

  function pushMatchHistoryEntry(entry: MatchHistoryEntry) {
    matchHistoryLog.value = [entry, ...matchHistoryLog.value];
  }

  function saveSnapshot(partial?: Partial<MatchSnapshot>) {
    const baseSnapshot: MatchSnapshot = {
      player1: player1Score.value,
      player2: player2Score.value,
      p1SetWins: [...player1SetWins.value],
      p2SetWins: [...player2SetWins.value],
      p1Warning: player1WarningActive.value,
      p2Warning: player2WarningActive.value,
      matchHistory: [...matchHistoryLog.value],
      currentGameNumber: currentGameNumber.value,
    };

    const snapshot: MatchSnapshot = partial
      ? ({
          ...baseSnapshot,
          ...partial,
        } as MatchSnapshot)
      : baseSnapshot;

    matchSnapshots.value = [
      ...matchSnapshots.value.slice(0, matchSnapshotIndex.value + 1),
      snapshot,
    ];
    matchSnapshotIndex.value = matchSnapshots.value.length - 1;
  }

  function stepSnapshot(direction: "undo" | "redo") {
    const nextIndex =
      direction === "undo"
        ? Math.max(0, matchSnapshotIndex.value - 1)
        : Math.min(
            matchSnapshots.value.length - 1,
            matchSnapshotIndex.value + 1,
          );

    if (nextIndex === matchSnapshotIndex.value) return;

    matchSnapshotIndex.value = nextIndex;
    const state = matchSnapshots.value[nextIndex];
    if (!state) return;

    player1Score.value = state.player1;
    player2Score.value = state.player2;
    player1SetWins.value = [...state.p1SetWins];
    player2SetWins.value = [...state.p2SetWins];
    player1WarningActive.value = state.p1Warning;
    player2WarningActive.value = state.p2Warning;
    matchHistoryLog.value = [...state.matchHistory];
    currentGameNumber.value = state.currentGameNumber;
  }

  function toggleModal(
    modal: "history" | "settings" | "results",
    state?: boolean,
  ) {
    const map = {
      history: isMatchHistoryModalOpen,
      settings: isSettingsModalOpen,
      results: isResultsOverlayOpen,
    };
    const target = map[modal];
    target.value = state ?? !target.value;
  }

  function setOrientation(next: MatchOrientation) {
    orientation.value = next;
  }

  function setPendingGameReset(flag: boolean) {
    pendingGameReset.value = flag;
  }

  function markWinningChip(chipLabel: string | null) {
    winningChipLabel.value = chipLabel;
  }

  function resetMatchState(options?: { preserveNames?: boolean }) {
    if (!options?.preserveNames) {
      player1Name.value = "Player 1";
      player2Name.value = "Player 2";
    }
    player1Score.value = 0;
    player2Score.value = 0;
    player1SetWins.value = [];
    player2SetWins.value = [];
    player1WarningActive.value = false;
    player2WarningActive.value = false;
    currentGameNumber.value = 1;
    matchHistoryLog.value = [];
    matchSnapshots.value = [
      {
        player1: 0,
        player2: 0,
        p1SetWins: [],
        p2SetWins: [],
        p1Warning: false,
        p2Warning: false,
        matchHistory: [],
        currentGameNumber: 1,
      },
    ];
    matchSnapshotIndex.value = 0;
    pendingGameReset.value = false;
    winningChipLabel.value = null;
  }

  function undoLastAction() {
    useUndoAction({
      Player1Score: player1Score,
      Player2Score: player2Score,
      ScoreReason: scoreReason,
      History: history,
    });
  }

  function earnPoints(args: EarnPointArgs) {
    useEarnPoints({
      Player: args.Player,
      Points: args.Points,
      Reason: args.Reason,
      CurrentReason: scoreReason,
      Player1Score: player1Score,
      Player2Score: player2Score,
      History: history,
    });
  }

  function reset() {
    resetMatchState();
    scoreReason.value = "";
    history.value = [];
  }

  return {
    player1Name,
    player2Name,
    player1Score,
    player2Score,
    scoreReason,
    history,
    undoLastAction,
    earnPoints,
    reset,
    pointsToWin,
    judgeMode,
    player1Error,
    player2Error,
    generation,
    ownFinishEnabled,
    matchType,
    bestOf,
    player1SetWins,
    player2SetWins,
    player1WarningActive,
    player2WarningActive,
    currentGameNumber,
    matchHistoryLog,
    matchSnapshots,
    matchSnapshotIndex,
    isMatchHistoryModalOpen,
    isSettingsModalOpen,
    isResultsOverlayOpen,
    orientation,
    pendingGameReset,
    winningChipLabel,
    maxPoints,
    matchHasSets,
    setsNeededToWin,
    matchOver,
    gameEnded,
    matchWinner,
    matchSummary,
    configureMatchSettings,
    recordPlayerName,
    pushMatchHistoryEntry,
    saveSnapshot,
    stepSnapshot,
    toggleModal,
    setOrientation,
    setPendingGameReset,
    markWinningChip,
    resetMatchState,
  };
});
