import {getData} from "../data";
const compareDates = (a, b) => a.dateFrom - b.dateFrom;

export const getPoints = (num) => {
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(getData());
  }
  return arr.sort(compareDates);
};
