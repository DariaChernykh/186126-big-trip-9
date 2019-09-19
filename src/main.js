import Menu from "./components/menu";
import Stats from "./components/statistics";
import Filters from "./components/filters";
import {getInformation} from "./components/information";
import {getPoints} from "./components/points";
import {TripController} from "./controllers/trip-controller";
import API from './api';

const HEADER_INFO = document.querySelector(`.trip-info`);
const HEADER_CONTROLS = document.querySelector(`.trip-controls`);
const MAIN_CONTAINER = document.querySelector(`.trip-events`);
const CONTAINER = document.querySelector(`.page-body__container-content`);
const renderComponentsToStart = (elem, parent) => parent.insertAdjacentHTML(`afterbegin`, elem);
const calcPriceTrip = (arr) => arr.reduce((acc, value) => {
  acc += value._price;
  return acc;
}, 0);

const AUTHORIZATION = `Basic kTy9gIdsz2317rD`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip/`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
api.getDestinations()
  .then((arrPlaces) => arrPlaces)
  .then((arrPlaces) => {
    api.getPoints()
      .then((arrTripEvents) => {
        const menu = new Menu();
        const filters = new Filters();

        renderComponentsToStart(getInformation(arrTripEvents), HEADER_INFO);
        HEADER_CONTROLS.appendChild(menu.getElement());
        HEADER_CONTROLS.appendChild(filters.getElement());
        const PRICE_CONTAINER = document.querySelector(`.trip-info__cost-value`);

        PRICE_CONTAINER.innerHTML = calcPriceTrip(arrTripEvents);

        const tripStats = new Stats();
        CONTAINER.appendChild(tripStats.getElement());
        tripStats.getElement().classList.add(`visually-hidden`);

        const tripController = new TripController(MAIN_CONTAINER, arrTripEvents);
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

      });
  }).catch((err) => console.error(`!!!! ` + err));

// const renderContent = () => {
//   const NUM_POINTS = 5;
//   const points = getPoints(NUM_POINTS);
  // const menu = new Menu();
  // const filters = new Filters();
  //
  // renderComponentsToStart(getInformation(points), HEADER_INFO);
  // HEADER_CONTROLS.appendChild(menu.getElement());
  // HEADER_CONTROLS.appendChild(filters.getElement());
  // const PRICE_CONTAINER = document.querySelector(`.trip-info__cost-value`);
  //
  // PRICE_CONTAINER.innerHTML = calcPriceTrip(points);
  //
  // const tripStats = new Stats();
  // CONTAINER.appendChild(tripStats.getElement());
  // tripStats.getElement().classList.add(`visually-hidden`);
  //
  // const tripController = new TripController(MAIN_CONTAINER, points);
  // tripController.init();
  //
  // menu.getElement().addEventListener(`click`, (evt) => {
  //   if (!evt.target.classList.contains(`trip-tabs__btn`)) {
  //     return;
  //   }
  //
  //   const currentTab = evt.target.parentElement.querySelector(`.trip-tabs__btn--active`);
  //   if (currentTab) {
  //     currentTab.classList.remove(`trip-tabs__btn--active`);
  //   }
  //   evt.target.classList.add(`trip-tabs__btn--active`);
  //   switch (evt.target.id) {
  //     case `table`:
  //       tripStats.getElement().classList.add(`visually-hidden`);
  //       MAIN_CONTAINER.classList.remove(`visually-hidden`);
  //       break;
  //     case `stats`:
  //       MAIN_CONTAINER.classList.add(`visually-hidden`);
  //       tripStats.getElement().classList.remove(`visually-hidden`);
  //       break;
  //   }
  // });
// };
//
// renderContent();
