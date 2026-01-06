<script setup lang="ts">
import { computed, ref, watch, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useScoreboardStore } from "~/stores/scoreboardStore";
import { X } from "lucide-vue-next";
import ScoreCardLandscape from "../components/ScoreCardLandscape.vue";
import LandscapeNavigation from "../components/LandscapeNavigation.vue";
import Button from "../components/Button.vue";
import MatchHistoryItem from "../components/MatchHistoryItem.vue";
import TextDropdownField from "../components/TextDropdownField.vue";
import ToggleButton from "../components/ToggleButton.vue";
import DropdownMenu from "../components/DropdownMenu.vue";
import Alert from "../components/Alert.vue";
import GameResults from "../components/GameResults.vue";
import PlayerName from "../components/PlayerName.vue";
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
  customPoints,
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
  handleCustomPointsChange,
  closeDropdowns,
  GENERATION_ITEMS: generationItems,
  SETS_ITEMS: setsItems,
} = useMatchSettings(
  generation,
  matchType,
  customPoints,
  bestOf,
  isOwnFinishEnabled,
  scoreboardStore.setGeneration,
  scoreboardStore.setMatchType,
  scoreboardStore.setCustomPoints,
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
  customPoints,
  bestOf,
  isOwnFinishEnabled,
  {
    setGeneration: scoreboardStore.setGeneration,
    setMatchType: scoreboardStore.setMatchType,
    setCustomPoints: scoreboardStore.setCustomPoints,
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
  <div class="viewport-container-landscape">
    <div class="game-screen-landscape">
      <!-- Current Set Indicator (centered with player names) -->
      <PlayerName
        v-if="bestOf !== undefined && !matchOver"
        :name="currentSetText"
        :player="undefined"
        :best-of="undefined"
        class="set-indicator-landscape"
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
        class="winner-message-landscape"
      />

      <!-- Score Cards Container -->
      <div class="score-cards-container-landscape">
        <!-- Player 1 Score Card -->
        <ScoreCardLandscape
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
        <ScoreCardLandscape
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
          @score-increase="
            (points, chipLabel) => handlePlayer2ScoreIncrease(points, chipLabel)
          "
          @penalty="handlePlayer2Penalty"
          @warning-toggle="handlePlayer2WarningToggle"
          @own-finish="handlePlayer2OwnFinish"
        />
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

      <!-- Landscape Navigation -->
      <div class="landscape-navigation-container">
        <LandscapeNavigation
          :undo-disabled="undoDisabled"
          :redo-disabled="redoDisabled"
          :history-disabled="undoDisabled"
          :game-over="matchOver || (gameEnded && bestOf === undefined)"
          @history="openMatchHistoryModal"
          @undo="handleUndo"
          @redo="handleRedo"
          @settings="openSettingsModal"
          @new-game="handleGameResultsNewGame"
        />
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
                    if (index < matchHistory.length - 1) {
                      const nextItem = matchHistory[index + 1];
                      if (nextItem?.isGameDivider) {
                        return true;
                      }
                    }
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
            <div v-if="matchTypeParam === 'custom'" class="settings-field">
              <div class="custom-points-field">
                <label for="custom-points-input" class="custom-points-title">Custom Points</label>
                <div class="custom-points-input-container">
                  <input
                    id="custom-points-input"
                    type="number"
                    min="1"
                    :value="customPoints"
                    class="custom-points-input"
                    @input="
                      (e) => {
                        const val = parseInt(
                          (e.target as HTMLInputElement).value,
                          10,
                        );
                        if (!isNaN(val) && val >= 1)
                          handleCustomPointsChange(val);
                      }
                    "
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
          <div class="settings-buttons-container">
            <div class="settings-buttons">
              <Button
                variant="blue"
                :disabled="!hasChanges"
                @click="handleSaveChanges"
                >Save Changes</Button
              >
              <Button
                variant="secondary"
                class="reset-game-button-transparent"
                @click="handleResetGame"
                >Reset Game</Button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.viewport-container-landscape {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
  position: relative;
}

/* On mobile landscape, viewport container should fill screen */
@media (max-width: 767px) and (orientation: landscape) {
  .viewport-container-landscape {
    width: 100vw;
    max-width: 100vw;
    height: 100vh;
    min-height: 100vh;
    align-items: stretch; /* Allow game-screen to fill height */
    justify-content: stretch; /* Allow game-screen to fill width */
    overflow: hidden; /* Prevent overflow */
    box-sizing: border-box;
  }
}

.game-screen-landscape {
  /* PWA viewport in landscape - matches actual device dimensions when installed */
  /* Width (horizontal): 640px (Android baseline) minimum, grows with viewport */
  /* Default: 844px (iPhone 12/13/14, iPhone 15, common Android) */
  width: 100%;
  min-width: 640px; /* Android baseline - smallest supported landscape width */
  max-width: calc(
    100vw
  ); /* Grow with viewport, accounting for 20px padding on each side */

  /* On desktop/tablet, constrain width to 840px */
  @media (min-width: 768px) {
    max-width: 840px; /* Desktop/tablet width */
  }

  /* Height (vertical): 360px (Android baseline) to 428px (iPhone Pro Max, large Android) */
  /* Default: 390px (iPhone 12/13/14, iPhone 15, common Android like Pixel) */
  height: 390px;
  min-height: 360px; /* Android baseline - smallest supported landscape height */
  max-height: 428px; /* iPhone Pro Max, large Android phones */

  /* On mobile landscape, fill viewport height while respecting safe areas */
  @media (max-width: 767px) and (orientation: landscape) {
    height: 100vh;
    min-height: 100vh;
    max-height: 100vh;
  }

  background-color: white;
  border: none; /* No border for landscape */
  box-sizing: border-box;
  position: relative;

  /* Account for safe areas - these represent the actual usable content area */
  /* Top: Status bar area (minimum 20px for status bar, plus any safe area inset) */
  padding-top: env(safe-area-inset-top, 0px);

  /* Bottom: Home indicator area (minimum 34px for home indicator, plus any safe area inset) */
  padding-bottom: env(safe-area-inset-bottom, 0px);

  /* Left/Right: 20px padding + Safe areas for notches (if any) */
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);

  /* Ensure content area respects safe zones */
  overflow: hidden;
}

.score-cards-container-landscape {
  position: absolute;
  top: 20px; /* 20px from top */
  left: 0; /* Respect game-screen's left padding */
  right: 0; /* Respect game-screen's right padding */
  bottom: 20px; /* 20px from bottom of content area */
  display: flex;
  flex-direction: row;
  align-items: stretch; /* Stretch cards to fill full available height */
  justify-content: center;
  gap: 20px; /* 20px gap between cards */
  box-sizing: border-box;
  min-height: 0; /* Allow flex items to shrink below content size */
}

.score-cards-container-landscape :deep(.score-card) {
  flex: 1 1 0; /* Grow equally, allow shrinking */
  max-width: none; /* Remove max-width constraint to allow cards to grow larger */
  height: 100% !important; /* Fill container height - override component defaults */
  width: auto !important; /* Override component's 90vw - let aspect-ratio determine width */
  max-height: 100%;
  aspect-ratio: 1 !important; /* Maintain square shape - ensure this is applied */
  min-width: 0; /* Allow shrinking if needed */
}

/* On mobile landscape, ensure cards fill screen while respecting safe areas */
@media (max-width: 767px) and (orientation: landscape) {
  .game-screen-landscape {
    width: 100vw; /* Full viewport width */
    max-width: 100vw;
    height: 100vh; /* Full viewport height */
    min-height: 100vh;
    max-height: 100vh;
    box-sizing: border-box; /* Ensure padding is included in width */
    overflow: hidden; /* Prevent content from overflowing */
    /* 20px base padding + safe areas on left/right */
    padding-left: calc(20px + env(safe-area-inset-left, 0px)) !important;
    padding-right: calc(20px + env(safe-area-inset-right, 0px)) !important;
  }

  .score-cards-container-landscape {
    /* 20px padding on top/bottom, left/right at 0 to respect game-screen padding */
    top: 20px !important;
    left: 0 !important; /* Respect game-screen left padding (20px + safe area) */
    right: 0 !important; /* Respect game-screen right padding (20px + safe area) */
    bottom: 20px !important;
    gap: 20px;
    width: 100% !important; /* Ensure container respects parent padding */
    box-sizing: border-box !important;
    /* Left/right padding: 20px base + safe area (from game-screen padding) */
  }

  .score-cards-container-landscape :deep(.score-card) {
    flex: 1 1 0 !important; /* Cards grow equally to fill available space */
    min-width: 0 !important; /* Allow shrinking below content size */
    width: auto !important; /* Let flex and aspect-ratio determine width */
    height: 100% !important; /* Fill container height */
    aspect-ratio: 1 !important; /* Maintain square shape */
    max-width: 100% !important; /* Ensure cards don't overflow container */
    box-sizing: border-box !important;
  }
}

/* Set indicator and winner message - centered between player names and score numbers */
.set-indicator-landscape,
.winner-message-landscape {
  position: absolute;
  /* Midpoint between player name center and score center */
  /* Player name center from game screen: 20px (container) + 20px (card padding) + 19px (half height) = 59px */
  /* Score center from game screen: 20px (container) + card padding (20px) + calc(50% - 13px) relative to card */
  /* Since card height varies, we calculate midpoint differently */
  /* Player name center: 59px from game screen top */
  /* Score is at calc(50% - 13px) from card top, which is calc(20px + 20px + 50% - 13px) = calc(27px + 50%) from game screen */
  /* But 50% is relative to card height, so we need to use the card's actual position */
  /* Simplified: midpoint is roughly at the center between these two points */
  /* Using the card's center point adjusted: cards container (20px) + card center (50% of card) */
  /* But we want midpoint between player name (59px) and score (which is at card center - 13px) */
  /* Card center from game screen: 20px (container) + 50% of card height */
  /* Score from game screen: 20px + 50% of card - 13px = calc(7px + 50% of card) */
  /* Actually, let's use a simpler approach: position it at the visual midpoint */
  /* Player name at 59px, score at roughly card center (which varies), so we'll position at a fixed point */
  /* Better: use calc to find midpoint between 59px and the score position */
  /* Center vertically in the game screen */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10; /* Ensure it appears on top of the cards */
  pointer-events: none; /* Allow clicks to pass through to cards */
  margin: 0;
  width: auto;
}

.set-indicator-landscape :deep(.player-name),
.winner-message-landscape :deep(.player-name) {
  width: auto; /* Let content determine width, not full width */
  flex-shrink: 0;
}

.set-indicator-landscape :deep(.name-text),
.winner-message-landscape :deep(.name-text) {
  color: #64748b; /* slate-500 */
}

.landscape-navigation-container {
  position: absolute;
  bottom: 40px; /* 40px from bottom - flush with SPF buttons */
  left: 0; /* Respect game-screen's left padding */
  right: 0; /* Respect game-screen's right padding */
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  z-index: 10;
}

/* On mobile landscape, ensure navigation stays flush with SPF buttons */
@media (max-width: 767px) and (orientation: landscape) {
  .landscape-navigation-container {
    bottom: 40px !important; /* Maintain 40px from bottom - flush with SPF buttons */
    left: 20px !important; /* 20px from left edge of content area */
    right: 20px !important; /* 20px from right edge of content area */
  }
}

.landscape-navigation-container :deep(.landscape-navigation) {
  pointer-events: auto; /* Re-enable clicks on navigation component */
}

/* Match History Modal */
.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(2, 6, 23, 0.6); /* slate-950 at 60% opacity */
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-backdrop.closing {
  animation: fadeOut 0.3s ease-out;
}

.modal-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 90%;
  height: 100%;
  background-color: white;
  z-index: 1001;
  animation: slideInFromLeft 0.3s ease-out;
  will-change: transform;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.modal-content.closing {
  animation: slideOutToLeft 0.3s ease-out;
}

.modal-title {
  position: absolute;
  top: 20px;
  left: 20px;
  font-family: "Titillium Web", sans-serif;
  font-size: 1.125rem; /* text-lg */
  font-weight: bold;
  color: #334155; /* slate-500 */
  margin: 0;
  padding: 0;
  line-height: 1.5; /* Explicit line-height for alignment calculation */
}

.match-history-list {
  position: absolute;
  top: calc(
    20px + 1.6875rem + 24px
  ); /* Modal padding (20px) + title height (1.125rem * 1.5) + 24px gap */
  left: 20px;
  right: 20px;
  bottom: 0; /* Span to bottom of modal */
  width: calc(100% - 40px);
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
  right: 20px;
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
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
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
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

/* Settings Modal - slides in from right */
.settings-modal-content {
  left: auto;
  right: 0;
  animation: slideInFromRight 0.3s ease-out;
  will-change: transform;
}

.settings-modal-content.closing {
  animation: slideOutToRight 0.3s ease-out;
}

.settings-description {
  position: absolute;
  top: calc(20px + 1.6875rem + 6px); /* Title top + title height + 4px gap */
  left: 20px;
  right: 20px;
  font-family: "Titillium Web", sans-serif;
  font-size: 1rem; /* text-base */
  font-weight: 400;
  color: #64748b; /* slate-500 */
  margin: 0;
  padding: 0;
  line-height: 1.5;
}

.settings-content {
  position: absolute;
  top: calc(
    20px + 1.6875rem + 6px + 1.5rem + 24px
  ); /* Title + description spacing + description height + 24px */
  left: 20px;
  right: 20px;
  bottom: 0;
  width: calc(100% - 40px);
  box-sizing: border-box;
  overflow-y: auto;
  padding-bottom: 112px; /* Space for buttons container + 24px visual gap (accounts for 1px top border) */
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

.custom-points-field {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.custom-points-title {
  font-family: "Titillium Web", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
}

.custom-points-input-container {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background-color: white;
  padding: 8px 12px;
  box-shadow: 0 0 4px rgba(15, 23, 42, 0.05);
}

.custom-points-input {
  width: 100%;
  border: none;
  background: transparent;
  font-family: "Titillium Web", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #475569;
  outline: none;
}

.custom-points-input::-webkit-outer-spin-button,
.custom-points-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.custom-points-input[type="number"] {
  -moz-appearance: textfield;
}

.settings-buttons-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: #f8fafc; /* slate-50 */
  border-top: 1px solid #e2e8f0; /* slate-200 */
  padding: 20px;
  box-sizing: border-box;
  z-index: 20; /* Higher than dropdowns (z-index: 10) to prevent overlay */
}

.settings-buttons {
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
}

.settings-buttons :deep(button) {
  flex: 1 1 0 !important;
  min-width: 0 !important;
  max-width: none !important;
  width: auto !important;
  font-weight: bold;
}

.settings-buttons :deep(.reset-game-button-transparent) {
  background-color: transparent !important;
  border: 1px solid #1088c9;
  border-bottom: 2px solid #1088c9;
}

/* Game Results overlay */
.game-results-backdrop.no-animation {
  animation: none;
}

.game-results-wrapper.no-animation {
  animation: none;
}

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
  width: calc(100% - 40px);
  max-width: 348px;
  animation: fadeIn 0.3s ease-out;
}

.game-results-wrapper.no-animation {
  animation: none;
}

@keyframes slideInFromRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOutToRight {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}
</style>
