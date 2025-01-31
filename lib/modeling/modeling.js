import BaseModeling from 'diagram-js/lib/features/modeling/Modeling';
import UpdateLabelHandler from './cmd/update-label-handler';
import UpdateEmbeddedTextHandler from './cmd/update-embedded-text-handler';
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
      changes: [{
        element,
        newContent
      }]
    });
  }

  updateEmbeddedText(element, index, newContent) {
    this._commandStack.execute('embeddedtext.update', {
      element,
      changes: [{
        index,
        newContent
      }]
    });
  }

  refresh(element) {
    this._eventBus.fire('element.refreshing', { element });

    switch (element.type) {
      case 'shape':
        this._updateShapeContents(element);
        break;
      case 'connection':
        this._updateConnectionContents(element);
        break;
      default:
        break;
    }

    this._eventBus.fire('element.changed', { element });
  }

  _updateShapeContents(element) {
    const blueprintElement = findBlueprint(this._blueprint, element);
    if (!blueprintElement) return;

    if (blueprintElement.shape.embeddedText) {
      const changes = blueprintElement.shape.embeddedText.map((line, index) => {
        const { key } = element.embeddedText[index];
        const newContent = line.content(key, element.data);
        return {
          index,
          newContent
        };
      });

      this._commandStack.execute('embeddedtext.update', { element, changes });
    }

    const labelDefinitions = blueprintElement.shape.labels;
    const changes = element.labels.map((label) => {
      const definition = labelDefinitions?.find((l) => l.key === label.key);
      return {
        element: label,
        newContent: definition?.content(label.key, label.labelTarget.data)
      };
    });

    this._commandStack.execute('label.update', { changes });
  }

  _updateConnectionContents(element) {
    const blueprint = findBlueprint(this._blueprint, element.source);

    const definition = blueprint?.rules.connections?.label;
    const changes = element.labels.map((label) => ({
      element: label,
      newContent: definition?.content(label.key, label.labelTarget.data)
    }));

    this._commandStack.execute('label.update', { changes });
  }
}

Modeling.$inject = [
  'eventBus',
  'elementFactory',
  'commandStack',
  'blueprint'
];
