import LabelBehavior from './label-behavior';
// import ContainerBehavior from './container-behavior';
// import ConnectionBehavior from './connection-behavior';
// import ResourceBehavior from './resource.behavior';
// import CanvasMoveBehavior from './canvas-move.behavior';

export default {
    __init__: [
        // 'resourceBehavior',
        'labelBehavior',
        // 'containerBehavior',
        // 'connectionBehavior',
        // 'canvasMoveBehavior'
    ],
    // resourceBehavior: ['type', ResourceBehavior],
    labelBehavior: ['type', LabelBehavior],
    // containerBehavior: ['type', ContainerBehavior],
    // connectionBehavior: ['type', ConnectionBehavior],
    // canvasMoveBehavior: ['type', CanvasMoveBehavior]
};
