<script setup>
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

const scoreboardStore = useScoreboardStore();
const {
  generation: generationRef,
  matchType: matchTypeRef,
  bestOf: bestOfRef,
  ownFinishEnabled: ownFinishEnabledRef,
} = storeToRefs(scoreboardStore);

const setGeneration = scoreboardStore.setGeneration;
const setMatchType = scoreboardStore.setMatchType;
const setBestOf = scoreboardStore.setBestOf;
const setOwnFinishEnabled = scoreboardStore.setOwnFinishEnabled;

const generation = computed(() => generationRef.value);
const bestOf = computed(() => bestOfRef.value);
const isOwnFinishEnabled = ownFinishEnabledRef;

// Determine max points from match type
const maxPoints = computed(() => {
  const matchType = matchTypeParam.value;
  if (matchType === "nolimit") {
    return null; // No limit
  } else if (matchType === "3pts") {
    return 3;
  } else if (matchType === "4pts") {
    return 4;
  } else if (matchType === "5pts") {
    return 5;
  } else if (matchType === "7pts") {
    return 7;
  }
  // Default to no limit if not provided or invalid
  return null;
});

// Helper function to determine chip type for match history based on generation
const getChipTypeForHistory = (chipLabel) => {
  // Map chip labels to win condition names based on generation
  if (generation.value === "x") {
    if (chipLabel === "XTR") return "Xtreme";
    if (chipLabel === "BST") return "Burst";
    if (chipLabel === "OVR") return "Over";
    if (chipLabel === "SPF") return "Spin";
  } else if (generation.value === "burst") {
    if (chipLabel === "BST") return "Burst";
    if (chipLabel === "OVR") return "Over";
    if (chipLabel === "SPF") return "Spin";
  } else if (generation.value === "mfb-zero-g") {
    if (chipLabel === "OVR") return "Over";
    if (chipLabel === "SPF") return "Spin";
  } else if (generation.value === "plastics-hms") {
    if (chipLabel === "OVR") return "Over";
    if (chipLabel === "SPF") return "Spin";
  }
  // Default fallback - use generation-based win condition
  const defaultMapping = {
    x: "Xtreme",
    burst: "Burst",
    "mfb-zero-g": "Over",
    "plastics-hms": "Spin",
  };
  return defaultMapping[generation.value] || "Xtreme";
};

// Calculate current set number
const currentSetNumber = computed(() => {
  if (bestOf.value === null) return null;
  // Current set is the number of completed sets + 1
  // But if match is over, show the final set number (don't increment)
  const completedSets = p1SetWins.value.length;
  if (matchOver.value) {
    // Match is over, show the final set that concluded the match
    return completedSets;
  }
  return completedSets + 1;
});

// Current set text for display - use displayedSetNumber which updates after animation
const currentSetText = computed(() => {
  if (bestOf.value === null) return "";
  return `Set ${displayedSetNumber.value}`;
});

// Helper function to get the primary win condition label for the current generation
const getPrimaryWinCondition = () => {
  const mapping = {
    x: "Xtreme",
    burst: "Burst",
    "mfb-zero-g": "Over",
    "plastics-hms": "Spin",
  };
  return mapping[generation.value] || "Xtreme";
};

// Game state - track only main scores for both players
// Chip scores keep their default values (defined in ScoreCardLandscape props)
// Use shared state that persists across viewport changes
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
} = storeToRefs(scoreboardStore);

// Store original values when settings modal opens (for comparison and revert)
const originalPlayer1Name = ref("Player 1");
const originalPlayer2Name = ref("Player 2");
const originalGeneration = ref("x");
const originalMatchType = ref("4pts");
const originalBestOf = ref(null);
const originalOwnFinish = ref(false);

// Name truncation based on sets
const nameTruncationLimit = computed(() => (bestOf.value === null ? 24 : 10));

const formatDisplayName = (name) => {
  const limit = nameTruncationLimit.value;
  if (!name) return "";
  if (name.length <= limit) return name;
  const sliceLength = Math.max(limit - 3, 0);
  const truncated = name.slice(0, sliceLength).trimEnd();
  return `${truncated}...`;
};

const player1DisplayName = computed(() =>
  formatDisplayName(player1NameSetting.value),
);
const player2DisplayName = computed(() =>
  formatDisplayName(player2NameSetting.value),
);

const getPlayerDisplayName = (playerKey) => {
  if (playerKey === "p1") return player1DisplayName.value;
  if (playerKey === "p2") return player2DisplayName.value;
  return "Player";
};

// Get untruncated player name for match history and winner messages
const getPlayerDisplayNameFull = (playerKey) => {
  if (playerKey === "p1") return player1NameSetting.value || "Player 1";
  if (playerKey === "p2") return player2NameSetting.value || "Player 2";
  return "Player";
};

// Check if there are unsaved changes
const hasChanges = computed(() => {
  return (
    player1NameSetting.value !== originalPlayer1Name.value ||
    player2NameSetting.value !== originalPlayer2Name.value ||
    generation.value !== originalGeneration.value ||
    matchTypeParam.value !== originalMatchType.value ||
    bestOf.value !== originalBestOf.value ||
    isOwnFinishEnabled.value !== originalOwnFinish.value
  );
});

