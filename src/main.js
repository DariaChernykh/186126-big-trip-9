import Menu from "./components/menu";
import Stats from "./components/statistics";
import {getFilters} from "./components/filters";
import {getInformation} from "./components/information";
import {getPoints} from "./components/points";
import {TripController} from "./controllers/trip-controller";

const HEADER_INFO = document.querySelector(`.trip-info`);
const HEADER_CONTROLS = document.querySelector(`.trip-controls`);
const MAIN_CONTAINER = document.querySelector(`.trip-events`);
const CONTAINER = document.querySelector(`.page-body__container`);

const renderComponentsToStart = (elem, parent) => parent.insertAdjacentHTML(`afterbegin`, elem);
export const renderComponentsToEnd = (elem, parent) => parent.insertAdjacentHTML(`beforeend`, elem);
const calcPriceTrip = (arr) => arr.reduce((acc, value) => {
  acc += value.price;
  return acc;
}, 0);

const renderContent = () => {
  const NUM_POINTS = 4;
  const points = getPoints(NUM_POINTS);
  const menu = new Menu();

  renderComponentsToStart(getInformation(points), HEADER_INFO);
  HEADER_CONTROLS.appendChild(menu.getElement());
  renderComponentsToEnd(getFilters(), HEADER_CONTROLS);
  const PRICE_CONTAINER = document.querySelector(`.trip-info__cost-value`);

  PRICE_CONTAINER.innerHTML = calcPriceTrip(points);

  const tripController = new TripController(MAIN_CONTAINER, points);
  tripController.init();

  const tripStats = new Stats();
  CONTAINER.appendChild(tripStats.getElement());
  tripStats.getElement().classList.add(`visually-hidden`);


  menu.getElement().addEventListener(`click`, (evt) => {
    if (!evt.target.classList.contains(`trip-tabs__btn`)) {
      return;
    }

    const currentTab = evt.target.parentElement.querySelector(`.trip-tabs__btn--active`);
    if (currentTab) {
      currentTab.classList.remove(`trip-tabs__btn--active`);
    }
    evt.target.classList.add(`trip-tabs__btn--active`);
    switch (evt.target.id) {
      case `table`:
        tripStats.getElement().classList.add(`visually-hidden`);
        MAIN_CONTAINER.classList.remove(`visually-hidden`);
        break;
      case `stats`:
        MAIN_CONTAINER.classList.add(`visually-hidden`);
        tripStats.getElement().classList.remove(`visually-hidden`);
        break;
    }
  });
};

renderContent();
