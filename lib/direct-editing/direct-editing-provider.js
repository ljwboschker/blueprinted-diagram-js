import { LabelEditor } from './label-editor';

export default function DirectEditingProvider(
    eventBus,
    canvas,
    directEditing
) {
    this._eventBus = eventBus;
    this._canvas = canvas;

    directEditing.registerProvider(this);

    this.getEditor = (element) => new LabelEditor(this._canvas, this._eventBus);

    // listen to dblclick on non-root elements
    eventBus.on('element.dblclick', event => {
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
        _ => {
            if (directEditing.isActive()) {
                directEditing.complete();
            }
        }
    );

    // cancel on command stack changes
    eventBus.on(['commandStack.changed'], _ => {
        if (directEditing.isActive()) {
            directEditing.cancel();
        }
    });

    eventBus.on('create.end', 500, event => {
        const element = event.shape;
        const canExecute = event.context.canExecute;
        const isTouch = event.isTouch;

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
    'directEditing'
];

DirectEditingProvider.prototype.activate = function(element) {
    const editor = this.getEditor(element);
    return editor.activate(element);
};

DirectEditingProvider.prototype.update = function(element, newLabel, oldText) {
    const editor = this.getEditor(element);
    return editor.update(element, newLabel, oldText);
};
