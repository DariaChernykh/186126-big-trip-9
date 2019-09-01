import Card from "../components/card";
import {getTime} from "../utils";
import CardEdit from "../components/card-edit";

export class TripController {
  constructor(container, points) {
    this._container = container;
    this._points = points;
  }

  _renderPoints(parent, arr) {
    arr.forEach((value) => {
      const cardComponent = new Card(value, getTime(value));
      const cardEditComponent = new CardEdit(value, getTime(value));

      cardComponent.onEdit(() => {
        cardEditComponent.render();
        parent.replaceChild(cardEditComponent.getElement(), cardComponent.getElement());
        cardComponent.unrender();
      });

      cardEditComponent.onEdit(() => {
        cardComponent.render();
        parent.replaceChild(cardComponent.getElement(), cardEditComponent.getElement());
        cardEditComponent.unrender();
      });

      parent.appendChild(cardComponent.render());
    });
  }

  init() {
    this._renderPoints(this._container, this._points);
  }
}
