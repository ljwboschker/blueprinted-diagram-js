import inherits from 'inherits';

import BaseLayouter from 'diagram-js/lib/layout/BaseLayouter';
import { connectRectangles, repairConnection, withoutRedundantPoints } from 'diagram-js/lib/layout/ManhattanLayout';

export default function ConnectionLayouter() {}

inherits(ConnectionLayouter, BaseLayouter);

ConnectionLayouter.prototype.layoutConnection = (connection, hints) => {
    hints = hints || {};

    const source = hints.source || connection.source;
    const target = hints.target || connection.target;
    const waypoints = connection.waypoints;
    const start = hints.connectionStart;
    const end = hints.connectionEnd;

    hints = Object.assign(hints, {
        preferredLayouts: ['v:v']
    });

    return waypoints
        ? withoutRedundantPoints(repairConnection(source, target, start, end, connection.waypoints, hints)) // Element moved
        : connectRectangles(source, target, start, end, hints); // New connection
};
