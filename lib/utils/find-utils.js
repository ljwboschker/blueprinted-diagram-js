export function findBlueprint(blueprint, element) {
    const type = typeof element === 'string' ? element : element.type;
    return blueprint.elements.find(e => e.type === type);    
}

export function findConnectionRule(blueprint, source, target) {
  const blueprintElement = findBlueprint(blueprint, source);
  return blueprintElement.rules?.connect?.find(c => c.to === target.type);
}
