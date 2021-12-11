export function createShape(elementFactory, blueprint) {
    const data = blueprint.initializeData ? blueprint.initializeData() : undefined;

    return elementFactory.createShape({
        type: blueprint.type,
        width: blueprint.shape.width,
        height: blueprint.shape.height,
        data
    });
}
