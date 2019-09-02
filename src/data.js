import {getTime} from "./utils";

const MS_IN_WEEK = 7 * 24 * 60 * 60 * 1000;
export const getRandomInt = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min;


const TYPES = {
  'transfer': [`bus`, `drive`, `flight`, `ship`, `taxi`, `train`, `transport`],
  'activity': [`restaurant`, `sightseeing`, `check-in`]
};

const getType = (types) => {
  let keys = Object.keys(types);
  let key = keys[getRandomInt(0, keys.length - 1)];
  let name = types[key][getRandomInt(0, types[key].length - 1)];

  return {
    key,
    name
  };
};

const OPTIONS = {
  'luggage': {
    name: `Add luggage`,
    value: 10
  },
  'comfort': {
    name: `Switch to comfort class`,
    value: 150
  },
  'meal': {
    name: `Add meal`,
    value: 2
  },
  'seats': {
    name: `Choose seats`,
    value: 9
  },
  'car': {
    name: `Rent a car`,
    value: 200
  },
  'breakfast': {
    name: `Add breakfast`,
    value: 50
  },
  'lunch': {
    name: `Lunch in city`,
    value: 30
  },
  'tickets': {
    name: `Book tickets`,
    value: 40
  },
  'train': {
    name: `Travel by train`,
    value: 40
  },
};

const CITIES = [`Amsterdam`, `Geneva`, `Chamonix`, `London`, `Berlin`, `Vienna`, `Paris`, `Manchester`];
const string = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;
const DESCRIPTIONS = string.split(`. `);
const num = 3;
const getDescription = (arr) => {
  return `${arr.slice().sort(() => 0.5 - Math.random()).slice(0, Math.ceil(Math.random() * num)).join(`. `)}.`;
};

const getRandomOptions = (obj) => {
  const arr = Object.entries(obj);
  return arr.slice().sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * arr.length));
};

const getPrice = (arr) => {
  if (arr.length) {
    return arr.reduce((acc, val) => {
      if (val[1].value) {
        acc += val[1].value;
      }
      return acc;
    }, 0);
  }
  return 0;
};

const getPhotos = (number) => {
  const photos = [];
  for (let i = 0; i < number; i++) {
    photos.push(`http://picsum.photos/300/150?r=${Math.random()}`);
  }
  return photos;
};

export const getData = () => {
  const options = getRandomOptions(OPTIONS);
  const dueDate = new Date(getRandomInt(Date.now() - MS_IN_WEEK, Date.now() + MS_IN_WEEK));
  return {
    activity: TYPES.activity,
    transfer: TYPES.transfer,
    type: getType(TYPES),
    cities: CITIES,
    city: CITIES[getRandomInt(0, CITIES.length - 1)],
    photos: getPhotos,
    description: getDescription(DESCRIPTIONS),
    options,
    price: getPrice(options),
    dueDate,
    testDate: getTime(dueDate),
  };
};
