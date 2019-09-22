import Card from "../components/card";
import CardEdit from "../components/card-edit";
import ModelPoint from "../model-task";

export default class PointController {
  constructor(container, point, offers, places, api, onDataChange, onChangeView) {
    this._container = container;
    this._point = point;
    this._offers = offers;
    this._places = places;
    this._api = api;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._taskComponent = new Card(this._point, this._offers);
    this._editTaskComponent = new CardEdit(this._point, this._container, this._offers, this._places);
    this.init();
  }

  init() {
    const parent = this._container;
    const pointComponent = this._taskComponent;
    const pointEditComponent = this._editTaskComponent;

    pointComponent.onEdit(() => {
      pointEditComponent.render();
      parent.replaceChild(pointEditComponent.getElement(), pointComponent.getElement());
      pointComponent.unrender();
    });

    pointEditComponent.onEscape(() => {
      pointComponent.render();
      parent.replaceChild(pointComponent.getElement(), pointEditComponent.getElement());
      pointEditComponent.unrender();
    });

    pointEditComponent.onDelete(() => {
      this._onDataChange(null, this._point);
      pointEditComponent.unbind();
    });

    pointEditComponent.onSubmit(() => {
      const formData = new FormData(pointEditComponent.getElement().querySelector(`.event--edit`));
      const getFormOptions = () => {
        const options = pointEditComponent.getElement().querySelectorAll(`.event__offer-selector`);


        pointEditComponent._options = [];
        [...options].forEach((option, index) => {
          const accepted = option.querySelector(`.event__offer-checkbox`).checked;
          pointEditComponent._options.push({
            title: pointEditComponent._avalibleOffers.offers[index].name,
            price: pointEditComponent._avalibleOffers.offers[index].price,
            accepted
          });
        });
        return pointEditComponent._options;
      };

      const dateFrom = new Date(formData.get(`event-start-time`));
      const dateTo = new Date(formData.get(`event-end-time`));
      const entry = {
        id: pointEditComponent._id,
        type: pointEditComponent._type,
        price: parseInt(formData.get(`event-price`) ? formData.get(`event-price`) : 0, 10),
        options: getFormOptions(),
        isFavorite: !!formData.get(`event-favorite`),
        dateFrom,
        dateTo,
        duration: dateTo.getTime() - dateFrom.getTime(),
        destination: {
          name: formData.get(`event-destination`),
          pictures: pointEditComponent._destination.pictures,
          description: pointEditComponent._destination.description
        },
      };
      this._onDataChange(new ModelPoint(ModelPoint.toRAW(entry)), this._point);
      pointEditComponent.unbind();
    });

    parent.appendChild(pointComponent.render());
  }
}
