const FILTERS = [`everything`, `future`, `past`];

export const getFilters = () => `
<form class="trip-filters" action="#" method="get">
  ${FILTERS.reduce((acc, filter) => {
    acc += `
    <div class="trip-filters__filter">
    <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}">
    <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
  </div>
    `;
    return acc;
  }, ``)}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>
`;
