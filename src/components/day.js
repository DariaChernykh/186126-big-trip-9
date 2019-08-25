export const getDay = (count, day) => `
<li class="trip-days__item  day">
  <div class="day__info">
    <span class="day__counter">${count}</span>
    <time class="day__date" datetime="${day.getFullYear()}-${day.getMonth()}-${day.getDate()}">${day.getMonth()} ${day.getDate()}</time>
  </div>

  <ul class="trip-events__list"></ul>
</li>
`;
