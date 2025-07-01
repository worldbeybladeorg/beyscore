<script setup lang="ts">
// Documentation: https://nuxt.com/docs/api/composables/use-seo-meta
useSeoMeta({
  title: "WBO BeyScore",
  ogTitle: "WBO BeyScore",
  description:
    "The official score keeping app of the World Beyblade Organization.",
  ogDescription:
    "The official score keeping app of the World Beyblade Organization.",
});

const store = useScoreboardStore();

// if (store.player1Name === "") {
//   store.player1Name = "Player 1";
// }
//
// if (store.player2Name === "") {
//   store.player2Name = "Player 2";
// }


</script>

<template>
  <NuxtPwaManifest />
  <ColorScheme placeholder="..." tag="div">
    <!-- <NavBar /> -->
    <!-- <div v-if="scoreToWin === 0" class="container mt-4"> -->
    <!--   <h2 class="text-center">Create a tournament</h2> -->
    <!--   <div> -->
    <!--     <label for="player-1-name" class="form-label">Player 1 Name</label> -->
    <!--     <input -->
    <!--       id="player-1-name" -->
    <!--       v-model="store.player1Name" -->
    <!--       type="text" -->
    <!--       class="form-control" -->
    <!--       placeholder="Player 1" -->
    <!--       aria-label="Player 1 Name" -->
    <!--       aria-describedby="player-1-name" -->
    <!--     /> -->
    <!--   </div> -->
    <!---->
    <!--   <div> -->
    <!--     <label for="player-2-name" class="form-label">Player 2 Name</label> -->
    <!--     <input -->
    <!--       v-model="store.player2Name" -->
    <!--       type="text" -->
    <!--       class="form-control" -->
    <!--       placeholder="Player 2" -->
    <!--       aria-label="Player 2 Name" -->
    <!--       aria-describedby="player-2-name" -->
    <!--     /> -->
    <!--   </div> -->
    <!---->
    <!--   <div class="form-check form-switch"> -->
    <!--     <label class="form-check-label" for="judgeMode" -->
    <!--       >Enable Judge Mode</label -->
    <!--     > -->
    <!--     <input -->
    <!--       id="judgeMode" -->
    <!--       v-model="judgeMode" -->
    <!--       class="form-check-input" -->
    <!--       type="checkbox" -->
    <!--       role="switch" -->
    <!--     /> -->
    <!--   </div> -->
    <!---->
    <!--   <div>Points to Win</div> -->
    <!--   <div class="btn-group" role="group" aria-label="Point Button Selector"> -->
    <!--     <button type="button" class="btn btn-primary" @click="newMatch(3)"> -->
    <!--       3 Points -->
    <!--     </button> -->
    <!--     <button type="button" class="btn btn-primary" @click="newMatch(4)"> -->
    <!--       4 Points -->
    <!--     </button> -->
    <!--     <button type="button" class="btn btn-primary" @click="newMatch(5)"> -->
    <!--       5 Points -->
    <!--     </button> -->
    <!--     <button type="button" class="btn btn-primary" @click="newMatch(7)"> -->
    <!--       7 Points -->
    <!--     </button> -->
    <!--   </div> -->
    <!---->
    <!--   <PwaPrompt /> -->
    <!--   <PwaInstallPrompt /> -->
    <!--   <PwaBadge /> -->
    <!-- </div> -->

    <ScoreBoard v-if="store.judgeMode" hydrate-on-visible />

    <!-- <MobileScoreBoard -->
    <!--   v-if="scoreToWin !== 0 && !judgeMode" -->
    <!--   hydrate-on-visible -->
    <!--   :points-to-win="scoreToWin" -->
    <!--   :player1-name="store.player1Name" -->
    <!--   :player2-name="store.player2Name" -->
    <!--   @reset="reset" -->
    <!-- /> -->
  </ColorScheme>
</template>
