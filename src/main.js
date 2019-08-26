import {getMenu} from "./components/menu";
import {getFilters} from "./components/filters";
import {getTripSort} from "./components/trip-sort";
import {getDays} from "./components/days";
import {getCardEdit} from "./components/card-edit";
import {getInformation} from "./components/information";
import {createContainer} from "./components/container";
import {getTime} from "./utiles";
import {getCards} from "./components/cards";
import {getPoints} from "./components/points";

const HEADER_INFO = document.querySelector(`.trip-info`);
const HEADER_CONTROLS = document.querySelector(`.trip-controls`);
const MAIN_CONTAINER = document.querySelector(`.trip-events`);

const renderComponentsToStart = (elem, parent) => parent.insertAdjacentHTML(`afterbegin`, elem);
const renderComponentsToEnd = (elem, parent) => parent.insertAdjacentHTML(`beforeend`, elem);
const calcPriceTrip = (arr) => arr.reduce((acc, value) => {
  acc += value.price;
  return acc;
}, 0);

const renderContent = () => {
  const NUM_POINTS = 4;
  const points = getPoints(NUM_POINTS);

  renderComponentsToStart(getInformation(points), HEADER_INFO);
  renderComponentsToEnd(getMenu(), HEADER_CONTROLS);
  renderComponentsToEnd(getFilters(), HEADER_CONTROLS);
  renderComponentsToEnd(getTripSort(), MAIN_CONTAINER);
  renderComponentsToEnd(createContainer(), MAIN_CONTAINER);

  const DAYS_LIST = document.querySelector(`.trip-days`);
  const PRICE_CONTAINER = document.querySelector(`.trip-info__cost-value`);
  PRICE_CONTAINER.innerHTML = calcPriceTrip(points);
  const NUM_DAYS = 1;

  renderComponentsToEnd(getDays(NUM_DAYS, points[0].dueDate), DAYS_LIST);
  const EVENTS_LIST = document.querySelector(`.trip-events__list`);

  const CARDS_ARRAY = getCards(points.slice(1, points.length));
  renderComponentsToEnd(getCardEdit(points[0], getTime(points[0])), EVENTS_LIST);
  renderComponentsToEnd(CARDS_ARRAY, EVENTS_LIST);
};

renderContent();
