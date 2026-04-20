<script setup lang="ts">
import { useScoreboardStore } from "~/stores/scoreboardStore";
import { X } from "@lucide/vue";
import {
  getGenerationLabel,
  getPointsToWinLabel,
  getSetsLabel,
  GENERATION_ITEMS,
  SETS_ITEMS,
  getPointsToWinItems,
  DEFAULT_XTR_POINTS,
  DEFAULT_OVR_POINTS,
  DEFAULT_BST_POINTS,
  DEFAULT_SPF_POINTS,
  defaultOvrPointsForGeneration,
} from "~/lib/gameUtils";

interface DropdownItem {
  label: string;
  value: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    isOpen?: boolean;
    isClosing?: boolean;
    gameHasStarted: boolean;
    isLandscape?: boolean;
  }>(),
  {
    isOpen: false,
    isClosing: false,
    isLandscape: false,
  },
);

const emit = defineEmits<{
  close: [];
  save: [];
  resetGame: [];
}>();

const scoreboardStore = useScoreboardStore();

const localPlayer1Name = ref("Player 1");
const localPlayer2Name = ref("Player 2");
const localGeneration = ref<GenerationOption>("x");
const localMatchType = ref<MatchTypeOption>("4pts");
const localCustomPoints = ref(10);
const localBestOf = ref<BestOfOption>(undefined);
const localOwnFinishEnabled = ref(false);
const localXtrPoints = ref(DEFAULT_XTR_POINTS);
const localOvrPoints = ref(DEFAULT_OVR_POINTS);
const localBstPoints = ref(DEFAULT_BST_POINTS);
const localSpfPoints = ref(DEFAULT_SPF_POINTS);

function syncLocalValuesFromStore() {
  localPlayer1Name.value = scoreboardStore.player1NameSetting || "Player 1";
  localPlayer2Name.value = scoreboardStore.player2NameSetting || "Player 2";
  localGeneration.value = scoreboardStore.generation;
  localMatchType.value = scoreboardStore.matchType;
  localCustomPoints.value = scoreboardStore.customPoints;
  localBestOf.value = scoreboardStore.bestOf;
  localOwnFinishEnabled.value = scoreboardStore.ownFinishEnabled;
  localXtrPoints.value = scoreboardStore.xtrPoints;
  localOvrPoints.value = scoreboardStore.ovrPoints;
  localBstPoints.value = scoreboardStore.bstPoints;
  localSpfPoints.value = scoreboardStore.spfPoints;
}

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      syncLocalValuesFromStore();
    }
  },
  { immediate: true },
);

const matchTypeParam = computed(() => localMatchType.value);

const openDropdown = ref<"generation" | "pointsToWin" | "sets" | null>(null);

const beybladeGenerationLabel = computed(() =>
  getGenerationLabel(localGeneration.value),
);
const pointsToWinLabel = computed(() =>
  getPointsToWinLabel(localMatchType.value, localCustomPoints.value),
);
const setsLabel = computed(() => getSetsLabel(localBestOf.value));
const ownFinishOptionLabel = computed(() =>
  localOwnFinishEnabled.value ? "On" : "Off",
);
const generationItems = GENERATION_ITEMS as DropdownItem[];
const pointsToWinItems = computed(() =>
  getPointsToWinItems(localGeneration.value),
) as unknown as DropdownItem[];
const setsItems = SETS_ITEMS as DropdownItem[];

const hasChanges = computed(() => {
  return (
    localPlayer1Name.value !==
      (scoreboardStore.player1NameSetting || "Player 1") ||
    localPlayer2Name.value !==
      (scoreboardStore.player2NameSetting || "Player 2") ||
    localGeneration.value !== scoreboardStore.generation ||
    localMatchType.value !== scoreboardStore.matchType ||
    localCustomPoints.value !== scoreboardStore.customPoints ||
    localBestOf.value !== scoreboardStore.bestOf ||
    localOwnFinishEnabled.value !== scoreboardStore.ownFinishEnabled ||
    localXtrPoints.value !== scoreboardStore.xtrPoints ||
    localOvrPoints.value !== scoreboardStore.ovrPoints ||
    localBstPoints.value !== scoreboardStore.bstPoints ||
    localSpfPoints.value !== scoreboardStore.spfPoints
  );
});

function toggleDropdown(dropdown: "generation" | "pointsToWin" | "sets") {
  openDropdown.value = openDropdown.value === dropdown ? null : dropdown;
}

function handleCustomPointsInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = Number.parseInt(target.value, 10);

  if (!Number.isNaN(value) && value >= 1) {
    localCustomPoints.value = value;
  }
}

function defaultMatchTypeForGeneration(
  value: GenerationOption,
): MatchTypeOption {
  return value === "x" ? "4pts" : "3pts";
}

function handleGenerationSelect(value: GenerationOption) {
  localGeneration.value = value;
  localMatchType.value = defaultMatchTypeForGeneration(value);
  localOwnFinishEnabled.value =
    value === "x" ? localOwnFinishEnabled.value : false;
  localXtrPoints.value = DEFAULT_XTR_POINTS;
  localOvrPoints.value = defaultOvrPointsForGeneration(value);
  localBstPoints.value = DEFAULT_BST_POINTS;
  localSpfPoints.value = DEFAULT_SPF_POINTS;
}

