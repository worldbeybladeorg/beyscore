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
  <Button :disabled="isDisabled" @click="emit('clicked')">
    {{ winName }}
  </Button>
</template>
