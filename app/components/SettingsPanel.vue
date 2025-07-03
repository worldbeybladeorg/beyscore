<script setup lang="ts">

const store = useScoreboardStore();
</script>

<template>
  <div>
    <!-- <NavBar /> -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <ThemeSwitcher />
      </div>
      <div class="space-y-4">
        <div class="flex items-center justify-between rounded-lg border p-4">
          <Label for="judgeMode" class="text-base">Enable Judge Mode</Label>
          <Switch id="judgeMode" v-model="store.judgeMode" />
        </div>
        <div>
          <Label for="points-to-win" class="mb-2 block">Points to Win</Label>
          <Select v-model="store.pointsToWin">
            <SelectTrigger id="points-to-win">
              <SelectValue placeholder="Select points" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Points</SelectLabel>
                <SelectItem value="3"> 3 </SelectItem>
                <SelectItem value="4"> 4 </SelectItem>
                <SelectItem value="5"> 5 </SelectItem>
                <SelectItem value="7"> 7 </SelectItem>
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
