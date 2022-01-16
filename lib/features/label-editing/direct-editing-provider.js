import { LabelEditor } from './label-editor';

export default function DirectEditingProvider(
  eventBus,
  canvas,
  directEditing,
  modeling
) {
  this._eventBus = eventBus;
  this._canvas = canvas;
  this._modeling = modeling;

  directEditing.registerProvider(this);

  this.getEditor = () => new LabelEditor(this._canvas, this._eventBus, this._modeling);

  // listen to dblclick on non-root elements
  eventBus.on('element.dblclick', (event) => {
    activateDirectEdit(event.element);
  });

  // complete on followup canvas operation
  eventBus.on(
    [
      'element.mousedown',
      'drag.init',
      'canvas.viewbox.changing',
      'autoPlace',
      'popupMenu.open'
    ],
    () => {
      if (directEditing.isActive()) {
        directEditing.complete();
      }
    }
  );

  // cancel on command stack changes
  eventBus.on(['commandStack.changed'], () => {
    if (directEditing.isActive()) {
      directEditing.cancel();
    }
  });

  eventBus.on('create.end', 500, (event) => {
    const element = event.shape;
    const { canExecute, isTouch } = event.context;

    if (isTouch) {
      // Direct editing won't work on mobile devices
      return;
    }

    if (!canExecute) {
      return;
    }

    activateDirectEdit(element);
  });

  eventBus.on('autoPlace.end', 500, (event) => {
    activateDirectEdit(event.shape);
  });

  function activateDirectEdit(element) {
    directEditing.activate(element);
  }
}

DirectEditingProvider.$inject = [
  'eventBus',
  'canvas',
  'directEditing',
  'modeling'
];

DirectEditingProvider.prototype.activate = function activate(element) {
  const editor = this.getEditor(element);
  return editor.activate(element);
};

DirectEditingProvider.prototype.update = function activate(element, newLabel, oldText) {
  const editor = this.getEditor(element);
  return editor.update(element, newLabel, oldText);
};
