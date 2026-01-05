import { ref, computed, type Ref, type ComputedRef } from "vue";
import type {
  GenerationOption,
  MatchTypeOption,
  BestOfOption,
} from "~/stores/scoreboardStore";
import { DEFAULT_CUSTOM_POINTS } from "~/lib/gameUtils";

export function useMatchHistoryModal() {
  const isMatchHistoryModalOpen = ref(false);
  const isMatchHistoryModalClosing = ref(false);

  function openMatchHistoryModal() {
    isMatchHistoryModalClosing.value = false;
    isMatchHistoryModalOpen.value = true;
  }

  function closeMatchHistoryModal() {
    if (isMatchHistoryModalClosing.value) return; // Prevent multiple close calls

    isMatchHistoryModalClosing.value = true;
    // Wait for slide-out animation to complete (300ms)
    setTimeout(() => {
      isMatchHistoryModalOpen.value = false;
      isMatchHistoryModalClosing.value = false;
    }, 300);
  }

  return {
    isMatchHistoryModalOpen,
    isMatchHistoryModalClosing,
    openMatchHistoryModal,
    closeMatchHistoryModal,
  };
}

export function useSettingsModal(
  player1NameSetting: Ref<string>,
  player2NameSetting: Ref<string>,
  generation: Ref<GenerationOption>,
  matchType: Ref<MatchTypeOption>,
  customPoints: Ref<number>,
  bestOf: Ref<BestOfOption>,
  isOwnFinishEnabled: Ref<boolean>,
  storeActions: {
    setGeneration: (value: GenerationOption) => void;
    setMatchType: (value: MatchTypeOption) => void;
    setCustomPoints: (value: number) => void;
    setBestOf: (value: BestOfOption) => void;
    setOwnFinishEnabled: (value: boolean) => void;
    reset: () => void;
  },
  options?: {
    gameHasStarted?: ComputedRef<boolean>;
    closeDropdowns?: () => void;
  },
) {
  const isSettingsModalOpen = ref(false);
  const isSettingsModalClosing = ref(false);

  // Store original values when settings modal opens (for comparison and revert)
  const originalPlayer1Name = ref("Player 1");
  const originalPlayer2Name = ref("Player 2");
  const originalGeneration = ref<GenerationOption>("x");
  const originalMatchType = ref<MatchTypeOption>("4pts");
  const originalCustomPoints = ref<number>(DEFAULT_CUSTOM_POINTS);
  const originalBestOf = ref<BestOfOption>(undefined);
  const originalOwnFinish = ref(false);

  // Check if there are unsaved changes
  const hasChanges = computed(() => {
    return (
      player1NameSetting.value !== originalPlayer1Name.value ||
      player2NameSetting.value !== originalPlayer2Name.value ||
      generation.value !== originalGeneration.value ||
      matchType.value !== originalMatchType.value ||
      customPoints.value !== originalCustomPoints.value ||
      bestOf.value !== originalBestOf.value ||
      isOwnFinishEnabled.value !== originalOwnFinish.value
    );
  });

  const fallbackGameHasStarted = computed(() => false);
  const gameHasStarted = options?.gameHasStarted ?? fallbackGameHasStarted;
  const closeDropdowns = options?.closeDropdowns;

  function openSettingsModal() {
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
    originalMatchType.value = matchType.value;
    originalCustomPoints.value = customPoints.value;
    originalBestOf.value = bestOf.value;
    originalOwnFinish.value = isOwnFinishEnabled.value;
    isSettingsModalClosing.value = false;
    isSettingsModalOpen.value = true;
  }

  function closeSettingsModal() {
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
      storeActions.setGeneration(originalGeneration.value);
    }
    if (matchType.value !== originalMatchType.value) {
      storeActions.setMatchType(originalMatchType.value);
    }
    if (customPoints.value !== originalCustomPoints.value) {
      storeActions.setCustomPoints(originalCustomPoints.value);
    }
    if (bestOf.value !== originalBestOf.value) {
      storeActions.setBestOf(originalBestOf.value);
    }
    if (isOwnFinishEnabled.value !== originalOwnFinish.value) {
      storeActions.setOwnFinishEnabled(originalOwnFinish.value);
    }

    closeDropdowns?.();

    isSettingsModalClosing.value = true;

    // Wait for slide-out animation to complete (300ms)
    setTimeout(() => {
      isSettingsModalOpen.value = false;
      isSettingsModalClosing.value = false;
    }, 300);
  }

  function handleSaveChanges() {
    // Check if game settings have changed
    const gameSettingsChanged =
      generation.value !== originalGeneration.value ||
      matchType.value !== originalMatchType.value ||
      customPoints.value !== originalCustomPoints.value ||
      bestOf.value !== originalBestOf.value ||
      isOwnFinishEnabled.value !== originalOwnFinish.value;

    const gameHasStartedValue = gameHasStarted.value;

    if (gameSettingsChanged && gameHasStartedValue) {
      storeActions.reset();
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
    originalMatchType.value = matchType.value;
    originalCustomPoints.value = customPoints.value;
    originalBestOf.value = bestOf.value;
    originalOwnFinish.value = isOwnFinishEnabled.value;

    closeSettingsModal();
  }

  function handleResetGame() {
    // Reset player names to defaults
    player1NameSetting.value = "Player 1";
    player2NameSetting.value = "Player 2";

    // Update original values so they match the reset state
    originalPlayer1Name.value = "Player 1";
    originalPlayer2Name.value = "Player 2";

    // Reset game state using store
    storeActions.reset();

    closeSettingsModal();
  }

  return {
    isSettingsModalOpen,
    isSettingsModalClosing,
    hasChanges,
    gameHasStarted,
    openSettingsModal,
    closeSettingsModal,
    handleSaveChanges,
    handleResetGame,
  };
}
