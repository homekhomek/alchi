import { useEffect, useMemo, useState } from "react";
import {
  BOUNCE_TRANSITION,
  CARD_HEIGHT,
  DECK_VIEW_SIDE_SPACING,
  DECK_VIEW_SPACING,
  DRAWING_SCALE,
  FULL_CARD_HEIGHT,
  FULL_CARD_WIDTH,
  HAND_WIDTH,
  INNER_HEIGHT,
  INNER_WIDTH,
} from "../const";
import Card from "../Card";
import CardHelp from "./CardHelp";
import { sleep } from "../helpers/helper";

const ViewDeck = ({ gameState, viewButton }) => {
  const [viewDeckData, setViewDeckData] = useState({
    state: "starting",
    viewedCardIndex: null,
  });

  const [animStep, setAnimStep] = useState(0);

  const refreshViewDeck = () => {
    setViewDeckData({ ...viewDeckData });
  };

  const selectCard = async (ev, card) => {
    var deckIndex = gameState.deck.indexOf(card);
    if (viewDeckData.viewedCardIndex == deckIndex)
      viewDeckData.viewedCardIndex = null;
    else viewDeckData.viewedCardIndex = deckIndex;

    refreshViewDeck();
  };

  const showButton = useMemo(() => {
    return viewButton && animStep == 1;
  }, [viewButton, animStep]);

  const openBag = async () => {
    viewDeckData.state = "viewing";
    refreshViewDeck();
    await sleep(50);
    setAnimStep(2);
  };

  const closeBag = async () => {
    setAnimStep(1);
    await sleep(50);
    viewDeckData.state = "waiting";
    viewDeckData.viewedCardIndex = null;

    refreshViewDeck();
  };
  const startAnim = async () => {
    setAnimStep(1);
  };
  useEffect(() => {
    startAnim();
  }, []);

  return (
    <div className="absolute w-full h-full pointer-events-none overflow-hidden">
      <div
        className="absolute pointer-events-auto"
        style={{
          backgroundImage: "url(/ui/deck_button.svg)",
          transition: BOUNCE_TRANSITION,
          left: INNER_WIDTH / 2 - HAND_WIDTH / 2 - DRAWING_SCALE * 120,
          bottom: showButton
            ? -DRAWING_SCALE * 140 + "px"
            : -DRAWING_SCALE * 400 + "px",
          width: DRAWING_SCALE * 380 + "px",
          height: DRAWING_SCALE * 380 + "px",
          transform: showButton ? `rotate(45deg)` : "",
          backgroundSize: "contain",
          opacity: "1",
          zIndex: 1,
        }}
        onClick={openBag}
      ></div>
      {viewDeckData.state == "viewing" && viewButton && (
        <div
          className="absolute w-full h-full"
          style={{
            transition: BOUNCE_TRANSITION,
            backgroundColor: "rgba(0,0,0,.5)",
            zIndex: 200,
            opacity: animStep > 1 ? "1" : "0",
            pointerEvents: viewDeckData.state == "viewing" ? "auto" : "none",
          }}
          onClick={closeBag}
        >
          <CardHelp
            graspPos={{ x: 500, y: INNER_HEIGHT - CARD_HEIGHT * 2 }}
            card={
              viewDeckData.viewedCardIndex != null
                ? gameState.deck[viewDeckData.viewedCardIndex]
                : null
            }
            customDelay={500}
          />
          <div
            className="absolute"
            style={{
              transition: "all .25s ease-in-out ",
              backgroundImage: "url(/ui/deck_view_back.svg)",
              backgroundSize: "cover",
              left: INNER_WIDTH / 2 - 300,
              bottom: animStep > 1 ? "0px" : -CARD_HEIGHT * 3 + "px",
              width: 600 + "px",
              height: CARD_HEIGHT * 3 + "px",
              opacity: "1",
              zIndex: 1,
            }}
            onClick={(ev) => {
              ev.stopPropagation();
            }}
          >
            <div
              className="absolute h-full"
              style={{
                width: HAND_WIDTH + "px",
                left: (600 - HAND_WIDTH) / 2,
                top: "60px",
                overflowX: "scroll",
                overflowY: "hidden",
                transform: "rotate(180deg)",
                direction: "rtl",
              }}
            >
              <div
                className="absolute h-full"
                style={{
                  transform: "rotate(180deg)",
                  width:
                    Math.floor(gameState.deck.length / 2) *
                      (FULL_CARD_WIDTH + DECK_VIEW_SPACING) +
                    DECK_VIEW_SIDE_SPACING * 2 -
                    DECK_VIEW_SPACING +
                    "px",
                  direction: "ltr",
                }}
              >
                {gameState.deck.map((c, cIndex) => {
                  return (
                    <Card
                      key={cIndex}
                      opacity={"1"}
                      flippedToBack={false}
                      cardData={c}
                      sway={cIndex == viewDeckData.viewedCardIndex}
                      top={
                        (cIndex % 2) * (FULL_CARD_HEIGHT + DECK_VIEW_SPACING) +
                        DECK_VIEW_SPACING +
                        10
                      }
                      scale={1}
                      left={
                        Math.floor(cIndex / 2) *
                          (FULL_CARD_WIDTH + DECK_VIEW_SPACING) +
                        DECK_VIEW_SIDE_SPACING
                      }
                      graspStart={selectCard}
                    ></Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDeck;
