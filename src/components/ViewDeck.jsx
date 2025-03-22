import { useState } from "react";
import {
  BOUNCE_TRANSITION,
  CARD_HEIGHT,
  DECK_VIEW_SIDE_SPACING,
  DECK_VIEW_SPACING,
  DRAWING_SCALE,
  FULL_CARD_HEIGHT,
  FULL_CARD_WIDTH,
  HAND_WIDTH,
  INNER_WIDTH,
} from "../const";
import Card from "../Card";

const ViewDeck = ({ gameState, viewButton }) => {
  const [viewingDeck, setViewingDeck] = useState(true);

  const [viewDeckData, setViewDeckData] = useState({
    state: "starting",
    viewedCardIndex: null,
  });

  const refreshViewDeck = () => {
    setViewDeckData({ ...viewDeckData });
  };

  const openBag = async () => {};

  const closeBag = async () => {};

  return (
    <div className="absolute w-full h-full pointer-events-none">
      <div
        className="absolute"
        style={{
          backgroundImage: "url(/ui/deck_button.svg)",
          transition: BOUNCE_TRANSITION,
          left: INNER_WIDTH / 2 - HAND_WIDTH / 2 - DRAWING_SCALE * 120,
          bottom: viewButton
            ? -DRAWING_SCALE * 140 + "px"
            : -DRAWING_SCALE * 400 + "px",
          width: DRAWING_SCALE * 380 + "px",
          height: DRAWING_SCALE * 380 + "px",
          transform: viewButton ? `rotate(45deg)` : "",
          backgroundSize: "contain",
          opacity: "1",
          zIndex: 1,
        }}
        onClick={openBag}
      ></div>
      {viewingDeck && (
        <div
          className="absolute w-full h-full pointer-events-auto"
          style={{
            backgroundColor: "rgba(0,0,0,.5)",
            zIndex: 200,
          }}
        >
          <div
            className="absolute"
            style={{
              backgroundColor: "red",
              transition: BOUNCE_TRANSITION,
              backgroundImage: "url(/ui/deck_view_back.svg)",
              backgroundSize: "cover",
              left: INNER_WIDTH / 2 - 300,
              bottom: 0,
              width: 600 + "px",
              height: CARD_HEIGHT * 3 + "px",
              opacity: "1",
              zIndex: 1,
            }}
          >
            <div
              className="absolute h-full"
              style={{
                transform: "rotate(180deg)",
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
