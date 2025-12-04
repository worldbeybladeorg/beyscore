<script setup>
import { ref, computed } from 'vue'
import Button from '../components/Button.vue'
import ToggleButton from '../components/ToggleButton.vue'
import ScoringChip from '../components/ScoringChip.vue'
import UndoButton from '../components/UndoButton.vue'
import RedoButton from '../components/RedoButton.vue'
import UndoRedoButtons from '../components/UndoRedoButtons.vue'
import MenuButton from '../components/MenuButton.vue'
import PlayerName from '../components/PlayerName.vue'
import ScoringStar from '../components/ScoringStar.vue'
import ScoreCardPortrait from '../components/ScoreCardPortrait.vue'
import TextDropdownField from '../components/TextDropdownField.vue'
import DropdownMenu from '../components/DropdownMenu.vue'
import Alert from '../components/Alert.vue'
import GameSummary from '../components/GameSummary.vue'
import GameResults from '../components/GameResults.vue'
import LandscapeNavigation from '../components/LandscapeNavigation.vue'

const textDropdownValue = ref('Text')
const selectedDropdownValue = ref('option2')
const isDropdownOpen = ref(false)
const dropdownItems = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' }
]

const selectedDropdownLabel = computed(() => {
  const item = dropdownItems.find(item => item.value === selectedDropdownValue.value)
  return item ? item.label : selectedDropdownValue.value
})

const handleDropdownToggle = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const handleMenuSelect = (value) => {
  selectedDropdownValue.value = value
  isDropdownOpen.value = false
}

