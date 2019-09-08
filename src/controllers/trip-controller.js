import Sort from "../components/trip-sort";
import DaysContainer from "../components/container";
import Day from "../components/day";
import PointController from "./point-controller";

export class TripController {
  constructor(board, points) {
    this._board = board;
    this._points = points;
    this._sort = new Sort();
    this._daysContainer = new DaysContainer();
    this._day = new Day(1, this._points[0].dateFrom);
    this._dayEventslist = this._day.getElement().querySelector(`.trip-events__list`);
    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onDataChange(newData, oldData) {
    this._points[this._points.findIndex((it) => it === oldData)] = newData;
    this._dayEventslist.innerHTML = ``;
    this._points.forEach((point) => this._renderPoint(point));
  }

  init() {
    this._board.appendChild(this._sort.getElement());
    this._board.appendChild(this._daysContainer.getElement());
    this._daysContainer.getElement().appendChild(this._day.getElement());
    this._points.forEach((point) => this._renderPoint(point));

    this._sort.getElement()
      .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  _renderPoint(point) {
    return new PointController(this._dayEventslist, point, this._onDataChange, this._onChangeView);
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();
    if (!evt.target.classList.contains(`trip-sort__btn`)) {
      return;
    }
    this._dayEventslist.innerHTML = ``;
    switch (evt.target.control.value) {
      case `sort-time`:
        console.log(this._points);
        const sortedByTime = this._points.slice().sort((a, b) => (b.dateTo - b.dateFrom) - (a.dateTo - a.dateFrom));
        sortedByTime.forEach((point) => this._renderPoint(point));
        break;
      case `sort-price`:
        const sortedByPrice = this._points.slice().sort((a, b) => b.price - a.price);
        sortedByPrice.forEach((point) => this._renderPoint(point));
        break;
      default:
        this._points.forEach((point) => this._renderPoint(point));
        break;
    }
  }
}
