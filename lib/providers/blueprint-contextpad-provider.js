import { findBlueprint } from '../utils/find-utils';
import { createShape } from './create-shape';
import { createDiagramEvent } from '../create-diagram-event';

/**
 * Context pad provider based on the provided blueprint.
 */
export default class BlueprintContextPadProvider {
  constructor(
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

  getContextPadEntries(element) {
    const pad = {};

    pad.delete = {
      group: 'edit',
      className: 'bpmn-icon-trash',
      title: 'Remove',
      action: {
        click: () => this._removeElement(element),
        dragstart: () => this._removeElement(element)
      }
    };

    const createContextActions = (actions) => {
      if (!actions) return;

      actions
        .filter((action) => !action.allowed || action.allowed(createDiagramEvent(element)) === true)
        .forEach((action) => {
          // eslint-disable-next-line no-param-reassign
          pad[action.name] = {
            group: 'action',
            className: action.className,
            title: action.title,
            action: {
              click: (event, sourceElement) => this._triggerAction(event, action, sourceElement)
            }
          };
        });
    };

    if (element.type === 'connection') {
      // Determine context pad for connection
      const source = findBlueprint(this._blueprint, element.source);
      if (!source) return pad;

      createContextActions(source.rules.connections.contextActions);
    } else {
      // Determine context pad for other items
      const blueprintElement = findBlueprint(this._blueprint, element);
      if (!blueprintElement) return pad;

      if (blueprintElement.rules.connections) {
        pad.connect = {
          group: 'edit',
          className: 'bpmn-icon-connection',
          title: 'Connect',
          action: {
            click: (event) => this._startConnect(event, element),
            dragstart: (event) => this._startConnect(event, element)
          }
        };

        this._blueprint.elements
          .filter((blueprint) => blueprintElement.rules.connections.allowed(blueprint.type))
          .forEach((blueprint) => {
            const createNewElement = (event, currentShape) => {
              const shape = createShape(this._elementFactory, blueprint);
              this._create.start(event, shape, { source: currentShape });
            };

            pad[blueprint.type] = {
              group: 'model',
              className: `context-pad-${blueprint.type}`,
              title: `Create new ${blueprint.title}`,
              action: {
                click: (event, currentShape) => createNewElement(event, currentShape)
              }
            };
          });
      }

      createContextActions(blueprintElement.contextActions);
    }

    return pad;
  }

  _removeElement(element) {
    this._modeling.removeElements([element]);
  }

  _startConnect(event, sourceElement) {
    this._connect.start(event, sourceElement);
  }

  _triggerAction(event, action, sourceElement) {
    if (action.type === 'popup') {
      const position = { x: event.x, y: event.y };
      this._popupMenu.open(sourceElement, `blueprint-popupmenu-${action.name}`, position);
    } else {
      this._selection.deselect(sourceElement);
      this._eventBus.fire('contextaction.click', { action: action.name, element: sourceElement });
    }
  }
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
