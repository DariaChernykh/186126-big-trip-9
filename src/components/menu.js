import AbstractComponent from "./abstract-component";

export default class Menu extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" id="table">Table</a>
  <a class="trip-tabs__btn" href="#" id="stats">Stats</a>
</nav>`;
  }
}
