import { useEffect, useMemo, useState } from "react";
import { distSquared, shuffleArray, sleep } from "../helper";
import { CARD_HEIGHT, CARD_WIDTH, cards } from "../const";
import Card from "../Card";
import Deck from "../Deck";

const handOffset = -280;
const playOffset = -450;
const playWidth = CARD_WIDTH * 4;

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
  const [possibleDropPoints, setPossibleDropPoints] = useState([]);

  const closestGraspSpot = useMemo(() => {
    if (graspID == null || !graspID || possibleDropPoints.length <= 0)
      return null;

    var closestPoint = null;
    var closestPointDistance = null;

    possibleDropPoints.forEach((p) => {
      var distanceToPoint = distSquared(
        p.x,
        p.y,
        graspPos.x,
        graspPos.y - CARD_HEIGHT * 0.5
      );
      if (closestPoint == null) {
        closestPoint = p;
        closestPointDistance = distanceToPoint;
      } else if (distanceToPoint < closestPointDistance) {
        closestPoint = p;
        closestPointDistance = distanceToPoint;
      }
    });

    return closestPoint;
  }, [graspID, graspPos, possibleDropPoints]);

  const onCardClick = (card) => {
    if (card.loc == "hand") {
      matchData.hand = matchData.hand.filter((c) => c != card);
      matchData.play.push(card);

      card.loc = "play";
    } else if (card.loc == "play") {
      matchData.play = matchData.play.filter((c) => c != card);
      matchData.hand.push(card);

      card.loc = "play";
    }
    refreshMatch();
  };

  const graspStart = (ev, card) => {
    if (card.loc == "hand") {
      card.loc = "grasp";
      card.oldLoc = "hand";
      matchData.hand = matchData.hand.filter((c) => c != card);
      matchData.grasp = card;
    } else if (card.loc == "play") {
      card.loc = "grasp";
      card.oldLoc = "play";
      matchData.play = matchData.play.filter((c) => c != card);
      matchData.grasp = card;
    }

    setGraspID(ev.pointerId);
    setGraspPos({ x: ev.clientX, y: ev.clientY });

    var possiblePoints = [];

    var cardSeperation = handWidth / (matchData.hand.length + 2);
    for (var i = 0; i < matchData.hand.length + 1; i++) {
      possiblePoints.push({
        x: innerWidth / 2 - handWidth / 2 + (i + 1) * cardSeperation,
        y: innerHeight + handOffset,
        loc: "hand",
        ind: i,
      });
    }

    if (matchData.play.length < 4) {
      var playCardSeperation = playWidth / (matchData.play.length + 1);
      for (var i = 0; i < matchData.play.length + 1; i++) {
        possiblePoints.push({
          x:
            i * playCardSeperation +
            playCardSeperation / 2 -
            playWidth / 2 +
            innerWidth / 2,
          y: innerHeight + playOffset,
          loc: "play",
          ind: i,
        });
      }
    }

    setPossibleDropPoints(possiblePoints);

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

      if (closestGraspSpot.loc == "hand") {
        graspCard.loc = "hand";
        matchData.hand.splice(closestGraspSpot.ind, 0, graspCard);
        matchData.grasp = null;
      } else if (closestGraspSpot.loc == "play") {
        graspCard.loc = "play";
        matchData.play.splice(closestGraspSpot.ind, 0, graspCard);
        matchData.grasp = null;
      }
      refreshMatch();
    }
  };

  const refreshMatch = () => {
    setMatchData({ ...matchData });
  };

  const score = async () => {
    if (matchData.play.length < 4) return;

    var currentPlay = matchData.play;

    for (var i = 0; i < currentPlay.length; i++) {
      var cardToScore = currentPlay[i];

      cardToScore.scoring = true;
      refreshMatch();

      await sleep;
    }
  };
  const bakeCards = () => {
    matchData.cards = matchData.cards.map((cName) => {
      return JSON.parse(JSON.stringify(cards.find((c) => c.name == cName)));
    });

    matchData.cards.forEach((c) => {
      c.loc = "deck";
    });

    console.log(matchData.cards);

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
        top: innerHeight - CARD_HEIGHT - deckIndex * 2,
        left: innerWidth / 2 - CARD_WIDTH / 2,
        rotate: 0,
        z: deckIndex,
      };
    } else if (curCard.loc == "hand") {
      var handIndex = matchData.hand.indexOf(curCard);
      var totalCards = matchData.hand.length;
      if (closestGraspSpot != null && closestGraspSpot.loc == "hand") {
        if (closestGraspSpot.ind <= handIndex) handIndex += 1;
        totalCards += 1;
      }
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
        top: innerHeight + handOffset - yOffset,
        rotate: offsetIndex * 2,
        z: handIndex + 10,
      };
    } else if (curCard.loc == "play") {
      var playIndex = matchData.play.indexOf(curCard);
      var totalCards = matchData.play.length;
      if (closestGraspSpot != null && closestGraspSpot.loc == "play") {
        if (closestGraspSpot.ind <= playIndex) playIndex += 1;
        totalCards += 1;
      }

      return {
        scale: 1,
        left:
          playIndex * CARD_WIDTH -
          (totalCards * CARD_WIDTH) / 2 +
          innerWidth / 2,
        top: innerHeight + playOffset,
        rotate: 0,
        z: playIndex + 10,
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
        className="absolute text-center bg-blue-500 cursor-pointer"
        style={{
          left: innerWidth / 2 - 250,
          width: 500,
          top: innerHeight - 550,
          height: 50,
        }}
        onClick={() => {}}
      >
        Score!
      </div>
      <div
        className="h-full bg-green-800 absolute"
        style={{
          width: CARD_WIDTH * 4,
          left: innerWidth / 2 - CARD_WIDTH * 2,
          height: CARD_HEIGHT,
          top: innerHeight + playOffset,
        }}
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
            onCardClick={onCardClick}
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
