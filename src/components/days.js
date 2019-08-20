import {getDay} from "./day";
export const getDays = (num, day) => {
  let days = [];
  for (let i = 1; i <= num; i++) {
    days.push(getDay(i, day));
  }
  return days.join(``);
};
