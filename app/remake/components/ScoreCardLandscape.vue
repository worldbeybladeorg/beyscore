<template>
  <div 
    class="score-card"
    :class="{
      'generation-burst': generation === 'burst',
      'generation-mfb-plastics': generation === 'mfb-zero-g' || generation === 'plastics-hms'
    }"
    :style="{
      backgroundColor: player === 'p2' ? 'rgba(255, 85, 85, 0.05)' : 'rgba(16, 136, 201, 0.05)',
      backgroundImage: player === 'p2' ? 'url(/score-card-p2-bg.svg)' : 'url(/score-card-p1-bg.svg)'
    }"
  >
    <!-- Player 1: Top row has PlayerName and ERR chip, Bottom has stacked chips -->
    <!-- Player 2: Top row has stacked chips, Bottom has PlayerName and ERR chip -->
    
    <!-- X Format: Chips bottom right (landscape layout) -->
    <div v-if="generation === 'x' && player === 'p2'" class="chips-container-bottom-right-landscape">
      <!-- 4 chips stacked (XTR, OVR, BST, SPF) -->
      <div class="chip-stack-right-landscape">
        <ScoringChip label="XTR" :score="xtrScore" variant="red" :disabled="disabled" @chipClick="(points) => handleChipClick(points, 'XTR')" />
        <ScoringChip label="OVR" :score="ovrScore" variant="red" :disabled="disabled" @chipClick="(points) => handleChipClick(points, 'OVR')" />
        <ScoringChip label="BST" :score="bstScore" variant="red" :disabled="disabled" @chipClick="(points) => handleChipClick(points, 'BST')" />
        <ScoringChip label="SPF" :score="spfScore" variant="red" :disabled="disabled" @chipClick="(points) => handleChipClick(points, 'SPF')" />
      </div>
    </div>
    
    <!-- Burst: Stacked chips bottom right (same as X format, minus XTR) -->
    <div v-if="generation === 'burst' && player === 'p2'" class="chips-container-bottom-right-landscape">
      <div class="chip-stack-right-landscape">
        <ScoringChip label="OVR" :score="ovrScore" variant="red" :disabled="disabled" @chipClick="(points) => handleChipClick(points, 'OVR')" />
        <ScoringChip label="BST" :score="bstScore" variant="red" :disabled="disabled" @chipClick="(points) => handleChipClick(points, 'BST')" />
        <ScoringChip label="SPF" :score="spfScore" variant="red" :disabled="disabled" @chipClick="(points) => handleChipClick(points, 'SPF')" />
      </div>
    </div>
    
    <!-- MFB/Zero-G and Plastics/HMS: Stacked chips bottom right (same as X format, minus XTR and BST) -->
    <div v-if="(generation === 'mfb-zero-g' || generation === 'plastics-hms') && player === 'p2'" class="chips-container-bottom-right-landscape">
      <div class="chip-stack-right-landscape">
        <ScoringChip label="OVR" :score="ovrScore" variant="red" :disabled="disabled" @chipClick="(points) => handleChipClick(points, 'OVR')" />
        <ScoringChip label="SPF" :score="spfScore" variant="red" :disabled="disabled" @chipClick="(points) => handleChipClick(points, 'SPF')" />
      </div>
    </div>
    
    <!-- PlayerName and ERR/PEN row (top for p1) -->
    <div v-if="player === 'p1'" class="top-row" :class="{ 'center-name': generation !== 'x' }">
      <div class="player-name-wrapper">
        <PlayerName :name="playerName" :player="player" :bestOf="bestOf" :filledStars="filledStars" />
        <!-- Warning ResponseChip - 12px below PlayerName, left aligned (X format only) -->
        <ResponseChip 
          v-if="generation === 'x' && showWarning" 
          variant="warning" 
          class="warning-response warning-response-p1"
        />
      </div>
      <!-- ERR / OWF group for Player 1 (X format only, Own Finish enabled) -->
      <div
        v-if="generation === 'x' && ownFinishEnabled"
        class="err-owf-group err-owf-group-p1"
      >
        <ScoringChip 
          variant="warning" 
          :label="showWarning ? 'PEN' : 'ERR'"
          :disabled="disabled"
          @chipClick="handleErrClick" 
        />
        <ScoringChip 
          label="OWF"
          :score="1"
          variant="warning"
          :disabled="disabled"
          @chipClick="handleOwnFinishClick"
        />
      </div>
      <!-- Default ERR button when Own Finish is off (X format only) -->
      <ScoringChip 
        v-else-if="generation === 'x'"
        variant="warning" 
        :label="showWarning ? 'PEN' : 'ERR'"
        :disabled="disabled"
        @chipClick="handleErrClick" 
      />
    </div>
    
    <!-- Middle: Large score number -->
    <div 
      class="score-display"
      :class="{ 
        'score-fade-in': isFadingIn,
        'score-shrink': isShrinking
      }"
      :style="{ color: player === 'p2' ? '#FF5555' : '#1088C9' }"
    >
      {{ score }}
    </div>
    
    <!-- X Format: Chips bottom left (landscape layout) -->
    <div v-if="generation === 'x' && player === 'p1'" class="chips-container-bottom-left-landscape">
      <!-- 4 chips stacked (XTR, OVR, BST, SPF) -->
      <div class="chip-stack-left-landscape">
        <ScoringChip label="XTR" :score="xtrScore" variant="blue" :disabled="disabled" @chipClick="(points) => handleChipClick(points, 'XTR')" />
        <ScoringChip label="OVR" :score="ovrScore" variant="blue" :disabled="disabled" @chipClick="(points) => handleChipClick(points, 'OVR')" />
        <ScoringChip label="BST" :score="bstScore" variant="blue" :disabled="disabled" @chipClick="(points) => handleChipClick(points, 'BST')" />
        <ScoringChip label="SPF" :score="spfScore" variant="blue" :disabled="disabled" @chipClick="(points) => handleChipClick(points, 'SPF')" />
      </div>
    </div>
    
    <!-- Burst: Stacked chips bottom left (same as X format, minus XTR) -->
    <div v-if="generation === 'burst' && player === 'p1'" class="chips-container-bottom-left-landscape">
      <div class="chip-stack-left-landscape">
        <ScoringChip label="OVR" :score="ovrScore" variant="blue" :disabled="disabled" @chipClick="(points) => handleChipClick(points, 'OVR')" />
        <ScoringChip label="BST" :score="bstScore" variant="blue" :disabled="disabled" @chipClick="(points) => handleChipClick(points, 'BST')" />
        <ScoringChip label="SPF" :score="spfScore" variant="blue" :disabled="disabled" @chipClick="(points) => handleChipClick(points, 'SPF')" />
      </div>
    </div>
    
    <!-- MFB/Zero-G and Plastics/HMS: Stacked chips bottom left (same as X format, minus XTR and BST) -->
    <div v-if="(generation === 'mfb-zero-g' || generation === 'plastics-hms') && player === 'p1'" class="chips-container-bottom-left-landscape">
      <div class="chip-stack-left-landscape">
        <ScoringChip label="OVR" :score="ovrScore" variant="blue" :disabled="disabled" @chipClick="(points) => handleChipClick(points, 'OVR')" />
        <ScoringChip label="SPF" :score="spfScore" variant="blue" :disabled="disabled" @chipClick="(points) => handleChipClick(points, 'SPF')" />
      </div>
    </div>
    
    <!-- PlayerName and ERR/PEN row for Player 2 -->
    <!-- X format: centered vertically (same position as chips) -->
    <div v-if="player === 'p2' && generation === 'x'" class="player2-row-center-landscape">
      <!-- ERR / OWF group for Player 2 (X format only, Own Finish enabled) -->
      <div
        v-if="ownFinishEnabled"
        class="err-owf-group err-owf-group-p2"
      >
        <ScoringChip 
          label="OWF"
          :score="1"
          variant="warning"
          :disabled="disabled"
          @chipClick="handleOwnFinishClick"
        />
        <ScoringChip 
          variant="warning" 
          :label="showWarning ? 'PEN' : 'ERR'"
          :disabled="disabled"
          @chipClick="handleErrClick" 
        />
      </div>
      <!-- Default ERR button when Own Finish is off (X format only) -->
      <ScoringChip 
        v-else
        variant="warning" 
        :label="showWarning ? 'PEN' : 'ERR'"
        :disabled="disabled"
        @chipClick="handleErrClick" 
      />
      <div class="player-name-wrapper player-name-wrapper-p2">
        <PlayerName :name="playerName" :player="player" :bestOf="bestOf" :filledStars="filledStars" />
        <!-- Warning ResponseChip - 12px below PlayerName, right aligned (absolute positioning, X format only) -->
        <ResponseChip 
          v-if="showWarning" 
          variant="warning" 
          class="warning-response warning-response-p2"
        />
      </div>
    </div>
    <!-- Non-X format: same layout as X format (top row with player name, centered) -->
    <div v-else-if="player === 'p2'" class="player2-row-center-landscape player2-row-center-name">
      <div class="player-name-wrapper player-name-wrapper-p2">
        <PlayerName :name="playerName" :player="player" :bestOf="bestOf" :filledStars="filledStars" />
      </div>
    </div>
  </div>
