import {
  CARD_HEIGHT,
  CARD_WIDTH,
  FULL_CARD_WIDTH,
  HAND_OFFSET,
  HAND_WIDTH,
  INNER_HEIGHT,
  INNER_WIDTH,
  PLAY_OFFSET,
} from "./const";

export const getCardRenderInfo = (
  curCard,
  matchData,
  closestGraspSpot,
  graspPos
) => {
  if (curCard.loc == "deck") {
    var deckIndex = matchData.deck.indexOf(curCard);
    return {
      scale: 0.8,
      top: INNER_HEIGHT - CARD_HEIGHT - deckIndex * 2,
      left:
        matchData.discard.length > 0
          ? INNER_WIDTH / 2 - CARD_WIDTH * 1.5
          : INNER_WIDTH / 2 - CARD_WIDTH / 2,
      rotate: 0,
      z: deckIndex,
    };
  } else if (curCard.loc == "discard") {
    var discardIndex = matchData.discard.indexOf(curCard);
    return {
      scale: 0.8,
      top: INNER_HEIGHT - CARD_HEIGHT - discardIndex * 2,
      left: INNER_WIDTH / 2 + CARD_WIDTH * 0.5,
      rotate: 0,
      z: discardIndex + 30,
    };
  } else if (curCard.loc == "hand") {
    var handIndex = matchData.hand.indexOf(curCard);
    var totalCards = matchData.hand.length;
    if (closestGraspSpot != null && closestGraspSpot.loc == "hand") {
      if (closestGraspSpot.ind <= handIndex) handIndex += 1;
      totalCards += 1;
    }
    var offsetIndex = handIndex + 0.5 - totalCards / 2;
    var yOffset = Math.sin(0.6 * offsetIndex + Math.PI / 2) * 8;

    var cardSeperation = HAND_WIDTH / (totalCards + 1);

    return {
      scale: 1,
      left:
        (handIndex + 1) * cardSeperation -
        CARD_WIDTH / 2 -
        HAND_WIDTH / 2 +
        offsetIndex * 4 +
        INNER_WIDTH / 2,
      top: INNER_HEIGHT + HAND_OFFSET - yOffset,
      rotate: offsetIndex * 2,
      z: -handIndex + 10,
    };
  } else if (curCard.loc == "play") {
    var playIndex = matchData.play.indexOf(curCard);
    var totalCards = matchData.play.length;
    if (closestGraspSpot != null && closestGraspSpot.loc == "play") {
      if (closestGraspSpot.ind <= playIndex) playIndex += 1;
      totalCards += 1;
    }

    return {
      scale: curCard.scoring ? 1.1 : 1,
      left:
        playIndex * FULL_CARD_WIDTH -
        (totalCards * FULL_CARD_WIDTH) / 2 +
        INNER_WIDTH / 2,
      top: INNER_HEIGHT + PLAY_OFFSET,
      rotate: 0,
      z: playIndex + 10,
    };
  } else if (curCard.loc == "grasp") {
    return {
      scale: 1.2,
      left: graspPos.x - CARD_WIDTH / 2,
      top: graspPos.y - CARD_HEIGHT * 1.2,
      rotate: 0,
      z: 20,
    };
  }
  return {
    scale: 1,
    top: INNER_HEIGHT - CARD_HEIGHT,
    left: INNER_WIDTH / 2 - CARD_WIDTH / 2,
    rotate: 0,
    z: 1,
  };
};
