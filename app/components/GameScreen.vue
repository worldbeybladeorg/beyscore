<script setup lang="ts">
import { useScoreboardStore } from "~/stores/scoreboardStore";
import { useGameState } from "~/composables/useGameState";
import {
  useMatchHistoryModal,
  useSettingsModal,
} from "~/composables/useModalState";
import { useHistoryUndoRedo } from "~/composables/useHistoryUndoRedo";
import { useScoring } from "~/composables/useScoring";
import { useGameResults } from "~/composables/useGameResults";
import { getChipTypeForHistory, getPrimaryWinCondition } from "~/lib/gameUtils";

const scoreboardStore = useScoreboardStore();
const {
  generation,
  matchType,
  customPoints,
  bestOf,
  xtrPoints,
  ovrPoints,
  bstPoints,
  spfPoints,
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
  ownFinishEnabled,
} = storeToRefs(scoreboardStore);

const isOwnFinishEnabled = computed(() => ownFinishEnabled.value);

const gameResetTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

const {
  maxPoints,
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
  handleGameResultsClose: closeGameResultsOverlay,
  handleGameResultsNewGame: triggerGameResultsNewGame,
  handleGameResultsViewHistory: triggerGameResultsViewHistory,
} = useGameState({
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
});

const {
  isMatchHistoryModalOpen,
  isMatchHistoryModalClosing,
  openMatchHistoryModal,
  closeMatchHistoryModal,
} = useMatchHistoryModal();

const {
  isSettingsModalOpen,
  isSettingsModalClosing,
  openSettingsModal,
  closeSettingsModal,
} = useSettingsModal();

const handleSaveChanges = () => {
  closeSettingsModal();
};

const handleResetGame = () => {
  closeSettingsModal();
};

const {
  winnerDisplayText,
  winnerNameForResults,
  gameSummaryItemsForResults,
  opponentOwnFinishCount,
  opponentPenaltyCount,
  getPlayerDisplayNameFull,
} = useGameResults(
  matchWinner,
  generation,
  matchHistory,
  player1NameSetting,
  player2NameSetting,
);

const { saveState, handleUndo, handleRedo, undoDisabled, redoDisabled } =
  useHistoryUndoRedo({
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
  });

const {
  handlePlayer1ScoreIncrease,
  handlePlayer2ScoreIncrease,
  handlePlayer1OwnFinish,
  handlePlayer2OwnFinish,
  handlePlayer1Penalty,
  handlePlayer2Penalty,
  handlePlayer1WarningToggle,
  handlePlayer2WarningToggle,
} = useScoring({
  player1Score,
  player2Score,
  maxPoints,
  p1SetWins,
  p2SetWins,
  p1ShowWarning,
  p2ShowWarning,
  matchHistory,
  currentGameNumber,
  bestOf,
  winningChipLabel,
  generation,
  saveState,
});

const handleGameResultsClose = () => {
  closeGameResultsOverlay();
};
const handleGameResultsNewGame = () => {
  triggerGameResultsNewGame(() => {
    scoreboardStore.reset();
  });
};
const handleGameResultsViewHistory = () => {
  triggerGameResultsViewHistory(openMatchHistoryModal);
};

