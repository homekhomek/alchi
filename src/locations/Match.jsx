import { useEffect, useMemo, useState } from "react";
import { distSquared, shuffleArray, sleep } from "../helper";
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  cards,
  DRAWING_SCALE,
  FULL_CARD_WIDTH,
  HAND_OFFSET,
  INNER_HEIGHT,
  INNER_WIDTH,
  PLAY_OFFSET,
  suits,
} from "../const";
import Card from "../Card";
import { getCardRenderInfo } from "../matchHelper";
import { scoreCard } from "../scoreHelper";
import BlackBox from "../components/BlackBox";

const playWidth = CARD_WIDTH * 4;
const Match = ({ gameState, refreshGameState }) => {
  const [matchData, setMatchData] = useState({
    matchState: "start",
    cards: JSON.parse(JSON.stringify(gameState.deck)), // Store list of cards, and their {loc} property

    scoreInHand: 0,
    scoreToBeat: 50,

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

  const [hitMarkers, setHitMarkers] = useState([]);
  const [enemyShakeRot, setEnemyShakeRot] = useState(0);

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
        refreshMatch();

        scoreCard(
          closestGraspSpot.ind,
          matchData,
          refreshMatch,
          graspPos,
          addHitMarker,
          drawCard
        );
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
    if (matchData.state != "damaging") return;

    var shakeInterval = setInterval(() => {
      setEnemyShakeRot(Math.floor(Math.random() * 11) - 5);
    }, 20);

    return () => {
      setEnemyShakeRot(0);
      clearInterval(shakeInterval);
    };
  }, [matchData.state]);

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
      onPointerCancel={graspDrop}
    >
      <div
        className="absolute text-center text-3xl"
        style={{
          transition: "all .25s cubic-bezier(.47,1.64,.41,.8)",
          left: innerWidth / 2 - 250 + (matchData.scoreInHand == 0 ? 0 : -33),
          width: 500,
          top: INNER_HEIGHT + PLAY_OFFSET - DRAWING_SCALE * 680 + "px",
          height: 50,
        }}
      >
        {matchData.scoreToBeat}
        <img
          src={`/cards/suits/symbols/heart.svg`}
          className="inline-block mt-[-2px] ml-[5px]"
          style={{
            height: DRAWING_SCALE * 45 + "px",
          }}
        ></img>
      </div>
      <div
        className="absolute text-center text-3xl"
        style={{
          transition: "all .25s cubic-bezier(.47,1.64,.41,.8)",
          left: innerWidth / 2 - 250 + (matchData.scoreInHand == 0 ? 0 : 33),
          opacity: matchData.scoreInHand == 0 ? "0" : "1",
          width: 500,
          top: INNER_HEIGHT + PLAY_OFFSET - DRAWING_SCALE * 680 + "px",
          height: 50,
        }}
      >
        {matchData.scoreInHand > 0 ? "-" : "+"}
        {Math.abs(matchData.scoreInHand)}
        <img
          src={`/cards/suits/symbols/sword.svg`}
          className="inline-block mt-[-2px] ml-[5px]"
          style={{
            height: DRAWING_SCALE * 45 + "px",
          }}
        ></img>
      </div>

      <div
        className="absolute"
        style={{
          backgroundImage: "url(/enemies/rat_bishop.svg)",
          left: INNER_WIDTH / 2 - 160 * DRAWING_SCALE * 1.5,
          top: INNER_HEIGHT + PLAY_OFFSET - DRAWING_SCALE * 620 + "px",
          width: DRAWING_SCALE * 320 * 1.5 + "px",
          height: DRAWING_SCALE * 320 * 1.5 + "px",
          transform: `rotate(${enemyShakeRot}deg)`,
          backgroundSize: "contain",
          zIndex: 1,
        }}
      ></div>

      <BlackBox width={300} height={300}></BlackBox>

      <div
        className="absolute"
        style={{
          backgroundImage: "url(/ui/counter.svg)",
          transition: "all .25s cubic-bezier(.47,1.64,.41,.8)",
          opacity: matchData.counterPosition == null ? "0" : "1",
          left:
            matchData.counterPosition == null
              ? DRAWING_SCALE * -20 - 2 * FULL_CARD_WIDTH + INNER_WIDTH / 2
              : matchData.counterPosition * FULL_CARD_WIDTH -
                DRAWING_SCALE * 20 -
                (matchData.play.length * FULL_CARD_WIDTH) / 2 +
                INNER_WIDTH / 2,
          top: INNER_HEIGHT + PLAY_OFFSET - DRAWING_SCALE * 15,
          width: DRAWING_SCALE * 280 + "px",
          height: DRAWING_SCALE * 400 + "px",
          backgroundSize: "contain",
          zIndex: 9999,
        }}
      ></div>

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