// Check if game settings have changed (excluding name changes)
const gameSettingsChanged = computed(() => {
  return (
    generation.value !== originalGeneration.value ||
    matchTypeParam.value !== originalMatchType.value ||
    bestOf.value !== originalBestOf.value ||
    isOwnFinishEnabled.value !== originalOwnFinish.value
  );
});

// Check if game has started (points on the board, match history exists, or sets have been won)
const gameHasStarted = computed(() => {
  return (
    player1Score.value > 0 ||
    player2Score.value > 0 ||
    matchHistory.value.length > 0 ||
    p1SetWins.value.length > 0 ||
    p2SetWins.value.length > 0
  );
});

// Match type from the shared store
const matchTypeParam = computed(() => matchTypeRef.value);

const ownFinishOptionLabel = computed(() =>
  isOwnFinishEnabled.value ? "On" : "Off",
);

// Settings modal labels
const beybladeGenerationLabel = computed(() => {
  const mapping = {
    x: "X",
    burst: "Burst",
    "mfb-zero-g": "Metal Fight/Zero-G",
    "plastics-hms": "Plastic & HMS",
  };
  return mapping[generation.value] || "X";
});

const pointsToWinLabel = computed(() => {
  const mapping = {
    "3pts": "3 Pts.",
    "4pts": "4 Pts.",
    "5pts": "5 Pts.",
    "7pts": "7 Pts.",
    nolimit: "No Limit",
  };
  return mapping[matchTypeParam.value] || "No Limit";
});

const setsLabel = computed(() => {
  if (bestOf.value === null) {
    return "None";
  }
  return `Best-of-${bestOf.value}`;
});

// Dropdown menu state
const openDropdown = ref(null); // 'generation', 'pointsToWin', 'sets', or null

// Dropdown items
const generationItems = [
  { label: "X", value: "x" },
  { label: "Burst", value: "burst" },
  { label: "Metal Fight/Zero-G", value: "mfb-zero-g" },
  { label: "Plastics/HMS", value: "plastics-hms" },
];

const pointsToWinItemsX = [
  { label: "4 Pts.", value: "4pts" },
  { label: "5 Pts.", value: "5pts" },
  { label: "7 Pts.", value: "7pts" },
  { label: "No Limit", value: "nolimit" },
];

const pointsToWinItemsOther = [
  { label: "3 Pts.", value: "3pts" },
  { label: "4 Pts.", value: "4pts" },
  { label: "5 Pts.", value: "5pts" },
  { label: "No Limit", value: "nolimit" },
];

const pointsToWinItems = computed(() => {
  return generation.value === "x" ? pointsToWinItemsX : pointsToWinItemsOther;
});

const setsItems = [
  { label: "None", value: null },
  { label: "Best-of-3", value: "3" },
  { label: "Best-of-5", value: "5" },
];

// Dropdown handlers
const handleGenerationDropdownToggle = () => {
  if (openDropdown.value === "generation") {
    openDropdown.value = null;
  } else {
    openDropdown.value = "generation";
  }
};

const handlePointsToWinDropdownToggle = () => {
  if (openDropdown.value === "pointsToWin") {
    openDropdown.value = null;
  } else {
    openDropdown.value = "pointsToWin";
  }
};

const handleSetsDropdownToggle = () => {
  if (openDropdown.value === "sets") {
    openDropdown.value = null;
  } else {
    openDropdown.value = "sets";
  }
};

const handleGenerationSelect = (value) => {
  setGeneration(value);
  openDropdown.value = null;
};

const handlePointsToWinSelect = (value) => {
  setMatchType(value);
  openDropdown.value = null;
};

const handleSetsSelect = (value) => {
  if (value === null) {
    setBestOf(null);
  } else {
    setBestOf(parseInt(value, 10));
  }
  openDropdown.value = null;
};

// Track the chip that caused the game to end (for match history)
// winningChipLabel is now from useGameState()

// Set tracking - track which sets each player has won (in order)
// p1SetWins and p2SetWins are now from useGameState()

// Warning state - track if ERR has been pressed (showing PEN state)
// p1ShowWarning and p2ShowWarning are now from useGameState()

// Animation states for score transitions between sets
// isScoreFadingIn, isScoreShrinking, and displayedSetNumber are now from useGameState()

// Match History Modal state
const isMatchHistoryModalOpen = ref(false);
const isMatchHistoryModalClosing = ref(false);
const isSettingsModalOpen = ref(false);
const isSettingsModalClosing = ref(false);

// Game Results overlay state
// showGameResultsOverlay is now from useGameState()

// Match History - track scoring events
// matchHistory and currentGameNumber are now from useGameState()
// Initialize displayed set number
displayedSetNumber.value = 1;

const openMatchHistoryModal = () => {
  isMatchHistoryModalClosing.value = false;
  isMatchHistoryModalOpen.value = true;
};

const closeMatchHistoryModal = () => {
  if (isMatchHistoryModalClosing.value) return; // Prevent multiple close calls

  isMatchHistoryModalClosing.value = true;
  // Wait for slide-out animation to complete (300ms)
  setTimeout(() => {
    isMatchHistoryModalOpen.value = false;
    isMatchHistoryModalClosing.value = false;
  }, 300);
};

