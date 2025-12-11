<script setup lang="ts">
import { computed, watch, nextTick, ref } from "vue";
import { storeToRefs } from "pinia";
import { useScoreboardStore } from "~/stores/scoreboardStore";
import { X } from "lucide-vue-next";
import ScoreCardPortrait from "../components/ScoreCardPortrait.vue";
import MenuButton from "../components/MenuButton.vue";
import UndoRedoButtons from "../components/UndoRedoButtons.vue";
import Button from "../components/Button.vue";
import MatchHistoryItem from "../components/MatchHistoryItem.vue";
import PlayerName from "../components/PlayerName.vue";
import TextDropdownField from "../components/TextDropdownField.vue";
import ToggleButton from "../components/ToggleButton.vue";
import DropdownMenu from "../components/DropdownMenu.vue";
import Alert from "../components/Alert.vue";
import GameResults from "../components/GameResults.vue";
import { useGameState } from "~/composables/useGameState";
import { useMatchSettings } from "~/composables/useMatchSettings";
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
  bestOf,
  ownFinishEnabled,
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
} = storeToRefs(scoreboardStore);

const matchTypeParam = computed(() => matchType.value);
const isOwnFinishEnabled = ownFinishEnabled;
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
  openDropdown,
  beybladeGenerationLabel,
  pointsToWinLabel,
  setsLabel,
  ownFinishOptionLabel,
  pointsToWinItems,
  handleGenerationDropdownToggle,
  handlePointsToWinDropdownToggle,
  handleSetsDropdownToggle,
  handleGenerationSelect,
  handlePointsToWinSelect,
  handleSetsSelect,
  handleOwnFinishToggle,
  closeDropdowns,
  GENERATION_ITEMS: generationItems,
  SETS_ITEMS: setsItems,
} = useMatchSettings(
  generation,
  matchType,
  bestOf,
  isOwnFinishEnabled,
  scoreboardStore.setGeneration,
  scoreboardStore.setMatchType,
  scoreboardStore.setBestOf,
  scoreboardStore.setOwnFinishEnabled,
);

const {
  isMatchHistoryModalOpen,
  isMatchHistoryModalClosing,
  openMatchHistoryModal,
  closeMatchHistoryModal,
} = useMatchHistoryModal();

const {
  isSettingsModalOpen,
  isSettingsModalClosing,
  hasChanges,
  openSettingsModal,
  closeSettingsModal,
  handleSaveChanges,
  handleResetGame,
} = useSettingsModal(
  player1NameSetting,
  player2NameSetting,
  generation,
  matchType,
  bestOf,
  isOwnFinishEnabled,
  {
    setGeneration: scoreboardStore.setGeneration,
    setMatchType: scoreboardStore.setMatchType,
    setBestOf: scoreboardStore.setBestOf,
    setOwnFinishEnabled: scoreboardStore.setOwnFinishEnabled,
    reset: scoreboardStore.reset,
  },
  {
    gameHasStarted,
    closeDropdowns,
  },
);

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

