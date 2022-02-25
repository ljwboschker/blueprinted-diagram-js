export class LabelEditor {
  constructor(canvas, eventBus, modeling) {
    this._canvas = canvas;
    this._eventBus = eventBus;
    this._modeling = modeling;
  }

  getLabel(element) {
    return element.type === 'label' ? element : null;
  }

  activate(element) {
    if (element.type !== 'label') {
      return undefined;
    }

    const zoom = this._canvas.zoom();
    const { content } = element;
    const fontSize = `${element.textOptions.style.fontSize * zoom}px`;

    const context = {
      text: content,
      bounds: this._getEditingBox(element, zoom),
      style: {
        fontSize,
        textAlign: element.textOptions.align ? element.textOptions.align.split('-')[0] : 'center'
      },
      options: {
        autoResize: true
      }
    };

    return context;
  }

  _getEditingBox(element, zoom) {
    const offset = {
      x: this._canvas._cachedViewbox.x,
      y: this._canvas._cachedViewbox.y
    };

    const x = {
      width: element.width * zoom,
      location: element.x * zoom,
      offset: offset.x * zoom
    };
    const y = {
      location: element.y * zoom,
      offset: offset.y * zoom
    };
    const boxWidth = element.textOptions.box.width * zoom;

    return {
      x: x.location - x.offset,
      y: y.location - y.offset,
      width: boxWidth,
      height: element.height * zoom + 10
    };
  }

  update(element, newText) {
    this._modeling.updateLabel(element, newText);
  }
}
