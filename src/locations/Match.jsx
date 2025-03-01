import { useEffect, useMemo, useState } from "react";
import { shuffleArray, sleep } from "../helper";
import { CARD_HEIGHT, CARD_WIDTH, cards } from "../const";
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
  const handWidth = useMemo(() => Math.min(innerWidth, 500), [innerWidth]);

  const [graspID, setGraspID] = useState(null);
  const [graspPos, setGraspPos] = useState({});
  const graspStart = (ev, card) => {
    if (card.loc == "hand") {
      card.loc = "grasp";
      card.oldLoc = "hand";
      matchData.hand = matchData.hand.filter((c) => c != card);
      matchData.grasp = card;
    }

    setGraspID(ev.pointerId);
    setGraspPos({ x: ev.clientX, y: ev.clientY });

    refreshMatch();
  };

  const graspMove = (ev) => {
    if (ev.pointerId == graspID) {
      setGraspPos({ x: ev.clientX, y: ev.clientY });
    }
  };

  const graspDrop = (ev) => {
    if (ev.pointerId == graspID) {
      setGraspID(null);
      var graspCard = matchData.grasp;

      if (graspCard.oldLoc == "hand") {
        graspCard.loc = "hand";
        matchData.hand.push(graspCard);
        matchData.grasp = null;
      }
      refreshMatch();
    }
  };

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

    refreshMatch();

    await sleep(500);

    for (var i = 0; i < 5; i++) {
      await sleep(80);
      drawCard();
    }

    console.log(matchData);
  };

  useEffect(() => {
    startMatch();
  }, []);

  /* RENDER METHODS */
  const cardOpacity = (curCard) => {
    return curCard.loc == "deck" ? 1 : 1;
  };

  const cardFlipped = (curCard) => {
    return curCard.loc == "deck" ? true : false;
  };

  const getCardTransform = (curCard) => {
    if (curCard.loc == "deck") {
      var deckIndex = matchData.deck.indexOf(curCard);
      return {
        scale: 0.8,
        top: innerHeight - CARD_HEIGHT - deckIndex * 3,
        left: innerWidth / 2 - CARD_WIDTH / 2,
        rotate: 0,
        z: deckIndex,
      };
    } else if (curCard.loc == "hand") {
      var handIndex = matchData.hand.indexOf(curCard);
      var totalCards = matchData.hand.length;
      var offsetIndex = handIndex + 0.5 - totalCards / 2;
      var yOffset = Math.sin(0.6 * offsetIndex + Math.PI / 2) * 8;

      var cardSeperation = handWidth / (totalCards + 1);

      return {
        scale: 1,
        left:
          (handIndex + 1) * cardSeperation -
          CARD_WIDTH / 2 -
          handWidth / 2 +
          offsetIndex * 3 +
          innerWidth / 2,
        top: innerHeight - 280 - yOffset,
        rotate: offsetIndex * 2,
        z: handIndex + 10,
      };
    } else if (curCard.loc == "grasp") {
      return {
        scale: 1.2,
        left: graspPos.x - CARD_WIDTH / 2,
        top: graspPos.y - CARD_HEIGHT * 1.2,
        rotate: 0,
        z: 20,
      };
    }
    return {
      scale: 1,
      top: innerHeight - CARD_HEIGHT,
      left: innerWidth / 2 - CARD_WIDTH / 2,
      rotate: 0,
      z: 1,
    };
  };

  return (
    <div
      className="w-full h-full"
      onPointerMove={graspMove}
      onPointerUp={graspDrop}
    >
      <div
        className="h-full bg-green-200 absolute"
        style={{ width: innerWidth }}
      ></div>
      <div
        className="h-full bg-green-800 absolute"
        style={{ width: 500, left: innerWidth / 2 - 250 }}
      ></div>
      {matchData.cards.map((c, cIndex) => {
        var transformObj = getCardTransform(c);

        return (
          <Card
            key={cIndex}
            opacity={cardOpacity(c)}
            flippedToBack={cardFlipped(c)}
            cardData={c}
            top={transformObj.top}
            scale={transformObj.scale}
            left={transformObj.left}
            rotate={transformObj.rotate}
            z={transformObj.z}
            graspStart={
              c.loc == "hand" || c.loc == "play" ? graspStart : () => {}
            }
          ></Card>
        );
      })}
    </div>
  );
};

export default Match;
