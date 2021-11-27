import { deepClone } from './utils/deep-clone';

export function loadShapes(blueprint, elements, canvas, elementRegistry, elementFactory) {
  // diagram-js internally adds attached labels first.
  // However, when restoring we need the parent element to be present first.

  // TODO: How to handle IDs? 

  // So first we add all elements in the correct sequence
  elements
    .filter(item => item.element.type !== 'label')
    .forEach(item => {
      switch (item.element.type) {
        case 'connection': {
          const source = elementRegistry.get(item.sourceId);
          const target = elementRegistry.get(item.targetId);
          const connection = elementFactory.createConnection({ ...(deepClone(item.element)), source, target });
          const parent = elementRegistry.get(item.parentId);
          canvas.addConnection(connection, parent);
          break;
        }
        default:
          const elementType = blueprint.elements.find(e => e.type === item.element.type);

          const shape = elementFactory.createShape({ ...(deepClone(item.element)), svg: elementType.shape.svg });
          const parent = elementRegistry.get(item.parentId);
          canvas.addShape(shape, parent);
          break;
      }
    });

  // Finally, add labels so we can attached them to their targets
  elements
    .filter(item => item.element.type === 'label')
    .forEach(item => {
      const labelTarget = elementRegistry.get(item.labelTargetId);
      const label = elementFactory.createLabel({ ...(deepClone(item.element)), labelTarget });
      const parent = elementRegistry.get(item.parentId);
      canvas.addShape(label, parent);
    });
}
