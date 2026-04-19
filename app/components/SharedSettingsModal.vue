<script setup lang="ts">
import { X } from "@lucide/vue";
import Alert from "~/components/Alert.vue";
import AdvancedSettingsSection from "~/components/AdvancedSettingsSection.vue";
import Button from "~/components/Button.vue";
import DropdownMenu from "~/components/DropdownMenu.vue";
import TextDropdownField from "~/components/TextDropdownField.vue";
import ToggleButton from "~/components/ToggleButton.vue";

type DropdownItem = {
  label: string;
  value: string;
  disabled?: boolean;
};

const props = defineProps<{
  gameHasStarted: boolean;
  player1Name: string;
  player2Name: string;
  beybladeGenerationLabel: string;
  pointsToWinLabel: string;
  setsLabel: string;
  ownFinishOptionLabel: string;
  openDropdown: "generation" | "pointsToWin" | "sets" | null;
  generationItems: DropdownItem[];
  pointsToWinItems: DropdownItem[];
  setsItems: DropdownItem[];
  generation: GenerationOption;
  matchTypeParam: string;
  customPoints?: number;
  bestOf?: number;
  isOwnFinishEnabled: boolean;
  xtrPoints: number;
  ovrPoints: number;
  bstPoints: number;
  spfPoints: number;
  hasChanges: boolean;
  isLandscape?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  saveChanges: [];
  resetGame: [];
  toggleGenerationDropdown: [];
  togglePointsToWinDropdown: [];
  toggleSetsDropdown: [];
  selectGeneration: [value: string];
  selectPointsToWin: [value: string];
  selectSets: [value: string];
  ownFinishToggle: [];
  customPointsChange: [value: number];
  "update:player1Name": [value: string];
  "update:player2Name": [value: string];
  "update:xtr-points": [value: number];
  "update:ovr-points": [value: number];
  "update:bst-points": [value: number];
  "update:spf-points": [value: number];
  resetChipPoints: [];
}>();

const handleCustomPointsInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = Number.parseInt(target.value, 10);

  if (!Number.isNaN(value) && value >= 1) {
    emit("customPointsChange", value);
  }
};
</script>

