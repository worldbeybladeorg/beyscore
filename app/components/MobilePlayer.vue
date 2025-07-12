<script setup lang="ts">
import type { EarnPointArgs } from "../types/earnPointArgs";

defineProps<{
  playerName: string;
  playerIndex: number;
  playerScore: number;
  isDisabled: boolean;
  winFunction: (args: EarnPointArgs) => void;
  rotated: boolean;
}>();
</script>

<template>
  <div
    class="score-container col-12 text-center"
    :class="rotated ? 'rotated-content' : ''"
  >
    <h3 class="player-name mb-3">{{ playerName }}</h3>
    <div class="score-display mb-3">{{ playerScore }}</div>
    <div class="btn-group">
      <WinButton
        win-name="Spin"
        :is-disabled="isDisabled"
        @clicked="
          winFunction({
            Points: 1,
            Player: playerIndex,
            Reason: `${playerName} Spin Finish`,
          })
        "
      />
      <WinButton
        win-name="Over"
        :is-disabled="isDisabled"
        @clicked="
          winFunction({
            Points: 2,
            Player: playerIndex,
            Reason: `${playerName} Over Finish`,
          })
        "
      />
      <WinButton
        win-name="Burst"
        :is-disabled="isDisabled"
        @clicked="
          winFunction({
            Points: 2,
            Player: playerIndex,
            Reason: `${playerName} Burst Finish`,
          })
        "
      />
      <WinButton
        win-name="Xtreme"
        :is-disabled="isDisabled"
        @clicked="
          winFunction({
            Points: 3,
            Player: playerIndex,
            Reason: `${playerName} Xtreme Finish`,
          })
        "
      />
      <WinButton
        win-name="Launch Error"
        :is-disabled="isDisabled"
        @clicked="
          winFunction({
            Points: 1,
            Player: playerIndex,
            Reason: `${playerName} Opponent Launch Error`,
          })
        "
      />
    </div>
  </div>
</template>

<style scoped>
.score-container {
  text-align: center;
  width: 100%;
}

.rotated-content {
  transform: rotate(180deg);
}

.score-display {
  font-size: 4rem;
  font-weight: bold;
}
</style>
