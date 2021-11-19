import DefaultRenderer from './default-renderer';
import ConnectionRenderer from './connection-renderer';

export default {
    __init__: ['defaultRenderer', 'connectionRenderer'],
    defaultRenderer: ['type', DefaultRenderer],
    connectionRenderer: ['type', ConnectionRenderer]
};
