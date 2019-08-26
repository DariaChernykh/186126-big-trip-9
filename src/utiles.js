import {getRandomInt} from "./data";
const getDuration = () => {
  return {
    hours: getRandomInt(0, 3),
    minutes: getRandomInt(0, 59)
  };
};

const generateEndTime = (hours, min, duration) => {
  let endMinutes = min + duration.minutes;
  let endHours = hours + duration.hours;
  if (endMinutes > 59) {
    endHours++;
    endMinutes -= 60;
  }
  return `${endHours}:${endMinutes}`;
};

export const getTime = (data) => {
  const duration = getDuration();
  const hours = data.dueDate.getHours();
  const minutes = data.dueDate.getMinutes();
  return {
    timeStart: `${hours}:${minutes}`,
    timeEnd: `${generateEndTime(hours, minutes, duration)}`,
    duration: `${duration.hours ? `${duration.hours}H` : ``} ${duration.minutes ? `${duration.minutes}M` : ``}`.trim(),
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
