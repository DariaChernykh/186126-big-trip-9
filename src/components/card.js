import {getOptions} from "./options";
import {createElement} from "../utils";
import AbstractComponent from "./abstract-component";

export default class Card extends AbstractComponent {
  constructor(data, date) {
    super();
    this._type = data.type.key;
    this._typeName = data.type.name;
    this._start = date.timeStart;
    this._end = date.timeEnd;
    this._startDatetime = date.startDatetime;
    this._endDatetime = date.endDatetime;
    this._duration = date.duration;
    this._price = data.price;
    this._options = data.options;
    this._onEdit = null;
    this._onEditHandler = this._onEditButtonClick.bind(this);
  }

  _onEditButtonClick() {
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }

  onEdit(fn) {
    this._onEdit = fn;
  }

  getTemplate() {
    return `
      <li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${this._typeName}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${this._typeName.toUpperCase().slice(0, 1) + this._typeName.slice(1)} ${this._type === `activity` ? `in` : `to`} airport</h3>
    
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${this._startDatetime}">${this._start}</time>
            &mdash;
            <time class="event__end-time" datetime="2${this._endDatetime}">${this._end}</time>
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
      .addEventListener(`click`, this._onEditHandler);
  }

  unbind() {
    this._element.querySelector(`.event__rollup-btn`)
      .removeEventListener(`click`, this._onEditHandler);
  }
}
