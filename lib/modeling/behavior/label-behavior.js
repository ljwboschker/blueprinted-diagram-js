import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import inherits from 'inherits';
import TextUtil from 'diagram-js/lib/util/Text';

import { getLabelAdjustment } from './utils/label-layout-util';
import { findConnectionRule } from '../../utils/find-rules';

/**
 * A component that adds labels to a shape and a connection.
 */
export default function LabelBehavior(eventBus, modeling, elementFactory) {
    CommandInterceptor.call(this, eventBus);

    const text = new TextUtil();

    this.postExecute(['shape.create'], event => {
        const shape = event.context.shape;
        if (!shape.labelDefinitions) return;

        shape.labelDefinitions.forEach(definition => {
            const label = createLabel(definition.text, { ...definition.style }, { width: shape.width - 20 } );
            const labelPosition = {
                x: shape.x + shape.width / 2,
                y: shape.y + definition.y
            };

            modeling.createLabel(shape, labelPosition, label);
        });
    });

    this.postExecute(['connection.create'], event => {
        const connection = event.context.connection;
        const source = event.context.source;
        const target = event.context.target;

        const rule = findConnectionRule(source, target);
        if (!rule) throw new Error('Connection rule to target not found.');
        
        const label = createLabel(rule.text, { ...rule.textOptions.style }, { ...rule.textOptions.box } );
        const labelCenter = getConnectionMidpoint(connection.waypoints);

        modeling.createLabel(connection, labelCenter, label);
    });

    function createLabel(labelText, style, box) {
        const textOptions = {
            align: 'center-top',
            fitBox: true,
            style,
            box
        };

        const dimension = text.getDimensions(labelText, textOptions);
        return elementFactory.createLabel({
            content: labelText,
            type: 'label',
            textOptions,
            ...dimension
        });
    }

    /**
     * Get the position for connection labels
     */
    function getConnectionMidpoint(waypoints) {
        // get the waypoints mid
        const mid = waypoints.length / 2 - 1;

        const first = waypoints[Math.floor(mid)];
        const second = waypoints[Math.ceil(mid + 0.01)];

        // get position
        const position = getWaypointsMidpoint(waypoints);

        // calculate angle
        const angle = Math.atan((second.y - first.y) / (second.x - first.x));

        let x = position.x;
        let y = position.y;

        const LABEL_INDENT = 15;
        if (Math.abs(angle) < Math.PI / 2) {
            y -= LABEL_INDENT;
        } else {
            x += LABEL_INDENT;
        }

        return { x, y };
    }

    function getWaypointsMidpoint(waypoints) {
        const mid = waypoints.length / 2 - 1;

        const first = waypoints[Math.floor(mid)];
        const second = waypoints[Math.ceil(mid + 0.01)];

        return {
            x: first.x + (second.x - first.x) / 2,
            y: first.y + (second.y - first.y) / 2
        };
    }

    this.postExecute(
        ['connection.layout', 'connection.updateWaypoints'],
        event => {
            const label = event.context.connection.label;
            if (!label) {
                return;
            }

            const labelAdjustment = getVisibleLabelAdjustment(event);

            modeling.moveShape(label, labelAdjustment);
        }
    );

    function getVisibleLabelAdjustment(event) {
        const hints = { ...event.context.hints };
        if (hints.startChanged === undefined) {
            hints.startChanged = !!hints.connectionStart;
        }

        if (hints.endChanged === undefined) {
            hints.endChanged = !!hints.connectionEnd;
        }

        const newWaypoints =
            event.context.newWaypoints || event.context.connection.waypoints;
        const oldWaypoints = event.context.oldWaypoints;
        return getLabelAdjustment(
            event.context.connection.label,
            newWaypoints,
            oldWaypoints,
            hints
        );
    }
}

inherits(LabelBehavior, CommandInterceptor);

LabelBehavior.$inject = ['eventBus', 'modeling', 'elementFactory'];
