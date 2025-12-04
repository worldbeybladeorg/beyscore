<template>
  <div class="viewport-container">
    <div class="game-setup-screen">
      <!-- Empty canvas - ready for game setup design -->
      
      <!-- BeyScore Logo -->
      <img src="/beyscore.svg" alt="BeyScore" class="logo" />
      
      <!-- Heading -->
      <h1 class="heading-text">Select Beyblade Generation</h1>
      
      <!-- Generation toggle buttons -->
      <div class="toggle-buttons-container">
        <ToggleButton 
          size="large" 
          :key="`x-${selectedGeneration}`"
          :initialState="selectedGeneration === 'x'"
          @toggle="(state) => handleGenerationToggle('x', state)"
        >
          X
        </ToggleButton>
        <ToggleButton 
          size="large" 
          :key="`burst-${selectedGeneration}`"
          :initialState="selectedGeneration === 'burst'"
          @toggle="(state) => handleGenerationToggle('burst', state)"
        >
          Burst
        </ToggleButton>
        <ToggleButton 
          size="large" 
          :key="`metal-${selectedGeneration}`"
          :initialState="selectedGeneration === 'metal-fight'"
          @toggle="(state) => handleGenerationToggle('metal-fight', state)"
        >
          Metal Fight/Zero-G
        </ToggleButton>
        <ToggleButton 
          size="large" 
          :key="`plastic-${selectedGeneration}`"
          :initialState="selectedGeneration === 'plastic-hms'"
          @toggle="(state) => handleGenerationToggle('plastic-hms', state)"
        >
          Plastic & HMS
        </ToggleButton>
      </div>
      
      <!-- Match Type heading -->
      <h1 class="match-type-heading">Match Type</h1>
      
      <!-- Match Type toggle buttons -->
      <div class="match-type-buttons-container">
        <!-- For X format: 4, 5, 7, No Limit -->
        <template v-if="selectedGeneration === 'x'">
          <ToggleButton 
            :key="`4pts-${selectedMatchType}`"
            :initialState="selectedMatchType === '4pts'"
            @toggle="(state) => handleMatchTypeToggle('4pts', state)"
          >
            4 Pts.
          </ToggleButton>
          <ToggleButton 
            :key="`5pts-${selectedMatchType}`"
            :initialState="selectedMatchType === '5pts'"
            @toggle="(state) => handleMatchTypeToggle('5pts', state)"
          >
            5 Pts.
          </ToggleButton>
          <ToggleButton 
            :key="`7pts-${selectedMatchType}`"
            :initialState="selectedMatchType === '7pts'"
            @toggle="(state) => handleMatchTypeToggle('7pts', state)"
          >
            7 Pts.
          </ToggleButton>
          <ToggleButton 
            :key="`nolimit-${selectedMatchType}`"
            :initialState="selectedMatchType === 'nolimit'"
            @toggle="(state) => handleMatchTypeToggle('nolimit', state)"
          >
            No Limit
          </ToggleButton>
        </template>
        
        <!-- For Burst, Metal Fight/Zero-G, Plastic & HMS: 3, 4, 5, No Limit -->
        <template v-else>
          <ToggleButton 
            :key="`3pts-${selectedMatchType}`"
            :initialState="selectedMatchType === '3pts'"
            @toggle="(state) => handleMatchTypeToggle('3pts', state)"
          >
            3 Pts.
          </ToggleButton>
          <ToggleButton 
            :key="`4pts-${selectedMatchType}`"
            :initialState="selectedMatchType === '4pts'"
            @toggle="(state) => handleMatchTypeToggle('4pts', state)"
          >
            4 Pts.
          </ToggleButton>
          <ToggleButton 
            :key="`5pts-${selectedMatchType}`"
            :initialState="selectedMatchType === '5pts'"
            @toggle="(state) => handleMatchTypeToggle('5pts', state)"
          >
            5 Pts.
          </ToggleButton>
          <ToggleButton 
            :key="`nolimit-${selectedMatchType}`"
            :initialState="selectedMatchType === 'nolimit'"
            @toggle="(state) => handleMatchTypeToggle('nolimit', state)"
          >
            No Limit
          </ToggleButton>
        </template>
      </div>
      
      <!-- Best-of Sets toggle buttons (hidden when No Limit is selected) -->
      <div v-if="selectedMatchType !== 'nolimit'" class="best-of-buttons-container">
        <ToggleButton 
          :key="`bestof3-${selectedBestOf}`"
          :initialState="selectedBestOf === '3'"
          @toggle="(state) => handleBestOfToggle('3', state)"
        >
          Best-of-3 Sets
        </ToggleButton>
        <ToggleButton 
          :key="`bestof5-${selectedBestOf}`"
          :initialState="selectedBestOf === '5'"
          @toggle="(state) => handleBestOfToggle('5', state)"
        >
          Best-of-5 Sets
        </ToggleButton>
      </div>
      
      <!-- Own Finish section (only shown for X generation) -->
      <template v-if="selectedGeneration === 'x'">
        <!-- Own Finish heading -->
        <h1 class="own-finish-heading" :class="{ 'no-best-of': selectedMatchType === 'nolimit' }">Own Finish</h1>
        
        <!-- Own Finish toggle button -->
        <div class="own-finish-button-container" :class="{ 'no-best-of': selectedMatchType === 'nolimit' }">
          <ToggleButton 
            :key="`ownfinish-${ownFinishEnabled}`"
            :initialState="ownFinishEnabled"
            @toggle="(state) => handleOwnFinishToggle(state)"
          >
            {{ ownFinishEnabled ? 'On' : 'Off' }}
          </ToggleButton>
        </div>
      </template>
      
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

