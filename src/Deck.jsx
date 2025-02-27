import React, { useEffect, useMemo, useState } from "react";
import Card from "./Card";

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const Deck = ({ numberOfCards }) => {
  const [currentCards, setCurrentCards] = useState(0);
  const [cardStates, setCardStates] = useState(Array.from({ length: 100 }));

  useEffect(() => {
    let timer;

    var nextAction = () => {
      if (currentCards < numberOfCards) {
        timer = setTimeout(async () => {
          setCurrentCards((prev) => prev + 1);
          nextAction();
        }, 50);
      }
    };

    nextAction();

    return () => clearTimeout(timer);
  }, [numberOfCards, currentCards]);

  return (
    <div className="m-5 relative">
      {cardStates.map((c, cIndex) => {
        return (
          <Card
            flippedToBack={true}
            rotate={-3.3 + seededRandom(cIndex) * 6}
            opacity={cIndex < currentCards ? 1 : 0}
            top={cIndex < currentCards ? -cIndex * 2 + 150 : -50}
            left={cIndex < currentCards ? 0 : -100 + seededRandom(cIndex) * 200}
          />
        );
      })}
    </div>
  );
};

export default Deck;
