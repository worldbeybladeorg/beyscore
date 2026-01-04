<script setup lang="ts">
import { ref, nextTick, watch } from "vue";
import { storeToRefs } from "pinia";
import ToggleButton from "../components/ToggleButton.vue";
import Button from "../components/Button.vue";
import { useScoreboardStore } from "~/stores/scoreboardStore";
import type {
  GenerationOption,
  MatchTypeOption,
} from "~/stores/scoreboardStore";

const scoreboardStore = useScoreboardStore();
const { generation, matchType, customPoints, bestOf, ownFinishEnabled } =
  storeToRefs(scoreboardStore);

const customPointsInputRef = ref<HTMLInputElement | null>(null);

const selectedGeneration = ref<GenerationOption | null>(generation.value);
watch(generation, (value: GenerationOption) => {
  selectedGeneration.value = value;
});

const selectedMatchType = ref<MatchTypeOption | null>(matchType.value);
watch(matchType, (value: MatchTypeOption) => {
  selectedMatchType.value = value;
});

const selectedBestOf = ref<string | undefined>(
  bestOf.value ? bestOf.value.toString() : undefined,
);
watch(bestOf, (value: number | undefined) => {
  selectedBestOf.value = value ? value.toString() : undefined;
});

const localOwnFinishEnabled = ref(ownFinishEnabled.value);
watch(ownFinishEnabled, (value: boolean) => {
  localOwnFinishEnabled.value = value;
});

const handleGenerationToggle = (value: GenerationOption, state: boolean) => {
  if (state) {
    scoreboardStore.setGeneration(value);
  } else if (selectedGeneration.value === value) {
    selectedGeneration.value = null;
    nextTick(() => {
      selectedGeneration.value = generation.value;
    });
  }
};

const handleMatchTypeToggle = (value: MatchTypeOption, state: boolean) => {
  if (state) {
    scoreboardStore.setMatchType(value);
    if (value === "custom") {
      nextTick(() => {
        customPointsInputRef.value?.focus();
        customPointsInputRef.value?.select();
      });
    }
  } else if (selectedMatchType.value === value) {
    selectedMatchType.value = null;
    nextTick(() => {
      selectedMatchType.value = matchType.value;
    });
  }
};

const handleCustomPointsInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value, 10);
  if (!isNaN(value) && value >= 1) {
    scoreboardStore.setCustomPoints(value);
  }
};

const handleCustomPointsBlur = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value, 10);
  if (isNaN(value) || value < 1) {
    // Preserve the current store value instead of hardcoding 10
    target.value = String(customPoints.value);
  }
};

const handleBestOfToggle = (value: string, state: boolean) => {
  if (state) {
    scoreboardStore.setBestOf(value ? parseInt(value, 10) : undefined);
  } else if (selectedBestOf.value === value) {
    scoreboardStore.setBestOf(undefined);
  }
};

const handleOwnFinishToggle = (state: boolean) => {
  scoreboardStore.setOwnFinishEnabled(state);
};

const handleStartGame = async () => {
  scoreboardStore.reset();
  await navigateTo("/game");
};
</script>

