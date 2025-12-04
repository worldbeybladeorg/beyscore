<template>
  <div class="match-history-item" :class="{ 'after-divider': isAfterDivider }">
    <div class="match-history-left">
      <div class="player-name-container">
        <div class="player-name">{{ playerName }}</div>
        <!-- Star appears for all entries after a set is won, but not for penalty receivers in penalty wins -->
        <ScoringStar 
          v-if="bestOf !== null && setWins > 0 && !(isPenaltyWin && player !== winner)"
          :player="isPenaltyWin ? winner : player"
          :count="setWins"
          :filledStars="filledStarsArray"
          class="history-star"
        />
      </div>
      <div class="match-score">{{ displayScore }}</div>
      <div v-if="winMessage" class="win-message">{{ winMessage }}</div>
    </div>
    <div class="match-history-right">
      <ScoringChip 
        v-if="isWarning"
        label="Error" 
        :score="0" 
        variant="warning" 
        :static="true" 
        :hideScore="true"
      />
      <ScoringChip 
        v-else-if="isPenalty"
        :label="chipLabel" 
        :score="1" 
        variant="warning" 
        :static="true" 
      />
      <ScoringChip 
        v-else-if="isGameWin && isPenaltyWin"
        :label="chipLabel" 
        :score="1" 
        variant="warning" 
        :static="true" 
      />
      <ScoringChip 
        v-else
        :label="chipLabel" 
        :score="chipScore" 
        :variant="player === 'p1' ? 'blue' : 'red'" 
        :static="true" 
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ScoringChip from './ScoringChip.vue'
import ScoringStar from './ScoringStar.vue'

const props = defineProps({
  generation: {
    type: String,
    default: 'x',
    validator: (value) => ['x', 'burst', 'mfb-zero-g', 'plastics-hms'].includes(value)
  },
  player: {
    type: String,
    default: 'p1',
    validator: (value) => ['p1', 'p2'].includes(value)
  },
  score1: {
    type: Number,
    default: 0
  },
  score2: {
    type: Number,
    default: 0
  },
  chipLabel: {
    type: String,
    default: 'Xtreme'
  },
  isFirst: {
    type: Boolean,
    default: false
  },
  isWarning: {
    type: Boolean,
    default: false
  },
  isPenalty: {
    type: Boolean,
    default: false
  },
  isGameWin: {
    type: Boolean,
    default: false
  },
  isPenaltyWin: {
    type: Boolean,
    default: false
  },
  bestOf: {
    type: Number,
    default: null,
    validator: (value) => value === null || [3, 5].includes(value)
  },
  setWins: {
    type: Number,
    default: 0
  },
  winner: {
    type: String,
    default: null,
    validator: (value) => value === null || ['p1', 'p2'].includes(value)
  },
  isAfterDivider: {
    type: Boolean,
    default: false
  }
})

const playerName = computed(() => {
  // For penalty wins, show the penalty receiver's name
  // But for display purposes, we'll show the winner's name in the win message
  return props.player === 'p1' ? 'Player 1' : 'Player 2'
})

// Get the player name to show next to the star (should be the winner for penalty wins)
const starPlayerName = computed(() => {
  if (props.isPenaltyWin && props.winner) {
    return props.winner === 'p1' ? 'Player 1' : 'Player 2'
  }
  return playerName.value
})

// Display score with scoring player first
const displayScore = computed(() => {
  const score = `${props.score1}-${props.score2}`
  if (props.isWarning) {
    return `${score} – Penalty Initiated`
  }
  if (props.isPenalty) {
    return `${score} – Penalty Scored`
  }
  if (props.isGameWin && props.isPenaltyWin) {
    // Special two-line format for penalty wins
    return `${score} – Penalty Scored`
  }
  if (props.isGameWin) {
    return `${score} – ${playerName.value} Wins`
  }
  return score
})

// Display win message separately for penalty wins
const winMessage = computed(() => {
  if (props.isGameWin && props.isPenaltyWin) {
    const winnerName = props.winner === 'p1' ? 'Player 1' : 'Player 2'
    return `${winnerName} Wins`
  }
  return null
})

// Get score for the chip based on label
const chipScore = computed(() => {
  const scoreMapping = {
    'Xtreme': 3,
    'Burst': 2,
    'Over': props.generation === 'mfb-zero-g' ? 1 : 2,
    'Spin': 1
  }
  return scoreMapping[props.chipLabel] || 3
})

// Create filled stars array - only filled stars, one per set win
const filledStarsArray = computed(() => {
  if (props.setWins === 0) return []
  const filled = []
  for (let i = 0; i < props.setWins; i++) {
    filled.push(true) // All stars are filled (only showing filled stars)
  }
  return filled
})
</script>

<style scoped>
.match-history-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0; /* slate-200 */
  box-sizing: border-box;
  margin-top: 0;
}

.match-history-item.after-divider {
  padding-bottom: 0 !important;
  border-bottom: none !important;
}

.match-history-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.player-name-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.player-name {
  font-family: 'Titillium Web', sans-serif;
  font-size: 1rem; /* text-base */
  font-weight: 700;
  color: #475569; /* slate-600 */
  margin: 0;
  padding: 0;
}

.history-star {
  flex-shrink: 0;
}

.match-score {
  font-family: 'Titillium Web', sans-serif;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500;
  color: #64748b; /* slate-500 */
  margin: 0;
  padding: 0;
  margin-top: 2px;
}

.win-message {
  font-family: 'Titillium Web', sans-serif;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500;
  color: #64748b; /* slate-500 */
  margin: 0;
  padding: 0;
  margin-top: 0;
}

.match-history-right {
  display: flex;
  align-items: center;
}
</style>

