import {TYPES} from "./data";

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const checkType = (type) => TYPES.transfers.findIndex((elem) => elem === type) >= 0 ? `transfer` : `activity`;
export const createActivityChoice = (arr) => {
  return arr.reduce((acc, value) => acc + `<div class="event__type-item">
                  <input id="event-type-${value}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${value}">
                  <label class="event__type-label  event__type-label--${value}" for="event-type-${value}-1">${value.toUpperCase().slice(0, 1) + value.slice(1)}</label>
                </div>`, ``);
};

export const createDestination = (arr) => arr.reduce((acc, value) => acc + `<option value="${value.name}"></option>`, ``);

export const shake = (element) => {
  const ANIMATION_TIMEOUT = 600;
  element.classList.add(`shake`);
  setTimeout(() => {
    element.classList.remove(`shake`);
  }, ANIMATION_TIMEOUT);
};
