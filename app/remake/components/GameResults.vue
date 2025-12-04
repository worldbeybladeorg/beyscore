<template>
  <div class="game-results">
    <button class="game-results-close" @click="$emit('close')">
      <X :size="24" color="#64748b" :stroke-width="2" />
    </button>

    <div class="results-header">
      <div class="results-label">Winner</div>
      <div class="results-name">{{ winnerName }}</div>
    </div>

    <div class="results-summary">
      <GameSummary :items="summaryItemsComputed" />
    </div>

    <div
      v-if="format === 'x' && showOpponentSummary"
      class="results-opponent"
    >
      {{ opponentSummaryText }}
    </div>

    <div class="results-buttons">
      <Button variant="blue" @click="$emit('newGame')">New Game</Button>
      <Button variant="secondary" @click="$emit('viewHistory')">View History</Button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import GameSummary from './GameSummary.vue'
import Button from './Button.vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  winnerName: {
    type: String,
    default: 'PlayerName'
  },
  /**
   * Format controls which win conditions are shown in the summary
   * 'x' (default): XTR, BST, OVR, SPF
   * 'burst':       BST, OVR, SPF
   * 'mfb-zero-g':  OVR, SPF
   * 'plastics-hms': OVR, SPF
   */
  format: {
    type: String,
    default: 'x',
    validator: (value) => ['x', 'burst', 'mfb-zero-g', 'plastics-hms'].includes(value)
  },
  /**
   * Optional edge-case line shown only for X format:
   * "Opponent: X OWF, Y PEN"
   */
  showOpponentSummary: {
    type: Boolean,
    default: false
  },
  opponentOwnFinishCount: {
    type: Number,
    default: 0
  },
  opponentPenaltyCount: {
    type: Number,
    default: 0
  },
  /**
   * Optional explicit summary items. If provided, overrides the format-based defaults.
   */
  summaryItems: {
    type: Array,
    default: null
  }
})

const summaryItemsComputed = computed(() => {
  if (Array.isArray(props.summaryItems) && props.summaryItems.length > 0) {
    return props.summaryItems
  }

  if (props.format === 'burst') {
    // Burst: no XTR
    return [
      { id: 'burst', label: 'BST', value: 0 },
      { id: 'over',  label: 'OVR', value: 0 },
      { id: 'spin',  label: 'SPF', value: 0 }
    ]
  }

  if (props.format === 'mfb-zero-g' || props.format === 'plastics-hms') {
    // Metal / Plastics / HMS: no XTR and no BST
    return [
      { id: 'over', label: 'OVR', value: 0 },
      { id: 'spin', label: 'SPF', value: 0 }
    ]
  }

  // X format (default): XTR, BST, OVR, SPF
  return [
    { id: 'xtreme', label: 'XTR', value: 0 },
    { id: 'burst',  label: 'BST', value: 0 },
    { id: 'over',   label: 'OVR', value: 0 },
    { id: 'spin',   label: 'SPF', value: 0 }
  ]
})

const opponentSummaryText = computed(() => {
  const hasOWF = props.opponentOwnFinishCount > 0
  const hasPEN = props.opponentPenaltyCount > 0
  
  if (hasOWF && hasPEN) {
    return `Opponent: ${props.opponentOwnFinishCount} OWF, ${props.opponentPenaltyCount} PEN`
  } else if (hasOWF) {
    return `Opponent: ${props.opponentOwnFinishCount} OWF`
  } else if (hasPEN) {
    return `Opponent: ${props.opponentPenaltyCount} PEN`
  }
  return ''
})

defineEmits(['newGame', 'viewHistory', 'close'])
</script>

<style scoped>
.game-results {
  background-color: #ffffff;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  position: relative;
}

.game-results-close {
  position: absolute;
  top: 20px;
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
}

.results-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.results-label {
  font-family: 'Titillium Web', sans-serif;
  font-size: 1rem; /* text-base */
  font-weight: 400;
  color: #64748b; /* #64748B */
  text-align: center;
}

.results-name {
  margin-top: 2px;
  font-family: 'Titillium Web', sans-serif;
  font-size: 1.125rem; /* text-lg */
  font-weight: 700;
  color: #334155;
  text-align: center;
}

.results-summary {
  margin-top: 24px;
  width: 100%;
}

.results-opponent {
  margin-top: 20px;
  width: 100%;
  font-family: 'Titillium Web', sans-serif;
  font-size: 0.875rem; /* text-sm */
  font-weight: 400;
  color: #94a3b8;
  text-align: center;
}

.results-buttons {
  margin-top: 24px;
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.results-buttons :deep(.custom-button) {
  flex: 1;
  width: 100%;
  font-weight: bold;
}
</style>


