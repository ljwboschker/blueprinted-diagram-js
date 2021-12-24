/* eslint-disable no-param-reassign */
import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import inherits from 'inherits';
import { findConnectionRule } from '../../utils/find-utils';

/**
 * A component that makes sure that connections are properly configured
 */
export default function ConnectionBehavior(eventBus, blueprint) {
  CommandInterceptor.call(this, eventBus);

  this.execute(['connection.create'], (event) => {
    if (!event.context.connection) {
      return;
    }

    const rule = findConnectionRule(blueprint, event.context.source, event.context.target);
    event.context.connection.type = 'connection';
    event.context.connection.data = rule.data;
  });
}

inherits(ConnectionBehavior, CommandInterceptor);

ConnectionBehavior.$inject = ['eventBus', 'blueprint'];
