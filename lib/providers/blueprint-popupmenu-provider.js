import PopupMenuProvider from 'diagram-js/lib/features/popup-menu/PopupMenuProvider';
import { PopupMenu } from './popup-menu';

export default class BlueprintPopupMenuProvider extends PopupMenuProvider {
  constructor(popupMenu, blueprint, eventBus, selection) {
    super(popupMenu);
    this._blueprint = blueprint;
    this._eventBus = eventBus;
    this._selection = selection;

    // Call register manually after the blueprint and eventbus are set.
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
