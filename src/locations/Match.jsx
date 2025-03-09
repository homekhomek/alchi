import { useEffect, useMemo, useState } from "react";
import { distSquared, shuffleArray, sleep } from "../helper";
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  cards,
  FULL_CARD_WIDTH,
  HAND_OFFSET,
  INNER_HEIGHT,
  INNER_WIDTH,
  PLAY_OFFSET,
} from "../const";
import Card from "../Card";
import Deck from "../Deck";
import { getCardRenderInfo } from "../matchHelper";

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
    if (graspID != null || matchData.state != "play") return;

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

    var cardSeperation = INNER_WIDTH / (matchData.hand.length + 2);
    for (var i = 0; i < matchData.hand.length + 1; i++) {
      possiblePoints.push({
        x: INNER_WIDTH / 2 - INNER_WIDTH / 2 + (i + 1) * cardSeperation,
        y: INNER_HEIGHT + HAND_OFFSET,
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
          y: INNER_HEIGHT + PLAY_OFFSET,
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

  const adjustScore = async (value, cardToScore, cardTransform) => {
    cardToScore.shaking = true;
    refreshMatch();
    if (value >= 0) {
      for (var k = 0; k < value; k++) {
        setTimeout(() => {
          addHitMarker(
            cardTransform.left +
              Math.floor(Math.random() * CARD_WIDTH * 0.5) +
              CARD_WIDTH * 0.25,
            cardTransform.top,
            "+1"
          );
          cardToScore.showValue += 1;
          refreshMatch();
        }, 50 * k);
      }
      await sleep(50 * (value + 2));
    } else {
      for (var k = 0; k < value * -1; k++) {
        setTimeout(() => {
          addHitMarker(
            cardTransform.left +
              Math.floor(Math.random() * CARD_WIDTH * 0.5) +
              CARD_WIDTH * 0.25,
            cardTransform.top,
            "-1"
          );
          cardToScore.showValue -= 1;
          refreshMatch();
        }, 50 * k);
      }
      await sleep(50 * (value * -1 + 2));
    }

    cardToScore.shaking = false;
    refreshMatch();
  };

  const conditionalMet = (conditional, curCard) => {
    if (conditional == "first_card" && matchData.play.indexOf(curCard) == 0) {
      return true;
    }
  };

  const score = async () => {
    if (matchData.play.length < 4) return;

    matchData.state = "scoring";
    refreshMatch();

    var currentPlay = matchData.play;

    // Shrink all the cards in order
    for (var i = 0; i < currentPlay.length; i++) {
      var cardToShrink = currentPlay[i];
      cardToShrink.shrink = true;
      refreshMatch();
      await sleep(25);
    }

    await sleep(250);

    for (var i = 0; i < currentPlay.length; i++) {
      var cardToScore = currentPlay[i];
      var cardTransform = getCardRenderInfo(
        cardToScore,
        matchData,
        closestGraspSpot,
        graspPos
      );
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
            cardToLeft.scoring = true;
            refreshMatch();
            await sleep(250);

            await adjustScore(cardToLeft.showValue, cardToScore, cardTransform);

            cardToLeft.scoring = false;
            refreshMatch();
          }
        }
      }

      // Check middle
      if (cardToScore.middle) {
        for (var j = 0; j < cardToScore.middle.length; j++) {
          var scoreObj = cardToScore.middle[j];
          var usingCard = null;

          // Check for card suit needed
          if (scoreObj.suit) {
            for (var k = 0; k < currentPlay.length; k++) {
              if (currentPlay[k].suit == scoreObj.suit) {
                usingCard = currentPlay[k];
                usingCard.scoring = true;
                refreshMatch();
                break;
              }
            }
          }

          // Do action, gotta check for conditional though
          if (!scoreObj.suit || (scoreObj.suit && usingCard)) {
            await sleep(250);
            if (
              !scoreObj.effect.conditional ||
              conditionalMet(scoreObj.effect.conditional, cardToScore)
            ) {
              if (scoreObj.effect.type == "add_points") {
                await adjustScore(
                  scoreObj.effect.value,
                  cardToScore,
                  cardTransform
                );
              }
            }
          }

          if (usingCard) {
            usingCard.scoring = false;
            refreshMatch();
          }
        }
      }

      // Check right cards
      if (cardToScore.right && cardToRight) {
        for (var j = 0; j < cardToScore.right.length; j++) {
          var scoreObj = cardToScore.right[j];

          if (cardToRight.suit == scoreObj.suit) {
            cardToRight.scoring = true;
            refreshMatch();
            await sleep(250);

            await adjustScore(
              cardToRight.showValue,
              cardToScore,
              cardTransform
            );

            cardToRight.scoring = false;
            refreshMatch();
          }
        }
      }

      await sleep(150);
      matchData.scoreToBeat -= cardToScore.showValue;
      cardToScore.scoring = false;
      refreshMatch();
      await sleep(150);
    }

    // Un shrink
    for (var i = 0; i < currentPlay.length; i++) {
      var cardToShrink = currentPlay[i];
      cardToShrink.shrink = false;
      refreshMatch();
      await sleep(100);
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
          top: INNER_HEIGHT - 650,
          height: 50,
        }}
      >
        {matchData.scoreToBeat}
      </div>
      <div
        className="absolute text-center cursor-pointer"
        style={{
          left: innerWidth / 2 - 250,
          width: 200 + "px",
          top: INNER_HEIGHT - 550,
          height: 80 + "px",
          backgroundImage: `url(/ui/play_ready.svg)`,
          backgroundSize: "contain",
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
          top: INNER_HEIGHT + PLAY_OFFSET,
        }}
      ></div>
      {matchData.cards.map((c, cIndex) => {
        var transformObj = getCardRenderInfo(
          c,
          matchData,
          closestGraspSpot,
          graspPos
        );

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
    </div>
  );
};

export default Match;
