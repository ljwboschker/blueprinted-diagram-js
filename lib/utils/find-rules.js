export function findConnectionRule(source, target) {
  return source.rules?.connect?.find(c => c.to === target.type);
}
