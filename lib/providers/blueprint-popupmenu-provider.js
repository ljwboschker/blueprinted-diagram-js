import { PopupMenu } from './popup-menu';

export default class BlueprintPopupMenuProvider {
  constructor(popupMenu, blueprint, eventBus, selection) {
    this._blueprint = blueprint;
    this._eventBus = eventBus;
    this._selection = selection;
    this._popupMenu = popupMenu;

    this.register();
  }

  register() {
    if (!this._blueprint) return;

    this._blueprint.popups?.forEach((popup) => {
      const menu = new PopupMenu(popup.name, this._blueprint, (name, element) => this._action(name, element));
      this._popupMenu.registerProvider(`blueprint-popupmenu-${popup.name}`, menu);
    });
  }

  _action(action, element) {
    this._selection.deselect(element);
    this._eventBus.fire('contextaction.click', { action, element });
  }
}

BlueprintPopupMenuProvider.$inject = ['popupMenu', 'blueprint', 'eventBus', 'selection'];
