export function createShape(elementFactory, blueprint, existingData) {
  const data = existingData || (blueprint.shape.data ? blueprint.shape.data() : undefined);

  return elementFactory.createShape({
    type: 'shape',
    blueprint: blueprint.type,
    data,
    width: blueprint.shape.width,
    height: blueprint.shape.height
  });
}