</template>

<script setup>
import PlayerName from './PlayerName.vue'
import ScoringChip from './ScoringChip.vue'
import ResponseChip from './ResponseChip.vue'

const props = defineProps({
  player: {
    type: String,
    default: 'p1',
    validator: (value) => ['p1', 'p2'].includes(value)
  },
  playerName: {
    type: String,
    default: 'Player 1'
  },
  generation: {
    type: String,
    default: 'x',
    validator: (value) => ['x', 'burst', 'mfb-zero-g', 'plastics-hms'].includes(value)
  },
  bestOf: {
    type: Number,
    default: null,
    validator: (value) => value === null || [3, 5].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  filledStars: {
    type: Array,
    default: () => [],
    validator: (value) => {
      return Array.isArray(value) && value.every(item => typeof item === 'boolean')
    }
  },
  showWarning: {
    type: Boolean,
    default: false
  },
  ownFinishEnabled: {
    type: Boolean,
    default: false
  },
  isFadingIn: {
    type: Boolean,
    default: false
  },
  isShrinking: {
    type: Boolean,
    default: false
  },
  score: {
    type: String,
    default: '0'
  },
  xtrScore: {
    type: Number,
    default: 3
  },
  ovrScore: {
    type: Number,
    default: 2
  },
  bstScore: {
    type: Number,
    default: 2
  },
  spfScore: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['scoreIncrease', 'penalty', 'warningToggle', 'ownFinish'])

const handleChipClick = (points, chipLabel) => {
  // Emit event with player, points to add, and chip label
  emit('scoreIncrease', points, chipLabel)
}

const handleErrClick = () => {
  if (!props.showWarning) {
    // First click: Show warning chip (ERR -> PEN) - emit toggle event
    emit('warningToggle')
  } else {
    // Second click (PEN): Issue penalty point to opposing player
    emit('penalty')
    // Warning state will be reset by parent after penalty is issued
  }
}

const handleOwnFinishClick = () => {
  emit('ownFinish')
}
</script>

<style scoped>
.score-card {
  display: flex;
  flex-direction: column;
  width: 90vw; /* Takes up most of viewport width */
  max-width: 390px; /* Matches common phone width (iPhone 12/13/14) */
  aspect-ratio: 1; /* Makes it a square */
  padding: 20px;
  background-repeat: no-repeat;
  background-position: right center; /* Changed from left center to right center for landscape */
  background-size: auto 100%; /* Full height, auto width to maintain aspect ratio */
  border-radius: 20px;
  box-sizing: border-box;
  position: relative;
}

.top-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-bottom: auto;
}

.top-row.center-name {
  justify-content: center;
}

.bottom-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  margin-top: auto;
  margin-bottom: 0;
}

