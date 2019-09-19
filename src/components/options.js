export const getOptions = (options, mode) => {
  if (options.length && mode === `short`) {
    return options.reduce((acc, val) => {
      if (val.accepted) {
        acc += `<li class="event__offer">
        <span class="event__offer-title">${val.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${val.price}</span>
      </li>`;
      }
      return acc;
    }, ``);
  } else if (options.length && mode === `edit`) {
    return options.reduce((acc, val) => {
      acc += `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${val.key}-1" type="checkbox" name="event-offer-${val.key}" ${val.accepted ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${val.key}-1">
          <span class="event__offer-title">${val.title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${val.price}</span>
        </label>
      </div>
    `;
      return acc;
    }, ``);
  } return ` `;
};
