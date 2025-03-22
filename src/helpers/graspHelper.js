import { CARD_HEIGHT } from "../const";
import { dist } from "./helper";

export const getClosestDropPoint = (graspID, graspPos, possibleDropPoints) => {
  if (graspID == null || !graspID || possibleDropPoints.length <= 0)
    return null;

  var closestPoint = null;
  var closestPointDistance = null;

  possibleDropPoints.forEach((p) => {
    var distanceToPoint = dist(
      p.x,
      p.y,
      graspPos.x,
      graspPos.y - CARD_HEIGHT * 0.5
    );
    if (closestPoint == null) {
      closestPoint = p;
      closestPointDistance = distanceToPoint;
    } else if (distanceToPoint < closestPointDistance) {
      closestPoint = p;
      closestPointDistance = distanceToPoint;
    }
  });

  return closestPoint;
};
