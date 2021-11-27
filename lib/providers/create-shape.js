export function createShape(elementFactory, element) {
  return elementFactory.createShape({ type: element.type, rules: { ...element.rules }, ...element.shape });
}
