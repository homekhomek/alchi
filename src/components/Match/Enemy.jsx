import { useEffect, useState } from "react";
import {
  BOUNCE_TRANSITION,
  DRAWING_SCALE,
  FULL_CARD_HEIGHT,
  INNER_HEIGHT,
  INNER_WIDTH,
  PLAY_OFFSET,
  suits,
} from "../../const";
import SymbolText from "../SymbolText";
import TextSymbol from "../TextSymbol";

const Enemy = ({ animStep, matchData, enemy }) => {
  const [enemyShakeRot, setEnemyShakeRot] = useState(0);
  useEffect(() => {
    if (matchData.state != "damaging") return;

    var shakeInterval = setInterval(() => {
      setEnemyShakeRot(Math.floor(Math.random() * 11) - 5);
    }, 20);

    return () => {
      setEnemyShakeRot(0);
      clearInterval(shakeInterval);
    };
  }, [matchData.state]);
  return (
    <>
      <div
        className="absolute text-center text-3xl"
        style={{
          transition: "all .25s cubic-bezier(.47,1.64,.41,.8)",
          left: innerWidth / 2 - 250 + (matchData.scoreInHand == 0 ? 0 : -33),
          width: 500,
          top: INNER_HEIGHT + PLAY_OFFSET - DRAWING_SCALE * 760 + "px",
          height: 50,
        }}
      >
        <SymbolText msg={matchData.scoreToBeat + "[heart]"} />
      </div>
      <div
        className="absolute text-center text-3xl"
        style={{
          transition: "all .25s cubic-bezier(.47,1.64,.41,.8)",
          left: innerWidth / 2 - 250 + (matchData.scoreInHand == 0 ? 0 : 33),
          opacity: matchData.scoreInHand == 0 ? "0" : "1",
          width: 500,
          top: INNER_HEIGHT + PLAY_OFFSET - DRAWING_SCALE * 760 + "px",
          height: 50,
        }}
      >
        {matchData.scoreInHand > 0 ? "-" : "+"}
        {Math.abs(matchData.scoreInHand)}

        {matchData.scoreInHand > 0 ? (
          <TextSymbol symbol={"sword"}></TextSymbol>
        ) : (
          <TextSymbol symbol={"heart"}></TextSymbol>
        )}
      </div>
      <div
        className="absolute"
        style={{
          backgroundImage: "url(/enemies/" + enemy.name + ".svg)",
          transition: BOUNCE_TRANSITION,
          left: INNER_WIDTH / 2 - 160 * DRAWING_SCALE * 1.2,
          top: INNER_HEIGHT + PLAY_OFFSET - DRAWING_SCALE * 590 + "px",
          width: DRAWING_SCALE * 320 * 1.2 + "px",
          height: DRAWING_SCALE * 320 * 1.2 + "px",
          transform: `rotate(${enemyShakeRot}deg) scale(${
            animStep >= 11 ? ".8" : "1"
          })`,
          backgroundSize: "contain",
          opacity: animStep >= 11 ? ".5" : "1",
          zIndex: 1,
        }}
      ></div>
    </>
  );
};

export default Enemy;