displayedSetNumber.value = 1;

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
historyIndex.value = 0;

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
          :class="{
            'winner-state':
              (matchOver || (gameEnded && bestOf === undefined)) &&
              winnerDisplayText,
          }"
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
      <div
        v-if="isMatchHistoryModalOpen || isMatchHistoryModalClosing"
        class="modal-backdrop"
        :class="{ closing: isMatchHistoryModalClosing }"
        @click="closeMatchHistoryModal"
      >
        <div
          class="modal-content"
          :class="{ closing: isMatchHistoryModalClosing }"
          @click.stop
        >
          <h1 class="modal-title">Match History</h1>
          <button class="modal-close" @click="closeMatchHistoryModal">
            <X :size="24" color="#64748b" :stroke-width="2" />
          </button>

          <!-- Match History Items -->
          <div class="match-history-list">
            <template v-for="(item, index) in matchHistory" :key="index">
              <div v-if="item.isGameDivider" class="game-divider">
                <div class="divider-line" />
                <div class="divider-text">
                  <span v-if="item.isMatchConclusion"
                    >Set {{ item.gameNumber }} –
                    {{ getPlayerDisplayNameFull(item.winner) }} Wins</span
                  >
                  <span v-else>Set {{ item.gameNumber }}</span>
                </div>
                <div class="divider-line" />
              </div>
              <MatchHistoryItem
                v-else
                :generation="generation"
                :player="item.player"
                :score1="item.score1"
                :score2="item.score2"
                :chip-label="item.chipLabel"
                :is-first="index === 0"
                :is-warning="item.isWarning || false"
                :is-penalty="item.isPenalty || false"
                :is-game-win="item.isGameWin || false"
                :is-penalty-win="item.isPenaltyWin || false"
                :best-of="bestOf"
                :set-wins="item.setWins || 0"
                :winner="item.winner || null"
                :player1-name="player1DisplayName"
                :player2-name="player2DisplayName"
                :is-after-divider="
                  (() => {
                    // Items are added with unshift (newest first), so array order is reverse chronological
                    // When rendering with v-for, we iterate index 0 to end (top to bottom)
                    // The first entry ABOVE a Set divider (last entry of previous set) should not have bottom padding/border
                    // Check if the NEXT item (index + 1) is a divider
                    // If so, this item is the first entry above that divider
                    if (index < matchHistory.length - 1) {
                      const nextItem = matchHistory[index + 1];
                      if (nextItem?.isGameDivider) {
                        // Next item is a divider - this is the first entry above it
                        return true; // Remove padding/border
                      }
                    }
                    // Not above a divider - keep padding/border
                    return false;
                  })()
                "
              />
            </template>
          </div>
        </div>
      </div>

      <!-- Settings Modal -->
      <div
        v-if="isSettingsModalOpen || isSettingsModalClosing"
        class="modal-backdrop settings-modal-backdrop"
        :class="{ closing: isSettingsModalClosing }"
        @click="closeSettingsModal"
      >
        <div
          class="modal-content settings-modal-content"
          :class="{ closing: isSettingsModalClosing }"
          @click.stop
        >
          <h1 class="modal-title">Settings</h1>
          <p class="settings-description">Set your match preferences.</p>
          <button class="modal-close" @click="closeSettingsModal">
            <X :size="24" color="#64748b" :stroke-width="2" />
          </button>

          <!-- Settings content area -->
          <div class="settings-content">
            <div v-if="gameHasStarted" class="settings-field alert-top">
              <Alert />
            </div>
            <div class="settings-field">
              <TextDropdownField
                v-model="player1NameSetting"
                title="Player 1 Name"
                :show-chevron="false"
                :max-length="15"
              />
            </div>
            <div class="settings-field">
              <TextDropdownField
                v-model="player2NameSetting"
                title="Player 2 Name"
                :show-chevron="false"
                :max-length="15"
              />
            </div>
            <div class="settings-field generation-gap">
              <div style="position: relative">
                <TextDropdownField
                  title="Beyblade Generation"
                  variant="dropdown"
                  :show-chevron="true"
                  :model-value="beybladeGenerationLabel"
                  @toggle="handleGenerationDropdownToggle"
                />
                <div
                  v-if="openDropdown === 'generation'"
                  style="
                    margin-top: 8px;
                    position: absolute;
                    width: 100%;
                    z-index: 10;
                  "
                >
                  <DropdownMenu
                    :items="generationItems"
                    :selected-value="generation"
                    @select="handleGenerationSelect"
                  />
                </div>
              </div>
            </div>
            <div class="settings-field">
              <div style="position: relative">
                <TextDropdownField
                  title="Points to Win"
                  variant="dropdown"
                  :show-chevron="true"
                  :model-value="pointsToWinLabel"
                  @toggle="handlePointsToWinDropdownToggle"
                />
                <div
                  v-if="openDropdown === 'pointsToWin'"
                  style="
                    position: absolute;
                    top: calc(0.875rem * 1.5 + 8px);
                    width: 100%;
                    z-index: 10;
                    transform: translateY(calc(-100% - 8px));
                  "
                >
                  <DropdownMenu
                    :items="pointsToWinItems"
                    :selected-value="matchTypeParam"
                    @select="handlePointsToWinSelect"
                  />
                </div>
              </div>
            </div>
            <div
              v-if="matchTypeParam !== 'nolimit'"
              class="settings-field sets-gap"
            >
              <div style="position: relative">
                <TextDropdownField
                  title="Sets"
                  variant="dropdown"
                  :show-chevron="true"
                  :model-value="setsLabel"
                  @toggle="handleSetsDropdownToggle"
                />
                <div
                  v-if="openDropdown === 'sets'"
                  style="
                    position: absolute;
                    top: calc(0.875rem * 1.5 + 8px);
                    width: 100%;
                    z-index: 10;
                    transform: translateY(calc(-100% - 8px));
                  "
                >
                  <DropdownMenu
                    :items="setsItems"
                    :selected-value="bestOf ? bestOf.toString() : undefined"
                    @select="handleSetsSelect"
                  />
                </div>
              </div>
            </div>
            <div
              v-if="generation === 'x'"
              class="settings-field own-finish-gap"
            >
              <div class="own-finish-label">Own Finish</div>
              <div class="own-finish-toggle">
                <ToggleButton
                  size="default"
                  :initial-state="isOwnFinishEnabled"
                  @toggle="handleOwnFinishToggle"
                >
                  {{ ownFinishOptionLabel }}
                </ToggleButton>
              </div>
            </div>
          </div>

          <!-- Settings buttons -->
          <div class="settings-buttons">
            <Button
              variant="blue"
              :disabled="!hasChanges"
              @click="handleSaveChanges"
              >Save Changes</Button
            >
            <Button variant="secondary" @click="handleResetGame"
              >Reset Game</Button
            >
          </div>
        </div>
      </div>
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

