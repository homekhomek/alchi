import Match from "./locations/Match";

const Game = ({ gameState, refreshGameState }) => {
  return (
    <div className="w-full h-full">
      {gameState.currentLoc == "match" && (
        <Match gameState={gameState} refreshGameState={refreshGameState} />
      )}
      {gameState.currentLoc == "pickcard" && (
        <Match gameState={gameState} refreshGameState={refreshGameState} />
      )}
    </div>
  );
};

export default Game;
