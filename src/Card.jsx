import React, { useState } from "react";
import { CARD_HEIGHT, CARD_WIDTH } from "./const";

const Card = ({
  flippedToBack = false,
  top = 0,
  left = 0,
  z = 0,
  rotate = 0,
  scale = 1,
  opacity = 1,
}) => {
  const [flipped, setFlipped] = useState(flippedToBack);

  return (
    <div
      className={`absolute perspective-normal bg-transparent transition-all shadow`}
      style={{
        width: `${CARD_WIDTH}px`,
        height: `${CARD_HEIGHT}px`,
        top: `${top}px`,
        left: `${left}px`,
        zIndex: z,
        transform: `rotate(${rotate}deg) scale(${scale})`,
        opacity: opacity,
      }}
      onClick={() => {
        setFlipped(!flipped);
      }}
    >
      <div
        className="relative w-full h-full transform-3d"
        style={{
          transform: flipped ? "rotateY(180deg)" : "",
          transition: "transform .5s cubic-bezier(.47,1.64,.41,.8)",
        }}
      >
        <div className="w-full h-full absolute backface-hidden bg-red-200 rounded-md"></div>
        <div className="w-full h-full absolute backface-hidden rotate-y-180 bg-blue-200 rounded-md"></div>
      </div>
    </div>
  );
};

export default Card;
