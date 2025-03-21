import { useEffect, useMemo, useState } from "react";
import {
  BOUNCE_TRANSITION,
  CARD_HEIGHT,
  CARD_WIDTH,
  cards,
  DRAWING_SCALE,
  SHOP_OFFSET,
  HAND_WIDTH,
  INNER_HEIGHT,
  INNER_WIDTH,
} from "../const";
import { getClosestDropPoint } from "../graspHelper";
import { sleep } from "../helper";
import Card from "../Card";
import CardHelp from "../components/CardHelp";

const PickCard = ({ gameState, refreshGameState, addHitMarker }) => {
  const [pickCardData, setPickCardData] = useState({
    cards: [],
    shop: [],
    state: "picking",
    grasp: null,
  });

  const [graspID, setGraspID] = useState(null);
  const [graspPos, setGraspPos] = useState({});
  const [possibleDropPoints, setPossibleDropPoints] = useState([]);

  const refreshPickCard = () => {
    setPickCardData({ ...pickCardData });
  };

  const closestGraspSpot = useMemo(() => {
    return getClosestDropPoint(graspID, graspPos, possibleDropPoints);
  }, [graspID, graspPos, possibleDropPoints]);

  const graspStart = (ev, card) => {
    if (graspID != null || pickCardData.state != "picking") return;

    if (card.loc == "shop") {
      card.loc = "grasp";
      card.oldLoc = "shop";
      pickCardData.shop = pickCardData.shop.filter((c) => c != card);
      pickCardData.grasp = card;
    }

    setGraspID(ev.pointerId);
    setGraspPos({ x: ev.clientX, y: ev.clientY });

    var possiblePoints = [];

    var cardSeperation = HAND_WIDTH / 4;

    for (var i = 0; i < 3; i++) {
      possiblePoints.push({
        x:
          (i + 1) * cardSeperation -
          CARD_WIDTH / 2 -
          HAND_WIDTH / 2 +
          INNER_WIDTH / 2,
        y: INNER_HEIGHT + SHOP_OFFSET,
        loc: "shop",
        ind: i,
      });
    }

    /*

    if (pickCardData.play.length < 4) {
      var playCardSeperation = playWidth / (pickCardData.play.length + 1);
      for (var i = 0; i < pickCardData.play.length + 1; i++) {
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
*/
    setPossibleDropPoints(possiblePoints);

    refreshPickCard();
  };

  const graspMove = (ev) => {
    if (!graspID) return;
    if (ev.pointerId == graspID) {
      setGraspPos({ x: ev.clientX, y: ev.clientY });
    }
  };

  const graspDrop = (ev) => {
    if (ev.pointerId == graspID) {
      setGraspID(null);
      var graspCard = pickCardData.grasp;

      if (closestGraspSpot.loc == "shop") {
        graspCard.loc = "shop";
        pickCardData.shop.splice(closestGraspSpot.ind, 0, graspCard);
        pickCardData.grasp = null;
      }
      refreshPickCard();
    }
  };

  const getCardRenderInfo = (
    curCard,
    pickCardData,
    closestGraspSpot,
    graspPos
  ) => {
    if (curCard.loc == "deck") {
      var deckIndex = pickCardData.deck.indexOf(curCard);
      return {
        scale: 0.6,
        top: INNER_HEIGHT - CARD_HEIGHT - deckIndex * 2,
        left:
          pickCardData.discard.length > 0
            ? INNER_WIDTH / 2 - CARD_WIDTH * 1.5
            : INNER_WIDTH / 2 - CARD_WIDTH / 2,
        rotate: 0,
        z: deckIndex,
      };
    } else if (curCard.loc == "shop") {
      var shopIndex = pickCardData.shop.indexOf(curCard);

      if (closestGraspSpot != null && closestGraspSpot.loc == "shop") {
        if (closestGraspSpot.ind <= shopIndex) shopIndex += 1;
      }

      var cardSeperation = HAND_WIDTH / 4;
      return {
        scale: 1,
        left:
          (shopIndex + 1) * cardSeperation -
          CARD_WIDTH / 2 -
          HAND_WIDTH / 2 +
          INNER_WIDTH / 2,
        top: INNER_HEIGHT + SHOP_OFFSET,
        z: -shopIndex + 10,
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
      top: INNER_HEIGHT - CARD_HEIGHT,
      left: INNER_WIDTH / 2 - CARD_WIDTH / 2,
      rotate: 0,
      z: 1,
    };
  };

  const generateCards = () => {
    var shopCards = [];

    for (var i = 0; i < 3; i++) {
      shopCards.push(cards[Math.floor(Math.random() * cards.length)]);
    }

    shopCards = shopCards.map((c) => {
      return JSON.parse(JSON.stringify(c));
    });

    shopCards.forEach((c) => {
      c.loc = "shop";
      c.showValue = c.startingValue;
    });

    pickCardData.cards = [...shopCards];
    pickCardData.shop = [...shopCards];
  };

  const startPickCard = async () => {
    generateCards();

    refreshPickCard();

    await sleep(500);

    refreshPickCard();
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
      <CardHelp
        graspPos={graspPos}
        card={pickCardData.grasp}
        customDelay={500}
      />
      <div
        className="absolute text-center text-3xl"
        style={{
          transition: BOUNCE_TRANSITION,
          backgroundImage: "url(/ui/red_x.svg)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          left: INNER_WIDTH / 2 + 80 * DRAWING_SCALE,
          width: 80 * DRAWING_SCALE + "px",
          height: 80 * DRAWING_SCALE + "px",
          zIndex: 9999,
        }}
      ></div>

      <div
        className="absolute text-center text-lg"
        style={{
          transition: BOUNCE_TRANSITION,
          backgroundImage: "url(/ui/acqure.svg)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          left: INNER_WIDTH / 2 - 160 * DRAWING_SCALE,
          width: 200 * DRAWING_SCALE + "px",
          height: 80 * DRAWING_SCALE + "px",
          zIndex: 9999,
        }}
      >
        add
      </div>

      <div>Pick a card to add to your deck</div>
      {pickCardData.cards.map((c, cIndex) => {
        var transformObj = getCardRenderInfo(
          c,
          pickCardData,
          closestGraspSpot,
          graspPos
        );

        return (
          <Card
            key={cIndex}
            opacity={"1"}
            flippedToBack={false}
            cardData={c}
            top={transformObj.top}
            scale={transformObj.scale}
            left={transformObj.left}
            rotate={transformObj.rotate}
            z={transformObj.z}
            graspStart={c.loc == "shop" ? graspStart : () => {}}
          ></Card>
        );
      })}
    </div>
  );
};

export default PickCard;
