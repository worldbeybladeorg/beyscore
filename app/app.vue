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
</script>

<template>
  <NuxtPwaManifest />
  <!-- <ColorScheme placeholder="..." tag="div"> -->

  <NuxtPage />

  <!-- </ColorScheme> -->
</template>
