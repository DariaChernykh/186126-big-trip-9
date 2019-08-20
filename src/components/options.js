export const getOptions = (options, mode) => {
  if (options.length && mode === `short`) {
    return options.reduce((acc, val) => {
      acc += `
      <li class="event__offer">
        <span class="event__offer-title">${val[0]}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${val[1]}</span>
      </li>
    `;
      return acc;
    }, ``);
  } else if (options.length && mode === `edit`) {
    return options.reduce((acc, val) => {
      acc += `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
        <label class="event__offer-label" for="event-offer-luggage-1">
          <span class="event__offer-title">${val[0]}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${val[1]}</span>
        </label>
      </div>
    `;
      return acc;
    }, ``);
  } return ` `;
};
