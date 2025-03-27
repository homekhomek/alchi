import { useEffect, useState } from "react";
import Match from "./locations/Match";
import PickCard from "./locations/PickCard";
import { bakeCardNameList } from "./helpers/helper";
import ViewMap from "./components/ViewMap";

const Game = ({ gameState, refreshGameState }) => {
  const [hitMarkers, setHitMarkers] = useState([]);

  const addHitMarker = (left, top, msg = "", dir = "up") => {
    hitMarkers.push({
      left: left,
      top: top,
      msg: msg,
      dir: dir,
      start: Date.now(),
    });

    var newhitMarkers = hitMarkers.filter((hm) => {
      return Date.now() - hm.start < 1000;
    });

    setHitMarkers([...newhitMarkers]);
  };

  // NEW GAME START
  const startGame = async () => {
    gameState.deck = bakeCardNameList(gameState.deck);
    gameState.state = "incrementmap";
    refreshGameState(gameState);
  };

  useEffect(() => {
    startGame();
  }, []);

  return (
    <div className="w-full h-full overflow-hidden bg-[#472e3e]">
      {hitMarkers.map((m, mIndex) => (
        <div
          key={m.start}
          className="float-up absolute select-none text-2xl text-center"
          style={{
            top: m.top + "px",
            left: m.left - 10 + "px",
            width: "20px",
            z: 1000,
          }}
        >
          {m.msg}
        </div>
      ))}
      {gameState.state == "match" && (
        <Match
          gameState={gameState}
          refreshGameState={refreshGameState}
          enemy={gameState.map[gameState.pos].enemy}
          addHitMarker={addHitMarker}
        />
      )}
      {gameState.state == "pickcard" && (
        <PickCard
          gameState={gameState}
          refreshGameState={refreshGameState}
          addHitMarker={addHitMarker}
        />
      )}
      {gameState.state == "incrementmap" && (
        <ViewMap
          gameState={gameState}
          refreshGameState={refreshGameState}
          isIncrement={true}
          viewButton={false}
        />
      )}
    </div>
  );
};

export default Game;
