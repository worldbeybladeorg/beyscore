<script setup lang="ts">
import { X } from "@lucide/vue";

interface Props {
  isOpen?: boolean;
  isClosing?: boolean;
  isLandscape?: boolean;
  matchHistory: MatchHistoryEntry[];
  generation?: GenerationOption;
  bestOf?: number;
  player1DisplayName?: string;
  player2DisplayName?: string;
  getPlayerDisplayNameFull: (player: string) => string;
}

withDefaults(defineProps<Props>(), {
  isOpen: false,
  isClosing: false,
  isLandscape: false,
  bestOf: undefined,
  player1DisplayName: "",
  player2DisplayName: "",
  generation: "x",
});

const emit = defineEmits<{
  close: [];
}>();

function isAfterDivider(index: number, matchHistory: MatchHistoryEntry[]) {
  if (index < matchHistory.length - 1) {
    const nextItem = matchHistory[index + 1];
    if (nextItem?.isGameDivider) {
      return true;
    }
  }
  return false;
}
</script>

<template>
  <div
    v-if="isOpen || isClosing"
    class="modal-backdrop"
    :class="[{ closing: isClosing }, isLandscape ? 'modal-backdrop-landscape' : '']"
    @click="emit('close')"
  >
    <div
      class="modal-content"
      :class="[{ closing: isClosing }, isLandscape ? 'modal-content-landscape' : '']"
      @click.stop
    >
      <h1 class="modal-title">Match History</h1>
      <button class="modal-close" @click="emit('close')">
        <X :size="24" color="#64748b" :stroke-width="2" />
      </button>

      <div class="match-history-list">
        <template v-for="(item, index) in matchHistory" :key="index">
          <div v-if="item.isGameDivider" class="game-divider">
            <div class="divider-line" />
            <div class="divider-text">
              <span v-if="item.isMatchConclusion"
                >Set {{ item.gameNumber }} –
                {{ getPlayerDisplayNameFull(item.winner) }} Wins</span
              >
              <span v-else>Set {{ item.gameNumber }}</span>
            </div>
            <div class="divider-line" />
          </div>
          <MatchHistoryItem
            v-else
            :generation="generation"
            :player="item.player"
            :score1="item.score1"
            :score2="item.score2"
            :chip-label="item.chipLabel"
            :is-first="index === 0"
            :is-warning="item.isWarning || false"
            :is-penalty="item.isPenalty || false"
            :is-game-win="item.isGameWin || false"
            :is-penalty-win="item.isPenaltyWin || false"
            :best-of="bestOf"
            :set-wins="item.setWins || 0"
            :winner="item.winner"
            :player1-name="player1DisplayName"
            :player2-name="player2DisplayName"
            :is-after-divider="isAfterDivider(index, matchHistory)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
  background: linear-gradient(
    to right,
    transparent 0%,
    transparent 50%,
    rgba(2, 6, 23, 0.6) 50%,
    rgba(2, 6, 23, 0.6) 100%
  );
}

.modal-backdrop.closing {
  animation: fadeOut 0.3s ease-out;
}

.modal-content {
  position: absolute;
  top: 0;
  left: 0;
  right: max(0px, calc(20px - env(safe-area-inset-right, 0px)));
  width: auto;
  max-width: calc(100vw - 20px);
  height: 100%;
  background-color: white;
  z-index: 1001;
  animation: slideInFromLeft 0.3s ease-out;
  will-change: transform;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0;
}

.modal-content.closing {
  animation: slideOutToLeft 0.3s ease-out;
}

.modal-title {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 44px;
  font-family: "Titillium Web", sans-serif;
  font-size: 1.125rem;
  font-weight: bold;
  color: #334155;
  margin: 0;
  padding: 0;
  line-height: 1.5;
  width: auto;
  box-sizing: border-box;
}

.match-history-list {
  position: absolute;
  top: calc(20px + 1.6875rem + 24px);
  left: 20px;
  right: 20px;
  bottom: 0;
  width: auto;
  box-sizing: border-box;
  overflow-y: auto;
  padding-bottom: 20px;
}

.match-history-list > :first-child {
  margin-top: 0;
}

.match-history-list > :not(:first-child) {
  margin-top: 12px;
}

.game-divider {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  margin-bottom: 0;
  padding: 0;
  width: 100%;
}

.divider-line {
  flex: 1;
  height: 1px;
  background-color: #e2e8f0;
}

.divider-text {
  font-family: "Titillium Web", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  padding: 0 12px;
  white-space: nowrap;
}

.modal-close {
  position: absolute;
  top: 24px;
  right: 20px;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal-close:hover {
  opacity: 0.9;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInFromLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes slideOutToLeft {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

/* Landscape overrides */
.modal-backdrop-landscape {
  background: rgba(2, 6, 23, 0.6);
}

.modal-content-landscape {
  right: auto;
  width: 90%;
  max-width: none;
}
</style>
