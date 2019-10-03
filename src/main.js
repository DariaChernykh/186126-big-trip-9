import Menu from "./components/menu";
import Stats from "./components/statistics";
import Filters from "./components/filters";
import TripController from "./controllers/trip-controller";
import API from './api';
import NoPoint from "./components/no-points";
import Store from "./store";
import Provider from "./provider";

const HEADER_CONTROLS = document.querySelector(`.trip-controls`);
const MAIN_CONTAINER = document.querySelector(`.trip-events`);
const CONTAINER = document.querySelector(`.page-body__container-content`);
const addPointBtn = document.querySelector(`.trip-main__event-add-btn`);

const AUTHORIZATION = `Basic kTy9gIdsz2317rD12`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;
const OFFLINE_TITLE = ` [OFFLINE]`;
const STORE_KEY = `store-key-big-trip-v.1`;
const noPoint = new NoPoint();

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const store = new Store(STORE_KEY, localStorage);
const provider = new Provider(api, store);

window.addEventListener(`offline`, () => {
  document.title = `${document.title}${OFFLINE_TITLE}`;
});

window.addEventListener(`online`, () => {
  document.title = document.title.split(OFFLINE_TITLE)[0];
  provider.syncPoints();
});

const arrTripEvents = [];
const arrPlaces = [];
const arrOffers = [];

MAIN_CONTAINER.appendChild(noPoint.render());
addPointBtn.disabled = true;

provider.getDestinations()
  .then((places) => {
    arrPlaces.push(...places);
    return provider.getPoints();
  })
  .then((events) => {
    arrTripEvents.push(...events);
    return provider.getOffers();
  })
  .then((offers) => {
    arrOffers.push(...offers);
    const menu = new Menu();
    const filters = new Filters();

    MAIN_CONTAINER.removeChild(noPoint._element);
    addPointBtn.disabled = false;
    HEADER_CONTROLS.appendChild(menu.getElement());
    HEADER_CONTROLS.appendChild(filters.getElement());

    const tripStats = new Stats();
    CONTAINER.appendChild(tripStats.getElement());
    tripStats.getElement().classList.add(`visually-hidden`);

    const tripController = new TripController(MAIN_CONTAINER, arrTripEvents, arrPlaces, arrOffers, provider);
    tripController.init();

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
  })
  .catch((err) => {
    throw err;
  });