.bottom-row.center-name {
  justify-content: center;
}

/* Landscape: Player 2 row at top (X format) */
.player2-row-center-landscape {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.score-display {
  position: absolute;
  /* Center vertically in the middle of the card */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Titillium Web', sans-serif;
  font-size: 96px;
  font-weight: bold;
  color: #1088C9;
  line-height: 1;
  opacity: 1;
  transform-origin: center;
}

.score-display.score-shrink {
  animation: shrinkScore 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.score-display.score-fade-in {
  animation: fadeInScore 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes shrinkScore {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
}

@keyframes fadeInScore {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.player-name-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
}

.top-row.center-name .player-name-wrapper,
.bottom-row.center-name .player-name-wrapper {
  align-items: center;
}

.player-name-wrapper-p2 {
  /* For Player 2, keep wrapper at natural height */
  align-items: flex-start;
}

/* Center align player name for non-X formats in landscape */
.player2-row-center-name {
  justify-content: center;
}

.player2-row-center-name .player-name-wrapper-p2 {
  align-items: center;
}

.warning-response {
  z-index: 10;
}

.warning-response-p1 {
  /* Player 1: 12px below PlayerName, left aligned */
  margin-top: 12px;
}

.warning-response-p2 {
  /* Player 2: 12px below PlayerName, right aligned (absolute positioning) */
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 12px;
}

.err-owf-group {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.err-owf-group-p1 {
  /* Player 1: OWF 12px below ERR, right-aligned */
  flex-direction: column;
}

.err-owf-group-p2 {
  /* Player 2: OWF 12px above ERR, right-aligned */
  flex-direction: column;
}

.chips-container-bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  margin-top: auto;
}

.chips-container-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-bottom: auto;
  margin-top: 0;
}

/* Landscape: X format chips centered vertically */
.chips-container-center-landscape {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.chips-container-bottom-left-landscape {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}

.chips-container-bottom-right-landscape {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}

.chip-stack-left-landscape,
.chip-stack-right-landscape {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chip-stack-left-landscape {
  align-items: flex-start;
}

.chip-stack-right-landscape {
  align-items: flex-end;
}

.chip-stack-left,
.chip-stack-right {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chip-stack-left {
  align-items: flex-start;
}

.chip-stack-right {
  align-items: flex-end;
}

/* Lock all chips at 84px width for landscape (including ERR and OWF) - except Burst format */
.chips-container-bottom :deep(.scoring-chip),
.chips-container-top :deep(.scoring-chip),
.chips-container-center-landscape :deep(.scoring-chip),
.chips-container-bottom-left-landscape :deep(.scoring-chip),
.chips-container-bottom-right-landscape :deep(.scoring-chip),
.top-row :deep(.scoring-chip),
.bottom-row :deep(.scoring-chip),
.err-owf-group :deep(.scoring-chip),
.player2-row-center-landscape :deep(.scoring-chip) {
  width: 84px;
  flex: none;
}

/* Burst format: horizontal row with wider chips */
.chips-container-burst-top,
.chips-container-burst-bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.chips-container-burst-top {
  margin-bottom: auto;
  margin-top: 0;
}

.chips-container-burst-bottom {
  margin-top: auto;
}

/* Burst format chips - wider width to span more space */
.generation-burst .chips-container-burst-top :deep(.scoring-chip),
.generation-burst .chips-container-burst-bottom :deep(.scoring-chip) {
  width: auto;
  flex: 1;
  min-width: 0;
}
</style>

