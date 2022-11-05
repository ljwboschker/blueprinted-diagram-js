const DEFAULT_OPTIONS = {
  offset: {
    x: 150,
    y: 75
  },
  tolerance: 50
};

/**
 * Moves diagram contents to the origin + offset.
 *
 * @param {didi.Injector} injector
 * @param {CommandStack} commandStack
 * @param {Canvas} canvas
 * @param {Modeling} modeling
 */
export default function AlignToOrigin(injector, commandStack, canvas, modeling) {
  const config = { ...DEFAULT_OPTIONS };

  /**
   * Compute adjustment given the specified diagram origin.
   *
   * @param {Point} origin
   *
   * @return {Point} adjustment
   */
  function computeAdjustment(origin) {
    const { offset, tolerance } = config;

    const adjustment = {};

    ['x', 'y'].forEach((axis) => {
      let delta = -origin[axis] + offset[axis];

      const gridSnapping = injector.get('gridSnapping', false);

      if (gridSnapping) {
        delta = quantize(delta, gridSnapping.getGridSpacing());
      }

      adjustment[axis] = Math.abs(delta) < tolerance ? 0 : delta;
    });

    return adjustment;
  }

  /**
   * Align the diagram content to the origin.
   *
   * @param {Object} options
   */
  function align() {
    const bounds = canvas.viewbox().inner;
    const elements = canvas.getRootElement().children;

    if (!elements.length) {
      return;
    }

    const delta = computeAdjustment(bounds);
    if (delta.x === 0 && delta.y === 0) {
      return;
    }

    commandStack.execute('elements.alignToOrigin', {
      elements,
      delta
    });
  }

  // command registration

  /**
   * A command handler that compensates the element movement
   * by applying the inverse move operation on the canvas.
   */
  commandStack.register('elements.alignToOrigin', {
    preExecute: (context) => {
      const { delta, elements } = context;

      modeling.moveElements(elements, delta);
    }
  });

  // API

  this.align = align;
  this.computeAdjustment = computeAdjustment;

  // internal debugging purposes
  this._config = config;
}

AlignToOrigin.$inject = [
  'injector',
  'commandStack',
  'canvas',
  'modeling'
];

// helpers /////////////////////////

function quantize(value, quantum) {
  return Math.round(value / quantum) * quantum;
}
