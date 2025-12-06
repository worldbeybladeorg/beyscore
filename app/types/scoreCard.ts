export type PlayerType = "p1" | "p2";
export type GenerationType = "x" | "burst" | "mfb-zero-g" | "plastics-hms";
export type BestOfType = 3 | 5 | undefined;

export interface GameSummaryItem {
  id?: string | number;
  label: string;
  value: number;
}

export interface ScoreCardProps {
  player?: PlayerType;
  playerName?: string;
  generation?: GenerationType;
  bestOf?: BestOfType;
  disabled?: boolean;
  filledStars?: boolean[];
  showWarning?: boolean;
  ownFinishEnabled?: boolean;
  isFadingIn?: boolean;
  isShrinking?: boolean;
  score?: string;
  xtrScore?: number;
  ovrScore?: number;
  bstScore?: number;
  spfScore?: number;
}

export interface ScoreCardEmits {
  scoreIncrease: [points: number | undefined, chipLabel: string];
  penalty: [];
  warningToggle: [];
  ownFinish: [];
}
