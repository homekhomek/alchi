import { useEffect, useMemo, useState } from "react";
import { DRAWING_SCALE } from "../const";

const BOX_OFFSET = 20;

const variants = [1, 2, 3];

const BlackBox = ({ width, height, children }) => {
  const [drawNums, setDrawNums] = useState([1, 2, 3, 1, 2, 3, 1, 2]);

  useEffect(() => {
    const rotateDrawNums = setInterval(() => {
      setDrawNums((oldNums) => [...oldNums.map((n) => (n % 3) + 1)]);
    }, 1000);

    return () => {
      clearInterval(rotateDrawNums);
    };
  }, []);

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
          width: width - DRAWING_SCALE * 80 + "px",
          height: height - DRAWING_SCALE * 80 + "px",
          left: DRAWING_SCALE * 40 + "px",
          top: DRAWING_SCALE * 40 + "px",
          backgroundColor: "#050e1a",
          zIndex: 2,
        }}
      >
        {children}
      </div>

      {variants.map((v) => (
        <div
          className="absolute"
          style={{
            backgroundImage: `url(/ui/black_box/corner${v}.svg)`,
            left: 0,
            top: 0,
            width: DRAWING_SCALE * 40 + "px",
            height: DRAWING_SCALE * 40 + "px",
            transform: `rotate(90deg)`,
            backgroundSize: "cover",
            zIndex: 1,
            opacity: v == drawNums[0] ? "1" : "0",
          }}
        ></div>
      ))}

      {variants.map((v) => (
        <div
          className="absolute"
          style={{
            backgroundImage: `url(/ui/black_box/corner${v}.svg)`,
            left: 0,
            bottom: 0,
            width: DRAWING_SCALE * 40 + "px",
            height: DRAWING_SCALE * 40 + "px",
            backgroundSize: "100%",
            zIndex: 1,
            opacity: v == drawNums[1] ? "1" : "0",
          }}
        ></div>
      ))}

      {variants.map((v) => (
        <div
          className="absolute"
          style={{
            backgroundImage: `url(/ui/black_box/corner${v}.svg)`,
            right: "1px",
            top: 0,
            width: DRAWING_SCALE * 40 + "px",
            height: DRAWING_SCALE * 40 + "px",
            backgroundSize: "100%",
            transform: `rotate(180deg)`,
            zIndex: 1,
            opacity: v == drawNums[2] ? "1" : "0",
          }}
        ></div>
      ))}

      {variants.map((v) => (
        <div
          className="absolute"
          style={{
            backgroundImage: `url(/ui/black_box/corner${v}.svg)`,
            right: "1px",
            bottom: 0,
            width: DRAWING_SCALE * 40 + "px",
            height: DRAWING_SCALE * 40 + "px",
            backgroundSize: "100%",
            transform: `rotate(270deg)`,
            zIndex: 1,
            opacity: v == drawNums[3] ? "1" : "0",
          }}
        ></div>
      ))}

      {variants.map((v) => (
        <div
          className="absolute"
          style={{
            backgroundImage: `url(/ui/black_box/edge${v}.svg)`,
            right: "1px",
            height: height - DRAWING_SCALE * 80 + "px",
            top: DRAWING_SCALE * 40 + "px",
            width: Math.floor(DRAWING_SCALE * 40) + "px",
            backgroundSize: "100% auto",
            backgroundRepeat: "repeat-y",
            transform: `rotate(180deg)`,
            zIndex: 1,
            opacity: v == drawNums[4] ? "1" : "0",
          }}
        ></div>
      ))}

      {variants.map((v) => (
        <div
          className="absolute"
          style={{
            backgroundImage: `url(/ui/black_box/edge${v}.svg)`,
            left: 0,
            height: height - DRAWING_SCALE * 80 + "px",
            top: DRAWING_SCALE * 40 + "px",
            width: DRAWING_SCALE * 40 + "px",
            backgroundSize: "100% auto",
            zIndex: 1,
            opacity: v == drawNums[5] ? "1" : "0",
          }}
        ></div>
      ))}

      {variants.map((v) => (
        <div
          className="absolute"
          style={{
            backgroundImage: `url(/ui/black_box/edge${v}.svg)`,
            left: width / 2 - DRAWING_SCALE * 20 + "px",
            height: width - DRAWING_SCALE * 80 + "px",
            top: DRAWING_SCALE * 60 - width / 2 + "px",
            width: DRAWING_SCALE * 40 + "px",
            backgroundSize: "100% auto",
            transform: `rotate(90deg)`,
            zIndex: 1,
            opacity: v == drawNums[6] ? "1" : "0",
          }}
        ></div>
      ))}
      {variants.map((v) => (
        <div
          className="absolute"
          style={{
            backgroundImage: `url(/ui/black_box/edge${v}.svg)`,
            left: width / 2 - DRAWING_SCALE * 20 + "px",
            height: width - DRAWING_SCALE * 80 + "px",
            bottom: Math.floor(DRAWING_SCALE * 60) - width / 2 + 1 + "px",
            width: Math.floor(DRAWING_SCALE * 40) + "px",
            backgroundSize: "100% auto",
            transform: `rotate(270deg)`,
            zIndex: 1,
            opacity: v == drawNums[7] ? "1" : "0",
          }}
        ></div>
      ))}
    </div>
  );
};

export default BlackBox;
