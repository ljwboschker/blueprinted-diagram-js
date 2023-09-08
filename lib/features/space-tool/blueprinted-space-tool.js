import SpaceTool from 'diagram-js/lib/features/space-tool/SpaceTool';

export default class BlueprintedSpaceTool extends SpaceTool {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    canvas,
    dragging,
    eventBus,
    modeling,
    rules,
    toolManager,
    mouse
  ) {
    super(canvas, dragging, eventBus, modeling, rules, toolManager, mouse);
  }

  calculateAdjustments(elements, axis, delta, start) {
    const adjustments = super.calculateAdjustments(elements, axis, delta, start);

    // On vertical movement, the connection labels are not filtered out...
    // Can't figure out why, so we'll filter it out here.
    adjustments.movingShapes = adjustments.movingShapes
      .filter((shape) => shape.type !== 'label' || shape.labelTarget.type !== 'connection');
    return adjustments;
  }
}