const openSettingsModal = () => {
  // Ensure player names are not empty before storing originals
  if (!player1NameSetting.value || player1NameSetting.value.trim() === "") {
    player1NameSetting.value = "Player 1";
  }
  if (!player2NameSetting.value || player2NameSetting.value.trim() === "") {
    player2NameSetting.value = "Player 2";
  }

  // Store original values when opening modal
  originalPlayer1Name.value = player1NameSetting.value;
  originalPlayer2Name.value = player2NameSetting.value;
  originalGeneration.value = generation.value;
  originalMatchType.value = matchTypeParam.value;
  originalBestOf.value = bestOf.value;
  originalOwnFinish.value = isOwnFinishEnabled.value;
  isSettingsModalClosing.value = false;
  isSettingsModalOpen.value = true;
};

const closeSettingsModal = () => {
  if (isSettingsModalClosing.value) return; // Prevent multiple close calls

  // Revert any unsaved changes
  // Handle empty names by defaulting to Player 1/Player 2
  if (!originalPlayer1Name.value || originalPlayer1Name.value.trim() === "") {
    player1NameSetting.value = "Player 1";
  } else {
    player1NameSetting.value = originalPlayer1Name.value;
  }
  if (!originalPlayer2Name.value || originalPlayer2Name.value.trim() === "") {
    player2NameSetting.value = "Player 2";
  } else {
    player2NameSetting.value = originalPlayer2Name.value;
  }

  if (generation.value !== originalGeneration.value) {
    setGeneration(originalGeneration.value);
  }
  if (matchTypeParam.value !== originalMatchType.value) {
    setMatchType(originalMatchType.value);
  }
  if (bestOf.value !== originalBestOf.value) {
    setBestOf(originalBestOf.value);
  }
  if (isOwnFinishEnabled.value !== originalOwnFinish.value) {
    setOwnFinishEnabled(originalOwnFinish.value);
  }

  // Close any open dropdowns
  openDropdown.value = null;

  isSettingsModalClosing.value = true;
  // Wait for slide-out animation to complete (300ms)
  setTimeout(() => {
    isSettingsModalOpen.value = false;
    isSettingsModalClosing.value = false;
  }, 300);
};

const handleOwnFinishToggle = (state) => {
  setOwnFinishEnabled(state);
};

const handleSaveChanges = () => {
  // Check if game settings have changed
  const gameSettingsChanged =
    generation.value !== originalGeneration.value ||
    matchTypeParam.value !== originalMatchType.value ||
    bestOf.value !== originalBestOf.value ||
    isOwnFinishEnabled.value !== originalOwnFinish.value;

  // Check if game has started (points on the board)
  const gameHasStarted = player1Score.value > 0 || player2Score.value > 0;

  // If game settings changed and game has started, reset the game
  if (gameSettingsChanged && gameHasStarted) {
    scoreboardStore.reset();
  }

  // Handle empty player names - default to Player 1/Player 2
  if (!player1NameSetting.value || player1NameSetting.value.trim() === "") {
    player1NameSetting.value = "Player 1";
  }
  if (!player2NameSetting.value || player2NameSetting.value.trim() === "") {
    player2NameSetting.value = "Player 2";
  }

  // Save changes by updating original values
  originalPlayer1Name.value = player1NameSetting.value;
  originalPlayer2Name.value = player2NameSetting.value;
  originalGeneration.value = generation.value;
  originalMatchType.value = matchTypeParam.value;
  originalBestOf.value = bestOf.value;
  originalOwnFinish.value = isOwnFinishEnabled.value;

  closeSettingsModal();
};

const handleResetGame = () => {
  // Reset player names to defaults
  player1NameSetting.value = "Player 1";
  player2NameSetting.value = "Player 2";

  // Update original values so they match the reset state
  originalPlayer1Name.value = "Player 1";
  originalPlayer2Name.value = "Player 2";

  // Reset game state using store
  scoreboardStore.reset();

  closeSettingsModal();
};

// History system for undo/redo - includes scores, set wins, warning states, and match history
// history and historyIndex are now from useGameState()
// Initialize history if empty
if (history.value.length === 0) {
  history.value = [
    {
      player1: 0,
      player2: 0,
      p1SetWins: [],
      p2SetWins: [],
      p1ShowWarning: false,
      p2ShowWarning: false,
      matchHistory: [], // Initial state
      currentGameNumber: 1, // Track game number for sets
    },
  ];
}

// Save current state to history (includes scores, set wins, warning states, and match history)
const saveState = () => {
  const currentState = {
    player1: player1Score.value,
    player2: player2Score.value,
    p1SetWins: [...p1SetWins.value], // Copy array
    p2SetWins: [...p2SetWins.value], // Copy array
    p1ShowWarning: p1ShowWarning.value,
    p2ShowWarning: p2ShowWarning.value,
    matchHistory: [...matchHistory.value], // Copy array
    currentGameNumber: currentGameNumber.value, // Save current game number
  };

  // Remove any future history (if we're in the middle of history after undo)
  history.value = history.value.slice(0, historyIndex.value + 1);

  // Add new state
  history.value.push(currentState);
  historyIndex.value = history.value.length - 1;
};

