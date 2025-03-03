export const CARD_WIDTH = 80;
export const CARD_HEIGHT = 120;

export const CARD_WIDTH_PADDING = (CARD_WIDTH / 240) * 10;
export const CARD_HEIGHT_PADDING = (CARD_HEIGHT / 360) * 10;

export const FULL_CARD_WIDTH = CARD_WIDTH_PADDING * 2 + CARD_WIDTH;
export const FULL_CARD_HEIGHT = CARD_HEIGHT_PADDING * 2 + CARD_HEIGHT;

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
    startingValue: -30,
    left: [{ suit: "water", value: -1 }],
    right: [{ suit: "water", value: -1 }],
  },
  {
    name: "firefly",
    suit: "fire",
    startingValue: 40,
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
    startingValue: -20,
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
    startingValue: -29,
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
    startingValue: -20,
    middle: [{ name: "pair", value: 1 }],
  },
  {
    name: "oil",
    suit: "dark",
    startingValue: -1,
    middle: [{ suit: "water", value: -1 }],
  },
];
