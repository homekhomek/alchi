import { useEffect, useMemo, useState } from "react";
import { shuffleArray, sleep } from "../helper";
import {
  BOUNCE_TRANSITION,
  CARD_HEIGHT,
  CARD_WIDTH,
  cards,
  DRAWING_SCALE,
  FULL_CARD_WIDTH,
  HAND_OFFSET,
  HAND_WIDTH,
  INNER_HEIGHT,
  INNER_WIDTH,
  PLAY_OFFSET,
  suits,
} from "../const";
import Card from "../Card";
import { getCardRenderInfo } from "../matchHelper";
import { scoreCard } from "../scoreHelper";
import CardHelp from "../components/CardHelp";
import TextSymbol from "../components/TextSymbol";
import Enemy from "../components/Match/Enemy";
import { getClosestDropPoint } from "../graspHelper";

const playWidth = CARD_WIDTH * 4;
const Match = ({ gameState, refreshGameState, addHitMarker }) => {
  const [matchData, setMatchData] = useState({
    matchState: "start",
    cards: JSON.parse(JSON.stringify(gameState.deck)), // Store list of cards, and their {loc} property

    scoreInHand: 0,
    scoreToBeat: 5,

    playsLeft: gameState.plays,
    discardsLeft: gameState.discards,

    handSize: 5,
    counterPosition: null,

    deck: [],
    discard: [],
    hand: [],
    grasp: null,
    play: [],
  });

  const [animStep, setAnimStep] = useState(0);

  const [graspID, setGraspID] = useState(null);
  const [graspPos, setGraspPos] = useState({});
  const [possibleDropPoints, setPossibleDropPoints] = useState([]);

  const closestGraspSpot = useMemo(() => {
    return getClosestDropPoint(graspID, graspPos, possibleDropPoints);
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

    var cardSeperation = HAND_WIDTH / (matchData.hand.length + 2);
    for (var i = 0; i < matchData.hand.length + 1; i++) {
      possiblePoints.push({
        x: INNER_WIDTH / 2 - HAND_WIDTH / 2 + (i + 1) * cardSeperation,
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
        refreshMatch();

        scoreCard(
          closestGraspSpot.ind,
          matchData,
          refreshMatch,
          graspPos,
          addHitMarker,
          drawCard,
          checkWin
        );
      }
      refreshMatch();
    }
  };

  const checkWin = async () => {
    if (matchData.scoreToBeat <= 0) {
      await sleep(1000);
      // WIN!!
      matchData.state = "win";
      setAnimStep(11);
      await sleep(1000);
      setAnimStep(12);
      await sleep(300);
      setAnimStep(13);
      await sleep(2000);
      setAnimStep(14);
      await sleep(500);

      gameState.currentLoc = "pickcard";
      refreshGameState();

      return true;
    }

    return false;
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
      style={{
        transition: BOUNCE_TRANSITION,
        opacity: animStep == 14 ? "0" : "1",
      }}
      onPointerMove={graspMove}
      onPointerUp={graspDrop}
      onPointerCancel={graspDrop}
    >
      <CardHelp card={matchData.grasp} graspPos={graspPos}></CardHelp>
      <div
        className="absolute text-center text-3xl"
        style={{
          transition: "all .25s cubic-bezier(.47,1.64,.41,.8)",
          left: innerWidth / 2 - 250 + (matchData.scoreInHand == 0 ? 0 : -33),
          width: 500,
          top: INNER_HEIGHT + PLAY_OFFSET - DRAWING_SCALE * 630 + "px",
          height: 50,
        }}
      >
        {matchData.scoreToBeat}
        <TextSymbol symbol={"heart"}></TextSymbol>
      </div>
      <div
        className="absolute text-center text-3xl"
        style={{
          transition: "all .25s cubic-bezier(.47,1.64,.41,.8)",
          left: innerWidth / 2 - 250 + (matchData.scoreInHand == 0 ? 0 : 33),
          opacity: matchData.scoreInHand == 0 ? "0" : "1",
          width: 500,
          top: INNER_HEIGHT + PLAY_OFFSET - DRAWING_SCALE * 630 + "px",
          height: 50,
        }}
      >
        {matchData.scoreInHand > 0 ? "-" : "+"}
        {Math.abs(matchData.scoreInHand)}

        {matchData.scoreInHand > 0 ? (
          <TextSymbol symbol={"sword"}></TextSymbol>
        ) : (
          <TextSymbol symbol={"heart"}></TextSymbol>
        )}
      </div>

      <Enemy animStep={animStep} matchData={matchData}></Enemy>

      <div
        className="h-full absolute text-lg "
        style={{
          width: CARD_WIDTH * 4,
          left: innerWidth / 2 - CARD_WIDTH * 2,
          height: "30px",
          top: INNER_HEIGHT + PLAY_OFFSET - 30 + "px",
        }}
      >
        PLAYS
        {Array.from({ length: 8 }, () => 0).map((c, i) => (
          <img
            key={i}
            src={`/cards/suits/symbols/orange_dot.svg`}
            className="inline-block mt-[-2px] ml-[3px] transition-all"
            style={{
              height: DRAWING_SCALE * 45 + "px",
              transform: i < matchData.playsLeft ? "" : "scale(0)",
              opacity: i < matchData.playsLeft ? "1" : "0",
            }}
          ></img>
        ))}
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
            graspStart={c.loc == "hand" ? graspStart : () => {}}
          ></Card>
        );
      })}

      <div
        className="absolute text-center text-3xl"
        style={{
          transition: BOUNCE_TRANSITION,
          backgroundImage: "url(/ui/win.svg)",
          backgroundSize: "contain",
          left: "50%",
          top: animStep >= 12 ? "50%" : "-50%",
          opacity: animStep >= 12 ? "1" : "0",
          width: 1000 * DRAWING_SCALE + "px",
          height: 500 * DRAWING_SCALE + "px",
          transform:
            animStep >= 13
              ? "translate(-50%, -50%) scale(1.2)"
              : "translate(-50%, -50%)",
          zIndex: 9999,
        }}
      >
        <div className="absolute text-center -translate-1/2 top-2/5 left-1/2 text-5xl">
          VICTORY!
        </div>
      </div>
    </div>
  );
};

export default Match;
