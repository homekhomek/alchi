import {
  CARD_WIDTH,
  DRAWING_SCALE,
  FULL_CARD_HEIGHT,
  INNER_HEIGHT,
  INNER_WIDTH,
  PLAY_OFFSET,
  suits,
} from "../const";
import { sleep } from "./helper";
import { getCardRenderInfo } from "./matchHelper";

export const scoreCard = async (
  scoreInd,
  matchData,
  refreshMatch,
  graspPos,
  addHitMarker,
  drawCard,
  checkWin,
  addParticle,
  isReactivated = false
) => {
  // Conditional is met
  const doEffect = async (scoreObj, cardToScore, newCard) => {
    if (scoreObj.type == "add_points") {
      await adjustScore(scoreObj.value, cardToScore);
      return true;
    } else if (scoreObj.type == "multiply_points") {
      await adjustScore(
        (scoreObj.value - 1) * cardToScore.showValue,
        cardToScore
      );
      return true;
    } else if (scoreObj.type == "draw_card") {
      for (var i = 0; i < scoreObj.value; i++) await drawCard();

      return true;
    } else if (scoreObj.type == "move_towards_played" && !isReactivated) {
      if (matchData.play.indexOf(newCard) < matchData.play.indexOf(cardToScore))
        return await moveCard(cardToScore, true);
      else return await moveCard(cardToScore, false);
    } else if (scoreObj.type == "reactivate" && !isReactivated) {
      var cardTransform = getCardRenderInfo(
        cardToScore,
        matchData,
        null,
        graspPos
      );
      cardToScore.offsetY = FULL_CARD_HEIGHT / 2;
      cardToScore.offsetScale = 0.1;
      addParticle({
        startPos: {
          x: cardTransform.left + (CARD_WIDTH - 180 * DRAWING_SCALE) / 2,
          y: cardTransform.top,
        },
        endPos: {
          x: cardTransform.left + (CARD_WIDTH - 180 * DRAWING_SCALE) / 2,
          y: cardTransform.top,
        },
        startRot: 0,
        endRot: 360,
        time: 500,
        opacityDuration: 50,
        opacityTime: 450,
        transition: ".5s ease",
        opacityTransition: ".5s linear",
        img: "/icons/reactivate",
        size: 180 * DRAWING_SCALE,
      });
      refreshMatch();
      await sleep(750);
      cardToScore.offsetY = 0;
      cardToScore.offsetScale = 0;
      refreshMatch();

      await scoreCard(
        matchData.play.indexOf(cardToScore),
        matchData,
        refreshMatch,
        graspPos,
        addHitMarker,
        drawCard,
        checkWin,
        addParticle,
        true
      );
      return true;
    }
  };

  const moveCard = async (cardToMove, left = false) => {
    var playIndex = matchData.play.indexOf(cardToMove);
    if (
      matchData.play.length <= 1 ||
      (!left && matchData.play.length - 1 == playIndex) ||
      (left && playIndex == 0)
    )
      return false;

    if (left)
      [matchData.play[playIndex], matchData.play[playIndex - 1]] = [
        matchData.play[playIndex - 1],
        matchData.play[playIndex],
      ];
    else
      [matchData.play[playIndex], matchData.play[playIndex + 1]] = [
        matchData.play[playIndex + 1],
        matchData.play[playIndex],
      ];

    refreshMatch();

    return true;
  };

  // Increment score
  const adjustScore = async (value, cardToScore) => {
    var cardTransform = getCardRenderInfo(
      cardToScore,
      matchData,
      null,
      graspPos
    );
    cardToScore.shaking = true;
    refreshMatch();
    var targetScore = matchData.scoreInHand + value;
    if (value >= 0) {
      for (var k = 0; k < value; k++) {
        setTimeout(() => {
          addHitMarker(
            cardTransform.left +
              Math.floor(Math.random() * CARD_WIDTH * 0.5) +
              CARD_WIDTH * 0.25,
            cardTransform.top,
            "+1"
          );
          cardToScore.showValue += 1;
          matchData.scoreInHand += 1;
          refreshMatch();
        }, 50 * k);
      }
      await sleep(50 * (value + 2));
      if (matchData.scoreInHand != targetScore) {
        matchData.scoreInHand = targetScore;
        refreshMatch();
      }
    } else {
      for (var k = 0; k < value * -1; k++) {
        setTimeout(() => {
          addHitMarker(
            cardTransform.left +
              Math.floor(Math.random() * CARD_WIDTH * 0.5) +
              CARD_WIDTH * 0.25,
            cardTransform.top,
            "-1"
          );
          cardToScore.showValue -= 1;
          matchData.scoreInHand -= 1;
          refreshMatch();
        }, 50 * k);
      }
      await sleep(50 * (value * -1 + 2));
    }
    if (matchData.scoreInHand != targetScore) {
      matchData.scoreInHand = targetScore;
      refreshMatch();
    }

    cardToScore.shaking = false;
    refreshMatch();
  };

  const scoreCardLeft = async (cardToScore, cardToLeft) => {
    for (var j = 0; j < cardToScore.left.length; j++) {
      var scoreObj = cardToScore.left[j];

      if (cardToLeft.suit == scoreObj.suit) {
        cardToLeft.scoring = true;
        refreshMatch();
        await sleep(250);

        await adjustScore(cardToLeft.showValue, cardToScore);

        cardToLeft.scoring = false;
        refreshMatch();
      }
    }
  };

  const scoreCardRight = async (cardToScore, cardToRight) => {
    for (var j = 0; j < cardToScore.right.length; j++) {
      var scoreObj = cardToScore.right[j];

      if (cardToRight.suit == scoreObj.suit) {
        cardToRight.scoring = true;
        refreshMatch();
        await sleep(250);

        await adjustScore(cardToRight.showValue, cardToScore);

        cardToRight.scoring = false;
        refreshMatch();
      }
    }
  };

  const scoreCardMiddle = async (
    cardToScore,
    isReactivated = false,
    newCard = null
  ) => {
    var scoreInd = matchData.play.indexOf(cardToScore);

    // Check first middle for conditional
    var firstScoreObj = cardToScore.middle[0];
    if (suits.some((s) => s.name == firstScoreObj.conditional)) {
      for (var k = 0; k < currentPlay.length; k++) {
        if (
          currentPlay[k].suit == firstScoreObj.conditional &&
          currentPlay[k] != cardToScore &&
          (newCard == null || newCard == currentPlay[k])
        ) {
          for (var j = 0; j < cardToScore.middle.length; j++) {
            var scoreObj = cardToScore.middle[j];
            var usingCard = currentPlay[k];
            usingCard.scoring = true;
            refreshMatch();
            await sleep(250);
            await doEffect(scoreObj, cardToScore, newCard);

            usingCard.scoring = false;
            refreshMatch();
          }
        }
      }
    }
    if (
      firstScoreObj.conditional == "first_card" &&
      scoreInd == 0 &&
      newCard == null
    ) {
      for (var j = 0; j < cardToScore.middle.length; j++) {
        var scoreObj = cardToScore.middle[j];
        await sleep(250);
        await doEffect(scoreObj, cardToScore, newCard);
      }
    }
    if (firstScoreObj.conditional == "card_played" && newCard != null) {
      for (var j = 0; j < cardToScore.middle.length; j++) {
        var scoreObj = cardToScore.middle[j];
        await sleep(250);
        await doEffect(scoreObj, cardToScore, newCard);
      }
    }
  };

  matchData.state = "scoring";
  refreshMatch();

  var currentPlay = matchData.play;

  // Shrink all the cards in order
  for (var i = 0; i < currentPlay.length; i++) {
    var cardToShrink = currentPlay[i];
    cardToShrink.shrink = true;
    refreshMatch();
    await sleep(25);
  }

  refreshMatch();
  await sleep(100);

  var cardToScore = currentPlay[scoreInd];
  var cardToLeft =
    currentPlay[scoreInd - 1] != undefined ? currentPlay[scoreInd - 1] : null;
  var cardToRight =
    currentPlay[scoreInd + 1] != undefined ? currentPlay[scoreInd + 1] : null;

  matchData.scoreInHand += cardToScore.showValue;
  refreshMatch();

  // Check left cards
  if (cardToLeft && cardToScore.left) {
    cardToScore.scoring = true;
    await scoreCardLeft(cardToScore, cardToLeft);
  }

  // Check right cards
  if (cardToScore.right && cardToRight) {
    cardToScore.scoring = true;
    await scoreCardRight(cardToScore, cardToRight);
  }

  // Check middle
  if (cardToScore.middle) {
    cardToScore.scoring = true;
    await scoreCardMiddle(cardToScore, isReactivated);
  }

  cardToScore.scoring = false;

  // Trigger the card to the left if it has a right score obj
  if (cardToLeft && cardToLeft.right) {
    refreshMatch();
    await sleep(150);
    cardToLeft.scoring = true;
    refreshMatch();
    await scoreCardRight(cardToLeft, cardToScore);
    cardToLeft.scoring = false;
    refreshMatch();
  }

  // Trigger the card to the right if it has a left score obj
  if (cardToRight && cardToRight.left) {
    refreshMatch();
    await sleep(150);
    cardToRight.scoring = true;
    refreshMatch();
    await scoreCardLeft(cardToRight, cardToScore);
    cardToRight.scoring = false;
    refreshMatch();
  }

  // Check all the middles
  var currentPlayCopy = [...currentPlay];
  for (var i = 0; i < currentPlayCopy.length; i++) {
    var cardToCheck = currentPlayCopy[i];
    if (cardToCheck.middle && cardToCheck != cardToScore) {
      await sleep(150);
      cardToCheck.scoring = true;
      refreshMatch();
      await scoreCardMiddle(cardToCheck, isReactivated, cardToScore);
      cardToCheck.scoring = false;
      refreshMatch();
    }
    refreshMatch();
  }

  if (isReactivated) return;

  // Un shrink
  for (var i = 0; i < currentPlay.length; i++) {
    var cardToShrink = currentPlay[i];
    cardToShrink.shrink = false;
    refreshMatch();
    await sleep(50);
  }

  if (matchData.play.length >= 4) {
    matchData.playsLeft -= 1;
    await sleep(250);
    // end turn
    // Discard play cards
    matchData.state = "damaging";
    var damage = matchData.scoreInHand;
    matchData.animateScoreInHand = false;
    // Hit enemy
    if (damage >= 0) {
      for (var k = 0; k < damage; k++) {
        setTimeout(() => {
          addHitMarker(
            INNER_WIDTH / 2 + Math.random() * 100 - 50,
            INNER_HEIGHT + PLAY_OFFSET - DRAWING_SCALE * 620,
            "-1"
          );
          matchData.scoreInHand -= 1;
          matchData.scoreToBeat -= 1;
          refreshMatch();
        }, 50 * k);
      }
      await sleep(50 * (damage + 1));
    } else {
      for (var k = 0; k < damage * -1; k++) {
        setTimeout(() => {
          addHitMarker(
            INNER_WIDTH / 2 + Math.random() * 100 - 50,
            INNER_HEIGHT + PLAY_OFFSET - DRAWING_SCALE * 620,
            "+1"
          );
          matchData.scoreToBeat += 1;
          matchData.scoreInHand += 1;
          refreshMatch();
        }, 50 * k);
      }
      await sleep(50 * (damage * -1 + 1));
    }
    matchData.state = "scoring";
    refreshMatch();

    const gameOver = await checkWin();

    if (gameOver) return;

    matchData.scoreInHand = 0;
    matchData.animateScoreInHand = true;

    for (var i = 0; i < 4; i++) {
      var c = matchData.play[0];
      c.loc = "discard";
      c.showValue = c.startingValue;
      matchData.discard.push(c);
      matchData.play = matchData.play.filter((pc) => pc != c);
      refreshMatch();
      await sleep(50);
    }

    // Draw up to hand size;
    var cardsToDraw = matchData.handSize - matchData.hand.length;

    if (cardsToDraw > 0) {
      for (var i = 0; i < cardsToDraw; i++) {
        await drawCard();
      }
    }
  }

  matchData.state = "play";

  refreshMatch();
};
