import Match from "./locations/Match";

const Game = ({ gameState, refreshGameState }) => {
  return (
    <div className="w-full h-full">
      <Match gameState={gameState} refreshGameState={refreshGameState} />
    </div>
  );
};

export default Game;
