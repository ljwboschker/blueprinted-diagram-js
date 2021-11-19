import inherits from 'inherits';

import KeyboardBindings from 'diagram-js/lib/features/keyboard/KeyboardBindings';
import {
    isCmd,
    isKey,
    isShift
} from 'diagram-js/lib/features/keyboard/KeyboardUtil';

export default function AppKeyboardBindings(injector) {
    injector.invoke(KeyboardBindings, this);
}

inherits(AppKeyboardBindings, KeyboardBindings);

AppKeyboardBindings.$inject = ['injector'];

AppKeyboardBindings.prototype.registerBindings = (keyboard, editorActions) => {
    /**
     * Add keyboard binding if respective editor action is registered.
     */
    function addListener(action, fn) {
        if (editorActions.isRegistered(action)) {
            keyboard.addListener(fn);
        }
    }

    // activate lasso (Select items) tool
    // S
    addListener('lassoTool', context => {
        const event = context.keyEvent;
        if (keyboard.hasModifier(event)) {
            return;
        }

        if (keyboard.isKey(['s', 'S'], event)) {
            editorActions.trigger('lassoTool');
            return true;
        }
    });

    // undo
    // (CTRL|CMD) + Z
    addListener('undo', context => {
        const event = context.keyEvent;
        if (isCmd(event) && !isShift(event) && isKey(['z', 'Z'], event)) {
            editorActions.trigger('undo');
            return true;
        }
    });

    // redo
    // CTRL + Y
    // CMD + SHIFT + Z
    addListener('redo', context => {
        const event = context.keyEvent;
        if (
            isCmd(event) &&
            (isKey(['y', 'Y'], event) ||
                (isKey(['z', 'Z'], event) && isShift(event)))
        ) {
            editorActions.trigger('redo');
            return true;
        }
    });

    // delete selected element
    // DEL
    addListener('removeSelection', context => {
        const event = context.keyEvent;
        if (isKey(['Delete', 'Del'], event)) {
            editorActions.trigger('removeSelection');
            return true;
        }
    });
};