function handleSave() {
  const gameSettingsChanged =
    localGeneration.value !== scoreboardStore.generation ||
    localMatchType.value !== scoreboardStore.matchType ||
    localCustomPoints.value !== scoreboardStore.customPoints ||
    localBestOf.value !== scoreboardStore.bestOf ||
    localOwnFinishEnabled.value !== scoreboardStore.ownFinishEnabled ||
    localXtrPoints.value !== scoreboardStore.xtrPoints ||
    localOvrPoints.value !== scoreboardStore.ovrPoints ||
    localBstPoints.value !== scoreboardStore.bstPoints ||
    localSpfPoints.value !== scoreboardStore.spfPoints;

  scoreboardStore.player1NameSetting = localPlayer1Name.value || "Player 1";
  scoreboardStore.player2NameSetting = localPlayer2Name.value || "Player 2";
  scoreboardStore.generation = localGeneration.value;
  scoreboardStore.matchType = localMatchType.value;
  scoreboardStore.customPoints = localCustomPoints.value;
  scoreboardStore.bestOf = localBestOf.value;
  scoreboardStore.ownFinishEnabled = localOwnFinishEnabled.value;
  scoreboardStore.setXtrPoints(localXtrPoints.value);
  scoreboardStore.setOvrPoints(localOvrPoints.value);
  scoreboardStore.setBstPoints(localBstPoints.value);
  scoreboardStore.setSpfPoints(localSpfPoints.value);
  openDropdown.value = null;

  if (gameSettingsChanged && props.gameHasStarted) {
    scoreboardStore.reset();
  }
  emit("save");
}

function handleResetGame() {
  scoreboardStore.player1NameSetting = "Player 1";
  scoreboardStore.player2NameSetting = "Player 2";
  scoreboardStore.reset({ resetConfig: true });
  openDropdown.value = null;
  emit("resetGame");
}

function handleClose() {
  openDropdown.value = null;
  emit("close");
}
</script>

