import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

export default function DiagramElementUpdater(eventBus, connectionDocking) {
  CommandInterceptor.call(this, eventBus);

  // Attach the connection start- or endpoint to the element's border after it was moved.
  function cropConnection(e) {
    const { context } = e;
    let connection;

    if (!context.cropped) {
      connection = context.connection;
      connection.waypoints = connectionDocking.getCroppedWaypoints(
        connection
      );
      context.cropped = true;
    }
  }

  this.executed(['connection.layout', 'connection.create'], cropConnection);

  this.reverted(['connection.layout'], (e) => {
    delete e.context.cropped;
  });
}

inherits(DiagramElementUpdater, CommandInterceptor);

DiagramElementUpdater.$inject = ['eventBus', 'connectionDocking'];
