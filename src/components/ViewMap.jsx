import { useEffect, useMemo, useRef, useState } from "react";
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
  MAP_VIEW_BOTTOM_OFFSET,
  MAP_VIEW_DOT_BOTTOM_PADDING,
  MAP_VIEW_DOT_SPACING,
} from "../const";
import { sleep } from "../helpers/helper";
import Waypoint from "./Map/Waypoint";

const ViewMap = ({
  gameState,
  viewButton,
  isIncrement = false,
  refreshGameState,
}) => {
  const [viewMapData, setViewMapData] = useState({
    state: "starting",
  });
  const [scrollPosition, setScrollPosition] = useState(
    gameState.pos * MAP_VIEW_DOT_SPACING
  );
  const scrollRef = useRef(null);

  const [animStep, setAnimStep] = useState(0);

  const refreshViewMap = () => {
    setViewMapData({ ...viewMapData });
  };

  const handleScroll = () => {
    // Get the scrollLeft value
    const scrollLeft = scrollRef.current.scrollLeft;
    setScrollPosition(scrollLeft);
  };

  const showButton = useMemo(() => {
    return viewButton && animStep == 1;
  }, [viewButton, animStep]);

  const openMap = async () => {
    viewMapData.state = "viewing";

    refreshViewMap();
    await sleep(50);

    if (scrollRef.current != null)
      scrollRef.current.scrollLeft = gameState.pos * MAP_VIEW_DOT_SPACING;
    setAnimStep(2);
    await sleep(500);
    if (isIncrement) {
      await sleep(500);
      if (scrollRef.current != null)
        scrollRef.current.scrollBy({
          left: (gameState.pos + 1) * MAP_VIEW_DOT_SPACING,
          behavior: "smooth",
        });

      await sleep(2000);
      setAnimStep(3);
      await sleep(500);
      gameState.state = "match";
      gameState.pos += 1;
      refreshGameState();
    }
  };

  const closeMap = async () => {
    setAnimStep(1);
    await sleep(50);
    viewMapData.state = "waiting";
    viewMapData.viewedCardIndex = null;
    setScrollPosition(0);

    refreshViewMap();
  };
  const startAnim = async () => {
    setAnimStep(1);
    if (isIncrement) {
      openMap();
    }
  };
  useEffect(() => {
    startAnim();
  }, []);

  return (
    <div className="absolute w-full h-full pointer-events-none overflow-hidden">
      <div
        className="absolute pointer-events-auto"
        style={{
          backgroundImage: "url(/ui/map_button.svg)",
          transition: BOUNCE_TRANSITION,
          right: INNER_WIDTH / 2 - HAND_WIDTH / 2 - DRAWING_SCALE * 120,
          bottom: showButton
            ? -DRAWING_SCALE * 140 + "px"
            : -DRAWING_SCALE * 400 + "px",
          width: DRAWING_SCALE * 380 + "px",
          height: DRAWING_SCALE * 380 + "px",
          transform: showButton ? `rotate(-45deg)` : "",
          backgroundSize: "contain",
          opacity: "1",
          zIndex: 1,
        }}
        onClick={openMap}
      ></div>

      {viewMapData.state == "viewing" && (viewButton || isIncrement) && (
        <div
          className="absolute w-full h-full overflow-hidden"
          style={{
            transition: "all .3s linear",
            backgroundColor: "#f2f2da",
            zIndex: 200,
            opacity: animStep == 2 ? "1" : "0",
            pointerEvents: viewMapData.state == "viewing" ? "auto" : "none",
          }}
        >
          <div
            className="absolute w-full h-full "
            style={{
              transition: BOUNCE_TRANSITION,
              backgroundColor: "#f2f2da",
              zIndex: 200,
            }}
          >
            {!isIncrement && (
              <div
                className={"absolute "}
                style={{
                  backgroundImage: "url(/ui/red_x.svg)",
                  transition: BOUNCE_TRANSITION,
                  left: INNER_WIDTH / 2 - (DRAWING_SCALE * 80) / 2,
                  bottom: MAP_VIEW_DOT_BOTTOM_PADDING / 2,
                  width: DRAWING_SCALE * 80 + "px",
                  height: DRAWING_SCALE * 80 + "px",
                  backgroundSize: "contain",
                }}
                onClick={closeMap}
              ></div>
            )}

            <div
              className="absolute w-full overflow-y-hidden "
              ref={scrollRef}
              onScroll={handleScroll}
              style={{
                transition: BOUNCE_TRANSITION,
                overflowX: isIncrement ? "hidden" : "scroll",
                height: INNER_HEIGHT - MAP_VIEW_BOTTOM_OFFSET,
              }}
            >
              <div
                className="absolute h-full"
                style={{
                  transition: BOUNCE_TRANSITION,
                  backgroundColor: "#f2f2da",
                  width:
                    INNER_WIDTH +
                    (gameState.map.length - 1) * MAP_VIEW_DOT_SPACING,
                  opacity: animStep > 1 ? "1" : "0",
                }}
              >
                {gameState.map.map((m, mIndex) => {
                  var lookingAt = false;
                  if (
                    scrollPosition >= (mIndex - 0.5) * MAP_VIEW_DOT_SPACING &&
                    scrollPosition <= (mIndex + 0.5) * MAP_VIEW_DOT_SPACING
                  ) {
                    lookingAt = true;
                  }

                  return (
                    <Waypoint
                      key={mIndex}
                      lookingAt={lookingAt}
                      gameState={gameState}
                      mapInfo={m}
                      mIndex={mIndex}
                    />
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

export default ViewMap;
