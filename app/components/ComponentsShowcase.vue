<script setup>
import { ref, computed } from "vue";
import Button from "../components/Button.vue";
import ToggleButton from "../components/ToggleButton.vue";
import ScoringChip from "../components/ScoringChip.vue";
import UndoButton from "../components/UndoButton.vue";
import RedoButton from "../components/RedoButton.vue";
import UndoRedoButtons from "../components/UndoRedoButtons.vue";
import MenuButton from "../components/MenuButton.vue";
import PlayerName from "../components/PlayerName.vue";
import ScoringStar from "../components/ScoringStar.vue";
import ScoreCardPortrait from "../components/ScoreCardPortrait.vue";
import TextDropdownField from "../components/TextDropdownField.vue";
import DropdownMenu from "../components/DropdownMenu.vue";
import Alert from "../components/Alert.vue";
import GameSummary from "../components/GameSummary.vue";
import GameResults from "../components/GameResults.vue";
import LandscapeNavigation from "../components/LandscapeNavigation.vue";

const textDropdownValue = ref("Text");
const selectedDropdownValue = ref("option2");
const isDropdownOpen = ref(false);
const dropdownItems = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

const selectedDropdownLabel = computed(() => {
  const item = dropdownItems.find(
    (item) => item.value === selectedDropdownValue.value,
  );
  return item ? item.label : selectedDropdownValue.value;
});

const handleDropdownToggle = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const handleMenuSelect = (value) => {
  selectedDropdownValue.value = value;
  isDropdownOpen.value = false;
};

