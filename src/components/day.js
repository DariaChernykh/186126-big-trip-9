import AbstractComponent from "./abstract-component";

export default class Day extends AbstractComponent {
  constructor(count, day) {
    super();
    this._count = count;
    this._day = day;
  }
  getTemplate() {
    return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${this._count}</span>
        <time class="day__date" datetime="${this._day.getFullYear()}-${this._day.getMonth()}-${this._day.getDate()}">${this._day.getMonth()} ${this._day.getDate()}</time>
      </div>
    
      <ul class="trip-events__list"></ul>
    </li>`;
  }
}
