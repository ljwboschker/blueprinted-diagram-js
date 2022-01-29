import { createDiagramEvent } from '../create-diagram-event';

export function findBlueprint(blueprint, element) {
  const blueprintType = typeof element === 'string' ? element : element.blueprint;
  return blueprint.elements.find((e) => e.type === blueprintType);
}

export function findConnectionRule(blueprint, source) {
  const blueprintElement = findBlueprint(blueprint, source);
  return blueprintElement?.rules?.connections;
}

export function createConnection(blueprint, source, target) {
  const rule = findConnectionRule(blueprint, source);
  return rule?.connect(createDiagramEvent(source), createDiagramEvent(target));
}
