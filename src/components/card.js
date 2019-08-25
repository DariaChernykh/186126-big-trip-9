import {getOptions} from "./options";
export const getCard = (data, date) => `
<li class="trip-events__item">
  <div class="event">
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="/img/icons/${data.icon}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${data.icon[0].toUpperCase() + data.icon.slice(1)} to airport</h3>

    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="2019-03-18T10:30">${date.timeStart}</time>
        &mdash;
        <time class="event__end-time" datetime="2019-03-18T11:00">${date.timeEnd}</time>
      </p>
      <p class="event__duration">${date.duration}</p>
    </div>

    <p class="event__price">
      <span class="event__price-value">${data.price} €</span>
    </p>

    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
     ${data.options ? getOptions(data.options, `short`) : ``}
    </ul>

    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>
`;
