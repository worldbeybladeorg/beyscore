<script setup lang="ts">
const props = defineProps<{
  pointsToWin: number;
  player1Name: string;
  player2Name: string;
}>();

defineEmits(["reset"]);

const store = useScoreboardStore();

const player1Index = 0;
const player2Index = 1;

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
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <h2 class="text-center">BeyScore</h2>
        <div class="flex flex-row mt-4">
          <!-- Player 1 Section -->
          <PlayerSection
            :player-name="player1Name"
            :player-index="player1Index"
            :player-score="store.player1Score"
            :is-disabled="checkWinner() !== ''"
            :win-function="store.earnPoints"
            class="grow"
          />
          <div class="col text-center">
            <h3>Last Score</h3>
            <h4>{{ store.scoreReason }}</h4>

            <button class="btn btn-primary" @click="startCountdown">
              Countdown
            </button>
          </div>

          <!-- Player 2 Section -->
          <PlayerSection
            :player-name="player2Name"
            :player-index="player2Index"
            :player-score="store.player2Score"
            :is-disabled="checkWinner() !== ''"
            :win-function="store.earnPoints"
            class="grow"
          />
        </div>

        <!-- Display winner -->
        <div v-if="checkWinner()" class="mt-4 text-center">
          <h2 class="text-success">{{ checkWinner() }}</h2>
        </div>

        <div class="mt-4 text-center">
          <button
            class="btn btn-warning"
            :disabled="store.history.length === 0"
            @click="store.undoLastAction()"
          >
            Undo
          </button>
        </div>

        <div class="mt-4 text-center">
          <button
            class="btn btn-warning"
            @click="
              () => {
                store.reset();
                $emit('reset');
              }
            "
          >
            New Match
          </button>
        </div>

        <!-- History Table -->
        <div v-if="store.history.length > 0" class="mt-4">
          <h4 class="text-center">Score History</h4>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>{{ player1Name }} Score</th>
                <th>{{ player2Name }} Score</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entry, index) in store.history" :key="index">
                <td>{{ entry.player1Score }}</td>
                <td>{{ entry.player2Score }}</td>
                <td>{{ entry.reason }}</td>
              </tr>
              <tr>
                <td>{{ store.player1Score }}</td>
                <td>{{ store.player2Score }}</td>
                <td>{{ store.scoreReason }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
