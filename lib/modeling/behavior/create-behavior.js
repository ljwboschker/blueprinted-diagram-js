/* eslint-disable no-param-reassign */
import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import { v4 as generateGuid } from 'uuid';

/**
 * Ensure that the shape has a GUID as ID.
 */
export default class CreateBehavior extends CommandInterceptor {
  constructor(eventBus) {
    super(eventBus);

    this.execute('shape.create', (event) => {
      const id = generateGuid();
      event.context.shape.id = `shape-${id}`;
    });

    this.execute('label.create', (event) => {
      const id = generateGuid();
      event.context.shape.id = `label-${id}`;
    });

    this.execute('connection.create', (event) => {
      const id = generateGuid();
      event.context.connection.id = `connection-${id}`;
    });
  }
}

CreateBehavior.$inject = ['eventBus'];
