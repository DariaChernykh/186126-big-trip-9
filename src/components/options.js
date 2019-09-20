const checkAcception = (option, pointOption) => {
  let offer = pointOption.find(val => option.name === val.title);
  return offer ? offer.accepted : false;
};

export const getOptions = (options, mode, pointOptions) => {
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
  } else if (options.offers.length && mode === `edit`) {
    return options.offers.reduce((acc, val, index) => {
      acc += `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${options.type}-${index}" type="checkbox" name="event-offer-${options.type}-${index}" ${checkAcception(val, pointOptions) ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${options.type}-${index}">
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
