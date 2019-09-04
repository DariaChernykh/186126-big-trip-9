import Card from "../components/card";
import CardEdit from "../components/card-edit";
import Sort from "../components/trip-sort";
import DaysContainer from "../components/container";
import Day from "../components/day";

export class TripController {
  constructor(board, points) {
    this._board = board;
    this._points = points;
    this._sort = new Sort();
    this._daysContainer = new DaysContainer();
    this._day = new Day(1, this._points[0].dueDate);
    this._dayEventslist = this._day.getElement().querySelector(`.trip-events__list`);
  }

  _renderPoints(parent, arr) {
    arr.forEach((value) => {
      const cardComponent = new Card(value);
      const cardEditComponent = new CardEdit(value);

      cardComponent.onEdit(() => {
        cardEditComponent.render();
        parent.replaceChild(cardEditComponent.getElement(), cardComponent.getElement());
        cardComponent.unrender();
      });

      cardEditComponent.onEdit(() => {
        cardComponent.render();
        parent.replaceChild(cardComponent.getElement(), cardEditComponent.getElement());
        cardEditComponent.unrender();
      });

      parent.appendChild(cardComponent.render());
    });
  }

  init() {
    this._board.appendChild(this._sort.getElement());
    this._board.appendChild(this._daysContainer.getElement());
    this._daysContainer.getElement().appendChild(this._day.getElement());
    this._renderPoints(this._dayEventslist, this._points);

    this._sort.getElement()
      .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `LABEL`) {
      return;
    }
    this._dayEventslist.innerHTML = ``;

    switch (evt.target.dataset.sortType) {
      case `sort-time`:
        const sortedByTime = this._points.slice().sort((a, b) => b.testDate.duration - a.testDate.duration);
        this._renderPoints(this._dayEventslist, sortedByTime);
        break;
      case `sort-price`:
        const sortedByPrice = this._points.slice().sort((a, b) => b.price - a.price);
        this._renderPoints(this._dayEventslist, sortedByPrice);
        break;
      default:
        this._renderPoints(this._dayEventslist, this._points);
        break;
    }
  }
}
