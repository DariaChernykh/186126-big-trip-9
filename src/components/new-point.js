import AbstractComponent from "./abstract-component";
import flatpickr from "flatpickr";
import {getRandomInt} from "../data";

const TYPES = {
  'transfer': [`bus`, `drive`, `flight`, `ship`, `taxi`, `train`, `transport`],
  'activity': [`restaurant`, `sightseeing`, `check-in`]
};
const CITIES = [`Amsterdam`, `Geneva`, `Chamonix`, `London`, `Berlin`, `Vienna`, `Paris`, `Manchester`];
const createDestination = (arr) => arr.reduce((acc, value) => acc + `<option value="${value}"></option>`, ``);

const getType = (types) => {
  let keys = Object.keys(types);
  let key = keys[getRandomInt(0, keys.length - 1)];
  let name = types[key][getRandomInt(0, types[key].length - 1)];

  return {
    key,
    name
  };
};


const createActivityChoice = (arr) => {
  return arr.reduce((acc, value) => acc + `<div class="event__type-item">
                  <input id="event-type-${value}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${value}">
                  <label class="event__type-label  event__type-label--${value}" for="event-type-${value}-1">${value.toUpperCase().slice(0, 1) + value.slice(1)}</label>
                </div>`, ``);
};

const newType = getType(TYPES);
const NUM_PHOTOS = 4;
const getPhotos = (number) => {
  const photos = [];
  for (let i = 0; i < number; i++) {
    photos.push(`http://picsum.photos/300/150?r=${Math.random()}`);
  }
  return photos;
};

export default class NewPoint extends AbstractComponent {
  constructor(board) {
    super();
    this._container = board;
    this._type = newType.key;
    this._typeName = newType.name;
    this._activity = TYPES.activity;
    this._transfer = TYPES.transfer;
    this._cities = CITIES;
    this._photos = getPhotos(NUM_PHOTOS);
    this._city = CITIES[getRandomInt(0, CITIES.length - 1)];
    this._onSubmitHandler = this._onSubmitButtonClick.bind(this);
    this._onEscKeyUp = this._onEscUp.bind(this);
    this._onChangeType = this._onChangeType.bind(this);
  }

  onSubmit(fn) {
    this._onEdit = fn;
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }

  onEscape(fn) {
    this._onEscape = fn;
  }

  _onEscUp(evt) {
    evt.preventDefault();
    if (typeof this._onEscape === `function`) {
      if (evt.type === `click` || evt.code === `Escape`) {
        this._onEscape();
      }
    }
  }

  getTemplate() {
    return `<form class="trip-events__item  event  event--edit" action="#" method="post">
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
                <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 00:00" required>
                &mdash;
                <label class="visually-hidden" for="event-end-time-1">
                  To
                </label>
                <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 00:00" required>
              </div>

              <div class="event__field-group  event__field-group--price">
                <label class="event__label" for="event-price-1">
                  <span class="visually-hidden">Price</span>
                  &euro;
                </label>
                <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="">
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">Cancel</button>
            </header>
          </form>`;
  }

  unrender() {
    this.unbind();
    this._container.removeChild(this._element);
  }

  bind() {
    this._element
      .addEventListener(`submit`, this._onSubmitHandler);

    this._element.querySelector(`.event__reset-btn`)
      .addEventListener(`click`, this._onEscKeyUp);

    document.addEventListener(`keyup`, this._onEscKeyUp);

    flatpickr(this._element.querySelector(`#event-start-time-1`), {
      altInput: true,
      allowInput: true,
      defaultDate: this._dateFrom,
      enableTime: true,
      altFormat: `d/m/Y H:i`,
    });
    flatpickr(this._element.querySelector(`#event-end-time-1`), {
      altInput: true,
      allowInput: true,
      defaultDate: this._dateTo,
      enableTime: true,
      altFormat: `d/m/Y H:i`,
    });

    this._element.querySelector(`.event__type-list`).addEventListener(`click`, this._onChangeType);
  }

  unbind() {
    this._element
      .removeEventListener(`submit`, this._onSubmitHandler);

    this._element.querySelector(`.event__reset-btn`)
      .removeEventListener(`click`, this._onEscKeyUp);

    this._element.querySelector(`.event__type-list`).removeEventListener(`click`, this._onChangeType);

    document.removeEventListener(`keyup`, this._onEscKeyUp);
  }

  _onChangeType(el) {
    if (el.target.classList.contains(`event__type-label`)) {
      const type = el.target.parentElement.querySelector(`.event__type-input`).value;
      this._typeName = type;
      if (type === `restaurant` || type === `sightseeing` || type === `check-in`) {
        this._type = `activity`;
      } else {
        this._type = `transfer`;
      }
      this._partialUpdate();
    }
  }

  _partialUpdate() {
    this.unbind();
    const prevElement = this._element;
    this._element = null;
    this._element = this.getElement();
    this._container.replaceChild(this._element, prevElement);
    prevElement.remove();
    this.bind();
  }
}