<template>
  <div class="viewport-container">
    <div class="game-setup-screen">
      <!-- Empty canvas - ready for game setup design -->

      <!-- BeyScore Logo -->
      <img src="/beyscore.svg" alt="BeyScore" class="logo" />

      <div class="content-stack">
        <!-- Heading -->
        <h1 class="heading-text">Select Beyblade Generation</h1>

        <!-- Generation toggle buttons -->
        <div class="toggle-buttons-container">
          <ToggleButton
            :key="`x-${selectedGeneration}`"
            size="large"
            :initial-state="selectedGeneration === 'x'"
            @toggle="(state) => handleGenerationToggle('x', state)"
          >
            X
          </ToggleButton>
          <ToggleButton
            :key="`burst-${selectedGeneration}`"
            size="large"
            :initial-state="selectedGeneration === 'burst'"
            @toggle="(state) => handleGenerationToggle('burst', state)"
          >
            Burst
          </ToggleButton>
          <ToggleButton
            :key="`metal-${selectedGeneration}`"
            size="large"
            :initial-state="selectedGeneration === 'mfb-zero-g'"
            @toggle="(state) => handleGenerationToggle('mfb-zero-g', state)"
          >
            Metal Fight/Zero-G
          </ToggleButton>
          <ToggleButton
            :key="`plastic-${selectedGeneration}`"
            size="large"
            :initial-state="selectedGeneration === 'plastics-hms'"
            @toggle="(state) => handleGenerationToggle('plastics-hms', state)"
          >
            Plastic & HMS
          </ToggleButton>
        </div>

        <!-- Match Type heading -->
        <h1 class="match-type-heading">Match Type</h1>

        <!-- Match Type toggle buttons -->
        <div class="match-type-buttons-container">
          <!-- For X format: 4, 5, 7, No Limit, Custom -->
          <template v-if="selectedGeneration === 'x'">
            <ToggleButton
              :key="`4pts-${selectedMatchType}`"
              :initial-state="selectedMatchType === '4pts'"
              @toggle="(state) => handleMatchTypeToggle('4pts', state)"
            >
              4 Pts.
            </ToggleButton>
            <ToggleButton
              :key="`5pts-${selectedMatchType}`"
              :initial-state="selectedMatchType === '5pts'"
              @toggle="(state) => handleMatchTypeToggle('5pts', state)"
            >
              5 Pts.
            </ToggleButton>
            <ToggleButton
              :key="`7pts-${selectedMatchType}`"
              :initial-state="selectedMatchType === '7pts'"
              @toggle="(state) => handleMatchTypeToggle('7pts', state)"
            >
              7 Pts.
            </ToggleButton>
            <ToggleButton
              :key="`nolimit-${selectedMatchType}`"
              :initial-state="selectedMatchType === 'nolimit'"
              @toggle="(state) => handleMatchTypeToggle('nolimit', state)"
            >
              No Limit
            </ToggleButton>
            <ToggleButton
              :key="`custom-${selectedMatchType}`"
              :initial-state="selectedMatchType === 'custom'"
              @toggle="(state) => handleMatchTypeToggle('custom', state)"
            >
              Custom
            </ToggleButton>
          </template>

          <!-- For Burst, Metal Fight/Zero-G, Plastic & HMS: 3, 4, 5, No Limit, Custom -->
          <template v-else>
            <ToggleButton
              :key="`3pts-${selectedMatchType}`"
              :initial-state="selectedMatchType === '3pts'"
              @toggle="(state) => handleMatchTypeToggle('3pts', state)"
            >
              3 Pts.
            </ToggleButton>
            <ToggleButton
              :key="`4pts-${selectedMatchType}`"
              :initial-state="selectedMatchType === '4pts'"
              @toggle="(state) => handleMatchTypeToggle('4pts', state)"
            >
              4 Pts.
            </ToggleButton>
            <ToggleButton
              :key="`5pts-${selectedMatchType}`"
              :initial-state="selectedMatchType === '5pts'"
              @toggle="(state) => handleMatchTypeToggle('5pts', state)"
            >
              5 Pts.
            </ToggleButton>
            <ToggleButton
              :key="`nolimit-${selectedMatchType}`"
              :initial-state="selectedMatchType === 'nolimit'"
              @toggle="(state) => handleMatchTypeToggle('nolimit', state)"
            >
              No Limit
            </ToggleButton>
            <ToggleButton
              :key="`custom-${selectedMatchType}`"
              :initial-state="selectedMatchType === 'custom'"
              @toggle="(state) => handleMatchTypeToggle('custom', state)"
            >
              Custom
            </ToggleButton>
          </template>
        </div>

        <!-- Custom Points Input (shown when Custom is selected) -->
        <div
          v-if="selectedMatchType === 'custom'"
          class="custom-points-container"
        >
          <label for="custom-points-input" class="custom-points-label"
            >Points to Win:</label
          >
          <div class="custom-points-input-wrapper">
            <input
              id="custom-points-input"
              ref="customPointsInputRef"
              type="number"
              min="1"
              :value="customPoints"
              class="custom-points-input"
              @input="handleCustomPointsInput"
              @blur="handleCustomPointsBlur"
            />
          </div>
        </div>

        <!-- Best-of Sets toggle buttons (hidden when No Limit is selected) -->
        <div
          v-if="selectedMatchType !== 'nolimit'"
          class="best-of-buttons-container"
        >
          <ToggleButton
            :key="`bestof3-${selectedBestOf}`"
            :initial-state="selectedBestOf === '3'"
            @toggle="(state) => handleBestOfToggle('3', state)"
          >
            Best-of-3 Sets
          </ToggleButton>
          <ToggleButton
            :key="`bestof5-${selectedBestOf}`"
            :initial-state="selectedBestOf === '5'"
            @toggle="(state) => handleBestOfToggle('5', state)"
          >
            Best-of-5 Sets
          </ToggleButton>
        </div>

        <!-- Own Finish section (only shown for X generation) -->
        <template v-if="selectedGeneration === 'x'">
          <!-- Own Finish heading -->
          <h1
            class="own-finish-heading"
            :class="{ 'no-best-of': selectedMatchType === 'nolimit' }"
          >
            Own Finish
          </h1>

          <!-- Own Finish toggle button -->
          <div
            class="own-finish-button-container"
            :class="{ 'no-best-of': selectedMatchType === 'nolimit' }"
          >
            <ToggleButton
              :key="`ownfinish-${localOwnFinishEnabled}`"
              :initial-state="localOwnFinishEnabled"
              @toggle="(state) => handleOwnFinishToggle(state)"
            >
              {{ localOwnFinishEnabled ? "On" : "Off" }}
            </ToggleButton>
          </div>
        </template>
      </div>

      <!-- Start Game button -->
      <div class="button-container">
        <Button variant="blue" @click="handleStartGame">Start Game</Button>
      </div>

      <!-- Copyright text at bottom -->
      <div class="copyright-text">
        © worldbeyblade.org, Fighting Spirits Inc. 2025
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
  padding: 20px;
  box-sizing: border-box;
}

