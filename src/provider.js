import ModelPoint from './model-point';

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  _isOnline() {
    return window.navigator.onLine;
  }

  static objectToArray(object) {
    return Object.keys(object).map((id) => object[id]);
  }

  getDestinations() {
    return this._api.getDestinations();
  }

  getOffers() {
    return this._api.getOffers();
  }

  getPoints() {
    if (this._isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          points.map((it) => this._store.setItem(it.id, it.toRAW()));
          return points;
        });
    } else {
      const rawPointsMap = this._store.getAll();
      const rawPoints = Provider.objectToArray(rawPointsMap);
      const points = ModelPoint.parsePoints(rawPoints);

      return Promise.resolve(points);
    }
  }

  createPoint({data}) {
    if (this._isOnline()) {
      return this._api.createPoint({point: data})
        .then((point) => {
          this._store.setItem(point.id, point.toRAW());
          return point;
        });
    } else {
      this._id = data.id;
      this._needSync = true;

      this._store.setItem(data.id, data);
      return Promise.resolve(ModelPoint.parsePoint(data));
    }
  }


  updatePoint({id, data}) {
    if (this._isOnline()) {
      return this._api.updatePoint({id, data})
        .then((point) => {
          this._store.setItem(point.id, point.toRAW());
          return point;
        });
    } else {
      const point = data;
      this._needSync = true;
      this._store.setItem(point.id, point);
      return Promise.resolve(ModelPoint.parsePoint(point));
    }
  }

  deletePoint({id}) {
    if (this._isOnline()) {
      return this._api.deletePoint({id})
        .then(() => {
          this._store.removeItem(id);
        });
    } else {
      this._needSync = true;
      this._store.removeItem(id);
      return Promise.resolve(true);
    }
  }

  syncPoints() {
    return this._api.syncPoints({points: Provider.objectToArray(this._store.getAll())});
  }

}
