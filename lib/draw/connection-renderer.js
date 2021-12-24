import inherits from 'inherits';
import {
  append as svgAppend,
  create as svgCreate,
  attr as svgAttr
} from 'tiny-svg';
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import { findConnectionRule } from '../utils/find-utils';

export default function ConnectionRenderer(eventBus, canvas, blueprint) {
  BaseRenderer.call(this, eventBus, 100);

  this.canRender = (element) => element.waypoints;

  this.drawConnection = (parent, connection) => {
    const { source, target } = connection;

    let arrow = false;
    let style = 'stroke: #999; stroke-width: 1; fill: none;';
    if (source && target) {
      const rule = findConnectionRule(blueprint, source, target);
      if (!rule) throw new Error('Connection rule to target not found.');

      arrow = rule.direction || arrow;
      style = rule.style || style;
    }

    const line = createLine(connection.waypoints, arrow, style);

    svgAppend(parent, line);

    return line;
  };

  function createLine(points, arrow, style) {
    const connectionEndId = 'connectionEnd';

    if (arrow) {
      // Find the connection's stroke
      const stroke = style.split(';').map((rule) => rule.trim()).find((r) => r.startsWith('stroke'));
      const fill = stroke?.split(':')[1].trim();
      createArrowHead(connectionEndId, fill);
    }

    const line = svgCreate('polyline');
    svgAttr(line, {
      points: points.reduce((acc, cur) => `${acc} ${cur.x},${cur.y} `, ''),
      style
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
