const returnDate = (start, end) => {
  const MONTHS = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`,
    `September`, `October`, `November`, `December`];
  return `${MONTHS[new Date(start).getMonth()]} ${new Date(start).getDate()}&nbsp;&mdash;&nbsp;${new Date(end).getDate()}`;
};

export const getInformation = (points) => {
  return `
    <div class="trip-info__main">
      <h1 class="trip-info__title">${points[0]._city} &mdash; ... &mdash; ${points[points.length - 1]._city}</h1>
    
      <p class="trip-info__dates">${returnDate(points[0].dateFrom, points[points.length - 1].dateFrom)}</p>
    </div>
  `;
};
