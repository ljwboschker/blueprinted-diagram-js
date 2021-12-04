export function findConnectionRule(source, target) {
  return source.blueprint.rules?.connect?.find(c => c.to === target.type);
}
