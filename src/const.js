export const CARD_WIDTH = 80;
export const CARD_HEIGHT = 120;

export const CARD_WIDTH_PADDING = (CARD_WIDTH / 240) * 10;
export const CARD_HEIGHT_PADDING = (CARD_HEIGHT / 360) * 10;

export const FULL_CARD_WIDTH = CARD_WIDTH_PADDING * 2 + CARD_WIDTH;
export const FULL_CARD_HEIGHT = CARD_HEIGHT_PADDING * 2 + CARD_HEIGHT;

export const INNER_WIDTH = window.innerWidth;
export const INNER_HEIGHT = window.innerHeight;
export const HAND_WIDTH = Math.min(INNER_WIDTH, 500);

export const HAND_OFFSET = -280;
export const PLAY_OFFSET = -450;

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
    startingValue: 1,
    middle: [
      {
        effect: { conditional: "first_card", type: "add_points", value: 2 },
      },
    ],
    right: [{ suit: "water" }],
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
    right: [{ suit: "electric" }],
    left: [{ suit: "grass" }],
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
    middle: [{ suit: "grass", effect: { type: "add_points", value: 1 } }],
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
    left: [{ suit: "fire" }],
  },
  {
    name: "zap",
    suit: "electric",
    startingValue: 1,
  },
  {
    name: "skull",
    suit: "dark",
    startingValue: -1,
  },
  {
    name: "oil",
    suit: "dark",
    startingValue: -1,
    middle: [{ suit: "water", effect: { type: "add_points", value: -1 } }],
  },
];
