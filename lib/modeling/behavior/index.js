// import ContainerBehavior from './container-behavior';
import ConnectionBehavior from './connection-behavior';
import LabelBehavior from './label-behavior';
import IdBehavior from './id-behavior';
// import CanvasMoveBehavior from './canvas-move.behavior';

export default {
    __init__: [
        'idBehavior',
        'connectionBehavior',
        'labelBehavior',
        // 'containerBehavior',
        // 'canvasMoveBehavior'
    ],
    idBehavior: ['type', IdBehavior],
    connectionBehavior: ['type', ConnectionBehavior],
    labelBehavior: ['type', LabelBehavior],
    // containerBehavior: ['type', ContainerBehavior],
    // canvasMoveBehavior: ['type', CanvasMoveBehavior]
};
