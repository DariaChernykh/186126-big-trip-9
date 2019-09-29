import AbstractComponent from "./abstract-component";
import {createElement} from "../utils";

export default class NoPoint extends AbstractComponent {
  getTemplate() {
    return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
  }

  getTemplateLoad() {
    return `<p class="trip-events__msg">Loading...</p>`;
  }

  render() {
    this._element = createElement(this.getTemplateLoad());
    return this._element;
  }
}

