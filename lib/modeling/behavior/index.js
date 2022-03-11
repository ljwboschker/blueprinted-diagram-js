// import ContainerBehavior from './container-behavior';
import CanvasMoveBehavior from './canvas-move-behavior';
import ConnectionBehavior from './connection-behavior';
import CreateBehavior from './create-behavior';
import LabelBehavior from './label-behavior';

export default {
  __depends__: [
    'blueprint'
  ],
  __init__: [
    'canvasMoveBehavior',
    'connectionBehavior',
    'createBehavior',
    'labelBehavior'
  ],
  canvasMoveBehavior: ['type', CanvasMoveBehavior],
  connectionBehavior: ['type', ConnectionBehavior],
  createBehavior: ['type', CreateBehavior],
  labelBehavior: ['type', LabelBehavior]
};
