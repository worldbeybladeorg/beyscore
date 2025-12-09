<script setup lang="ts">
// Documentation: https://nuxt.com/docs/api/composables/use-seo-meta
useSeoMeta({
  title: "WBO BeyScore",
  ogTitle: "WBO BeyScore",
  description:
    "The official score keeping app of the World Beyblade Organization.",
  ogDescription:
    "The official score keeping app of the World Beyblade Organization.",
  ogImage: "[og:image]",
  ogUrl: "https://beyscore.worldbeyblade.org",
  twitterTitle: "WBO BeyScore",
  twitterDescription:
    "The official score keeping app of the World Beyblade Organization.",
  twitterImage: "[twitter:image]",
  twitterCard: "summary",
});

useHead({
  htmlAttrs: {
    lang: "en",
  },
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: "/favicon.ico",
    },
  ],
});
</script>

<template>
  <NuxtPwaManifest />
  <!-- <ColorScheme placeholder="..." tag="div"> -->

  <NuxtPage />

  <!-- </ColorScheme> -->
</template>
