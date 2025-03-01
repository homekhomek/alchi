import Match from "./locations/Match";

const Game = ({ gameState, refreshGameState }) => {
  return (
    <div>
      <Match gameState={gameState} refreshGameState={refreshGameState} />
    </div>
  );
};

export default Game;
