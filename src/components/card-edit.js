import {getOptions} from "./options";
import {createElement, getDate} from "../utils";

const NUM_PHOTOS = 4;
const createPhotoElements = (arr) => arr.reduce((acc, value) => acc + `<img class="event__photo" src="${value}" alt="Event photo">`, ``);
const createDestination = (arr) => arr.reduce((acc, value) => acc + `<option value="${value}"></option>`, ``);
const createActivityChoice = (arr) => arr.reduce((acc, value) => acc + `<div class="event__type-item">
                  <input id="event-type-${value}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${value}">
                  <label class="event__type-label  event__type-label--${value}" for="event-type-${value}-1">${value.toUpperCase().slice(0, 1) + value.slice(1)}</label>
                </div>`, ``);

export default class CardEdit {
  constructor(data, date) {
    this._activity = data.activity;
    this._transfer = data.transfer;
    this._type = data.type.key;
    this._typeName = data.type.name;
    this._start = date.timeStart;
    this._end = date.timeEnd;
    this._dueDate = data.dueDate;
    this._cities = data.cities;
    this._city = data.city;
    this._price = data.price;
    this._options = data.options;
    this._photos = data.photos;
    this._description = data.description;
    this._onEdit = null;
    this._element = null;
    this._onSubmitHandler = this._onSubmitButtonClick.bind(this);
  }

  _onSubmitButtonClick() {
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
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${this._typeName}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
    
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${createActivityChoice(this._transfer)}
              </fieldset>
    
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${createActivityChoice(this._activity)}
              </fieldset>
            </div>
          </div>
    
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
                ${this._typeName.toUpperCase().slice(0, 1) + this._typeName.slice(1)} ${this._type === `activity` ? `in` : `to`}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._city}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${createDestination(this._cities)}
            </datalist>
          </div>
    
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDate(this._dueDate).start} ${this._start}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDate(this._dueDate).end} ${this._end}">
          </div>
    
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              € 
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._price}">
          </div>
    
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
    
          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>
    
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
    
        <section class="event__details">
    
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    
            <div class="event__available-offers">
              ${this._options ? getOptions(this._options, `edit`) : ``}
            </div>
          </section>
    
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${this._description}</p>
    
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${createPhotoElements(this._photos(NUM_PHOTOS))}
              </div>
            </div>
          </section>
        </section>
      </form>
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
    this._element.querySelector(`form`)
      .addEventListener(`submit`, this._onSubmitHandler);
  }

  unbind() {
    this._element.querySelector(`form`)
      .removeEventListener(`submit`, this._onSubmitHandler);
  }

}
