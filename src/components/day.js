import {getRandomInt} from "../data";
const MS_IN_WEEK = 7 * 24 * 60 * 60 * 1000;

const generateDate = () => new Date(getRandomInt(Date.now() - MS_IN_WEEK, Date.now() + MS_IN_WEEK));

export const getDay = (count) => `
<li class="trip-days__item  day">
  <div class="day__info">
    <span class="day__counter">${count}</span>
    <time class="day__date" datetime="2019-03-18">${generateDate().getMonth()} ${generateDate().getDate()}</time>
  </div>

  <ul class="trip-events__list"></ul>
</li>
`;
