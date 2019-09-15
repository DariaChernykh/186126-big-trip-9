import Sort from "../components/trip-sort";
import DaysContainer from "../components/container";
import Day from "../components/day";
import PointController from "./point-controller";
import NewPoint from "../components/new-point";

export class TripController {
  constructor(board, points) {
    this._board = board;
    this._points = points;
    this._sort = new Sort();
    this._daysContainer = new DaysContainer();
    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._addPointBtn = document.querySelector(`.trip-main__event-add-btn`);
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onDataChange(newData, oldData) {
    if (newData === null) {
      this._points.splice(this._points.findIndex((it) => it === oldData), 1);
    } else if (oldData === null) {
      this._points.push(newData);
    } else {
      this._points[this._points.findIndex((it) => it === oldData)] = newData;
    }
    this._daysContainer.getElement().innerHTML = ``;
    this._getDaysForPoints();
  }

  _getDaysForPoints() {
    const listUniqDays = [];

    this._points.forEach(value => {
      if (listUniqDays.findIndex(elem => new Date(elem).getDate() === new Date(value.dateFrom).getDate()) === -1) {
        listUniqDays.push(value.dateFrom);
      }
    });

    listUniqDays.sort((a, b) => a - b).forEach((val, index) => {
      let day = new Day(index + 1, val);
      this._daysContainer.getElement().appendChild(day.getElement());
    });

    this._points.forEach((point) => {
      const dayOfPoint = new Date(point.dateFrom).getDate();
      const test = listUniqDays.findIndex(elem => new Date(elem).getDate() === dayOfPoint);
      const dayForPoint = this._daysContainer.getElement().querySelectorAll(`.trip-events__list`)[test];
      this._renderPoint(point, dayForPoint);
    });
  }

  init() {
    this._board.appendChild(this._sort.getElement());
    this._board.appendChild(this._daysContainer.getElement());
    this._getDaysForPoints();

    this._sort.getElement()
      .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));

    this._addPointBtn.addEventListener(`click`, () => {
      const newPoint = new NewPoint(this._board);
      this._sort.getElement().after(newPoint.getElement());
      newPoint.bind();

      newPoint.onSubmit(() => {
        const formData = new FormData(newPoint.getElement());
        const dateFrom = new Date(formData.get(`event-start-time`));
        const dateTo = new Date(formData.get(`event-end-time`));
        const entry = {
          type: {
            key: newPoint._type,
            name: newPoint._typeName,
          },
          price: formData.get(`event-price`) ? formData.get(`event-price`) : 0,
          dateFrom,
          dateTo,
          duration: dateTo.getTime() - dateFrom.getTime(),
          activity: newPoint._activity,
          transfer: newPoint._transfer,
          cities: newPoint._cities,
          city: formData.get(`event-destination`),
          photos: newPoint._photos,
        };

        this._onDataChange(entry, null);
        newPoint.unrender();
      });

      newPoint.onEscape(() => {
        newPoint.unrender();
      });
    });
  }

  _renderPoint(point, parent) {
    return new PointController(parent, point, this._onDataChange, this._onChangeView);
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

    this._daysContainer.getElement().innerHTML = ``;
    switch (evt.target.control.value) {
      case `sort-time`:
        const sortedByTime = this._points.slice().sort((a, b) => (b.dateTo - b.dateFrom) - (a.dateTo - a.dateFrom));
        sortedByTime.forEach((point) => this._renderPoint(point, this._createOneDay()));
        break;
      case `sort-price`:
        const sortedByPrice = this._points.slice().sort((a, b) => b.price - a.price);
        sortedByPrice.forEach((point) => this._renderPoint(point, this._createOneDay()));
        break;
      default:
        this._getDaysForPoints();
        break;
    }
  }
}
