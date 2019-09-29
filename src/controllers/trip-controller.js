import Sort from "../components/trip-sort";
import DaysContainer from "../components/container";
import Day from "../components/day";
import PointController from "./point-controller";
import NewPoint from "../components/new-point";
import Stats from "../components/statistics";
import moment from "moment";
import ModelPoint from "../model-point";
import Information from "../components/information";
import NoPoint from "../components/no-points";
import {shake} from "../utils";

const HEADER_INFO = document.querySelector(`.trip-info`);
const PRICE_CONTAINER = document.querySelector(`.trip-info__cost-value`);
const calcPriceTrip = (arr) => arr.reduce((acc, value) => {

  const optionsPrice = value.options.reduce((sum, option) => {
    if (option.accepted) {
      sum += option.price;
    }
    return sum;
  }, 0);
  acc += value.price + optionsPrice;
  return acc;
}, 0);

export default class TripController {
  constructor(board, points, places, offers, api) {
    this._board = board;
    this._points = points;
    this._sort = new Sort();
    this._tripStats = new Stats();
    this._daysContainer = new DaysContainer();
    this._information = new Information(this._points);
    this._noPoint = new NoPoint();
    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._createNewPoint = this._createNewPoint.bind(this);
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
          this._reRender();
        })
        .catch((err) => {
          throw err;
        });

    } else if (oldData === null) {
      this._api.createPoint({data: newData.toRAW()})
        .then(() => {
          if (this._points.length === 0) {
            this._tripStats.generateCharts(this._points);
          }
          this._points.push(newData);
          this._reRender();
        })
        .catch((err) => {
          throw err;
        });

    } else {
      this._api.updatePoint({id: newData.id, data: newData.toRAW()})
        .then(() => {
          this._points[this._points.findIndex((it) => it === oldData)] = newData;
          this._reRender();
        })
        .catch((err) => {
          throw err;
        });
    }
  }

  _reRender() {
    this._api.getPoints().then((points) => {
      if (points.length) {
        this._getDaysForPoints(points);
        PRICE_CONTAINER.innerHTML = calcPriceTrip(points);
        this._sort.getElement().style = `display: flex`;

        const prevElement = this._information._element;
        this._information._element = null;
        this._information = new Information(points);
        this._information._element = this._information.getElement();
        HEADER_INFO.replaceChild(this._information._element, prevElement);
        prevElement.remove();
        this._tripStats.updateData(points);
      } else {
        this._sort.getElement().style = `display: none`;
        this._board.appendChild(this._noPoint.getElement());
      }
    });
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
      const findIndexOfDay = listUniqDays.findIndex((elem) => new Date(elem).getDate() === dayOfPoint);
      const dayForPoint = this._daysContainer.getElement().querySelectorAll(`.trip-events__list`)[findIndexOfDay];

      this._renderPoint(point, dayForPoint);
    });
  }

  init() {
    this._addPointBtn.addEventListener(`click`, this._createNewPoint);
    if (this._points.length) {
      HEADER_INFO.prepend(this._information.getElement());
      PRICE_CONTAINER.textContent = calcPriceTrip(this._points);
      this._board.appendChild(this._sort.getElement());
      this._board.appendChild(this._daysContainer.getElement());
      this._getDaysForPoints(this._points);
      this._tripStats.generateCharts(this._points);

      this._sort.getElement()
        .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));

      this._filters
        .addEventListener(`click`, (evt) => this._onFilterClick(evt));
    } else {
      this._board.appendChild(this._noPoint.getElement());
    }
  }

  _createNewPoint() {
    const newPoint = new NewPoint(this._board, this._places, this._offers);
    if (!this._points.length) {
      HEADER_INFO.prepend(this._information.getElement());
      this._board.removeChild(this._noPoint.getElement());
      this._board.appendChild(this._sort.getElement());
      this._board.appendChild(this._daysContainer.getElement());
    }
    this._sort.getElement().after(newPoint.getElement());
    newPoint.bind();

    newPoint.onSubmit(() => {
      newPoint.getElement().style = `border: none`;
      const formData = new FormData(newPoint.getElement());
      const dateFrom = moment(formData.get(`event-start-time`).slice(0, 16));
      const dateTo = moment(formData.get(`event-start-time`).slice(19));
      const getFormOptions = () => {
        const options = newPoint.getElement().querySelectorAll(`.event__offer-selector`);
        const currentOptions = newPoint._options;
        newPoint._options = [];
        [...options].forEach((option, index) => {
          const accepted = option.querySelector(`.event__offer-checkbox`).checked;
          newPoint._options.push({
            title: currentOptions[index].title,
            price: currentOptions[index].price,
            accepted
          });
        });
        return newPoint._options;
      };

      const checkName = this._places.find((el) => {
        return el.name === formData.get(`event-destination`);
      });
      const entry = {
        id: this._points.length,
        price: parseInt(formData.get(`event-price`) ? formData.get(`event-price`) : 0, 10),
        type: newPoint._type,
        isFavorite: !!formData.get(`event-favorite`),
        dateFrom: dateFrom.format(),
        dateTo: dateTo.format(),
        duration: dateTo.millisecond() - dateFrom.millisecond(),
        options: getFormOptions(),
        destination: {
          name: checkName ? formData.get(`event-destination`) : ``,
          pictures: newPoint._destination.pictures,
          description: newPoint._destination.description
        },
      };

      const load = (isSuccess) => {
        return new Promise((res, rej) => {
          setTimeout(isSuccess ? res : rej, 1500);
        });
      };

      const inputs = newPoint.getElement().querySelectorAll(`input`);
      const saveBtn = newPoint.getElement().querySelector(`.event__save-btn`);
      const deleteBtn = newPoint.getElement().querySelector(`.event__reset-btn`);

      const block = () => {
        inputs.forEach((input) => {
          input.disabled = true;
        });
        saveBtn.disabled = true;
        deleteBtn.disabled = true;
        saveBtn.textContent = `Saving...`;
      };

      const unblock = () => {
        inputs.forEach((input) => {
          input.disabled = false;
        });
        saveBtn.disabled = false;
        deleteBtn.disabled = false;
        saveBtn.textContent = `Save`;
      };
      block();

      load(true)
        .then(() => {
          if (entry.destination.name) {
            unblock();
            this._onDataChange(new ModelPoint(ModelPoint.toRAW(entry)), null);
            newPoint.unrender();
          } else {
            shake(newPoint.getElement());
            newPoint.getElement().style = `border: 2px solid red`;
            unblock();
          }
        })
        .catch(() => {
          shake(newPoint.getElement());
          newPoint.getElement().style = `border: 2px solid red`;
          unblock();
        });
    });

    newPoint.onEscape(() => {
      newPoint.unrender();
    });
  }

  _renderPoint(point, parent) {
    const pointController = new PointController(parent, point, this._offers, this._places, this._api, this._onDataChange, this._onChangeView);

    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
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
    evt.target.parentElement.parentElement.querySelectorAll(`input`).forEach((input) => {
      input.checked = false;
    });
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
    const input = evt.target.parentElement.querySelector(`.trip-filters__filter-input`);
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
