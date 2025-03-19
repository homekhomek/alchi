import { useEffect, useMemo, useState } from "react";

const PickCard = ({ gameState, refreshGameState }) => {
  const [pickCardData, setPickCardData] = useState({
    cards: [],
    grasp: null,
  });

  const bakeCards = () => {
    matchData.cards = matchData.cards.map((cName) => {
      return JSON.parse(JSON.stringify(cards.find((c) => c.name == cName)));
    });

    matchData.cards.forEach((c) => {
      c.loc = "deck";
      c.scoring = false;
      c.shaking = false;
      c.showValue = c.startingValue;
    });

    matchData.deck = [...matchData.cards];
  };

  const startPickCard = async () => {
    bakeCards();

    shuffleArray(matchData.deck);

    refreshMatch();

    await sleep(500);

    for (var i = 0; i < matchData.handSize; i++) {
      await drawCard();
    }

    matchData.state = "play";
    refreshMatch();
  };

  useEffect(() => {
    startPickCard();
  }, []);

  return (
    <div
      className="w-full h-full"
      onPointerMove={graspMove}
      onPointerUp={graspDrop}
      onPointerCancel={graspDrop}
    >
      <div>Pick a card to add to your deck</div>
    </div>
  );
};

export default Match;
