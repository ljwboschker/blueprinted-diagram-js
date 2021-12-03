import { createShape } from './create-shape';

/**
 * Context pad provider based on the provided blueprint.
 */
export default function BlueprintContextPadProvider(blueprint, connect, contextPad, create, elementFactory, modeling) {
  this._blueprint = blueprint;
  this._connect = connect;
  this._create = create;
  this._elementFactory = elementFactory;
  this._modeling = modeling;

  contextPad.registerProvider(this);
}

BlueprintContextPadProvider.$inject = [
  'blueprint',
  'connect',
  'contextPad',
  'create',
  'elementFactory',
  'modeling'
];


BlueprintContextPadProvider.prototype.getContextPadEntries = function (element) {
  var
    blueprint = this._blueprint,
    connect = this._connect,
    create = this._create,
    elementFactory = this._elementFactory,
    modeling = this._modeling;

  function removeElement() {
    modeling.removeElements([element]);
  }

  function startConnect(event, element, autoActivate) {
    connect.start(event, element, autoActivate);
  }

  let pad = {};

  pad['delete'] = {
    group: 'edit',
    className: 'bpmn-icon-trash',
    title: 'Remove',
    action: {
      click: removeElement,
      dragstart: removeElement
    }
  };

  if (element.rules?.connect) {
    pad['connect'] = {
      group: 'edit',
      className: 'bpmn-icon-connection',
      title: 'Connect',
      action: {
        click: startConnect,
        dragstart: startConnect
      }
    };
  };

  element.rules?.connect?.forEach(connection => {
    const newElement = blueprint.elements.find(e => e.type === connection.to);

    function createNewElement(event, currentShape) {
      const shape = createShape(elementFactory, newElement);
      create.start(event, shape, { source: currentShape });
    }

    pad[newElement.type] = {
      groupName: 'model',
      className: `context-pad-${newElement.type}`,
      title: newElement.title,
      action: {
        click: createNewElement
      }
    }
  });

  return pad;
};
