import { createDiagramEvent } from '../create-diagram-event';

export function findBlueprint(blueprint, element) {
  const blueprintType = typeof element === 'string' ? element : element.blueprint;
  return blueprint.elements.find((e) => e.type === blueprintType);
}

export function findConnectionRule(blueprint, source, traget) {
  return undefined;
}

export function executeConnectionRule(blueprint, source, target) {
  if (!source || !source) return undefined;

  const blueprintElement = findBlueprint(blueprint, source);
  if (!blueprintElement) return undefined;

  const sourceEvent = createDiagramEvent(source);
  const targetEvent = createDiagramEvent(target);

  if (!sourceEvent || !targetEvent) return undefined;

  return blueprintElement?.rules?.connect(sourceEvent, targetEvent);
}