const gameSummaryItems = [
  { id: "xtreme", label: "XTR", value: 0 },
  { id: "burst", label: "BST", value: 0 },
  { id: "over", label: "OVR", value: 0 },
  { id: "spin", label: "SPF", value: 0 },
];
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-24 py-24">
    <div class="flex flex-col items-center justify-center gap-6">
      <!-- Button variants - same row -->
      <div class="flex flex-row items-center justify-center gap-4">
        <Button variant="blue" @click="() => alert('Blue button clicked!')"
          >Blue</Button
        >
        <Button variant="orange" @click="() => alert('Orange button clicked!')"
          >Orange</Button
        >
        <Button
          variant="secondary"
          @click="() => alert('Secondary button clicked!')"
          >Secondary</Button
        >
      </div>

      <!-- ToggleButton variants - same row -->
      <div class="flex flex-row items-center justify-center gap-4">
        <ToggleButton
          @toggle="
            (state) => alert(`Toggle button is now ${state ? 'ON' : 'OFF'}`)
          "
          >Off Example</ToggleButton
        >
        <ToggleButton
          :initial-state="true"
          @toggle="
            (state) => alert(`Toggle button is now ${state ? 'ON' : 'OFF'}`)
          "
          >On Example</ToggleButton
        >
        <ToggleButton
          size="large"
          @toggle="
            (state) =>
              alert(`Large toggle button is now ${state ? 'ON' : 'OFF'}`)
          "
          >Large Off</ToggleButton
        >
        <ToggleButton
          size="large"
          :initial-state="true"
          @toggle="
            (state) =>
              alert(`Large toggle button is now ${state ? 'ON' : 'OFF'}`)
          "
          >Large On</ToggleButton
        >
      </div>

      <!-- ScoringChip variants - same row (Player 1 blue + Player 2 red) -->
      <div class="flex flex-row items-center justify-center gap-4">
        <!-- Player 1 (Blue) -->
        <ScoringChip label="XTR" :score="3" variant="blue" />
        <ScoringChip label="OVR" :score="2" variant="blue" />
        <ScoringChip label="BST" :score="2" variant="blue" />
        <ScoringChip label="SPF" :score="1" variant="blue" />
        <ScoringChip label="OWF" :score="1" variant="blue" />

        <!-- Player 2 (Red) -->
        <ScoringChip label="XTR" :score="3" variant="red" />
        <ScoringChip label="OVR" :score="2" variant="red" />
        <ScoringChip label="BST" :score="2" variant="red" />
        <ScoringChip label="SPF" :score="1" variant="red" />
        <ScoringChip label="OWF" :score="1" variant="red" />

        <!-- Warning state (applies to both players) -->
        <ScoringChip variant="warning" />
        <ScoringChip variant="warning" />
      </div>

      <!-- UndoButton variants - same row -->
      <div class="flex flex-row items-center justify-center gap-4">
        <UndoButton />
        <UndoButton :disabled="true" />
      </div>

      <!-- RedoButton variants - same row -->
      <div class="flex flex-row items-center justify-center gap-4">
        <RedoButton />
        <RedoButton :disabled="true" />
      </div>

      <!-- UndoRedoButtons variants - same row -->
      <div class="flex flex-row items-center justify-center gap-4">
        <UndoRedoButtons
          @undo="() => alert('Undo clicked')"
          @redo="() => alert('Redo clicked')"
        />
        <UndoRedoButtons
          :undo-disabled="true"
          @undo="() => alert('Undo clicked')"
          @redo="() => alert('Redo clicked')"
        />
        <UndoRedoButtons
          :redo-disabled="true"
          @undo="() => alert('Undo clicked')"
          @redo="() => alert('Redo clicked')"
        />
        <UndoRedoButtons
          :undo-disabled="true"
          :redo-disabled="true"
          @undo="() => alert('Undo clicked')"
          @redo="() => alert('Redo clicked')"
        />
      </div>

      <!-- MenuButton variants - same row -->
      <div class="flex flex-row items-center justify-center gap-4">
        <MenuButton variant="matchHistory" />
        <MenuButton variant="settings" />
      </div>

      <!-- LandscapeNavigation preview -->
      <div class="flex flex-col items-center justify-center gap-4">
        <h2 class="font-titillium text-base font-semibold text-slate-500">
          Landscape Navigation
        </h2>
        <LandscapeNavigation
          @history="() => alert('History clicked')"
          @undo="() => alert('Undo clicked')"
          @redo="() => alert('Redo clicked')"
          @settings="() => alert('Settings clicked')"
        />
        <LandscapeNavigation
          :undo-disabled="true"
          @history="() => alert('History clicked')"
          @undo="() => alert('Undo clicked')"
          @redo="() => alert('Redo clicked')"
          @settings="() => alert('Settings clicked')"
        />
        <LandscapeNavigation
          :redo-disabled="true"
          @history="() => alert('History clicked')"
          @undo="() => alert('Undo clicked')"
          @redo="() => alert('Redo clicked')"
          @settings="() => alert('Settings clicked')"
        />
      </div>

      <!-- TextDropdownField preview -->
      <div class="flex w-[320px] flex-col gap-4">
        <TextDropdownField
          v-model="textDropdownValue"
          title="Title"
          @toggle="() => alert('Input field toggled')"
        />
        <TextDropdownField
          v-model="textDropdownValue"
          title="Dropdown"
          variant="dropdown"
          @toggle="() => alert('Dropdown field toggled')"
        />
      </div>

      <!-- DropdownMenu preview - positioned 8px below TextDropdownField -->
      <div class="relative flex w-[320px] flex-col">
        <TextDropdownField
          title="Dropdown with Menu"
          :model-value="selectedDropdownLabel"
          variant="dropdown"
          :show-chevron="true"
          @toggle="handleDropdownToggle"
        />
        <div v-if="isDropdownOpen" class="mt-2">
          <DropdownMenu
            :items="dropdownItems"
            :selected-value="selectedDropdownValue"
            @select="handleMenuSelect"
          />
        </div>
      </div>

      <!-- Alert preview -->
      <div class="flex w-[320px] flex-col">
        <Alert />
      </div>

      <!-- PlayerName variants - same row -->
      <div class="flex flex-row items-center justify-center gap-4">
        <PlayerName />
        <PlayerName name="Player 1" player="p1" :best-of="3" />
        <PlayerName name="Player 1" player="p1" :best-of="5" />
        <PlayerName name="Player 2" player="p2" :best-of="3" />
        <PlayerName name="Player 2" player="p2" :best-of="5" />
      </div>

      <!-- ScoringStar variants - same row (all 4 variants) -->
      <div class="flex flex-row items-center justify-center gap-4">
        <ScoringStar player="p1" :count="3" />
        <ScoringStar player="p1" :count="5" />
        <ScoringStar player="p2" :count="3" />
        <ScoringStar player="p2" :count="5" />
      </div>

      <!-- ScoreCardPortrait variants -->
      <div class="flex flex-col items-center justify-center gap-6">
        <!-- X Format (default) -->
        <div class="flex flex-col items-center gap-4">
          <h2 class="font-titillium text-xl font-bold text-slate-600">
            X Format
          </h2>
          <div class="flex flex-row items-center justify-center gap-4">
            <ScoreCardPortrait player="p1" generation="x" />
            <ScoreCardPortrait
              player="p2"
              player-name="Player 2"
              generation="x"
            />
          </div>
        </div>

        <!-- Burst Format -->
        <div class="flex flex-col items-center gap-4">
          <h2 class="font-titillium text-xl font-bold text-slate-600">
            Burst Format
          </h2>
          <div class="flex flex-row items-center justify-center gap-4">
            <ScoreCardPortrait player="p1" generation="burst" />
            <ScoreCardPortrait
              player="p2"
              player-name="Player 2"
              generation="burst"
            />
          </div>
        </div>

        <!-- MFB/Zero-G Format -->
        <div class="flex flex-col items-center gap-4">
          <h2 class="font-titillium text-xl font-bold text-slate-600">
            MFB/Zero-G Format
          </h2>
          <div class="flex flex-row items-center justify-center gap-4">
            <ScoreCardPortrait player="p1" generation="mfb-zero-g" />
            <ScoreCardPortrait
              player="p2"
              player-name="Player 2"
              generation="mfb-zero-g"
            />
          </div>
        </div>

        <!-- Plastics/HMS Format -->
        <div class="flex flex-col items-center gap-4">
          <h2 class="font-titillium text-xl font-bold text-slate-600">
            Plastics/HMS Format
          </h2>
          <div class="flex flex-row items-center justify-center gap-4">
            <ScoreCardPortrait player="p1" generation="plastics-hms" />
            <ScoreCardPortrait
              player="p2"
              player-name="Player 2"
              generation="plastics-hms"
            />
          </div>
        </div>
      </div>

      <!-- GameSummary preview -->
      <div class="flex w-[320px] flex-col items-center justify-center gap-2">
        <h2 class="font-titillium text-base font-semibold text-slate-500">
          Game Summary
        </h2>
        <GameSummary :items="gameSummaryItems" />
      </div>

      <!-- GameResults preview - X Format -->
      <div class="flex w-[348px] flex-col items-center justify-center gap-4">
        <h2 class="font-titillium text-base font-semibold text-slate-500">
          Game Results – X Format
        </h2>
        <GameResults winner-name="Player 1" format="x" />
      </div>

      <!-- GameResults preview - X Format with opponent summary edge case -->
      <div class="flex w-[348px] flex-col items-center justify-center gap-4">
        <h2 class="font-titillium text-base font-semibold text-slate-500">
          Game Results – X Format (Opponent Summary)
        </h2>
        <GameResults
          winner-name="Player 1"
          format="x"
          :show-opponent-summary="true"
        />
      </div>

      <!-- GameResults preview - Burst Format -->
      <div class="flex w-[348px] flex-col items-center justify-center gap-4">
        <h2 class="font-titillium text-base font-semibold text-slate-500">
          Game Results – Burst
        </h2>
        <GameResults winner-name="Player 1" format="burst" />
      </div>

      <!-- GameResults preview - MFB / Plastics / HMS -->
      <div class="flex w-[348px] flex-col items-center justify-center gap-4">
        <h2 class="font-titillium text-base font-semibold text-slate-500">
          Game Results – MFB / Plastics / HMS
        </h2>
        <GameResults winner-name="Player 1" format="mfb-zero-g" />
      </div>
    </div>
  </div>
</template>