// Restore state from history (includes scores, set wins, warning states, and match history)
const restoreState = (state) => {
  // Calculate displayed set number FIRST, before restoring any state
  // This ensures it updates synchronously with the state restoration
  if (bestOf.value !== null) {
    const completedSets = (state.p1SetWins || []).length;
    // Check if match is over based on the state's set wins
    const setsNeeded = Math.floor(bestOf.value / 2) + 1;
    const p1Wins = (state.p1SetWins || []).filter((won) => won).length;
    const p2Wins = (state.p2SetWins || []).filter((won) => won).length;
    const isMatchOver = p1Wins >= setsNeeded || p2Wins >= setsNeeded;
    if (isMatchOver) {
      displayedSetNumber.value = completedSets;
    } else {
      displayedSetNumber.value = completedSets + 1;
    }
  }

  // Restore scores
  player1Score.value = state.player1;
  player2Score.value = state.player2;

  // Restore set wins - this will update matchOver computed property
  // and enable/disable chips accordingly
  p1SetWins.value = [...(state.p1SetWins || [])]; // Copy array
  p2SetWins.value = [...(state.p2SetWins || [])]; // Copy array

  // Restore warning states
  p1ShowWarning.value = state.p1ShowWarning || false;
  p2ShowWarning.value = state.p2ShowWarning || false;

  // Restore match history
  matchHistory.value = [...(state.matchHistory || [])]; // Copy array

  // Restore current game number
  currentGameNumber.value = state.currentGameNumber || 1;
};

// Check if main scores are at 0 (initial state)
const isAtInitialState = computed(() => {
  return player1Score.value === 0 && player2Score.value === 0;
});

// Check if game has ended (either player reached/exceeded maxPoints)
const gameEnded = computed(() => {
  if (maxPoints.value === null) {
    return false; // No limit - game never ends
  }
  return (
    player1Score.value >= maxPoints.value ||
    player2Score.value >= maxPoints.value
  );
});

// Check if match is over (one player has won enough sets)
const matchOver = computed(() => {
  if (bestOf.value === null) {
    return false; // No best-of set, match never ends
  }
  const setsNeeded = Math.floor(bestOf.value / 2) + 1;
  return (
    p1SetWins.value.filter((won) => won).length >= setsNeeded ||
    p2SetWins.value.filter((won) => won).length >= setsNeeded
  );
});

// Determine the winner when match is over (with sets) or game ends (without sets)
const matchWinner = computed(() => {
  // If match is over (with sets), determine winner from set wins
  if (matchOver.value && bestOf.value !== null) {
    const setsNeeded = Math.floor(bestOf.value / 2) + 1;
    const p1Wins = p1SetWins.value.filter((won) => won).length;
    const p2Wins = p2SetWins.value.filter((won) => won).length;
    if (p1Wins >= setsNeeded) {
      return "p1";
    } else if (p2Wins >= setsNeeded) {
      return "p2";
    }
  }
  // If game ended without sets configured, determine winner from scores
  if (gameEnded.value && bestOf.value === null) {
    if (player1Score.value >= (maxPoints.value || 0)) {
      return "p1";
    } else if (player2Score.value >= (maxPoints.value || 0)) {
      return "p2";
    }
  }
  return null;
});

// Winner display text for PlayerName component
const winnerDisplayText = computed(() => {
  if (!matchWinner.value) {
    return "";
  }
  const winnerName = getPlayerDisplayNameFull(matchWinner.value);
  return `${winnerName} Wins`;
});

// Winner name for GameResults card
const winnerNameForResults = computed(() => {
  if (!matchWinner.value) {
    return "Player";
  }
  return getPlayerDisplayNameFull(matchWinner.value);
});

// Summary data for GameResults / GameSummary
// Counts ALL scoring events for the winning player by win condition
const gameSummaryItemsForResults = computed(() => {
  const isX = generation.value === "x";
  const isBurst = generation.value === "burst";
  const isMetalOrPlastics =
    generation.value === "mfb-zero-g" || generation.value === "plastics-hms";

  let xtr = 0;
  let bst = 0;
  let ovr = 0;
  let spf = 0;

  if (matchWinner.value) {
    const winnerKey = matchWinner.value;

    matchHistory.value.forEach((item) => {
      // Skip dividers (they don't have player/chipLabel)
      if (item.isGameDivider) return;

      // Only consider entries belonging to the match winner
      // This includes both regular scoring entries and game win entries
      if (item.player !== winnerKey) return;

      const label = item.chipLabel;

      // Skip Own Finish and Penalty entries (they're not win conditions for the winner)
      if (label === "Own" || label === "Penalty" || label === "Warning") return;

      if (isX) {
        if (label === "Xtreme") xtr++;
        else if (label === "Burst") bst++;
        else if (label === "Over") ovr++;
        else if (label === "Spin") spf++;
      } else if (isBurst) {
        if (label === "Burst") bst++;
        else if (label === "Over") ovr++;
        else if (label === "Spin") spf++;
      } else if (isMetalOrPlastics) {
        if (label === "Over") ovr++;
        else if (label === "Spin") spf++;
      }
    });
  }

  if (isX) {
    return [
      { id: "xtreme", label: "XTR", value: xtr },
      { id: "burst", label: "BST", value: bst },
      { id: "over", label: "OVR", value: ovr },
      { id: "spin", label: "SPF", value: spf },
    ];
  }

  if (isBurst) {
    return [
      { id: "burst", label: "BST", value: bst },
      { id: "over", label: "OVR", value: ovr },
      { id: "spin", label: "SPF", value: spf },
    ];
  }

  if (isMetalOrPlastics) {
    return [
      { id: "over", label: "OVR", value: ovr },
      { id: "spin", label: "SPF", value: spf },
    ];
  }

  return [];
});

