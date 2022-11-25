import { LabelEditor } from './label-editor';
import { EmbeddedTextEditor } from './embedded-text-editor';

export default class DirectEditingProvider {
  constructor(
    eventBus,
    canvas,
    directEditing,
    modeling
  ) {
    this._eventBus = eventBus;
    this._canvas = canvas;
    this._modeling = modeling;

    directEditing.registerProvider(this);

    eventBus.on('element.dblclick', (event) => {
      directEditing.activate(event.element);
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

      directEditing.activate(element);
    });

    eventBus.on('autoPlace.end', 500, (event) => {
      directEditing.activate(event.shape);
    });
  }

  activate(element) {
    const editor = this._getEditor(element);
    return editor.activate(element);
  }

  _getEditor(element) {
    return element.style === 'label'
      ? new LabelEditor(this._canvas, this._eventBus, this._modeling)
      : new EmbeddedTextEditor(this._canvas, this._eventBus, this._modeling);
  }

  update(element, newText, oldText) {
    const editor = this._getEditor(element);
    editor.update(element, newText, oldText);
  }
}

DirectEditingProvider.$inject = [
  'eventBus',
  'canvas',
  'directEditing',
  'modeling'
];
