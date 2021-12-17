import TextUtil from 'diagram-js/lib/util/Text';

export class LabelEditor {

    _canvas;
    _eventBus;

    constructor(canvas, eventBus) {
        this._canvas = canvas;
        this._eventBus = eventBus;
    }

    getLabel = (element) => element.type === 'label' ? element : null;

    activate = (element) => {
        const label = this.getLabel(element);
        if (!label) {
            return;
        }

        const zoom = this._canvas.zoom();
        const content = label.content;
        const fontSize = `${label.textOptions.style.fontSize * zoom}px`;

        const context = {
            text: content,
            bounds: this._getEditingBox(label, zoom),
            style: {
                fontSize,
                textAlign: label.textOptions.align ? label.textOptions.align.split('-')[0] : 'center'
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
            x: (x.width - boxWidth) / 2 + x.location - x.offset,
            y: y.location - y.offset,
            width: boxWidth,
            height: element.height * zoom + 10
        };
    }

    update = (element, newLabel, oldText) => {
        const label = this.getLabel(element);

        label.content = newLabel;

        const text = new TextUtil();

        const oldDimensions = text.getDimensions(oldText, label.textOptions);
        const newDimensions = text.getDimensions(newLabel, label.textOptions);

        label.width = newDimensions.width;
        label.height = newDimensions.height;

        label.x = label.x + (oldDimensions.width - newDimensions.width) / 2;

        this._eventBus.fire('element.changed', { element: label });
        this._eventBus.fire('element.changed', { element: label.labelTarget });
    }
}