// Opponent OWF / PEN counts for X format
const opponentOwnFinishCount = computed(() => {
  if (generation.value !== "x" || !matchWinner.value) return 0;
  const opponentKey = matchWinner.value === "p1" ? "p2" : "p1";
  let count = 0;
  matchHistory.value.forEach((item) => {
    if (item.player === opponentKey && item.chipLabel === "Own") {
      count++;
    }
  });
  return count;
});

const opponentPenaltyCount = computed(() => {
  if (generation.value !== "x" || !matchWinner.value) return 0;
  const opponentKey = matchWinner.value === "p1" ? "p2" : "p1";
  let count = 0;
  matchHistory.value.forEach((item) => {
    if (item.player === opponentKey && item.chipLabel === "Penalty") {
      count++;
    }
  });
  return count;
});

// Calculate filled stars for each player
const p1FilledStars = computed(() => {
  if (bestOf.value === null) return [];
  const filled = [];
  for (let i = 0; i < bestOf.value; i++) {
    filled.push(p1SetWins.value[i] === true);
  }
  return filled;
});

const p2FilledStars = computed(() => {
  if (bestOf.value === null) return [];
  const filled = [];
  for (let i = 0; i < bestOf.value; i++) {
    filled.push(p2SetWins.value[i] === true);
  }
  return filled;
});

// Track if we need to reset scores after game end (allows undo to work first)
// pendingGameReset is now from useGameState()
let gameResetTimeout = null;

// Watch for game end and handle set win + score reset
watch(gameEnded, async (ended) => {
  if (ended && !pendingGameReset.value) {
    // The game-ending scoring action is already saved in history (from handlePlayerXScoreIncrease)
    // Example: History has [..., {2-0, no set wins}, {4-0, no set wins}]

    // Determine winner
    const p1Won = player1Score.value >= maxPoints.value;
    const p2Won = player2Score.value >= maxPoints.value;

    // Check if sets are selected (bestOf is not null)
    const hasSets = bestOf.value !== null;

    // Record set win (in order) - only if sets are selected
    if (hasSets) {
      if (p1Won) {
        p1SetWins.value.push(true);
        p2SetWins.value.push(false);
      } else if (p2Won) {
        p1SetWins.value.push(false);
        p2SetWins.value.push(true);
      }
    }

    // Wait for Vue to update (to recalculate matchOver)
    await nextTick();

    // Check if match is now over (after recording this set win)
    const isMatchOver = matchOver.value;

    // Add match history entry for game win (always, whether match is over or continues)
    const winner = p1Won ? "p1" : "p2";
    const loser = p1Won ? "p2" : "p1";
    // Use the actual chip that won the game, or fall back to primary win condition
    const actualWinningChip = winningChipLabel.value
      ? getChipTypeForHistory(winningChipLabel.value)
      : getPrimaryWinCondition();
    const winConditionLabel = actualWinningChip;
    // Reset the winning chip label for next game
    winningChipLabel.value = null;
    // Calculate set wins count for the winning player
    const winnerSetWins = p1Won
      ? p1SetWins.value.filter((won) => won).length
      : p2SetWins.value.filter((won) => won).length;

    // Check if the game ended due to a penalty (check if the most recent entry was a penalty)
    // Only count as penalty win if:
    // 1. There's a winning chip label tracked (meaning a win condition chip was used), OR
    // 2. The most recent entry is a penalty that directly caused the win (no win condition chip was used)
    // If winningChipLabel exists, it means a win condition chip ended the game, so it's NOT a penalty win
    const mostRecentEntry = matchHistory.value[0];
    const isPenaltyWin =
      !winningChipLabel.value && // No win condition chip was used
      mostRecentEntry &&
      mostRecentEntry.isPenalty === true &&
      !mostRecentEntry.isGameWin && // Not already a game win entry
      ((p1Won && mostRecentEntry.player === "p2") ||
        (p2Won && mostRecentEntry.player === "p1"));

    // If game ended due to penalty, remove the penalty entry and create a combined entry
    if (isPenaltyWin) {
      // Get the chip label from the penalty entry (Penalty or Own)
      const penaltyChipLabel = mostRecentEntry.chipLabel || "Penalty";

      // Remove the penalty entry that caused the win
      matchHistory.value.shift();

      // Create a single entry showing the penalty and the win
      // The player is the one who received the penalty (loser), but the winner is shown in the win message
      matchHistory.value.unshift({
        player: loser, // The player who got the penalty
        score1: p1Won ? player2Score.value : player1Score.value, // Loser's score first
        score2: p1Won ? player1Score.value : player2Score.value, // Winner's score second
        chipLabel: penaltyChipLabel, // Use the penalty/own chip label instead of win condition
        isGameWin: true,
        setWins: hasSets ? winnerSetWins : 0,
        isPenaltyWin: true,
        winner: winner, // Store the actual winner for display
      });
    } else {
      // Normal win condition - create game win entry with the actual win condition chip
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
      // Match is over - add game divider at the top showing the final game and winner
      const winnerName = winner === "p1" ? "Player 1" : "Player 2";
      matchHistory.value.unshift({
        isGameDivider: true,
        gameNumber: currentGameNumber.value,
        isMatchConclusion: true,
        winner: winner,
        winnerName: winnerName,
      });
      // Match is over - save state with final scores and set win, don't reset scores
      saveState();
      // Show Game Results overlay when the match concludes (with sets)
      showGameResultsOverlay.value = true;
    } else if (hasSets) {
      // Match continues with sets - add game win entry was already added above
      // Reset scores after delay with shrink animation
      pendingGameReset.value = true;
      // Match continues with sets - reset scores after delay with shrink animation
      pendingGameReset.value = true;

      // Small delay to allow user to see the completed game state and use undo
      if (gameResetTimeout) clearTimeout(gameResetTimeout);
      gameResetTimeout = setTimeout(() => {
        // Trigger shrink animation (numbers shrink to 50%)
        isScoreShrinking.value = true;

        // Wait for shrink animation to complete (600ms), then reset scores and pop back
        setTimeout(() => {
          // Reset scores for next game
          player1Score.value = 0;
          player2Score.value = 0;
          pendingGameReset.value = false;
          winningChipLabel.value = null; // Reset winning chip label for new game
          // Match history persists across sets - don't clear it

          // Add game divider 12px above the last win (which is at index 0)
          // Use current game number (this is the game that just ended)
          matchHistory.value.unshift({
            isGameDivider: true,
            gameNumber: currentGameNumber.value,
          });
          // Increment game number for the next set
          currentGameNumber.value++;

          // Update set indicator immediately when scores reset
          displayedSetNumber.value = currentSetNumber.value;

          // Remove shrink, trigger pop-back with fade-in
          isScoreShrinking.value = false;
          isScoreFadingIn.value = true;

          // Wait for fade-in animation to complete before removing fade-in class
          setTimeout(() => {
            isScoreFadingIn.value = false;
          }, 600); // Match animation duration (600ms)

          // Save state with reset scores and set win
          saveState();
        }, 600); // Match shrink animation duration (600ms)
      }, 500); // Half second delay to show completed state
    } else {
      // No sets selected - game win entry was already added above
      // Just save state, don't reset scores or animate
      saveState();
      // Show Game Results overlay when a game ends without sets
      showGameResultsOverlay.value = true;
    }
  }
});

