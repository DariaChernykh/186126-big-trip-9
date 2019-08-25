import {getData} from "../data";
const compareNumbers = (a, b) => a.dueDate - b.dueDate;

export const getPoints = (num) => {
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(getData());
  }
  return arr.sort(compareNumbers);
};
