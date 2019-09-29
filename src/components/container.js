import AbstractComponent from "./abstract-component";

export default class DaysContainer extends AbstractComponent {
  getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }
}

