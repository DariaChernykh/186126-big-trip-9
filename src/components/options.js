export const getOptions = (pointOptions, mode, type) => {
  if (pointOptions.length && mode === `short`) {
    const sortedOptions = pointOptions.length <= 3 ? pointOptions : pointOptions.slice().sort((a, b) => b.accepted - a.accepted).slice(0, 3);
    return sortedOptions.reduce((acc, val) => {
      if (val.accepted) {
        acc += `<li class="event__offer">
        <span class="event__offer-title">${val.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${val.price}</span>
      </li>`;
      }
      return acc;
    }, ``);
  } else if (pointOptions.length && mode === `edit`) {
    return pointOptions.reduce((acc, val, index) => {
      acc += `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${index}" type="checkbox" name="event-offer-${type}-${index}" ${val.accepted ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${type}-${index}">
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
