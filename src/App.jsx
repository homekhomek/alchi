import { useState } from "react";
import reactLogo from "./assets/react.svg";
import Card from "./Card";
import Deck from "./Deck";

function App() {
  const [count, setCount] = useState(0);

  const [gameState, setGameState] = useState({
    score: 0,
  });

  let refreshGameState = () => {
    setGameState({ ...gameState });
  };

  return (
    <div className="h-full bg-red-300 p-5">
      <Deck numberOfCards={25}></Deck>
    </div>
  );
}

export default App;
