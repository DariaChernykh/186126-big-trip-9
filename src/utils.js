import {getRandomInt} from "./data";
const MS_IN_HALF_DAY = 12 * 60 * 60 * 1000;

export const getTime = (data) => {
  const endDate = new Date(getRandomInt(data.getTime(), data.getTime() + MS_IN_HALF_DAY));
  const timeStart = `${data.getHours()}:${data.getMinutes()}`;
  const timeEnd = `${endDate.getHours()}:${endDate.getMinutes()}`;
  return {
    duration: endDate - data,
    durationHours: Math.abs(endDate.getHours() - data.getHours()),
    durationMinutes: Math.abs(endDate.getMinutes() - data.getMinutes()),
    timeStart,
    timeEnd,
    startDatetime: `${data.getFullYear()}-${data.getMonth()}-${data.getDate()}T${timeStart}`,
    endDatetime: `${data.getFullYear()}-${data.getMonth()}-${data.getDate()}T${timeEnd}`,
  };
};

export const getDate = (date) => {
  return {
    'start': `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
    'end': `${date.getDate() + getRandomInt(0, 2)}/${date.getMonth()}/${date.getFullYear()}`,
  };
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};
