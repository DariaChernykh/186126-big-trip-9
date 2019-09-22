import Sort from "../components/trip-sort";
import DaysContainer from "../components/container";
import Day from "../components/day";
import PointController from "./point-controller";
import NewPoint from "../components/new-point";
import Stats from "../components/statistics";
import moment from "moment";
import ModelPoint from "../model-task";
import Information from "../components/information";

const HEADER_INFO = document.querySelector(`.trip-info`);
const PRICE_CONTAINER = document.querySelector(`.trip-info__cost-value`);
const calcPriceTrip = (arr) => arr.reduce((acc, value) => {
  acc += value.price;
  return acc;
}, 0);

export class TripController {
  constructor(board, points, places, offers, api) {
    this._board = board;
    this._points = points;
    this._sort = new Sort();
    this._tripStats = new Stats();
    this._daysContainer = new DaysContainer();
    this._information = new Information(this._points);
    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._addPointBtn = document.querySelector(`.trip-main__event-add-btn`);
    this._filters = document.querySelector(`.trip-filters`);

    this._places = places;
    this._offers = offers;
    this._api = api;
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onDataChange(newData, oldData) {
    this._daysContainer.getElement().innerHTML = ``;

    if (newData === null) {
      this._api.deletePoint({id: oldData.id})
        .then(() => {
          this._points.splice(this._points.findIndex((it) => it === oldData), 1);
          this._reRender(this._points);
        })
        .catch((err) => {
          console.error(`fetch error: ${err}`);
        });

    } else if (oldData === null) {
      this._api.createPoint({point: newData.toRAW()})
        .then(() => {
          this._points.push(newData);
          this._reRender(this._points);
        })
        .catch((err) => {
          console.error(`fetch error: ${err}`);
        });

    } else {
      this._api.updatePoint({id: newData.id, data: newData.toRAW()})
        .then(() => {
          this._points[this._points.findIndex((it) => it === oldData)] = newData;
          this._reRender(this._points);
        })
        .catch((err) => {
          console.error(`fetch error: ${err}`);
        });
    }
    this._tripStats.updateData(this._points);
  }

  _reRender(points) {
    this._getDaysForPoints(points);
    this._tripStats.updateData(points);
    PRICE_CONTAINER.innerHTML = calcPriceTrip(this._points);

    const prevElement = this._information._element;
    this._information._element = null;
    this._information = new Information(points);
    this._information._element = this._information.getElement();
    HEADER_INFO.replaceChild(this._information._element, prevElement);
    prevElement.remove();
  }

  _getDaysForPoints(arr) {
    const listUniqDays = [];
    arr.forEach((value) => {
      if (listUniqDays.findIndex((elem) => new Date(elem).getDate() === new Date(value.dateFrom).getDate()) === -1) {
        listUniqDays.push(value.dateFrom);
      }
    });

    listUniqDays.sort((a, b) => new Date(a).getTime() - new Date(b).getTime()).forEach((val, index) => {
      let day = new Day(index + 1, val);
      this._daysContainer.getElement().appendChild(day.getElement());
    });

    arr.forEach((point) => {
      const dayOfPoint = new Date(point.dateFrom).getDate();
      const test = listUniqDays.findIndex((elem) => new Date(elem).getDate() === dayOfPoint);
      const dayForPoint = this._daysContainer.getElement().querySelectorAll(`.trip-events__list`)[test];

      this._renderPoint(point, dayForPoint);
    });
  }

  init() {
    HEADER_INFO.prepend(this._information.getElement());
    PRICE_CONTAINER.innerHTML = calcPriceTrip(this._points);
    this._board.appendChild(this._sort.getElement());
    this._board.appendChild(this._daysContainer.getElement());
    this._getDaysForPoints(this._points);
    this._tripStats.generateCharts(this._points);

    this._sort.getElement()
      .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));

    this._filters
      .addEventListener(`click`, (evt) => this._onFilterClick(evt));

    this._addPointBtn.addEventListener(`click`, () => {
      const newPoint = new NewPoint(this._board, this._places, this._offers);
      this._sort.getElement().after(newPoint.getElement());
      newPoint.bind();

      newPoint.onSubmit(() => {
        const formData = new FormData(newPoint.getElement());
        const dateFrom = moment(formData.get(`event-start-time`));
        const dateTo = moment(formData.get(`event-end-time`));
        const entry = {
          id: this._points.length,
          price: parseInt(formData.get(`event-price`) ? formData.get(`event-price`) : 0, 10),
          type: newPoint._type,
          isFavorite: !!formData.get(`event-favorite`),
          dateFrom: dateFrom.format(),
          dateTo: dateTo.format(),
          duration: dateTo.millisecond() - dateFrom.millisecond(),
          options: newPoint._avalibleOffers.offers,
          destination: {
            name: formData.get(`event-destination`),
            pictures: newPoint._destination.pictures,
            description: newPoint._destination.description
          },
        };
        this._onDataChange(new ModelPoint(ModelPoint.toRAW(entry)), null);
        newPoint.unrender();
      });

      newPoint.onEscape(() => {
        newPoint.unrender();
      });
    });
  }

  _renderPoint(point, parent) {
    return new PointController(parent, point, this._offers, this._places, this._api, this._onDataChange, this._onChangeView);
  }

  _createOneDay() {
    let day = new Day(0, 0);
    this._daysContainer.getElement().appendChild(day.getElement());
    return this._daysContainer.getElement().querySelector(`.trip-events__list`);
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();
    if (!evt.target.classList.contains(`trip-sort__btn`)) {
      return;
    }
    evt.target.parentElement.parentElement.querySelectorAll(`input`).forEach(input => input.checked = false);
    evt.target.parentElement.querySelector(`input`).checked = true;
    this._daysContainer.getElement().innerHTML = ``;
    switch (evt.target.control.value) {
      case `sort-time`:
        const sortedByTime = this._points.slice().sort((a, b) => b.duration - a.duration);
        sortedByTime.forEach((point) => this._renderPoint(point, this._createOneDay()));
        break;
      case `sort-price`:
        const sortedByPrice = this._points.slice().sort((a, b) => b.price - a.price);
        sortedByPrice.forEach((point) => this._renderPoint(point, this._createOneDay()));
        break;
      default:
        this._getDaysForPoints(this._points);
        break;
    }
  }

  _onFilterClick(evt) {
    if (!evt.target.classList.contains(`trip-filters__filter-label`)) {
      return;
    }
    this._daysContainer.getElement().innerHTML = ``;
    evt.target.parentElement.parentElement.querySelectorAll(`.trip-filters__filter-input`).forEach(input => input.checked = false);

    const input = evt.target.parentElement.querySelector(`.trip-filters__filter-input`);
    console.log(input);
    input.checked = true;
    switch (input.value) {
      case `future`:
        const futurePoints = this._points.slice().filter((point) => new Date(point.dateFrom).getTime() > new Date().getTime());
        this._getDaysForPoints(futurePoints);
        break;
      case `past`:
        const pastPoints = this._points.slice().filter((point) => new Date(point.dateTo).getTime() < new Date().getTime());
        this._getDaysForPoints(pastPoints);
        break;
      default:
        this._getDaysForPoints(this._points);
        break;
    }
  }
}