// Handle score increase - max points is the target to win
// Once a player reaches or exceeds the target, the game ends and no further increases are allowed
// For example, in "first to 5", a player can get 6 points from 3 OVRs (+2 each), ending the game
const handlePlayer1ScoreIncrease = (points, chipLabel) => {
  let scoreChanged = false;
  let gameWillEnd = false;

  // If there's a max points limit and player hasn't reached it yet
  if (maxPoints.value !== null) {
    // Only allow increase if current score is below the target (game hasn't ended)
    if (player1Score.value < maxPoints.value) {
      // Check if this will end the game
      gameWillEnd = player1Score.value + points >= maxPoints.value;

      player1Score.value += points;
      scoreChanged = true;
      // After increase, if they reached/exceeded target, game ends (no further increases possible)
    }
  } else {
    // No limit - always allow increase
    player1Score.value += points;
    scoreChanged = true;
  }

  // Save state after change if score actually changed
  // If this action ends the game, save BEFORE set win is recorded (so undo can revert this action)
  if (scoreChanged) {
    // Track the chip that ended the game
    if (chipLabel && gameWillEnd) {
      winningChipLabel.value = chipLabel;
    }
    // Add to match history if score changed and chip label provided
    // BUT don't add if this action ends the game - the game win entry will be added instead
    if (chipLabel && !gameWillEnd) {
      // Determine which chip to show based on generation and chip label
      const chipType = getChipTypeForHistory(chipLabel);
      // Calculate set wins count for player 1
      const p1SetWinsCount =
        bestOf.value !== null ? p1SetWins.value.filter((won) => won).length : 0;
      matchHistory.value.unshift({
        player: "p1",
        score1: player1Score.value,
        score2: player2Score.value,
        chipLabel: chipType,
        setWins: p1SetWinsCount,
      });
    }
    saveState();
  }
};

const handlePlayer2ScoreIncrease = (points, chipLabel) => {
  let scoreChanged = false;
  let gameWillEnd = false;

  // If there's a max points limit and player hasn't reached it yet
  if (maxPoints.value !== null) {
    // Only allow increase if current score is below the target (game hasn't ended)
    if (player2Score.value < maxPoints.value) {
      // Check if this will end the game
      gameWillEnd = player2Score.value + points >= maxPoints.value;

      player2Score.value += points;
      scoreChanged = true;
      // After increase, if they reached/exceeded target, game ends (no further increases possible)
    }
  } else {
    // No limit - always allow increase
    player2Score.value += points;
    scoreChanged = true;
  }

  // Save state after change if score actually changed
  // If this action ends the game, save BEFORE set win is recorded (so undo can revert this action)
  if (scoreChanged) {
    // Track the chip that ended the game
    if (chipLabel && gameWillEnd) {
      winningChipLabel.value = chipLabel;
    }
    // Add to match history if score changed and chip label provided
    // BUT don't add if this action ends the game - the game win entry will be added instead
    if (chipLabel && !gameWillEnd) {
      // Determine which chip to show based on generation and chip label
      const chipType = getChipTypeForHistory(chipLabel);
      // Calculate set wins count for player 2
      const p2SetWinsCount =
        bestOf.value !== null ? p2SetWins.value.filter((won) => won).length : 0;
      matchHistory.value.unshift({
        player: "p2",
        score1: player2Score.value,
        score2: player1Score.value,
        chipLabel: chipType,
        setWins: p2SetWinsCount,
      });
    }
    saveState();
  }
};

