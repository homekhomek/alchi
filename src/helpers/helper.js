import { cards } from "../const";

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

export const dist = (x1, y1, x2, y2) =>
  Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

export const bakeCardNameList = (cardNames) => {
  return cardNames.map((cName) => {
    return JSON.parse(JSON.stringify(cards.find((c) => c.name == cName)));
  });
};

export const generateMap = () => {
  var map = [];
  for (var i = 0; i < 12; i++) {
    // Push enemy
    map.push({
      type: "match",
      enemy: "rat_bishop",
      index: i * 3,
    });

    // Push pick card
    map.push({
      type: "pickcard",
      index: i * 3 + 1,
    });

    // Push choice
    map.push({
      choice1: "pickcard",
      choice2: "removecard",
      index: i * 3 + 2,
    });
  }

  return map;
};
