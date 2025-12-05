<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// Detect if viewport is desktop/tablet (>= 768px width) OR mobile in landscape orientation
const isDesktopOrTablet = ref(false);

const checkViewport = () => {
  const width = window.innerWidth;
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  // Show landscape view if: desktop/tablet (>= 768px) OR mobile in landscape
  isDesktopOrTablet.value = width >= 768 || (width < 768 && isLandscape);
};

onMounted(() => {
  checkViewport();
  window.addEventListener("resize", checkViewport);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkViewport);
});
</script>

<template>
  <GameScreenLandscape v-if="isDesktopOrTablet" />
  <GameScreen v-else />
</template>
