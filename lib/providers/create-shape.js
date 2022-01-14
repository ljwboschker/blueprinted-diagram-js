export function createShape(elementFactory, blueprint) {
  const data = blueprint.shape.data ? blueprint.shape.data() : undefined;

  return elementFactory.createShape({
    type: 'shape',
    blueprint: blueprint.type,
    data,
    width: blueprint.shape.width,
    height: blueprint.shape.height
  });
}
