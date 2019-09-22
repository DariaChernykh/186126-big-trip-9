import {getOptions} from "./options";
import {createElement} from "../utils";
import AbstractComponent from "./abstract-component";
import flatpickr from "flatpickr";
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

const TYPES = {
  'transfer': [`bus`, `drive`, `flight`, `ship`, `taxi`, `train`, `transport`],
  'activity': [`restaurant`, `sightseeing`, `check-in`]
};

const checkType = (type) => TYPES.transfer.findIndex((elem) => elem === type) >= 0 ? `transfer` : `activity`;

const createPhotoElements = (arr) => {
  if (!arr) {
    return ``;
  }
  return arr.reduce((acc, value) => acc + `<img class="event__photo" src="${value.src}" alt="${value.description}">`, ``);
};
const createDestination = (arr) => arr.reduce((acc, value) => acc + `<option value="${value.name}"></option>`, ``);
const createActivityChoice = (arr) => {
  return arr.reduce((acc, value) => acc + `<div class="event__type-item">
                  <input id="event-type-${value}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${value}">
                  <label class="event__type-label  event__type-label--${value}" for="event-type-${value}-1">${value.toUpperCase().slice(0, 1) + value.slice(1)}</label>
                </div>`, ``);
};

export default class CardEdit extends AbstractComponent {
  constructor(data, container, offers, places) {
    super();
    this._id = data.id;
    this._container = container;
    this._type = data.type;
    this._destination = {
      name: data.destination.name,
      pictures: data.destination.pictures,
      description: data.destination.description
    };
    this._price = data.price;
    this._options = data.options;
    this._isFavorite = data.isFavorite;
    this._dateFrom = data.dateFrom;
    this._dateTo = data.dateTo;
    this._commonOffers = offers;
    this._avalibleOffers = this._commonOffers.length ? this._commonOffers.find((offer) => offer.type === this._type) : [];
    this._places = places;

    this._onEdit = null;
    this._onSubmitHandler = this._onSubmitButtonClick.bind(this);
    this._onEscKeyUp = this._onEscUp.bind(this);
    this._onDeleteHandler = this._onDeleteClick.bind(this);
    this._onChangeType = this._onChangeType.bind(this);
    this._onChangePoint = this._onChangePoint.bind(this);
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

  onDelete(fn) {
    this._onDelete = fn;
  }

  _onDeleteClick(evt) {
    evt.preventDefault();
    if (typeof this._onDelete === `function`) {
      this._onDelete();
    }
  }

  getTemplate() {
    return `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="get">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${this._id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${this._id}" type="checkbox">
    
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${createActivityChoice(TYPES.transfer)}
              </fieldset>
    
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${createActivityChoice(TYPES.activity)}
              </fieldset>
            </div>
          </div>
    
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${this._id}">
                ${this._type.toUpperCase().slice(0, 1) + this._type.slice(1)} ${checkType(this._type) === `activity` ? `in` : `to`}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${this._id}" type="text" name="event-destination" value="${this._destination.name}" list="destination-list-${this._id}">
            <datalist id="destination-list-${this._id}">
              ${createDestination(this._places)}
            </datalist>
          </div>
    
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${this._id}">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-${this._id}" type="text" name="event-start-time" data-input>
            &mdash;
            <label class="visually-hidden" for="event-end-time-${this._id}">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-${this._id}" type="text" name="event-end-time" data-input>
          </div>
    
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${this._id}">
              <span class="visually-hidden">Price</span>
              € 
            </label>
            <input class="event__input  event__input--price" id="event-price-${this._id}" type="number" name="event-price" value="${this._price}">
          </div>
    
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
    
          <input id="event-favorite-${this._id}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${this._isFavorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-${this._id}">
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
          ${this._avalibleOffers.offers.length ? `<h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${this._options.length ? getOptions(this._avalibleOffers, `edit`, this._options) : ``}
            </div>` : ``}
            
          </section>
    
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${this._destination.description}</p>
    
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${createPhotoElements(this._destination.pictures)}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>`.trim();
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

    this._element.querySelector(`.event__reset-btn`)
      .addEventListener(`click`, this._onDeleteHandler);

    this._element.querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._onEscKeyUp);

    document.addEventListener(`keyup`, this._onEscKeyUp);

    flatpickr(this._element.querySelector(`#event-start-time-${this._id}`), {
      altInput: true,
      allowInput: true,
      defaultDate: this._dateFrom,
      enableTime: true,
      altFormat: `d/m/Y H:i`,
    });
    flatpickr(this._element.querySelector(`#event-end-time-${this._id}`), {
      altInput: true,
      allowInput: true,
      defaultDate: this._dateTo,
      enableTime: true,
      altFormat: `d/m/Y H:i`,
    });

    this._element.querySelector(`.event__type-list`).addEventListener(`click`, this._onChangeType);
    this._element.querySelector(`.event__input--destination`).addEventListener(`change`, this._onChangePoint);
  }

  unbind() {
    this._element.querySelector(`form`)
      .removeEventListener(`submit`, this._onSubmitHandler);

    this._element.querySelector(`.event__reset-btn`)
      .removeEventListener(`click`, this._onDeleteHandler);

    this._element.querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._onEscKeyUp);

    this._element.querySelector(`.event__type-list`).removeEventListener(`click`, this._onChangeType);
    this._element.querySelector(`.event__input--destination`).removeEventListener(`change`, this._onChangePoint);

    document.removeEventListener(`keyup`, this._onEscKeyUp);
  }

  _onChangeType(el) {
    if (el.target.classList.contains(`event__type-label`)) {
      this._type = el.target.parentElement.querySelector(`.event__type-input`).value;
      this._avalibleOffers = this._commonOffers.length ? this._commonOffers.find((offer) => offer.type === this._type) : [];
      this._partialUpdate();
    }
  }

  _onChangePoint(el) {
    if (el.target.classList.contains(`event__input--destination`)) {
      this._destination.name = el.target.value;

      const destinationPoint = this._places.find(place => place.name === this._destination.name);
      if (destinationPoint) {
        this._destination.description = destinationPoint.description;
        this._destination.pictures = destinationPoint.pictures;
      } else {
        this._destination.description = ``;
        this._destination.pictures = [];
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
