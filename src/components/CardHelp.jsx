import { useEffect, useState } from "react";
import { FULL_CARD_HEIGHT, INNER_HEIGHT, suits } from "../const";
import TextSymbol from "./TextSymbol";
import SymbolText from "./SymbolText";

const CardHelp = ({ card, graspPos, customDelay = 1500 }) => {
  const [show, setShow] = useState(false);
  const [cardFocus, setCardFocus] = useState(null);

  useEffect(() => {
    if (!card) {
      setShow(false);
      return;
    }

    setCardFocus(card);

    var showTimeout = setTimeout(() => {
      setShow(true);
    }, customDelay);

    return () => {
      clearTimeout(showTimeout);
    };
  }, [card]);

  return (
    <div
      className="fixed text-center bg-[#c4bbb3] p-2 text-lg border-2 border-solid border-[#050e1a] rounded-lg"
      style={{
        transition: "opacity .3s ease, transform .3s ease",
        opacity: show ? "1" : "0",
        left: "50%",
        bottom: graspPos.y
          ? INNER_HEIGHT - graspPos.y + FULL_CARD_HEIGHT * 1.5 + "px"
          : "20px",
        transform: show
          ? " translateX(-50%) scale(1) "
          : "translateX(-50%) scale(0.8) ",
        zIndex: 999,
        pointerEvents: "none",
      }}
    >
      {cardFocus && (
        <>
          <div className="w-full text-lg block border-b-2 border-dashed border-[#050e1a]">
            <TextSymbol symbol={cardFocus.suit} marginRight={3} />
            Ingredient Details
          </div>
          <div className="w-full text-sm block mt-1">
            {cardFocus.showValue == null
              ? cardFocus.startingValue > 0
                ? "+"
                : ""
              : cardFocus.showValue > 0
              ? "+"
              : ""}
            {cardFocus.showValue == null
              ? cardFocus.startingValue
              : cardFocus.showValue}
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
                        <SymbolText
                          msg={`for each [${so.conditional}]:`}
                          marginLeft={1}
                          marginRight={3}
                          marginTop={0}
                        />
                      </div>
                    )}
                    {so.conditional == "first_card" && (
                      <div className="block mb-1">if first:</div>
                    )}

                    {so.type == "add_points" && (
                      <div className="block mb-2 ">
                        {so.value > 0 ? "+" : ""}
                        {so.value}
                        <TextSymbol symbol="sword" marginTop={0} />
                      </div>
                    )}
                    {so.type == "multiply_points" && (
                      <div className="block mb-2 ">
                        x{so.value}
                        <TextSymbol symbol="sword" marginTop={0} />
                      </div>
                    )}
                    {so.type == "draw_card" && (
                      <div className="block mb-2 ">
                        {so.value > 1
                          ? "draw " + so.value + " cards"
                          : "draw a card"}
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
