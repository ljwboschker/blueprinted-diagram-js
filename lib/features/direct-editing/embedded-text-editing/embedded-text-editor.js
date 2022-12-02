export class EmbeddedTextEditor {
  constructor(canvas, eventBus, modeling) {
    this._canvas = canvas;
    this._eventBus = eventBus;
    this._modeling = modeling;
  }

  activate(element, event) {
    const { embeddedText } = element;
    if (!embeddedText || embeddedText.length === 0) return undefined;

    // Figure out on which embedded text line the user clicked
    let line;
    if (event) {
      const position = this._getRelativePosition(event, element);
      line = [...embeddedText].reverse().find((ln) => position.y > ln.offset.y) || embeddedText[0];
    } else {
      // eslint-disable-next-line prefer-destructuring
      line = embeddedText[0];
    }

    const zoom = this._canvas.zoom();
    const fontSize = `${line.textOptions.style.fontSize * zoom}px`;

    const context = {
      text: line.content,
      bounds: this._getEditingBox(element, zoom, line),
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

  _getRelativePosition(position, element) {
    const viewbox = this._canvas.viewbox();

    const clientRect = this._canvas._container.getBoundingClientRect();

    const canvasPosition = {
      x: viewbox.x + (position.x - clientRect.left) / viewbox.scale,
      y: viewbox.y + (position.y - clientRect.top) / viewbox.scale
    };

    return {
      x: canvasPosition.x - element.x,
      y: canvasPosition.y - element.y
    };
  }

  _getEditingBox(element, zoom, line) {
    const offset = {
      x: this._canvas._cachedViewbox.x,
      y: this._canvas._cachedViewbox.y
    };

    const x = {
      location: element.x * zoom,
      offset: offset.x * zoom
    };
    const y = {
      location: element.y * zoom,
      offset: offset.y * zoom
    };
    const boxWidth = (element.width - (line.textOptions.padding?.left || 0) - (line.textOptions.padding?.right || 0)) * zoom;

    return {
      x: x.location - x.offset + (line.textOptions.padding?.left || 0) * zoom,
      y: y.location - y.offset + (line.offset.y || 0) * zoom,
      width: boxWidth
    };
  }

  update(element, newText, oldText) {
    this._modeling.updateEmbeddedText(element, newText, oldText);
  }
}
