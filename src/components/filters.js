import AbstractComponent from "./abstract-component";

const FILTERS = [`everything`, `future`, `past`];

export default class Filters extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return `<form class="trip-filters" action="#" method="get">
  ${FILTERS.reduce((acc, filter) => {
    acc += `
    <div class="trip-filters__filter">
    <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" ${acc === `` ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
  </div>
    `;
    return acc;
  }, ``)}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`;
  }
}
