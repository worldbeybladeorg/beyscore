import React from "react";
import type { EarnPointArgs } from "./winButton";
import WinButton from "./winButton";

interface PlayerSectionProps {
  playerName: string;
  playerIndex: number;
  playerScore: number;
  isDisabled: boolean;
  winFunction: (args: EarnPointArgs) => void;
}

export default function PlayerSection({
  playerName,
  playerIndex,
  playerScore,
  isDisabled,
  winFunction,
}: PlayerSectionProps) {
  const buttons: { winName: string; points: number; reasonSuffix: string }[] = [
    { winName: "Spin", points: 1, reasonSuffix: "Spin Finish" },
    { winName: "Over", points: 2, reasonSuffix: "Over Finish" },
    { winName: "Burst", points: 2, reasonSuffix: "Burst Finish" },
    { winName: "Xtreme", points: 3, reasonSuffix: "Xtreme Finish" },
    {
      winName: "Launch Error",
      points: 1,
      reasonSuffix: "Opponent Launch Error",
    },
  ];

  return (
    <div className="col text-center">
      <h3>{playerName}</h3>
      <h4>{playerScore}</h4>
      <div className="btn-group">
        {buttons.map(({ winName, points, reasonSuffix }) => (
          <WinButton
            key={winName}
            winName={winName}
            isDisabled={isDisabled}
            clickFunc={winFunction}
            args={{
              Points: points,
              Player: playerIndex,
              Reason: `${playerName} ${reasonSuffix}`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
