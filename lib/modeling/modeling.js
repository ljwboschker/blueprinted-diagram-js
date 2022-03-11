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
      const labelDefinitions = findBlueprint(this._blueprint, element)?.shape.labels;

      element.labels.forEach((label) => {
        const labelBlueprint = labelDefinitions.find((l) => l.key === label.key);
        const newContent = labelBlueprint.content(label.data);
        this.updateLabel(label, newContent);
      });
    } else if (element.type === 'connection') {
      const blueprint = findBlueprint(this._blueprint, element.source);
      const labelDefinition = blueprint?.rules.connections?.label;

      element.labels.forEach((label) => {
        const newContent = labelDefinition.content(label.data);
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
