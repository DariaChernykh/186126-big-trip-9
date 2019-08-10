import {getMenu} from "./components/menu";
import {getFilters} from "./components/filters";
import {getTripSort} from "./components/trip-sort";
import {getDay} from "./components/day";
import {getCard} from "./components/card";
import {getCardEdit} from "./components/card-edit";
import {getInformation} from "./components/information";
import {createContainer} from "./components/container";

const HEADER_INFO = document.querySelector(`.trip-info`);
const HEADER_CONTROLS = document.querySelector(`.trip-controls`);
const MAIN_CONTAINER = document.querySelector(`.trip-events`);

const renderComponentsToStart = (elem, parent) => parent.insertAdjacentHTML(`afterbegin`, elem);
const renderComponentsToEnd = (elem, parent) => parent.insertAdjacentHTML(`beforeend`, elem);

const renderContent = () => {
  renderComponentsToStart(getInformation(), HEADER_INFO);
  renderComponentsToEnd(getMenu(), HEADER_CONTROLS);
  renderComponentsToEnd(getFilters(), HEADER_CONTROLS);
  renderComponentsToEnd(getTripSort(), MAIN_CONTAINER);
  renderComponentsToEnd(createContainer(), MAIN_CONTAINER);

  const DAYS_LIST = document.querySelector(`.trip-days`);
  renderComponentsToEnd(getDay(), DAYS_LIST);

  const EVENTS_LIST = document.querySelector(`.trip-events__list`);
  renderComponentsToEnd(getCardEdit(), EVENTS_LIST);

  const NUM_CARDS = 3;
  for (let i = 0; i < NUM_CARDS; i++) {
    renderComponentsToEnd(getCard(), EVENTS_LIST);
  }
};

renderContent();
