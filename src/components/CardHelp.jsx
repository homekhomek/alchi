import { useEffect, useState } from "react";
import { FULL_CARD_HEIGHT, INNER_HEIGHT, suits } from "../const";
import TextSymbol from "./TextSymbol";

const CardHelp = ({ card, graspPos }) => {
  const [show, setShow] = useState(false);
  const [cardFocus, setCardFocus] = useState(null);

  useEffect(() => {
    if (!card) {
      setShow(false);
      return;
    }

    setSuit(suits.find((s) => s.name == card.suit));
    setCardFocus(card);

    var showTimeout = setTimeout(() => {
      setShow(true);
    }, 1500);

    return () => {
      clearTimeout(showTimeout);
    };
  }, [card]);

  return (
    <div
      className="fixed text-center bg-[#c4bbb3] p-2 text-lg border-2 border-solid border-[#050e1a] rounded-lg"
      style={{
        transition: "opacity .5s ease, transform .5s ease",
        opacity: show ? "1" : "0",
        left: "50%",
        bottom: graspPos.y
          ? INNER_HEIGHT - graspPos.y + FULL_CARD_HEIGHT * 1.4 + "px"
          : "20px",
        transform: show
          ? " translateX(-50%) scale(1) "
          : "translateX(-50%) scale(0.8) ",
        zIndex: 30,
      }}
    >
      {cardFocus && (
        <>
          <div className="w-full text-lg block border-b-2 border-dashed border-[#050e1a]">
            <TextSymbol symbol={cardFocus.suit} marginRight={3} />
            Ingredient Details
          </div>
          <div className="w-full text-sm block mt-1">
            {cardFocus.showValue > 0 ? "+" : ""}
            {cardFocus.showValue}
            <TextSymbol symbol="sword" />
          </div>
          <div className=" text-sm block w-full">
            {cardFocus.left &&
              cardFocus.left.map((so) => (
                <>
                  <div className="block text-xs">
                    <TextSymbol symbol="arrow_down" marginLeft={0} />
                  </div>
                  <div className="block mb-1">
                    +<TextSymbol marginLeft={0} symbol={"sword"} /> from left{" "}
                    <TextSymbol marginLeft={0} symbol={so.suit} />
                  </div>
                </>
              ))}
            {cardFocus.right &&
              cardFocus.right.map((so) => (
                <>
                  <div className="block text-xs">
                    <TextSymbol symbol="arrow_down" marginLeft={0} />
                  </div>
                  <div className="block mb-1">
                    +<TextSymbol marginLeft={0} symbol={"sword"} /> from right{" "}
                    <TextSymbol marginLeft={0} symbol={so.suit} />
                  </div>
                </>
              ))}
            {cardFocus.middle &&
              cardFocus.middle.map((so) => {
                return (
                  <>
                    <div className="block text-xs">
                      <TextSymbol symbol="arrow_down" marginLeft={0} />
                    </div>
                    {suits.some((s) => s.name == so.conditional) && (
                      <div className="block mb-1">
                        for each
                        <TextSymbol
                          marginLeft={3}
                          marginRight={3}
                          symbol={so.conditional}
                        />
                        :
                      </div>
                    )}
                    {so.conditional == "first_card" && (
                      <div className="block mb-1">if first:</div>
                    )}

                    {so.type == "add_points" && (
                      <div className="block mb-2 ">
                        {so.value > 0 ? "+" : ""}
                        {so.value}
                        <TextSymbol symbol="sword" />
                      </div>
                    )}
                  </>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};

export default CardHelp;