<template>
  <h1 class="modal-title">Settings</h1>
  <p class="settings-description">Set your match preferences.</p>
  <button class="modal-close" @click="emit('close')">
    <X :size="24" color="#64748b" :stroke-width="2" />
  </button>

  <div
    class="settings-content"
    :class="{ 'settings-content-landscape': props.isLandscape }"
  >
    <div v-if="gameHasStarted" class="settings-field alert-top">
      <Alert />
    </div>

    <div class="settings-field">
      <TextDropdownField
        :model-value="player1Name"
        title="Player 1 Name"
        :show-chevron="false"
        :max-length="15"
        @update:model-value="emit('update:player1Name', $event)"
      />
    </div>

    <div class="settings-field">
      <TextDropdownField
        :model-value="player2Name"
        title="Player 2 Name"
        :show-chevron="false"
        :max-length="15"
        @update:model-value="emit('update:player2Name', $event)"
      />
    </div>

    <div class="settings-field generation-gap">
      <div style="position: relative">
        <TextDropdownField
          title="Beyblade Generation"
          variant="dropdown"
          :show-chevron="true"
          :model-value="beybladeGenerationLabel"
          @toggle="emit('toggleGenerationDropdown')"
        />
        <div
          v-if="openDropdown === 'generation'"
          style="margin-top: 8px; position: absolute; width: 100%; z-index: 10"
        >
          <DropdownMenu
            :items="generationItems"
            :selected-value="generation"
            @select="emit('selectGeneration', $event)"
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
          @toggle="emit('togglePointsToWinDropdown')"
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
            @select="emit('selectPointsToWin', $event)"
          />
        </div>
      </div>
    </div>

    <div v-if="matchTypeParam === 'custom'" class="settings-field">
      <div class="custom-points-field">
        <label for="custom-points-input" class="custom-points-title"
          >Custom Points</label
        >
        <div class="custom-points-input-container">
          <input
            id="custom-points-input"
            type="number"
            min="1"
            :value="customPoints"
            class="custom-points-input"
            @input="handleCustomPointsInput"
          />
        </div>
      </div>
    </div>

    <div v-if="matchTypeParam !== 'nolimit'" class="settings-field sets-gap">
      <div style="position: relative">
        <TextDropdownField
          title="Sets"
          variant="dropdown"
          :show-chevron="true"
          :model-value="setsLabel"
          @toggle="emit('toggleSetsDropdown')"
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
            @select="emit('selectSets', $event)"
          />
        </div>
      </div>
    </div>

    <div v-if="generation === 'x'" class="settings-field own-finish-gap">
      <div class="own-finish-label">Own Finish</div>
      <div class="own-finish-toggle">
        <ToggleButton
          size="default"
          :initial-state="isOwnFinishEnabled"
          @toggle="emit('ownFinishToggle')"
        >
          {{ ownFinishOptionLabel }}
        </ToggleButton>
      </div>
    </div>

    <div class="settings-field advanced-settings-gap">
      <AdvancedSettingsSection
        :generation="generation"
        :xtr-points="xtrPoints"
        :ovr-points="ovrPoints"
        :bst-points="bstPoints"
        :spf-points="spfPoints"
        @update:xtr-points="emit('update:xtr-points', $event)"
        @update:ovr-points="emit('update:ovr-points', $event)"
        @update:bst-points="emit('update:bst-points', $event)"
        @update:spf-points="emit('update:spf-points', $event)"
        @reset="emit('resetChipPoints')"
      />
    </div>
  </div>

  <div
    :class="
      props.isLandscape
        ? 'settings-buttons-container'
        : 'settings-buttons-container-portrait'
    "
  >
    <div v-if="props.isLandscape" class="settings-buttons-landscape">
      <Button
        variant="blue"
        :disabled="!hasChanges"
        @click="emit('saveChanges')"
        >Save Changes</Button
      >
      <Button
        variant="secondary"
        class="reset-game-button-transparent"
        @click="emit('resetGame')"
        >Reset Game</Button
      >
    </div>
    <div v-else class="settings-buttons-portrait">
      <Button
        variant="blue"
        :disabled="!hasChanges"
        @click="emit('saveChanges')"
        >Save Changes</Button
      >
      <Button variant="secondary" @click="emit('resetGame')">Reset Game</Button>
    </div>
  </div>
</template>

<style scoped>
.modal-title {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 44px;
  font-family: "Titillium Web", sans-serif;
  font-size: 1.125rem;
  font-weight: bold;
  color: #334155;
  margin: 0;
  padding: 0;
  line-height: 1.5;
  width: auto;
  box-sizing: border-box;
}

.modal-close {
  position: absolute;
  top: 24px;
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

.settings-description {
  position: absolute;
  top: calc(20px + 1.6875rem + 6px);
  left: 20px;
  right: 20px;
  font-family: "Titillium Web", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #64748b;
  margin: 0;
  padding: 0;
  line-height: 1.5;
  width: auto;
  box-sizing: border-box;
}

.settings-content {
  position: absolute;
  top: calc(20px + 1.6875rem + 6px + 1.5rem + 24px);
  left: 20px;
  right: 20px;
  bottom: 0;
  width: auto;
  box-sizing: border-box;
  overflow-y: auto;
  padding-bottom: 106px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.settings-content-landscape {
  padding-bottom: 112px;
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

.settings-field.advanced-settings-gap {
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
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
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
  appearance: textfield;
}

.settings-buttons-container-portrait {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 20px;
  box-sizing: border-box;
  z-index: 20;
}

.settings-buttons-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 20px;
  box-sizing: border-box;
  z-index: 20;
}

.settings-buttons-portrait {
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
}

.settings-buttons-landscape {
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
}

.settings-buttons-portrait :deep(button),
.settings-buttons-landscape :deep(button) {
  flex: 1 1 0 !important;
  min-width: 0 !important;
  max-width: none !important;
  width: auto !important;
  font-weight: bold;
}

.settings-buttons-landscape :deep(.reset-game-button-transparent) {
  background-color: transparent !important;
  border: 1px solid #1088c9;
  border-bottom: 2px solid #1088c9;
}
</style>
