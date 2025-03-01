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
  cardData = {},
  onCardClick = () => {},
  graspStart = () => {},
}) => {
  return (
    <div
      className={`absolute perspective-normal bg-transparent shadow `}
      style={{
        width: `${CARD_WIDTH}px`,
        height: `${CARD_HEIGHT}px`,
        top: `${top}px`,
        left: `${left}px`,
        zIndex: z,
        transform: `rotate(${rotate}deg) scale(${scale})`,
        transition:
          cardData.loc == "grasp"
            ? "transform .5s cubic-bezier(.47,1.64,.41,.8)"
            : "all .15s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: opacity,
      }}
      onClick={() => {
        onCardClick(cardData);
        console.log("boom");
      }}
      onPointerDown={(ev) => {
        graspStart(ev, cardData);
      }}
    >
      <div
        className="relative w-full h-full transform-3d  border-[#2e222f] border-solid border-2"
        style={{
          transform: flippedToBack ? "rotateY(180deg)" : "",
          transition: "transform .8s cubic-bezier(.47,1.64,.41,.8)",
        }}
      >
        <div className="w-full h-full absolute backface-hidden font-earth text-sm  bg-blue-200">
          <div className="absolute top-[1px] right-[2px] ">
            {cardData.startingValue}
          </div>
          <div className="absolute top-[1px] left-[2px] ">{cardData.suit}</div>
          {cardData.left &&
            cardData.left.map((l) => (
              <div className="absolute bottom-[20px] left-3px">
                {l.suit} {l.value}{" "}
              </div>
            ))}
          {cardData.right &&
            cardData.right.map((r) => (
              <div className="absolute bottom-[40px] right-[3px]">
                {r.suit} {r.value}{" "}
              </div>
            ))}
        </div>
        <div className="w-full h-full absolute backface-hidden rotate-y-180">
          <img
            src="/cards/suits/card_back.png"
            className="w-full h-full "
          ></img>
        </div>
      </div>
    </div>
  );
};

export default Card;