watch(gameEnded, async (ended) => {
  if (ended && !pendingGameReset.value) {
    const p1Won = player1Score.value >= (maxPoints.value || 0);
    const p2Won = player2Score.value >= (maxPoints.value || 0);
    const hasSets = bestOf.value !== undefined;

    if (hasSets) {
      if (p1Won) {
        p1SetWins.value.push(true);
        p2SetWins.value.push(false);
      } else if (p2Won) {
        p1SetWins.value.push(false);
        p2SetWins.value.push(true);
      }
    }

    await nextTick();

    const isMatchOver = matchOver.value;

    const actualWinningChip = winningChipLabel.value
      ? getChipTypeForHistory(winningChipLabel.value, generation.value)
      : getPrimaryWinCondition(generation.value);
    const winConditionLabel = actualWinningChip;
    winningChipLabel.value = null;

    const winner = p1Won ? "p1" : "p2";
    const loser = p1Won ? "p2" : "p1";
    const winnerSetWins = p1Won
      ? p1SetWins.value.filter((won) => won).length
      : p2SetWins.value.filter((won) => won).length;

    const mostRecentEntry = matchHistory.value[0];
    const isPenaltyWin =
      !winningChipLabel.value &&
      mostRecentEntry &&
      mostRecentEntry.isPenalty === true &&
      !mostRecentEntry.isGameWin &&
      ((p1Won && mostRecentEntry.player === "p2") ||
        (p2Won && mostRecentEntry.player === "p1"));

    if (isPenaltyWin) {
      const penaltyChipLabel = mostRecentEntry.chipLabel || "Penalty";

      matchHistory.value.shift();

      matchHistory.value.unshift({
        player: loser,
        score1: p1Won ? player2Score.value : player1Score.value,
        score2: p1Won ? player1Score.value : player2Score.value,
        chipLabel: penaltyChipLabel,
        isGameWin: true,
        setWins: hasSets ? winnerSetWins : 0,
        isPenaltyWin: true,
        winner,
      });
    } else {
      matchHistory.value.unshift({
        player: winner,
        score1: p1Won ? player1Score.value : player2Score.value,
        score2: p1Won ? player2Score.value : player1Score.value,
        chipLabel: winConditionLabel,
        isGameWin: true,
        setWins: hasSets ? winnerSetWins : 0,
        isPenaltyWin: false,
      });
    }

    if (isMatchOver) {
      const winnerName = winner === "p1" ? "Player 1" : "Player 2";
      matchHistory.value.unshift({
        isGameDivider: true,
        gameNumber: currentGameNumber.value,
        isMatchConclusion: true,
        winner,
        winnerName,
      });
      saveState();
      showGameResultsOverlay.value = true;
    } else if (hasSets) {
      pendingGameReset.value = true;

      if (gameResetTimeout.value) {
        clearTimeout(gameResetTimeout.value);
        gameResetTimeout.value = null;
      }
      gameResetTimeout.value = setTimeout(() => {
        isScoreShrinking.value = true;

        setTimeout(() => {
          player1Score.value = 0;
          player2Score.value = 0;
          pendingGameReset.value = false;
          winningChipLabel.value = null;

          matchHistory.value.unshift({
            isGameDivider: true,
            gameNumber: currentGameNumber.value,
          });
          currentGameNumber.value++;

          displayedSetNumber.value = currentSetNumber.value || 1;

          isScoreShrinking.value = false;
          isScoreFadingIn.value = true;

          setTimeout(() => {
            isScoreFadingIn.value = false;
          }, 600);

          saveState();
        }, 600);
        gameResetTimeout.value = null;
      }, 500);
    } else {
      saveState();
      showGameResultsOverlay.value = true;
    }
  }
});
</script>

