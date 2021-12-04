export function createShape(elementFactory, element) {
  return elementFactory.createShape({
    type: element.type, 
    width: element.shape.width,
    height: element.shape.height,
    data: {},
    blueprint: {
      rules: element.rules,
      shape: element.shape
    }
  });
}
