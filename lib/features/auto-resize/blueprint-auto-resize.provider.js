import AutoResizeProvider from 'diagram-js/lib/features/auto-resize/AutoResizeProvider';
import { findBlueprint } from '../../utils/find-utils';

export default class BlueprintAutoResizeProvider extends AutoResizeProvider {
  constructor(eventBus, blueprint) {
    super(eventBus);
    this._blueprint = blueprint;
  }

  canResize(elements, target) {
    if (elements.every((e) => e.type === 'shape')) {
      const blueprint = findBlueprint(this._blueprint, target);
      return blueprint?.rules.resizable || false;
    }

    return false;
  }
}

BlueprintAutoResizeProvider.$inject = [
  'eventBus',
  'blueprint'
];
