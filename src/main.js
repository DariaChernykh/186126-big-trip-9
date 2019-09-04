import {getMenu} from "./components/menu";
import {getFilters} from "./components/filters";
import {getInformation} from "./components/information";
import {getPoints} from "./components/points";
import {TripController} from "./controllers/trip-controller";

const HEADER_INFO = document.querySelector(`.trip-info`);
const HEADER_CONTROLS = document.querySelector(`.trip-controls`);
const MAIN_CONTAINER = document.querySelector(`.trip-events`);

const renderComponentsToStart = (elem, parent) => parent.insertAdjacentHTML(`afterbegin`, elem);
export const renderComponentsToEnd = (elem, parent) => parent.insertAdjacentHTML(`beforeend`, elem);
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
  const PRICE_CONTAINER = document.querySelector(`.trip-info__cost-value`);
  PRICE_CONTAINER.innerHTML = calcPriceTrip(points);

  const tripController = new TripController(MAIN_CONTAINER, points);
  tripController.init();
};

renderContent();
