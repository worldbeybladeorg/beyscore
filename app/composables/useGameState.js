import { storeToRefs } from "pinia";
import { useScoreboardStore } from "~/stores/scoreboardStore";

export function useGameState() {
  const store = useScoreboardStore();
  const {
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
  } = storeToRefs(store);

  return {
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
  };
}
