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

export const DECK_VIEW_SPACING = 5;
export const DECK_VIEW_SIDE_SPACING = 50;

export const MAP_VIEW_BOTTOM_OFFSET = 100;
export const MAP_VIEW_DOT_SPACING = DRAWING_SCALE * 360;
export const MAP_VIEW_DOT_BOTTOM_PADDING = DRAWING_SCALE * 220;

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

export const shopOdds = [
  {
    common: 80,
    uncommon: 20,
    rare: 0,
    legendary: 0,
  },
  {
    common: 70,
    uncommon: 25,
    rare: 5,
    legendary: 0,
  },
  {
    common: 50,
    uncommon: 35,
    rare: 14,
    legendary: 1,
  },
  {
    common: 25,
    uncommon: 40,
    rare: 32,
    legendary: 3,
  },
];

export const areaTypes = [
  {
    name: "pickcard",
    probability: 5,
  },
  { name: "removecard", probability: 3 },
  { name: "dupecard", probability: 1 },
  { name: "shopupgrade", probability: 3 },
];

export const areas = [
  {
    type: "pickcard",
    name: "shopkeep",
    probability: 5,
    desc: "[card_plus] 1 of 3 cards",
    zones: [0, 1, 2],
  },
  {
    type: "pickcard",
    name: "marketer",
    probability: 5,
    desc: "[card_plus] 1 of 4 cards",
    zones: [1, 2],
  },
  {
    type: "removecard",
    name: "venus",
    probability: 5,
    desc: "[card_minus] from deck",
    zones: [0, 1, 2],
  },
  {
    type: "dupecard",
    name: "dwarf",
    probability: 5,
    desc: "duplicate a card",
    zones: [0, 1, 2],
  },
  {
    type: "shopupgrade",
    name: "spidermarket",
    probability: 5,
    desc: "upgrade shop",
    zones: [0, 1, 2],
  },
];

export const enemies = [
  // Area 1
  {
    name: "gnome",
    abilityDesc: "",
    health: 35,
    location: 1,
  },
  {
    name: "rat_bishop",
    abilityDesc: "+3 [heart] per turn",
    health: 35,
    location: 0,
  },
  {
    name: "seahorse",
    abilityDesc: "",
    health: 35,
    location: 2,
  },
  // Guardians
  {
    name: "grass_guardian",
    abilityDesc: "",
    health: 35,
    location: 3,
    boss: true,
  },
  {
    name: "water_guardian",
    abilityDesc: "",
    health: 35,
    location: 3,
    boss: true,
  },
  {
    name: "fire_guardian",
    abilityDesc: "",
    health: 35,
    location: 3,
    boss: true,
  },
  {
    name: "electric_guardian",
    abilityDesc: "",
    health: 35,
    location: 3,
    boss: true,
  },
];