.game-setup-screen {
  width: 390px;
  min-width: 360px;
  max-width: 428px;
  height: 844px;
  min-height: 640px;
  max-height: 926px;
  background-color: white;
  border: none;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: calc(max(20px, env(safe-area-inset-top, 0px)) + 72px);
  padding-bottom: calc(max(34px, env(safe-area-inset-bottom, 0px)) + 12px);
  padding-left: calc(20px + env(safe-area-inset-left, 0px));
  padding-right: calc(20px + env(safe-area-inset-right, 0px));
  overflow-y: auto;
}

.content-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.logo {
  position: absolute;
  top: calc(max(20px, env(safe-area-inset-top, 0px)) + 20px);
  left: calc(20px + env(safe-area-inset-left, 0px));
  height: 20px;
  width: auto;
  z-index: 10;
}

.heading-text {
  font-family: "Titillium Web", sans-serif;
  font-size: 1rem;
  font-weight: bold;
  color: #475569;
  margin: 0;
  padding: 0;
  line-height: 1.5;
}

.toggle-buttons-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toggle-buttons-container :deep(button) {
  width: 100%;
}

.match-type-heading {
  font-family: "Titillium Web", sans-serif;
  font-size: 1rem;
  font-weight: bold;
  color: #475569;
  margin: 0;
  padding: 0;
  line-height: 1.5;
}

.match-type-buttons-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
}

.match-type-buttons-container :deep(button) {
  width: auto;
  flex-shrink: 0;
}

.best-of-buttons-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
}

.best-of-buttons-container :deep(button) {
  width: auto;
  flex-shrink: 0;
}

.custom-points-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.custom-points-label {
  font-family: "Titillium Web", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #94a3b8;
  line-height: 1.5;
}

.custom-points-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  min-width: 70px;
  padding: 8px 12px;
  background-color: white;
  border: 1px solid #cbd5e1;
  border-bottom: none;
  border-radius: 10px;
  box-shadow: 0 2px 0 0 #cbd5e1;
}

.custom-points-input {
  width: 50px;
  height: 100%;
  padding: 0;
  border: none;
  background: transparent;
  font-family: "Titillium Web", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #94a3b8;
  text-align: center;
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

.own-finish-heading {
  font-family: "Titillium Web", sans-serif;
  font-size: 1rem;
  font-weight: bold;
  color: #475569;
  margin: 8px 0 0;
  padding: 0;
  line-height: 1.5;
}

.own-finish-heading.no-best-of {
  margin-top: 0;
}

.own-finish-button-container {
  display: flex;
  align-items: flex-start;
}

.own-finish-button-container.no-best-of {
  margin-top: 4px;
}

.own-finish-button-container :deep(button) {
  width: auto;
  flex-shrink: 0;
}

.button-container {
  margin-top: auto;
  width: 100%;
}

.button-container :deep(button) {
  width: 100%;
}

.copyright-text {
  text-align: center;
  padding-bottom: max(34px, env(safe-area-inset-bottom, 0px));
  font-family: "Titillium Web", sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  color: #94a3b8;
  line-height: 1.5;
}
</style>