<script setup>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import Button from '../components/Button.vue'
import ToggleButton from '../components/ToggleButton.vue'

const router = useRouter()

const selectedGeneration = ref('x') // Default to 'X'
const selectedMatchType = ref('4pts') // Default to '4 Pts.'
const selectedBestOf = ref(null) // Default to none (both unselected)
const ownFinishEnabled = ref(false) // Default to 'Off'

const handleBack = () => {
  // Back button removed - no splash screen to go back to
  // Could navigate to home or remove the back button entirely
}

const handleGenerationToggle = (generation, state) => {
  if (state) {
    // Turn on this generation - this will update keys and turn off others
    selectedGeneration.value = generation
    
    // For Burst, Metal Fight/Zero-G, and Plastic & HMS, default to 3pts
    if (generation !== 'x') {
      selectedMatchType.value = '3pts' // Default for non-X formats
    }
    // If switching to X format, default to 4pts
    if (generation === 'x') {
      selectedMatchType.value = '4pts' // Default for X format
    }
  } else {
    // Prevent deselecting - always keep one selected (mandatory)
    // Can only change selection by clicking another generation
    if (selectedGeneration.value === generation) {
      // Keep the current selection - force re-render by toggling the value
      // This ensures the key updates and component resets to selected state
      selectedGeneration.value = null
      nextTick(() => {
        selectedGeneration.value = generation
      })
      return
    }
  }
}

const handleMatchTypeToggle = (matchType, state) => {
  if (state) {
    // Turn on this match type - this will update keys and turn off others
    selectedMatchType.value = matchType
    // If "No Limit" is selected, reset best-of selection
    if (matchType === 'nolimit') {
      selectedBestOf.value = null
    }
  } else {
    // Prevent deselecting - always keep one selected (mandatory)
    // Can only change selection by clicking another match type
    if (selectedMatchType.value === matchType) {
      // Keep the current selection - force re-render by toggling the value
      // This ensures the key updates and component resets to selected state
      selectedMatchType.value = null
      nextTick(() => {
        selectedMatchType.value = matchType
      })
      return
    }
  }
}

const handleBestOfToggle = (bestOf, state) => {
  if (state) {
    // Turn on this best-of - this will update keys and turn off others
    selectedBestOf.value = bestOf
  } else {
    // If trying to turn off, allow it (unlike generation/match type, these can be unselected)
    if (selectedBestOf.value === bestOf) {
      selectedBestOf.value = null
    }
  }
}

const handleOwnFinishToggle = (state) => {
  // Not mandatory - can be toggled on/off freely
  ownFinishEnabled.value = state
}

