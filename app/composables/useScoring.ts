import type { Ref, ComputedRef } from "vue";
import { getChipTypeForHistory } from "~/lib/gameUtils";
import type { BestOfOption, GenerationOption } from "~/stores/scoreboardStore";

interface ScoringDependencies {
  player1Score: Ref<number>;
  player2Score: Ref<number>;
  maxPoints: ComputedRef<number | null>;
  p1SetWins: Ref<boolean[]>;
  p2SetWins: Ref<boolean[]>;
  p1ShowWarning: Ref<boolean>;
  p2ShowWarning: Ref<boolean>;
  matchHistory: Ref<any[]>;
  currentGameNumber: Ref<number>;
  bestOf: Ref<BestOfOption>;
  winningChipLabel: Ref<string | null>;
  generation: Ref<GenerationOption>;
  saveState: () => void;
}

export function useScoring(dependencies: ScoringDependencies) {
  const {
    player1Score,
    player2Score,
    maxPoints,
    p1SetWins,
    p2SetWins,
    p1ShowWarning,
    p2ShowWarning,
    matchHistory,
    currentGameNumber,
    bestOf,
    winningChipLabel,
    generation,
    saveState,
  } = dependencies;

  // Handle score increase - max points is the target to win
  // Once a player reaches or exceeds the target, the game ends and no further increases are allowed
  // For example, in "first to 5", a player can get 6 points from 3 OVRs (+2 each), ending the game
  function handlePlayer1ScoreIncrease(points: number, chipLabel: string) {
    let scoreChanged = false;
    let gameWillEnd = false;

    // If there's a max points limit and player hasn't reached it yet
    if (maxPoints.value !== null) {
      // Only allow increase if current score is below the target (game hasn't ended)
      if (player1Score.value < maxPoints.value) {
        // Check if this will end the game
        gameWillEnd = player1Score.value + points >= maxPoints.value;

        player1Score.value += points;
        scoreChanged = true;
        // After increase, if they reached/exceeded target, game ends (no further increases possible)
      }
    } else {
      // No limit - always allow increase
      player1Score.value += points;
      scoreChanged = true;
    }

    // Save state after change if score actually changed
    // If this action ends the game, save BEFORE set win is recorded (so undo can revert this action)
    if (scoreChanged) {
      // Reset all warnings when any point is scored
      p1ShowWarning.value = false;
      p2ShowWarning.value = false;

      // Track the chip that ended the game
      if (chipLabel && gameWillEnd) {
        winningChipLabel.value = chipLabel;
      }
      // Add to match history if score changed and chip label provided
      // BUT don't add if this action ends the game - the game win entry will be added instead
      if (chipLabel && !gameWillEnd) {
        // Determine which chip to show based on generation and chip label
        const chipType = getChipTypeForHistory(chipLabel, generation.value);
        // Calculate set wins count for player 1

        const p1SetWinsCount =
          bestOf.value !== undefined
            ? p1SetWins.value.filter((won) => won).length
            : 0;
        matchHistory.value.unshift({
          player: "p1",
          score1: player1Score.value,
          score2: player2Score.value,
          chipLabel: chipType,
          setWins: p1SetWinsCount,
        });
      }
      saveState();
    }
  }

  function handlePlayer2ScoreIncrease(points: number, chipLabel: string) {
    let scoreChanged = false;
    let gameWillEnd = false;

    // If there's a max points limit and player hasn't reached it yet
    if (maxPoints.value !== null) {
      // Only allow increase if current score is below the target (game hasn't ended)
      if (player2Score.value < maxPoints.value) {
        // Check if this will end the game
        gameWillEnd = player2Score.value + points >= maxPoints.value;

        player2Score.value += points;
        scoreChanged = true;
        // After increase, if they reached/exceeded target, game ends (no further increases possible)
      }
    } else {
      // No limit - always allow increase
      player2Score.value += points;
      scoreChanged = true;
    }

    // Save state after change if score actually changed
    // If this action ends the game, save BEFORE set win is recorded (so undo can revert this action)
    if (scoreChanged) {
      // Reset all warnings when any point is scored
      p1ShowWarning.value = false;
      p2ShowWarning.value = false;

      // Track the chip that ended the game
      if (chipLabel && gameWillEnd) {
        winningChipLabel.value = chipLabel;
      }
      // Add to match history if score changed and chip label provided
      // BUT don't add if this action ends the game - the game win entry will be added instead
      if (chipLabel && !gameWillEnd) {
        // Determine which chip to show based on generation and chip label
        const chipType = getChipTypeForHistory(chipLabel, generation.value);
        // Calculate set wins count for player 2

        const p2SetWinsCount =
          bestOf.value !== undefined
            ? p2SetWins.value.filter((won) => won).length
            : 0;
        matchHistory.value.unshift({
          player: "p2",
          score1: player2Score.value,
          score2: player1Score.value,
          chipLabel: chipType,
          setWins: p2SetWinsCount,
        });
      }
      saveState();
    }
  }

  // Handle Own Finish from Player 1 - give +1 to Player 2
  function handlePlayer1OwnFinish() {
    let scoreChanged = false;
    if (maxPoints.value !== null) {
      if (player2Score.value < maxPoints.value) {
        player2Score.value += 1;
        scoreChanged = true;
      }
    } else {
      player2Score.value += 1;
      scoreChanged = true;
    }
    // Add to match history when own finish is issued
    if (scoreChanged) {
      const p1SetWinsCount =
        bestOf.value !== undefined
          ? p1SetWins.value.filter((won) => won).length
          : 0;
      matchHistory.value.unshift({
        player: "p1",
        score1: player1Score.value,
        score2: player2Score.value,
        chipLabel: "Own",
        isPenalty: true,
        setWins: p1SetWinsCount,
      });
      saveState();
    }
  }

  // Handle Own Finish from Player 2 - give +1 to Player 1
  function handlePlayer2OwnFinish() {
    let scoreChanged = false;
    if (maxPoints.value !== null) {
      if (player1Score.value < maxPoints.value) {
        player1Score.value += 1;
        scoreChanged = true;
      }
    } else {
      player1Score.value += 1;
      scoreChanged = true;
    }
    // Add to match history when own finish is issued
    if (scoreChanged) {
      const p2SetWinsCount =
        bestOf.value !== undefined
          ? p2SetWins.value.filter((won) => won).length
          : 0;
      matchHistory.value.unshift({
        player: "p2",
        score1: player2Score.value,
        score2: player1Score.value,
        chipLabel: "Own",
        isPenalty: true,
        setWins: p2SetWinsCount,
      });
      saveState();
    }
  }

  // Handle penalty from Player 1 - give point to Player 2 (opposing player)
  function handlePlayer1Penalty() {
    let scoreChanged = false;

    // Check if game hasn't ended and not at max points limit
    if (maxPoints.value !== null) {
      // Only allow increase if current score is below the target (game hasn't ended)
      if (player2Score.value < maxPoints.value) {
        player2Score.value += 1; // Award 1 point to opposing player
        scoreChanged = true;
      }
    } else {
      // No limit - always allow increase
      player2Score.value += 1;
      scoreChanged = true;
    }

    // Add to match history when penalty is issued
    if (scoreChanged) {
      const p1SetWinsCount =
        bestOf.value !== undefined
          ? p1SetWins.value.filter((won) => won).length
          : 0;
      matchHistory.value.unshift({
        player: "p1",
        score1: player1Score.value,
        score2: player2Score.value,
        chipLabel: "Penalty",
        isPenalty: true,
        setWins: p1SetWinsCount,
      });
    }

    // Reset warning state after penalty is issued
    p1ShowWarning.value = false;

    // Save state after penalty point is awarded (integrates with undo/redo)
    if (scoreChanged) {
      saveState();
    }
  }

  // Handle penalty from Player 2 - give point to Player 1 (opposing player)
  function handlePlayer2Penalty() {
    let scoreChanged = false;

    // Check if game hasn't ended and not at max points limit
    if (maxPoints.value !== null) {
      // Only allow increase if current score is below the target (game hasn't ended)
      if (player1Score.value < maxPoints.value) {
        player1Score.value += 1; // Award 1 point to opposing player
        scoreChanged = true;
      }
    } else {
      // No limit - always allow increase
      player1Score.value += 1;
      scoreChanged = true;
    }

    // Add to match history when penalty is issued
    if (scoreChanged) {
      const p2SetWinsCount =
        bestOf.value !== undefined
          ? p2SetWins.value.filter((won) => won).length
          : 0;
      matchHistory.value.unshift({
        player: "p2",
        score1: player2Score.value,
        score2: player1Score.value,
        chipLabel: "Penalty",
        isPenalty: true,
        setWins: p2SetWinsCount,
      });
    }

    // Reset warning state after penalty is issued
    p2ShowWarning.value = false;

    // Save state after penalty point is awarded (integrates with undo/redo)
    if (scoreChanged) {
      saveState();
    }
  }

  // Handle warning toggle for Player 1 (ERR -> PEN state change)
  function handlePlayer1WarningToggle() {
    p1ShowWarning.value = !p1ShowWarning.value;
    // Add to match history when warning is issued (ERR clicked)
    if (p1ShowWarning.value) {
      const p1SetWinsCount =
        bestOf.value !== undefined
          ? p1SetWins.value.filter((won) => won).length
          : 0;
      matchHistory.value.unshift({
        player: "p1",
        score1: player1Score.value,
        score2: player2Score.value,
        chipLabel: "Warning",
        isWarning: true,
        setWins: p1SetWinsCount,
      });
    }
    // Save state to include in undo/redo history
    saveState();
  }

  // Handle warning toggle for Player 2 (ERR -> PEN state change)
  function handlePlayer2WarningToggle() {
    p2ShowWarning.value = !p2ShowWarning.value;
    // Add to match history when warning is issued (ERR clicked)
    if (p2ShowWarning.value) {
      const p2SetWinsCount =
        bestOf.value !== undefined
          ? p2SetWins.value.filter((won) => won).length
          : 0;
      matchHistory.value.unshift({
        player: "p2",
        score1: player2Score.value,
        score2: player1Score.value,
        chipLabel: "Warning",
        isWarning: true,
        setWins: p2SetWinsCount,
      });
    }
    // Save state to include in undo/redo history
    saveState();
  }

  return {
    handlePlayer1ScoreIncrease,
    handlePlayer2ScoreIncrease,
    handlePlayer1OwnFinish,
    handlePlayer2OwnFinish,
    handlePlayer1Penalty,
    handlePlayer2Penalty,
    handlePlayer1WarningToggle,
    handlePlayer2WarningToggle,
  };
}