<template>
  <div
    v-if="isOpen || isClosing"
    class="modal-backdrop"
    :class="{ closing: props.isClosing }"
    @click="handleClose"
  >
    <div
      class="modal-content"
      :class="{
        closing: props.isClosing,
        'modal-content-landscape': isLandscape,
      }"
      @click.stop
    >
      <h1
        class="absolute top-5 right-11 left-5 m-0 box-border w-auto p-0 font-titillium text-lg leading-normal font-bold text-[#334155]"
      >
        Settings
      </h1>

      <button
        class="absolute top-6 right-5 z-10 box-border flex h-6 w-6 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
        @click="handleClose"
      >
        <X :size="24" color="#64748b" :stroke-width="2" />
      </button>

      <p
        class="absolute top-[calc(20px+1.6875rem+6px)] right-5 left-5 m-0 box-border w-auto p-0 font-titillium text-base leading-normal font-normal text-slate-500"
      >
        Set your match preferences.
      </p>

      <div
        class="absolute top-[calc(20px+1.6875rem+6px+1.5rem+24px)] right-5 bottom-0 left-5 box-border flex w-auto flex-col gap-0 overflow-y-auto pb-26.5"
        :class="{ 'pb-28': props.isLandscape }"
      >
        <div v-if="gameHasStarted" class="mt-0 mb-6 w-full">
          <Alert />
        </div>

        <div class="w-full first:mt-0">
          <TextDropdownField
            :model-value="localPlayer1Name"
            title="Player 1 Name"
            :show-chevron="false"
            :max-length="15"
            @update:model-value="localPlayer1Name = $event"
          />
        </div>

        <div class="mt-4 w-full">
          <TextDropdownField
            :model-value="localPlayer2Name"
            title="Player 2 Name"
            :show-chevron="false"
            :max-length="15"
            @update:model-value="localPlayer2Name = $event"
          />
        </div>

        <div class="mt-4 w-full">
          <div class="relative">
            <TextDropdownField
              title="Beyblade Generation"
              variant="dropdown"
              :show-chevron="true"
              :model-value="beybladeGenerationLabel"
              @toggle="toggleDropdown('generation')"
            />
            <div
              v-if="openDropdown === 'generation'"
              class="absolute top-full left-0 z-10 mt-2 w-full"
            >
              <DropdownMenu
                :items="generationItems"
                :selected-value="localGeneration"
                @select="(value) => handleGenerationSelect(value)"
              />
            </div>
          </div>
        </div>

        <div class="mt-4 w-full">
          <div class="relative">
            <TextDropdownField
              title="Points to Win"
              variant="dropdown"
              :show-chevron="true"
              :model-value="pointsToWinLabel"
              @toggle="toggleDropdown('pointsToWin')"
            />
            <div
              v-if="openDropdown === 'pointsToWin'"
              class="absolute left-0 z-10 w-full"
              style="
                top: calc(0.875rem * 1.5 + 8px);
                transform: translateY(calc(-100% - 8px));
              "
            >
              <DropdownMenu
                :items="pointsToWinItems"
                :selected-value="matchTypeParam"
                @select="localMatchType = $event"
              />
            </div>
          </div>
        </div>

        <div v-if="matchTypeParam === 'custom'" class="mt-4 w-full">
          <div class="flex w-full flex-col">
            <label
              for="custom-points-input"
              class="m-0 box-border p-0 font-titillium text-sm font-semibold text-slate-500"
              >Custom Points</label
            >
            <div
              class="mt-2 flex items-center justify-between rounded-[10px] border border-slate-300 bg-white px-3 py-2 shadow-[0_0_4px_rgba(15,23,42,0.05)]"
            >
              <input
                id="custom-points-input"
                type="number"
                min="1"
                :value="localCustomPoints"
                class="box-border w-full border-0 bg-transparent p-0 font-titillium text-base font-normal text-slate-600 outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                @input="handleCustomPointsInput"
              />
            </div>
          </div>
        </div>

        <div v-if="matchTypeParam !== 'nolimit'" class="mt-4 w-full">
          <div class="relative">
            <TextDropdownField
              title="Sets"
              variant="dropdown"
              :show-chevron="true"
              :model-value="setsLabel"
              @toggle="toggleDropdown('sets')"
            />
            <div
              v-if="openDropdown === 'sets'"
              class="absolute left-0 z-10 w-full"
              style="
                top: calc(0.875rem * 1.5 + 8px);
                transform: translateY(calc(-100% - 8px));
              "
            >
              <DropdownMenu
                :items="setsItems"
                :selected-value="
                  localBestOf ? localBestOf.toString() : undefined
                "
                @select="
                  localBestOf =
                    $event === '3' ? 3 : $event === '5' ? 5 : undefined
                "
              />
            </div>
          </div>
        </div>

        <div v-if="localGeneration === 'x'" class="mt-4 w-full">
          <div
            class="m-0 box-border p-0 font-titillium text-sm leading-normal font-semibold text-slate-500"
          >
            Own Finish
          </div>
          <div class="mt-2 flex items-center">
            <ToggleButton
              size="default"
              :initial-state="localOwnFinishEnabled"
              @toggle="localOwnFinishEnabled = $event"
            >
              {{ ownFinishOptionLabel }}
            </ToggleButton>
          </div>
        </div>

        <div class="mt-4 w-full">
          <AdvancedSettingsSection
            :generation="localGeneration"
            :xtr-points="localXtrPoints"
            :ovr-points="localOvrPoints"
            :bst-points="localBstPoints"
            :spf-points="localSpfPoints"
            @update:xtr-points="localXtrPoints = $event"
            @update:ovr-points="localOvrPoints = $event"
            @update:bst-points="localBstPoints = $event"
            @update:spf-points="localSpfPoints = $event"
            @reset="
              localXtrPoints = DEFAULT_XTR_POINTS;
              localOvrPoints = defaultOvrPointsForGeneration(localGeneration);
              localBstPoints = DEFAULT_BST_POINTS;
              localSpfPoints = DEFAULT_SPF_POINTS;
            "
          />
        </div>
      </div>

      <div
        class="absolute right-0 bottom-0 left-0 z-20 box-border w-full bg-slate-50 p-5"
        :class="
          props.isLandscape
            ? 'border-t border-slate-200'
            : 'border-t border-slate-200'
        "
      >
        <div
          class="flex w-full flex-row gap-5"
          :class="props.isLandscape ? '' : ''"
        >
          <Button
            variant="blue"
            :disabled="!hasChanges"
            class-name="flex-1 min-w-0 font-bold"
            @click="handleSave"
            >Save Changes</Button
          >
          <Button
            v-if="props.isLandscape"
            variant="secondary"
            class-name="flex-1 min-w-0 border border-[#1088c9] border-b-2 bg-transparent font-bold"
            @click="handleResetGame"
            >Reset Game</Button
          >
          <Button
            v-else
            variant="secondary"
            class-name="flex-1 min-w-0 font-bold"
            @click="handleResetGame"
            >Reset Game</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
  background: rgba(2, 6, 23, 0.6);
}

.modal-backdrop.closing {
  animation: fadeOut 0.3s ease-out;
}

.modal-content {
  position: absolute;
  top: 0;
  left: max(
    0px,
    calc(20px - env(safe-area-inset-left, 0px))
  ); /* 20px from viewport edge, never negative */
  right: 0; /* Flush with viewport edge - content handles padding */
  width: auto; /* Let left/right positioning determine width */
  max-width: calc(
    100vw - 20px
  ); /* Ensure it doesn't exceed viewport minus 20px on left side */
  height: 100%;
  background-color: white;
  z-index: 1001;
  animation: slideInFromRight 0.3s ease-out;
  will-change: transform;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0;
}

.modal-content.closing {
  animation: slideOutToRight 0.3s ease-out;
}

.modal-content-landscape {
  left: auto;
  width: 90%;
  max-width: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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
