const transfer = [`bus`, `drive`, `flight`, `ship`, `taxi`, `train`, `transport`];
const checkType = (type) => transfer.findIndex((elem) => elem === type) >= 0 ? `transfer` : `activity`;
const createOption = (arr) => {
  arr.forEach(value => value[`key`] = value.title.toLowerCase().replace(/ /g, `-`));
  return arr;
};

export default class ModelPoint {
  constructor(data) {
    this.id = data.id;
    this._type = checkType(data.type);
    this._typeName = data.type;
    this._price = data.base_price;
    this._options = data.options;
    this._city = data.destination.name;
    this._options = createOption(data.offers);
    this._photos = data.destination.pictures;
    this._description = data.destination.description;
    this._isFavorite = data.is_favorite;
    this._dateFrom = data.date_from;
    this._dateTo = data.date_to;
    this._duration = data.date_to - data.date_from;
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }
};
