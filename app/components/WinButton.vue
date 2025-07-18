<script setup lang="ts">
defineProps<{
  winName: string;
  isDisabled: boolean;
}>();
</script>

<template>
  <Button variant="secondary" size="score" class="my-1" :disabled="isDisabled">
    {{ winName }}
  </Button>
</template>
