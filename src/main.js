import {getMenu} from "./components/menu";
import {getFilters} from "./components/filters";
import {getTripSort} from "./components/trip-sort";
import {getDays} from "./components/days";
import {getCardEdit} from "./components/card-edit";
import {getInformation} from "./components/information";
import {createContainer} from "./components/container";
import {getData} from "./data";
import {getTime} from "./time";
import {getCards} from "./components/cards";

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
  const NUM_DAYS = 3;
  const NUM_CARDS = 3;
  const cardInfo = getData();

  renderComponentsToEnd(getDays(NUM_DAYS, cardInfo.dueDate), DAYS_LIST);
  const EVENTS_LIST = document.querySelector(`.trip-events__list`);

  const CARDS_ARRAY = getCards(cardInfo, getTime(cardInfo), NUM_CARDS);
  renderComponentsToEnd(getCardEdit(cardInfo, getTime(cardInfo)), EVENTS_LIST);
  renderComponentsToEnd(CARDS_ARRAY, EVENTS_LIST);
};

renderContent();
