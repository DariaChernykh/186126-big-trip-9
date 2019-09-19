import Card from "../components/card";
import CardEdit from "../components/card-edit";

export default class PointController {
  constructor(container, point, onDataChange, onChangeView) {
    this._container = container;
    this._point = point;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._taskComponent = new Card(this._point);
    this._editTaskComponent = new CardEdit(this._point, this._container);
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
      const getOptions = () => {
        const options = pointEditComponent.getElement().querySelectorAll(`.event__offer-checkbox`);


        [...options].forEach((option) => {
          const nameOption = option.name.slice(12);
          pointEditComponent._options.forEach((value) => {
            if (value.key === nameOption && option.checked) {
              value.accepted = true;
            }
            if (value.key === nameOption && !option.checked) {
              value.accepted = false;
            }
          });
        });
        return pointEditComponent._options;
      };

      const dateFrom = new Date(formData.get(`event-start-time`));
      const dateTo = new Date(formData.get(`event-end-time`));
      const entry = {
        _type: pointEditComponent._type,
        _typeName: pointEditComponent._typeName,
        _city: formData.get(`event-destination`),
        _price: parseInt(formData.get(`event-price`), 10),
        _description: pointEditComponent.getElement().querySelector(`.event__destination-description`).innerText,
        _options: getOptions(),
        _isFavorite: formData.get(`event-favorite`),
        _dateFrom: dateFrom,
        _dateTo: dateTo,
        _duration: dateTo.getTime() - dateFrom.getTime(),
        _photos: pointEditComponent._photos,
      };
      this._onDataChange(entry, this._point);
      pointEditComponent.unbind();
    });

    parent.appendChild(pointComponent.render());
  }
}
