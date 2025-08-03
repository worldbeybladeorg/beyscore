export const Generation = {
  PLA_MFB: "Plastic/Metal Fight",
  BURST: "Burst",
  X: "X",
} as const;

export type GenerationType = (typeof Generation)[keyof typeof Generation];
