import {
  append as svgAppend,
  create as svgCreate,
  attr as svgAttr
} from 'tiny-svg';
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import { findConnectionRule } from '../utils/find-utils';

const GHOST_STYLE = {
  stroke: '#999',
  strokeWidth: 1,
  fill: 'none'
};

export default class ConnectionRenderer extends BaseRenderer {
  constructor(eventBus, canvas, blueprint) {
    super(eventBus, 100);
    this._blueprint = blueprint;
    this._canvas = canvas;
  }

  canRender(element) {
    return element.waypoints;
  }

  drawConnection(parent, context) {
    const { source, target, id } = context;

    const connectionRule = source && target
      ? findConnectionRule(this._blueprint, source)
      : undefined;

    const style = connectionRule?.style(id);

    const line = connectionRule
      ? this._createLine(context.waypoints, style.arrow, style.style)
      : this._createLine(context.waypoints, false, GHOST_STYLE);

    svgAppend(parent, line);
    return line;
  }

  _stringToHex(str) {
    let hex = '';
    for (let i = 0; i < str.length; i += 1) {
      const charCode = str.charCodeAt(i);
      const hexValue = charCode.toString(16);
      hex += hexValue.padStart(2, '0');
    }
    return hex;
  }

  _createLine(points, arrow, style) {
    const hex = this._stringToHex(JSON.stringify(style));
    const connectionEndId = `connectionEnd-${hex}`;

    if (arrow) {
      this._createArrowHead(connectionEndId, style.stroke);
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

  _createArrowHead(id, fill) {
    let defs = this._canvas._svg.querySelector('defs');
    if (!defs) {
      defs = svgCreate('defs');
      svgAppend(this._canvas._svg, defs);
    }

    if (!defs.querySelector(`marker[id=${id}]`)) {
      const marker = svgCreate('marker', {
        id,
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

ConnectionRenderer.$inject = ['eventBus', 'canvas', 'blueprint'];
