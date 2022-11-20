export class EmbeddedTextEditor {
  constructor(canvas, eventBus, modeling) {
    this._canvas = canvas;
    this._eventBus = eventBus;
    this._modeling = modeling;
  }

  activate(element) {
    const { embeddedText } = element;
    if (!embeddedText || embeddedText.length === 0) return undefined;

    // TODO: what to edit?
    const line = embeddedText[0];

    const zoom = this._canvas.zoom();
    const fontSize = `${line.textOptions.style.fontSize * zoom}px`;

    const context = {
      text: line.content,
      bounds: this._getEditingBox(element, zoom, line.textOptions.padding),
      style: {
        fontSize,
        textAlign: line.textOptions.align || 'center'
      },
      options: {
        autoResize: true
      }
    };

    return context;
  }

  _getEditingBox(element, zoom, padding) {
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
    const boxWidth = element.width * zoom;

    return {
      x: x.location - x.offset + ((padding?.left || 0) * zoom),
      y: y.location - y.offset + ((padding?.top || 0) * zoom),
      width: boxWidth
    };
  }

  update(element, newText, oldText) {
    this._modeling.updateEmbeddedText(element, newText, oldText);
  }
}
