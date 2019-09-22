import Menu from "./components/menu";
import Stats from "./components/statistics";
import Filters from "./components/filters";
import {TripController} from "./controllers/trip-controller";
import API from './api';

const HEADER_CONTROLS = document.querySelector(`.trip-controls`);
const MAIN_CONTAINER = document.querySelector(`.trip-events`);
const CONTAINER = document.querySelector(`.page-body__container-content`);

const AUTHORIZATION = `Basic kTy9gIdsz2317rD`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

api.getDestinations()
  .then((arrPlaces) => {
    api.getPoints()
      .then((arrTripEvents) => {
        api.getOffers()
          .then((arrOffers) => {
            const menu = new Menu();
            const filters = new Filters();

            HEADER_CONTROLS.appendChild(menu.getElement());
            HEADER_CONTROLS.appendChild(filters.getElement());

            const tripStats = new Stats();
            CONTAINER.appendChild(tripStats.getElement());
            tripStats.getElement().classList.add(`visually-hidden`);
            const tripController = new TripController(MAIN_CONTAINER, arrTripEvents, arrPlaces, arrOffers, api);
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
      });
  }).catch((err) => console.error(`!!!! ` + err));
