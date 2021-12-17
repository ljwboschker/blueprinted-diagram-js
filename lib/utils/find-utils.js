export function findBlueprint(blueprint, element) {
    const blueprintType = typeof element === 'string' ? element : element.blueprint;
    return blueprint.elements.find(e => e.type === blueprintType);    
}

export function findConnectionRule(blueprint, source, target) {
  const blueprintElement = findBlueprint(blueprint, source);
  return blueprintElement.rules?.connect?.find(c => c.to === target.blueprint);
}
