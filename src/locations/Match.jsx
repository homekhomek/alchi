import { useEffect, useMemo, useState } from "react";
import { distSquared, shuffleArray, sleep } from "../helper";
import { CARD_HEIGHT, CARD_WIDTH, cards, FULL_CARD_WIDTH } from "../const";
import Card from "../Card";
import Deck from "../Deck";

const handOffset = -280;
const playOffset = -450;
const playWidth = CARD_WIDTH * 4;

const Match = ({ gameState, refreshGameState }) => {
  const [matchData, setMatchData] = useState({
    matchState: "start",
    cards: JSON.parse(JSON.stringify(gameState.deck)), // Store list of cards, and their {loc} property

    scoreInHand: 0,
    scoreInHandT: 0,
    scoreToBeat: 50,
    scoreToBeatT: 50,

    handSize: 5,

    deck: [],
    discard: [],
    hand: [],
    grasp: null,
    play: [],
  });

  const innerWidth = useMemo(() => window.innerWidth, [window.innerWidth]);
  const innerHeight = useMemo(() => window.innerHeight, [window.innerHeight]);
  const handWidth = useMemo(() => Math.min(innerWidth, 500), [innerWidth]);
  const canScore = useMemo(
    () => matchData.state == "play" && matchData.play.length >= 4,
    [matchData]
  );
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

  const graspStart = (ev, card) => {
    if (graspID != null) return;

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

  const useCardToScore = async (c) => {
    c.shaking = true;
    refreshMatch();
    await sleep(120);
    c.shaking = false;
    refreshMatch();
  };

  const score = async () => {
    if (matchData.play.length < 4) return;

    matchData.state = "scoring";
    refreshMatch();

    var currentPlay = matchData.play;

    for (var i = 0; i < currentPlay.length; i++) {
      var cardToScore = currentPlay[i];
      var cardToLeft = i == 0 ? null : currentPlay[i - 1];
      var cardToRight = i == 3 ? null : currentPlay[i + 1];

      cardToScore.scoring = true;
      refreshMatch();
      await sleep(250);

      // Check left cards
      if (cardToScore.left && cardToLeft) {
        for (var j = 0; j < cardToScore.left.length; j++) {
          var scoreObj = cardToScore.left[j];

          if (cardToLeft.suit == scoreObj.suit) {
            cardToScore.showValue += scoreObj.value;
            useCardToScore(cardToScore);
            await useCardToScore(cardToLeft);
          }
        }
      }

      // Check middle
      if (cardToScore.middle) {
        for (var j = 0; j < cardToScore.middle.length; j++) {
          var scoreObj = cardToScore.middle[j];

          if (scoreObj.suit) {
            currentPlay.forEach((c) => {
              if (c != cardToScore && scoreObj.suit == c.suit) {
                cardToScore.showValue += scoreObj.value;
                useCardToScore(cardToScore);
                useCardToScore(c);
              }
            });
          } else if (scoreObj.name) {
            if (scoreObj.name == "pair") {
              for (var k = 0; k < currentPlay.length - 1; k++) {
                if (currentPlay[k].suit == currentPlay[k + 1].suit) {
                  cardToScore.showValue += scoreObj.value;
                  useCardToScore(currentPlay[k]);
                  await useCardToScore(currentPlay[k + 1]);
                }
              }
            }
          }
        }
      }

      // Check right

      if (cardToScore.right && cardToRight) {
        for (var j = 0; j < cardToScore.right.length; j++) {
          var scoreObj = cardToScore.right[j];

          if (cardToRight.suit == scoreObj.suit) {
            cardToScore.showValue += scoreObj.value;
            useCardToScore(cardToScore);
            await useCardToScore(cardToRight);
          }
        }
      }
      await sleep(150);
      matchData.scoreToBeat -= cardToScore.showValue;
      cardToScore.scoring = false;
      refreshMatch();
      await sleep(150);
    }

    // Discard play cards
    for (var i = 0; i < 4; i++) {
      var c = matchData.play[0];
      c.loc = "discard";
      c.showValue = c.startingValue;
      matchData.discard.push(c);
      matchData.play = matchData.play.filter((pc) => pc != c);
      refreshMatch();
      await sleep(50);
    }

    // Draw up to hand size;
    var cardsToDraw = matchData.handSize - matchData.hand.length;

    if (cardsToDraw > 0) {
      for (var i = 0; i < cardsToDraw; i++) {
        await drawCard();
      }
    }

    matchData.state = "play";

    refreshMatch();
  };
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

    console.log(matchData.cards);

    matchData.deck = [...matchData.cards];
  };

  const drawCard = async () => {
    await sleep(80);

    if (matchData.deck.length == 0) {
      for (var i = 0; i < matchData.discard.length; i++) {
        var c = matchData.discard[i];
        c.loc = "deck";
        matchData.deck.push(c);
        refreshMatch();
        await sleep(50);
      }
      await sleep(500);

      matchData.discard = [];
      shuffleArray(matchData.deck);

      refreshMatch();
      await sleep(250);
    }

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

    for (var i = 0; i < matchData.handSize; i++) {
      await drawCard();
    }

    matchData.state = "play";
    refreshMatch();

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
        left:
          matchData.discard.length > 0
            ? innerWidth / 2 - CARD_WIDTH * 1.5
            : innerWidth / 2 - CARD_WIDTH / 2,
        rotate: 0,
        z: deckIndex,
      };
    } else if (curCard.loc == "discard") {
      var discardIndex = matchData.discard.indexOf(curCard);
      return {
        scale: 0.8,
        top: innerHeight - CARD_HEIGHT - discardIndex * 2,
        left: innerWidth / 2 + CARD_WIDTH * 0.5,
        rotate: 0,
        z: discardIndex + 30,
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
          offsetIndex * 4 +
          innerWidth / 2,
        top: innerHeight + handOffset - yOffset,
        rotate: offsetIndex * 2,
        z: -handIndex + 10,
      };
    } else if (curCard.loc == "play") {
      var playIndex = matchData.play.indexOf(curCard);
      var totalCards = matchData.play.length;
      if (closestGraspSpot != null && closestGraspSpot.loc == "play") {
        if (closestGraspSpot.ind <= playIndex) playIndex += 1;
        totalCards += 1;
      }

      return {
        scale: curCard.scoring ? 0.9 : 1,
        left:
          playIndex * FULL_CARD_WIDTH -
          (totalCards * FULL_CARD_WIDTH) / 2 +
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
        className="absolute text-center text-7xl"
        style={{
          left: innerWidth / 2 - 250,
          width: 500,
          top: innerHeight - 650,
          height: 50,
        }}
      >
        {matchData.scoreToBeat}
      </div>
      <div
        className="absolute text-center cursor-pointer"
        style={{
          left: innerWidth / 2 - 250,
          width: 500,
          top: innerHeight - 550,
          height: 50,
          backgroundColor: canScore ? "#00f" : "#333",
        }}
        onClick={canScore ? score : () => {}}
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
