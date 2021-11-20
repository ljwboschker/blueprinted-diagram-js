/**
 * Context pad provider based on the provided blueprint.
 */
 export default function BlueprintContextPadProvider(connect, contextPad, modeling) {
  this._connect = connect;
  this._modeling = modeling;

  contextPad.registerProvider(this);
}

BlueprintContextPadProvider.$inject = [
  'connect',
  'contextPad',
  'modeling'
];


BlueprintContextPadProvider.prototype.getContextPadEntries = function(element) {
  var connect = this._connect,
      modeling = this._modeling;

  function removeElement() {
    modeling.removeElements([ element ]);
  }

  function startConnect(event, element, autoActivate) {
    connect.start(event, element, autoActivate);
  }

  let pad = {};
  if (element.type !== 'label') {
    pad = { ...pad,
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

  }

  if (!element.waypoints && element.type !== 'label') {
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