/* Match History Modal */
.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
  /* Overlay only on right side (opposite of where modal comes from) */
  background: linear-gradient(
    to right,
    transparent 0%,
    transparent 50%,
    rgba(2, 6, 23, 0.6) 50%,
    rgba(2, 6, 23, 0.6) 100%
  );
}

.modal-backdrop.closing {
  animation: fadeOut 0.3s ease-out;
}

.modal-content {
  position: absolute;
  top: 0;
  left: 0; /* Match history slides in from left, starts at viewport edge */
  right: max(
    0px,
    calc(20px - env(safe-area-inset-right, 0px))
  ); /* 20px from viewport edge, never negative */
  width: auto; /* Let left/right positioning determine width */
  max-width: calc(
    100vw - 20px
  ); /* Ensure it doesn't exceed viewport minus 20px on right side */
  height: 100%;
  background-color: white;
  z-index: 1001;
  animation: slideInFromLeft 0.3s ease-out;
  will-change: transform;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0; /* No padding - content elements handle their own positioning */
}

.modal-content.closing {
  animation: slideOutToLeft 0.3s ease-out;
}

.modal-title {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 44px; /* Leave space for close button (20px padding + 24px button width) */
  font-family: "Titillium Web", sans-serif;
  font-size: 1.125rem; /* text-lg */
  font-weight: bold;
  color: #334155; /* slate-500 */
  margin: 0;
  padding: 0;
  line-height: 1.5; /* Explicit line-height for alignment calculation */
  width: auto; /* Let left/right positioning determine width */
  box-sizing: border-box;
}

.match-history-list {
  position: absolute;
  top: calc(
    20px + 1.6875rem + 24px
  ); /* Modal padding (20px) + title height (1.125rem * 1.5) + 24px gap */
  left: 20px;
  right: 20px; /* 20px padding from modal container edge */
  bottom: 0; /* Span to bottom of modal */
  width: auto; /* Let left/right positioning determine width */
  box-sizing: border-box;
  overflow-y: auto;
  padding-bottom: 20px; /* Bottom padding so last item isn't flush to bottom */
}

.match-history-list > :first-child {
  margin-top: 0;
}

.match-history-list > :not(:first-child) {
  margin-top: 12px;
}

.game-divider {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 12px; /* 12px above the last win */
  margin-bottom: 0;
  padding: 0;
  width: 100%;
}

.divider-line {
  flex: 1;
  height: 1px;
  background-color: #e2e8f0; /* slate-200 */
}

.divider-text {
  font-family: "Titillium Web", sans-serif;
  font-size: 0.875rem; /* text-sm - same as match-score */
  font-weight: 600; /* semibold */
  color: #64748b; /* slate-500 - same as match-score */
  padding: 0 12px; /* 12px left and right padding */
  white-space: nowrap;
}