const handleStartGame = () => {
  // Map generation values to match ScoreCardPortrait prop values
  let generationParam = selectedGeneration.value
  if (selectedGeneration.value === 'metal-fight') {
    generationParam = 'mfb-zero-g'
  } else if (selectedGeneration.value === 'plastic-hms') {
    generationParam = 'plastics-hms'
  }
  
  const query = {
    generation: generationParam,
    matchType: selectedMatchType.value // Add match type to query
  }
  
  // Add bestOf to query if selected (convert string to number)
  if (selectedBestOf.value) {
    query.bestOf = selectedBestOf.value
  }
  
  // Add ownFinish to query if enabled (X format only)
  if (ownFinishEnabled.value && generationParam === 'x') {
    query.ownFinish = '1'
  }
  
  router.push({
    path: '/app/game',
    query: query
  })
}
</script>

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
  /* PWA viewport in portrait - matches actual device dimensions when installed */
  /* Width: 360px (Android baseline) to 428px (iPhone Pro Max, large Android) */
  /* Default: 390px (iPhone 12/13/14, iPhone 15, common Android like Pixel) */
  width: 390px;
  min-width: 360px; /* Android baseline (Galaxy S, Pixel), smallest supported devices */
  max-width: 428px; /* iPhone Pro Max, large Android phones */
  
  /* Height: 640px (Android baseline) to 926px (iPhone Pro Max, large Android) */
  /* Default: 844px (iPhone 12/13/14, iPhone 15, common Android) */
  height: 844px;
  min-height: 640px; /* Android baseline - smallest supported height */
  max-height: 926px; /* iPhone Pro Max, large Android devices */
  
  background-color: white;
  border: 1px solid #f3f4f6; /* Tailwind gray-100 */
  box-sizing: border-box;
  position: relative;
  
  /* Account for safe areas - these represent the actual usable content area */
  /* Top: Status bar + safe area */
  padding-top: var(--status-bar-height);
  
  /* Bottom: Home indicator + safe area */
  padding-bottom: var(--home-indicator-height);
  
  /* Left/Right: 20px padding + Safe areas for notches (if any) */
  padding-left: calc(20px + var(--safe-area-inset-left));
  padding-right: calc(20px + var(--safe-area-inset-right));
  
  /* Ensure content area respects safe zones */
  overflow: hidden;
}

.logo {
  position: absolute;
  top: calc(var(--status-bar-height) + 20px);
  left: calc(20px + var(--safe-area-inset-left));
  height: 20px;
  width: auto;
  z-index: 10;
}

.heading-text {
  position: absolute;
  top: calc(var(--status-bar-height) + 20px + 20px + 32px); /* Status bar + top padding + logo height + 32px gap */
  left: calc(20px + var(--safe-area-inset-left));
  right: calc(20px + var(--safe-area-inset-right));
  font-family: 'Titillium Web', sans-serif;
  font-size: 1rem; /* text-base */
  font-weight: bold;
  color: #475569; /* Tailwind slate-600 */
  margin: 0;
  padding: 0;
  line-height: 1.5;
}

.toggle-buttons-container {
  position: absolute;
  top: calc(var(--status-bar-height) + 20px + 20px + 32px + 1.5rem + 20px); /* Status bar + top padding + logo height + 32px gap + heading height (1rem * 1.5) + 20px gap */
  left: calc(20px + var(--safe-area-inset-left));
  right: calc(20px + var(--safe-area-inset-right));
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: calc(100% - 40px - var(--safe-area-inset-left) - var(--safe-area-inset-right));
}

.toggle-buttons-container :deep(button) {
  width: 100%;
}

.match-type-heading {
  position: absolute;
  top: calc(var(--status-bar-height) + 20px + 20px + 32px + 1.5rem + 20px + 48px + 16px + 48px + 16px + 48px + 16px + 48px + 24px); /* Generation buttons container top + 4 buttons (48px each) + 3 gaps (16px each) + 24px gap */
  left: calc(20px + var(--safe-area-inset-left));
  right: calc(20px + var(--safe-area-inset-right));
  font-family: 'Titillium Web', sans-serif;
  font-size: 1rem; /* text-base */
  font-weight: bold;
  color: #475569; /* Tailwind slate-600 */
  margin: 0;
  padding: 0;
  line-height: 1.5;
}

