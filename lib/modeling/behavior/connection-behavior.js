/* eslint-disable no-param-reassign */
import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import inherits from 'inherits';

/**
 * A component that makes sure that connections are properly configured
 */
export default function ConnectionBehavior(eventBus) {
  CommandInterceptor.call(this, eventBus);

  this.execute(['connection.create'], (event) => {
    if (!event.context.connection) {
      return;
    }

    event.context.connection.type = 'connection';
  });
}

inherits(ConnectionBehavior, CommandInterceptor);

ConnectionBehavior.$inject = ['eventBus', 'blueprint'];
