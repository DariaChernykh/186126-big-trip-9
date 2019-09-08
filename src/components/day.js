import AbstractComponent from "./abstract-component";
import moment from "moment";

export default class Day extends AbstractComponent {
  constructor(count, day) {
    super();
    this._count = count;
    this._day = moment(day);
  }
  getTemplate() {
    return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${this._count}</span>
        <time class="day__date" datetime="${this._day.format(`YYYY-MM-DD`)}">${this._day.format(`MM DD`)}</time>
      </div>
    
      <ul class="trip-events__list"></ul>
    </li>`;
  }
}
