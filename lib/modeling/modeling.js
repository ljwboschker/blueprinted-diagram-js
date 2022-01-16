import BaseModeling from 'diagram-js/lib/features/modeling/Modeling';
import UpdateLabelHandler from '../features/label-editing/cmd/UpdateLabelHandler';
import { findBlueprint } from '../utils/find-utils';

export default class Modeling extends BaseModeling {
  constructor(eventBus, elementFactory, commandStack, blueprint) {
    super(eventBus, elementFactory, commandStack);

    this._blueprint = blueprint;
  }

  getHandlers() {
    const handlers = super.getHandlers();
    handlers['label.update'] = UpdateLabelHandler;
    return handlers;
  }

  updateLabel(element, newContent) {
    this._commandStack.execute('label.update', {
      element,
      newContent
    });
  }

  refresh(element) {
    if (element.type === 'shape') {
      const blueprintShape = findBlueprint(this._blueprint, element)?.shape;
      if (blueprintShape?.labels === undefined) return;

      element.labels.forEach((label) => {
        const labelBlueprint = blueprintShape.labels.find((l) => l.key === label.key);
        const newContent = labelBlueprint.content(label.data);
        this.updateLabel(label, newContent);
      });
    }

    this._eventBus.fire('element.change', { element });
  }
}

Modeling.$inject = [
  'eventBus',
  'elementFactory',
  'commandStack',
  'blueprint'
];
