import { useEffect, useMemo, useState } from "react";
import { shuffleArray, sleep } from "../helper";
import { cards } from "../const";
import Card from "../Card";
import Deck from "../Deck";

const Match = ({ gameState, refreshGameState }) => {
  const [matchData, setMatchData] = useState({
    matchState: "start",
    cards: JSON.parse(JSON.stringify(gameState.deck)), // Store list of cards, and their {loc} property

    deck: [],
    discard: [],
    hand: [],
    grasp: null,
    play: [],
  });

  const innerWidth = useMemo(() => window.innerWidth, [window.innerWidth]);
  const innerHeight = useMemo(() => window.innerHeight, [window.innerHeight]);

  const refreshMatch = () => {
    setMatchData({ ...matchData });
  };

  const bakeCards = () => {
    matchData.cards = matchData.cards.map((cName) => {
      return JSON.parse(JSON.stringify(cards.find((c) => c.name == cName)));
    });

    matchData.cards.forEach((c) => {
      c.loc = "deck";
    });

    matchData.deck = [...matchData.cards];
  };

  const drawCard = async () => {
    var cardInQuestion = matchData.deck.pop();
    cardInQuestion.loc = "hand";
    matchData.hand.push(cardInQuestion);

    refreshMatch();
  };

  const startMatch = async () => {
    bakeCards();

    shuffleArray(matchData.deck);

    for (var i = 0; i < 5; i++) {
      await sleep(500);
      drawCard();
    }
  };

  useEffect(() => {
    startMatch();
  }, []);

  /* RENDER METHODS */
  const cardOpacity = (curCard) => {
    return curCard.loc == "deck" ? 0 : 1;
  };

  const cardFlipped = (curCard) => {
    return curCard.loc == "deck" ? true : false;
  };

  return (
    <div>
      {matchData.cards.map((c, cIndex) => {
        return (
          <Card
            key={cIndex}
            opacity={cardOpacity(c)}
            flippedToBack={cardFlipped(c)}
          ></Card>
        );
      })}

      <Deck numberOfCards={25}></Deck>
    </div>
  );
};

export default Match;
