<script setup lang="ts">
import { ref, nextTick, watch } from "vue";
import { storeToRefs } from "pinia";
import ToggleButton from "../components/ToggleButton.vue";
import Button from "../components/Button.vue";
import AdvancedSettingsSection from "../components/AdvancedSettingsSection.vue";
import { useScoreboardStore } from "~/stores/scoreboardStore";
import type {
  GenerationOption,
  MatchTypeOption,
} from "~/stores/scoreboardStore";

const scoreboardStore = useScoreboardStore();
const {
  generation,
  matchType,
  customPoints,
  bestOf,
  ownFinishEnabled,
  xtrPoints,
  ovrPoints,
  bstPoints,
  spfPoints,
} = storeToRefs(scoreboardStore);

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
  <div class="flex min-h-screen w-full items-center justify-center p-5">
    <div
      class="relative flex h-211 max-h-231.5 min-h-160 w-97.5 max-w-107 min-w-90 flex-col gap-4 overflow-y-auto bg-white px-[calc(20px+env(safe-area-inset-left,0px))] pt-[calc(max(20px,env(safe-area-inset-top,0px))+72px)] pr-[calc(20px+env(safe-area-inset-right,0px))] pb-[calc(max(34px,env(safe-area-inset-bottom,0px))+12px)]"
    >
      <img
        src="/beyscore.svg"
        alt="BeyScore"
        class="absolute top-[calc(max(20px,env(safe-area-inset-top,0px))+20px)] left-[calc(20px+env(safe-area-inset-left,0px))] z-10 h-5 w-auto"
      />

      <div class="flex flex-1 flex-col gap-4">
        <h1
          class="m-0 p-0 font-titillium text-base leading-6 font-bold text-slate-700"
        >
          Select Beyblade Generation
        </h1>

        <div class="flex flex-col gap-4">
          <div>
            <ToggleButton
              :key="`x-${selectedGeneration}`"
              class="w-full"
              size="large"
              :initial-state="selectedGeneration === 'x'"
              @toggle="(state) => handleGenerationToggle('x', state)"
            >
              X
            </ToggleButton>
          </div>
          <div>
            <ToggleButton
              :key="`burst-${selectedGeneration}`"
              class="w-full"
              size="large"
              :initial-state="selectedGeneration === 'burst'"
              @toggle="(state) => handleGenerationToggle('burst', state)"
            >
              Burst
            </ToggleButton>
          </div>
          <div>
            <ToggleButton
              :key="`metal-${selectedGeneration}`"
              class="w-full"
              size="large"
              :initial-state="selectedGeneration === 'mfb-zero-g'"
              @toggle="(state) => handleGenerationToggle('mfb-zero-g', state)"
            >
              Metal Fight/Zero-G
            </ToggleButton>
          </div>
          <div>
            <ToggleButton
              :key="`plastic-${selectedGeneration}`"
              class="w-full"
              size="large"
              :initial-state="selectedGeneration === 'plastics-hms'"
              @toggle="(state) => handleGenerationToggle('plastics-hms', state)"
            >
              Plastic & HMS
            </ToggleButton>
          </div>
        </div>

        <h1
          class="m-0 p-0 font-titillium text-base leading-6 font-bold text-slate-700"
        >
          Match Type
        </h1>

        <div
          class="flex flex-wrap items-start gap-3 [&>:deep(button)]:w-auto [&>:deep(button)]:shrink-0"
        >
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

        <div
          v-if="selectedMatchType === 'custom'"
          class="flex items-center gap-3"
        >
          <label
            for="custom-points-input"
            class="font-titillium text-base leading-6 font-bold text-slate-400"
            >Points to Win:</label
          >
          <div
            class="relative flex h-9.5 min-w-17.5 items-center justify-center rounded-[10px] border border-b-0 border-[#cbd5e1] bg-white px-3 py-2 shadow-[0_2px_0_0_#cbd5e1]"
          >
            <input
              id="custom-points-input"
              ref="customPointsInputRef"
              type="number"
              min="1"
              :value="customPoints"
              class="h-full w-12.5 border-none bg-transparent p-0 text-center font-titillium text-base font-bold text-slate-400 outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              @input="handleCustomPointsInput"
              @blur="handleCustomPointsBlur"
            />
          </div>
        </div>

        <div
          v-if="selectedMatchType !== 'nolimit'"
          class="flex flex-wrap items-start gap-3 [&>:deep(button)]:w-auto [&>:deep(button)]:shrink-0"
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

        <template v-if="selectedGeneration === 'x'">
          <h1
            class="mt-2 p-0 font-titillium text-base leading-6 font-bold text-slate-700"
            :class="{ 'mt-0': selectedMatchType === 'nolimit' }"
          >
            Own Finish
          </h1>

          <div
            class="flex items-start [&>:deep(button)]:w-auto [&>:deep(button)]:shrink-0"
            :class="{ 'mt-1': selectedMatchType === 'nolimit' }"
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

        <AdvancedSettingsSection
          :generation="selectedGeneration || generation"
          :xtr-points="xtrPoints"
          :ovr-points="ovrPoints"
          :bst-points="bstPoints"
          :spf-points="spfPoints"
          @update:xtr-points="scoreboardStore.setXtrPoints"
          @update:ovr-points="scoreboardStore.setOvrPoints"
          @update:bst-points="scoreboardStore.setBstPoints"
          @update:spf-points="scoreboardStore.setSpfPoints"
          @reset="scoreboardStore.resetChipPointsToDefaults"
        />
      </div>

      <div class="mt-auto w-full">
        <Button class="w-full" variant="blue" @click="handleStartGame"
          >Start Game</Button
        >
      </div>

      <div
        class="pb-[max(34px,env(safe-area-inset-bottom,0px))] text-center font-titillium text-xs leading-6 font-normal text-slate-400"
      >
        © worldbeyblade.org, Fighting Spirits Inc. 2026
      </div>
    </div>
  </div>
</template>
