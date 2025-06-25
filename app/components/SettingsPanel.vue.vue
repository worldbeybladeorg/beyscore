

<script lang="ts" setup>
const scoreToWin = ref(4);

const judgeMode = ref(true);

const store = useScoreboardStore();

function newMatch(matchScore: number) {
  store.reset();
  scoreToWin.value = matchScore;
  if (store.player1Name === "") {
    store.player1Name = "Player 1";
  }

  if (store.player2Name === "") {
    store.player2Name = "Player 2";
  }
}

function reset() {
  scoreToWin.value = 0;
}
</script>

<template>
  <div>
    <NavBar />
    <div v-if="scoreToWin === 0" class="container mt-4">
      <h2 class="text-center">Create a tournament</h2>
      <div>
        <Label for="player-1-name">Player 1 Name</Label>
        <Input
          id="player-1-name"
          v-model="store.player1Name"
          type="text"
          placeholder="Player 1"
          aria-label="Player 1 Name"
          aria-describedby="player-1-name"
        />
      </div>
      <div>
        <Label for="player-2-name">Player 2 Name</Label>
        <Input
          id="player-2-name"
          v-model="store.player2Name"
          type="text"
          placeholder="Player 2"
          aria-label="Player 2 Name"
          aria-describedby="player-2-name"
        />
      </div>
      <div class="flex flex-row">
        <Label for="judgeMode">Enable Judge Mode</Label>
        <Input
          id="judgeMode"
          v-model="judgeMode"
          type="checkbox"
          role="switch"
        />
      </div>
    </div>
    <div class="flex flex-row">
      <Label for="judgeMode">Enable Judge Mode</Label>
      <Input
        id="judgeMode"
        v-model="judgeMode"
        type="checkbox"
        role="switch"
      />
    </div>
    <div>Points to Win</div>
    <RadioGroup v-model="scoreToWin">
      <RadioGroupItem value="3" />
      <RadioGroupItem value="4" />
      <RadioGroupItem value="5" />
      <RadioGroupItem value="7" />
    </RadioGroup>
    <!-- <div class="btn-group" role="group" aria-label="Point Button Selector">
      <button type="button" class="btn btn-primary" @click="newMatch(3)">3 Points</button>
      <button type="button" class="btn btn-primary" @click="newMatch(4)">4 Points</button>
      <button type="button" class="btn btn-primary" @click="newMatch(5)">5 Points</button>
      <button type="button" class="btn btn-primary" @click="newMatch(7)">7 Points</button>
    </div> -->
    <PwaPrompt />
    <PwaInstallPrompt />
    <PwaBadge />
  </div>
</template>

<style>

</style>