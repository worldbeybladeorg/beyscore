import NavBar from "~/components/navBar";
import type { Route } from "./+types/home";
import { useState } from "react";
import { Button } from "react-bootstrap";
import ScoreBoard from "~/components/scoreBoard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

// Placeholder components
const MobileScoreBoard = (props: any) => <div>MobileScoreBoard</div>;

export default function Home() {
  const [scoreToWin, setScoreToWin] = useState(0);
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [judgeMode, setJudgeMode] = useState(true);

  function newMatch(matchScore: number) {
    setScoreToWin(matchScore);
    if (player1Name === "") setPlayer1Name("Player 1");
    if (player2Name === "") setPlayer2Name("Player 2");
  }

  function reset() {
    setScoreToWin(0);
    setPlayer1Name("");
    setPlayer2Name("");
  }

  return (
    <>
      <NavBar />
      {scoreToWin === 0 && (
        <div className="container mt-4">
          <h2 className="text-center">Create a tournament</h2>

          <div>
            <label htmlFor="player-1-name" className="form-label">
              Player 1 Name
            </label>
            <input
              id="player-1-name"
              type="text"
              className="form-control"
              placeholder="Player 1"
              aria-label="Player 1 Name"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="player-2-name" className="form-label">
              Player 2 Name
            </label>
            <input
              id="player-2-name"
              type="text"
              className="form-control"
              placeholder="Player 2"
              aria-label="Player 2 Name"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
            />
          </div>

          <div className="form-check form-switch">
            <label className="form-check-label" htmlFor="judgeMode">
              Enable Judge Mode
            </label>
            <input
              id="judgeMode"
              className="form-check-input"
              type="checkbox"
              checked={judgeMode}
              onChange={(e) => setJudgeMode(e.target.checked)}
            />
          </div>

          <div>Points to Win</div>
          <div
            className="btn-group"
            role="group"
            aria-label="Point Button Selector"
          >
            {[3, 4, 5, 7].map((points) => (
              <Button
                key={points}
                type="button"
                className="btn btn-primary"
                onClick={() => newMatch(points)}
              >
                {points} Points
              </Button>
            ))}
          </div>
        </div>
      )}

      {scoreToWin !== 0 && judgeMode && (
        <ScoreBoard
          pointsToWin={scoreToWin}
          player1Name={player1Name}
          player2Name={player2Name}
          onReset={reset}
        />
      )}

      {scoreToWin !== 0 && !judgeMode && (
        <MobileScoreBoard
          pointsToWin={scoreToWin}
          player1Name={player1Name}
          player2Name={player2Name}
          onReset={reset}
        />
      )}
    </>
  );
}
