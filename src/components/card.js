import {getOptions} from "./options";
import {createElement, checkType} from "../utils";
import AbstractComponent from "./abstract-component";
import moment from "moment";

const generateDurationString = (duration) => {
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  let days = Math.floor((duration / (1000 * 60 * 60 * 24)));

  days = (days < 10) ? `0` + days : days;
  hours = (hours < 10) ? `0` + hours : hours;
  minutes = (minutes < 10) ? `0` + minutes : minutes;
  return `${parseInt(days, 10) ? `${days}D` : ``} ${parseInt(hours, 10) ? `${hours}H` : ``} ${parseInt(minutes, 10) ? `${minutes}M` : ``}`.trim();
};

export default class Card extends AbstractComponent {
  constructor(data) {
    super();
    this._type = data.type;
    this._price = data.price;
    this._options = data.options;
    this._destination = {
      name: data.destination.name,
    };
    this._onEdit = null;
    this._onEditHandler = this._onEditButtonClick.bind(this);

    this._dateFrom = moment(data.dateFrom);
    this._dateTo = moment(data.dateTo);
    this._duration = data.duration;
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
          <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${this._type.toUpperCase().slice(0, 1)}${this._type.slice(1)} ${checkType(this._type) === `activity` ? `in` : `to`} ${this._destination.name}</h3>
    
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${this._dateFrom.format()}">${this._dateFrom.format(`HH:mm`)}</time>
            &mdash;
            <time class="event__end-time" datetime="${this._dateTo.format()}">${this._dateTo.format(`HH:mm`)}</time>
          </p>
          <p class="event__duration">${generateDurationString(this._duration)}</p>
        </div>
    
        <p class="event__price">
          <span class="event__price-value">${this._price} €</span>
        </p>
    
        
        ${this._options.length ? `<h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
         ${getOptions(this._options, `short`)}
        </ul>` : ``}        
    
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