<template>
  <div class="viewport-container">
    <div class="game-screen">
      <!-- Current Set Indicator (overlapping) -->
      <PlayerName
        v-if="bestOf !== undefined && !matchOver"
        :name="currentSetText"
        :player="undefined"
        :best-of="undefined"
        class="set-indicator"
      />

      <!-- Winner Message (when match concludes or game ends without sets) -->
      <PlayerName
        v-if="
          (matchOver || (gameEnded && bestOf === undefined)) &&
          winnerDisplayText
        "
        :name="winnerDisplayText"
        :player="undefined"
        :best-of="undefined"
        class="winner-message"
      />

      <!-- Score Cards Container -->
      <div
        class="score-cards-container"
        :class="{
          'winner-displayed':
            (matchOver || (gameEnded && bestOf === undefined)) &&
            winnerDisplayText,
        }"
      >
        <!-- Player 1 Score Card -->
        <ScoreCardPortrait
          player="p1"
          :player-name="player1DisplayName"
          :generation="generation"
          :best-of="bestOf"
          :own-finish-enabled="generation === 'x' && isOwnFinishEnabled"
          :score="player1Score.toString()"
          :disabled="gameEnded || matchOver"
          :filled-stars="p1FilledStars"
          :show-warning="p1ShowWarning"
          :is-fading-in="isScoreFadingIn"
          :is-shrinking="isScoreShrinking"
          :xtr-score="xtrPoints"
          :ovr-score="ovrPoints"
          :bst-score="bstPoints"
          :spf-score="spfPoints"
          @score-increase="
            (points, chipLabel) => handlePlayer1ScoreIncrease(points, chipLabel)
          "
          @penalty="handlePlayer1Penalty"
          @warning-toggle="handlePlayer1WarningToggle"
          @own-finish="handlePlayer1OwnFinish"
        />

        <!-- Player 2 Score Card -->
        <ScoreCardPortrait
          player="p2"
          :player-name="player2DisplayName"
          :generation="generation"
          :best-of="bestOf"
          :own-finish-enabled="generation === 'x' && isOwnFinishEnabled"
          :score="player2Score.toString()"
          :disabled="gameEnded || matchOver"
          :filled-stars="p2FilledStars"
          :show-warning="p2ShowWarning"
          :is-fading-in="isScoreFadingIn"
          :is-shrinking="isScoreShrinking"
          :xtr-score="xtrPoints"
          :ovr-score="ovrPoints"
          :bst-score="bstPoints"
          :spf-score="spfPoints"
          @score-increase="
            (points, chipLabel) => handlePlayer2ScoreIncrease(points, chipLabel)
          "
          @penalty="handlePlayer2Penalty"
          @warning-toggle="handlePlayer2WarningToggle"
          @own-finish="handlePlayer2OwnFinish"
        />

        <!-- 20px gap spacer -->
        <div class="gap-to-buttons" />
      </div>

      <!-- Game Results Overlay -->
      <div
        v-if="showGameResultsOverlay"
        :class="[
          'game-results-backdrop',
          { 'no-animation': gameResultsOverlayHasBeenShown },
        ]"
      >
        <div
          :class="[
            'game-results-wrapper',
            { 'no-animation': gameResultsOverlayHasBeenShown },
          ]"
        >
          <GameResults
            :winner-name="winnerNameForResults"
            :format="generation"
            :summary-items="gameSummaryItemsForResults"
            :show-opponent-summary="
              generation === 'x' &&
              (opponentOwnFinishCount > 0 || opponentPenaltyCount > 0)
            "
            :opponent-own-finish-count="opponentOwnFinishCount"
            :opponent-penalty-count="opponentPenaltyCount"
            @new-game="handleGameResultsNewGame"
            @view-history="handleGameResultsViewHistory"
            @close="handleGameResultsClose"
          />
        </div>
      </div>

      <!-- Bottom button row -->
      <div class="bottom-buttons-container">
        <MenuButton
          variant="matchHistory"
          :disabled="undoDisabled"
          @click="openMatchHistoryModal"
        />
        <UndoRedoButtons
          :undo-disabled="undoDisabled"
          :redo-disabled="redoDisabled"
          :game-over="matchOver || (gameEnded && bestOf === undefined)"
          @undo="handleUndo"
          @redo="handleRedo"
          @new-game="handleGameResultsNewGame"
        />
        <MenuButton variant="settings" @click="openSettingsModal" />
      </div>

      <!-- Match History Modal -->
      <MatchHistoryModal
        :is-open="isMatchHistoryModalOpen"
        :is-closing="isMatchHistoryModalClosing"
        :match-history="matchHistory"
        :generation="generation"
        :best-of="bestOf"
        :player1-display-name="player1DisplayName"
        :player2-display-name="player2DisplayName"
        :get-player-display-name-full="getPlayerDisplayNameFull"
        @close="closeMatchHistoryModal"
      />

      <SharedSettingsModal
        :is-open="isSettingsModalOpen"
        :is-closing="isSettingsModalClosing"
        :game-has-started="gameHasStarted"
        @close="closeSettingsModal"
        @save="handleSaveChanges"
        @reset-game="handleResetGame"
      />
    </div>
  </div>
</template>

<style scoped>
.viewport-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
  position: relative;
  max-width: 100vw;
}

.game-screen {
  /* PWA viewport in portrait - matches actual device dimensions when installed */
  /* Width: 360px (Android baseline) minimum, grows horizontally with viewport */
  /* Default: 390px (iPhone 12/13/14, iPhone 15, common Android like Pixel) */
  width: 100%;
  min-width: 360px; /* Android baseline (Galaxy S, Pixel), smallest supported devices */
  max-width: 100vw; /* Grow with viewport - internal 20px padding handled by child containers */

  /* Height: Adapts to viewport height, with minimum constraints */
  /* Production-ready: fills viewport while respecting safe areas via padding */
  height: 100vh;
  min-height: 640px; /* Android baseline - smallest supported height */
  max-height: 926px; /* iPhone Pro Max, large Android devices */

  background-color: white;
  border: none;
  box-sizing: border-box;
  position: relative;

  /* Account for safe areas - these represent the actual usable content area */
  /* Top: Status bar area (minimum 20px for status bar, plus any safe area inset) */
  padding-top: env(safe-area-inset-top, 0px);

  /* Bottom: Home indicator area (minimum 34px for home indicator, plus any safe area inset) */
  padding-bottom: env(safe-area-inset-bottom, 0px);

  /* Left/Right: Safe areas for notches (if any) - 20px padding handled by child containers */
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);

  /* Ensure content area respects safe zones */
  overflow: hidden;
}

