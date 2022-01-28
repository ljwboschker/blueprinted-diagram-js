import AutoResize from 'diagram-js/lib/features/auto-resize/AutoResize';
import BlueprintAutoResizeProvider from './blueprint-auto-resize.provider';

export default {
  __init__: [
    'autoResize',
    'blueprintAutoResizeProvider'
  ],
  autoResize: ['type', AutoResize],
  blueprintAutoResizeProvider: ['type', BlueprintAutoResizeProvider],
};
