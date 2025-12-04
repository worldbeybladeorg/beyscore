<template>
  <div class="game-summary">
    <div
      v-for="(item, index) in items"
      :key="item.id || index"
      class="game-summary-item"
    >
      <div class="game-summary-label">{{ item.value }}</div>
      <div class="game-summary-value">{{ item.label }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  /**
   * items: Array of { id?: string|number, label: string, value: string }
   * Example default represents win conditions (Xtreme / Over / Burst / Spin).
   */
  items: {
    type: Array,
    default: () => ([
      { id: 'xtreme', label: 'XTR', value: 0 },
      { id: 'burst',  label: 'BST', value: 0 },
      { id: 'over',   label: 'OVR', value: 0 },
      { id: 'spin',   label: 'SPF', value: 0 }
    ])
  }
})
</script>

<style scoped>
.game-summary {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  height: 48px;
  width: 100%;
  /* No outer border or radius; only inner dividers between items */
  background-color: transparent;
  border-radius: 0;
  border: none;
  box-shadow: none;
  overflow: visible;
  box-sizing: border-box;
}

.game-summary-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
}

.game-summary-item + .game-summary-item {
  border-left: 1px solid #e2e8f0; /* slate-200 divider */
}

.game-summary-label {
  font-family: 'Titillium Web', sans-serif;
  font-size: 0.875rem; /* text-sm */
  font-weight: 400;
  line-height: 1.25rem;
  color: #64748b; /* slate-500 */
}

.game-summary-value {
  margin-top: 2px;
  font-family: 'Titillium Web', sans-serif;
  font-size: 1.125rem; /* text-lg */
  font-weight: 700;
  line-height: 1.5rem;
  color: #334155; /* slate-700-ish */
}
</style>