.score-cards-container {
  position: absolute;
  top: calc(max(20px, env(safe-area-inset-top, 0px)) + 20px);
  left: calc(20px + env(safe-area-inset-left, 0px));
  right: calc(20px + env(safe-area-inset-right, 0px));
  bottom: calc(
    20px + 48px
  ); /* Button top position: 20px (button bottom) + 48px (button height) */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
}

.score-cards-container :deep(.score-card) {
  width: 100%;
  max-width: 100%;
  height: calc(
    (100% - 40px) / 2
  ); /* Available height minus gap between cards (20px) and gap spacer (20px), divided by 2 */
  min-height: 0; /* Allow cards to shrink below content size if needed */
  aspect-ratio: unset;
  flex-shrink: 1; /* Allow cards to shrink when space is limited */
  flex-grow: 0; /* Don't grow beyond calculated height */
  box-sizing: border-box;
}

.score-cards-container :deep(.score-card:first-child) {
  margin-bottom: 20px; /* 20px gap between cards */
}

/* Player 2 scorecard at normal position when winner message is displayed */
.score-cards-container :deep(.score-card.winner-state) {
  margin-top: 0;
}

.set-indicator {
  position: absolute;
  /* Position at the dead center between the two cards */
  /* Cards container top: max(20px, env(safe-area-inset-top, 0px)) + 20px */
  /* Cards container bottom: 68px (20px + 48px button) */
  /* Center of gap = container top + first card height + 10px (half of 20px gap) */
  /* First card height = (container height - 40px) / 2 */
  /* Container height = 100% - container top - 68px */
  --status-bar: max(20px, env(safe-area-inset-top, 0px));
  --container-top: calc(var(--status-bar) + 20px);
  --container-height: calc(100% - var(--container-top) - 68px);
  --first-card-height: calc((var(--container-height) - 40px) / 2);
  top: calc(var(--container-top) + var(--first-card-height) + 10px);
  left: 50%;
  transform: translate(
    -50%,
    -50%
  ); /* Center both horizontally and vertically */
  z-index: 10; /* Ensure it appears on top of the cards */
  pointer-events: none; /* Allow clicks to pass through to cards */
  margin: 0; /* Remove any default margins */
  width: auto; /* Let content determine width */
}

.set-indicator :deep(.player-name) {
  width: auto; /* Let content determine width, not full width */
  flex-shrink: 0;
}

.set-indicator :deep(.name-text) {
  color: #64748b; /* slate-500 */
}

.winner-message {
  position: absolute;
  /* Position at the dead center between the two cards - same as set-indicator */
  --status-bar: max(20px, env(safe-area-inset-top, 0px));
  --container-top: calc(var(--status-bar) + 20px);
  --container-height: calc(100% - var(--container-top) - 68px);
  --first-card-height: calc((var(--container-height) - 40px) / 2);
  top: calc(var(--container-top) + var(--first-card-height) + 10px);
  left: 50%;
  transform: translate(
    -50%,
    -50%
  ); /* Center both horizontally and vertically */
  z-index: 10; /* Ensure it appears on top of the cards */
  pointer-events: none; /* Allow clicks to pass through to cards */
  margin: 0; /* Remove any default margins */
  width: auto; /* Let content determine width */
}

.winner-message :deep(.player-name) {
  width: auto; /* Let content determine width, not full width */
  flex-shrink: 0;
}

.winner-message :deep(.name-text) {
  color: #64748b; /* slate-500 - same as set-indicator */
}

.gap-to-buttons {
  height: 20px;
  min-height: 20px;
  width: 100%;
  flex-shrink: 0;
  flex-grow: 0;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.bottom-buttons-container {
  position: absolute;
  bottom: 20px; /* 20px above safe area (game-screen padding-bottom handles safe area) */
  left: calc(20px + env(safe-area-inset-left, 0px));
  right: calc(20px + env(safe-area-inset-right, 0px));
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px; /* 20px gap between all buttons */
  box-sizing: border-box;
  height: 48px; /* Explicit height */
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Game Results overlay */
.game-results-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(2, 6, 23, 0.6); /* same as .modal-backdrop */
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-out;
}

.game-results-backdrop.no-animation {
  animation: none;
}

.game-results-wrapper {
  width: calc(
    100% - 40px
  ); /* Match content area width: game-screen width minus 20px padding on each side */
  max-width: 400px; /* Reasonable max width for desktop, but still respects padding on smaller screens */
  animation: fadeIn 0.3s ease-out;
  box-sizing: border-box;
}

.game-results-wrapper.no-animation {
  animation: none;
}
</style>
