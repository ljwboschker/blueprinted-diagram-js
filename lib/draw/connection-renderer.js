import inherits from 'inherits';
import {
  append as svgAppend,
  create as svgCreate,
  attr as svgAttr
} from 'tiny-svg';
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import { createConnection } from '../utils/find-utils';

const GHOST_STYLE = {
  stroke: '#999',
  strokeWidth: 1,
  fill: 'none'
};

export default function ConnectionRenderer(eventBus, canvas, blueprint) {
  this._blueprint = blueprint;

  BaseRenderer.call(this, eventBus, 100);

  this.canRender = (element) => element.waypoints;

  this.drawConnection = (parent, context) => {
    const { source, target } = context;

    const connection = source && target
      ? createConnection(this._blueprint, source, target)
      : undefined;

    const line = connection
      ? createLine(context.waypoints, connection.arrow, connection.style)
      : createLine(context.waypoints, false, GHOST_STYLE);

    svgAppend(parent, line);
    return line;
  };

  function createLine(points, arrow, style) {
    const connectionEndId = 'connectionEnd';

    if (arrow) {
      createArrowHead(connectionEndId, style.stroke);
    }

    const line = svgCreate('polyline');
    svgAttr(line, {
      points: points.reduce((acc, cur) => `${acc} ${cur.x},${cur.y} `, ''),
      ...style
    });

    if (arrow) {
      svgAttr(line, {
        markerEnd: `url(#${connectionEndId})`
      });
    }

    return line;
  }

  function createArrowHead(id, fill) {
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
        fill
      });
      svgAppend(marker, arrow);

      svgAppend(defs, marker);
    }
  }
}

inherits(ConnectionRenderer, BaseRenderer);

ConnectionRenderer.$inject = ['eventBus', 'canvas', 'blueprint'];
