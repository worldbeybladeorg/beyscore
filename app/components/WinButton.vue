<script setup lang="ts">
defineProps<{
  winName: string;
  isDisabled: boolean;
  isPlayer2: boolean;
}>();
</script>

<template>
  <Button
    :variant="isPlayer2 ? 'destructive' : 'default'"
    size="score"
    class="my-1"
    :disabled="isDisabled"
  >
    {{ winName }}
  </Button>
</template>
