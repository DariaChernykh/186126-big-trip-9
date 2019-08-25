import {getTime} from "../utiles";
import {getCard} from "./card";

export const getCards = (data) => data.reduce((acc, value) => {
  acc += getCard(value, getTime(value));
  return acc;
}, ``);
