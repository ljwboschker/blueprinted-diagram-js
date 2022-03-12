import { createDiagramEvent } from '../create-diagram-event';

export class PopupMenu {
  constructor(popupName, blueprint, action) {
    this._popupName = popupName;
    this._blueprint = blueprint;
    this._action = action;
  }

  getEntries(element) {
    const popup = this._blueprint.popups?.find((p) => p.name === this._popupName);
    if (!popup) throw new Error(`Blueprint does not contain a popup definition for ${this._popupName}`);

    const items = popup.items(createDiagramEvent(element));
    return items.map((item) => ({
      id: item.name,
      label: item.title,
      className: item.className,
      action: () => this._action(item.name, element)
    }));
  }
}
