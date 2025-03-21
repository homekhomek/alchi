export const CARD_WIDTH = 80;
export const CARD_HEIGHT = 120;

export const DRAWING_SCALE = CARD_HEIGHT / 360;
export const CARD_WIDTH_PADDING = DRAWING_SCALE * 10;
export const CARD_HEIGHT_PADDING = DRAWING_SCALE * 10;

export const FULL_CARD_WIDTH = CARD_WIDTH_PADDING * 2 + CARD_WIDTH;
export const FULL_CARD_HEIGHT = CARD_HEIGHT_PADDING * 2 + CARD_HEIGHT;

export const INNER_WIDTH = window.innerWidth;
export const INNER_HEIGHT = window.innerHeight;
export const HAND_WIDTH = Math.min(INNER_WIDTH, 500);

export const HAND_OFFSET = -240;
export const PLAY_OFFSET = -390;

export const SHOP_OFFSET = -240;
export const SHOP_DECK_OFFSET = -540;

export const BOUNCE_TRANSITION = "all .25s cubic-bezier(.47,1.64,.41,.8)";

export var suits = [
  {
    name: "grass",
    primaryColor: "#94bf30",
  },
  {
    name: "fire",
    primaryColor: "#ff7070",
  },
  {
    name: "water",
    primaryColor: "#49c2f2",
  },
  {
    name: "electric",
    primaryColor: "#fad937",
  },
  {
    name: "dark",
    primaryColor: "#807980",
  },
];

export var cards = [
  {
    name: "seed",
    suit: "grass",
    startingValue: 1,
    middle: [
      {
        conditional: "first_card",
        type: "add_points",
        value: 1,
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
    middle: [{ conditional: "grass", type: "add_points", value: 1 }],
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
    middle: [{ conditional: "water", type: "add_points", value: -1 }],
  },
];
