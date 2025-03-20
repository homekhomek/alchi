import { useEffect, useMemo, useState } from "react";
import { DRAWING_SCALE } from "../const";

const BOX_OFFSET = 20;

const BlackBox = ({ width, height }) => {
  return (
    <div
      className="absolute"
      style={{
        width: width,
        height: height,
      }}
    >
      <div
        className="absolute"
        style={{
          backgroundImage: "url(/ui/black_box/corner1.svg)",
          left: 0,
          top: 0,
          width: DRAWING_SCALE * 40 + "px",
          height: DRAWING_SCALE * 40 + "px",
          transform: `rotate(90deg)`,
          backgroundSize: "100%",
          zIndex: 1,
        }}
      ></div>
      <div
        className="absolute"
        style={{
          backgroundImage: "url(/ui/black_box/corner1.svg)",
          left: 0,
          bottom: 0,
          width: DRAWING_SCALE * 40 + "px",
          height: DRAWING_SCALE * 40 + "px",
          backgroundSize: "100%",
          zIndex: 1,
        }}
      ></div>
      <div
        className="absolute"
        style={{
          backgroundImage: "url(/ui/black_box/corner1.svg)",
          right: 0,
          top: 0,
          width: DRAWING_SCALE * 40 + "px",
          height: DRAWING_SCALE * 40 + "px",
          backgroundSize: "100%",
          transform: `rotate(180deg)`,
          zIndex: 1,
        }}
      ></div>
      <div
        className="absolute"
        style={{
          backgroundImage: "url(/ui/black_box/corner1.svg)",
          right: 0,
          bottom: 0,
          width: DRAWING_SCALE * 40 + "px",
          height: DRAWING_SCALE * 40 + "px",
          backgroundSize: "100%",
          transform: `rotate(270deg)`,
          zIndex: 1,
        }}
      ></div>
      <div
        className="absolute"
        style={{
          backgroundImage: "url(/ui/black_box/edge1.svg)",
          right: 0,
          height: height - DRAWING_SCALE * 80 + "px",
          top: DRAWING_SCALE * 40 + "px",
          width: DRAWING_SCALE * 40 + "px",
          backgroundSize: "100%",
          transform: `rotate(180deg)`,
          backgroundRepeat: "none",
          zIndex: 1,
        }}
      ></div>
      <div
        className="absolute"
        style={{
          backgroundImage: "url(/ui/black_box/edge1.svg)",
          left: 0,
          height: height - DRAWING_SCALE * 80 + "px",
          top: DRAWING_SCALE * 40 + "px",
          width: DRAWING_SCALE * 40 + "px",
          backgroundSize: "100%",
          backgroundRepeat: "none",
          zIndex: 1,
        }}
      ></div>
      <div
        className="absolute"
        style={{
          backgroundImage: "url(/ui/black_box/edge1.svg)",
          top: 0,
          width: width - DRAWING_SCALE * 80 + "px",
          left: DRAWING_SCALE * 40 + "px",
          height: DRAWING_SCALE * 40 + "px",
          backgroundSize: "100%",
          backgroundRepeat: "none",
          zIndex: 1,
        }}
      ></div>
    </div>
  );
};

export default BlackBox;
