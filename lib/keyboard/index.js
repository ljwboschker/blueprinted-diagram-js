import KeyboardModule from 'diagram-js/lib/features/keyboard';

import AppKeyboardBindings from './app-keyboard-bindings';

export default {
  __depends__: [
    KeyboardModule
  ],
  __init__: ['keyboardBindings'],
  keyboardBindings: ['type', AppKeyboardBindings]
};
