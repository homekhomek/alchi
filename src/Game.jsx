import { useState } from "react";
import Match from "./locations/Match";
import PickCard from "./locations/PickCard";

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

  return (
    <div className="w-full h-full">
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
      {gameState.currentLoc == "match" && (
        <Match
          gameState={gameState}
          refreshGameState={refreshGameState}
          addHitMarker={addHitMarker}
        />
      )}
      {gameState.currentLoc == "pickcard" && (
        <PickCard
          gameState={gameState}
          refreshGameState={refreshGameState}
          addHitMarker={addHitMarker}
        />
      )}
    </div>
  );
};

export default Game;
