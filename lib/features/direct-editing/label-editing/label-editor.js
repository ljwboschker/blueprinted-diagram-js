export class LabelEditor {
  constructor(canvas, eventBus, modeling) {
    this._canvas = canvas;
    this._eventBus = eventBus;
    this._modeling = modeling;
  }

  activate(element) {
    if (element.type !== 'label' && (!element.labels || !element.labels.length)) {
      return undefined;
    }

    const target = element.type === 'label' ? element : element.labels[0];

    const zoom = this._canvas.zoom();
    const { content } = target;
    const fontSize = `${target.textOptions.style.fontSize * zoom}px`;

    const context = {
      text: content,
      bounds: this._getEditingBox(target, zoom),
      style: {
        fontSize,
        textAlign: target.textOptions.align ? target.textOptions.align.split('-')[0] : 'center'
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
    const target = element.type === 'label' ? element : element.labels[0];
    this._modeling.updateLabel(target, newText);
  }
}
