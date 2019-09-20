import moment from "moment";

// const transfer = [`bus`, `drive`, `flight`, `ship`, `taxi`, `train`, `transport`];
// const checkType = (type) => transfer.findIndex((elem) => elem === type) >= 0 ? `transfer` : `activity`;
// const createOption = (arr) => {
//   arr.forEach(value => value[`key`] = value.title.toLowerCase().replace(/ /g, `-`));
//   return arr;
// };

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
    // console.log(this.options);
    this.isFavorite = data.is_favorite;
    this.dateFrom = data.date_from;
    this.dateTo = data.date_to;
    this.duration = data.date_to - data.date_from;
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
        description: this.description,
        name: this.city,
        pictures: this.photos
      },
      is_favorite: this.isFavorite,
      offers: this.options
        .reduce((prev, offerItem) => {
          if (!prev.includes(offerItem.type)) {
            prev.push(offerItem.type);
          }
          return prev;
        }, [])
        .reduce((prev, offerType) => {
          const filteredOffers = this.options.filter((offer) => offer.type === offerType);
          prev.push({
            type: offerType,
            offers: filteredOffers.map((offerIt) => {
              return {
                name: offerIt.name,
                price: offerIt.price
              };
            })
          });
          return prev;
        }, []),
      type: this.typeName.toLowerCase()
    };
  }

  static toRAW(data) {
    return {
      id: data.id,
      base_price: data.price,
      date_from: moment(data.dateFrom).format(`YYYY-MM-DDTHH:mm:ss.sssZZ`),
      date_to: moment(data.dateTo).format(`YYYY-MM-DDTHH:mm:ss.sssZZ`),
      destination: {
        description: data.description,
        name: data.place.name,
        pictures: data.photos
      },
      is_favorite: data.isFavorite,
      offers: data.offers,
      type: data.type.name.toLowerCase()
    };
  }
};