.modal-close {
  position: absolute;
  top: 24px; /* Horizontally center aligned with text */
  right: 20px; /* 20px padding from modal container edge for better spacing */
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal-close:hover {
  opacity: 0.9;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInFromLeft {
  from {
    transform: translateX(-100%); /* Start off-screen to the left */
  }
  to {
    transform: translateX(0); /* Final position */
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes slideOutToLeft {
  from {
    transform: translateX(0); /* Final position */
  }
  to {
    transform: translateX(-100%); /* Slide off-screen to the left */
  }
}

/* Settings Modal - slides in from right */
.settings-modal-content {
  left: max(
    0px,
    calc(20px - env(safe-area-inset-left, 0px))
  ); /* 20px from viewport edge, never negative */
  right: 0; /* Flush with viewport edge - content handles padding */
  width: auto; /* Let left/right positioning determine width */
  max-width: calc(
    100vw - 20px
  ); /* Ensure it doesn't exceed viewport minus 20px on left side */
  animation: slideInFromRight 0.3s ease-out;
  will-change: transform;
  padding: 0; /* No padding - content elements handle their own positioning */
}

/* Settings modal backdrop - overlay only on left side (opposite of where modal comes from) */
.settings-modal-backdrop {
  background: linear-gradient(
    to right,
    rgba(2, 6, 23, 0.6) 0%,
    rgba(2, 6, 23, 0.6) 50%,
    transparent 50%,
    transparent 100%
  );
}

.settings-modal-content.closing {
  animation: slideOutToRight 0.3s ease-out;
}

.settings-description {
  position: absolute;
  top: calc(20px + 1.6875rem + 6px); /* Title top + title height + 4px gap */
  left: 20px;
  right: 20px; /* 20px padding from modal container edge */
  font-family: "Titillium Web", sans-serif;
  font-size: 1rem; /* text-base */
  font-weight: 400;
  color: #64748b; /* slate-500 */
  margin: 0;
  padding: 0;
  line-height: 1.5;
  width: auto; /* Let left/right positioning determine width */
  box-sizing: border-box;
}

.settings-content {
  position: absolute;
  top: calc(
    20px + 1.6875rem + 6px + 1.5rem + 24px
  ); /* Title + description spacing + description height + 24px */
  left: 20px;
  right: 20px; /* 20px padding from modal container edge */
  bottom: 0;
  width: auto; /* Let left/right positioning determine width */
  box-sizing: border-box;
  overflow-y: auto;
  padding-bottom: 106px; /* Space for buttons (46px button + 20px gap + 20px bottom + 20px extra) */
  display: flex;
  flex-direction: column;
  gap: 0;
}

.settings-field {
  width: 100%;
}

.settings-field + .settings-field {
  margin-top: 16px;
}

.settings-field.generation-gap {
  margin-top: 16px;
}

.settings-field.sets-gap {
  margin-top: 16px;
}

.settings-field.own-finish-gap {
  margin-top: 16px;
}

.settings-field.alert-top {
  margin-top: 0;
  margin-bottom: 24px;
}

.settings-field.alert-top + .settings-field {
  margin-top: 0;
}

.own-finish-label {
  font-family: "Titillium Web", sans-serif;
  font-size: 0.875rem; /* text-sm */
  font-weight: 600;
  color: #64748b; /* slate-500 */
  margin: 0;
  padding: 0;
  line-height: 1.5;
}

.own-finish-toggle {
  margin-top: 8px;
  display: flex;
  align-items: center;
}

.settings-buttons {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px; /* 20px padding from modal container edge */
  width: auto; /* Let left/right positioning determine width */
  display: flex;
  flex-direction: row;
  gap: 20px;
  box-sizing: border-box;
}

.settings-buttons :deep(button) {
  flex: 1 1 0 !important;
  min-width: 0 !important;
  max-width: none !important;
  width: auto !important;
  font-weight: bold;
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

@keyframes slideInFromRight {
  from {
    transform: translateX(100%); /* Start off-screen to the right */
  }
  to {
    transform: translateX(0); /* Final position */
  }
}

@keyframes slideOutToRight {
  from {
    transform: translateX(0); /* Final position */
  }
  to {
    transform: translateX(100%); /* Slide off-screen to the right */
  }
}
</style>
