import { ref, computed, type Ref } from "vue";
import {
  getGenerationLabel,
  getPointsToWinLabel,
  getSetsLabel,
  GENERATION_ITEMS,
  SETS_ITEMS,
  getPointsToWinItems,
} from "~/lib/gameUtils";
import type {
  GenerationOption,
  MatchTypeOption,
  BestOfOption,
} from "~/stores/scoreboardStore";

export function useMatchSettings(
  generation: Ref<GenerationOption>,
  matchType: Ref<MatchTypeOption>,
  bestOf: Ref<BestOfOption>,
  isOwnFinishEnabled: Ref<boolean>,
  setGeneration: (value: GenerationOption) => void,
  setMatchType: (value: MatchTypeOption) => void,
  setBestOf: (value: BestOfOption) => void,
  setOwnFinishEnabled: (value: boolean) => void,
) {
  // Dropdown menu state
  const openDropdown = ref<"generation" | "pointsToWin" | "sets" | null>(null);

  // Computed labels
  const beybladeGenerationLabel = computed(() =>
    getGenerationLabel(generation.value),
  );
  const pointsToWinLabel = computed(() => getPointsToWinLabel(matchType.value));
  const setsLabel = computed(() => getSetsLabel(bestOf.value));
  const ownFinishOptionLabel = computed(() =>
    isOwnFinishEnabled.value ? "On" : "Off",
  );

  // Computed items
  const pointsToWinItems = computed(() =>
    getPointsToWinItems(generation.value),
  );

  // Dropdown handlers
  function handleGenerationDropdownToggle() {
    if (openDropdown.value === "generation") {
      openDropdown.value = null;
    } else {
      openDropdown.value = "generation";
    }
  }

  function handlePointsToWinDropdownToggle() {
    if (openDropdown.value === "pointsToWin") {
      openDropdown.value = null;
    } else {
      openDropdown.value = "pointsToWin";
    }
  }

  function handleSetsDropdownToggle() {
    if (openDropdown.value === "sets") {
      openDropdown.value = null;
    } else {
      openDropdown.value = "sets";
    }
  }

  function handleGenerationSelect(value: GenerationOption) {
    setGeneration(value);
    openDropdown.value = null;
  }

  function handlePointsToWinSelect(value: MatchTypeOption) {
    setMatchType(value);
    openDropdown.value = null;
  }

  function handleSetsSelect(value: string | undefined) {
    const parsedValue: BestOfOption =
      value === "3" ? 3 : value === "5" ? 5 : undefined;
    setBestOf(parsedValue);
    openDropdown.value = null;
  }

  function handleOwnFinishToggle(state: boolean) {
    setOwnFinishEnabled(state);
  }

  function closeDropdowns() {
    openDropdown.value = null;
  }

  return {
    // State
    openDropdown,

    // Computed labels
    beybladeGenerationLabel,
    pointsToWinLabel,
    setsLabel,
    ownFinishOptionLabel,

    // Computed items
    pointsToWinItems,

    // Handlers
    handleGenerationDropdownToggle,
    handlePointsToWinDropdownToggle,
    handleSetsDropdownToggle,
    handleGenerationSelect,
    handlePointsToWinSelect,
    handleSetsSelect,
    handleOwnFinishToggle,
    closeDropdowns,

    // Constants
    GENERATION_ITEMS,
    SETS_ITEMS,
  };
}
