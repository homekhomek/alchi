import { areas, areaTypes, cards, enemies } from "../const";

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

export const pickFromArrayWithProbabilites = (ary) => {
  var tot = ary.reduce((prev, c) => prev + c.probability, 0);
  var pick = Math.floor(Math.random() * tot);

  return ary.find((o) => {
    if (pick < o.probability) return true;
    pick -= o.probability;
  });
};

export const generateMap = () => {
  var map = [];
  var mIndex = 1;

  map.push({
    type: "start",
    symbol: "start",
    index: 0,
    zone: 0,
  });

  var zone = 0;

  for (var i = 0; i < 12; i++) {
    if (i > 3) zone = 1;
    if (i > 7) zone = 2;

    var enemyList = enemies.filter((e) => e.location == i);
    // Push enemy
    map.push({
      type: "match",
      symbol: i % 4 == 3 ? "boss_skull" : "skull",
      enemy: enemyList[Math.floor(Math.random() * enemyList.length)],
      index: mIndex,
      zone: zone,
    });
    mIndex += 1;

    if (i < 11) {
      for (var j = 0; j < 2 + Math.floor(Math.random() * 2); j++) {
        if (j > 0) {
          var possCategories = [];
          areas.forEach((a) => {
            if (
              !possCategories.includes(a.type) &&
              a.zones.includes(Math.floor((i + 1) / 4))
            )
              possCategories.push(a.type);
          });

          possCategories = possCategories.map((c) =>
            areaTypes.find((a) => a.name == c)
          );

          var pickedCat1 = pickFromArrayWithProbabilites(possCategories);
          possCategories = possCategories.filter((o) => o != pickedCat1);
          var pickedCat2 = pickFromArrayWithProbabilites(possCategories);

          var areasFromPickedCat1 = areas.filter(
            (a) =>
              a.type == pickedCat1.name &&
              a.zones.includes(Math.floor((i + 1) / 4))
          );

          var area1 = pickFromArrayWithProbabilites(areasFromPickedCat1);

          var areasFromPickedCat2 = areas.filter(
            (a) =>
              a.type == pickedCat2.name &&
              a.zones.includes(Math.floor((i + 1) / 4))
          );
          var area2 = pickFromArrayWithProbabilites(areasFromPickedCat2);

          map.push({
            type: "choice",
            symbol: "choice",
            choice1: area1,
            choice2: area2,
            index: mIndex,
            zone: zone,
          });

          // choices
        } else {
          var pickCardList = areas.filter(
            (a) =>
              a.type == "pickcard" && a.zones.includes(Math.floor((i + 1) / 4))
          );

          var pcObj =
            pickCardList[Math.floor(pickCardList.length * Math.random())];

          map.push({
            type: pcObj.type,
            symbol: "pickcard",
            index: mIndex,
            zone: zone,
          });
          mIndex += 1;
        }
      }
    }
  }

  map.push({
    type: "end",
    symbol: "end",
    index: mIndex,
    zone: 2,
  });

  return map;
};
