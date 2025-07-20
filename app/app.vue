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
</script>

<template>
  <NuxtPwaManifest />
  <ColorScheme placeholder="..." tag="div">
    <ScoreBoard v-if="store.judgeMode" />

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
