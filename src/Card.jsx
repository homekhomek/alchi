import React, { useEffect, useMemo, useState } from "react";
import {
  CARD_HEIGHT,
  CARD_HEIGHT_PADDING,
  CARD_WIDTH,
  CARD_WIDTH_PADDING,
} from "./const";

const Card = ({
  flippedToBack = false,
  top = 0,
  left = 0,
  z = 0,
  rotate = 0,
  scale = 1,
  opacity = 1,
  cardData = {},
  graspStart = () => {},
}) => {
  const [shakeRot, setShakeRot] = useState(0);

  useEffect(() => {
    if (!cardData.shaking) return;

    var shakeInterval = setInterval(() => {
      setShakeRot(Math.floor(Math.random() * 7) - 3);
    }, 20);

    return () => {
      setShakeRot(0);
      clearInterval(shakeInterval);
    };
  }, [cardData.shaking]);

  const transString = useMemo(() => {
    if (cardData.loc == "play" && cardData.shaking) return "none";
    else if (cardData.loc == "grasp")
      return "transform .5s cubic-bezier(.47,1.64,.41,.8)";

    return "all .15s cubic-bezier(0.4, 0, 0.2, 1)";
  }, [cardData.loc, cardData.shaking]);

  const trueScale = useMemo(() => {
    return scale + (cardData.shrink ? -0.1 : 0) + (cardData.scoring ? 0.1 : 0);
  }, [cardData.shrink, cardData.scoring, scale]);

  return (
    <div
      className={`absolute perspective-normal bg-transparent`}
      style={{
        width: `${CARD_WIDTH}px`,
        height: `${CARD_HEIGHT}px`,
        top: `${top}px`,
        left: `${left}px`,
        zIndex: z,
        transform: `rotate(${rotate + shakeRot}deg) scale(${trueScale})`,
        transition: transString,
        opacity: opacity,
      }}
      onPointerDown={(ev) => {
        graspStart(ev, cardData);
      }}
    >
      <div
        className="relative w-full h-full transform-3d  "
        style={{
          transform: flippedToBack ? "rotateY(180deg)" : "",
          transition: "transform .8s cubic-bezier(.47,1.64,.41,.8)",
        }}
      >
        <div className="w-full h-full absolute backface-hidden font-earth text-sm ">
          <div
            className="absolute "
            style={{
              left: -CARD_WIDTH_PADDING + "px",
              top: -CARD_HEIGHT_PADDING + "px",
              width: (CARD_WIDTH / 240) * 260,
              height: (CARD_HEIGHT / 360) * 380,
              backgroundImage: `url(/cards/suits/${cardData.suit}_back.svg)`,
              backgroundSize: "contain",
            }}
          ></div>
          {cardData.middle &&
            cardData.middle.map((m) => {
              var desc = [];

              if (m.effect) {
                if (m.effect.conditional) {
                  desc.push({ type: "symbol", value: m.effect.conditional });
                  desc.push({ type: "symbol", value: "arrow" });
                }
                if (m.effect.type == "add_points") {
                  desc.push({
                    type: "text",
                    value:
                      m.effect.value >= 0
                        ? "+" + m.effect.value
                        : m.effect.value,
                  });
                }
              }
              return (
                <div
                  className="absolute "
                  style={{
                    left: -CARD_WIDTH_PADDING + "px",
                    top: -CARD_HEIGHT_PADDING + "px",
                    width: (CARD_WIDTH / 240) * 260,
                    height: (CARD_HEIGHT / 360) * 380,
                    backgroundImage: `url(/cards/suits/${
                      m.suit ? m.suit : "neutral"
                    }_effect.svg)`,
                    backgroundSize: "contain",
                  }}
                >
                  <div className="w-full absolute bottom-0 h-[25px] text-center pt-[3px]">
                    {desc.map((d) => {
                      if (d.type == "symbol") {
                        return (
                          <img
                            src={`/cards/suits/symbols/${d.value}.svg`}
                            className="inline-block mt-[-2px]"
                            style={{
                              height: (CARD_HEIGHT / 360) * 45 + "px",
                            }}
                          ></img>
                        );
                      } else {
                        return d.value;
                      }
                    })}
                  </div>
                </div>
              );
            })}
          {cardData.left &&
            cardData.left.map((l) => (
              <div
                className="absolute "
                style={{
                  left: -CARD_WIDTH_PADDING + "px",
                  top: -CARD_HEIGHT_PADDING - 10 + "px",
                  width: (CARD_WIDTH / 240) * 260,
                  height: (CARD_HEIGHT / 360) * 380,
                  backgroundImage: `url(/cards/suits/${l.suit}_left.svg)`,
                  backgroundSize: "contain",
                }}
              ></div>
            ))}

          {cardData.right &&
            cardData.right.map((r) => (
              <div
                className="absolute "
                style={{
                  left: -CARD_WIDTH_PADDING + "px",
                  top: -CARD_HEIGHT_PADDING - 10 + "px",
                  width: (CARD_WIDTH / 240) * 260,
                  height: (CARD_HEIGHT / 360) * 380,
                  backgroundImage: `url(/cards/suits/${r.suit}_right.svg)`,
                  backgroundSize: "contain",
                }}
              ></div>
            ))}

          <div
            className="absolute "
            style={{
              left: -CARD_WIDTH_PADDING + "px",
              top: -CARD_HEIGHT_PADDING + "px",
              width: (CARD_WIDTH / 240) * 260,
              height: (CARD_HEIGHT / 360) * 380,
              backgroundImage: `url(/cards/suits/${cardData.suit}_front.svg)`,
              backgroundSize: "contain",
            }}
          ></div>
          <div className="absolute w-[21px] top-[6px] right-[1px] text-center">
            {cardData.showValue}
          </div>
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
