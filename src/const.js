export const CARD_WIDTH = 80;
export const CARD_HEIGHT = 120;

export var suits = [
  {
    name: "grass",
  },
  {
    name: "fire",
  },
  {
    name: "water",
  },
  {
    name: "electric",
  },
  {
    name: "dark",
  },
];

export var cards = [
  {
    name: "seed",
    suit: "grass",
    startingValue: 2,
    left: [{ suit: "electric", value: -1 }],
  },
  {
    name: "leaf",
    suit: "grass",
    startingValue: 1,
  },
  {
    name: "firefly",
    suit: "fire",
    startingValue: 1,
    right: [{ suit: "electric", value: 1 }],
  },
  {
    name: "ember",
    suit: "fire",
    startingValue: 1,
  },
  {
    name: "watercan",
    suit: "water",
    startingValue: 1,
    middle: [{ suit: "grass", value: 1 }],
  },
  {
    name: "drop",
    suit: "water",
    startingValue: 1,
  },
  {
    name: "lantern",
    suit: "electric",
    startingValue: 1,
    left: [{ suit: "fire", value: 1 }],
  },
  {
    name: "zap",
    suit: "electric",
    startingValue: 1,
  },
  {
    name: "skull",
    suit: "dark",
    startingValue: -2,
  },
  {
    name: "oil",
    suit: "dark",
    startingValue: -1,
    middle: [{ suit: "water", value: -1 }],
  },
];
