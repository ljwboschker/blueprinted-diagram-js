import DirectEditingModule from 'diagram-js-direct-editing';
import DirectEditingProvider from './direct-editing-provider';

export default {
  __depends__: [
    DirectEditingModule
  ],
  __init__: [
    'directEditingProvider'
  ],
  directEditingProvider: ['type', DirectEditingProvider]
};
