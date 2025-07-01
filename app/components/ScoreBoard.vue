<script setup lang="ts">
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import SettingsPanel from "./SettingsPanel.vue";

const store = useScoreboardStore();

const player1Index = 0;
const player2Index = 1;

function checkWinner() {
  if (store.player1Score >= store.pointsToWin) {
    return `${store.player1Name} Wins!`;
  } else if (store.player2Score >= store.pointsToWin) {
    return `${store.player2Name} Wins!`;
  }
  return "";
}

const { play } = useSound("/sounds/countdown.mp3");

function startCountdown() {
  play();
}
</script>

<template>
  <div class="size-screen">
    <div class="col-12 h-full flex flex-col justify-center">
      <h2 class="text-center text-3xl">BeyScore</h2>
      <div class="flex flex-row justify-center">
        <!-- Player 1 Section -->
        <PlayerSection
          :player-name="store.player1Name"
          :player-index="player1Index"
          :player-score="store.player1Score"
          :is-disabled="checkWinner() !== ''"
          :win-function="store.earnPoints"
        />
        <div class="col text-center">
          <h3>Last Score</h3>
          <h4>{{ store.scoreReason }}</h4>

          <Button @click="startCountdown"> Countdown </Button>

          <Drawer>
            <DrawerTrigger as-child>
              <Button variant="outline" class="mt-4"> Settings </Button>
            </DrawerTrigger>
            <DrawerContent
              class="h-screen top-0 right-0 left-auto mt-0 w-full rounded-none flex flex-col"
            >
              <DrawerHeader>
                <DrawerTitle>Settings</DrawerTitle>
                <DrawerDescription
                  >Set your match preferences.</DrawerDescription
                >
              </DrawerHeader>
              <div class="p-4 flex-1 overflow-y-auto">
                <SettingsPanel />
              </div>
              <DrawerFooter>
                <DrawerClose as-child>
                  <Button variant="outline"> Close </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        <!-- Player 2 Section -->
        <PlayerSection
          :player-name="store.player2Name"
          :player-index="player2Index"
          :player-score="store.player2Score"
          :is-disabled="checkWinner() !== ''"
          :win-function="store.earnPoints"
        />
      </div>

      <!-- Display winner -->
      <div v-if="checkWinner()" class="mt-4 text-center">
        <h2 class="text-success">{{ checkWinner() }}</h2>
      </div>

      <div class="mt-4 text-center">
        <Button
          variant="secondary"
          :disabled="store.history.length === 0"
          @click="store.undoLastAction()"
        >
          Undo
        </Button>
      </div>

      <div class="mt-4 text-center">
        <Button variant="destructive" @click="store.reset()">
          New Match
        </Button>
      </div>

      <!-- History Table -->
      <MatchHistory />
    </div>
  </div>
</template>
