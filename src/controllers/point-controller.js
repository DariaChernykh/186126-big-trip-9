import Card from "../components/card";
import CardEdit from "../components/card-edit";
import ModelPoint from "../model-task";
import moment from "moment";

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

  setDefaultView() {
    if (this._container.contains(this._editTaskComponent.getElement())) {
      this._taskComponent.render();
      this._container.replaceChild(this._taskComponent.getElement(), this._editTaskComponent.getElement());
      this._editTaskComponent.unrender();
    }
  }

  _commonBlocking(type) {
    const inputs = this._editTaskComponent.getElement().querySelectorAll(`input`);
    const saveBtn = this._editTaskComponent.getElement().querySelector(`.event__save-btn`);
    const deleteBtn = this._editTaskComponent.getElement().querySelector(`.event__reset-btn`);

    inputs.forEach((input) => {
      input.disabled = true;
    });
    saveBtn.disabled = true;
    deleteBtn.disabled = true;
    if (type === `save`) {
      saveBtn.textContent = `Saving...`;
    } else {
      deleteBtn.textContent = `Deleting...`;
    }
  }

  _commonUnBlocking(type) {
    const inputs = this._editTaskComponent.getElement().querySelectorAll(`input`);
    const saveBtn = this._editTaskComponent.getElement().querySelector(`.event__save-btn`);
    const deleteBtn = this._editTaskComponent.getElement().querySelector(`.event__reset-btn`);

    inputs.forEach((input) => {
      input.disabled = false;
    });
    saveBtn.disabled = false;
    deleteBtn.disabled = false;
    if (type === `save`) {
      saveBtn.textContent = `Save`;
    } else {
      deleteBtn.textContent = `Delete`;
    }
  }

  init() {
    const parent = this._container;
    const pointComponent = this._taskComponent;
    const pointEditComponent = this._editTaskComponent;

    pointComponent.onEdit(() => {
      this._onChangeView();
      pointEditComponent.render();
      parent.replaceChild(pointEditComponent.getElement(), pointComponent.getElement());
      pointComponent.unrender();
    });

    pointEditComponent.onEscape(() => {
      pointComponent.render();
      parent.replaceChild(pointComponent.getElement(), pointEditComponent.getElement());
      pointEditComponent.unrender();
    });

    const checkDelete = (isSuccess) => {
      return new Promise((res, rej) => {
        setTimeout(isSuccess ? res : rej, 1500);
      });
    };

    pointEditComponent.onDelete(() => {
      const form = pointEditComponent.getElement().querySelector(`.event--edit`);
      form.style = `border: none`;
      this._commonBlocking(`delete`);

      checkDelete(true)
        .then(() => {
          this._commonUnBlocking(`delete`);
          this._onDataChange(null, this._point);
          pointEditComponent.unbind();
        })
        .catch(() => {
          pointEditComponent.shake();
          form.style = `border: 2px solid red`;
          this._commonUnBlocking(`delete`);
        });
    });

    const load = (isSuccess) => {
      return new Promise((res, rej) => {
        setTimeout(isSuccess ? res : rej, 1500);
      });
    };

    pointEditComponent.onSubmit(() => {
      const form = pointEditComponent.getElement().querySelector(`.event--edit`);
      form.style = `border: none`;
      const formData = new FormData(form);
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

      const dateFrom = moment(formData.get(`event-start-time`).slice(0, 16));
      const dateTo = moment(formData.get(`event-start-time`).slice(19));
      const entry = {
        id: pointEditComponent._id,
        type: pointEditComponent._type,
        price: parseInt(formData.get(`event-price`) ? formData.get(`event-price`) : 0, 10),
        options: getFormOptions(),
        isFavorite: !!formData.get(`event-favorite`),
        dateFrom: dateFrom.format(),
        dateTo: dateTo.format(),
        duration: dateTo.millisecond() - dateFrom.millisecond(),
        destination: {
          name: formData.get(`event-destination`),
          pictures: pointEditComponent._destination.pictures,
          description: pointEditComponent._destination.description
        },
      };

      this._commonBlocking(`save`);

      load(true)
        .then(() => {
          this._commonUnBlocking(`save`);
          this._onDataChange(new ModelPoint(ModelPoint.toRAW(entry)), this._point);
          pointEditComponent.unbind();
        })
        .catch(() => {
          pointEditComponent.shake();
          form.style = `border: 2px solid red`;
          this._commonUnBlocking(`save`);
        });
    });

    parent.appendChild(pointComponent.render());
  }
}
