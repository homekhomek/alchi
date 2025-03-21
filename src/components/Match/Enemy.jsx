import { useEffect, useState } from "react";
import {
  DRAWING_SCALE,
  FULL_CARD_HEIGHT,
  INNER_HEIGHT,
  INNER_WIDTH,
  PLAY_OFFSET,
  suits,
} from "../../const";

const Enemy = ({ animStep, matchData }) => {
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
    <div
      className="absolute"
      style={{
        backgroundImage: "url(/enemies/rat_bishop.svg)",
        left: INNER_WIDTH / 2 - 160 * DRAWING_SCALE * 1.5,
        top: INNER_HEIGHT + PLAY_OFFSET - DRAWING_SCALE * 580 + "px",
        width: DRAWING_SCALE * 320 * 1.5 + "px",
        height: DRAWING_SCALE * 320 * 1.5 + "px",
        transform: `rotate(${enemyShakeRot}deg)`,
        backgroundSize: "contain",
        zIndex: 1,
      }}
    ></div>
  );
};

export default Enemy;
