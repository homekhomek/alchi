import { useEffect, useState } from "react";
import Match from "./locations/Match";
import PickCard from "./locations/PickCard";
import { bakeCardNameList } from "./helpers/helper";
import ViewMap from "./components/ViewMap";
import { HitMarkerProvider } from "./contexts/HitMarkerContext";

const Game = ({ gameState, refreshGameState }) => {
  // NEW GAME START
  const startGame = async () => {
    gameState.deck = bakeCardNameList(gameState.deck);
    gameState.state = "match";
    refreshGameState(gameState);
  };

  useEffect(() => {
    startGame();
  }, []);

  return (
    <div className="w-full h-full overflow-hidden bg-[#472e3e]">
      <HitMarkerProvider>
        {gameState.state == "match" && (
          <Match
            gameState={gameState}
            refreshGameState={refreshGameState}
            enemy={gameState.map[gameState.pos].enemy}
          />
        )}
        {gameState.state == "pickcard" && (
          <PickCard gameState={gameState} refreshGameState={refreshGameState} />
        )}
        {gameState.state == "incrementmap" && (
          <ViewMap
            gameState={gameState}
            refreshGameState={refreshGameState}
            isIncrement={true}
            viewButton={false}
          />
        )}
      </HitMarkerProvider>
    </div>
  );
};

export default Game;
