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
            if (value[0] === nameOption && option.checked) {
              value[1].available = true;
            }
            if (value[0] === nameOption && !option.checked) {
              value[1].available = false;
            }
          });
        });
        return pointEditComponent._options;
      };

      const getDescription = () => pointEditComponent._description = pointEditComponent.getElement().querySelector(`.event__destination-description`).innerText;
      const dateFrom = new Date(formData.get(`event-start-time`));
      const dateTo = new Date(formData.get(`event-end-time`));
      const entry = {
        type: {
          key: pointEditComponent._type,
          name: pointEditComponent._typeName,
        },
        city: formData.get(`event-destination`),
        price: parseInt(formData.get(`event-price`), 10),
        description: getDescription(),
        options: getOptions(),
        dateFrom,
        dateTo,
        duration: dateTo.getTime() - dateFrom.getTime(),
        activity: pointEditComponent._activity,
        transfer: pointEditComponent._transfer,
        cities: pointEditComponent._cities,
        photos: pointEditComponent._photos,
      };
      this._onDataChange(entry, this._point);
      pointEditComponent.unbind();
    });

    parent.appendChild(pointComponent.render());
  }
}
