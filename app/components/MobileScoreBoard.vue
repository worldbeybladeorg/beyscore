<script setup lang="ts">
const props = defineProps<{
  pointsToWin: number;
  player1Name: string;
  player2Name: string;
}>();

defineEmits(["reset"]);

const player1Index = 0;
const player2Index = 1;

const store = useScoreboardStore();

function checkWinner() {
  if (store.player1Score >= props.pointsToWin) {
    return `${props.player1Name} Wins!`;
  } else if (store.player2Score >= props.pointsToWin) {
    return `${props.player2Name} Wins!`;
  }
  return "";
}

const { play } = useSound("/sounds/countdown.mp3");

function startCountdown() {
  play();
}
</script>

<template>
  <div class="flex-co vh-100 container flex">
    <!-- App Header -->
    <div class="row py-2">
      <div class="col-12 text-center">
        <h2>BeyScore</h2>
      </div>
    </div>

    <!-- Player 1 Section (Top, Rotated) -->
    <div class="row flex-grow">
      <MobilePlayer
        :player-name="player1Name"
        :player-index="player1Index"
        :player-score="store.player1Score"
        :is-disabled="checkWinner() !== ''"
        :win-function="store.earnPoints"
        :rotated="true"
      />
    </div>

    <!-- Middle Section with Countdown, Undo Button and Last Score -->
    <div class="row my-2">
      <div class="col-12 text-center">
        <div class="mb-2">
          <Button @click="startCountdown"> Countdown </Button>
          <Button
            class="btn btn-warning btn-lg"
            :disabled="store.history.length === 0"
            @click="store.undoLastAction"
          >
            Undo
          </Button>
        </div>

        <div class="last-score mt-2">
          <small>Last Score:</small>
          <div>{{ store.scoreReason || "No scores yet" }}</div>
        </div>

        <!-- Winner Display -->
        <div v-if="checkWinner()" class="winner-alert mt-2">
          <h4 class="text-success">{{ checkWinner() }}</h4>
          <Button class="btn btn-primary mt-2" @click="$emit('reset')">
            New Match
          </Button>
        </div>
      </div>
    </div>

    <!-- Player 2 Section (Bottom) -->
    <div class="row flex-grow-1">
      <MobilePlayer
        :player-name="player2Name"
        :player-index="player2Index"
        :player-score="store.player2Score"
        :is-disabled="checkWinner() !== ''"
        :win-function="store.earnPoints"
        :rotated="false"
      />
    </div>

    <!-- Bottom Controls -->
    <div class="row py-2">
      <div class="col-12 text-center">
        <Button variant="destructive" @click="$emit('reset')">
          Reset Game
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vh-100 {
  min-height: 100vh;
}

.player-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.last-score {
  font-size: 0.9rem;
  color: #6c757d;
}

.winner-alert {
  background-color: rgba(40, 167, 69, 0.1);
  padding: 0.5rem;
  border-radius: 5px;
}
</style>
