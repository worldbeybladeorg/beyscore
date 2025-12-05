import { defineStore } from "pinia";
import type { EarnPointArgs } from "../types/earnPointArgs";
import type { GenerationType } from "../types/generations";
import { Generation } from "../types/generations";

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useScoreboardStore = defineStore("scoreboard", () => {
  // other options...
  const player1Name = ref<string>("Player 1");
  const player2Name = ref<string>("Player 2");
  const judgeMode = ref<boolean>(true);
  const pointsToWin = ref<number>(4);
  const player1Score = ref<number>(0);
  const player2Score = ref<number>(0);
  const scoreReason = ref<string>("");
  const history = ref<ScoreHistory[]>([]);
  const player1Error = ref<number>(0);
  const player2Error = ref<number>(0);
  const generation = ref<GenerationType>(Generation.X);
  const ownFinishEnabled = ref<boolean>(false);

  function undoLastAction() {
    useUndoAction({
      Player1Score: player1Score,
      Player2Score: player2Score,
      ScoreReason: scoreReason,
      History: history,
    });
  }

  function earnPoints(args: EarnPointArgs) {
    useEarnPoints({
      Player: args.Player,
      Points: args.Points,
      Reason: args.Reason,
      CurrentReason: scoreReason,
      Player1Score: player1Score,
      Player2Score: player2Score,
      History: history,
    });
  }

  function reset() {
    player1Name.value = "Player 1";
    player2Name.value = "Player 2";
    player1Score.value = 0;
    player2Score.value = 0;
    scoreReason.value = "";
    history.value = [];
  }

  return {
    player1Name,
    player2Name,
    player1Score,
    player2Score,
    scoreReason,
    history,
    undoLastAction,
    earnPoints,
    reset,
    pointsToWin,
    judgeMode,
    player1Error,
    player2Error,
    generation,
    ownFinishEnabled,
  };
});
