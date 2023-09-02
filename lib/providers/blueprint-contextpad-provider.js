import { findBlueprint } from '../utils/find-utils';
import { createShape } from './create-shape';
import { createDiagramEvent } from '../create-diagram-event';

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
  selection,
  popupMenu
) {
  this._blueprint = blueprint;
  this._connect = connect;
  this._create = create;
  this._elementFactory = elementFactory;
  this._modeling = modeling;
  this._eventBus = eventBus;
  this._selection = selection;
  this._popupMenu = popupMenu;

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
  'selection',
  'popupMenu'
];

BlueprintContextPadProvider.prototype.getContextPadEntries = function getContextPadEntries(element) {
  const blueprint = this._blueprint;
  const connect = this._connect;
  const create = this._create;
  const elementFactory = this._elementFactory;
  const modeling = this._modeling;
  const eventBus = this._eventBus;
  const selection = this._selection;
  const popupMenu = this._popupMenu;

  function removeElement() {
    modeling.removeElements([element]);
  }

  function startConnect(event, sourceElement, autoActivate) {
    connect.start(event, sourceElement, autoActivate);
  }

  function createContextActions(actions) {
    if (!actions) return;

    actions
      .filter((action) => !action.allowed || action.allowed(createDiagramEvent(element)) === true)
      .forEach((action) => {
        pad[action.name] = {
          group: 'action',
          className: action.className,
          title: action.title,
          action: {
            click: (event, sourceElement) => triggerAction(event, action, sourceElement)
          }
        };
      });
  }

  function triggerAction(event, action, sourceElement) {
    if (action.type === 'popup') {
      const position = { x: event.x, y: event.y };
      popupMenu.open(element, `blueprint-popupmenu-${action.name}`, position);
    } else {
      selection.deselect(sourceElement);
      eventBus.fire('contextaction.click', { action: action.name, element: sourceElement });
    }
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

  if (element.type === 'connection') {
    // Determine context pad for connection
    const source = findBlueprint(blueprint, element.source);
    if (!source) return pad;

    createContextActions(source.rules.connections?.contextActions);
  } else {
    // Determine context pad for other items
    const blueprintElement = findBlueprint(blueprint, element);
    if (!blueprintElement) return pad;

    if (blueprintElement.rules.connections) {
      pad.connect = {
        group: 'edit',
        className: 'bpmn-icon-connection',
        title: 'Connect',
        action: {
          click: startConnect,
          dragstart: startConnect
        }
      };

      blueprint.elements
        .filter((e) => blueprintElement.rules.connections.allowed(e.type))
        .forEach((e) => {
          function createNewElement(event, currentShape) {
            const shape = createShape(elementFactory, e);
            create.start(event, shape, { source: currentShape });
          }

          pad[e.type] = {
            group: 'model',
            className: `context-pad-${e.type}`,
            title: `Create new ${e.title}`,
            action: {
              click: createNewElement
            }
          };
        });
    }

    createContextActions(blueprintElement.contextActions);
  }

  return pad;
};
