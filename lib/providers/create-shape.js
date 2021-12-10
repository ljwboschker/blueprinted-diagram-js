export function createShape(elementFactory, element) {
  return elementFactory.createShape({
    type: element.type, 
    width: element.shape.width,
    height: element.shape.height,
  });
}
