import AbstractComponent from "./abstract-component";
import flatpickr from "flatpickr";
import rangePlugin from 'flatpickr/dist/plugins/rangePlugin';
import {checkType, createActivityChoice, createDestination} from "../utils";
import {TYPES} from "../data";
import {getOptions} from "./options";

const possibleTypes = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min;
const createDestinationPoint = (arr) => {
  const point = arr[getRandomInt(0, arr.length - 1)];
  return {
    name: point.name,
    pictures: point.pictures,
    description: point.description
  };
};

export default class NewPoint extends AbstractComponent {
  constructor(board, places, offers) {
    super();
    this._container = board;
    this._places = places;
    this._type = possibleTypes[getRandomInt(0, possibleTypes.length - 1)];
    this._commonOffers = offers;
    this._avalibleOffers = this._commonOffers.length ? this._commonOffers.find((offer) => offer.type === this._type) : [];
    this._options = this._avalibleOffers.offers;
    this._destination = createDestinationPoint(this._places);
    this._activities = TYPES.activities;
    this._transfers = TYPES.transfers;

    this._onSubmitHandler = this._onSubmitButtonClick.bind(this);
    this._onEscKeyUp = this._onEscUp.bind(this);
    this._onChangeType = this._onChangeType.bind(this);
    this._onChangeOptions = this._onChangeOptions.bind(this);
  }

  onSubmit(fn) {
    this._onSubmit = fn;
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onSubmit === `function`) {
      this._onSubmit();
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
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type}.png" alt="Event type icon">
                </label>
                 <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                <div class="event__type-list">
                  <fieldset class="event__type-group">
                    <legend class="visually-hidden">Transfer</legend>
                    ${createActivityChoice(this._transfers)}
                  </fieldset>
        
                  <fieldset class="event__type-group">
                    <legend class="visually-hidden">Activity</legend>
                    ${createActivityChoice(this._activities)}
                  </fieldset>
                </div>
              </div>

              <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-1">
                ${this._type.toUpperCase().slice(0, 1) + this._type.slice(1)} ${checkType(this._type) === `activity` ? `in` : `to`}
                </label>
                <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._destination.name}" list="destination-list-1" >
                <datalist id="destination-list-1">
                  ${createDestination(this._places)}
                </datalist>
              </div>

              <div class="event__field-group  event__field-group--time">
                <label class="visually-hidden" for="event-start-time-1">
                  From
                </label>
                <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" required />
                &mdash;
                <label class="visually-hidden" for="event-end-time-1">
                  To
                </label>
                <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" required />
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
            
          ${this._avalibleOffers.offers.length ? `<section class="event__details">
            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
                ${getOptions(this._options, `edit`, this._type)}
              </div>
            </section>
        </section>` : ``}
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

    this._flatpickrDateStart = flatpickr(this._element.querySelector(`#event-start-time-1`), {
      plugins: [rangePlugin({input: `#event-end-time-1`})],
      altInput: true,
      allowInput: true,
      defaultDate: [`today`, `today`],
      enableTime: true,
      altFormat: `d/m/Y H:i`,
    });

    this._element.querySelector(`.event__type-list`).addEventListener(`click`, this._onChangeType);
    if (this._element.querySelector(`.event__available-offers`)) {
      this._element.querySelector(`.event__available-offers`).addEventListener(`click`, this._onChangeOptions);
    }
  }

  unbind() {
    this._flatpickrDateStart.destroy();
    this._element
      .removeEventListener(`submit`, this._onSubmitHandler);
    this._element.querySelector(`.event__reset-btn`)
      .removeEventListener(`click`, this._onEscKeyUp);
    this._element.querySelector(`.event__type-list`).removeEventListener(`click`, this._onChangeType);
    document.removeEventListener(`keyup`, this._onEscKeyUp);
    if (this._element.querySelector(`.event__available-offers`)) {
      this._element.querySelector(`.event__available-offers`).removeEventListener(`click`, this._onChangeOptions);
    }
  }

  _onChangeType(el) {
    if (el.target.classList.contains(`event__type-label`)) {
      this._type = el.target.parentElement.querySelector(`.event__type-input`).value;
      this._avalibleOffers = this._commonOffers.length ? this._commonOffers.find((offer) => offer.type === this._type) : [];
      this._options = this._avalibleOffers.offers;
      this._partialUpdate();
    }
  }

  _onChangeOptions(evt) {
    if (evt.target.classList.contains(`event__offer-label`)) {
      const title = evt.target.parentElement.querySelector(`.event__offer-title`).textContent;
      this._options.forEach((option) => {
        if (option.title === title) {
          option.accepted = evt.target.checked;
        }
      });
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
