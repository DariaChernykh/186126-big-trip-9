import moment from "moment";

export default class ModelPoint {
  constructor(data) {
    this.id = data.id;
    this.type = data.type;
    this.price = data.base_price;
    this.destination = {
      name: data.destination.name,
      pictures: data.destination.pictures,
      description: data.destination.description
    };
    this.options = data.offers;
    this.isFavorite = data.is_favorite;
    this.dateFrom = data.date_from;
    this.dateTo = data.date_to;
    this.duration = new Date(data.date_to).getTime() - new Date(data.date_from).getTime();
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }

  toRAW() {
    return {
      id: this.id,
      base_price: this.price,
      date_from: moment(this.dateFrom).format(`YYYY-MM-DDTHH:mm:ss.sssZZ`),
      date_to: moment(this.dateTo).format(`YYYY-MM-DDTHH:mm:ss.sssZZ`),
      destination: {
        description: this.destination.description,
        name: this.destination.name,
        pictures: this.destination.pictures
      },
      is_favorite: this.isFavorite,
      offers: this.options,
      type: this.type
    };
  }

  static toRAW(data) {
    return {
      id: `${data.id}`,
      base_price: data.price,
      date_from: moment(data.dateFrom).format(`YYYY-MM-DDTHH:mm:ss.sssZZ`),
      date_to: moment(data.dateTo).format(`YYYY-MM-DDTHH:mm:ss.sssZZ`),
      destination: {
        description: data.destination.description,
        name: data.destination.name,
        pictures: data.destination.pictures,
      },
      is_favorite: data.isFavorite,
      offers: data.options,
      type: data.type
    };
  }
}
