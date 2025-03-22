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
