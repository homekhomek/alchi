import { useState } from "react";
import Game from "./Game";

var startingDeckCardNames = [
  "seed",
  "leaf",
  "firefly",
  "ember",
  "watercan",
  "drop",
  "lantern",
  "zap",
  "skull",
  "oil",
];

var startingGameState = {
  currentLoc: "starting",
  matchNo: 0,
  plays: 4,
  deck: startingDeckCardNames,
};

function App() {
  const [gameState, setGameState] = useState(
    JSON.parse(JSON.stringify(startingGameState))
  );

  let refreshGameState = () => {
    setGameState({ ...gameState });
  };

  return (
    <div className="h-full bg-red-300 ">
      <Game gameState={gameState} refreshGameState={refreshGameState}></Game>
    </div>
  );
}

export default App;
