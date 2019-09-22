import AbstractComponent from "./abstract-component";

const returnDate = (start, end) => {
  const MONTHS = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`,
    `September`, `October`, `November`, `December`];
  return `${MONTHS[new Date(start).getMonth()]} ${new Date(start).getDate()}&nbsp;&mdash;&nbsp;${new Date(end).getDate()}`;
};

export default class Information extends AbstractComponent {
  constructor(points) {
    super();
    this.points = points.slice().sort((a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime());
  }
  getTemplate() {
    return `
    <div class="trip-info__main">
      <h1 class="trip-info__title">${this.points[0].destination.name} &mdash; ... &mdash; ${this.points[this.points.length - 1].destination.name}</h1>
    
      <p class="trip-info__dates">${returnDate(this.points[0].dateFrom, this.points[this.points.length - 1].dateTo)}</p>
    </div>
  `.trim();
  }
  update(points) {
    this.points = points.slice().sort((a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime());
  }
}
