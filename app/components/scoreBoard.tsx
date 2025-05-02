import { useState } from "react";
import PlayerSection from "./playerSection";
import type { EarnPointArgs } from "./winButton";
// import useSound from "use-sound"; // Or your custom hook if it's different

interface ScoreBoardProps {
  pointsToWin: number;
  player1Name: string;
  player2Name: string;
  onReset: () => void;
}

interface HistoryEntry {
  player1Score: number;
  player2Score: number;
  reason: string;
}

export default function ScoreBoard({
  pointsToWin,
  player1Name,
  player2Name,
  onReset,
}: ScoreBoardProps) {
  const player1Index = 0;
  const player2Index = 1;

  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [scoreReason, setScoreReason] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // const [play] = useSound("/sounds/countdown.mp3");

  function earnPoints(args: EarnPointArgs) {
    setHistory((prev) => [
      ...prev,
      {
        player1Score,
        player2Score,
        reason: scoreReason,
      },
    ]);

    if (args.Player === player1Index) {
      setPlayer1Score((prev) => prev + args.Points);
    } else {
      setPlayer2Score((prev) => prev + args.Points);
    }

    setScoreReason(args.Reason);
  }

  function undoLastAction() {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setPlayer1Score(last.player1Score);
      setPlayer2Score(last.player2Score);
      setScoreReason(last.reason);
      return prev.slice(0, -1);
    });
  }

  function checkWinner(): string {
    if (player1Score >= pointsToWin) {
      return `${player1Name} Wins!`;
    } else if (player2Score >= pointsToWin) {
      return `${player2Name} Wins!`;
    }
    return "";
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="text-center">BeyScore</h2>
          <div className="row mt-4">
            <PlayerSection
              playerName={player1Name}
              playerIndex={player1Index}
              playerScore={player1Score}
              isDisabled={checkWinner() !== ""}
              winFunction={earnPoints}
            />

            <div className="col text-center">
              <h3>Last Score</h3>
              <h4>{scoreReason}</h4>

              <button className="btn btn-primary">Countdown</button>
            </div>

            <PlayerSection
              playerName={player2Name}
              playerIndex={player2Index}
              playerScore={player2Score}
              isDisabled={checkWinner() !== ""}
              winFunction={earnPoints}
            />
          </div>

          {checkWinner() && (
            <div className="mt-4 text-center">
              <h2 className="text-success">{checkWinner()}</h2>
            </div>
          )}

          <div className="mt-4 text-center">
            <button
              className="btn btn-warning"
              disabled={history.length === 0}
              onClick={undoLastAction}
            >
              Undo
            </button>
          </div>

          <div className="mt-4 text-center">
            <button className="btn btn-warning" onClick={onReset}>
              New Match
            </button>
          </div>

          {history.length > 0 && (
            <div className="mt-4">
              <h4 className="text-center">Score History</h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>{player1Name} Score</th>
                    <th>{player2Name} Score</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.player1Score}</td>
                      <td>{entry.player2Score}</td>
                      <td>{entry.reason}</td>
                    </tr>
                  ))}
                  <tr>
                    <td>{player1Score}</td>
                    <td>{player2Score}</td>
                    <td>{scoreReason}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
