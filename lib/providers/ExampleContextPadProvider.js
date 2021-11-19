import AppendShapeHandler from "diagram-js/lib/features/modeling/cmd/AppendShapeHandler";

/**
 * A example context pad provider.
 */
 export default function ExampleContextPadProvider(connect, contextPad, modeling) {
  this._connect = connect;
  this._modeling = modeling;

  contextPad.registerProvider(this);
}

ExampleContextPadProvider.$inject = [
  'connect',
  'contextPad',
  'modeling'
];


ExampleContextPadProvider.prototype.getContextPadEntries = function(element) {
  var connect = this._connect,
      modeling = this._modeling;

  function removeElement() {
    modeling.removeElements([ element ]);
  }

  function startConnect(event, element, autoActivate) {
    connect.start(event, element, autoActivate);
  }

  let pad = {
    'delete': {
      group: 'edit',
      className: 'context-pad-icon-remove',
      title: 'Remove',
      action: {
        click: removeElement,
        dragstart: removeElement
      }
    }
  };

  if (!element.waypoints) {
    pad = { ...pad, 
      'connect': {
        group: 'edit',
        className: 'context-pad-icon-connect',
        title: 'Connect',
        action: {
          click: startConnect,
          dragstart: startConnect
        }
      }      
    }
  }

  return pad;
};