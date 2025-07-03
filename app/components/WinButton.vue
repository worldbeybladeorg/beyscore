<script setup lang="ts">
defineProps<{
  winName: string;
  isDisabled: boolean;
}>();

const emit = defineEmits<{
  clicked: [];
}>();
</script>

<template>
  <Button
    variant="secondary"
    size="score"
    class="my-1"
    :disabled="isDisabled"
    @click="emit('clicked')"
  >
    {{ winName }}
  </Button>
</template>
