import type { Item } from "../../src/lib/types";
import news from "./news";
import newsLatest from "./news-latest";
import places from "./places";
import placesMap from "./places-map";
import characters from "./characters";
import weapons from "./weapons";
import vehicles from "./vehicles";
import secrets from "./secrets";
import money from "./money";
import { glitches, strange, tips } from "./misc";
import controllerTips from "./tips";
import funny from "./funny";
import choices from "./choices";

export const SEED_ITEMS: Item[] = [
  ...news,
  ...newsLatest,
  ...places,
  ...placesMap,
  ...characters,
  ...weapons,
  ...vehicles,
  ...secrets,
  ...money,
  ...glitches,
  ...strange,
  ...tips,
  ...controllerTips,
  ...funny,
  ...choices,
];