// Handle Own Finish from Player 1 - give +1 to Player 2
const handlePlayer1OwnFinish = () => {
  let scoreChanged = false;
  if (maxPoints.value !== null) {
    if (player2Score.value < maxPoints.value) {
      player2Score.value += 1;
      scoreChanged = true;
    }
  } else {
    player2Score.value += 1;
    scoreChanged = true;
  }
  // Add to match history when own finish is issued
  if (scoreChanged) {
    const p1SetWinsCount =
      bestOf.value !== null ? p1SetWins.value.filter((won) => won).length : 0;
    matchHistory.value.unshift({
      player: "p1",
      score1: player1Score.value,
      score2: player2Score.value,
      chipLabel: "Own",
      isPenalty: true,
      setWins: p1SetWinsCount,
    });
    saveState();
  }
};

// Handle Own Finish from Player 2 - give +1 to Player 1
const handlePlayer2OwnFinish = () => {
  let scoreChanged = false;
  if (maxPoints.value !== null) {
    if (player1Score.value < maxPoints.value) {
      player1Score.value += 1;
      scoreChanged = true;
    }
  } else {
    player1Score.value += 1;
    scoreChanged = true;
  }
  // Add to match history when own finish is issued
  if (scoreChanged) {
    const p2SetWinsCount =
      bestOf.value !== null ? p2SetWins.value.filter((won) => won).length : 0;
    matchHistory.value.unshift({
      player: "p2",
      score1: player2Score.value,
      score2: player1Score.value,
      chipLabel: "Own",
      isPenalty: true,
      setWins: p2SetWinsCount,
    });
    saveState();
  }
};

// Handle penalty from Player 1 - give point to Player 2 (opposing player)
const handlePlayer1Penalty = () => {
  let scoreChanged = false;

  // Check if game hasn't ended and not at max points limit
  if (maxPoints.value !== null) {
    // Only allow increase if current score is below the target (game hasn't ended)
    if (player2Score.value < maxPoints.value) {
      player2Score.value += 1; // Award 1 point to opposing player
      scoreChanged = true;
    }
  } else {
    // No limit - always allow increase
    player2Score.value += 1;
    scoreChanged = true;
  }

  // Add to match history when penalty is issued
  if (scoreChanged) {
    const p1SetWinsCount =
      bestOf.value !== null ? p1SetWins.value.filter((won) => won).length : 0;
    matchHistory.value.unshift({
      player: "p1",
      score1: player1Score.value,
      score2: player2Score.value,
      chipLabel: "Penalty",
      isPenalty: true,
      setWins: p1SetWinsCount,
    });
  }

  // Reset warning state after penalty is issued
  p1ShowWarning.value = false;

  // Save state after penalty point is awarded (integrates with undo/redo)
  if (scoreChanged) {
    saveState();
  }
};

// Handle penalty from Player 2 - give point to Player 1 (opposing player)
const handlePlayer2Penalty = () => {
  let scoreChanged = false;

  // Check if game hasn't ended and not at max points limit
  if (maxPoints.value !== null) {
    // Only allow increase if current score is below the target (game hasn't ended)
    if (player1Score.value < maxPoints.value) {
      player1Score.value += 1; // Award 1 point to opposing player
      scoreChanged = true;
    }
  } else {
    // No limit - always allow increase
    player1Score.value += 1;
    scoreChanged = true;
  }

  // Add to match history when penalty is issued
  if (scoreChanged) {
    const p2SetWinsCount =
      bestOf.value !== null ? p2SetWins.value.filter((won) => won).length : 0;
    matchHistory.value.unshift({
      player: "p2",
      score1: player2Score.value,
      score2: player1Score.value,
      chipLabel: "Penalty",
      isPenalty: true,
      setWins: p2SetWinsCount,
    });
  }

  // Reset warning state after penalty is issued
  p2ShowWarning.value = false;

  // Save state after penalty point is awarded (integrates with undo/redo)
  if (scoreChanged) {
    saveState();
  }
};

// Handle warning toggle for Player 1 (ERR -> PEN state change)
const handlePlayer1WarningToggle = () => {
  p1ShowWarning.value = !p1ShowWarning.value;
  // Add to match history when warning is issued (ERR clicked)
  if (p1ShowWarning.value) {
    const p1SetWinsCount =
      bestOf.value !== null ? p1SetWins.value.filter((won) => won).length : 0;
    matchHistory.value.unshift({
      player: "p1",
      score1: player1Score.value,
      score2: player2Score.value,
      chipLabel: "Warning",
      isWarning: true,
      setWins: p1SetWinsCount,
    });
  }
  // Save state to include in undo/redo history
  saveState();
};

// Handle warning toggle for Player 2 (ERR -> PEN state change)
const handlePlayer2WarningToggle = () => {
  p2ShowWarning.value = !p2ShowWarning.value;
  // Add to match history when warning is issued (ERR clicked)
  if (p2ShowWarning.value) {
    const p2SetWinsCount =
      bestOf.value !== null ? p2SetWins.value.filter((won) => won).length : 0;
    matchHistory.value.unshift({
      player: "p2",
      score1: player2Score.value,
      score2: player1Score.value,
      chipLabel: "Warning",
      isWarning: true,
      setWins: p2SetWinsCount,
    });
  }
  // Save state to include in undo/redo history
  saveState();
};

