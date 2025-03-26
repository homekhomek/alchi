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

const ViewMap = ({ gameState, viewButton }) => {
  const [viewMapData, setViewMapData] = useState({
    state: "starting",
  });
  const [scrollPosition, setScrollPosition] = useState(0);
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
    setAnimStep(2);
    await sleep(500);
    if (scrollRef.current != null)
      scrollRef.current.scrollBy({
        left: gameState.pos * MAP_VIEW_DOT_SPACING,
        behavior: "smooth",
      });
  };

  const closeBag = async () => {
    setAnimStep(1);
    await sleep(50);
    viewMapData.state = "waiting";
    viewMapData.viewedCardIndex = null;
    setScrollPosition(0);

    refreshViewMap();
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

      {viewMapData.state == "viewing" && viewButton && (
        <div
          className="absolute w-full h-full overflow-hidden"
          style={{
            transition: BOUNCE_TRANSITION,
            backgroundColor: "#f2f2da",
            zIndex: 200,
            opacity: animStep > 1 ? "1" : "0",
            pointerEvents: viewMapData.state == "viewing" ? "auto" : "none",
          }}
          onClick={closeBag}
        >
          <div
            className="absolute w-full h-full "
            style={{
              transition: BOUNCE_TRANSITION,
              backgroundColor: "#f2f2da",
              zIndex: 200,
            }}
          >
            <div
              className="absolute w-full overflow-y-hidden overflow-x-scroll"
              ref={scrollRef}
              onScroll={handleScroll}
              style={{
                transition: BOUNCE_TRANSITION,
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
