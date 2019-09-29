import AbstractComponent from "./abstract-component";

const returnDate = (start, end) => {
  const MONTHS = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`,
    `September`, `October`, `November`, `December`];
  return `${new Date(start).getDate()} ${MONTHS[new Date(start).getMonth()]}&nbsp;&mdash;&nbsp;${new Date(end).getDate()} ${MONTHS[new Date(end).getMonth()]}`;
};

export default class Information extends AbstractComponent {
  constructor(points) {
    super();
    this._points = points.length ? points.slice().sort((a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime()) : points;
  }
  getTemplate() {
    switch (this._points.length) {
      case 0:
        return `<div class="trip-info__main"></div>`;
      case 1:
        return `<div class="trip-info__main">
          <h1 class="trip-info__title">${this._points[0].destination.name}</h1>
          <p class="trip-info__dates">${returnDate(this._points[0].dateFrom, this._points[this._points.length - 1].dateTo)}</p>
        </div>`;
      case 2:
        return `<div class="trip-info__main">
          <h1 class="trip-info__title">${this._points[0].destination.name} &mdash; ${this._points[this._points.length - 1].destination.name}</h1>
          <p class="trip-info__dates">${returnDate(this._points[0].dateFrom, this._points[this._points.length - 1].dateTo)}</p>
        </div>`;
      case 3:
        return `<div class="trip-info__main">
          <h1 class="trip-info__title">${this._points[0].destination.name} &mdash; ${this._points[1].destination.name} &mdash; ${this._points[this._points.length - 1].destination.name}</h1>
          <p class="trip-info__dates">${returnDate(this._points[0].dateFrom, this._points[this._points.length - 1].dateTo)}</p>
        </div>`;
      default:
        return `<div class="trip-info__main">
      <h1 class="trip-info__title">${this._points[0].destination.name} &mdash; ... &mdash; ${this._points[this._points.length - 1].destination.name}</h1>
    
      <p class="trip-info__dates">${returnDate(this._points[0].dateFrom, this._points[this._points.length - 1].dateTo)}</p>
    </div>`;
    }
  }
  update(points) {
    this._points = points.slice().sort((a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime());
  }
}
