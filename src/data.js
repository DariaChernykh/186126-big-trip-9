const MS_IN_WEEK = 7 * 24 * 60 * 60 * 1000;
export const getRandomInt = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min;

const ICONS = [
  `bus`, `check-in`, `drive`, `flight`, `restaurant`, `ship`, `sightseeing`,
  `taxi`, `train`, `transport`, `trip`
];
const OPTIONS = [
  [`Add luggage`, 10],
  [`Switch to comfort class`, 150],
  [`Add meal`, 2],
  [`Choose seats`, 9],
  [`Rent a car`, 200],
  [`Add breakfast`, 50],
  [`Book tickets`, 40],
];
const string = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;
const DESCRIPTIONS = string.split(`. `);
const num = 3;
const getDescription = (arr) => {
  return `${arr.slice().sort(() => 0.5 - Math.random()).slice(0, Math.ceil(Math.random() * num)).join(`. `)}.`;
};
const getOptions = (arr) => {
  return arr.slice().sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * arr.length));
};

const getPrice = (arr) => {
  if (arr.length) {
    return arr.reduce((acc, val) => {
      if (val[1]) {
        acc += val[1];
      }
      return acc;
    }, 0);
  } return 0;
};

export const getData = () => {
  const options = getOptions(OPTIONS);
  return {
    icon: ICONS[getRandomInt(0, ICONS.length - 1)],
    photo: `http://picsum.photos/300/150?r=${Math.random()}`,
    description: getDescription(DESCRIPTIONS),
    options,
    price: getPrice(options),
    dueDate: new Date(getRandomInt(Date.now() - MS_IN_WEEK, Date.now() + MS_IN_WEEK)),
  };
};
