// Game utility functions shared between GameScreen components

// Default configuration constants
export const DEFAULT_CUSTOM_POINTS = 10;

// Chip and win condition utilities
export function getChipTypeForHistory(
  chipLabel: string,
  generation: string,
): string {
  // Map chip labels to win condition names based on generation
  if (generation === "x") {
    if (chipLabel === "XTR") return "Xtreme";
    if (chipLabel === "BST") return "Burst";
    if (chipLabel === "OVR") return "Over";
    if (chipLabel === "SPF") return "Spin";
  } else if (generation === "burst") {
    if (chipLabel === "BST") return "Burst";
    if (chipLabel === "OVR") return "Over";
    if (chipLabel === "SPF") return "Spin";
  } else if (generation === "mfb-zero-g") {
    if (chipLabel === "OVR") return "Over";
    if (chipLabel === "SPF") return "Spin";
  } else if (generation === "plastics-hms") {
    if (chipLabel === "OVR") return "Over";
    if (chipLabel === "SPF") return "Spin";
  }
  // Default fallback - use generation-based win condition
  const defaultMapping = {
    x: "Xtreme",
    burst: "Burst",
    "mfb-zero-g": "Over",
    "plastics-hms": "Spin",
  };
  return defaultMapping[generation as keyof typeof defaultMapping] || "Xtreme";
}

export function getPrimaryWinCondition(generation: string): string {
  const mapping = {
    x: "Xtreme",
    burst: "Burst",
    "mfb-zero-g": "Over",
    "plastics-hms": "Spin",
  };
  return mapping[generation as keyof typeof mapping] || "Xtreme";
}

// Player name utilities
export function formatDisplayName(name: string, limit: number): string {
  if (!name) return "";
  if (name.length <= limit) return name;
  const sliceLength = Math.max(limit - 3, 0);
  const truncated = name.slice(0, sliceLength).trimEnd();
  return `${truncated}...`;
}

export function getPlayerDisplayNameFull(
  playerKey: string,
  p1Name: string,
  p2Name: string,
): string {
  if (playerKey === "p1") return p1Name || "Player 1";
  if (playerKey === "p2") return p2Name || "Player 2";
  return "Player";
}

export function computeNameTruncationLimit(bestOf: number | undefined): number {
  return bestOf === undefined ? 24 : 10;
}

// Match configuration utilities
export function getMaxPoints(
  matchType: string,
  customPoints?: number,
): number | null {
  if (matchType === "nolimit") {
    return null; // No limit
  } else if (matchType === "custom") {
    return customPoints ?? DEFAULT_CUSTOM_POINTS;
  } else if (matchType === "3pts") {
    return 3;
  } else if (matchType === "4pts") {
    return 4;
  } else if (matchType === "5pts") {
    return 5;
  } else if (matchType === "7pts") {
    return 7;
  }
  // Default to no limit if not provided or invalid
  return null;
}

export function getGenerationLabel(generation: string): string {
  const mapping = {
    x: "X",
    burst: "Burst",
    "mfb-zero-g": "Metal Fight/Zero-G",
    "plastics-hms": "Plastic & HMS",
  };
  return mapping[generation as keyof typeof mapping] || "X";
}

export function getPointsToWinLabel(
  matchType: string,
  customPoints?: number,
): string {
  if (matchType === "custom") {
    return `${customPoints ?? DEFAULT_CUSTOM_POINTS} Pts.`;
  }
  const mapping = {
    "3pts": "3 Pts.",
    "4pts": "4 Pts.",
    "5pts": "5 Pts.",
    "7pts": "7 Pts.",
    nolimit: "No Limit",
  };
  return mapping[matchType as keyof typeof mapping] || "No Limit";
}

export function getSetsLabel(bestOf: number | undefined): string {
  if (bestOf === undefined) {
    return "None";
  }
  return `Best-of-${bestOf}`;
}

// Dropdown items configurations
export const GENERATION_ITEMS = [
  { label: "X", value: "x" },
  { label: "Burst", value: "burst" },
  { label: "Metal Fight/Zero-G", value: "mfb-zero-g" },
  { label: "Plastics/HMS", value: "plastics-hms" },
];

export const POINTS_TO_WIN_ITEMS_X = [
  { label: "4 Pts.", value: "4pts" },
  { label: "5 Pts.", value: "5pts" },
  { label: "7 Pts.", value: "7pts" },
  { label: "No Limit", value: "nolimit" },
  { label: "Custom", value: "custom" },
];

export const POINTS_TO_WIN_ITEMS_OTHER = [
  { label: "3 Pts.", value: "3pts" },
  { label: "4 Pts.", value: "4pts" },
  { label: "5 Pts.", value: "5pts" },
  { label: "No Limit", value: "nolimit" },
  { label: "Custom", value: "custom" },
];

export const SETS_ITEMS = [
  { label: "None", value: undefined },
  { label: "Best-of-3", value: "3" },
  { label: "Best-of-5", value: "5" },
];

export function getPointsToWinItems(generation: string) {
  return generation === "x" ? POINTS_TO_WIN_ITEMS_X : POINTS_TO_WIN_ITEMS_OTHER;
}
