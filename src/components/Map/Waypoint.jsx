import {
  BOUNCE_TRANSITION,
  DRAWING_SCALE,
  INNER_WIDTH,
  MAP_VIEW_DOT_BOTTOM_PADDING,
  MAP_VIEW_DOT_SPACING,
} from "../../const";

const Waypoint = ({ mapInfo, mIndex, lookingAt, gameState }) => {
  var symbolSize = 60;
  if (mapInfo.type == "match") {
    symbolSize = 110;
  }
  return (
    <>
      {mapInfo.type == "match" && (
        <div
          className={"absolute " + (lookingAt ? "sway" : "")}
          style={{
            backgroundImage:
              "url(/enemies/" +
              (gameState.pos >= mIndex ? mapInfo.enemy : "question_mark") +
              ".svg)",
            transition: BOUNCE_TRANSITION,
            left:
              INNER_WIDTH / 2 -
              (DRAWING_SCALE * 320) / 2 +
              mIndex * MAP_VIEW_DOT_SPACING,
            bottom: MAP_VIEW_DOT_BOTTOM_PADDING + (lookingAt ? 100 : 60),
            width: DRAWING_SCALE * 320 + "px",
            height: DRAWING_SCALE * 320 + "px",
            backgroundSize: "contain",
          }}
        ></div>
      )}
      <div
        className={"absolute "}
        style={{
          backgroundImage: "url(/ui/map/" + mapInfo.symbol + ".svg)",
          transition: BOUNCE_TRANSITION,
          left:
            INNER_WIDTH / 2 -
            (DRAWING_SCALE * symbolSize) / 2 +
            mIndex * MAP_VIEW_DOT_SPACING,
          bottom: MAP_VIEW_DOT_BOTTOM_PADDING + (lookingAt ? 20 : 0),
          width: DRAWING_SCALE * symbolSize + "px",
          height: DRAWING_SCALE * symbolSize + "px",
          backgroundSize: "contain",
        }}
      ></div>
    </>
  );
};

export default Waypoint;
