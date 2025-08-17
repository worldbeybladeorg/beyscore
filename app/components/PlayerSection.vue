<script setup lang="ts">
import type { EarnPointArgs } from "../types/earnPointArgs";
import { Generation } from "../types/generations";

const props = defineProps<{
  playerName: string;
  playerIndex: number;
  playerScore: number;
  isDisabled: boolean;
  winFunction: (args: EarnPointArgs) => void;
}>();

const store = useScoreboardStore();

const errorText = computed(() => {
  switch (props.playerIndex) {
    case 0:
      if (store.player1Error < 1) {
        return "Error";
      } else {
        return "Penalty";
      }
    case 1:
      if (store.player2Error < 1) {
        return "Error";
      } else {
        return "Penalty";
      }
    default:
      break;
  }
  return `Error`;
});

function scoreLaunchError() {
  props.winFunction({
    Points: 1,
    Player: props.playerIndex === 0 ? 1 : 0,
    Reason: `${props.playerName} Opponent Launch Error`,
  });
}

function trackLaunchError() {
  switch (props.playerIndex) {
    case 0:
      store.player1Error++;
      if (store.player1Error > 1) {
        scoreLaunchError();
        store.player1Error = 0;
      }
      break;
    case 1:
      store.player2Error++;
      if (store.player2Error > 1) {
        scoreLaunchError();
        store.player2Error = 0;
      }
      break;
    default:
      break;
  }
}

function resetLaunchError() {
  store.player1Error = 0;
  store.player2Error = 0;
}
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div class="flex flex-row">
      <h4 v-if="playerIndex === 1" class="m-24 grow text-7xl">
        {{ playerScore }}
      </h4>
      <div
        :class="`flex max-w-24 flex-col ${playerIndex ? 'justify-items-end' : 'justify-items-start'} justify-center`"
      >
        <WinButton
          v-if="store.generation === Generation.X"
          win-name="Xtreme +3"
          :is-disabled="isDisabled"
          :is-player-2="playerIndex === 1"
          @click="
            resetLaunchError();
            winFunction({
              Points: 3,
              Player: playerIndex,
              Reason: `${playerName} Xtreme Finish`,
            });
          "
        />
        <WinButton
          :win-name="`Over + ${store.generation !== Generation.PLA_MFB ? 2 : 1}`"
          :is-disabled="isDisabled"
          :is-player-2="playerIndex === 1"
          @click="
            resetLaunchError();
            winFunction({
              Points: store.generation !== Generation.PLA_MFB ? 2 : 1,
              Player: playerIndex,
              Reason: `${playerName} Over Finish`,
            });
          "
        />
        <WinButton
          v-if="store.generation !== Generation.PLA_MFB"
          win-name="Burst +2"
          :is-disabled="isDisabled"
          :is-player-2="playerIndex === 1"
          @click="
            resetLaunchError();
            winFunction({
              Points: 2,
              Player: playerIndex,
              Reason: `${playerName} Burst Finish`,
            });
          "
        />
        <WinButton
          win-name="Spin +1"
          :is-disabled="isDisabled"
          :is-player-2="playerIndex === 1"
          @click="
            resetLaunchError();
            winFunction({
              Points: 1,
              Player: playerIndex,
              Reason: `${playerName} Spin Finish`,
            });
          "
        />
        <template v-if="store.generation === Generation.X"
          ><WinButton
            v-if="store.ownFinishEnabled"
            win-name="Own Finish"
            :is-player-2="playerIndex === 1"
            :is-disabled="isDisabled"
            @click="
              resetLaunchError();
              winFunction({
                Points: 1,
                Player: playerIndex,
                Reason: `${playerName} Own Finish`,
              });
            "
          />
          <WinButton
            :win-name="errorText"
            :is-player-2="playerIndex === 1"
            :is-disabled="isDisabled"
            @click="trackLaunchError()"
          />
        </template>
      </div>
      <h4 v-if="playerIndex === 0" class="m-24 grow text-7xl">
        {{ playerScore }}
      </h4>
    </div>
  </div>
</template>
