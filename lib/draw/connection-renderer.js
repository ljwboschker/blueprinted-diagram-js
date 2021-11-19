import inherits from 'inherits';
import {
    append as svgAppend,
    create as svgCreate,
    attr as svgAttr
} from 'tiny-svg';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

export default function ConnectionRenderer(eventBus, canvas) {

    BaseRenderer.call(this, eventBus, 100);

    this.canRender = element => {
        return element.waypoints;
    };

    this.drawConnection = (parent, connection) => {
        const line = createLine(connection.waypoints);

        svgAppend(parent, line);

        return line;
    };


    function createLine(points) {
        const connectionEndId = 'connectionEnd';
        createArrowHead(connectionEndId);

        const line = svgCreate('polyline');
        svgAttr(line, {
            points: points.reduce((acc, cur) => acc += `${cur.x},${cur.y} `, ''),
            fill: 'none',
            strokeWidth: 1,
            stroke: '#999',
            markerEnd: `url(#${connectionEndId})`
        });

        return line;
    }

    function createArrowHead(id) {
        let defs = canvas._svg.querySelector('defs');
        if (!defs) {
            defs = svgCreate('defs');
            svgAppend(canvas._svg, defs);
        }

        if (!defs.querySelector(`marker[id=${id}]`)) {
            const marker = svgCreate('marker', {
                id: 'connectionEnd',
                markerWidth: 9,
                markerHeight: 6,
                refX: 9,
                refY: 3,
                orient: 'auto',
                markerUnits: 'strokeWidth'
            });

            const arrow = svgCreate('path', {
                d: 'M0,0 L0,6 L9,3 Z',
                fill: '#999'
            });
            svgAppend(marker, arrow);

            svgAppend(defs, marker);
        }
    }
}

inherits(ConnectionRenderer, BaseRenderer);

ConnectionRenderer.$inject = ['eventBus', 'canvas'];
