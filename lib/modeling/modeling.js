import BaseModeling from 'diagram-js/lib/features/modeling/Modeling';
import UpdateLabelHandler from '../features/direct-editing/label-editing/cmd/update-label-handler';
import UpdateEmbeddedTextHandler from '../features/direct-editing/embedded-text-editing/cmd/update-embedded-text-handler';
import { findBlueprint } from '../utils/find-utils';

export default class Modeling extends BaseModeling {
  constructor(eventBus, elementFactory, commandStack, blueprint) {
    super(eventBus, elementFactory, commandStack);

    this._blueprint = blueprint;
  }

  getHandlers() {
    const handlers = super.getHandlers();
    handlers['label.update'] = UpdateLabelHandler;
    handlers['embeddedtext.update'] = UpdateEmbeddedTextHandler;
    return handlers;
  }

  updateLabel(element, newContent) {
    this._commandStack.execute('label.update', {
      element,
      newContent
    });
  }

  updateEmbeddedText(element, newText, oldText) {
    this._commandStack.execute('embeddedtext.update', {
      element,
      newText,
      oldText
    });
  }

  refresh(element) {
    switch (element.type) {
      case 'shape':
        this._updateShape(element);
        break;
      case 'connection':
        this._updateConnection(element);
        break;
      default:
        this._eventBus.fire('element.change', { element });
    }
  }

  _updateShape(element) {
    const blueprintElement = findBlueprint(this._blueprint, element);
    if (!blueprintElement) return;

    if (blueprintElement.shape.embeddedText) {
      blueprintElement.shape.embeddedText.forEach((line, index) => {
        const { key } = element.embeddedText[index];
        const newText = line.content(key, element.data);
        const oldText = element.embeddedText[index].content;
        this.updateEmbeddedText(element, newText, oldText);
      });
    }

    const labelDefinitions = blueprintElement.shape.labels;
    element.labels.forEach((label) => {
      const labelBlueprint = labelDefinitions?.find((l) => l.key === label.key);
      if (labelBlueprint) {
        const newContent = labelBlueprint.content(label.key, element.data);
        this.updateLabel(label, newContent);
      }
    });
  }

  _updateConnection(element) {
    const blueprint = findBlueprint(this._blueprint, element.source);

    const labelDefinition = blueprint?.rules.connections?.label;
    if (!labelDefinition) return;

    element.labels.forEach((label) => {
      const newContent = labelDefinition.content(label.key, element.data);
      this.updateLabel(label, newContent);
    });
  }
}

Modeling.$inject = [
  'eventBus',
  'elementFactory',
  'commandStack',
  'blueprint'
];
