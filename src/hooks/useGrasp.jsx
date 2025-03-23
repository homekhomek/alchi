import { useState, useEffect, useMemo } from "react";
import { getClosestDropPoint } from "../helpers/graspHelper";

function useGrasp({ graspStartLogic, graspDropLogic }) {
  const [graspID, setGraspID] = useState(null);
  const [graspPos, setGraspPos] = useState({});
  const [possibleDropPoints, setPossibleDropPoints] = useState([]);

  const closestGraspSpot = useMemo(() => {
    return getClosestDropPoint(graspID, graspPos, possibleDropPoints);
  }, [graspID, graspPos, possibleDropPoints]);

  const graspMove = (ev) => {
    if (ev.pointerId == graspID) {
      setGraspPos({ x: ev.clientX, y: ev.clientY });
    }
  };

  const graspStart = (ev, card) => {
    ev.stopPropagation();
    var possPoints = graspStartLogic(card);

    if (possPoints != null) {
      setGraspID(ev.pointerId);
      setGraspPos({ x: ev.clientX, y: ev.clientY });
      setPossibleDropPoints(possPoints);
    }
  };

  const graspDrop = (ev) => {
    if (ev.pointerId == graspID) {
      setGraspID(null);
      graspDropLogic();
    }
  };

  return {
    graspID,
    graspPos,
    closestGraspSpot,
    graspMove,
    graspStart,
    graspDrop,
  };
}

export default useGrasp;
