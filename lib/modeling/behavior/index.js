// import ContainerBehavior from './container-behavior';
import ConnectionBehavior from './connection-behavior';
import LabelBehavior from './label-behavior';
// import ResourceBehavior from './resource.behavior';
// import CanvasMoveBehavior from './canvas-move.behavior';

export default {
    __init__: [
        // 'resourceBehavior',
        'connectionBehavior',
        'labelBehavior',
        // 'containerBehavior',
        // 'canvasMoveBehavior'
    ],
    // resourceBehavior: ['type', ResourceBehavior],
    connectionBehavior: ['type', ConnectionBehavior],
    labelBehavior: ['type', LabelBehavior],
    // containerBehavior: ['type', ContainerBehavior],
    // canvasMoveBehavior: ['type', CanvasMoveBehavior]
};
