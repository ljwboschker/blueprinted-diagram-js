/* eslint-disable no-param-reassign */
import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import { createDiagramEvent } from '../../create-diagram-event';
import { findConnectionRule } from '../../utils/find-utils';

/**
 * A component that makes sure that connections are properly configured
 */
export default class ConnectionBehavior extends CommandInterceptor {
  constructor(eventBus, blueprint) {
    super(eventBus);

    this.execute(['connection.create'], (event) => {
      if (!event.context.connection) {
        return;
      }

      const { source, target } = event.context;
      const connection = findConnectionRule(blueprint, source);
      if (!connection) throw new Error(`Could not get connection definition from ${source.type} to ${target.type}`);

      const data = connection.data ? connection.data(createDiagramEvent(source), createDiagramEvent(target)) : undefined;

      event.context.connection.type = 'connection';
      event.context.connection.data = data;
    });
  }
}

ConnectionBehavior.$inject = ['eventBus', 'blueprint'];
