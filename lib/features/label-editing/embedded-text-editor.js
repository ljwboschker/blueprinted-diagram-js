import { findBlueprint } from '../../utils/find-utils';

export class EmbeddedTextEditor {
  constructor(canvas, eventBus, modeling, blueprint) {
    this._canvas = canvas;
    this._eventBus = eventBus;
    this._modeling = modeling;
    this._blueprint = blueprint;
  }

  activate(element) {
    const blueprintElement = findBlueprint(this._blueprint, element);
    if (!blueprintElement) return undefined;

    const { embeddedText } = blueprintElement.shape;
    if (!embeddedText) {
      return undefined;
    }

    const content = embeddedText.content(element.data);

    const zoom = this._canvas.zoom();
    const fontSize = `${embeddedText.textOptions.style.fontSize * zoom}px`;

    const context = {
      text: content,
      bounds: this._getEditingBox(element, zoom, embeddedText.textOptions.padding),
      style: {
        fontSize,
        textAlign: embeddedText.textOptions.align || 'center'
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

  update(element, newText) {
    this._modeling.updateEmbeddedText(element, newText);
  }
}
