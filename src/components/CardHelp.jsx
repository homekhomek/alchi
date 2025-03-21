import { useEffect, useState } from "react";
import { suits } from "../const";
import TextSymbol from "./TextSymbol";

const CardHelp = ({ card, graspPos }) => {
  const [show, setShow] = useState(false);
  const [suit, setSuit] = useState(suits[0]);
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
      className="absolute text-center bg-[#c4bbb3] p-2 text-lg"
      style={{
        transition: "opacity .2s ease",
        opacity: show ? "1" : "0",
      }}
    >
      {cardFocus && (
        <>
          <div className="w-full text-lg block">
            <TextSymbol symbol={cardFocus.suit} marginRight={5} />
            Ingredient Details
          </div>
          <div className="w-full text-sm block">
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
                  <div className="block mb-2">
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
                  <div className="block mb-2">
                    +<TextSymbol marginLeft={0} symbol={"sword"} /> from right{" "}
                    <TextSymbol marginLeft={0} symbol={so.suit} />
                  </div>
                </>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CardHelp;
