import { ref } from 'vue'

// Shared game state that persists across component switches
const player1Score = ref(0)
const player2Score = ref(0)
const player1NameSetting = ref('Player 1')
const player2NameSetting = ref('Player 2')
const matchHistory = ref([])
const p1SetWins = ref([])
const p2SetWins = ref([])
const p1ShowWarning = ref(false)
const p2ShowWarning = ref(false)
const currentGameNumber = ref(1)
const displayedSetNumber = ref(1)
const winningChipLabel = ref(null)
const isScoreFadingIn = ref(false)
const isScoreShrinking = ref(false)
const pendingGameReset = ref(false)
const history = ref([{
  player1: 0,
  player2: 0,
  p1SetWins: [],
  p2SetWins: [],
  p1ShowWarning: false,
  p2ShowWarning: false,
  matchHistory: [],
  currentGameNumber: 1
}])
const historyIndex = ref(0)
const showGameResultsOverlay = ref(false)
const gameResultsOverlayHasBeenShown = ref(false)

export function useGameState() {
  return {
    player1Score,
    player2Score,
    player1NameSetting,
    player2NameSetting,
    matchHistory,
    p1SetWins,
    p2SetWins,
    p1ShowWarning,
    p2ShowWarning,
    currentGameNumber,
    displayedSetNumber,
    winningChipLabel,
    isScoreFadingIn,
    isScoreShrinking,
    pendingGameReset,
    history,
    historyIndex,
    showGameResultsOverlay,
    gameResultsOverlayHasBeenShown
  }
}

