export function findBlueprint(blueprint, element) {
  const blueprintType = typeof element === 'string' ? element : element.blueprint;
  return blueprint.elements.find((e) => e.type === blueprintType);
}

export function findConnectionRule(blueprint, source) {
  const blueprintElement = findBlueprint(blueprint, source);
  return blueprintElement?.rules?.connections;
}
