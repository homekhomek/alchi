import { useEffect, useState } from "react";
import Game from "./Game";
import { generateMap } from "./helpers/helper";

var startingDeckCardNames = [
  "seed",
  "racoon",
  "racoon",
  "racoon",
  "racoon",
  "racoon",
  "firefly",
  "ember",
  "watercan",
  "drop",
  "lantern",
  "zap",
  "skull",
  "oil",
  "tulip",
];

var startingGameState = {
  state: "incrementmap",
  plays: 4,
  deck: startingDeckCardNames,
  pos: 0,
  map: generateMap(),
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
