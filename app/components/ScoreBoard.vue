<script setup lang="ts">
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
    <div class="col-12 flex h-full flex-col justify-center">
      <div class="relative flex items-center justify-center p-4">
        <div>
          <Sheet>
            <SheetTrigger as-child>
              <Button variant="outline" class="px-4"> History </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              class="flex w-full flex-col sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4"
            >
              <SheetHeader>
                <SheetTitle>Match History</SheetTitle>
              </SheetHeader>
              <div class="flex-1 overflow-y-auto">
                <MatchHistory />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <h3 class="px-8">{{ store.player1Name }}</h3>
        <h2 class="px-4 text-center text-3xl">BeyScore</h2>
        <h3 class="px-8">{{ store.player2Name }}</h3>

        <div>
          <Sheet>
            <SheetTrigger as-child>
              <Button variant="outline" class="px-4"> Settings </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              class="flex w-full flex-col sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4"
            >
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
                <SheetDescription>Set your match preferences.</SheetDescription>
              </SheetHeader>
              <div class="flex-1 overflow-y-auto p-4">
                <SettingsPanel />
              </div>
              <SheetFooter>
                <SheetClose as-child>
                  <Button variant="outline"> Close </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
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

      <!-- Match History is now in a sheet -->
    </div>
  </div>
</template>
