import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import inherits from 'inherits';

/**
 * A component that makes sure that connections are properly configured
 */
export default function ConnectionBehavior(eventBus) {
    CommandInterceptor.call(this, eventBus);

    this.execute(['connection.create'], event => {
        if (!event.context.connection) {
            return;
        }

        const connection = event.context.connection;
        connection.type = 'connection';
        connection.data = {};
    });
}

inherits(ConnectionBehavior, CommandInterceptor);

ConnectionBehavior.$inject = ['eventBus'];
