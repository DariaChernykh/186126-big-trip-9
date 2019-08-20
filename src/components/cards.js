import {getData} from "../data";
import {getTime} from "../time";
import {getCard} from "./card";

export const getCards = (data, date, num) => {
  const cards = [];
  for (let i = 0; i < num; i++) {
    const cardInfo = getData();
    cards.push(getCard(cardInfo, getTime(cardInfo)));
  }
  return cards.join(``);
};
