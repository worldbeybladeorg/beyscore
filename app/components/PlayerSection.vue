<script setup lang="ts">
import type { EarnPointArgs } from "../types/earnPointArgs";

defineProps<{
  playerName: string;
  playerIndex: number;
  playerScore: number;
  isDisabled: boolean;
  winFunction: (args: EarnPointArgs) => void;
}>();
</script>

<template>
  <div class="flex flex-row">
    <h3>{{ playerName }}</h3>
    <div
      :class="`flex flex-col max-w-24 ${playerIndex ? 'justify-items-end' : 'justify-items-start'}`"
    >
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
    <h4 class="text-7xl grow m-24">{{ playerScore }}</h4>
  </div>
</template>
