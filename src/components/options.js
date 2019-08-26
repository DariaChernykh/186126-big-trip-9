export const getOptions = (options, mode) => {
  if (options.length && mode === `short`) {
    return options.reduce((acc, val) => {
      acc += `
      <li class="event__offer">
        <span class="event__offer-title">${val[1].name}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${val[1].value}</span>
      </li>
    `;
      return acc;
    }, ``);
  } else if (options.length && mode === `edit`) {
    return options.reduce((acc, val) => {
      acc += `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${val[0]}-1" type="checkbox" name="event-offer-${val[0]}" checked>
        <label class="event__offer-label" for="event-offer-${val[0]}-1">
          <span class="event__offer-title">${val[1].name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${val[1].value}</span>
        </label>
      </div>
    `;
      return acc;
    }, ``);
  } return ` `;
};
