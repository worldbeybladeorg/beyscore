<template>
  <div class="alert-container">
    <div class="alert-content">
      <div class="alert-title">{{ title }}</div>
      <div class="alert-message" v-html="formattedMessage"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Your game has already started'
  },
  message: {
    type: String,
    default: 'Adjusting game conditions will force reset this game if Save Changes is pressed.'
  }
})

const formattedMessage = computed(() => {
  return props.message.replace('Save Changes', '<strong>Save Changes</strong>')
})
</script>

<style scoped>
.alert-container {
  background: linear-gradient(to right, rgba(255, 251, 235, 1) 0%, rgba(255, 251, 235, 0) 100%);
  border-left: 2px solid #D97706;
  padding: 12px 20px;
  box-sizing: border-box;
  width: 100%;
}

.alert-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-title {
  font-family: 'Titillium Web', sans-serif;
  font-size: 1rem; /* text-base */
  font-weight: bold;
  color: #D97706;
  line-height: 1.5;
  margin: 0;
  padding: 0;
}

.alert-message {
  font-family: 'Titillium Web', sans-serif;
  font-size: 0.875rem; /* text-sm */
  font-weight: 400; /* regular */
  color: #475569;
  line-height: 1.5;
  margin: 0;
  padding: 0;
}

.alert-message :deep(strong) {
  font-weight: bold;
}
</style>

