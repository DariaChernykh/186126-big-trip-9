import Sort from "../components/trip-sort";
import DaysContainer from "../components/container";
import Day from "../components/day";
import PointController from "./point-controller";
import NewPoint from "../components/new-point";
import Stats from "../components/statistics";

export class TripController {
  constructor(board, points, places, offers, api) {
    // console.log( places, offers, api);
    this._board = board;
    this._points = points;
    this._sort = new Sort();
    this._tripStats = new Stats();
    this._daysContainer = new DaysContainer();
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
    if (newData === null) {
      this._points.splice(this._points.findIndex((it) => it === oldData), 1);

      // this._api.deletePoint({id: oldData.id})
      //   .then(() => {
      //     this._events.splice(this._events.indexOf(oldData), 1);
      //     this.renderAllEvents();
      //     this._reRenderHeader();
      //   })
      //   .catch(onError);
    } else if (oldData === null) {
      this._points.push(newData);

      // this._api.createPoint({point: newData.toRAW()})
      //   .then((addedEvent) => {
      //     this._events.push(addedEvent);
      //     this.renderAllEvents();
      //     this._reRenderHeader();
      //   })
      //   .catch(onError);

    } else {
      this._points[this._points.findIndex((it) => it === oldData)] = newData;

      // this._api.updatePoint({id: newData.id, data: newData.toRAW()})
      //   .then((modifiedEvent) => {
      //     Object.assign(this._events[this._events.findIndex((event) => event === oldData)], modifiedEvent);
      //     this._reRenderHeader();
      //     if (onSuccess) {
      //       onSuccess();
      //     }
      //   })
      //   .catch(onError);
    }
    this._daysContainer.getElement().innerHTML = ``;
    this._getDaysForPoints(this._points);
    this._tripStats.updateData(this._points);
  }

  _getDaysForPoints(arr) {
    const listUniqDays = [];
    arr.forEach(value => {
      if (listUniqDays.findIndex(elem => new Date(elem).getDate() === new Date(value.dateFrom).getDate()) === -1) {
        listUniqDays.push(value.dateFrom);
      }
    });

    listUniqDays.sort((a, b) => a - b).forEach((val, index) => {
      let day = new Day(index + 1, val);
      this._daysContainer.getElement().appendChild(day.getElement());
    });


    arr.forEach(point => {
      const dayOfPoint = new Date(point.dateFrom).getDate();
      const test = listUniqDays.findIndex(elem => new Date(elem).getDate() === dayOfPoint);
      const dayForPoint = this._daysContainer.getElement().querySelectorAll(`.trip-events__list`)[test];

      this._renderPoint(point, dayForPoint);
    });
  }

  init() {
    this._board.appendChild(this._sort.getElement());
    this._board.appendChild(this._daysContainer.getElement());
    this._getDaysForPoints(this._points);

    this._sort.getElement()
      .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));

    this._filters
      .addEventListener(`click`, (evt) => this._onFilterClick(evt));

    this._addPointBtn.addEventListener(`click`, () => {
      const newPoint = new NewPoint(this._board);
      this._sort.getElement().after(newPoint.getElement());
      newPoint.bind();

      newPoint.onSubmit(() => {
        const formData = new FormData(newPoint.getElement());
        const dateFrom = new Date(formData.get(`event-start-time`));
        const dateTo = new Date(formData.get(`event-end-time`));
        const entry = {
          type: newPoint.type,
          typeName: newPoint.typeName,
          city: formData.get(`event-destination`),
          price: parseInt(formData.get(`event-price`), 10),
          isFavorite: formData.get(`event-favorite`),
          dateFrom: dateFrom,
          dateTo: dateTo,
          duration: dateTo.getTime() - dateFrom.getTime(),
          photos: newPoint.photos,
        };
        this._onDataChange(entry, null);
        newPoint.unbind();
      });

      newPoint.onEscape(() => {
        newPoint.unrender();
      });
    });

    this._tripStats.generateCharts(this._points);
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
        const futurePoints = this._points.slice().filter((point) => point.dateFrom > new Date());
        this._getDaysForPoints(futurePoints);
        break;
      case `past`:
        const pastPoints = this._points.slice().filter((point) => point.dateTo < new Date());
        this._getDaysForPoints(pastPoints);
        break;
      default:
        this._getDaysForPoints(this._points);
        break;
    }
  }
}