const gameSummaryItems = [
  { id: 'xtreme', label: 'XTR', value: 0 },
  { id: 'burst',  label: 'BST', value: 0 },
  { id: 'over',   label: 'OVR', value: 0 },
  { id: 'spin',   label: 'SPF', value: 0 }
]
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-24 px-24">
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px;">
      <!-- Button variants - same row -->
      <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 16px;">
        <Button variant="blue" @click="() => alert('Blue button clicked!')">Blue</Button>
        <Button variant="orange" @click="() => alert('Orange button clicked!')">Orange</Button>
        <Button variant="secondary" @click="() => alert('Secondary button clicked!')">Secondary</Button>
      </div>
      
      <!-- ToggleButton variants - same row -->
      <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 16px;">
        <ToggleButton @toggle="(state) => alert(`Toggle button is now ${state ? 'ON' : 'OFF'}`)">Off Example</ToggleButton>
        <ToggleButton :initialState="true" @toggle="(state) => alert(`Toggle button is now ${state ? 'ON' : 'OFF'}`)">On Example</ToggleButton>
        <ToggleButton size="large" @toggle="(state) => alert(`Large toggle button is now ${state ? 'ON' : 'OFF'}`)">Large Off</ToggleButton>
        <ToggleButton size="large" :initialState="true" @toggle="(state) => alert(`Large toggle button is now ${state ? 'ON' : 'OFF'}`)">Large On</ToggleButton>
      </div>
      
      <!-- ScoringChip variants - same row (Player 1 blue + Player 2 red) -->
      <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 16px;">
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
      <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 16px;">
        <UndoButton />
        <UndoButton :disabled="true" />
      </div>
      
      <!-- RedoButton variants - same row -->
      <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 16px;">
        <RedoButton />
        <RedoButton :disabled="true" />
      </div>
      
      <!-- UndoRedoButtons variants - same row -->
      <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 16px;">
        <UndoRedoButtons @undo="() => alert('Undo clicked')" @redo="() => alert('Redo clicked')" />
        <UndoRedoButtons :undoDisabled="true" @undo="() => alert('Undo clicked')" @redo="() => alert('Redo clicked')" />
        <UndoRedoButtons :redoDisabled="true" @undo="() => alert('Undo clicked')" @redo="() => alert('Redo clicked')" />
        <UndoRedoButtons :undoDisabled="true" :redoDisabled="true" @undo="() => alert('Undo clicked')" @redo="() => alert('Redo clicked')" />
      </div>
      
      <!-- MenuButton variants - same row -->
      <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 16px;">
        <MenuButton variant="matchHistory" />
        <MenuButton variant="settings" />
      </div>
      
      <!-- LandscapeNavigation preview -->
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;">
        <h2 style="font-family: 'Titillium Web', sans-serif; font-size: 1rem; font-weight: 600; color: #64748b;">Landscape Navigation</h2>
        <LandscapeNavigation 
          @history="() => alert('History clicked')"
          @undo="() => alert('Undo clicked')"
          @redo="() => alert('Redo clicked')"
          @settings="() => alert('Settings clicked')"
        />
        <LandscapeNavigation 
          :undoDisabled="true"
          @history="() => alert('History clicked')"
          @undo="() => alert('Undo clicked')"
          @redo="() => alert('Redo clicked')"
          @settings="() => alert('Settings clicked')"
        />
        <LandscapeNavigation 
          :redoDisabled="true"
          @history="() => alert('History clicked')"
          @undo="() => alert('Undo clicked')"
          @redo="() => alert('Redo clicked')"
          @settings="() => alert('Settings clicked')"
        />
      </div>
      
      <!-- TextDropdownField preview -->
      <div style="display: flex; flex-direction: column; gap: 16px; width: 320px;">
        <TextDropdownField
          title="Title"
          v-model="textDropdownValue"
          @toggle="() => alert('Input field toggled')"
        />
        <TextDropdownField
          title="Dropdown"
          v-model="textDropdownValue"
          variant="dropdown"
          @toggle="() => alert('Dropdown field toggled')"
        />
      </div>
      
      <!-- DropdownMenu preview - positioned 8px below TextDropdownField -->
      <div style="display: flex; flex-direction: column; width: 320px; position: relative;">
        <TextDropdownField
          title="Dropdown with Menu"
          :modelValue="selectedDropdownLabel"
          variant="dropdown"
          :showChevron="true"
          @toggle="handleDropdownToggle"
        />
        <div v-if="isDropdownOpen" style="margin-top: 8px;">
          <DropdownMenu
            :items="dropdownItems"
            :selectedValue="selectedDropdownValue"
            @select="handleMenuSelect"
          />
        </div>
      </div>
      
      <!-- Alert preview -->
      <div style="display: flex; flex-direction: column; width: 320px;">
        <Alert />
      </div>
      
      <!-- PlayerName variants - same row -->
      <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 16px;">
        <PlayerName />
        <PlayerName name="Player 1" player="p1" :bestOf="3" />
        <PlayerName name="Player 1" player="p1" :bestOf="5" />
        <PlayerName name="Player 2" player="p2" :bestOf="3" />
        <PlayerName name="Player 2" player="p2" :bestOf="5" />
      </div>
      
      <!-- ScoringStar variants - same row (all 4 variants) -->
      <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 16px;">
        <ScoringStar player="p1" :count="3" />
        <ScoringStar player="p1" :count="5" />
        <ScoringStar player="p2" :count="3" />
        <ScoringStar player="p2" :count="5" />
      </div>
      
      <!-- ScoreCardPortrait variants -->
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px;">
        <!-- X Format (default) -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
          <h2 style="font-family: 'Titillium Web', sans-serif; font-size: 1.25rem; font-weight: bold; color: #475569;">X Format</h2>
          <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 16px;">
            <ScoreCardPortrait player="p1" generation="x" />
            <ScoreCardPortrait player="p2" playerName="Player 2" generation="x" />
          </div>
        </div>
        
        <!-- Burst Format -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
          <h2 style="font-family: 'Titillium Web', sans-serif; font-size: 1.25rem; font-weight: bold; color: #475569;">Burst Format</h2>
          <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 16px;">
            <ScoreCardPortrait player="p1" generation="burst" />
            <ScoreCardPortrait player="p2" playerName="Player 2" generation="burst" />
          </div>
        </div>
        
        <!-- MFB/Zero-G Format -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
          <h2 style="font-family: 'Titillium Web', sans-serif; font-size: 1.25rem; font-weight: bold; color: #475569;">MFB/Zero-G Format</h2>
          <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 16px;">
            <ScoreCardPortrait player="p1" generation="mfb-zero-g" />
            <ScoreCardPortrait player="p2" playerName="Player 2" generation="mfb-zero-g" />
          </div>
        </div>
        
        <!-- Plastics/HMS Format -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
          <h2 style="font-family: 'Titillium Web', sans-serif; font-size: 1.25rem; font-weight: bold; color: #475569;">Plastics/HMS Format</h2>
          <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 16px;">
            <ScoreCardPortrait player="p1" generation="plastics-hms" />
            <ScoreCardPortrait player="p2" playerName="Player 2" generation="plastics-hms" />
          </div>
        </div>
      </div>

      <!-- GameSummary preview -->
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; width: 320px;">
        <h2 style="font-family: 'Titillium Web', sans-serif; font-size: 1rem; font-weight: 600; color: #64748b;">Game Summary</h2>
        <GameSummary :items="gameSummaryItems" />
      </div>

      <!-- GameResults preview - X Format -->
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 348px; gap: 16px;">
        <h2 style="font-family: 'Titillium Web', sans-serif; font-size: 1rem; font-weight: 600; color: #64748b;">Game Results – X Format</h2>
        <GameResults winnerName="Player 1" format="x" />
      </div>

       <!-- GameResults preview - X Format with opponent summary edge case -->
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 348px; gap: 16px;">
        <h2 style="font-family: 'Titillium Web', sans-serif; font-size: 1rem; font-weight: 600; color: #64748b;">Game Results – X Format (Opponent Summary)</h2>
        <GameResults winnerName="Player 1" format="x" :showOpponentSummary="true" />
      </div>

      <!-- GameResults preview - Burst Format -->
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 348px; gap: 16px;">
        <h2 style="font-family: 'Titillium Web', sans-serif; font-size: 1rem; font-weight: 600; color: #64748b;">Game Results – Burst</h2>
        <GameResults winnerName="Player 1" format="burst" />
      </div>

      <!-- GameResults preview - MFB / Plastics / HMS -->
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 348px; gap: 16px;">
        <h2 style="font-family: 'Titillium Web', sans-serif; font-size: 1rem; font-weight: 600; color: #64748b;">Game Results – MFB / Plastics / HMS</h2>
        <GameResults winnerName="Player 1" format="mfb-zero-g" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>

