import { findBlueprint } from '../utils/find-utils';
import { createShape } from './create-shape';

/**
 * Context pad provider based on the provided blueprint.
 */
export default function BlueprintContextPadProvider(
  blueprint,
  connect,
  contextPad,
  create,
  elementFactory,
  modeling,
  eventBus,
  selection
) {
  this._blueprint = blueprint;
  this._connect = connect;
  this._create = create;
  this._elementFactory = elementFactory;
  this._modeling = modeling;
  this._eventBus = eventBus;
  this._selection = selection;

  contextPad.registerProvider(this);
}

BlueprintContextPadProvider.$inject = [
  'blueprint',
  'connect',
  'contextPad',
  'create',
  'elementFactory',
  'modeling',
  'eventBus',
  'selection'
];

BlueprintContextPadProvider.prototype.getContextPadEntries = function getContextPadEntries(element) {
  const blueprint = this._blueprint;
  const connect = this._connect;
  const create = this._create;
  const elementFactory = this._elementFactory;
  const modeling = this._modeling;
  const eventBus = this._eventBus;
  const selection = this._selection;

  function removeElement() {
    modeling.removeElements([element]);
  }

  function startConnect(event, sourceElement, autoActivate) {
    connect.start(event, sourceElement, autoActivate);
  }

  function triggerAction(_, action, sourceElement) {
    selection.deselect(sourceElement);
    eventBus.fire('contextaction.click', { action, element: sourceElement });
  }

  const pad = {};

  pad.delete = {
    group: 'edit',
    className: 'bpmn-icon-trash',
    title: 'Remove',
    action: {
      click: removeElement,
      dragstart: removeElement
    }
  };

  const blueprintElement = findBlueprint(blueprint, element);
  if (!blueprintElement) return pad;

  if (blueprintElement.rules.connect) {
    pad.connect = {
      group: 'edit',
      className: 'bpmn-icon-connection',
      title: 'Connect',
      action: {
        click: startConnect,
        dragstart: startConnect
      }
    };

    blueprintElement.rules.connect.forEach((connection) => {
      const newElement = findBlueprint(blueprint, connection.to);

      function createNewElement(event, currentShape) {
        const shape = createShape(elementFactory, newElement);
        create.start(event, shape, { source: currentShape });
      }

      pad[newElement.type] = {
        group: 'model',
        className: `context-pad-${newElement.type}`,
        title: newElement.title,
        action: {
          click: createNewElement
        }
      };
    });
  }

  blueprintElement.contextActions?.forEach((action) => {
    pad[action.name] = {
      group: 'action',
      className: action.className,
      title: action.title,
      action: {
        click: (event, sourceElement) => triggerAction(event, action.name, sourceElement)
      }
    };
  });

  return pad;
};
