<script setup lang="ts">
import { Generation } from "~/types/generations";

const store = useScoreboardStore();
</script>

<template>
  <div>
    <!-- <NavBar /> -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div class="space-y-4">
        <div>
          <Label for="player-1-name">Player 1 Name</Label>
          <Input
            id="player-1-name"
            v-model="store.player1Name"
            type="text"
            placeholder="Player 1"
          />
        </div>
        <div>
          <Label for="player-2-name">Player 2 Name</Label>
          <Input
            id="player-2-name"
            v-model="store.player2Name"
            type="text"
            placeholder="Player 2"
          />
        </div>
        <div
          v-if="store.generation === Generation.X"
          class="flex items-center justify-between rounded-lg border p-4"
        >
          <Label for="ownFinish" class="text-base">Enable Own Finish</Label>
          <Switch id="ownFinish" v-model="store.ownFinishEnabled" />
        </div>
        <ThemeSwitcher />
      </div>
      <div class="space-y-4">
        <DevOnly>
          <div class="flex items-center justify-between rounded-lg border p-4">
            <Label for="judgeMode" class="text-base">Enable Judge Mode</Label>
            <Switch id="judgeMode" v-model="store.judgeMode" />
          </div>
        </DevOnly>
        <div>
          <Label for="points-to-win" class="mb-2 block">Points to Win</Label>
          <Select
            v-model="store.pointsToWin"
            :default-value="store.pointsToWin"
          >
            <SelectTrigger id="points-to-win">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Points</SelectLabel>
                <SelectItem v-if="store.generation !== Generation.X" value="3"
                  >3</SelectItem
                >
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem v-if="store.generation === Generation.X" value="7"
                  >7</SelectItem
                >
                <SelectItem value="Infinity">No Limit</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label for="generatiojn" class="mb-2 block">Generation</Label>
          <Select v-model="store.generation" :default-value="store.generation">
            <SelectTrigger id="generation">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Generation</SelectLabel>
                <template v-for="generation in Generation" :key="generation">
                  <SelectItem :value="generation">{{ generation }}</SelectItem>
                </template>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
    <div class="mt-6 text-center">
      <Button variant="destructive" @click="store.reset()"
        >Reset Settings</Button
      >
    </div>
    <PwaPrompt />
    <PwaInstallPrompt />
    <PwaBadge />
  </div>
</template>