// Game Results overlay handlers
const handleGameResultsClose = () => {
  showGameResultsOverlay.value = false;
};

const handleGameResultsNewGame = () => {
  scoreboardStore.reset();
  showGameResultsOverlay.value = false;
};

const handleGameResultsViewHistory = () => {
  showGameResultsOverlay.value = false;
  gameResultsOverlayHasBeenShown.value = false;
  openMatchHistoryModal();
};

// Undo functionality
const handleUndo = () => {
  if (historyIndex.value > 0) {
    // Cancel pending game reset if undoing
    if (pendingGameReset.value && gameResetTimeout) {
      clearTimeout(gameResetTimeout);
      gameResetTimeout = null;
      pendingGameReset.value = false;
    }

    const currentState = history.value[historyIndex.value];
    const previousState =
      historyIndex.value > 0 ? history.value[historyIndex.value - 1] : null;

    // Check if current state is a reset state (0-0 scores after a game ended)
    const isResetState =
      currentState.player1 === 0 &&
      currentState.player2 === 0 &&
      (currentState.p1SetWins?.length > 0 ||
        currentState.p2SetWins?.length > 0);

    // Check if current state is a match conclusion state
    // This is when current state has the same scores as previous state but different set wins
    // (which happens when match concludes - set win recorded but scores not reset)
    const isMatchConclusionState =
      previousState &&
      currentState.player1 === previousState.player1 &&
      currentState.player2 === previousState.player2 &&
      ((currentState.p1SetWins?.length || 0) !==
        (previousState.p1SetWins?.length || 0) ||
        (currentState.p2SetWins?.length || 0) !==
          (previousState.p2SetWins?.length || 0));

    // Check if current state is a duplicate game-end state (same scores as previous, no set wins change)
    // This happens when a single game ends (no sets) - watch handler saves state again with same scores
    // History: [..., before-win (2-0), game-ending (4-0), duplicate (4-0)]
    const isDuplicateGameEndState =
      previousState &&
      currentState.player1 === previousState.player1 &&
      currentState.player2 === previousState.player2 &&
      (currentState.p1SetWins?.length || 0) ===
        (previousState.p1SetWins?.length || 0) &&
      (currentState.p2SetWins?.length || 0) ===
        (previousState.p2SetWins?.length || 0);

    if (isResetState && historyIndex.value > 1) {
      // When undoing from reset state, skip the game-ending state (4-0) and go to before it (2-0)
      // This allows undo to revert the last scoring action between games
      historyIndex.value -= 2; // Skip both reset state and game-ending state
    } else if (isMatchConclusionState && historyIndex.value > 1) {
      // When undoing from match conclusion state, skip back to before the game-ending action
      // This allows undo to revert the last scoring action that concluded the match
      // The history has: [..., game-ending action (4-2, old set wins), match conclusion (4-2, final set wins)]
      // We want to go back to before the game-ending action (so scores change, not just set wins)
      historyIndex.value -= 2; // Skip both match conclusion state and game-ending state
    } else if (isDuplicateGameEndState && historyIndex.value > 1) {
      // When undoing from duplicate game-end state (single game, no sets), skip back to before the game-ending action
      // History: [..., before-win (2-0), game-ending (4-0), duplicate (4-0)]
      // We want to go back to before-win (2-0) so scores actually change
      historyIndex.value -= 2; // Skip both duplicate state and game-ending state
    } else {
      historyIndex.value--;
    }

    restoreState(history.value[historyIndex.value]);

    // If we undid past a set win, we need to remove it from the set wins arrays
    // The restoreState already handles this since set wins are part of history
  }
};

// Redo functionality
const handleRedo = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++;
    restoreState(history.value[historyIndex.value]);
  }
};

// Disable undo when at initial state
const undoDisabled = computed(() => {
  return historyIndex.value === 0;
});

// Disable redo when at the end of history
const redoDisabled = computed(() => {
  return historyIndex.value >= history.value.length - 1;
});
</script>

<template>
  <div class="viewport-container-landscape">
    <div class="game-screen-landscape">
      <!-- Current Set Indicator (centered with player names) -->
      <PlayerName
        v-if="bestOf !== null && !matchOver"
        :name="currentSetText"
        :player="null"
        :best-of="null"
        class="set-indicator-landscape"
      />

      <!-- Winner Message (when match concludes or game ends without sets) -->
      <PlayerName
        v-if="
          (matchOver || (gameEnded && bestOf === null)) && winnerDisplayText
        "
        :name="winnerDisplayText"
        :player="null"
        :best-of="null"
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
          @history="openMatchHistoryModal"
          @undo="handleUndo"
          @redo="handleRedo"
          @settings="openSettingsModal"
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
                    :selected-value="bestOf ? bestOf.toString() : null"
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
                  size="small"
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
    100vw - 40px
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
  padding-top: max(20px, env(safe-area-inset-top, 0px));

  /* Bottom: Home indicator area (minimum 34px for home indicator, plus any safe area inset) */
  padding-bottom: max(34px, env(safe-area-inset-bottom, 0px));

  /* Left/Right: 20px padding + Safe areas for notches (if any) */
  padding-left: calc(20px + env(safe-area-inset-left, 0px));
  padding-right: calc(20px + env(safe-area-inset-right, 0px));

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
