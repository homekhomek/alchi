import {
  BOUNCE_TRANSITION,
  DRAWING_SCALE,
  INNER_WIDTH,
  MAP_VIEW_DOT_BOTTOM_PADDING,
  MAP_VIEW_DOT_SPACING,
} from "../../const";
import SymbolText from "../SymbolText";

const Waypoint = ({ mapInfo, mIndex, lookingAt, gameState }) => {
  var symbolSize = 100;
  if (mapInfo.symbol == "boss_skull") {
    symbolSize = 250;
  } else if (mapInfo.symbol == "skull") {
    symbolSize = 160;
  } else if (mapInfo.symbol == "choice") {
    symbolSize = 120;
  } else if (mapInfo.type == "end") {
    symbolSize = 150;
  }

  return (
    <>
      {mapInfo.type == "match" && mapInfo.enemy && (
        <>
          <div
            className={"absolute " + (lookingAt ? "sway" : "")}
            style={{
              backgroundImage:
                "url(/enemies/" +
                (mapInfo.zone <= gameState.map[gameState.pos].zone
                  ? mapInfo.enemy.name
                  : "question_mark") +
                ".svg)",
              transition: BOUNCE_TRANSITION,
              left:
                INNER_WIDTH / 2 -
                (DRAWING_SCALE * 320) / 2 +
                mIndex * MAP_VIEW_DOT_SPACING,
              bottom: MAP_VIEW_DOT_BOTTOM_PADDING + (lookingAt ? 150 : 100),
              width: DRAWING_SCALE * 320 + "px",
              height: DRAWING_SCALE * 320 + "px",
              backgroundSize: "contain",
            }}
          ></div>

          <div
            className={"absolute text-center text-3xl"}
            style={{
              transition: BOUNCE_TRANSITION,
              left:
                INNER_WIDTH / 2 -
                (DRAWING_SCALE * 320) / 2 +
                mIndex * MAP_VIEW_DOT_SPACING,
              bottom:
                MAP_VIEW_DOT_BOTTOM_PADDING +
                (lookingAt ? 180 : 130) +
                DRAWING_SCALE * 320,
              width: DRAWING_SCALE * 320 + "px",
              height: DRAWING_SCALE * 100 + "px",
              backgroundSize: "contain",
            }}
          >
            <SymbolText
              msg={mapInfo.enemy.health + " [heart]"}
              marginLeft={0}
              size={50}
            />
          </div>
          <div
            className={"absolute text-center"}
            style={{
              transition: BOUNCE_TRANSITION,
              left:
                INNER_WIDTH / 2 -
                (DRAWING_SCALE * 320) / 2 +
                mIndex * MAP_VIEW_DOT_SPACING,
              bottom: MAP_VIEW_DOT_BOTTOM_PADDING + (lookingAt ? 80 : 50),
              width: DRAWING_SCALE * 320 + "px",
              height: DRAWING_SCALE * 100 + "px",
              backgroundSize: "contain",
            }}
          >
            <SymbolText
              msg={mapInfo.enemy.abilityDesc}
              marginLeft={0}
              size={40}
            />
          </div>
        </>
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

      {mapInfo.type == "choice" && (
        <>
          <div
            className={"absolute "}
            style={{
              backgroundImage: "url(/ui/map/" + mapInfo.choice1.type + ".svg)",
              transition: BOUNCE_TRANSITION,
              left:
                INNER_WIDTH / 2 -
                DRAWING_SCALE * 90 +
                mIndex * MAP_VIEW_DOT_SPACING,
              bottom:
                MAP_VIEW_DOT_BOTTOM_PADDING +
                (lookingAt ? 20 : 0) +
                DRAWING_SCALE * 70,
              width: DRAWING_SCALE * 80 + "px",
              height: DRAWING_SCALE * 80 + "px",
              backgroundSize: "contain",
            }}
          ></div>
          <div
            className={"absolute "}
            style={{
              backgroundImage: "url(/ui/map/" + mapInfo.choice2.type + ".svg)",
              transition: BOUNCE_TRANSITION,
              left:
                INNER_WIDTH / 2 +
                (DRAWING_SCALE * 15) / 2 +
                mIndex * MAP_VIEW_DOT_SPACING,
              bottom:
                MAP_VIEW_DOT_BOTTOM_PADDING +
                (lookingAt ? 20 : 0) -
                (DRAWING_SCALE * 50) / 2,
              width: DRAWING_SCALE * 80 + "px",
              height: DRAWING_SCALE * 80 + "px",
              backgroundSize: "contain",
            }}
          ></div>
        </>
      )}

      {mapInfo.type != "end" && (
        <div
          className={"absolute "}
          style={{
            backgroundImage: "url(/ui/map/black_dot.svg)",
            transition: BOUNCE_TRANSITION,
            left:
              INNER_WIDTH / 2 -
              (DRAWING_SCALE * 30) / 2 +
              (mIndex + 0.5) * MAP_VIEW_DOT_SPACING,
            bottom: MAP_VIEW_DOT_BOTTOM_PADDING + DRAWING_SCALE * 30,
            width: DRAWING_SCALE * 30 + "px",
            height: DRAWING_SCALE * 30 + "px",
            backgroundSize: "contain",
          }}
        ></div>
      )}
    </>
  );
};

export default Waypoint;
