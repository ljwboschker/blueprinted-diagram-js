import SpaceToolModule from 'diagram-js/lib/features/space-tool';

import BlueprintedSpaceTool from './blueprinted-space-tool';

export default {
  __depends__: [SpaceToolModule],
  spaceTool: ['type', BlueprintedSpaceTool]
};
