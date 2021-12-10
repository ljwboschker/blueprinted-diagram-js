export function findConnectionRule(blueprint, source, target) {
  const blueprintElement = blueprint.elements.find(e => e.type === source.type);
  return blueprintElement.rules?.connect?.find(c => c.to === target.type);
}
