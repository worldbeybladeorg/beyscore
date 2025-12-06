import { computed, type Ref, type ComputedRef } from "vue";
import type { GenerationOption } from "~/stores/scoreboardStore";

export function useGameResults(
  matchWinner: ComputedRef<string | null>,
  generation: Ref<GenerationOption>,
  matchHistory: Ref<any[]>,
  player1Name: Ref<string>,
  player2Name: Ref<string>,
) {
  // Get untruncated player name for match history and winner messages
  const getPlayerDisplayNameFull = (playerKey: string) => {
    if (playerKey === "p1") return player1Name.value || "Player 1";
    if (playerKey === "p2") return player2Name.value || "Player 2";
    return "Player";
  };

  // Winner display text for PlayerName component
  const winnerDisplayText = computed(() => {
    if (!matchWinner.value) {
      return "";
    }
    const winnerName = getPlayerDisplayNameFull(matchWinner.value);
    return `${winnerName} Wins`;
  });

  // Winner name for GameResults card
  const winnerNameForResults = computed(() => {
    if (!matchWinner.value) {
      return "Player";
    }
    return getPlayerDisplayNameFull(matchWinner.value);
  });

  // Summary data for GameResults / GameSummary
  // Counts ALL scoring events for the winning player by win condition
  const gameSummaryItemsForResults = computed(() => {
    const isX = generation.value === "x";
    const isBurst = generation.value === "burst";
    const isMetalOrPlastics =
      generation.value === "mfb-zero-g" || generation.value === "plastics-hms";

    let xtr = 0;
    let bst = 0;
    let ovr = 0;
    let spf = 0;

    if (matchWinner.value) {
      const winnerKey = matchWinner.value;

      matchHistory.value.forEach((item) => {
        // Skip dividers (they don't have player/chipLabel)
        if (item.isGameDivider) return;

        // Only consider entries belonging to the match winner
        // This includes both regular scoring entries and game win entries
        if (item.player !== winnerKey) return;

        const label = item.chipLabel;

        // Skip Own Finish and Penalty entries (they're not win conditions for the winner)
        if (label === "Own" || label === "Penalty" || label === "Warning")
          return;

        if (isX) {
          if (label === "Xtreme") xtr++;
          else if (label === "Burst") bst++;
          else if (label === "Over") ovr++;
          else if (label === "Spin") spf++;
        } else if (isBurst) {
          if (label === "Burst") bst++;
          else if (label === "Over") ovr++;
          else if (label === "Spin") spf++;
        } else if (isMetalOrPlastics) {
          if (label === "Over") ovr++;
          else if (label === "Spin") spf++;
        }
      });
    }

    if (isX) {
      return [
        { id: "xtreme", label: "XTR", value: xtr },
        { id: "burst", label: "BST", value: bst },
        { id: "over", label: "OVR", value: ovr },
        { id: "spin", label: "SPF", value: spf },
      ];
    }

    if (isBurst) {
      return [
        { id: "burst", label: "BST", value: bst },
        { id: "over", label: "OVR", value: ovr },
        { id: "spin", label: "SPF", value: spf },
      ];
    }

    if (isMetalOrPlastics) {
      return [
        { id: "over", label: "OVR", value: ovr },
        { id: "spin", label: "SPF", value: spf },
      ];
    }

    return [];
  });

  // Opponent OWF / PEN counts for X format
  const opponentOwnFinishCount = computed(() => {
    if (generation.value !== "x" || !matchWinner.value) return 0;
    const opponentKey = matchWinner.value === "p1" ? "p2" : "p1";
    let count = 0;
    matchHistory.value.forEach((item) => {
      if (item.player === opponentKey && item.chipLabel === "Own") {
        count++;
      }
    });
    return count;
  });

  const opponentPenaltyCount = computed(() => {
    if (generation.value !== "x" || !matchWinner.value) return 0;
    const opponentKey = matchWinner.value === "p1" ? "p2" : "p1";
    let count = 0;
    matchHistory.value.forEach((item) => {
      if (item.player === opponentKey && item.chipLabel === "Penalty") {
        count++;
      }
    });
    return count;
  });

  return {
    winnerDisplayText,
    winnerNameForResults,
    gameSummaryItemsForResults,
    opponentOwnFinishCount,
    opponentPenaltyCount,
    getPlayerDisplayNameFull,
  };
}
