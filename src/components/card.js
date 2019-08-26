import {getOptions} from "./options";
import {createElement} from "../utiles";

export default class Card {
  constructor(data, date) {
    this._icon = data.icon;
    this._start = date.timeStart;
    this._end = date.timeEnd;
    this._duration = date.duration;
    this._price = data.price;
    this._options = data.options;
    this._onEdit = null;
    this._element = null;
  }

  _onEditButtonClick() {
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }

  get element() {
    return this._element;
  }

  onEdit(fn) {
    this._onEdit = fn;
  }

  getTemplate() {
    return `
      <li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${this._icon}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${this._icon.toUpperCase() + this._icon.slice(1)} to airport</h3>
    
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${this._start}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${this._end}</time>
          </p>
          <p class="event__duration">${this._duration}</p>
        </div>
    
        <p class="event__price">
          <span class="event__price-value">${this._price} €</span>
        </p>
    
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
         ${this._options ? getOptions(this._options, `short`) : ``}
        </ul>
    
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
    `.trim();
  }

  render() {
    this._element = createElement(this.getTemplate());
    this.bind();
    return this._element;
  }

  unrender() {
    this.unbind();
    this._element = null;
  }

  bind() {
    this._element.querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._onEditButtonClick.bind(this));
  }

  unbind() {
    this._element.querySelector(`.event__rollup-btn`)
      .removeEventListener(`click`, this._onEditButtonClick.bind(this));
  }
}
