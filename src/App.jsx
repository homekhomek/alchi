import { useState } from "react";
import reactLogo from "./assets/react.svg";
import Card from "./Card";
import Game from "./Game";

var startingGameState = {
  currentLoc: "match",
  matchNo: 0,
  deck: [
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
  ],
};

function App() {
  const [count, setCount] = useState(0);

  const [gameState, setGameState] = useState(
    JSON.parse(JSON.stringify(startingGameState))
  );

  let refreshGameState = () => {
    setGameState({ ...gameState });
  };

  return (
    <div className="h-full bg-red-300 p-5">
      <Game gameState={gameState} refreshGameState={refreshGameState}></Game>
    </div>
  );
}

export default App;
