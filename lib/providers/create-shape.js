export function createShape(elementFactory, blueprint) {
    return elementFactory.createShape({
        type: blueprint.type,
        width: blueprint.shape.width,
        height: blueprint.shape.height,
        data: blueprint.data
    });
}
