import { LabelEditor } from './label-editing/label-editor';
import { EmbeddedTextEditor } from './embedded-text-editing/embedded-text-editor';

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

    this._originalEvent = undefined;

    directEditing.registerProvider(this);

    eventBus.on('element.dblclick', (event) => {
      this._originalEvent = event.originalEvent;
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

    eventBus.on(['element.refreshing', 'shape.removed', 'connection.removed'], () => {
      if (directEditing.isActive()) {
        directEditing.close();
      }
    });

    eventBus.on(['create.end', 'connect.end'], 500, (event) => {
      const { noEdit, canExecute, isTouch } = event.context;

      if (noEdit) {
        return;
      }

      if (isTouch) {
        // Direct editing won't work on mobile devices
        return;
      }

      if (!canExecute) {
        return;
      }

      const element = event.context.connection && event.context.connection.labels.length > 0
        ? event.context.connection.labels[0]
        : event.shape;

      directEditing.activate(element);
    });

    eventBus.on('autoPlace.end', 500, (event) => {
      directEditing.activate(event.shape);
    });

    eventBus.on('directEditing.deactivate', () => {
      this._originalEvent = undefined;
    });
  }

  activate(element) {
    const editor = this._getEditor(element);
    return editor?.activate(element, this._originalEvent);
  }

  update(element, newText, oldText) {
    const editor = this._getEditor(element);
    editor.update(element, newText, oldText);
  }

  _getEditor(element) {
    if (element.type === 'label') {
      return new LabelEditor(this._canvas, this._eventBus, this._modeling);
    }

    if (element.type === 'shape') {
      if (element.embeddedText && element.embeddedText.length > 0) {
        return new EmbeddedTextEditor(this._canvas, this._eventBus, this._modeling);
      }

      if (element.labels && element.labels.length > 0) {
        return new LabelEditor(this._canvas, this._eventBus, this._modeling);
      }
    }

    return undefined;
  }
}

DirectEditingProvider.$inject = [
  'eventBus',
  'canvas',
  'directEditing',
  'modeling'
];
