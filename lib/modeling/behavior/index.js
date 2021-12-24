// import ContainerBehavior from './container-behavior';
import CanvasMoveBehavior from './canvas-move-behavior';
import ConnectionBehavior from './connection-behavior';
import IdBehavior from './id-behavior';
import LabelBehavior from './label-behavior';

export default {
  __depends__: [
    'blueprint'
  ],
  __init__: [
    'canvasMoveBehavior',
    'connectionBehavior',
    'idBehavior',
    'labelBehavior'
    // 'containerBehavior',
  ],
  canvasMoveBehavior: ['type', CanvasMoveBehavior],
  connectionBehavior: ['type', ConnectionBehavior],
  idBehavior: ['type', IdBehavior],
  labelBehavior: ['type', LabelBehavior]
  // containerBehavior: ['type', ContainerBehavior],
};
