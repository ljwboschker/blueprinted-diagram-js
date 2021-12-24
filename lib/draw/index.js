import ConnectionRenderer from './connection-renderer';
import LabelRenderer from './label-renderer';
import SvgRenderer from './svg-renderer';

export default {
  __depends__: ['blueprint'],
  __init__: ['connectionRenderer', 'labelRenderer', 'svgRenderer'],
  connectionRenderer: ['type', ConnectionRenderer],
  labelRenderer: ['type', LabelRenderer],
  svgRenderer: ['type', SvgRenderer]
};