.match-type-buttons-container {
  position: absolute;
  top: calc(var(--status-bar-height) + 20px + 20px + 32px + 1.5rem + 20px + 48px + 16px + 48px + 16px + 48px + 16px + 48px + 24px + 1.5rem + 20px); /* Match type heading top + heading height + 20px gap */
  left: calc(20px + var(--safe-area-inset-left));
  right: calc(20px + var(--safe-area-inset-right));
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.match-type-buttons-container :deep(button) {
  width: auto;
  flex-shrink: 0;
}

.best-of-buttons-container {
  position: absolute;
  top: calc(var(--status-bar-height) + 20px + 20px + 32px + 1.5rem + 20px + 48px + 16px + 48px + 16px + 48px + 16px + 48px + 24px + 1.5rem + 20px + 40px + 16px); /* Match type buttons container top + button height (40px) + 16px gap */
  left: calc(20px + var(--safe-area-inset-left));
  right: calc(20px + var(--safe-area-inset-right));
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.best-of-buttons-container :deep(button) {
  width: auto;
  flex-shrink: 0;
}

.own-finish-heading {
  position: absolute;
  top: calc(var(--status-bar-height) + 20px + 20px + 32px + 1.5rem + 20px + 48px + 16px + 48px + 16px + 48px + 16px + 48px + 24px + 1.5rem + 20px + 40px + 16px + 40px + 32px); /* Best-of buttons container top + button height (40px) + 32px gap */
  left: calc(20px + var(--safe-area-inset-left));
  right: calc(20px + var(--safe-area-inset-right));
  font-family: 'Titillium Web', sans-serif;
  font-size: 1rem; /* text-base */
  font-weight: bold;
  color: #475569; /* Tailwind slate-600 */
  margin: 0;
  padding: 0;
  line-height: 1.5;
}

.own-finish-heading.no-best-of {
  top: calc(var(--status-bar-height) + 20px + 20px + 32px + 1.5rem + 20px + 48px + 16px + 48px + 16px + 48px + 16px + 48px + 24px + 1.5rem + 20px + 40px + 32px); /* Match type buttons container top + button height (40px) + 32px gap */
}

.own-finish-button-container {
  position: absolute;
  top: calc(var(--status-bar-height) + 20px + 20px + 32px + 1.5rem + 20px + 48px + 16px + 48px + 16px + 48px + 16px + 48px + 24px + 1.5rem + 20px + 40px + 16px + 40px + 32px + 1.5rem + 20px); /* Own finish heading top + heading height + 20px gap */
  left: calc(20px + var(--safe-area-inset-left));
  right: calc(20px + var(--safe-area-inset-right));
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.own-finish-button-container.no-best-of {
  top: calc(var(--status-bar-height) + 20px + 20px + 32px + 1.5rem + 20px + 48px + 16px + 48px + 16px + 48px + 16px + 48px + 24px + 1.5rem + 20px + 40px + 32px + 1.5rem + 20px); /* Match type buttons container top + button height (40px) + 32px gap + heading height + 20px gap */
}

.own-finish-button-container :deep(button) {
  width: auto;
  flex-shrink: 0;
}

.button-container {
  position: absolute;
  bottom: calc(var(--home-indicator-height) + 1.25em + 20px); /* Copyright height + 20px gap */
  left: 0;
  right: 0;
  padding-left: calc(20px + var(--safe-area-inset-left));
  padding-right: calc(20px + var(--safe-area-inset-right));
  box-sizing: border-box;
}

.button-container :deep(.custom-button) {
  width: 100%;
}

.copyright-text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: var(--home-indicator-height);
  padding-left: calc(20px + var(--safe-area-inset-left));
  padding-right: calc(20px + var(--safe-area-inset-right));
  text-align: center;
  font-family: 'Titillium Web', sans-serif;
  font-size: 0.75rem; /* text-xs */
  font-weight: 400; /* regular */
  color: #94a3b8; /* Tailwind slate-400 */
  line-height: 1.5;
}
</style>

