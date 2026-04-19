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
  <h1
    class="absolute top-5 right-11 left-5 m-0 box-border w-auto p-0 font-titillium text-lg leading-normal font-bold text-[#334155]"
  >
    Settings
  </h1>

  <button
    class="absolute top-6 right-5 z-10 box-border flex h-6 w-6 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
    @click="emit('close')"
  >
    <X :size="24" color="#64748b" :stroke-width="2" />
  </button>

  <p
    class="absolute top-[calc(20px+1.6875rem+6px)] right-5 left-5 m-0 box-border w-auto p-0 font-titillium text-base leading-6 font-normal text-slate-500"
  >
    Set your match preferences.
  </p>

  <div
    class="absolute top-[calc(20px+1.6875rem+6px+1.5rem+24px)] right-5 bottom-0 left-5 box-border flex w-auto flex-col overflow-y-auto pb-26.5"
    :class="{ 'pb-28': props.isLandscape }"
  >
    <div v-if="gameHasStarted" class="mt-0 mb-6 w-full">
      <Alert />
    </div>

    <div class="mt-4 w-full first:mt-0">
      <TextDropdownField
        :model-value="player1Name"
        title="Player 1 Name"
        :show-chevron="false"
        :max-length="15"
        @update:model-value="emit('update:player1Name', $event)"
      />
    </div>

    <div class="mt-4 w-full">
      <TextDropdownField
        :model-value="player2Name"
        title="Player 2 Name"
        :show-chevron="false"
        :max-length="15"
        @update:model-value="emit('update:player2Name', $event)"
      />
    </div>

    <div class="mt-4 w-full">
      <div class="relative">
        <TextDropdownField
          title="Beyblade Generation"
          variant="dropdown"
          :show-chevron="true"
          :model-value="beybladeGenerationLabel"
          @toggle="emit('toggleGenerationDropdown')"
        />
        <div
          v-if="openDropdown === 'generation'"
          class="absolute top-full left-0 z-10 mt-2 w-full"
        >
          <DropdownMenu
            :items="generationItems"
            :selected-value="generation"
            @select="emit('selectGeneration', $event)"
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
          @toggle="emit('togglePointsToWinDropdown')"
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
            @select="emit('selectPointsToWin', $event)"
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
            :value="customPoints"
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
          @toggle="emit('toggleSetsDropdown')"
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
            :selected-value="bestOf ? bestOf.toString() : undefined"
            @select="emit('selectSets', $event)"
          />
        </div>
      </div>
    </div>

    <div v-if="generation === 'x'" class="mt-4 w-full">
      <div
        class="m-0 box-border p-0 font-titillium text-sm leading-normal font-semibold text-slate-500"
      >
        Own Finish
      </div>
      <div class="mt-2 flex items-center">
        <ToggleButton
          size="default"
          :initial-state="isOwnFinishEnabled"
          @toggle="emit('ownFinishToggle')"
        >
          {{ ownFinishOptionLabel }}
        </ToggleButton>
      </div>
    </div>

    <div class="mt-4 w-full">
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
        @click="emit('saveChanges')"
        >Save Changes</Button
      >
      <Button
        v-if="props.isLandscape"
        variant="secondary"
        class-name="flex-1 min-w-0 border border-[#1088c9] border-b-2 bg-transparent font-bold"
        @click="emit('resetGame')"
        >Reset Game</Button
      >
      <Button
        v-else
        variant="secondary"
        class-name="flex-1 min-w-0 font-bold"
        @click="emit('resetGame')"
        >Reset Game</Button
      >
    </div>
  </div>
</template>
