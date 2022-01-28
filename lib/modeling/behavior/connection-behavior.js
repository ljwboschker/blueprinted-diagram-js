/* eslint-disable no-param-reassign */
import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import inherits from 'inherits';
import { executeConnectionRule } from '../../utils/find-utils';

/**
 * A component that makes sure that connections are properly configured
 */
export default function ConnectionBehavior(eventBus, blueprint) {
  CommandInterceptor.call(this, eventBus);

  this.execute(['connection.create'], (event) => {
    if (!event.context.connection) {
      return;
    }

    const { source, target } = event.context;

    const connection = executeConnectionRule(blueprint, source, target);
    if (!connection) return;

    const data = connection.data ? connection.data() : undefined;

    event.context.connection.type = 'connection';
    event.context.connection.data = data;
  });
}

inherits(ConnectionBehavior, CommandInterceptor);

ConnectionBehavior.$inject = ['eventBus', 'blueprint'];
