import SvgRenderer from './svg-renderer';
import ConnectionRenderer from './connection-renderer';

export default {
    __init__: ['svgRenderer', 'connectionRenderer'],
    svgRenderer: ['type', SvgRenderer],
    connectionRenderer: ['type', ConnectionRenderer]
};
